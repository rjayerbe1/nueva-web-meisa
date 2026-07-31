import { NextRequest, NextResponse } from "next/server"
import { timingSafeEqual } from "crypto"
import { prisma } from "@/lib/prisma"
import { uploadCv } from "@/lib/talento/gcs-hv"
import { analizarCvCandidato } from "@/lib/talento/ia"
import { normalizarNombre } from "@/lib/talento/nombres"
import {
  planificarImport,
  descargarArchivo,
  vincularArchivo,
  promoverDatosIA,
  fusionarSiDuplicado,
  espejarPendientes,
  limpiarNombreArchivo,
} from "@/lib/talento/drive-sync"

/**
 * Sincronización periódica entre la carpeta de hojas de vida de Talento Humano
 * en Drive y el banco de candidatos. La dispara Cloud Scheduler.
 *
 * Corre las DOS direcciones en cada ciclo:
 *   1. Drive → plataforma: importa lo que TH dejó en la carpeta.
 *   2. plataforma → Drive: espeja los CV que entraron por la web.
 *
 * Autenticación por secreto compartido (`TALENTO_SYNC_SECRET`) en el header
 * `x-sync-secret`. No usa sesión de admin porque quien llama es un job, no una
 * persona. Sin el secreto configurado la ruta responde 503: preferible que el
 * job falle ruidosamente a que quede un endpoint abierto que toca datos
 * personales.
 *
 * El trabajo va ACOTADO por ciclo (`LOTE`): Cloud Run corta requests largos y
 * cada CV implica descarga + subida + una llamada de IA. Lo que no alcance
 * queda para el siguiente ciclo, que es idempotente.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 300

const LOTE = Number(process.env.TALENTO_SYNC_LOTE ?? "8")

function secretoValido(req: NextRequest): boolean {
  const esperado = process.env.TALENTO_SYNC_SECRET
  if (!esperado) return false
  const recibido = req.headers.get("x-sync-secret") ?? ""
  const a = Buffer.from(recibido)
  const b = Buffer.from(esperado)
  // Comparación de tiempo constante; longitudes distintas nunca son iguales.
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(req: NextRequest) {
  if (!process.env.TALENTO_SYNC_SECRET) {
    return NextResponse.json(
      { error: "Sync no configurado (falta TALENTO_SYNC_SECRET)" },
      { status: 503 },
    )
  }
  if (!secretoValido(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const inicio = Date.now()
  const resumen = {
    creados: [] as string[],
    vinculados: [] as string[],
    espejados: [] as string[],
    // Los match solo por nombre NO se aplican automáticamente: fusionar dos
    // personas distintas es peor que dejar un duplicado. Se reportan para que
    // Talento Humano los resuelva desde el admin.
    porRevisar: [] as string[],
    sinArea: [] as string[],
    errores: [] as string[],
  }

  try {
    // ---- 1. Drive → plataforma ----
    const plan = await planificarImport()
    let procesados = 0

    for (const a of plan.acciones) {
      if (procesados >= LOTE) break

      if (a.tipo === "revisar") {
        resumen.porRevisar.push(`${a.archivo.name} ≈ ${a.match.nombre}`)
        continue
      }
      if (a.tipo === "sin-area") {
        resumen.sinArea.push(`${a.archivo.name} (${a.archivo.ruta || "raíz"})`)
        continue
      }
      if (a.tipo === "vincular") {
        await vincularArchivo(a.match.candidatoId, a.archivo.id, a.archivo.ruta)
        if (a.area) {
          await prisma.candidato.updateMany({
            where: { id: a.match.candidatoId, areaInteres: null },
            data: { areaInteres: a.area },
          })
        }
        resumen.vinculados.push(`${a.archivo.name} → ${a.match.nombre}`)
        procesados++
        continue
      }

      try {
        const buf = await descargarArchivo(a.archivo.id)
        const subido = await uploadCv(buf, a.archivo.name, a.archivo.mimeType)
        const candidato = await prisma.candidato.create({
          data: {
            nombre:
              normalizarNombre(limpiarNombreArchivo(a.archivo.name)) || a.archivo.name,
            areaInteres: a.area,
            origen: "drive",
            origenDetalle: `drive:${a.archivo.id}${a.archivo.ruta ? ` (${a.archivo.ruta})` : ""}`,
            cvPathGcs: subido.pathGcs,
            cvFileName: subido.fileName,
            cvContentType: subido.contentType,
            cvSize: subido.size,
            // Carpeta interna de TH: el consentimiento se recogió fuera de la web.
            consentimientoBanco: true,
            consentimientoVia: "entregado-a-th",
          },
        })
        procesados++

        // El análisis puede fallar (PDF ilegible, tope de gasto de IA) sin que
        // eso invalide la importación: el candidato ya quedó con su CV.
        let fusion: Awaited<ReturnType<typeof fusionarSiDuplicado>> | null = null
        try {
          await analizarCvCandidato(candidato.id)
          await promoverDatosIA(candidato.id)
          // El correo real recién se conoce ahora: puede revelar que esta
          // persona ya estaba en el banco bajo otro nombre de archivo.
          fusion = await fusionarSiDuplicado(candidato.id)
        } catch (e) {
          resumen.errores.push(`IA ${a.archivo.name}: ${(e as Error).message.slice(0, 80)}`)
        }

        if (fusion?.fusionado) {
          resumen.vinculados.push(`${a.archivo.name} → ${fusion.nombre} (era duplicado)`)
        } else {
          const final = await prisma.candidato.findUnique({
            where: { id: candidato.id },
            select: { nombre: true },
          })
          resumen.creados.push(`${final?.nombre ?? candidato.nombre} [${a.area ?? "sin área"}]`)
        }
      } catch (e) {
        resumen.errores.push(`${a.archivo.name}: ${(e as Error).message.slice(0, 100)}`)
      }
    }

    // ---- 2. plataforma → Drive ----
    const espejados = await espejarPendientes(LOTE)
    resumen.espejados = espejados.map((e) => `${e.nombre} → /${e.carpeta}`)

    const salida = {
      ok: true,
      segundos: Math.round((Date.now() - inicio) / 1000),
      cvEnDrive: plan.total,
      yaImportados: plan.yaImportados,
      pendientesTrasEsteCiclo: Math.max(0, plan.acciones.length - procesados),
      ...resumen,
    }
    console.log("[talento/sync-drive]", JSON.stringify(salida))
    return NextResponse.json(salida)
  } catch (e) {
    console.error("[talento/sync-drive] falló:", e)
    return NextResponse.json(
      { ok: false, error: (e as Error).message, ...resumen },
      { status: 500 },
    )
  }
}

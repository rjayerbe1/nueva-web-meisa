/**
 * Sincroniza la carpeta de hojas de vida de Talento Humano en Drive con el
 * banco de candidatos. Reemplaza a `importar-cvs-drive.ts`, que era de una
 * sola carpeta, pedía el área a mano y deduplicaba solo por fileId (por eso
 * duplicaba a quien ya había entrado por la web).
 *
 * Uso:
 *   npx tsx scripts/sync-drive-talento.ts --dry-run     # muestra el plan
 *   npx tsx scripts/sync-drive-talento.ts               # aplica
 *   npx tsx scripts/sync-drive-talento.ts --sin-ia      # sin análisis de CV
 *   npx tsx scripts/sync-drive-talento.ts --limite=5    # acota el lote
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env.local" })

function flag(n: string) {
  return process.argv.includes(`--${n}`)
}
function arg(n: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`))
  return hit ? hit.split("=").slice(1).join("=") : undefined
}

async function main() {
  const dryRun = flag("dry-run")
  const sinIA = flag("sin-ia")
  const limite = Number(arg("limite") ?? "0") || undefined
  // Los match "solo por nombre" NUNCA se aplican solos: un humano mira el
  // listado del dry-run y, si son la misma persona, vuelve a correr con esta
  // bandera. El job automático jamás la usa.
  const confirmarRevisiones = flag("confirmar-revisiones")
  // Crea también los CV cuya subcarpeta no mapea a ningún pool (área en null).
  const incluirSinArea = flag("incluir-sin-area")

  const { prisma } = await import("../lib/prisma")
  const { uploadCv } = await import("../lib/talento/gcs-hv")
  const { analizarCvCandidato } = await import("../lib/talento/ia")
  const { normalizarNombre } = await import("../lib/talento/nombres")
  const sync = await import("../lib/talento/drive-sync")

  console.log(`Carpeta raíz: ${sync.DRIVE_ROOT_TALENTO}`)
  const plan = await sync.planificarImport()

  const cuenta = (t: string) => plan.acciones.filter((a) => a.tipo === t).length
  console.log(
    `\n${plan.total} CV en Drive · ${plan.yaImportados} ya importados\n` +
      `  crear   : ${cuenta("crear")}\n` +
      `  vincular: ${cuenta("vincular")}   (ya están como persona, se les adjunta el archivo)\n` +
      `  revisar : ${cuenta("revisar")}    (match solo por nombre — decide un humano)\n` +
      `  sin área: ${cuenta("sin-area")}   (la subcarpeta no mapea a ningún pool)\n`,
  )

  for (const a of plan.acciones) {
    const ruta = a.archivo.ruta || "(raíz)"
    if (a.tipo === "vincular") {
      console.log(`  ↔ VINCULAR  ${a.archivo.name}  →  ${a.match.nombre} (por ${a.match.criterio})`)
    } else if (a.tipo === "revisar") {
      console.log(`  ？REVISAR   ${a.archivo.name}  ≈  ${a.match.nombre} (solo nombre)`)
    } else if (a.tipo === "sin-area") {
      console.log(`  ⚠ SIN ÁREA  ${a.archivo.name}  en ${ruta}`)
    } else {
      console.log(`  + CREAR     ${a.archivo.name}  [${a.area}]  ${ruta}`)
    }
  }

  if (dryRun) {
    console.log("\n(dry-run: no se escribió nada)")
    await prisma.$disconnect()
    return
  }

  let creados = 0
  let vinculados = 0
  let saltados = 0
  let procesados = 0

  for (const a of plan.acciones) {
    if (limite && procesados >= limite) break

    if (a.tipo === "revisar" && !confirmarRevisiones) {
      saltados++
      continue
    }

    if (a.tipo === "vincular" || a.tipo === "revisar") {
      await sync.vincularArchivo(a.match.candidatoId, a.archivo.id, a.archivo.ruta)
      // Si el candidato no tenía área (típico de los que entran por la web),
      // la subcarpeta de Drive se la aporta.
      if (a.area) {
        await prisma.candidato.updateMany({
          where: { id: a.match.candidatoId, areaInteres: null },
          data: { areaInteres: a.area },
        })
      }
      vinculados++
      procesados++
      console.log(`  ↔ vinculado: ${a.archivo.name} → ${a.match.nombre}`)
      continue
    }

    if (a.tipo === "sin-area" && !incluirSinArea) {
      saltados++
      continue
    }
    if (a.tipo !== "crear" && a.tipo !== "sin-area") {
      saltados++
      continue
    }

    try {
      const buf = await sync.descargarArchivo(a.archivo.id)
      const subido = await uploadCv(buf, a.archivo.name, a.archivo.mimeType)
      const candidato = await prisma.candidato.create({
        data: {
          nombre: normalizarNombre(sync.limpiarNombreArchivo(a.archivo.name)) || a.archivo.name,
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
      creados++
      procesados++
      console.log(`  + creado: ${candidato.nombre} [${a.area}]`)

      if (!sinIA) {
        try {
          await analizarCvCandidato(candidato.id)
          // Sin esto el registro queda con el nombre del archivo y sin correo.
          await sync.promoverDatosIA(candidato.id)
          const fusion = await sync.fusionarSiDuplicado(candidato.id)
          if (fusion.fusionado) {
            console.log(`      ↔ era duplicado de ${fusion.nombre} — fusionado`)
          } else {
            const act = await prisma.candidato.findUnique({
              where: { id: candidato.id },
              select: { nombre: true, email: true },
            })
            console.log(`      ✓ IA: ${act?.nombre} <${act?.email ?? "sin correo"}>`)
          }
        } catch (e) {
          console.error(`      ✗ IA falló: ${(e as Error).message.slice(0, 120)}`)
        }
      }
    } catch (e) {
      console.error(`  ✗ error con ${a.archivo.name}: ${(e as Error).message.slice(0, 160)}`)
    }
  }

  console.log(
    `\nResultado: ${creados} creados · ${vinculados} vinculados · ${saltados} sin tocar (revisar/sin-área)`,
  )
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("FALLO:", e)
  process.exit(1)
})

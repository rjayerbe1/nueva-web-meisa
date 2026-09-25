import { timingSafeEqual } from "node:crypto"
import path from "node:path"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { downloadCv } from "@/lib/talento/gcs-hv"

/**
 * Avisos por WhatsApp al jefe del área cuando entra una hoja de vida ya calificada.
 *
 * Quien llama es el bot de notificaciones de la VM `mcp-server`
 * (`seguimiento-wa-notifier`, ciclo `cicloTalentoAvisos`), no una persona. Esta
 * ruta solo EXPONE lo calificado; qué vacante va a quién, desde cuándo y qué ya
 * se mandó lo lleva el bot en Firestore (`seguimiento_config/talento_avisos`).
 * Así cambiar el destinatario no exige desplegar la web, y la web no necesita
 * permiso de escritura sobre el Firestore de producción-reportes.
 *
 *   GET ?vacante=Proyectista&dias=14  → postulaciones con puntaje, más recientes primero
 *   GET ?cv=<postulacionId>           → el archivo de la hoja de vida
 *
 * Solo aparecen postulaciones con `scoreIA`: la calificación la pone el ciclo
 * horario de `/api/talento/sync-drive`, así que el aviso sale después de ese
 * ciclo y nunca con la hoja de vida sin evaluar.
 *
 * Autenticación por secreto compartido (`TALENTO_AVISOS_SECRET`) en el header
 * `x-avisos-secret`. Sin el secreto configurado responde 503. Devuelve datos
 * personales (Ley 1581): no abrir esta ruta a nada que no sea el bot.
 */
export const dynamic = "force-dynamic"

function secretoValido(req: NextRequest): boolean {
  const esperado = process.env.TALENTO_AVISOS_SECRET
  if (!esperado) return false
  const recibido = req.headers.get("x-avisos-secret") ?? ""
  const a = Buffer.from(recibido)
  const b = Buffer.from(esperado)
  return a.length === b.length && timingSafeEqual(a, b)
}

function concepto(score: number | null): string {
  if (score == null) return "Sin evaluar"
  if (score >= 75) return "Recomendado"
  if (score >= 55) return "Considerar"
  return "No cumple perfil"
}

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

export async function GET(req: NextRequest) {
  if (!process.env.TALENTO_AVISOS_SECRET) {
    return NextResponse.json({ error: "Avisos no configurados (falta TALENTO_AVISOS_SECRET)" }, { status: 503 })
  }
  if (!secretoValido(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const sp = req.nextUrl.searchParams

  // ── el archivo de una hoja de vida ──
  const cvId = sp.get("cv")
  if (cvId) {
    const p = await prisma.postulacion.findUnique({
      where: { id: cvId },
      select: { candidato: { select: { cvPathGcs: true, cvFileName: true, cvContentType: true } } },
    })
    if (!p?.candidato.cvPathGcs) {
      return NextResponse.json({ error: "Sin hoja de vida" }, { status: 404 })
    }
    const buf = await downloadCv(p.candidato.cvPathGcs)
    const ext = path.extname(p.candidato.cvFileName ?? "").toLowerCase() || ".pdf"
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": p.candidato.cvContentType || CONTENT_TYPES[ext] || "application/octet-stream",
        "X-Cv-Extension": ext,
        "Cache-Control": "no-store",
      },
    })
  }

  // ── la lista de calificadas ──
  const vacante = (sp.get("vacante") ?? "").trim()
  if (!vacante) {
    return NextResponse.json({ error: "Falta ?vacante=" }, { status: 400 })
  }
  const dias = Math.min(60, Math.max(1, Number(sp.get("dias") ?? "14") || 14))
  const desde = new Date(Date.now() - dias * 86400e3)

  const ps = await prisma.postulacion.findMany({
    where: {
      vacante: { titulo: { equals: vacante, mode: "insensitive" } },
      scoreIA: { not: null },
      etapa: { not: "DESCARTADA" },
      createdAt: { gte: desde },
    },
    select: {
      id: true,
      createdAt: true,
      scoreIA: true,
      matchIA: true,
      vacante: { select: { titulo: true } },
      candidato: {
        select: { nombre: true, ciudad: true, telefono: true, email: true, cvPathGcs: true, datosIA: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  const items = ps.map((p) => {
    const m = (p.matchIA ?? {}) as { fortalezas?: string[]; brechas?: string[]; recomendacion?: string }
    const d = (p.candidato.datosIA ?? {}) as { anosExperiencia?: number }
    return {
      id: p.id,
      recibida: p.createdAt.toISOString(),
      vacante: p.vacante?.titulo ?? vacante,
      nombre: p.candidato.nombre,
      ciudad: p.candidato.ciudad,
      telefono: p.candidato.telefono,
      email: p.candidato.email,
      anosExperiencia: typeof d.anosExperiencia === "number" ? d.anosExperiencia : null,
      score: p.scoreIA,
      concepto: concepto(p.scoreIA),
      fortalezas: (m.fortalezas ?? []).slice(0, 3),
      brechas: (m.brechas ?? []).slice(0, 3),
      recomendacion: m.recomendacion ?? null,
      tieneCv: Boolean(p.candidato.cvPathGcs),
    }
  })

  return NextResponse.json({ vacante, desde: desde.toISOString(), items })
}

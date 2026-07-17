import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getClientIp, hashIp } from '@/lib/chat/security'
import { verificarRateLimit } from '@/lib/chat/ratelimit'
import { analizarPropuestaLead } from '@/lib/lead-analysis'
import { fetchAdjuntosAsAttachments, sendLeadAnalysisEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Genera el análisis IA de los adjuntos de un lead y envía el correo interno con
 * el reporte. Se ejecuta en su PROPIO request (lo dispara el cliente sin bloquear
 * el formulario) porque el análisis multimodal tarda ~10-20s y Cloud Run estrangula
 * la CPU fuera del request → no sirve como trabajo en segundo plano del server.
 *
 * Blindaje: rate limit por IP + el lead debe ser reciente y tener adjuntos + el
 * circuit breaker de gasto (dentro de analizarPropuestaLead) + dedup en memoria.
 */

const bodySchema = z.object({ id: z.string().min(8).max(64) })

// Dedup best-effort por instancia (evita reanalizar si el cliente reintenta).
const analizados = new Set<string>()

// Solo leads recientes: no reanalizar históricos.
const MAX_LEAD_AGE_MS = 60 * 60 * 1000

function buildEscala(
  valor: unknown,
  unidad: string | null | undefined,
): string | undefined {
  const n = valor != null ? Number(valor) : NaN
  const u = unidad === 'M2' ? 'm²' : unidad === 'TON' ? 'toneladas' : ''
  if (Number.isFinite(n) && u) return `${n} ${u}`
  if (unidad === 'NA') return 'sin definir'
  return undefined
}

export async function POST(req: NextRequest) {
  let id: string
  try {
    id = bodySchema.parse(await req.json()).id
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  // Rate limit por IP — el análisis es caro, pocas llamadas por minuto/día.
  const clave = 'analyze:' + hashIp(getClientIp(req))
  const rl = await verificarRateLimit(clave, 6, 60)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, motivo: rl.motivo }, { status: 429 })
  }

  if (analizados.has(id)) return NextResponse.json({ ok: true, dedup: true })

  const lead = await prisma.contactForm.findUnique({ where: { id } })
  if (!lead) return NextResponse.json({ ok: false }, { status: 404 })

  const edadMs = Date.now() - new Date(lead.createdAt).getTime()
  if (edadMs > MAX_LEAD_AGE_MS) {
    return NextResponse.json({ ok: true, skip: 'antiguo' })
  }

  const adjuntos = Array.isArray(lead.adjuntos)
    ? (lead.adjuntos as Array<{ name: string; url: string; size?: number; mime?: string }>)
    : []
  if (adjuntos.length === 0) {
    return NextResponse.json({ ok: true, skip: 'sin_adjuntos' })
  }

  analizados.add(id)

  try {
    const archivos = await fetchAdjuntosAsAttachments(adjuntos)
    if (archivos.length === 0) {
      return NextResponse.json({ ok: true, skip: 'sin_descarga' })
    }

    const report = await analizarPropuestaLead({
      lead: {
        nombre: lead.nombre,
        empresa: lead.empresa,
        tipoProyecto: lead.tipoProyecto,
        etapa: lead.etapa,
        ciudad: lead.ciudad,
        escala: buildEscala(lead.escalaValor, lead.escalaUnidad),
        mensaje: lead.mensaje,
      },
      archivos: archivos.map((a) => ({
        filename: a.filename,
        mimeType: a.mimeType,
        content: a.content,
      })),
    })

    if (!report) return NextResponse.json({ ok: true, analizado: false })

    await sendLeadAnalysisEmail({
      contactId: lead.id,
      referencia: lead.referencia ?? `MEISA-${lead.id.slice(-6).toUpperCase()}`,
      nombre: lead.nombre,
      empresa: lead.empresa,
      email: lead.email,
      tipoProyecto: lead.tipoProyecto,
      report,
    })

    return NextResponse.json({ ok: true, analizado: true })
  } catch (err) {
    analizados.delete(id) // permitir reintento si algo falló
    console.error('[contact/analyze] error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

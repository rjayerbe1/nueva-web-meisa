import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIp, hashIp } from '@/lib/chat/security'

/**
 * Registro de clics en botones de WhatsApp (widget flotante + CTAs del sitio).
 * Se llama desde el cliente con navigator.sendBeacon justo antes de abrir wa.me,
 * así medimos el canal WhatsApp de primera mano (abrir wa.me no toca el backend).
 *
 * Es best-effort: nunca bloquea al usuario ni devuelve errores relevantes.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function limpiar(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null
  const s = v.trim().slice(0, max)
  return s || null
}

export async function POST(req: NextRequest) {
  try {
    // sendBeacon puede mandar el cuerpo como JSON o como texto plano.
    let data: Record<string, unknown> = {}
    const raw = await req.text().catch(() => '')
    if (raw) {
      try {
        data = JSON.parse(raw) as Record<string, unknown>
      } catch {
        data = {}
      }
    }

    await prisma.clickWhatsapp.create({
      data: {
        origen: limpiar(data.origen, 60),
        etiqueta: limpiar(data.etiqueta, 120),
        ipHash: hashIp(getClientIp(req)),
      },
    })
  } catch (e) {
    console.error('[track/whatsapp] error:', e)
  }
  // Siempre 204 rápido — el cliente no espera respuesta útil.
  return new NextResponse(null, { status: 204 })
}

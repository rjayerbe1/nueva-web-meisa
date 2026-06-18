import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { chatConfig } from '@/lib/chat/config'
import { getClientIp, hashIp } from '@/lib/chat/security'
import { verificarTurnstile } from '@/lib/chat/turnstile'
import { verificarRateLimit } from '@/lib/chat/ratelimit'
import { sendContactNotificationEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  sessionId: z.string().min(8).max(64),
  nombre: z.string().min(2).max(120),
  email: z.string().email().max(160),
  telefono: z.string().max(40).optional(),
  empresa: z.string().max(160).optional(),
  mensaje: z.string().max(2000).optional(),
  turnstileToken: z.string().optional(),
  // Honeypot anti-spam: invisible para humanos; si llega con valor, es un bot.
  website: z.string().optional(),
})

function buildReferencia(id: string): string {
  return `MEISA-${id.slice(-6).toUpperCase()}`
}

export async function POST(req: NextRequest) {
  if (!chatConfig.enabled) {
    return NextResponse.json({ success: false, message: 'No disponible' }, { status: 503 })
  }

  let data: z.infer<typeof schema>
  try {
    data = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ success: false, message: 'Datos inválidos' }, { status: 400 })
  }

  // Honeypot: bot → respondemos éxito falso sin crear nada.
  if (data.website && data.website.trim() !== '') {
    return NextResponse.json({ success: true, message: 'Recibido' })
  }

  const ip = getClientIp(req)
  const ipH = hashIp(ip)

  const turnstileOk = await verificarTurnstile(data.turnstileToken, ip)
  if (!turnstileOk) {
    return NextResponse.json(
      { success: false, message: 'Verificación de seguridad fallida.' },
      { status: 403 },
    )
  }

  const rl = await verificarRateLimit(`lead:${ipH}`)
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, message: 'Demasiados intentos. Intenta más tarde.' },
      { status: 429 },
    )
  }

  // Adjuntamos el contexto de la conversación para que el comercial sepa de qué hablaron.
  const conv = await prisma.chatConversacion.findUnique({
    where: { sessionId: data.sessionId },
    include: { mensajes: { orderBy: { createdAt: 'asc' }, take: 12 } },
  })

  const transcript =
    conv?.mensajes
      .map((m) => `${m.rol === 'user' ? 'Visitante' : 'Asistente'}: ${m.contenido}`)
      .join('\n') || ''

  const mensajeBase = data.mensaje?.trim()
    ? data.mensaje.trim()
    : 'Lead capturado desde el asistente comercial del sitio web.'
  const mensaje = transcript
    ? `${mensajeBase}\n\n--- Conversación con el asistente ---\n${transcript}`
    : mensajeBase

  const contact = await prisma.contactForm.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono || null,
      empresa: data.empresa || null,
      mensaje,
      origen: 'chatbot',
    },
  })

  const referencia = buildReferencia(contact.id)
  await prisma.contactForm.update({ where: { id: contact.id }, data: { referencia } })

  if (conv) {
    await prisma.chatConversacion
      .update({
        where: { id: conv.id },
        data: { leadCapturado: true, referenciaLead: referencia },
      })
      .catch(() => {})
  }

  // Notificación al equipo comercial — no fallar el request si el correo falla.
  try {
    await sendContactNotificationEmail({
      contactId: contact.id,
      referencia,
      nombre: data.nombre,
      empresa: data.empresa || null,
      email: data.email,
      telefono: data.telefono || '—',
      ciudad: '—',
      mensaje,
      origen: 'chatbot (asistente IA)',
    })
  } catch (e) {
    console.error('[chat/lead] email falló:', e)
  }

  return NextResponse.json({ success: true, referencia })
}

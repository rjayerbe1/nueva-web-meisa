import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { chatConfig } from '@/lib/chat/config'
import { getClientIp, hashIp } from '@/lib/chat/security'
import { verificarTurnstile } from '@/lib/chat/turnstile'
import { verificarRateLimit } from '@/lib/chat/ratelimit'
import { sendChatTranscriptEmail, sendContactNotificationEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  sessionId: z.string().min(8).max(64),
  email: z.string().email().max(160),
  // Habeas Data (Ley 1581/2012): autorización de tratamiento de datos, obligatoria.
  habeasData: z.literal(true),
  turnstileToken: z.string().optional(),
  // Honeypot anti-spam.
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

  if (data.website && data.website.trim() !== '') {
    return NextResponse.json({ success: true })
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

  // Límite propio y bajo (anti-spam a terceros): 2/min, 5/día por IP.
  const rl = await verificarRateLimit(`transcript:${ipH}`, 2, 5)
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, message: 'Demasiados envíos. Intenta más tarde.' },
      { status: 429 },
    )
  }

  const conv = await prisma.chatConversacion.findUnique({
    where: { sessionId: data.sessionId },
    include: { mensajes: { orderBy: { createdAt: 'asc' }, take: 30 } },
  })
  if (!conv || conv.mensajes.length === 0) {
    return NextResponse.json(
      { success: false, message: 'Aún no hay conversación para enviar.' },
      { status: 400 },
    )
  }

  const transcript = conv.mensajes
    .map((m) => `${m.rol === 'user' ? 'Tú' : 'Asistente'}: ${m.contenido}`)
    .join('\n\n')

  // 1) Enviar copia al visitante (no fallar el flujo de lead si el correo falla).
  let enviado = false
  try {
    await sendChatTranscriptEmail({
      to: data.email,
      transcript,
      referencia: conv.referenciaLead || undefined,
    })
    enviado = true
  } catch (e) {
    console.error('[chat/transcript] envío al visitante falló:', e)
  }

  // 2) Registrar como lead (si no estaba) + avisar al comercial.
  if (!conv.leadCapturado) {
    const mensajeLead = `El visitante solicitó copia de la conversación por correo (autorizó el tratamiento de datos, Ley 1581).\n\n--- Conversación ---\n${transcript}`
    const contact = await prisma.contactForm.create({
      data: {
        nombre: 'Visitante (copia de chat)',
        email: data.email,
        mensaje: mensajeLead,
        origen: 'chatbot',
      },
    })
    const ref = buildReferencia(contact.id)
    await prisma.contactForm.update({ where: { id: contact.id }, data: { referencia: ref } })
    await prisma.chatConversacion
      .update({ where: { id: conv.id }, data: { leadCapturado: true, referenciaLead: ref } })
      .catch(() => {})
    try {
      await sendContactNotificationEmail({
        contactId: contact.id,
        referencia: ref,
        nombre: 'Visitante (copia de chat)',
        email: data.email,
        telefono: '—',
        ciudad: '—',
        mensaje: mensajeLead,
        origen: 'chatbot (copia de conversación)',
      })
    } catch (e) {
      console.error('[chat/transcript] notificación al comercial falló:', e)
    }
  }

  if (!enviado) {
    return NextResponse.json(
      {
        success: false,
        message: 'No pudimos enviar el correo. Intenta de nuevo o escríbenos por WhatsApp.',
      },
      { status: 502 },
    )
  }

  return NextResponse.json({ success: true })
}

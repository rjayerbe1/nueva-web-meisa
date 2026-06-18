import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { chatConfig, MENSAJE_MANTENIMIENTO } from '@/lib/chat/config'
import { getClientIp, hashIp } from '@/lib/chat/security'
import { verificarTurnstile } from '@/lib/chat/turnstile'
import { verificarRateLimit } from '@/lib/chat/ratelimit'
import {
  presupuestoDisponible,
  registrarUso,
  estimarCostoUsd,
} from '@/lib/chat/budget'
import { construirSystemPrompt } from '@/lib/chat/knowledge'
import { generarRespuesta, type ChatTurn } from '@/lib/chat/gemini'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  sessionId: z.string().min(8).max(64),
  mensaje: z.string().min(1).max(4000),
  turnstileToken: z.string().optional(),
})

export async function POST(req: NextRequest) {
  // 0) Apagado global
  if (!chatConfig.enabled) {
    return NextResponse.json({ reply: MENSAJE_MANTENIMIENTO, disponible: false })
  }

  // 1) Validación de entrada
  let parsed: z.infer<typeof bodySchema>
  try {
    parsed = bodySchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const mensaje = parsed.mensaje.trim()
  if (!mensaje) {
    return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 })
  }
  if (mensaje.length > chatConfig.maxCaracteresMensaje) {
    return NextResponse.json({
      reply: `Por favor envía un mensaje más corto (máximo ${chatConfig.maxCaracteresMensaje} caracteres).`,
      disponible: true,
    })
  }

  const ip = getClientIp(req)
  const ipH = hashIp(ip)

  // 2) Anti-bot (Cloudflare Turnstile) — solo si está configurado
  const turnstileOk = await verificarTurnstile(parsed.turnstileToken, ip)
  if (!turnstileOk) {
    return NextResponse.json(
      { error: 'Verificación de seguridad fallida. Recarga la página e intenta de nuevo.' },
      { status: 403 },
    )
  }

  // 3) Rate limit por IP
  const rl = await verificarRateLimit(ipH)
  if (!rl.ok) {
    const reply =
      rl.motivo === 'rate_minuto'
        ? 'Vas muy rápido 🙂 Espera unos segundos antes de enviar otro mensaje.'
        : 'Has alcanzado el límite de mensajes por hoy. Escríbenos por WhatsApp o por el formulario de contacto y te ayudamos.'
    return NextResponse.json({ reply, disponible: true, limitado: true }, { status: 429 })
  }

  // 4) Circuit breaker de presupuesto (techo DURO de gasto)
  const pres = await presupuestoDisponible()
  if (!pres.ok) {
    return NextResponse.json({ reply: MENSAJE_MANTENIMIENTO, disponible: false })
  }

  // 5) Conversación (crear o recuperar) + límite de turnos
  let conv = await prisma.chatConversacion.findUnique({
    where: { sessionId: parsed.sessionId },
    include: {
      mensajes: { orderBy: { createdAt: 'asc' }, take: chatConfig.historialMaxMensajes },
    },
  })

  if (conv && conv.turnos >= chatConfig.maxTurnos) {
    return NextResponse.json({
      reply:
        'Esta conversación ya es bastante larga. Para seguir, escríbenos por WhatsApp o déjanos tus datos en el formulario de contacto y un asesor te atiende directamente.',
      disponible: true,
      finConversacion: true,
    })
  }

  if (!conv) {
    conv = await prisma.chatConversacion.create({
      data: {
        sessionId: parsed.sessionId,
        ipHash: ipH,
        userAgent: req.headers.get('user-agent')?.slice(0, 300) || null,
      },
      include: { mensajes: true },
    })
  }

  const historial: ChatTurn[] = conv.mensajes.map((m) => ({
    rol: m.rol === 'assistant' ? 'assistant' : 'user',
    contenido: m.contenido,
  }))

  // 6) Generar respuesta con el modelo
  const system = await construirSystemPrompt()
  let resultado
  try {
    resultado = await generarRespuesta({ system, historial, mensajeUsuario: mensaje })
  } catch (e) {
    console.error('[chat] error Vertex:', e)
    return NextResponse.json({ reply: MENSAJE_MANTENIMIENTO, disponible: false })
  }

  const respuesta =
    resultado.bloqueado || !resultado.texto
      ? 'Prefiero no responder eso. ¿Te ayudo con información sobre los servicios o proyectos de MEISA?'
      : resultado.texto

  // 7) Registrar gasto + persistir mensajes + actualizar contadores
  await registrarUso(resultado.tokensInput, resultado.tokensOutput)
  await prisma.$transaction([
    prisma.chatMensaje.create({
      data: { conversacionId: conv.id, rol: 'user', contenido: mensaje },
    }),
    prisma.chatMensaje.create({
      data: {
        conversacionId: conv.id,
        rol: 'assistant',
        contenido: respuesta,
        tokens: resultado.tokensOutput,
      },
    }),
    prisma.chatConversacion.update({
      where: { id: conv.id },
      data: {
        turnos: { increment: 1 },
        tokensInput: { increment: resultado.tokensInput },
        tokensOutput: { increment: resultado.tokensOutput },
        costoUsd: {
          increment: estimarCostoUsd(resultado.tokensInput, resultado.tokensOutput),
        },
      },
    }),
  ])

  return NextResponse.json({ reply: respuesta, disponible: true })
}

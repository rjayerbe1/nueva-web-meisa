import type Anthropic from '@anthropic-ai/sdk'
import { chatConfig } from './config'
import { estimarCostoUsd } from './budget'
import { streamRespuesta, type ChatTurn } from './gemini'
import { clasificarError, clienteClaude, ErrorClaude, usarClaude, usoDeMensaje } from '@/lib/ia/claude'

/**
 * Chat en streaming: Claude Haiku 5.5 primero, Gemini (Vertex) de respaldo.
 *
 * - Si Claude falla ANTES del primer texto (saldo, clave, 429, 5xx, timeout,
 *   refusal, respuesta vacía) se reintenta la misma pregunta con Gemini: el
 *   visitante no se entera.
 * - Si falla DESPUÉS de haber mandado texto, no se puede empezar otra respuesta
 *   encima: se cierra con un aviso corto y lo ya dicho queda como respuesta.
 *
 * A/B del 10-oct-2026 con 15 preguntas reales del chat: Haiku 5.5 respondió igual
 * de bien que Gemini 3.1 Flash-Lite, ~5x más barato (caché del system prompt) y con
 * el primer texto en ~0,7 s contra ~6 s.
 *
 * Variables: CHAT_PROVEEDOR=claude|gemini · CHAT_CLAUDE_MODEL (default claude-haiku-5-5).
 */

const MODELO_CLAUDE = process.env.CHAT_CLAUDE_MODEL || 'claude-haiku-5-5'
/** Sin primer texto en este plazo, se aborta Claude y responde Gemini. */
const PLAZO_PRIMER_TEXTO_MS = 12_000
const PLAZO_TOTAL_MS = Number(process.env.CHAT_CLAUDE_PLAZO_MS) || 45_000
/**
 * El tokenizador de Claude cuenta ~1,6x más tokens que Gemini para el mismo texto
 * en español (system prompt: 11.200 vs 6.850). Para que el tope de salida
 * signifique el mismo largo de respuesta, se escala.
 */
const FACTOR_TOKENS_CLAUDE = 1.5

export const AVISO_CORTE =
  '\n\n(Se cortó la respuesta. Si quieres, escríbenos por WhatsApp o en /contacto y te ayudamos.)'

export interface ResultadoChat {
  texto: string
  tokensInput: number
  tokensOutput: number
  costoUsd: number
  bloqueado: boolean
  proveedor: 'claude' | 'gemini'
  modelo: string
}

/** Un fallo de Claude con texto ya enviado al visitante. */
class CorteConTexto extends Error {
  constructor(public parcial: string, public causa: ErrorClaude) {
    super(causa.message)
  }
}

async function streamClaude(
  opts: { system: string; historial: ChatTurn[]; mensajeUsuario: string },
  onDelta: (delta: string) => void,
): Promise<ResultadoChat> {
  const messages: Anthropic.MessageParam[] = [
    ...opts.historial
      .filter((t) => t.contenido.trim())
      .map((t) => ({ role: t.rol, content: t.contenido }) as Anthropic.MessageParam),
    { role: 'user', content: opts.mensajeUsuario },
  ]
  // La API exige que el primer mensaje sea del usuario.
  while (messages.length > 1 && messages[0].role !== 'user') messages.shift()

  const ctrl = new AbortController()
  const tPrimer = setTimeout(() => ctrl.abort(), PLAZO_PRIMER_TEXTO_MS)
  const tTotal = setTimeout(() => ctrl.abort(), PLAZO_TOTAL_MS)
  let parcial = ''
  try {
    const stream = clienteClaude().messages.stream(
      {
        model: MODELO_CLAUDE,
        max_tokens: Math.round(chatConfig.maxOutputTokens * FACTOR_TOKENS_CLAUDE),
        // El system prompt (~11K tokens) es igual en cada mensaje: va en caché.
        system: [{ type: 'text', text: opts.system, cache_control: { type: 'ephemeral' } }],
        messages,
        // Chat corto: sin razonamiento, para responder rápido y barato.
        thinking: { type: 'disabled' },
        output_config: { effort: 'low' },
      },
      { signal: ctrl.signal },
    )
    stream.on('text', (delta) => {
      if (!parcial) clearTimeout(tPrimer)
      parcial += delta
      onDelta(delta)
    })
    const m = await stream.finalMessage()
    const uso = usoDeMensaje(MODELO_CLAUDE, m.usage)
    const texto = parcial.trim()
    if (m.stop_reason === 'refusal') {
      const err = new ErrorClaude('refusal', `refusal (${m.stop_details?.category ?? 'sin categoría'})`, uso)
      if (texto) throw new CorteConTexto(parcial, err)
      throw err
    }
    if (!texto) throw new ErrorClaude('respuesta_vacia', `respuesta vacía (stop=${m.stop_reason})`, uso)
    // max_tokens con texto: se entrega lo escrito, igual que hacía Gemini al cortar.
    return { texto, ...uso, bloqueado: false, proveedor: 'claude', modelo: MODELO_CLAUDE }
  } catch (err) {
    if (err instanceof CorteConTexto) throw err
    const e = clasificarError(err)
    if (parcial.trim()) throw new CorteConTexto(parcial, e)
    throw e
  } finally {
    clearTimeout(tPrimer)
    clearTimeout(tTotal)
  }
}

export async function streamRespuestaConCaida(
  opts: { system: string; historial: ChatTurn[]; mensajeUsuario: string },
  onDelta: (delta: string) => void,
): Promise<ResultadoChat> {
  let gastoClaude = 0
  if (usarClaude('CHAT_PROVEEDOR')) {
    try {
      return await streamClaude(opts, onDelta)
    } catch (err) {
      if (err instanceof CorteConTexto) {
        console.error(`[chat] Claude se cortó con texto ya enviado (${err.causa.motivo}); se cierra con aviso`)
        onDelta(AVISO_CORTE)
        // Sin `usage` del mensaje cortado: estimación conservadora (~3 caracteres por token).
        const tokensInput = Math.ceil((opts.system.length + opts.mensajeUsuario.length) / 3)
        const tokensOutput = Math.ceil(err.parcial.length / 3)
        return {
          texto: err.parcial.trim() + AVISO_CORTE,
          tokensInput,
          tokensOutput,
          costoUsd: err.causa.uso?.costoUsd ?? (tokensInput * 0.1 + tokensOutput * 0.5) / 1e6,
          bloqueado: false,
          proveedor: 'claude',
          modelo: MODELO_CLAUDE,
        }
      }
      const e = err as ErrorClaude
      gastoClaude = e.uso?.costoUsd ?? 0
      console.warn(`[chat] Claude falló antes del primer texto (${e.motivo}); responde Gemini`)
    }
  }
  const g = await streamRespuesta(opts, onDelta)
  return {
    ...g,
    costoUsd: estimarCostoUsd(g.tokensInput, g.tokensOutput, chatConfig.vertexModel) + gastoClaude,
    proveedor: 'gemini',
    modelo: chatConfig.vertexModel,
  }
}

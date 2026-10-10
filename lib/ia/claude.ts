import Anthropic from '@anthropic-ai/sdk'

/**
 * Proveedor Claude (API de Anthropic) con caída a Gemini (Vertex).
 *
 * Un solo punto para los tres usos de IA de la web (chatbot, análisis de
 * adjuntos de leads y Talento Humano). Cada uso sigue teniendo su llamada a
 * Gemini intacta: si Claude falla por CUALQUIER motivo (saldo, clave, 429, 5xx,
 * timeout, refusal, max_tokens, JSON inválido) el llamador corre Gemini.
 *
 * - Clave: ANTHROPIC_API_KEY (secreto de Secret Manager montado en Cloud Run).
 *   Se pasa explícita al cliente: nunca perfiles ni OAuth del entorno.
 * - Interruptor en memoria de la instancia: un error de SALDO o de CLAVE apaga
 *   Claude 6 h para no pagar la latencia de un fallo seguro en cada llamada.
 * - Variable por uso `<X>_PROVEEDOR=claude|gemini` (default claude si hay clave).
 */

const SEIS_HORAS_MS = 6 * 60 * 60 * 1000

let cliente: Anthropic | null = null
let claveCliente = ''
const interruptor = { hasta: 0, motivo: '' }

export type MotivoFallo =
  | 'saldo'
  | 'clave_401'
  | 'clave_403'
  | 'limite_429'
  | 'sobrecarga_529'
  | 'timeout'
  | 'conexion'
  | 'refusal'
  | 'max_tokens'
  | 'respuesta_vacia'
  | 'json_invalido'
  | string

export class ErrorClaude extends Error {
  motivo: MotivoFallo
  /** Lo que alcanzó a gastar la llamada fallida (refusal, max_tokens…): el tope de gasto debe contarlo. */
  uso?: UsoClaude
  constructor(motivo: MotivoFallo, mensaje: string, uso?: UsoClaude) {
    super(mensaje)
    this.name = 'ErrorClaude'
    this.motivo = motivo
    this.uso = uso
  }
}

function clave(): string {
  return (process.env.ANTHROPIC_API_KEY || '').trim()
}

export function clienteClaude(): Anthropic {
  const k = clave()
  if (!cliente || claveCliente !== k) {
    cliente = new Anthropic({ apiKey: k, maxRetries: 1 })
    claveCliente = k
  }
  return cliente
}

function abrirInterruptor(motivo: string) {
  interruptor.hasta = Date.now() + SEIS_HORAS_MS
  interruptor.motivo = motivo
  console.error(
    `[claude] interruptor ABIERTO 6 h por ${motivo}: esta instancia usa Gemini hasta ${new Date(interruptor.hasta).toISOString()}`,
  )
}

/** ¿Esta llamada va por Claude o directo a Gemini? */
export function usarClaude(variable: string): boolean {
  const pedido = (process.env[variable] || '').trim().toLowerCase()
  if (pedido === 'gemini') return false
  if (!clave()) return false
  return Date.now() >= interruptor.hasta
}

/** Traduce un error del SDK a ErrorClaude con un motivo estable (y abre el interruptor si toca). */
export function clasificarError(err: unknown): ErrorClaude {
  if (err instanceof ErrorClaude) return err
  const e = err as { status?: number; message?: string }
  const status = e?.status
  const msg = String(e?.message || err)
  let motivo: MotivoFallo
  if (err instanceof Anthropic.APIUserAbortError) motivo = 'timeout'
  else if (err instanceof Anthropic.APIConnectionTimeoutError) motivo = 'timeout'
  else if (err instanceof Anthropic.APIConnectionError) motivo = 'conexion'
  else if ((status === 400 && /credit balance/i.test(msg)) || status === 402) motivo = 'saldo'
  else if (status === 401) motivo = 'clave_401'
  else if (status === 403) motivo = 'clave_403'
  else if (status === 429) motivo = 'limite_429'
  else if (status === 529) motivo = 'sobrecarga_529'
  else if (status && status >= 500) motivo = `servidor_${status}`
  else if (status) motivo = `http_${status}`
  else motivo = 'error_inesperado'
  if (motivo === 'saldo' || motivo === 'clave_401' || motivo === 'clave_403') abrirInterruptor(motivo)
  return new ErrorClaude(motivo, `${motivo}: ${msg.slice(0, 300)}`)
}

/* ── Precios (USD por 1M tokens) ───────────────────────────────────────── */

const PRECIOS: Record<string, { entrada: number; salida: number }> = {
  'claude-haiku-5-5': { entrada: 0.1, salida: 0.5 },
  'claude-sonnet-5-5': { entrada: 2, salida: 10 },
  'claude-opus-5-5': { entrada: 4, salida: 20 },
}

export interface UsoClaude {
  /** Entrada total (sin caché + escrita en caché + leída de caché). */
  tokensInput: number
  tokensOutput: number
  costoUsd: number
}

/** Costo real de un mensaje de Claude: escritura de caché 1,25x y lectura 0,1x. */
export function usoDeMensaje(modelo: string, u: Anthropic.Usage): UsoClaude {
  const p = PRECIOS[modelo] ?? PRECIOS['claude-sonnet-5-5']
  const sinCache = u.input_tokens || 0
  const escrita = u.cache_creation_input_tokens || 0
  const leida = u.cache_read_input_tokens || 0
  const tokensInput = sinCache + escrita + leida
  const tokensOutput = u.output_tokens || 0
  // Haiku 5.5 cobra 5x por encima de 100K tokens de prompt.
  const factor = modelo.startsWith('claude-haiku') && tokensInput > 100_000 ? 5 : 1
  const costoUsd =
    ((sinCache + 1.25 * escrita + 0.1 * leida) * p.entrada * factor + tokensOutput * p.salida * factor) / 1e6
  return { tokensInput, tokensOutput, costoUsd }
}

/* ── Bloques de contenido ──────────────────────────────────────────────── */

const IMAGEN_CLAUDE = /^image\/(png|jpe?g|webp|gif)$/i

/** Bloque `document` (PDF) o `image` para un archivo en base64; null si Claude no lo lee. */
export function bloqueArchivo(
  base64: string,
  mimeType: string,
): Anthropic.ContentBlockParam | null {
  const mime = (mimeType || '').toLowerCase()
  if (mime === 'application/pdf') {
    return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
  }
  if (IMAGEN_CLAUDE.test(mime)) {
    const media = mime.replace('image/jpg', 'image/jpeg') as 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'
    return { type: 'image', source: { type: 'base64', media_type: media, data: base64 } }
  }
  return null
}

/* ── Llamada completa (no chat) ────────────────────────────────────────── */

export interface ResultadoClaude {
  texto: string
  modelo: string
  uso: UsoClaude
}

/**
 * Llama a Claude (streaming + finalMessage, para no chocar con timeouts HTTP) y
 * valida stop_reason. Lanza ErrorClaude ante cualquier falla → el llamador cae a Gemini.
 */
export async function llamarClaude(o: {
  modelo: string
  system: string
  contenido: Anthropic.ContentBlockParam[] | string
  effort?: 'low' | 'medium' | 'high'
  maxTokens?: number
  timeoutMs?: number
  /** JSON Schema → salida estructurada (output_config.format). */
  esquema?: Record<string, unknown>
  etiqueta?: string
}): Promise<ResultadoClaude> {
  const t0 = Date.now()
  const timeoutMs = o.timeoutMs ?? 120_000
  let m: Anthropic.Message
  try {
    const stream = clienteClaude().messages.stream(
      {
        model: o.modelo,
        max_tokens: o.maxTokens ?? 8000,
        system: o.system,
        messages: [{ role: 'user', content: o.contenido }],
        output_config: {
          effort: o.effort ?? 'low',
          ...(o.esquema ? { format: { type: 'json_schema', schema: o.esquema } } : {}),
        },
      },
      { timeout: timeoutMs },
    )
    m = await stream.finalMessage()
  } catch (err) {
    throw clasificarError(err)
  }
  const uso = usoDeMensaje(o.modelo, m.usage)
  console.log(
    `${o.etiqueta ?? '[claude]'} ${o.modelo}: stop=${m.stop_reason} in=${uso.tokensInput} out=${uso.tokensOutput} ${Date.now() - t0}ms ~US$${uso.costoUsd.toFixed(4)}`,
  )
  if (m.stop_reason === 'refusal') {
    throw new ErrorClaude('refusal', `refusal (${m.stop_details?.category ?? 'sin categoría'})`, uso)
  }
  if (m.stop_reason === 'max_tokens') throw new ErrorClaude('max_tokens', `max_tokens (${o.maxTokens ?? 8000})`, uso)
  const texto = m.content
    .map((b) => (b.type === 'text' ? b.text : ''))
    .join('')
    .trim()
  if (!texto) throw new ErrorClaude('respuesta_vacia', `respuesta vacía (stop=${m.stop_reason})`, uso)
  return { texto, modelo: o.modelo, uso }
}

/**
 * Configuración central del asistente comercial IA.
 *
 * TODO viene de variables de entorno para poder ajustar límites y topes
 * SIN redeploy de código (las lee en cada request). El circuit breaker
 * (topeUsdDia / topeUsdMes) es el seguro duro contra un "cuentón".
 */

function num(envVal: string | undefined, fallback: number): number {
  const n = envVal ? Number(envVal) : NaN
  return Number.isFinite(n) ? n : fallback
}

export const chatConfig = {
  // Apaga el chat por completo desde el servidor sin tocar código.
  enabled: process.env.CHAT_ENABLED !== 'false',

  // --- Modelo (intercambiable) — Gemini vía Vertex AI ---
  gcpProject: process.env.GCP_PROJECT_ID || '',
  vertexLocation: process.env.VERTEX_LOCATION || 'global',
  // OJO: confirmar el ID exacto del modelo en Vertex AI y ajustarlo aquí o por env.
  // 3.1 Flash-Lite es preview; si falla, usar un GA como "gemini-2.5-flash-lite".
  vertexModel: process.env.VERTEX_MODEL || 'gemini-3.1-flash-lite-preview',

  // --- Precios por 1M tokens (USD). Default = Gemini 3.1 Flash-Lite ---
  precioInputPor1M: num(process.env.CHAT_PRICE_INPUT, 0.25),
  precioOutputPor1M: num(process.env.CHAT_PRICE_OUTPUT, 1.5),

  // --- Circuit breaker (tope DURO de gasto). Si se alcanza, NO se llama al modelo ---
  topeUsdDia: num(process.env.CHAT_DAILY_CAP_USD, 1.5),
  topeUsdMes: num(process.env.CHAT_MONTHLY_CAP_USD, 10),

  // --- Límites por conversación (acotan el daño de un solo usuario) ---
  maxTurnos: num(process.env.CHAT_MAX_TURNOS, 15),
  maxCaracteresMensaje: num(process.env.CHAT_MAX_CHARS, 1000),
  maxOutputTokens: num(process.env.CHAT_MAX_OUTPUT_TOKENS, 600),
  historialMaxMensajes: num(process.env.CHAT_HISTORIAL_MAX, 16),

  // --- Rate limit por IP ---
  rateMaxPorMinuto: num(process.env.CHAT_RATE_MIN, 5),
  rateMaxPorDia: num(process.env.CHAT_RATE_DIA, 40),

  // --- Cloudflare Turnstile (anti-bot). Si el secreto está vacío, no se exige (dev) ---
  turnstileSecret: process.env.TURNSTILE_SECRET || '',
}

export const MENSAJE_MANTENIMIENTO =
  'En este momento el asistente no está disponible. Por favor escríbenos por WhatsApp o déjanos tu mensaje en la página de contacto y te responderemos muy pronto.'

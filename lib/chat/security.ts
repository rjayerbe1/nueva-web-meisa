import { createHash } from 'crypto'

/**
 * Hash irreversible de la IP (no guardamos IPs en claro — privacidad + GDPR-friendly).
 * Sirve como clave estable para rate limiting y para detectar abuso sin exponer datos.
 */
export function hashIp(ip: string): string {
  const salt = process.env.CHAT_IP_SALT || 'meisa-chat-salt'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

/** Extrae la IP del cliente detrás de Cloudflare / Cloud Run. */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') || ''
  const first = xff.split(',')[0]?.trim()
  return first || req.headers.get('x-real-ip') || 'desconocida'
}

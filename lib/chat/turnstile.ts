import { chatConfig } from './config'

/**
 * Verifica el token de Cloudflare Turnstile (anti-bot) en el servidor.
 * Si TURNSTILE_SECRET no está configurado, NO se exige (modo dev): retorna true.
 */
export async function verificarTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  if (!chatConfig.turnstileSecret) return true
  if (!token) return false
  try {
    const resp = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: chatConfig.turnstileSecret,
          response: token,
          remoteip: ip,
        }),
      },
    )
    const data = (await resp.json()) as { success?: boolean }
    return data?.success === true
  } catch {
    return false
  }
}

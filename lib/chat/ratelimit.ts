import { prisma } from '@/lib/prisma'
import { chatConfig } from './config'

/**
 * Rate limiting por clave (hash de IP) con ventanas fijas de 1 minuto y 1 día,
 * persistido en Postgres (sobrevive reinicios de Cloud Run).
 */
export async function verificarRateLimit(
  clave: string,
): Promise<{ ok: boolean; motivo?: 'rate_minuto' | 'rate_dia' }> {
  const ahora = new Date()
  const row = await prisma.chatRateLimit.findUnique({ where: { clave } })

  if (!row) {
    await prisma.chatRateLimit.create({
      data: { clave, minuteStart: ahora, minuteCount: 1, dayStart: ahora, dayCount: 1 },
    })
    return { ok: true }
  }

  const resetMinuto = ahora.getTime() - row.minuteStart.getTime() >= 60_000
  const resetDia = ahora.getTime() - row.dayStart.getTime() >= 86_400_000

  const minuteCount = resetMinuto ? 0 : row.minuteCount
  const dayCount = resetDia ? 0 : row.dayCount

  if (minuteCount >= chatConfig.rateMaxPorMinuto) return { ok: false, motivo: 'rate_minuto' }
  if (dayCount >= chatConfig.rateMaxPorDia) return { ok: false, motivo: 'rate_dia' }

  await prisma.chatRateLimit.update({
    where: { clave },
    data: {
      minuteStart: resetMinuto ? ahora : row.minuteStart,
      minuteCount: minuteCount + 1,
      dayStart: resetDia ? ahora : row.dayStart,
      dayCount: dayCount + 1,
    },
  })
  return { ok: true }
}

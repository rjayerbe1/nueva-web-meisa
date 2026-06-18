import { prisma } from '@/lib/prisma'
import { chatConfig } from './config'

/** Fecha/mes en zona America/Bogota (UTC-5, sin horario de verano). */
function fechaBogota(d = new Date()): { fecha: string; mes: string } {
  const bogota = new Date(d.getTime() - 5 * 60 * 60 * 1000)
  const fecha = bogota.toISOString().slice(0, 10) // YYYY-MM-DD
  const mes = fecha.slice(0, 7) // YYYY-MM
  return { fecha, mes }
}

/** Costo estimado en USD de una llamada según tokens y precios configurados. */
export function estimarCostoUsd(tokensInput: number, tokensOutput: number): number {
  return (
    (tokensInput / 1_000_000) * chatConfig.precioInputPor1M +
    (tokensOutput / 1_000_000) * chatConfig.precioOutputPor1M
  )
}

/**
 * CIRCUIT BREAKER. Se llama ANTES de invocar al modelo.
 * Si el gasto del día o del mes ya alcanzó el tope, devuelve ok:false y
 * el route NO llama al modelo → es imposible pasarse del tope (techo duro).
 */
export async function presupuestoDisponible(): Promise<{
  ok: boolean
  motivo?: 'tope_dia' | 'tope_mes'
}> {
  const { fecha, mes } = fechaBogota()
  const [hoy, mesAgg] = await Promise.all([
    prisma.chatUso.findUnique({ where: { fecha } }),
    prisma.chatUso.aggregate({ where: { mes }, _sum: { costoUsd: true } }),
  ])
  const costoDia = hoy?.costoUsd ?? 0
  const costoMes = mesAgg._sum.costoUsd ?? 0
  if (costoDia >= chatConfig.topeUsdDia) return { ok: false, motivo: 'tope_dia' }
  if (costoMes >= chatConfig.topeUsdMes) return { ok: false, motivo: 'tope_mes' }
  return { ok: true }
}

/** Acumula el gasto del día (y por ende del mes) tras cada llamada al modelo. */
export async function registrarUso(
  tokensInput: number,
  tokensOutput: number,
): Promise<void> {
  const { fecha, mes } = fechaBogota()
  const costo = estimarCostoUsd(tokensInput, tokensOutput)
  await prisma.chatUso.upsert({
    where: { fecha },
    create: { fecha, mes, tokensInput, tokensOutput, costoUsd: costo, requests: 1 },
    update: {
      tokensInput: { increment: tokensInput },
      tokensOutput: { increment: tokensOutput },
      costoUsd: { increment: costo },
      requests: { increment: 1 },
    },
  })
}

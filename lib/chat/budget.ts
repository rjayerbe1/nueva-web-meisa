import { prisma } from '@/lib/prisma'
import { chatConfig } from './config'

/** Fecha/mes en zona America/Bogota (UTC-5, sin horario de verano). */
function fechaBogota(d = new Date()): { fecha: string; mes: string } {
  const bogota = new Date(d.getTime() - 5 * 60 * 60 * 1000)
  const fecha = bogota.toISOString().slice(0, 10) // YYYY-MM-DD
  const mes = fecha.slice(0, 7) // YYYY-MM
  return { fecha, mes }
}

/**
 * Precios de los modelos de GEMINI (USD por 1M tokens). Los de Claude no van
 * aquí: su costo sale exacto de `usoDeMensaje()` (lib/ia/claude.ts, con caché)
 * y se pasa ya calculado a `registrarUso`.
 */
const PRECIOS_GEMINI: Record<string, { entrada: number; salida: number }> = {
  'gemini-3.1-flash-lite': { entrada: 0.25, salida: 1.5 },
  'gemini-2.5-flash': { entrada: 0.3, salida: 2.5 },
  'gemini-2.5-flash-lite': { entrada: 0.1, salida: 0.4 },
}

/**
 * Costo estimado en USD de una llamada a Gemini. Sin `modelo` (o con el modelo
 * del chat) usa los precios configurables por env (CHAT_PRICE_*).
 */
export function estimarCostoUsd(
  tokensInput: number,
  tokensOutput: number,
  modelo?: string,
): number {
  const p =
    modelo && modelo !== chatConfig.vertexModel && PRECIOS_GEMINI[modelo]
      ? PRECIOS_GEMINI[modelo]
      : { entrada: chatConfig.precioInputPor1M, salida: chatConfig.precioOutputPor1M }
  return (tokensInput / 1_000_000) * p.entrada + (tokensOutput / 1_000_000) * p.salida
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

/**
 * Acumula el gasto del día (y por ende del mes) tras cada llamada al modelo.
 * Un solo tope para Gemini y Claude: con Claude se pasa `costoUsd` ya calculado
 * (incluye caché); con Gemini se estima por el `modelo` de la llamada.
 */
export async function registrarUso(
  tokensInput: number,
  tokensOutput: number,
  opts: { modelo?: string; costoUsd?: number } = {},
): Promise<void> {
  const { fecha, mes } = fechaBogota()
  const costo = opts.costoUsd ?? estimarCostoUsd(tokensInput, tokensOutput, opts.modelo)
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

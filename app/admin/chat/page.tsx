import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { chatConfig } from '@/lib/chat/config'
import { cn } from '@/lib/utils'
import { Bot, DollarSign, MessagesSquare, UserPlus, ArrowUpRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

const FECHA_FMT = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function fechaBogota(): { fecha: string; mes: string; inicioDiaUtc: Date } {
  const bogota = new Date(Date.now() - 5 * 60 * 60 * 1000)
  const fecha = bogota.toISOString().slice(0, 10)
  return { fecha, mes: fecha.slice(0, 7), inicioDiaUtc: new Date(`${fecha}T05:00:00.000Z`) }
}

function usd(n: number): string {
  if (n > 0 && n < 0.01) return `US$${n.toFixed(4)}`
  return `US$${n.toFixed(2)}`
}

async function getData() {
  const { fecha, mes, inicioDiaUtc } = fechaBogota()
  const [usoHoy, usoMes, convTotal, convHoy, mensajesTotal, leads, recientes] = await Promise.all([
    prisma.chatUso.findUnique({ where: { fecha } }).catch(() => null),
    prisma.chatUso
      .aggregate({ where: { mes }, _sum: { costoUsd: true, requests: true, tokensInput: true, tokensOutput: true } })
      .catch(() => null),
    prisma.chatConversacion.count().catch(() => 0),
    prisma.chatConversacion.count({ where: { createdAt: { gte: inicioDiaUtc } } }).catch(() => 0),
    prisma.chatMensaje.count().catch(() => 0),
    prisma.chatConversacion.count({ where: { leadCapturado: true } }).catch(() => 0),
    prisma.chatConversacion
      .findMany({
        take: 12,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          createdAt: true,
          turnos: true,
          costoUsd: true,
          leadCapturado: true,
          referenciaLead: true,
        },
      })
      .catch(() => []),
  ])

  return {
    costoDia: usoHoy?.costoUsd ?? 0,
    requestsDia: usoHoy?.requests ?? 0,
    costoMes: usoMes?._sum.costoUsd ?? 0,
    requestsMes: usoMes?._sum.requests ?? 0,
    tokensMes: (usoMes?._sum.tokensInput ?? 0) + (usoMes?._sum.tokensOutput ?? 0),
    convTotal,
    convHoy,
    mensajesTotal,
    leads,
    recientes,
  }
}

export default async function AdminChatDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')
  if (session.user.role === UserRole.VIEWER) redirect('/')

  const d = await getData()
  const pctMes = chatConfig.topeUsdMes > 0 ? Math.min(100, (d.costoMes / chatConfig.topeUsdMes) * 100) : 0
  const pctDia = chatConfig.topeUsdDia > 0 ? Math.min(100, (d.costoDia / chatConfig.topeUsdDia) * 100) : 0
  const activo = chatConfig.enabled && !!chatConfig.gcpProject

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="border-b border-slate-200 pb-6">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Asistente comercial
        </p>
        <h1 className="flex items-center gap-3 font-bebas text-4xl uppercase leading-[0.95] text-slate-950 md:text-5xl">
          <Bot className="h-8 w-8 text-slate-400" /> Chatbot IA
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-lato text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className={cn('h-2 w-2 rounded-full', activo ? 'bg-green-500' : 'bg-slate-300')} />
            {activo ? 'Activo' : 'Inactivo (configura GCP_PROJECT_ID y enciéndelo)'}
          </span>
          <span>Modelo: <span className="font-semibold text-slate-700">{chatConfig.vertexModel}</span></span>
          <span>Tope: {usd(chatConfig.topeUsdDia)}/día · {usd(chatConfig.topeUsdMes)}/mes</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi
          label="Gasto hoy"
          value={usd(d.costoDia)}
          sub={`${d.requestsDia} solicitudes`}
          icon={<DollarSign className="h-4 w-4" />}
          highlight={pctDia >= 80}
        />
        <Kpi
          label="Gasto del mes"
          value={usd(d.costoMes)}
          sub={`${d.requestsMes} solicitudes · ${d.tokensMes.toLocaleString('es-CO')} tokens`}
          icon={<DollarSign className="h-4 w-4" />}
          highlight={pctMes >= 80}
        />
        <Kpi
          label="Conversaciones"
          value={String(d.convTotal)}
          sub={`${d.convHoy} hoy · ${d.mensajesTotal} mensajes`}
          icon={<MessagesSquare className="h-4 w-4" />}
        />
        <Kpi
          label="Leads capturados"
          value={String(d.leads)}
          sub="Ver en Mensajes →"
          icon={<UserPlus className="h-4 w-4" />}
          href="/admin/messages"
          highlight={d.leads > 0}
        />
      </div>

      {/* Barras de presupuesto (circuit breaker) */}
      <div className="grid gap-4 md:grid-cols-2">
        <BudgetBar
          label="Presupuesto del día"
          pct={pctDia}
          detail={`${usd(d.costoDia)} de ${usd(chatConfig.topeUsdDia)}`}
        />
        <BudgetBar
          label="Presupuesto del mes"
          pct={pctMes}
          detail={`${usd(d.costoMes)} de ${usd(chatConfig.topeUsdMes)}`}
        />
      </div>
      <p className="-mt-4 font-lato text-xs text-slate-400">
        Si una barra llega al 100%, el circuit breaker apaga el modelo automáticamente
        (el chat responde &ldquo;en mantenimiento&rdquo;) hasta el siguiente período.
      </p>

      {/* Conversaciones recientes */}
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="font-bebas text-base uppercase tracking-wide text-slate-950">
            Conversaciones recientes
          </h3>
          <Link
            href="/admin/messages"
            className="flex items-center gap-1 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 transition-colors hover:text-red-600"
          >
            Ver leads <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {d.recientes.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {d.recientes.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                <div
                  className={cn(
                    'h-2 w-2 flex-shrink-0 rounded-full',
                    c.leadCapturado ? 'bg-green-500' : 'bg-slate-300',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-lato text-sm font-semibold text-slate-900">
                    {c.turnos} {c.turnos === 1 ? 'mensaje' : 'mensajes'}
                    {c.leadCapturado && (
                      <span className="ml-2 rounded-none border border-green-200 bg-green-50 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-green-700">
                        Lead {c.referenciaLead || ''}
                      </span>
                    )}
                  </p>
                  <p className="font-lato text-xs text-slate-500">{usd(c.costoUsd)}</p>
                </div>
                <span className="flex-shrink-0 font-lato text-[10px] text-slate-400">
                  {FECHA_FMT.format(c.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 font-lato text-xs text-slate-400">
            Aún no hay conversaciones. Aparecerán aquí cuando el chatbot esté activo y la gente lo use.
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── componentes ───────────────────────────────────────────────────── */

function Kpi({
  label,
  value,
  sub,
  icon,
  href,
  highlight,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  href?: string
  highlight?: boolean
}) {
  const inner = (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </p>
        <span className={cn('text-slate-400', highlight && 'text-red-600')}>{icon}</span>
      </div>
      <span
        className={cn(
          'font-bebas text-4xl uppercase leading-none',
          highlight ? 'text-red-600' : 'text-slate-950',
        )}
      >
        {value}
      </span>
      {sub && <p className="mt-1.5 font-lato text-[11px] text-slate-400">{sub}</p>}
    </>
  )
  const cls = cn(
    'block rounded-md border bg-white px-5 py-4',
    highlight ? 'border-red-200' : 'border-slate-200',
    href && 'transition-all hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-sm',
  )
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

function BudgetBar({ label, pct, detail }: { label: string; pct: number; detail: string }) {
  const color = pct >= 100 ? 'bg-red-600' : pct >= 80 ? 'bg-amber-500' : 'bg-slate-900'
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </p>
        <span className="font-lato text-xs font-semibold text-slate-700">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden bg-slate-100">
        <div className={cn('h-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 font-lato text-[11px] text-slate-400">{detail}</p>
    </div>
  )
}

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'
import {
  UserPlus,
  MessagesSquare,
  MessageCircle,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react'

/**
 * Resumen de conversión para /admin/analytics: leads (DB), interacciones del
 * chatbot (DB) y clics de WhatsApp (DB, tracking propio vía /api/track/whatsapp).
 * Ventana de 28 días. Cada consulta va protegida con .catch para que la página
 * no se caiga si una tabla aún no existe (ej. antes del db:push).
 */

const DIAS = 28

function mesBogota(): string {
  const bogota = new Date(Date.now() - 5 * 60 * 60 * 1000)
  return bogota.toISOString().slice(0, 7) // 'YYYY-MM'
}

function usd(n: number): string {
  if (n > 0 && n < 0.01) return `US$${n.toFixed(4)}`
  return `US$${n.toFixed(2)}`
}

function clasificarLead(origen: string | null): 'chatbot' | 'formulario' {
  return (origen || '').toLowerCase().includes('chatbot') ? 'chatbot' : 'formulario'
}

const ESTADO_LABEL: Record<string, string> = {
  NUEVO: 'Nuevos',
  PARCIAL: 'Parciales (sin terminar)',
  LEIDO: 'Leídos',
  RESPONDIDO: 'Respondidos',
  ARCHIVADO: 'Archivados',
}

const WA_ORIGEN_LABEL: Record<string, string> = {
  'widget-flotante': 'Botón flotante',
  'cta-precios': 'CTA de precios',
  'cta-guia': 'CTA de guías',
  'cta-whatsapp': 'CTA general',
}

async function getData() {
  const desde = new Date(Date.now() - DIAS * 24 * 60 * 60 * 1000)
  const mes = mesBogota()

  const [
    leadsWin,
    leadsTotal,
    convWin,
    convTotal,
    mensajesTotal,
    chatLeads,
    usoMes,
    waWin,
    waTotal,
    waGrupos,
  ] = await Promise.all([
    prisma.contactForm
      .findMany({ where: { createdAt: { gte: desde } }, select: { origen: true, estado: true } })
      .catch(() => [] as { origen: string | null; estado: string }[]),
    prisma.contactForm.count().catch(() => 0),
    prisma.chatConversacion.count({ where: { createdAt: { gte: desde } } }).catch(() => 0),
    prisma.chatConversacion.count().catch(() => 0),
    prisma.chatMensaje.count().catch(() => 0),
    prisma.chatConversacion.count({ where: { leadCapturado: true } }).catch(() => 0),
    prisma.chatUso
      .aggregate({ where: { mes }, _sum: { costoUsd: true, requests: true } })
      .catch(() => null),
    prisma.clickWhatsapp.count({ where: { createdAt: { gte: desde } } }).catch(() => 0),
    prisma.clickWhatsapp.count().catch(() => 0),
    prisma.clickWhatsapp
      .groupBy({ by: ['origen'], where: { createdAt: { gte: desde } }, _count: { _all: true } })
      .catch(() => [] as { origen: string | null; _count: { _all: number } }[]),
  ])

  const leadsPorOrigen = { chatbot: 0, formulario: 0 }
  const leadsPorEstado: Record<string, number> = {}
  for (const l of leadsWin) {
    leadsPorOrigen[clasificarLead(l.origen)]++
    leadsPorEstado[l.estado] = (leadsPorEstado[l.estado] || 0) + 1
  }

  const waPorOrigen = waGrupos
    .map((g) => ({ origen: g.origen || 'otro', total: g._count._all }))
    .sort((a, b) => b.total - a.total)

  return {
    leadsWin: leadsWin.length,
    leadsTotal,
    leadsPorOrigen,
    leadsPorEstado,
    convWin,
    convTotal,
    mensajesTotal,
    chatLeads,
    costoMes: usoMes?._sum.costoUsd ?? 0,
    requestsMes: usoMes?._sum.requests ?? 0,
    waWin,
    waTotal,
    waPorOrigen,
  }
}

export default async function LeadsInteraccionesSection() {
  const d = await getData()

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Conversión · últimos {DIAS} días
        </p>
        <h2 className="font-bebas text-3xl uppercase leading-none text-slate-950 md:text-4xl">
          Leads e interacciones
        </h2>
        <p className="mt-2 font-lato text-sm text-slate-500">
          Contactos capturados, actividad del chatbot y clics al botón de WhatsApp — desde
          nuestra propia base de datos.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi
          label="Leads (28 días)"
          value={String(d.leadsWin)}
          sub={`${d.leadsTotal} en total`}
          icon={<UserPlus className="h-4 w-4" />}
          href="/admin/messages"
          highlight={d.leadsWin > 0}
        />
        <Kpi
          label="Conversaciones chatbot"
          value={String(d.convWin)}
          sub={`${d.convTotal} en total · ${d.mensajesTotal} mensajes`}
          icon={<MessagesSquare className="h-4 w-4" />}
          href="/admin/chat"
        />
        <Kpi
          label="Leads del chatbot"
          value={String(d.chatLeads)}
          sub={`Gasto del mes: ${usd(d.costoMes)}`}
          icon={<MessagesSquare className="h-4 w-4" />}
          href="/admin/chat"
        />
        <Kpi
          label="Clics de WhatsApp (28 días)"
          value={String(d.waWin)}
          sub={`${d.waTotal} en total`}
          icon={<MessageCircle className="h-4 w-4" />}
          highlight={d.waWin > 0}
        />
      </div>

      {/* Desgloses */}
      <div className="grid gap-4 md:grid-cols-3">
        <Panel title="Leads por canal (28 días)">
          <BreakdownRow label="Formulario web" value={d.leadsPorOrigen.formulario} total={d.leadsWin} />
          <BreakdownRow label="Chatbot IA" value={d.leadsPorOrigen.chatbot} total={d.leadsWin} />
          {d.leadsWin === 0 && <Vacio>Aún no hay leads en la ventana.</Vacio>}
        </Panel>

        <Panel title="Leads por estado (28 días)">
          {Object.entries(d.leadsPorEstado)
            .sort((a, b) => b[1] - a[1])
            .map(([estado, n]) => (
              <BreakdownRow
                key={estado}
                label={ESTADO_LABEL[estado] || estado}
                value={n}
                total={d.leadsWin}
              />
            ))}
          {Object.keys(d.leadsPorEstado).length === 0 && <Vacio>Aún no hay leads en la ventana.</Vacio>}
        </Panel>

        <Panel
          title="Clics de WhatsApp por origen (28 días)"
          footer={
            <span className="flex items-center gap-1.5 text-slate-400">
              <DollarSign className="h-3 w-3" />
              Se registran desde que se desplegó el tracking
            </span>
          }
        >
          {d.waPorOrigen.map((w) => (
            <BreakdownRow
              key={w.origen}
              label={WA_ORIGEN_LABEL[w.origen] || w.origen}
              value={w.total}
              total={d.waWin}
            />
          ))}
          {d.waPorOrigen.length === 0 && (
            <Vacio>Aún no hay clics registrados. Aparecerán aquí cuando la gente use los botones de WhatsApp.</Vacio>
          )}
        </Panel>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <Link
          href="/admin/messages"
          className="flex items-center gap-1 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 transition-colors hover:text-red-600"
        >
          Ver leads en Mensajes <ArrowUpRight className="h-3 w-3" />
        </Link>
        <Link
          href="/admin/chat"
          className="flex items-center gap-1 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 transition-colors hover:text-red-600"
        >
          Detalle del chatbot <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
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

function Panel({
  title,
  children,
  footer,
}: {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="flex flex-col rounded-md border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h3 className="font-bebas text-base uppercase tracking-wide text-slate-950">{title}</h3>
      </div>
      <div className="flex-1 space-y-2.5 px-4 py-4">{children}</div>
      {footer && (
        <div className="border-t border-slate-100 px-4 py-2 font-lato text-[10px]">{footer}</div>
      )}
    </div>
  )
}

function BreakdownRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-lato text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-950">
          {value}
          <span className="ml-1.5 font-normal text-slate-400">{pct}%</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden bg-slate-100">
        <div className="h-full bg-slate-900 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Vacio({ children }: { children: React.ReactNode }) {
  return <p className="font-lato text-xs text-slate-400">{children}</p>
}

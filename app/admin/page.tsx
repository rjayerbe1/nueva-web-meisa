import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import Link from "next/link"
import {
  Building2,
  Home as HomeIcon,
  Inbox,
  ImageIcon,
  MessageSquare,
  FolderKanban,
  ArrowUpRight,
  Film,
  FileText,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

async function getDashboardData() {
  const [
    proyectosTotal,
    proyectosVisibles,
    mensajesSinLeer,
    mensajesTotal,
    mediaTotal,
    brochuresPublicados,
    proyectosRecientes,
    mensajesRecientes,
    mediaRecientes,
  ] = await Promise.all([
    prisma.proyecto.count(),
    prisma.proyecto.count({ where: { visible: true } }),
    prisma.contactForm.count({ where: { leido: false } }).catch(() => 0),
    prisma.contactForm.count().catch(() => 0),
    prisma.media.count().catch(() => 0),
    prisma.brochure.count({ where: { publicado: true } }).catch(() => 0),
    prisma.proyecto.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        titulo: true,
        estado: true,
        createdAt: true,
        cliente: true,
      },
    }),
    prisma.contactForm
      .findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          nombre: true,
          email: true,
          mensaje: true,
          createdAt: true,
          leido: true,
        },
      })
      .catch(() => []),
    prisma.media
      .findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: { id: true, url: true, fileName: true, kind: true, folder: true },
      })
      .catch(() => []),
  ])

  return {
    proyectosTotal,
    proyectosVisibles,
    mensajesSinLeer,
    mensajesTotal,
    mediaTotal,
    brochuresPublicados,
    proyectosRecientes,
    mensajesRecientes,
    mediaRecientes,
  }
}

const FECHA_FMT = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

const HOY_FMT = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
})

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")
  if (session.user.role === UserRole.VIEWER) redirect("/")

  const data = await getDashboardData()
  const firstName = session.user.name?.split(" ")[0] ?? "Admin"

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="border-b border-slate-200 pb-6">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Panel de administración
        </p>
        <h1 className="font-bebas text-4xl uppercase leading-[0.95] text-slate-950 md:text-5xl">
          Hola, {firstName}
        </h1>
        <p className="mt-2 font-lato text-sm text-slate-500">
          {HOY_FMT.format(new Date())}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="Proyectos visibles"
          value={data.proyectosVisibles}
          total={data.proyectosTotal}
          icon={<FolderKanban className="h-4 w-4" />}
          href="/admin/projects"
        />
        <KpiCard
          label="Mensajes sin leer"
          value={data.mensajesSinLeer}
          total={data.mensajesTotal}
          highlight={data.mensajesSinLeer > 0}
          icon={<Inbox className="h-4 w-4" />}
          href="/admin/messages"
        />
        <KpiCard
          label="Biblioteca de medios"
          value={data.mediaTotal}
          icon={<ImageIcon className="h-4 w-4" />}
          href="/admin/media-library"
        />
        <KpiCard
          label="Brochures publicados"
          value={data.brochuresPublicados}
          icon={<FileText className="h-4 w-4" />}
          href="/admin/brochures"
        />
      </div>

      {/* Actividad reciente */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Proyectos recientes */}
        <ActivityPanel
          title="Proyectos recientes"
          href="/admin/projects"
          empty="Aún no hay proyectos."
        >
          {data.proyectosRecientes.map((p) => (
            <Link
              key={p.id}
              href={`/admin/projects/${p.id}`}
              className="group flex items-start gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-stone-50"
            >
              <div className="mt-0.5 flex h-6 w-1 flex-shrink-0 bg-red-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-lato text-sm font-semibold text-slate-900">
                  {p.titulo}
                </p>
                <p className="truncate font-lato text-xs text-slate-500">
                  {p.cliente}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <EstadoBadge estado={p.estado} />
                <span className="font-lato text-[10px] text-slate-400">
                  {FECHA_FMT.format(p.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </ActivityPanel>

        {/* Mensajes recientes */}
        <ActivityPanel
          title="Mensajes recientes"
          href="/admin/messages"
          empty="Aún no hay mensajes."
        >
          {data.mensajesRecientes.map((m) => (
            <Link
              key={m.id}
              href={`/admin/messages/${m.id}`}
              className="group flex items-start gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-stone-50"
            >
              <div
                className={cn(
                  "mt-1.5 h-2 w-2 flex-shrink-0 rounded-full",
                  m.leido ? "bg-slate-300" : "bg-red-600",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-lato text-sm font-semibold text-slate-900">
                  {m.nombre}
                </p>
                <p className="truncate font-lato text-xs text-slate-500">{m.email}</p>
                {m.mensaje && (
                  <p className="mt-1 line-clamp-2 font-lato text-xs text-slate-500">
                    {m.mensaje}
                  </p>
                )}
              </div>
              <span className="flex-shrink-0 font-lato text-[10px] text-slate-400">
                {FECHA_FMT.format(m.createdAt)}
              </span>
            </Link>
          ))}
        </ActivityPanel>

        {/* Media reciente */}
        <ActivityPanel
          title="Uploads recientes"
          href="/admin/media-library"
          empty="Aún no hay medios."
        >
          <div className="grid grid-cols-3 gap-1 p-2">
            {data.mediaRecientes.map((m) => (
              <Link
                key={m.id}
                href="/admin/media-library"
                className="group relative aspect-square overflow-hidden bg-slate-100"
              >
                {m.kind === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.url}
                    alt=""
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : m.kind === "VIDEO" ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                    <Film className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <FileText className="h-5 w-5" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </ActivityPanel>
      </div>

      {/* Accesos rápidos */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Accesos rápidos
            </p>
            <h2 className="font-bebas text-2xl uppercase leading-tight text-slate-950">
              Edita el sitio
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <QuickLink href="/admin/home" label="Inicio" icon={<HomeIcon className="h-4 w-4" />} />
          <QuickLink
            href="/admin/empresa"
            label="Empresa"
            icon={<Building2 className="h-4 w-4" />}
          />
          <QuickLink
            href="/admin/projects"
            label="Proyectos"
            icon={<FolderKanban className="h-4 w-4" />}
          />
          <QuickLink
            href="/admin/media-library"
            label="Medios"
            icon={<ImageIcon className="h-4 w-4" />}
          />
          <QuickLink
            href="/admin/messages"
            label="Mensajes"
            icon={<Inbox className="h-4 w-4" />}
            badge={data.mensajesSinLeer > 0 ? data.mensajesSinLeer : undefined}
          />
          <QuickLink
            href="/admin/contactos-whatsapp"
            label="WhatsApp"
            icon={<MessageSquare className="h-4 w-4" />}
          />
        </div>
      </section>
    </div>
  )
}

/* ─── KPI card ────────────────────────────────────────────────────────── */

function KpiCard({
  label,
  value,
  total,
  highlight,
  icon,
  href,
}: {
  label: string
  value: number
  total?: number
  highlight?: boolean
  icon: React.ReactNode
  href: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-md border bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-sm",
        highlight
          ? "border-red-200 hover:border-red-600"
          : "border-slate-200 hover:border-slate-900",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </p>
        <span
          className={cn(
            "text-slate-400 transition-colors",
            highlight ? "group-hover:text-red-600" : "group-hover:text-slate-900",
          )}
        >
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-bebas text-4xl uppercase leading-none",
            highlight ? "text-red-600" : "text-slate-950",
          )}
        >
          {value}
        </span>
        {typeof total === "number" && total !== value && (
          <span className="font-lato text-xs text-slate-400">/ {total}</span>
        )}
      </div>
    </Link>
  )
}

/* ─── Activity panel ──────────────────────────────────────────────────── */

function ActivityPanel({
  title,
  href,
  empty,
  children,
}: {
  title: string
  href: string
  empty: string
  children: React.ReactNode
}) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children)
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="font-bebas text-base uppercase tracking-wide text-slate-950">
          {title}
        </h3>
        <Link
          href={href}
          className="flex items-center gap-1 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 transition-colors hover:text-red-600"
        >
          Ver todo
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      {hasChildren ? (
        <div className="divide-y divide-slate-100">{children}</div>
      ) : (
        <div className="flex items-center justify-center p-8 font-lato text-xs text-slate-400">
          {empty}
        </div>
      )}
    </div>
  )
}

/* ─── Estado badge ────────────────────────────────────────────────────── */

function EstadoBadge({ estado }: { estado: string }) {
  const color =
    estado === "COMPLETADO"
      ? "bg-green-50 text-green-700 border-green-200"
      : estado === "EN_PROGRESO"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : estado === "PAUSADO"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-slate-50 text-slate-700 border-slate-200"
  return (
    <span
      className={cn(
        "rounded-none border px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider",
        color,
      )}
    >
      {estado.replace("_", " ")}
    </span>
  )
}

/* ─── Quick link ──────────────────────────────────────────────────────── */

function QuickLink({
  href,
  label,
  icon,
  badge,
}: {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-red-600 hover:bg-red-50"
    >
      <div className="flex items-center gap-2.5">
        <span className="text-slate-400 transition-colors group-hover:text-red-600">
          {icon}
        </span>
        <span className="font-lato text-sm font-semibold text-slate-900">{label}</span>
      </div>
      {typeof badge === "number" && (
        <span className="rounded-none bg-red-600 px-1.5 py-0.5 font-lato text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  )
}

"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Users,
  Eye,
  Target,
  Radio,
  MousePointerClick,
  Search,
  TrendingUp,
  Globe,
  MonitorSmartphone,
  MapPin,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ---------- Tipos (espejo de /api/admin/analytics) ----------

interface TimeseriesPoint {
  date: string // YYYYMMDD
  activeUsers: number
  pageViews: number
}

interface Ga4Data {
  error?: string
  totals?: { activeUsers: number; pageViews: number; leads: number }
  realtimeActiveUsers?: number
  timeseries?: TimeseriesPoint[]
  topPages?: { path: string; pageViews: number; activeUsers: number }[]
  channels?: { channel: string; sessions: number }[]
  cities?: { city: string; activeUsers: number }[]
  devices?: { device: string; activeUsers: number }[]
}

interface SearchConsoleData {
  error?: string
  totals?: { clicks: number; impressions: number; ctr: number; position: number }
  queries?: {
    query: string
    clicks: number
    impressions: number
    ctr: number
    position: number
  }[]
}

interface AnalyticsResponse {
  days: number
  ga4: Ga4Data
  searchConsole: SearchConsoleData
}

// ---------- Helpers de formato ----------

const nf = new Intl.NumberFormat("es-CO")

function formatNumber(n: number | undefined): string {
  return nf.format(n ?? 0)
}

function formatGaDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd
  return `${yyyymmdd.slice(6, 8)}/${yyyymmdd.slice(4, 6)}`
}

const CHANNEL_LABELS: Record<string, string> = {
  "Organic Search": "Búsqueda orgánica",
  Direct: "Directo",
  Referral: "Referencias",
  "Organic Social": "Social orgánico",
  "Paid Search": "Búsqueda de pago",
  "Paid Social": "Social de pago",
  Email: "Email",
  Display: "Display",
  Unassigned: "Sin asignar",
}

const DEVICE_LABELS: Record<string, string> = {
  desktop: "Escritorio",
  mobile: "Móvil",
  tablet: "Tablet",
}

// ---------- Subcomponentes ----------

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "blue",
}: {
  icon: typeof Users
  label: string
  value: string
  sub?: string
  accent?: "blue" | "red" | "green" | "slate"
}) {
  const accentClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-700",
    slate: "bg-slate-100 text-slate-600",
  }
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn("rounded-lg p-2", accentClasses[accent])}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof Users
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
        <Icon className="h-4 w-4 text-blue-700" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function DistributionBars({
  items,
  emptyText,
}: {
  items: { label: string; value: number }[]
  emptyText: string
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  if (items.length === 0) {
    return <p className="py-4 text-center text-sm text-gray-400">{emptyText}</p>
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="truncate text-gray-700">{item.label}</span>
            <span className="ml-2 font-semibold text-gray-900">{formatNumber(item.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

function TimeseriesChart({ points }: { points: TimeseriesPoint[] }) {
  if (points.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        Sin datos en este rango todavía.
      </p>
    )
  }
  const max = Math.max(...points.map((p) => p.activeUsers), 1)
  // Etiquetas: primera, última y algunas intermedias
  const labelEvery = Math.max(Math.ceil(points.length / 8), 1)
  return (
    <div>
      <div className="flex h-44 items-end gap-[2px]">
        {points.map((p) => (
          <div
            key={p.date}
            className="group relative flex-1 rounded-t bg-blue-600 transition-colors hover:bg-blue-800"
            style={{ height: `${Math.max((p.activeUsers / max) * 100, 2)}%` }}
            title={`${formatGaDate(p.date)} — ${formatNumber(p.activeUsers)} usuarios · ${formatNumber(p.pageViews)} páginas vistas`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-gray-400">
        {points.map((p, i) =>
          i % labelEvery === 0 || i === points.length - 1 ? (
            <span key={p.date}>{formatGaDate(p.date)}</span>
          ) : null,
        )}
      </div>
    </div>
  )
}

function ErrorBlock({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
      <div>
        <p className="text-sm font-semibold text-amber-800">{title}</p>
        <p className="mt-0.5 break-all text-xs text-amber-700">{message}</p>
      </div>
    </div>
  )
}

// ---------- Componente principal ----------

const RANGES = [
  { days: 7, label: "7 días" },
  { days: 28, label: "28 días" },
  { days: 90, label: "90 días" },
]

export default function AnalyticsDashboard() {
  const [days, setDays] = useState(28)
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async (selectedDays: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/analytics?days=${selectedDays}`, {
        cache: "no-store",
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error || `Error ${res.status} al consultar la analítica`)
      }
      const json = (await res.json()) as AnalyticsResponse
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar la analítica")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(days)
  }, [days, loadData])

  const ga4 = data?.ga4
  const sc = data?.searchConsole
  const gaOk = Boolean(ga4 && !ga4.error)
  const scOk = Boolean(sc && !sc.error)
  const gaEmpty =
    gaOk && (ga4?.totals?.activeUsers ?? 0) === 0 && (ga4?.timeseries?.length ?? 0) === 0

  return (
    <div className="space-y-6">
      {/* Selector de rango */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              disabled={loading}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                days === r.days
                  ? "bg-blue-700 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => loadData(days)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Actualizar
        </button>
      </div>

      {/* Error global */}
      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
          <p className="font-semibold text-red-700">No se pudo cargar la analítica</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            onClick={() => loadData(days)}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-2/3 rounded bg-gray-100" />
                <div className="mt-4 h-8 w-1/2 rounded bg-gray-100" />
              </div>
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white shadow-sm" />
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* Aviso de datos recientes */}
          {gaEmpty && (
            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <p className="text-sm text-blue-800">
                GA4 aún no reporta datos para este rango. Si la medición se activó hoy, los
                datos suelen aparecer en 24-48 horas.
              </p>
            </div>
          )}

          {/* Errores por bloque */}
          {ga4?.error && (
            <ErrorBlock title="Google Analytics no disponible" message={ga4.error} />
          )}
          {sc?.error && (
            <ErrorBlock title="Search Console no disponible" message={sc.error} />
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {gaOk && (
              <>
                <KpiCard
                  icon={Users}
                  label="Usuarios"
                  value={formatNumber(ga4?.totals?.activeUsers)}
                  sub={`Últimos ${data.days} días`}
                />
                <KpiCard
                  icon={Eye}
                  label="Páginas vistas"
                  value={formatNumber(ga4?.totals?.pageViews)}
                  sub={`Últimos ${data.days} días`}
                />
                <KpiCard
                  icon={Target}
                  label="Leads (generate_lead)"
                  value={formatNumber(ga4?.totals?.leads)}
                  sub="Conversiones del formulario"
                  accent="red"
                />
                <KpiCard
                  icon={Radio}
                  label="Usuarios ahora"
                  value={formatNumber(ga4?.realtimeActiveUsers)}
                  sub="En tiempo real (últimos 30 min)"
                  accent="green"
                />
              </>
            )}
            {scOk && (
              <>
                <KpiCard
                  icon={MousePointerClick}
                  label="Clicks en Google"
                  value={formatNumber(sc?.totals?.clicks)}
                  sub="Search Console"
                  accent="slate"
                />
                <KpiCard
                  icon={Search}
                  label="Impresiones en Google"
                  value={formatNumber(sc?.totals?.impressions)}
                  sub="Search Console"
                  accent="slate"
                />
                <KpiCard
                  icon={TrendingUp}
                  label="CTR promedio"
                  value={`${((sc?.totals?.ctr ?? 0) * 100).toFixed(1)}%`}
                  sub="Clicks / impresiones"
                  accent="slate"
                />
                <KpiCard
                  icon={Globe}
                  label="Posición promedio"
                  value={(sc?.totals?.position ?? 0).toFixed(1)}
                  sub="Resultados de búsqueda"
                  accent="slate"
                />
              </>
            )}
          </div>

          {/* Serie temporal */}
          {gaOk && (
            <SectionCard title={`Usuarios por día (últimos ${data.days} días)`} icon={TrendingUp}>
              <TimeseriesChart points={ga4?.timeseries ?? []} />
            </SectionCard>
          )}

          {/* Top páginas + Top búsquedas */}
          <div className="grid gap-6 xl:grid-cols-2">
            {gaOk && (
              <SectionCard title="Páginas más vistas" icon={Eye}>
                {(ga4?.topPages?.length ?? 0) === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-400">Sin datos todavía.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          <th className="pb-2 pr-3">Página</th>
                          <th className="pb-2 pr-3 text-right">Vistas</th>
                          <th className="pb-2 text-right">Usuarios</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {ga4?.topPages?.map((p) => (
                          <tr key={p.path}>
                            <td className="max-w-[280px] truncate py-2 pr-3 font-medium text-gray-800">
                              {p.path}
                            </td>
                            <td className="py-2 pr-3 text-right text-gray-700">
                              {formatNumber(p.pageViews)}
                            </td>
                            <td className="py-2 text-right text-gray-700">
                              {formatNumber(p.activeUsers)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </SectionCard>
            )}

            {scOk && (
              <SectionCard title="Búsquedas en Google (top 20)" icon={Search}>
                {(sc?.queries?.length ?? 0) === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-400">
                    Sin datos de búsqueda todavía. Search Console puede tardar unos días en
                    mostrar consultas.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          <th className="pb-2 pr-3">Consulta</th>
                          <th className="pb-2 pr-3 text-right">Clicks</th>
                          <th className="pb-2 pr-3 text-right">Impresiones</th>
                          <th className="pb-2 pr-3 text-right">CTR</th>
                          <th className="pb-2 text-right">Posición</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {sc?.queries?.map((q) => (
                          <tr key={q.query}>
                            <td className="max-w-[240px] truncate py-2 pr-3 font-medium text-gray-800">
                              {q.query}
                            </td>
                            <td className="py-2 pr-3 text-right text-gray-700">
                              {formatNumber(q.clicks)}
                            </td>
                            <td className="py-2 pr-3 text-right text-gray-700">
                              {formatNumber(q.impressions)}
                            </td>
                            <td className="py-2 pr-3 text-right text-gray-700">
                              {(q.ctr * 100).toFixed(1)}%
                            </td>
                            <td className="py-2 text-right text-gray-700">
                              {q.position.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </SectionCard>
            )}
          </div>

          {/* Distribuciones */}
          {gaOk && (
            <div className="grid gap-6 md:grid-cols-3">
              <SectionCard title="Canales de tráfico" icon={Globe}>
                <DistributionBars
                  items={(ga4?.channels ?? []).map((c) => ({
                    label: CHANNEL_LABELS[c.channel] ?? c.channel,
                    value: c.sessions,
                  }))}
                  emptyText="Sin datos todavía."
                />
              </SectionCard>
              <SectionCard title="Dispositivos" icon={MonitorSmartphone}>
                <DistributionBars
                  items={(ga4?.devices ?? []).map((d) => ({
                    label: DEVICE_LABELS[d.device] ?? d.device,
                    value: d.activeUsers,
                  }))}
                  emptyText="Sin datos todavía."
                />
              </SectionCard>
              <SectionCard title="Ciudades" icon={MapPin}>
                <DistributionBars
                  items={(ga4?.cities ?? []).map((c) => ({
                    label: c.city || "(desconocida)",
                    value: c.activeUsers,
                  }))}
                  emptyText="Sin datos todavía."
                />
              </SectionCard>
            </div>
          )}
        </>
      )}
    </div>
  )
}

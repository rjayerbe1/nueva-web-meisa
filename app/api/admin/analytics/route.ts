/**
 * API de analítica del admin — agrega datos de GA4 (Data API + Realtime)
 * y Google Search Console usando una service account con acceso de Lector.
 *
 * Requiere en el entorno:
 *  - ANALYTICS_SA_KEY_JSON: JSON completo de la key de la service account
 *  - GA_PROPERTY_ID: ID numérico de la propiedad GA4 (ej. 541564676)
 *  - SC_SITE_URL: site de Search Console (ej. sc-domain:meisa.com.co)
 */

import { NextRequest, NextResponse } from "next/server"
import { JWT } from "google-auth-library"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"

export const dynamic = "force-dynamic"
export const revalidate = 0

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
]

let cachedJwt: JWT | null = null

function getJwt(): JWT {
  if (cachedJwt) return cachedJwt
  const raw = process.env.ANALYTICS_SA_KEY_JSON
  if (!raw) {
    throw new Error("Falta ANALYTICS_SA_KEY_JSON en el entorno")
  }
  const creds = JSON.parse(raw) as { client_email?: string; private_key?: string }
  if (!creds.client_email || !creds.private_key) {
    throw new Error("ANALYTICS_SA_KEY_JSON no contiene client_email/private_key")
  }
  cachedJwt = new JWT({
    email: creds.client_email,
    key: creds.private_key.replace(/\\n/g, "\n"),
    scopes: SCOPES,
  })
  return cachedJwt
}

// ---------- Tipos de respuesta de las APIs de Google ----------

interface GAValue {
  value?: string
}

interface GARow {
  dimensionValues?: GAValue[]
  metricValues?: GAValue[]
}

interface GAReport {
  rows?: GARow[]
}

interface SCRow {
  keys?: string[]
  clicks?: number
  impressions?: number
  ctr?: number
  position?: number
}

interface SCResponse {
  rows?: SCRow[]
}

// ---------- Helpers de fetch ----------

async function googleFetch<T>(url: string, token: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 300)}`)
  }
  return (await res.json()) as T
}

function gaRunReport(token: string, propertyId: string, body: unknown): Promise<GAReport> {
  return googleFetch<GAReport>(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    token,
    body,
  )
}

function dim(row: GARow, index = 0): string {
  return row.dimensionValues?.[index]?.value ?? ""
}

function metric(row: GARow, index = 0): number {
  return Number(row.metricValues?.[index]?.value ?? 0)
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// ---------- Bloques de datos ----------

async function fetchGa4(token: string, days: number) {
  const propertyId = process.env.GA_PROPERTY_ID
  if (!propertyId) {
    throw new Error("Falta GA_PROPERTY_ID en el entorno")
  }

  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }]

  const [timeseriesRes, topPagesRes, channelsRes, citiesRes, devicesRes, leadsRes, realtimeRes] =
    await Promise.all([
      // Serie temporal: usuarios y páginas vistas por día
      gaRunReport(token, propertyId, {
        dateRanges,
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
        limit: 100,
      }),
      // Top 10 páginas
      gaRunReport(token, propertyId, {
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      // Fuentes / canales
      gaRunReport(token, propertyId, {
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 10,
      }),
      // Ciudades
      gaRunReport(token, propertyId, {
        dateRanges,
        dimensions: [{ name: "city" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),
      // Dispositivos
      gaRunReport(token, propertyId, {
        dateRanges,
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 5,
      }),
      // Conversiones (evento generate_lead)
      gaRunReport(token, propertyId, {
        dateRanges,
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: { matchType: "EXACT", value: "generate_lead" },
          },
        },
      }),
      // Usuarios activos en tiempo real
      googleFetch<GAReport>(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`,
        token,
        { metrics: [{ name: "activeUsers" }] },
      ),
    ])

  const timeseries = (timeseriesRes.rows ?? []).map((row) => ({
    date: dim(row), // formato YYYYMMDD
    activeUsers: metric(row, 0),
    pageViews: metric(row, 1),
  }))

  return {
    totals: {
      activeUsers: timeseries.reduce((acc, r) => acc + r.activeUsers, 0),
      pageViews: timeseries.reduce((acc, r) => acc + r.pageViews, 0),
      leads: metric(leadsRes.rows?.[0] ?? {}, 0),
    },
    realtimeActiveUsers: metric(realtimeRes.rows?.[0] ?? {}, 0),
    timeseries,
    topPages: (topPagesRes.rows ?? []).map((row) => ({
      path: dim(row),
      pageViews: metric(row, 0),
      activeUsers: metric(row, 1),
    })),
    channels: (channelsRes.rows ?? []).map((row) => ({
      channel: dim(row),
      sessions: metric(row, 0),
    })),
    cities: (citiesRes.rows ?? []).map((row) => ({
      city: dim(row),
      activeUsers: metric(row, 0),
    })),
    devices: (devicesRes.rows ?? []).map((row) => ({
      device: dim(row),
      activeUsers: metric(row, 0),
    })),
  }
}

async function fetchSearchConsole(token: string, days: number) {
  const siteUrl = process.env.SC_SITE_URL
  if (!siteUrl) {
    throw new Error("Falta SC_SITE_URL en el entorno")
  }

  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    siteUrl,
  )}/searchAnalytics/query`

  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  const startDate = fmtDate(start)
  const endDate = fmtDate(end)

  const [queriesRes, totalsRes] = await Promise.all([
    googleFetch<SCResponse>(endpoint, token, {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 20,
    }),
    googleFetch<SCResponse>(endpoint, token, {
      startDate,
      endDate,
      rowLimit: 1,
    }),
  ])

  const totalsRow = totalsRes.rows?.[0]

  return {
    totals: {
      clicks: totalsRow?.clicks ?? 0,
      impressions: totalsRow?.impressions ?? 0,
      ctr: totalsRow?.ctr ?? 0,
      position: totalsRow?.position ?? 0,
    },
    queries: (queriesRes.rows ?? []).map((row) => ({
      query: row.keys?.[0] ?? "",
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    })),
  }
}

// ---------- Handler ----------

const VALID_DAYS = [7, 28, 90]

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
  } catch (error) {
    return apiErrorResponse(error)
  }

  const daysParam = Number(request.nextUrl.searchParams.get("days"))
  const days = VALID_DAYS.includes(daysParam) ? daysParam : 28

  // Token de la service account (compartido por GA4 y Search Console)
  let token: string
  try {
    const jwt = getJwt()
    const accessToken = await jwt.getAccessToken()
    if (!accessToken.token) {
      throw new Error("No se pudo obtener access token de la service account")
    }
    token = accessToken.token
  } catch (error) {
    console.error("[analytics] error de credenciales:", error)
    const message = error instanceof Error ? error.message : "Error de credenciales"
    return NextResponse.json(
      {
        days,
        ga4: { error: message },
        searchConsole: { error: message },
      },
      { status: 200 },
    )
  }

  // Cada bloque falla de forma independiente
  const [gaResult, scResult] = await Promise.allSettled([
    fetchGa4(token, days),
    fetchSearchConsole(token, days),
  ])

  if (gaResult.status === "rejected") {
    console.error("[analytics] GA4 falló:", gaResult.reason)
  }
  if (scResult.status === "rejected") {
    console.error("[analytics] Search Console falló:", scResult.reason)
  }

  return NextResponse.json({
    days,
    ga4:
      gaResult.status === "fulfilled"
        ? gaResult.value
        : { error: gaResult.reason instanceof Error ? gaResult.reason.message : "GA4 no disponible" },
    searchConsole:
      scResult.status === "fulfilled"
        ? scResult.value
        : {
            error:
              scResult.reason instanceof Error
                ? scResult.reason.message
                : "Search Console no disponible",
          },
  })
}

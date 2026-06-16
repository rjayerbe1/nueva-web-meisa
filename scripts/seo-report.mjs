/**
 * Reporte SEO ad-hoc — Search Console + GA4 + estado del sitemap.
 * Usa la service account analytics-reader (misma del dashboard /admin/analytics).
 * Uso: node scripts/seo-report.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { JWT } from "google-auth-library"

// --- cargar .env.local minimalista ---
const envPath = path.join(process.cwd(), ".env.local")
const env = {}
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (!m) continue
  let v = m[2].trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1)
  }
  env[m[1]] = v
}

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
]
const creds = JSON.parse(env.ANALYTICS_SA_KEY_JSON)
const jwt = new JWT({
  email: creds.client_email,
  key: creds.private_key.replace(/\\n/g, "\n"),
  scopes: SCOPES,
})
const { token } = await jwt.getAccessToken()
const SITE = env.SC_SITE_URL
const PROP = env.GA_PROPERTY_ID

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 400)}`)
  return res.json()
}
async function get(url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 400)}`)
  return res.json()
}

const scEndpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`
const d = (x) => x.toISOString().slice(0, 10)
const today = new Date()
const ago = (n) => { const x = new Date(); x.setDate(x.getDate() - n); return x }

function fmtRows(rows, keyName) {
  return (rows ?? []).map((r) => ({
    key: r.keys?.[0] ?? "",
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: +((r.ctr ?? 0) * 100).toFixed(1),
    position: +(r.position ?? 0).toFixed(1),
  }))
}

console.log("=== SEARCH CONSOLE — site:", SITE, "===")
console.log("Hoy:", d(today), "| ventana 28d:", d(ago(28)), "->", d(today), "\n")

// Totales últimos 28 días (SC tiene ~2-3 días de lag)
const totals28 = await post(scEndpoint, { startDate: d(ago(28)), endDate: d(today), rowLimit: 1 })
const t = totals28.rows?.[0] ?? {}
console.log("TOTALES 28d:",
  "clicks", t.clicks ?? 0,
  "| impresiones", t.impressions ?? 0,
  "| CTR", (((t.ctr ?? 0) * 100).toFixed(1)) + "%",
  "| pos", (t.position ?? 0).toFixed(1))

// Comparar: pre-deploy (días 4-31 atrás) vs post-deploy (últimos 4 días con datos)
const preStart = d(ago(31)), preEnd = d(ago(5))
const postStart = d(ago(4)), postEnd = d(today)
const pre = (await post(scEndpoint, { startDate: preStart, endDate: preEnd, rowLimit: 1 })).rows?.[0] ?? {}
const postR = (await post(scEndpoint, { startDate: postStart, endDate: postEnd, rowLimit: 1 })).rows?.[0] ?? {}
console.log(`\nPRE-deploy  (${preStart}->${preEnd}): clicks ${pre.clicks ?? 0}, impr ${pre.impressions ?? 0}, pos ${(pre.position ?? 0).toFixed(1)}`)
console.log(`POST-deploy (${postStart}->${postEnd}): clicks ${postR.clicks ?? 0}, impr ${postR.impressions ?? 0}, pos ${(postR.position ?? 0).toFixed(1)}`)

console.log("\n--- TOP QUERIES (28d) ---")
const q = await post(scEndpoint, { startDate: d(ago(28)), endDate: d(today), dimensions: ["query"], rowLimit: 25 })
for (const r of fmtRows(q.rows)) {
  console.log(`  ${String(r.position).padStart(5)}  imp ${String(r.impressions).padStart(4)}  clk ${String(r.clicks).padStart(3)}  ${r.key}`)
}

console.log("\n--- TOP PÁGINAS (28d) ---")
const p = await post(scEndpoint, { startDate: d(ago(28)), endDate: d(today), dimensions: ["page"], rowLimit: 30 })
for (const r of fmtRows(p.rows)) {
  console.log(`  ${String(r.position).padStart(5)}  imp ${String(r.impressions).padStart(4)}  clk ${String(r.clicks).padStart(3)}  ${r.key.replace("https://meisa.com.co","")}`)
}

// ¿Cuántas de las landings SEO ya aparecen?
const landingMarkers = ["/soluciones/", "/estructuras-metalicas/", "/precios-estructuras", "/estructura-metalica-vs", "/tipos-de-estructuras", "/peso-estructura"]
const landingPages = (p.rows ?? []).filter((r) => landingMarkers.some((m) => (r.keys?.[0] ?? "").includes(m)))
console.log(`\nLandings SEO con impresiones (28d): ${landingPages.length}`)

console.log("\n=== SITEMAP ===")
try {
  const sm = await get(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps`)
  for (const s of sm.sitemap ?? []) {
    console.log(`  ${s.path}`)
    console.log(`    lastSubmitted: ${s.lastSubmitted ?? "-"} | lastDownloaded: ${s.lastDownloaded ?? "nunca"} | warnings: ${s.warnings ?? 0} | errors: ${s.errors ?? 0}`)
    for (const c of s.contents ?? []) console.log(`    tipo ${c.type}: submitted ${c.submitted}, indexed ${c.indexed ?? "?"}`)
  }
} catch (e) { console.log("  sitemap error:", e.message) }

console.log("\n=== GA4 (28d) ===")
try {
  const ga = await post(`https://analyticsdata.googleapis.com/v1beta/properties/${PROP}:runReport`, {
    dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
    metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }, { name: "sessions" }],
  })
  const row = ga.rows?.[0]
  console.log("  usuarios:", row?.metricValues?.[0]?.value ?? 0,
    "| páginas vistas:", row?.metricValues?.[1]?.value ?? 0,
    "| sesiones:", row?.metricValues?.[2]?.value ?? 0)
  const leads = await post(`https://analyticsdata.googleapis.com/v1beta/properties/${PROP}:runReport`, {
    dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "generate_lead" } } },
  })
  console.log("  leads (generate_lead):", leads.rows?.[0]?.metricValues?.[0]?.value ?? 0)
  const ch = await post(`https://analyticsdata.googleapis.com/v1beta/properties/${PROP}:runReport`, {
    dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  })
  console.log("  canales:", (ch.rows ?? []).map((r) => `${r.dimensionValues[0].value}=${r.metricValues[0].value}`).join(", "))
} catch (e) { console.log("  GA4 error:", e.message) }

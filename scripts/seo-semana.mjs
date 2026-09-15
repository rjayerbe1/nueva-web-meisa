/**
 * Reporte SEO SEMANAL — semana a semana (4 semanas) + 28d vs 28d previos.
 * Ajusta por el lag de Search Console (~3 días).
 */
import fs from "node:fs"
import path from "node:path"
import { JWT } from "google-auth-library"

const envPath = path.join(process.cwd(), ".env.local")
const env = {}
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (!m) continue
  let v = m[2].trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
  env[m[1]] = v
}
const creds = JSON.parse(env.ANALYTICS_SA_KEY_JSON)
const jwt = new JWT({
  email: creds.client_email,
  key: creds.private_key.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/analytics.readonly", "https://www.googleapis.com/auth/webmasters.readonly"],
})
const { token } = await jwt.getAccessToken()
const SITE = env.SC_SITE_URL, PROP = env.GA_PROPERTY_ID
const SC = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`

async function post(url, body) {
  const res = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return res.json()
}
async function get(url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return res.json()
}
const d = (n) => { const x = new Date(); x.setDate(x.getDate() - n); return x.toISOString().slice(0, 10) }
const pct = (a, b) => b === 0 ? "n/a" : `${a >= b ? "+" : ""}${(((a - b) / b) * 100).toFixed(0)}%`

// --- cuál es el último día con datos (lag SC) ---
const daily = await post(SC, { startDate: d(12), endDate: d(0), dimensions: ["date"], rowLimit: 20 })
const lastDay = (daily.rows ?? []).map(r => r.keys[0]).sort().pop()
console.log("Hoy:", d(0), "| último día con datos en SC:", lastDay)
const lagDays = Math.round((new Date(d(0)) - new Date(lastDay)) / 86400000)
console.log("Lag SC:", lagDays, "días\n")

// ventanas semanales ancladas al último día con datos
const W = []
for (let i = 0; i < 5; i++) W.push({ label: i === 0 ? "SEMANA ACTUAL" : `hace ${i} sem`, start: d(lagDays + 6 + i * 7), end: d(lagDays + i * 7) })

console.log("=== SEMANA A SEMANA (Search Console) ===")
const weekTotals = []
for (const w of W) {
  const r = (await post(SC, { startDate: w.start, endDate: w.end, rowLimit: 1 })).rows?.[0] ?? {}
  weekTotals.push({ ...w, clicks: r.clicks ?? 0, impressions: r.impressions ?? 0, ctr: (r.ctr ?? 0) * 100, position: r.position ?? 0 })
}
for (let i = 0; i < weekTotals.length; i++) {
  const w = weekTotals[i], prev = weekTotals[i + 1]
  const delta = prev ? ` | vs ant: clicks ${pct(w.clicks, prev.clicks)}, impr ${pct(w.impressions, prev.impressions)}` : ""
  console.log(`  ${w.label.padEnd(14)} ${w.start}→${w.end}: clicks ${String(w.clicks).padStart(4)} | impr ${String(w.impressions).padStart(5)} | CTR ${w.ctr.toFixed(1)}% | pos ${w.position.toFixed(1)}${delta}`)
}

console.log("\n=== 28 DÍAS vs 28 DÍAS PREVIOS ===")
const cur28 = (await post(SC, { startDate: d(lagDays + 27), endDate: d(lagDays), rowLimit: 1 })).rows?.[0] ?? {}
const prev28 = (await post(SC, { startDate: d(lagDays + 55), endDate: d(lagDays + 28), rowLimit: 1 })).rows?.[0] ?? {}
console.log(`  actual  (${d(lagDays + 27)}→${d(lagDays)}): clicks ${cur28.clicks} | impr ${cur28.impressions} | CTR ${((cur28.ctr||0)*100).toFixed(1)}% | pos ${(cur28.position||0).toFixed(1)}`)
console.log(`  previo  (${d(lagDays + 55)}→${d(lagDays + 28)}): clicks ${prev28.clicks} | impr ${prev28.impressions} | CTR ${((prev28.ctr||0)*100).toFixed(1)}% | pos ${(prev28.position||0).toFixed(1)}`)
console.log(`  Δ clicks ${pct(cur28.clicks, prev28.clicks)} | Δ impr ${pct(cur28.impressions, prev28.impressions)} | Δ pos ${(prev28.position - cur28.position).toFixed(1)} (positivo = mejora)`)
console.log(`  BASE (2026-06-12): 113 clicks / 1352 impr / pos 7.4 → hoy ${pct(cur28.clicks,113)} clicks, ${pct(cur28.impressions,1352)} impr`)

const w0 = { s: d(lagDays + 6), e: d(lagDays) }, w1 = { s: d(lagDays + 13), e: d(lagDays + 7) }

console.log("\n=== TOP QUERIES — semana actual (con delta vs semana previa) ===")
const qc = await post(SC, { startDate: w0.s, endDate: w0.e, dimensions: ["query"], rowLimit: 300 })
const qp = await post(SC, { startDate: w1.s, endDate: w1.e, dimensions: ["query"], rowLimit: 300 })
const pmap = new Map((qp.rows ?? []).map(r => [r.keys[0], r]))
const rows = (qc.rows ?? [])
for (const r of rows.slice(0, 30)) {
  const p = pmap.get(r.keys[0])
  const dpos = p ? (p.position - r.position) : null
  const tag = !p ? " 🆕" : dpos > 1 ? ` ↑${dpos.toFixed(1)}` : dpos < -1 ? ` ↓${Math.abs(dpos).toFixed(1)}` : ""
  console.log(`  pos ${r.position.toFixed(1).padStart(5)} impr ${String(r.impressions).padStart(4)} clk ${String(r.clicks).padStart(3)}  ${r.keys[0]}${tag}`)
}
console.log(`\n  queries distintas esta semana: ${rows.length} | semana previa: ${(qp.rows ?? []).length}`)
const nuevas = rows.filter(r => !pmap.has(r.keys[0]))
console.log(`  queries NUEVAS esta semana: ${nuevas.length} (top por impresiones):`)
for (const r of nuevas.sort((a,b)=>b.impressions-a.impressions).slice(0, 12)) console.log(`     pos ${r.position.toFixed(1).padStart(5)} impr ${String(r.impressions).padStart(4)} clk ${r.clicks}  ${r.keys[0]}`)

console.log("\n=== TOP PÁGINAS — semana actual ===")
const pc = await post(SC, { startDate: w0.s, endDate: w0.e, dimensions: ["page"], rowLimit: 100 })
const pp = await post(SC, { startDate: w1.s, endDate: w1.e, dimensions: ["page"], rowLimit: 100 })
const ppmap = new Map((pp.rows ?? []).map(r => [r.keys[0], r]))
for (const r of (pc.rows ?? []).slice(0, 30)) {
  const p = ppmap.get(r.keys[0])
  const dclk = p ? r.clicks - p.clicks : null
  const tag = !p ? " 🆕" : dclk > 0 ? ` (+${dclk} clk)` : dclk < 0 ? ` (${dclk} clk)` : ""
  console.log(`  pos ${r.position.toFixed(1).padStart(5)} impr ${String(r.impressions).padStart(5)} clk ${String(r.clicks).padStart(3)}  ${r.keys[0].replace("https://meisa.com.co","")}${tag}`)
}
console.log(`\n  páginas con impresiones esta semana: ${(pc.rows ?? []).length} | previa: ${(pp.rows ?? []).length}`)

console.log("\n=== KEYWORDS OBJETIVO (semana actual vs previa) ===")
const objetivo = ["estructuras metalicas colombia","estructuras metalicas","meisa","precio estructura metalica por kg","estructura metalica precio m2","empresas de estructuras metalicas","cubierta metalica precio m2","puentes metalicos","mezzanine","estructura metalica bodega"]
for (const k of objetivo) {
  const hit = rows.filter(r => r.keys[0].includes(k))
  if (!hit.length) { console.log(`  "${k}": sin impresiones esta semana`); continue }
  const agg = hit.reduce((a,r)=>({i:a.i+r.impressions,c:a.c+r.clicks,ps:a.ps+r.position*r.impressions}),{i:0,c:0,ps:0})
  const prevHit = (qp.rows ?? []).filter(r => r.keys[0].includes(k))
  const pagg = prevHit.reduce((a,r)=>({i:a.i+r.impressions,ps:a.ps+r.position*r.impressions}),{i:0,ps:0})
  const posNow = agg.ps/agg.i, posPrev = pagg.i ? pagg.ps/pagg.i : null
  console.log(`  "${k}": ${hit.length} variantes | impr ${agg.i} | clk ${agg.c} | pos ~${posNow.toFixed(1)}${posPrev ? ` (previa ~${posPrev.toFixed(1)})` : ""}`)
}

console.log("\n=== SITEMAP ===")
try {
  const sm = await get(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps`)
  for (const s of sm.sitemap ?? []) console.log(`  ${s.path}\n    lastSubmitted ${s.lastSubmitted ?? "-"} | lastDownloaded ${s.lastDownloaded ?? "NUNCA"} | warn ${s.warnings ?? 0} | err ${s.errors ?? 0}`)
} catch (e) { console.log("  error:", e.message) }

console.log("\n=== GA4 — semana actual vs previa ===")
async function ga4(start, end, extra = {}) {
  return post(`https://analyticsdata.googleapis.com/v1beta/properties/${PROP}:runReport`, { dateRanges: [{ startDate: start, endDate: end }], ...extra })
}
try {
  for (const [lbl, s, e] of [["semana actual", "7daysAgo", "today"], ["semana previa", "14daysAgo", "8daysAgo"]]) {
    const r = await ga4(s, e, { metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }] })
    const v = r.rows?.[0]?.metricValues ?? []
    const ch = await ga4(s, e, { dimensions: [{ name: "sessionDefaultChannelGroup" }], metrics: [{ name: "sessions" }], orderBys: [{ metric: { metricName: "sessions" }, desc: true }] })
    const lead = await ga4(s, e, { metrics: [{ name: "eventCount" }], dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "generate_lead" } } } })
    console.log(`  ${lbl}: usuarios ${v[0]?.value ?? 0} | sesiones ${v[1]?.value ?? 0} | vistas ${v[2]?.value ?? 0} | generate_lead ${lead.rows?.[0]?.metricValues?.[0]?.value ?? 0}`)
    console.log(`     canales: ${(ch.rows ?? []).map(r => `${r.dimensionValues[0].value}=${r.metricValues[0].value}`).join(", ")}`)
  }
  const ai = await ga4("28daysAgo", "today", { dimensions: [{ name: "sessionSource" }], metrics: [{ name: "sessions" }], orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 25 })
  const aiSrc = (ai.rows ?? []).filter(r => /chatgpt|perplexity|gemini|copilot|claude|bing|openai/i.test(r.dimensionValues[0].value))
  console.log(`  IA/Bing (28d): ${aiSrc.map(r => `${r.dimensionValues[0].value}=${r.metricValues[0].value}`).join(", ") || "0"}`)
} catch (e) { console.log("  GA4 error:", e.message) }

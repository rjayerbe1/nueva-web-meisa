/**
 * Estado de indexación de las 13 landings SEO vía URL Inspection API (read-only, no gasta cuota de "Solicitar indexación").
 * Uso: node scripts/seo-index-status.mjs
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
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
})
const { token } = await jwt.getAccessToken()
const SITE = env.SC_SITE_URL // sc-domain:meisa.com.co

const LANDINGS = [
  "/soluciones/estructura-metalica-para-bodegas",
  "/soluciones/puentes-metalicos",
  "/soluciones/cubiertas-metalicas",
  "/soluciones/estructura-metalica-centros-comerciales",
  "/soluciones/estructura-metalica-escenarios-deportivos",
  "/soluciones/edificios-en-estructura-metalica",
  "/precios-estructuras-metalicas",
  "/estructura-metalica-vs-concreto",
  "/tipos-de-estructuras-metalicas",
  "/peso-estructura-metalica-por-m2",
  "/estructuras-metalicas/cali",
  "/estructuras-metalicas/bogota",
  "/estructuras-metalicas/popayan",
].map((p) => `https://meisa.com.co${p}`)

async function inspect(url) {
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE, languageCode: "es" }),
  })
  if (!res.ok) return { error: `HTTP ${res.status}: ${(await res.text()).slice(0, 200)}` }
  return res.json()
}

console.log("=== ESTADO DE INDEXACIÓN — 13 landings ===\n")
const faltan = []
for (const url of LANDINGS) {
  const r = await inspect(url)
  const short = url.replace("https://meisa.com.co", "")
  if (r.error) { console.log(`  ?? ${short}  -> ${r.error}`); continue }
  const idx = r.inspectionResult?.indexStatusResult ?? {}
  const verdict = idx.verdict ?? "?"
  const state = idx.coverageState ?? "?"
  const lastCrawl = idx.lastCrawlTime ? idx.lastCrawlTime.slice(0, 10) : "NUNCA"
  const gCanon = (idx.googleCanonical ?? "").replace("https://meisa.com.co", "") || "-"
  const indexed = verdict === "PASS" && /index/i.test(state)
  if (!indexed) faltan.push(short)
  const flag = indexed ? "✅" : "⛔"
  console.log(`  ${flag} ${short}`)
  console.log(`       verdict=${verdict} | estado="${state}" | lastCrawl=${lastCrawl} | gCanonical=${gCanon}`)
}

console.log(`\n=== RESUMEN ===`)
console.log(`Indexadas: ${LANDINGS.length - faltan.length}/${LANDINGS.length}`)
console.log(`FALTAN (${faltan.length}):`)
for (const f of faltan) console.log(`   ${f}`)

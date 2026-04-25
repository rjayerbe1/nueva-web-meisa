/**
 * Importa imágenes de la carpeta "IMAGENES STOCK BROCHURE" de Google Drive:
 * - Las sube a GCS (bucket meisa-imagenes, folder stock-brochure/<categoria>)
 * - Crea filas Media con tag drive:<fileId> (idempotente en re-corridas)
 * - Genera CSV de matching contra Proyecto
 *
 * Uso:
 *   npx tsx scripts/import-drive-stock-brochure.ts           # dry-run (solo lectura + CSV)
 *   npx tsx scripts/import-drive-stock-brochure.ts --commit  # sube a GCS + crea Media rows
 *   npx tsx scripts/import-drive-stock-brochure.ts --commit --limit 5   # limita cantidad
 */
import { readFileSync, writeFileSync } from "node:fs"
import { JWT } from "google-auth-library"
import sharp from "sharp"
import { prisma } from "../lib/prisma"
import { uploadToGcs } from "../lib/media/gcs"
import { ensureFolderPath } from "../lib/media/folder-repo"

const DRIVE_ROOT = "1MnRJWWxdes3-OlLRR0AGVUr6TND8tKWI"
const IMPERSONATE = "rjayerbe@meisa.com.co"
const SA_ENV_PATH =
  "/Users/rjayerbe/Web Development Local/reportes-produccion/reportes-produccion/functions/.env"
const REPORT_PATH = "/tmp/drive-matching-report.csv"

const COMMIT = process.argv.includes("--commit")
const LIMIT_IDX = process.argv.indexOf("--limit")
const LIMIT = LIMIT_IDX >= 0 ? Number(process.argv[LIMIT_IDX + 1]) : Infinity

/* ─── auth ─────────────────────────────────────────────────────────── */

function parseEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (!m) continue
    let [, k, v] = m
    v = v.trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    out[k] = v.replace(/\\n/g, "\n")
  }
  return out
}

async function getDriveToken(): Promise<string> {
  const env = parseEnvFile(SA_ENV_PATH)
  const jwt = new JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/drive"],
    subject: IMPERSONATE,
  })
  const { token } = await jwt.getAccessToken()
  if (!token) throw new Error("no token")
  return token
}

/* ─── drive ops ────────────────────────────────────────────────────── */

interface DriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
}

async function listChildren(parentId: string, token: string): Promise<DriveFile[]> {
  const results: DriveFile[] = []
  let pageToken: string | undefined
  do {
    const url = new URL("https://www.googleapis.com/drive/v3/files")
    url.searchParams.set("q", `'${parentId}' in parents and trashed = false`)
    url.searchParams.set("pageSize", "1000")
    url.searchParams.set("fields", "nextPageToken,files(id,name,mimeType,size)")
    if (pageToken) url.searchParams.set("pageToken", pageToken)
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    const data = (await r.json()) as { files?: DriveFile[]; nextPageToken?: string }
    results.push(...(data.files ?? []))
    pageToken = data.nextPageToken
  } while (pageToken)
  return results
}

async function downloadFile(fileId: string, token: string): Promise<Buffer> {
  const r = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!r.ok) throw new Error(`download ${fileId} failed: ${r.status}`)
  const ab = await r.arrayBuffer()
  return Buffer.from(ab)
}

/* ─── matching ─────────────────────────────────────────────────────── */

const NOISE_TOKENS = new Set([
  "foto",
  "img",
  "image",
  "imagen",
  "imagenes",
  "photo",
  "dsc",
  "wa",
  "whatsapp",
  "copia",
  "copy",
  "de",
  "la",
  "el",
  "los",
  "las",
  "del",
  "y",
  "con",
  "para",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "tif",
  "tiff",
  "gif",
  "a",
  "las",
  "pte",
  "sa",
  "sas",
  "ltda",
  "ing",
  "ings",
  "arq",
])

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
}

function tokenize(s: string): Set<string> {
  let t = stripAccents(s).toLowerCase()
  // strip file extension
  t = t.replace(/\.(jpe?g|png|webp|heic|tiff?|gif|bmp)$/i, "")
  // strip order prefixes like "1. ", "10. ", "a. "
  t = t.replace(/^[\s\-]*\d+\.\s*/g, "").replace(/^[\s\-]*[a-z]\.\s*/g, "")
  // strip WhatsApp dates: "2024-11-02 a las 12.49.27_9b6e7c36"
  t = t.replace(/\d{4}[-/]\d{2}[-/]\d{2}/g, "")
  t = t.replace(/\d{1,2}[.:]\d{2}([.:]\d{2})?/g, "")
  t = t.replace(/[0-9a-f]{8,}/g, "") // hex hashes
  // split
  const tokens = t.split(/[^a-z0-9]+/).filter((x) => x.length >= 3 && !NOISE_TOKENS.has(x))
  // also drop pure numbers
  return new Set(tokens.filter((x) => !/^\d+$/.test(x)))
}

interface Proyecto {
  id: string
  titulo: string
  cliente: string | null
  categoria: string
}

interface ProyectoIdx {
  p: Proyecto
  titleTokens: Set<string>
  clientTokens: Set<string>
  allTokens: Set<string>
}

function buildProyectoIndex(proyectos: Proyecto[]): ProyectoIdx[] {
  return proyectos.map((p) => {
    const titleTokens = tokenize(p.titulo)
    const clientTokens = tokenize(p.cliente || "")
    const allTokens = new Set([...titleTokens, ...clientTokens])
    return { p, titleTokens, clientTokens, allTokens }
  })
}

function buildIdf(idx: ProyectoIdx[]): Map<string, number> {
  const df = new Map<string, number>()
  for (const { allTokens } of idx) {
    for (const t of allTokens) df.set(t, (df.get(t) ?? 0) + 1)
  }
  const n = idx.length
  const idf = new Map<string, number>()
  for (const [t, f] of df.entries()) idf.set(t, Math.log(1 + n / f))
  return idf
}

function scoreMatch(
  imageTokens: Set<string>,
  proyectoIdx: ProyectoIdx,
  idf: Map<string, number>,
): number {
  if (imageTokens.size === 0) return 0
  let sharedWeight = 0
  let imageWeight = 0
  for (const t of imageTokens) {
    const w = idf.get(t) ?? 0.5
    imageWeight += w
    if (proyectoIdx.allTokens.has(t)) sharedWeight += w
  }
  if (imageWeight === 0) return 0
  const precision = sharedWeight / imageWeight
  let proyectoShared = 0
  let proyectoTotal = 0
  for (const t of proyectoIdx.titleTokens) {
    const w = idf.get(t) ?? 0.5
    proyectoTotal += w
    if (imageTokens.has(t)) proyectoShared += w
  }
  const recall = proyectoTotal > 0 ? proyectoShared / proyectoTotal : 0
  // F1-ish combo biased toward precision (most filenames are shorter than titles)
  return 0.7 * precision + 0.3 * recall
}

function topMatches(
  imageTokens: Set<string>,
  idx: ProyectoIdx[],
  idf: Map<string, number>,
  k = 3,
): Array<{ p: Proyecto; score: number }> {
  const scored = idx.map((pi) => ({ p: pi.p, score: scoreMatch(imageTokens, pi, idf) }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, k)
}

/* ─── main ─────────────────────────────────────────────────────────── */

function slug(s: string): string {
  return stripAccents(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function kindFromMime(mime: string): "IMAGE" | "VIDEO" | "DOC" {
  if (mime.startsWith("image/")) return "IMAGE"
  if (mime.startsWith("video/")) return "VIDEO"
  return "DOC"
}

function csvEscape(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return ""
  const s = String(v)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

async function main() {
  console.log(`Mode: ${COMMIT ? "COMMIT (sube a GCS + crea Media)" : "DRY-RUN (solo CSV)"}`)
  if (LIMIT !== Infinity) console.log(`Limit: ${LIMIT} imágenes`)
  console.log()

  const token = await getDriveToken()
  console.log("✅ Token Drive obtenido")

  // List all images across categories
  const categories = await listChildren(DRIVE_ROOT, token)
  const imageFolders = categories.filter(
    (c) => c.mimeType === "application/vnd.google-apps.folder",
  )
  const allImages: Array<DriveFile & { category: string }> = []
  for (const cat of imageFolders) {
    const children = await listChildren(cat.id, token)
    for (const ch of children) {
      if (ch.mimeType.startsWith("image/")) {
        allImages.push({ ...ch, category: cat.name })
      }
    }
  }
  console.log(`✅ ${allImages.length} imágenes en ${imageFolders.length} categorías\n`)

  // Load proyectos
  const proyectos = (await prisma.proyecto.findMany({
    select: { id: true, titulo: true, cliente: true, categoria: true },
  })) as Proyecto[]
  console.log(`✅ ${proyectos.length} proyectos en Neon`)

  const idx = buildProyectoIndex(proyectos)
  const idf = buildIdf(idx)

  // Load existing Media rows to skip already-imported Drive files
  const existingByDriveId = new Map<string, { id: string; url: string }>()
  if (COMMIT) {
    const rows = await prisma.media.findMany({
      where: { tags: { hasSome: allImages.map((i) => `drive:${i.id}`) } },
      select: { id: true, url: true, tags: true },
    })
    for (const r of rows) {
      const dtag = r.tags.find((t) => t.startsWith("drive:"))
      if (dtag) existingByDriveId.set(dtag.slice(6), { id: r.id, url: r.url })
    }
    if (existingByDriveId.size) {
      console.log(`ℹ️  ${existingByDriveId.size} ya existen en pool Media — se skipean`)
    }
  }

  // Process
  const MATCH_THRESHOLD = 0.3
  const csvLines: string[] = [
    [
      "drive_file_id",
      "drive_name",
      "category",
      "size_mb",
      "action",
      "media_id",
      "gcs_url",
      "best_match_score",
      "best_match_proyecto_id",
      "best_match_titulo",
      "alt_match_1_score",
      "alt_match_1_titulo",
      "alt_match_2_score",
      "alt_match_2_titulo",
    ].join(","),
  ]

  let uploaded = 0
  let skipped = 0
  let matched = 0
  let unmatched = 0
  const processed = allImages.slice(0, LIMIT)

  for (let i = 0; i < processed.length; i++) {
    const img = processed[i]
    const imgTokens = tokenize(img.name)
    const topK = topMatches(imgTokens, idx, idf, 3)
    const best = topK[0]
    const hasMatch = best && best.score >= MATCH_THRESHOLD
    if (hasMatch) matched++
    else unmatched++

    let action = "dry-run"
    let mediaId = ""
    let gcsUrl = ""

    if (COMMIT) {
      const existing = existingByDriveId.get(img.id)
      if (existing) {
        action = "skipped"
        mediaId = existing.id
        gcsUrl = existing.url
        skipped++
      } else {
        try {
          const buf = await downloadFile(img.id, token)
          const folder = `stock-brochure/${slug(img.category)}`
          await ensureFolderPath(folder)
          const up = await uploadToGcs(buf, img.name, img.mimeType, folder)

          let width: number | null = null
          let height: number | null = null
          try {
            const meta = await sharp(buf).metadata()
            width = meta.width ?? null
            height = meta.height ?? null
          } catch {}

          const created = await prisma.media.create({
            data: {
              url: up.url,
              pathGcs: up.pathGcs,
              fileName: up.fileName,
              contentType: up.contentType,
              kind: kindFromMime(img.mimeType),
              size: up.size,
              width,
              height,
              folder,
              title: img.name.replace(/\.[^.]+$/, ""),
              tags: ["stock-brochure", slug(img.category), `drive:${img.id}`],
            },
            select: { id: true },
          })
          mediaId = created.id
          gcsUrl = up.url
          action = "uploaded"
          uploaded++
        } catch (e) {
          action = `error: ${(e as Error).message}`
          console.error(`❌ ${img.name}:`, (e as Error).message)
        }
      }
    }

    csvLines.push(
      [
        img.id,
        csvEscape(img.name),
        csvEscape(img.category),
        img.size ? (Number(img.size) / 1e6).toFixed(2) : "",
        action,
        mediaId,
        gcsUrl,
        hasMatch ? best.score.toFixed(3) : "",
        hasMatch ? best.p.id : "",
        hasMatch ? csvEscape(best.p.titulo) : "",
        topK[1] ? topK[1].score.toFixed(3) : "",
        topK[1] ? csvEscape(topK[1].p.titulo) : "",
        topK[2] ? topK[2].score.toFixed(3) : "",
        topK[2] ? csvEscape(topK[2].p.titulo) : "",
      ].join(","),
    )

    const badge = hasMatch ? `→ ${best.p.titulo.slice(0, 50)} (${best.score.toFixed(2)})` : "— sin match"
    if (COMMIT || i < 20 || i % 50 === 0) {
      console.log(
        `[${(i + 1).toString().padStart(3)}/${processed.length}] ${img.category}/${img.name.slice(0, 55).padEnd(55)} ${badge}`,
      )
    }
  }

  writeFileSync(REPORT_PATH, csvLines.join("\n"))

  console.log()
  console.log("━".repeat(60))
  console.log(`Total procesadas:  ${processed.length}`)
  console.log(`  Con match (≥${MATCH_THRESHOLD}):  ${matched}`)
  console.log(`  Sin match:        ${unmatched}`)
  if (COMMIT) {
    console.log(`  Subidas a GCS:    ${uploaded}`)
    console.log(`  Skipeadas (ya existían): ${skipped}`)
  }
  console.log(`\n📄 CSV: ${REPORT_PATH}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Fatal:", e)
  process.exit(1)
})

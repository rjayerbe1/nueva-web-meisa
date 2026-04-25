/**
 * Importa imágenes de la carpeta Drive "Fotos edificios" (1_-CaelfListNDMaEYWExLe9UUD14u0wD):
 * - 33 subcarpetas "Edificio N: Nombre Proyecto" — cada carpeta = un proyecto
 * - Sube cada imagen a GCS bajo fotos-edificios/<slug>/
 * - Crea Media rows con proyectoIds ya asignado (matching por NOMBRE DE CARPETA, no filename)
 * - Idempotente vía tag drive:<fileId>
 *
 * Uso:
 *   npx tsx scripts/import-drive-fotos-edificios.ts              # dry-run (muestra tabla de match)
 *   npx tsx scripts/import-drive-fotos-edificios.ts --commit     # sube todo
 *   npx tsx scripts/import-drive-fotos-edificios.ts --commit --min 0.4   # ajusta umbral (default 0.4)
 */
import { readFileSync } from "node:fs"
import { JWT } from "google-auth-library"
import sharp from "sharp"
import { prisma } from "../lib/prisma"
import { uploadToGcs } from "../lib/media/gcs"
import { ensureFolderPath } from "../lib/media/folder-repo"

const DRIVE_ROOT = "1_-CaelfListNDMaEYWExLe9UUD14u0wD"
const IMPERSONATE = "rjayerbe@meisa.com.co"
const SA_ENV_PATH =
  "/Users/rjayerbe/Web Development Local/reportes-produccion/reportes-produccion/functions/.env"
const COMMIT = process.argv.includes("--commit")
const MIN_IDX = process.argv.indexOf("--min")
const MIN_SCORE = MIN_IDX >= 0 ? Number(process.argv[MIN_IDX + 1]) : 0.4

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

async function getToken(): Promise<string> {
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

// Recursively collect all images inside a folder tree
async function collectImages(
  parentId: string,
  token: string,
): Promise<DriveFile[]> {
  const children = await listChildren(parentId, token)
  const images = children.filter((c) => c.mimeType.startsWith("image/"))
  const subfolders = children.filter((c) => c.mimeType === "application/vnd.google-apps.folder")
  for (const sf of subfolders) {
    images.push(...(await collectImages(sf.id, token)))
  }
  return images
}

async function downloadFile(fileId: string, token: string): Promise<Buffer> {
  const r = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!r.ok) throw new Error(`download ${fileId}: ${r.status}`)
  return Buffer.from(await r.arrayBuffer())
}

/* ─── matching ─────────────────────────────────────────────────────── */

const NOISE = new Set([
  "edificio",
  "el",
  "la",
  "los",
  "las",
  "de",
  "del",
  "y",
  "con",
  "para",
  "sa",
  "sas",
  "ltda",
  "ing",
  "arq",
  "cc",
  "tipo",
])

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
}

function tokenizeFolderName(s: string): Set<string> {
  // strip "Edificio N:" / "31." prefix
  let t = stripAccents(s).toLowerCase()
  t = t.replace(/^\s*edificio\s*\d+\s*[:.]\s*/i, "")
  t = t.replace(/^\s*\d+\.\s*/i, "")
  const toks = t.split(/[^a-z0-9]+/).filter((x) => x.length >= 3 && !NOISE.has(x))
  return new Set(toks.filter((x) => !/^\d+$/.test(x)))
}

function tokenizeProyecto(titulo: string, cliente: string | null): Set<string> {
  const combined = `${titulo} ${cliente ?? ""}`
  const toks = stripAccents(combined)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((x) => x.length >= 3 && !NOISE.has(x))
  return new Set(toks.filter((x) => !/^\d+$/.test(x)))
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
  allTokens: Set<string>
}

function idfFor(proyectoIdx: ProyectoIdx[]): Map<string, number> {
  const df = new Map<string, number>()
  for (const { allTokens } of proyectoIdx) {
    for (const t of allTokens) df.set(t, (df.get(t) ?? 0) + 1)
  }
  const n = proyectoIdx.length
  const out = new Map<string, number>()
  for (const [t, f] of df.entries()) out.set(t, Math.log(1 + n / f))
  return out
}

function score(folderTokens: Set<string>, pi: ProyectoIdx, idf: Map<string, number>): number {
  if (folderTokens.size === 0) return 0
  let shared = 0
  let total = 0
  for (const t of folderTokens) {
    const w = idf.get(t) ?? 0.5
    total += w
    if (pi.allTokens.has(t)) shared += w
  }
  const precision = total > 0 ? shared / total : 0
  // also give a recall component vs title tokens (folders are short, titles longer)
  let pShared = 0
  let pTotal = 0
  for (const t of pi.titleTokens) {
    const w = idf.get(t) ?? 0.5
    pTotal += w
    if (folderTokens.has(t)) pShared += w
  }
  const recall = pTotal > 0 ? pShared / pTotal : 0
  return 0.6 * precision + 0.4 * recall
}

/* ─── helpers ──────────────────────────────────────────────────────── */

function slug(s: string): string {
  return stripAccents(s)
    .toLowerCase()
    .replace(/:/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function kindFromMime(mime: string): "IMAGE" | "VIDEO" | "DOC" {
  if (mime.startsWith("image/")) return "IMAGE"
  if (mime.startsWith("video/")) return "VIDEO"
  return "DOC"
}

/* ─── main ─────────────────────────────────────────────────────────── */

async function main() {
  console.log(`Mode: ${COMMIT ? "COMMIT" : "DRY-RUN"} · Min match score: ${MIN_SCORE}\n`)

  const token = await getToken()
  console.log("✅ Token Drive")

  const topChildren = await listChildren(DRIVE_ROOT, token)
  const folders = topChildren.filter((c) => c.mimeType === "application/vnd.google-apps.folder")
  console.log(`✅ ${folders.length} carpetas\n`)

  const proyectos = (await prisma.proyecto.findMany({
    select: { id: true, titulo: true, cliente: true, categoria: true },
  })) as Proyecto[]
  const proyectoIdx: ProyectoIdx[] = proyectos.map((p) => {
    const titleTokens = tokenizeProyecto(p.titulo, null)
    const allTokens = tokenizeProyecto(p.titulo, p.cliente)
    return { p, titleTokens, allTokens }
  })
  const idf = idfFor(proyectoIdx)
  console.log(`✅ ${proyectos.length} proyectos en Neon\n`)

  // For each folder: match + collect images
  interface FolderInfo {
    folder: DriveFile
    tokens: Set<string>
    bestMatch: { p: Proyecto; score: number } | null
    alt: Array<{ p: Proyecto; score: number }>
    images: DriveFile[]
  }
  const infos: FolderInfo[] = []
  for (const f of folders) {
    const tokens = tokenizeFolderName(f.name)
    const scored = proyectoIdx
      .map((pi) => ({ p: pi.p, score: score(tokens, pi, idf) }))
      .sort((a, b) => b.score - a.score)
    const best = scored[0] && scored[0].score > 0 ? scored[0] : null
    const images = await collectImages(f.id, token)
    infos.push({ folder: f, tokens, bestMatch: best, alt: scored.slice(1, 3), images })
  }

  // Print table
  console.log(
    `${"Carpeta".padEnd(52)} ${"imgs".padStart(4)} ${"score".padStart(5)}  → Proyecto`,
  )
  console.log("─".repeat(130))
  let totalImgs = 0
  let autoAssign = 0
  let noMatch = 0
  for (const info of infos) {
    totalImgs += info.images.length
    const m = info.bestMatch
    const passes = m && m.score >= MIN_SCORE
    const badge = passes ? "✓" : m && m.score > 0 ? "~" : "✗"
    if (passes) autoAssign += info.images.length
    if (!passes && info.images.length > 0) noMatch += info.images.length
    const proyStr = m ? `${m.p.titulo.slice(0, 50)}` : "(sin match)"
    console.log(
      `${info.folder.name.slice(0, 52).padEnd(52)} ${String(info.images.length).padStart(4)} ${(m?.score ?? 0).toFixed(2).padStart(5)} ${badge} ${proyStr}`,
    )
    if (!passes && m && m.score > 0.15 && info.images.length > 0) {
      // show alt suggestion
      const alt = info.alt[0]
      if (alt && alt.score > 0) {
        console.log(
          `${" ".repeat(52)}   alt: ${alt.score.toFixed(2)} ${alt.p.titulo.slice(0, 50)}`,
        )
      }
    }
  }
  console.log("─".repeat(130))
  console.log(`Total imágenes: ${totalImgs}`)
  console.log(`  Auto-asignables (score >= ${MIN_SCORE}): ${autoAssign}`)
  console.log(`  Sin match: ${noMatch}`)

  if (!COMMIT) {
    console.log("\n(sin --commit no se sube nada. Revisa el match y corre con --commit si está OK)")
    await prisma.$disconnect()
    return
  }

  // COMMIT
  console.log("\n━━━ SUBIENDO ━━━\n")

  // Existing idempotency check
  const allDriveIds = infos.flatMap((i) => i.images.map((img) => img.id))
  const existing = await prisma.media.findMany({
    where: { tags: { hasSome: allDriveIds.map((id) => `drive:${id}`) } },
    select: { id: true, url: true, tags: true },
  })
  const existingByDrive = new Map<string, string>()
  for (const m of existing) {
    const t = m.tags.find((x) => x.startsWith("drive:"))
    if (t) existingByDrive.set(t.slice(6), m.id)
  }
  if (existingByDrive.size) console.log(`ℹ️  ${existingByDrive.size} ya existían — skipeadas\n`)

  let uploaded = 0
  let skipped = 0
  let errors = 0
  let assigned = 0

  for (const info of infos) {
    if (info.images.length === 0) continue
    const passes = info.bestMatch && info.bestMatch.score >= MIN_SCORE
    const proyectoId = passes ? info.bestMatch!.p.id : null
    const folderPath = `fotos-edificios/${slug(info.folder.name)}`
    await ensureFolderPath(folderPath)

    console.log(
      `📁 ${info.folder.name} — ${info.images.length} imgs${passes ? ` → ${info.bestMatch!.p.titulo}` : " (sin asignar)"}`,
    )

    for (let i = 0; i < info.images.length; i++) {
      const img = info.images[i]
      if (existingByDrive.has(img.id)) {
        skipped++
        continue
      }
      try {
        const buf = await downloadFile(img.id, token)
        const up = await uploadToGcs(buf, img.name, img.mimeType, folderPath)
        let width: number | null = null
        let height: number | null = null
        try {
          const meta = await sharp(buf).metadata()
          width = meta.width ?? null
          height = meta.height ?? null
        } catch {}
        await prisma.media.create({
          data: {
            url: up.url,
            pathGcs: up.pathGcs,
            fileName: up.fileName,
            contentType: up.contentType,
            kind: kindFromMime(img.mimeType),
            size: up.size,
            width,
            height,
            folder: folderPath,
            title: img.name.replace(/\.[^.]+$/, ""),
            tags: ["fotos-edificios", slug(info.folder.name), `drive:${img.id}`],
            proyectoIds: proyectoId ? [proyectoId] : [],
          },
        })
        uploaded++
        if (proyectoId) assigned++
        process.stdout.write(`\r    [${i + 1}/${info.images.length}] ${img.name.slice(0, 50)}${" ".repeat(20)}`)
      } catch (e) {
        errors++
        console.error(`\n  ❌ ${img.name}: ${(e as Error).message}`)
      }
    }
    process.stdout.write(`\r    ✓ ${info.images.length} procesadas${" ".repeat(60)}\n`)
  }

  console.log("\n" + "━".repeat(60))
  console.log(`Subidas:     ${uploaded}`)
  console.log(`  con proyecto pre-asignado: ${assigned}`)
  console.log(`  sin asignar:               ${uploaded - assigned}`)
  console.log(`Skipeadas (ya existían): ${skipped}`)
  if (errors) console.log(`Errores: ${errors}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Fatal:", e)
  process.exit(1)
})

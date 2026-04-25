/**
 * Recovery comprensivo: escanea TODAS las columnas text/jsonb de TODAS las tablas
 * en busca de paths "/images/*" o "/videos/*", recupera cada archivo de git history
 * (commit 7f8a0a7^), los sube a GCS, y actualiza:
 *   · Columnas text: reemplazo simple del valor
 *   · Columnas jsonb (arrays/objects): reemplazo de las strings que matchean
 *   · Tabla `media`: actualiza url + pathGcs
 *
 * Uso:
 *   npx tsx scripts/recover-all-broken-refs.ts            # dry-run
 *   npx tsx scripts/recover-all-broken-refs.ts --commit
 */
import { execFileSync } from "node:child_process"
import { prisma } from "../lib/prisma"
import { uploadToGcs } from "../lib/media/gcs"
import { ensureFolderPath } from "../lib/media/folder-repo"

const SOURCE_COMMIT = "7f8a0a7^"
const REPO_DIR = "/Users/rjayerbe/Web Development Local/meisa.com.co/nueva-web-meisa"
const COMMIT = process.argv.includes("--commit")

function readFromGit(commitPath: string): Buffer | null {
  try {
    return execFileSync("git", ["show", commitPath], {
      cwd: REPO_DIR,
      maxBuffer: 200 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    })
  } catch {
    return null
  }
}

function contentTypeFromExt(p: string): string {
  const ext = p.toLowerCase().split(".").pop() ?? ""
  const map: Record<string, string> = {
    webp: "image/webp",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    mp4: "video/mp4",
    mov: "video/quicktime",
    webm: "video/webm",
    pdf: "application/pdf",
  }
  return map[ext] ?? "application/octet-stream"
}

function gcsFolderForPath(path: string): string {
  if (path.startsWith("/videos/")) {
    const parts = path.split("/").filter(Boolean) // ["videos", "x.mp4"] or ["videos", "subdir", ...]
    return parts.length >= 3 ? `videos/${parts[1]}` : "videos"
  }
  const parts = path.split("/").filter(Boolean) // ["images", "clients", "x.webp"] or ["images", "x.webp"]
  if (parts[0] !== "images") return "general"
  if (parts.length === 2) return "general"
  if (parts[1] === "clients") return "clientes"
  return parts[1]
}

function kindFromContentType(ct: string): "IMAGE" | "VIDEO" | "DOC" {
  if (ct.startsWith("video/")) return "VIDEO"
  if (ct.startsWith("image/")) return "IMAGE"
  return "DOC"
}

interface ScanCol {
  table: string
  column: string
  type: string
}

interface Hit {
  table: string
  column: string
  type: string
  id: string
  raw: string
  paths: string[] // distinct paths found in this value
}

const PATH_REGEX = /\/(images|videos)\/[^"',\s\)\]]+/g

function extractPaths(s: string): string[] {
  if (!s) return []
  const out = new Set<string>()
  let m: RegExpExecArray | null
  PATH_REGEX.lastIndex = 0
  while ((m = PATH_REGEX.exec(s)) !== null) {
    out.add(m[0])
  }
  return [...out]
}

async function main() {
  console.log(`Mode: ${COMMIT ? "COMMIT" : "DRY-RUN"}\n`)

  // 1. Discover columns
  const cols = await prisma.$queryRawUnsafe<ScanCol[]>(`
    SELECT table_name AS table, column_name AS column, data_type AS type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type IN ('text', 'character varying', 'character', 'jsonb')
    ORDER BY table_name, column_name
  `)

  // 2. Find hits
  const byTable = new Map<string, ScanCol[]>()
  for (const c of cols) {
    if (!byTable.has(c.table)) byTable.set(c.table, [])
    byTable.get(c.table)!.push(c)
  }

  const hits: Hit[] = []
  for (const [table, columns] of byTable.entries()) {
    if (!columns.find((c) => c.column === "id")) continue
    for (const c of columns) {
      try {
        let rows: Array<{ id: string; v: string | null }> = []
        if (c.type === "jsonb") {
          rows = await prisma.$queryRawUnsafe(
            `SELECT id, "${c.column}"::text AS v FROM "${table}"
             WHERE "${c.column}"::text LIKE '%/images/%'
                OR "${c.column}"::text LIKE '%/videos/%'`,
          )
        } else {
          rows = await prisma.$queryRawUnsafe(
            `SELECT id, "${c.column}" AS v FROM "${table}"
             WHERE "${c.column}" LIKE '/images/%'
                OR "${c.column}" LIKE '/videos/%'
                OR "${c.column}" LIKE '%/images/%'
                OR "${c.column}" LIKE '%/videos/%'`,
          )
        }
        for (const r of rows) {
          if (!r.v) continue
          const paths = extractPaths(r.v)
          if (paths.length === 0) continue
          hits.push({ table, column: c.column, type: c.type, id: r.id, raw: r.v, paths })
        }
      } catch {
        /* skip non-queryable columns */
      }
    }
  }

  console.log(`Hits: ${hits.length} filas con paths rotos`)
  const allPaths = new Set<string>()
  for (const h of hits) for (const p of h.paths) allPaths.add(p)
  console.log(`Paths únicos: ${allPaths.size}\n`)

  // 3. Recover each unique path from git → upload to GCS
  const gcsByOldPath = new Map<string, string>()
  let gitOk = 0
  let gitMissing: string[] = []

  if (COMMIT) {
    const folders = new Set<string>()
    for (const p of allPaths) folders.add(gcsFolderForPath(p))
    for (const f of folders) await ensureFolderPath(f)
  }

  let i = 0
  for (const oldPath of allPaths) {
    i++
    const buf = readFromGit(`${SOURCE_COMMIT}:public${oldPath}`)
    if (!buf) {
      gitMissing.push(oldPath)
      continue
    }
    gitOk++

    if (!COMMIT) {
      gcsByOldPath.set(oldPath, "<would-upload>")
      continue
    }

    const folder = gcsFolderForPath(oldPath)
    const fileName = oldPath.split("/").pop()!
    const ct = contentTypeFromExt(fileName)
    const up = await uploadToGcs(buf, fileName, ct, folder)
    gcsByOldPath.set(oldPath, up.url)
    if (i % 10 === 0 || i <= 5) {
      console.log(`[${i}/${allPaths.size}] ✅ ${oldPath} → ${folder}/`)
    }
  }
  if (gitMissing.length) {
    console.log(`\n❌ No están en git history (${gitMissing.length}):`)
    for (const p of gitMissing.slice(0, 30)) console.log(`  · ${p}`)
    if (gitMissing.length > 30) console.log(`  ... y ${gitMissing.length - 30} más`)
  } else {
    console.log(`\n✅ Todos los ${gitOk} archivos recuperados de git`)
  }

  if (!COMMIT) {
    console.log(`\n(sin --commit no se modifica nada)`)
    await prisma.$disconnect()
    return
  }

  // 4. Update DB
  console.log(`\n━━━ Actualizando DB ━━━\n`)
  let textUpdated = 0
  let jsonbUpdated = 0
  let mediaUpdated = 0
  let mediaDeletedDup = 0
  let skipped = 0
  const errs: string[] = []

  for (const h of hits) {
    let newRaw = h.raw
    let allReplaced = true
    for (const p of h.paths) {
      const newUrl = gcsByOldPath.get(p)
      if (!newUrl) {
        allReplaced = false
        continue
      }
      newRaw = newRaw.split(p).join(newUrl)
    }
    if (!allReplaced && newRaw === h.raw) {
      skipped++
      continue
    }

    try {
      if (h.table === "media") {
        const newUrl = gcsByOldPath.get(h.paths[0])
        if (!newUrl) { skipped++; continue }
        const pathGcs = newUrl.replace(/^https:\/\/storage\.googleapis\.com\/meisa-imagenes\//, "")
        try {
          await prisma.$executeRawUnsafe(
            `UPDATE media SET url = $1, "pathGcs" = $2 WHERE id = $3`,
            newUrl, pathGcs, h.id,
          )
          mediaUpdated++
        } catch (e: any) {
          if (e?.meta?.code === "23505") {
            // Duplicate URL — another Media row already points to this; consolidate by deleting this one
            await prisma.media.delete({ where: { id: h.id } })
            mediaDeletedDup++
          } else throw e
        }
      } else if (h.type === "jsonb") {
        await prisma.$executeRawUnsafe(
          `UPDATE "${h.table}" SET "${h.column}" = $1::jsonb WHERE id = $2`,
          newRaw, h.id,
        )
        jsonbUpdated++
      } else {
        await prisma.$executeRawUnsafe(
          `UPDATE "${h.table}" SET "${h.column}" = $1 WHERE id = $2`,
          newRaw, h.id,
        )
        textUpdated++
      }
    } catch (e) {
      errs.push(`${h.table}.${h.column} [${h.id}]: ${(e as Error).message}`)
    }
  }

  console.log(`Filas text actualizadas:  ${textUpdated}`)
  console.log(`Filas jsonb actualizadas: ${jsonbUpdated}`)
  console.log(`Filas media actualizadas: ${mediaUpdated}`)
  console.log(`Media duplicadas borradas: ${mediaDeletedDup}`)
  if (skipped) console.log(`Skipeadas (path no recuperado): ${skipped}`)
  if (errs.length) {
    console.log(`\nErrores (${errs.length}):`)
    for (const e of errs.slice(0, 10)) console.log(`  · ${e}`)
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

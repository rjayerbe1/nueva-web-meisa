/**
 * Sube todo el contenido de /public/images/** y /public/videos/** a GCS
 * en el bucket `meisa-imagenes`, preservando la estructura de carpetas
 * bajo `site/`.
 *
 * Ej:
 *   public/images/valores/efectividad.webp → gs://meisa-imagenes/site/valores/efectividad.webp
 *   public/videos/construccion-civil.mp4   → gs://meisa-imagenes/site/videos/construccion-civil.mp4
 *   public/videos/hero/logo-intro-desktop.mp4 → gs://meisa-imagenes/site/hero/logo-intro-desktop.mp4
 *
 * Para cada archivo:
 *   - Sube a GCS (idempotente — sobrescribe mismo path)
 *   - Upsert Media pool
 *
 * No borra los archivos locales. Uso:
 *   npx tsx scripts/upload-all-public-to-gcs.ts [--dry-run]
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })

import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { Storage } from "@google-cloud/storage"
import { MediaKind, Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma"

const dryRun = process.argv.includes("--dry-run")

const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID || "meisa-web-prod-2025"
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || "meisa-imagenes"
const PUBLIC_DIR = path.join(process.cwd(), "public")

const CONTENT_TYPE_MAP: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".pdf": "application/pdf",
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) files.push(...(await walk(full)))
    else files.push(full)
  }
  return files
}

async function main() {
  const candidates = [
    path.join(PUBLIC_DIR, "images"),
    path.join(PUBLIC_DIR, "videos"),
  ]

  const allFiles: string[] = []
  for (const c of candidates) {
    try {
      allFiles.push(...(await walk(c)))
    } catch {
      /* folder may not exist */
    }
  }

  // Filtrar lo que no nos interesa (source maps, temp, etc.)
  const files = allFiles.filter((f) => {
    const name = path.basename(f)
    if (name.startsWith(".")) return false
    if (name === "Thumbs.db" || name === ".DS_Store") return false
    return true
  })

  console.log(`\n📦 Archivos encontrados: ${files.length}`)
  console.log(`   Dry-run: ${dryRun}\n`)

  if (files.length === 0) {
    console.log("Nada para subir.")
    await prisma.$disconnect()
    return
  }

  // Preview
  if (dryRun) {
    for (const f of files.slice(0, 10)) {
      const rel = path.relative(PUBLIC_DIR, f).replace(/^(images|videos)\//, "")
      console.log(`   ${f.replace(PUBLIC_DIR + "/", "")} → site/${rel}`)
    }
    if (files.length > 10) console.log(`   ... y ${files.length - 10} más`)
    await prisma.$disconnect()
    return
  }

  const storage = new Storage({ projectId: GCS_PROJECT_ID })
  const bucket = storage.bucket(GCS_BUCKET_NAME)

  let ok = 0
  let fail = 0
  let bytesUploaded = 0

  for (let i = 0; i < files.length; i++) {
    const local = files[i]
    const relFromPublic = path.relative(PUBLIC_DIR, local)
    // Quitar el prefijo images/ o videos/ para montar en site/<resto>
    const inner = relFromPublic.replace(/^(images|videos)\//, "")
    const gcsPath = `site/${inner}`
    const filename = path.basename(local)
    const ext = path.extname(local).toLowerCase()
    const contentType = CONTENT_TYPE_MAP[ext] ?? "application/octet-stream"

    try {
      const buffer = await readFile(local)
      await bucket.file(gcsPath).save(buffer, {
        metadata: {
          contentType,
          cacheControl: "public, max-age=31536000, immutable",
        },
        public: true,
      })

      // Dims (solo para imágenes raster)
      let width: number | null = null
      let height: number | null = null
      if (contentType.startsWith("image/") && contentType !== "image/svg+xml") {
        try {
          const meta = await sharp(buffer).metadata()
          width = meta.width ?? null
          height = meta.height ?? null
        } catch {
          // ignore
        }
      }

      const url = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${gcsPath}`
      const folder = path.dirname(gcsPath)
      const existing = await prisma.media.findFirst({
        where: { pathGcs: gcsPath },
        select: { id: true },
      })
      const data = {
        url,
        pathGcs: gcsPath,
        fileName: filename,
        contentType,
        kind: contentType.startsWith("video/")
          ? MediaKind.VIDEO
          : contentType === "application/pdf"
          ? MediaKind.DOCUMENT
          : MediaKind.IMAGE,
        size: buffer.byteLength,
        width,
        height,
        folder,
        title: filename,
        tags: ["site", folder.replace(/^site\//, "")],
      } satisfies Prisma.MediaCreateInput
      if (existing) {
        await prisma.media.update({ where: { id: existing.id }, data })
      } else {
        await prisma.media.create({ data })
      }

      bytesUploaded += buffer.byteLength
      ok++
      if (ok % 10 === 0 || ok === files.length) {
        const pct = ((ok * 100) / files.length).toFixed(0)
        const mb = (bytesUploaded / 1024 / 1024).toFixed(1)
        console.log(`  [${ok}/${files.length}] ${pct}% · ${mb}MB · last: ${gcsPath}`)
      }
    } catch (e) {
      fail++
      console.error(`  ❌ ${gcsPath}: ${(e as Error).message}`)
    }
  }

  const mb = (bytesUploaded / 1024 / 1024).toFixed(1)
  console.log(`\n📊 Subidos: ${ok}/${files.length} (${mb}MB) · fallidos: ${fail}`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

/**
 * Aplica las imágenes upscaled al proyecto — modo GCS unificado.
 *
 * Flujo por imagen:
 *   1. Lee PNG de <out-dir> (sufijo -imagen4x.png)
 *   2. Convierte a WebP (q=88) + detecta dimensiones reales (sharp)
 *   3. Upload a GCS en `projects/<slug>/<filename>-WxH.webp` (público)
 *   4. Upsert Media en pool (folder=`projects/<slug>`, tags=[projecto:<slug>, upscaled])
 *   5. Si la URL vieja era local (/images/...), respalda el archivo local en
 *      /public/images/.../backup-pre-upscale/ (no borra el original)
 *   6. Update ImagenProyecto.url → nueva URL GCS + width/height
 *
 * Resultado: todas las ImagenProyecto del proyecto apuntan a GCS, la media
 * library del admin las ve en la carpeta `projects/<slug>`.
 *
 * Uso:
 *   npx tsx scripts/apply-upscaled-images.ts --slug=<slug> [--out=<dir>] [--dry-run]
 *
 * Si omitís --out, default: ~/Downloads/meisa-upscale-<slug>
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })

import { readdir, readFile, mkdir, copyFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import sharp from "sharp"
import { Storage } from "@google-cloud/storage"
import { MediaKind, Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma"

const args = process.argv.slice(2)
const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1]
if (!slugArg) {
  console.error("❌ Falta --slug=<slug-del-proyecto>")
  process.exit(1)
}
const PROJECT_SLUG = slugArg

function expandPath(p: string): string {
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2))
  if (p === "~") return os.homedir()
  return path.resolve(p)
}
const outArg = args.find((a) => a.startsWith("--out="))?.split("=")[1]
const DOWNLOADS = outArg
  ? expandPath(outArg)
  : path.join(os.homedir(), "Downloads", `meisa-upscale-${PROJECT_SLUG}`)

const dryRun = args.includes("--dry-run")

const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID || "meisa-web-prod-2025"
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || "meisa-imagenes"

function renameWithDim(originalFileName: string, width: number, height: number): string {
  const base = originalFileName.replace(/\.(webp|png|jpe?g)$/i, "")
  const dim = `${width}x${height}`
  let cleaned = base.replace(/\d+x\d+/, dim).replace(/-imagen4x$/i, "")
  if (!cleaned.includes(dim)) cleaned = `${cleaned}-${dim}`
  return `${cleaned}.webp`
}

async function main() {
  console.log(`\n🔄 Aplicando upscaled al proyecto ${PROJECT_SLUG} (modo GCS)`)
  console.log(`   Fuente: ${DOWNLOADS}`)
  if (dryRun) console.log("   Modo: DRY-RUN\n")
  else console.log()

  if (!existsSync(DOWNLOADS)) {
    console.error(`❌ No existe carpeta fuente: ${DOWNLOADS}`)
    process.exit(1)
  }

  const pngs = (await readdir(DOWNLOADS)).filter((f) => f.endsWith("-imagen4x.png"))
  if (pngs.length === 0) {
    console.error(`❌ No hay PNGs con sufijo -imagen4x.png en ${DOWNLOADS}`)
    process.exit(1)
  }
  console.log(`📦 Encontrados ${pngs.length} PNGs upscaled\n`)

  const proyecto = await prisma.proyecto.findUnique({
    where: { slug: PROJECT_SLUG },
    include: { imagenes: true },
  })
  if (!proyecto) {
    console.error(`❌ Proyecto ${PROJECT_SLUG} no encontrado`)
    process.exit(1)
  }

  // Clave normalizada: sin extensión, sin sufijo de dimensiones (NxN), sin -imagen4x.
  // Así matchea igual `X-400x400.webp` que `X-1600x1600.webp` que `X-imagen4x.png`.
  function normalizeKey(name: string): string {
    return name
      .replace(/\.(webp|png|jpe?g)$/i, "")
      .replace(/-imagen4x$/i, "")
      .replace(/-\d{2,4}x\d{2,4}$/i, "")
  }

  const byKey = new Map<string, (typeof proyecto.imagenes)[number]>()
  for (const im of proyecto.imagenes) {
    const name = im.url.split("/").pop()?.split("?")[0] ?? ""
    byKey.set(normalizeKey(name), im)
  }

  const PUBLIC_DIR = path.join(process.cwd(), "public")
  const storage = new Storage({ projectId: GCS_PROJECT_ID })
  const bucket = storage.bucket(GCS_BUCKET_NAME)

  const updates: Array<{
    imagenId: string
    oldUrl: string
    newUrl: string
    gcsPath: string
    width: number
    height: number
    webpBuf: Buffer
    key: string
    originalName: string
    isLocalOrigin: boolean
  }> = []

  for (const png of pngs) {
    const pngPath = path.join(DOWNLOADS, png)
    const key = normalizeKey(png)

    const imagenRow = byKey.get(key)
    if (!imagenRow) {
      console.warn(`⚠️  No encuentro fila ImagenProyecto para ${key} — skip`)
      continue
    }

    const pngBuffer = await readFile(pngPath)
    const meta = await sharp(pngBuffer).metadata()
    const width = meta.width ?? 1600
    const height = meta.height ?? 1600

    const originalName = imagenRow.url.split("/").pop()?.split("?")[0] ?? `${key}.webp`
    const newFileName = renameWithDim(originalName, width, height)
    const gcsPath = `projects/${PROJECT_SLUG}/${newFileName}`
    const newUrl = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${gcsPath}`
    const isLocalOrigin = imagenRow.url.startsWith("/")

    const webpBuf = await sharp(pngBuffer).webp({ quality: 88, effort: 5 }).toBuffer()

    console.log(`• ${originalName}`)
    console.log(`    → ${newFileName} (${width}x${height}, ${(webpBuf.byteLength / 1024).toFixed(0)} KB)`)
    console.log(`    DB: ${imagenRow.url.slice(0, 60)}${imagenRow.url.length > 60 ? "…" : ""}`)
    console.log(`     →  ${newUrl.replace(/^https:\/\/storage\.googleapis\.com\//, "gcs://")}`)

    updates.push({
      imagenId: imagenRow.id,
      oldUrl: imagenRow.url,
      newUrl,
      gcsPath,
      width,
      height,
      webpBuf,
      key,
      originalName,
      isLocalOrigin,
    })
  }

  if (dryRun) {
    console.log(`\n✓ Dry-run completo. Saldrían ${updates.length} cambios.`)
    await prisma.$disconnect()
    return
  }

  console.log(`\n☁️  Subiendo ${updates.length} WebPs a GCS...`)
  for (const u of updates) {
    await bucket.file(u.gcsPath).save(u.webpBuf, {
      metadata: {
        contentType: "image/webp",
        cacheControl: "public, max-age=31536000, immutable",
      },
      public: true,
    })
    console.log(`  ☁️  ${u.gcsPath}`)
  }

  // Backup local files de los que tenían origen local (el original 400x400)
  console.log(`\n💾 Backup de originales locales...`)
  for (const u of updates) {
    if (!u.isLocalOrigin) continue
    const oldLocalPath = path.join(PUBLIC_DIR, u.oldUrl.replace(/^\//, ""))
    if (!existsSync(oldLocalPath)) continue
    const backupDir = path.join(path.dirname(oldLocalPath), "backup-pre-upscale")
    if (!existsSync(backupDir)) await mkdir(backupDir, { recursive: true })
    const destName = path.basename(oldLocalPath)
    await copyFile(oldLocalPath, path.join(backupDir, destName))
  }

  // Upsert Media pool
  console.log(`\n📝 Registrando en Media pool (folder=projects/${PROJECT_SLUG})...`)
  for (const u of updates) {
    const fileName = path.basename(u.gcsPath)
    const existing = await prisma.media.findFirst({
      where: { pathGcs: u.gcsPath },
      select: { id: true },
    })
    const data = {
      url: u.newUrl,
      pathGcs: u.gcsPath,
      fileName,
      contentType: "image/webp",
      kind: MediaKind.IMAGE,
      size: u.webpBuf.byteLength,
      width: u.width,
      height: u.height,
      folder: `projects/${PROJECT_SLUG}`,
      title: `${proyecto.titulo} — ${u.width}x${u.height}`,
      tags: ["proyecto:" + PROJECT_SLUG, "upscaled", "imagen-4x"],
    } satisfies Prisma.MediaCreateInput
    if (existing) {
      await prisma.media.update({ where: { id: existing.id }, data })
    } else {
      await prisma.media.create({ data })
    }
  }

  // Update ImagenProyecto rows
  console.log(`\n🔄 Actualizando ${updates.length} ImagenProyecto...`)
  for (const u of updates) {
    await prisma.imagenProyecto.update({
      where: { id: u.imagenId },
      data: { url: u.newUrl, width: u.width, height: u.height },
    })
    console.log(`  ✅ ${path.basename(u.newUrl)}`)
  }

  console.log("\n📊 Resumen")
  console.log(`  WebPs subidos a GCS:     ${updates.length}`)
  console.log(`  Media pool upserted:     ${updates.length}`)
  console.log(`  ImagenProyecto update:   ${updates.length}`)
  console.log(`  Originales respaldados:  ${updates.filter((u) => u.isLocalOrigin).length}`)
  console.log(`\n🔍 Verificá:`)
  console.log(`     http://localhost:3000/proyectos/detalle/${PROJECT_SLUG}`)
  console.log(`     /admin/media-library → folder projects/${PROJECT_SLUG}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

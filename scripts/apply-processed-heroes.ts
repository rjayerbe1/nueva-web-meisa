/**
 * Aplica las imágenes procesadas (PNG de Nano Banana Pro) a las especialidades:
 *   1. Lee cada PNG en ~/Downloads/meisa-hero-fix/procesadas/
 *   2. Convierte a WebP optimizado
 *   3. Sube a GCS bajo `site/heroes/<code>.webp`
 *   4. Actualiza categoria.especialidades[idx].imagen en DB
 *   5. Borra el PNG correspondiente en originales/ (ya está hecho)
 *
 * Uso:
 *   npx tsx scripts/apply-processed-heroes.ts
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })
import { readdir, readFile, unlink } from "node:fs/promises"
import { existsSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import sharp from "sharp"
import { Storage } from "@google-cloud/storage"
import { MediaKind } from "@prisma/client"
import { prisma } from "../lib/prisma"

const PROCESSED_DIR = path.join(os.homedir(), "Downloads/meisa-hero-fix/procesadas")
const ORIGINALES_DIR = path.join(os.homedir(), "Downloads/meisa-hero-fix/originales")

// Mapping code prefix → categoria slug
const CODE_TO_SLUG: Record<string, string> = {
  comercial: "comercial",
  industrial: "industrial",
  puentes: "puentes",
  infra: "infraestructura-urbana",
  edif: "edificaciones",
  inst: "institucional",
}

async function main() {
  if (!existsSync(PROCESSED_DIR)) {
    console.error(`❌ ${PROCESSED_DIR} no existe`)
    process.exit(1)
  }

  const pngs = (await readdir(PROCESSED_DIR)).filter((f) => f.endsWith(".png"))
  console.log(`\n📦 ${pngs.length} PNGs procesados encontrados\n`)

  const storage = new Storage({ projectId: "meisa-web-prod-2025" })
  const bucket = storage.bucket("meisa-imagenes")

  let ok = 0
  for (const png of pngs) {
    // Parse code: comercial-1.png → comercial, espIdx=0
    const code = png.replace(".png", "")
    const m = code.match(/^([a-z]+)-(\d+)$/)
    if (!m) {
      console.warn(`⚠️  ${png}: nombre no parseable`)
      continue
    }
    const prefix = m[1]
    const espIdx = parseInt(m[2], 10) - 1
    const catSlug = CODE_TO_SLUG[prefix]
    if (!catSlug) {
      console.warn(`⚠️  ${png}: prefijo desconocido "${prefix}"`)
      continue
    }

    try {
      const buf = await readFile(path.join(PROCESSED_DIR, png))
      const meta = await sharp(buf).metadata()
      const width = meta.width ?? 1920
      const height = meta.height ?? 1080
      const webpBuf = await sharp(buf).webp({ quality: 88, effort: 5 }).toBuffer()

      const fileName = `${code}.webp`
      const gcsPath = `site/heroes/${fileName}`
      await bucket.file(gcsPath).save(webpBuf, {
        metadata: {
          contentType: "image/webp",
          cacheControl: "public, max-age=31536000, immutable",
        },
        public: true,
      })
      const url = `https://storage.googleapis.com/meisa-imagenes/${gcsPath}`

      // Upsert Media pool
      const existing = await prisma.media.findFirst({ where: { pathGcs: gcsPath } })
      const mediaData = {
        url,
        pathGcs: gcsPath,
        fileName,
        contentType: "image/webp",
        kind: MediaKind.IMAGE,
        size: webpBuf.byteLength,
        width,
        height,
        folder: "site/heroes",
        title: `Hero ${code} (procesado Nano Banana Pro)`,
        tags: ["hero", "processed", `cat:${catSlug}`],
      }
      if (existing) await prisma.media.update({ where: { id: existing.id }, data: mediaData })
      else await prisma.media.create({ data: mediaData })

      // Update categoria.especialidades
      const cat = await prisma.categoriaProyecto.findFirst({ where: { slug: catSlug } })
      if (!cat) {
        console.warn(`⚠️  categoria ${catSlug} no encontrada`)
        continue
      }
      const esp = [...((cat.especialidades as any[]) || [])]
      if (!esp[espIdx]) {
        console.warn(`⚠️  ${catSlug}#${espIdx + 1} no existe`)
        continue
      }
      esp[espIdx] = { ...esp[espIdx], imagen: url }
      await prisma.categoriaProyecto.update({
        where: { id: cat.id },
        data: { especialidades: esp as any },
      })

      // Borrar de originales/
      const ext = ["webp", "jpg", "png"]
      for (const e of ext) {
        const op = path.join(ORIGINALES_DIR, `${code}.${e}`)
        if (existsSync(op)) {
          await unlink(op)
          console.log(`   🗑️  borrado: originales/${code}.${e}`)
        }
      }

      console.log(`✅ ${code}: ${width}x${height} → ${gcsPath}`)
      console.log(`   DB: ${catSlug}#${espIdx + 1} → site/heroes/${fileName}`)
      ok++
    } catch (e) {
      console.error(`❌ ${code}: ${(e as Error).message}`)
    }
  }

  console.log(`\n📊 Aplicadas: ${ok}/${pngs.length}`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

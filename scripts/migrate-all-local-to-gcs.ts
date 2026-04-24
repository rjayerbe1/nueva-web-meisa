/**
 * Migración masiva: para cada campo de imagen en la DB que aún apunte a
 * /images/... local, subir el archivo a GCS bajo `site/<folder>/` y actualizar
 * el campo en DB para apuntar a la URL GCS.
 *
 * Modelos y campos cubiertos (todos los con *.imagen / *.logo locales):
 *   CompanyValue.imagen
 *   Equipo.imagen
 *   Tecnologia.imagen
 *   Politica.imagen
 *   ProcesoFase.imagen
 *   Plant.imagen
 *   PilarSIG (no tiene imagen directa — icono CSS)
 *   Certificacion.logo, .documentoUrl
 *   Norma.logo
 *   HomeFeaturedProject.imagen
 *   HomeServicioDestacado.imagen, .video
 *   CategoriaProyecto.imagenCover (ya migrado, idempotente)
 *
 * Uso:
 *   npx tsx scripts/migrate-all-local-to-gcs.ts [--dry-run]
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })

import { readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import sharp from "sharp"
import { Storage } from "@google-cloud/storage"
import { MediaKind, Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma"

const dryRun = process.argv.includes("--dry-run")

const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID || "meisa-web-prod-2025"
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || "meisa-imagenes"
const PUBLIC_DIR = path.join(process.cwd(), "public")

interface Work {
  model: string
  id: string
  field: string
  oldUrl: string
  label: string // folder GCS destino, ej "valores", "equipo"
}

const CONTENT_TYPE_MAP: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
}

function deriveLabelFromUrl(url: string): string {
  // /images/valores/efectividad.webp  →  valores
  // /images/projects/industria/x.webp →  projects/industria
  // /videos/xxx.mp4                    →  videos
  // /videos/hero/xxx.mp4               →  videos/hero
  const m = url.match(/^\/([^/]+)\/(.+)$/)
  if (!m) return "misc"
  const [, topDir, rest] = m
  const parts = rest.split("/")
  const subfolders = parts.slice(0, -1).join("/")
  if (topDir === "videos") {
    return subfolders ? `videos/${subfolders}` : "videos"
  }
  // topDir === "images" (u otro) — descartamos "images" y usamos los subfolders
  return subfolders || "root"
}

async function collectWork(): Promise<Work[]> {
  const work: Work[] = []

  const collect = <T extends { id: string }>(
    model: string,
    rows: T[],
    fieldsToCheck: (keyof T & string)[],
  ) => {
    for (const r of rows) {
      for (const field of fieldsToCheck) {
        const v = r[field] as unknown
        if (typeof v === "string" && v.startsWith("/")) {
          work.push({
            model,
            id: r.id,
            field,
            oldUrl: v,
            label: deriveLabelFromUrl(v),
          })
        }
      }
    }
  }

  collect(
    "CompanyValue",
    await prisma.companyValue.findMany({ select: { id: true, imagen: true } }),
    ["imagen"],
  )
  collect(
    "Equipo",
    await prisma.equipo.findMany({ select: { id: true, imagen: true } }),
    ["imagen"],
  )
  collect(
    "Tecnologia",
    await prisma.tecnologia.findMany({ select: { id: true, imagen: true } }),
    ["imagen"],
  )
  collect(
    "Politica",
    await prisma.politica.findMany({
      select: { id: true, imagen: true, documentoUrl: true },
    }),
    ["imagen", "documentoUrl"],
  )
  collect(
    "ProcesoFase",
    await prisma.procesoFase.findMany({ select: { id: true, imagen: true } }),
    ["imagen"],
  )
  collect(
    "Plant",
    await prisma.plant.findMany({ select: { id: true, imagen: true } }),
    ["imagen"],
  )
  collect(
    "Certificacion",
    await prisma.certificacion.findMany({
      select: { id: true, logo: true, documentoUrl: true },
    }),
    ["logo", "documentoUrl"],
  )
  collect(
    "Norma",
    await prisma.norma.findMany({ select: { id: true, logo: true } }),
    ["logo"],
  )
  collect(
    "HomeFeaturedProject",
    await prisma.homeFeaturedProject.findMany({
      select: { id: true, imagen: true },
    }),
    ["imagen"],
  )
  collect(
    "HomeServicioDestacado",
    await prisma.homeServicioDestacado.findMany({
      select: { id: true, imagen: true, video: true },
    }),
    ["imagen", "video"],
  )
  collect(
    "HomeHeroEspecialidad",
    await prisma.homeHeroEspecialidad.findMany({
      select: { id: true },
    }),
    [],
  )
  collect(
    "MenuItem",
    await prisma.menuItem.findMany({ select: { id: true, imagen: true } }),
    ["imagen"],
  )

  return work
}

async function main() {
  const work = await collectWork()
  console.log(`\n🔍 Total campos locales por migrar: ${work.length}\n`)

  if (work.length === 0) {
    console.log("✨ No hay nada local por migrar.")
    await prisma.$disconnect()
    return
  }

  // Agrupado para preview
  const byModel = new Map<string, Work[]>()
  for (const w of work) {
    if (!byModel.has(w.model)) byModel.set(w.model, [])
    byModel.get(w.model)!.push(w)
  }
  for (const [m, ws] of byModel) {
    console.log(`📦 ${m}: ${ws.length}`)
    for (const w of ws.slice(0, 3)) {
      console.log(`   • ${w.field}: ${w.oldUrl} → site/${w.label}/`)
    }
    if (ws.length > 3) console.log(`   ...y ${ws.length - 3} más`)
  }

  if (dryRun) {
    console.log("\n✓ DRY-RUN — sin cambios.")
    await prisma.$disconnect()
    return
  }

  const storage = new Storage({ projectId: GCS_PROJECT_ID })
  const bucket = storage.bucket(GCS_BUCKET_NAME)

  console.log(`\n☁️  Subiendo a GCS + actualizando DB...`)
  let done = 0
  let failed = 0
  for (const w of work) {
    const localPath = path.join(PUBLIC_DIR, w.oldUrl.replace(/^\//, ""))
    if (!existsSync(localPath)) {
      console.warn(`  ⚠️  ${w.model}.${w.field}: no existe local ${w.oldUrl} — skip`)
      failed++
      continue
    }

    const filename = path.basename(localPath)
    const ext = path.extname(localPath).toLowerCase()
    const contentType = CONTENT_TYPE_MAP[ext] ?? "application/octet-stream"
    const gcsPath = `site/${w.label}/${filename}`
    const newUrl = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${gcsPath}`

    try {
      const buffer = await readFile(localPath)
      await bucket.file(gcsPath).save(buffer, {
        metadata: {
          contentType,
          cacheControl: "public, max-age=31536000, immutable",
        },
        public: true,
      })

      // Dims si es imagen
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

      // Upsert Media pool
      const existing = await prisma.media.findFirst({
        where: { pathGcs: gcsPath },
        select: { id: true },
      })
      const mediaData = {
        url: newUrl,
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
        folder: `site/${w.label}`,
        title: filename,
        tags: ["site", w.label, `from:${w.model}.${w.field}`],
      } satisfies Prisma.MediaCreateInput
      if (existing) {
        await prisma.media.update({ where: { id: existing.id }, data: mediaData })
      } else {
        await prisma.media.create({ data: mediaData })
      }

      // Actualizar el campo en el modelo correspondiente
      const modelKey = w.model.charAt(0).toLowerCase() + w.model.slice(1)
      // Prisma no tiene tipo dinámico fácil; usamos $executeRaw o el cliente por modelo
      // Para simplicidad, un switch por model
      await updateField(w.model, w.id, w.field, newUrl)

      done++
      console.log(`  ✅ ${w.model}.${w.field}: ${filename} → ${gcsPath}`)
    } catch (e) {
      failed++
      console.error(`  ❌ ${w.model}.${w.field}:`, (e as Error).message)
    }
  }

  console.log(`\n📊 Resumen: ${done}/${work.length} migrados, ${failed} fallidos`)
  await prisma.$disconnect()
}

async function updateField(
  model: string,
  id: string,
  field: string,
  newUrl: string,
) {
  const data = { [field]: newUrl }
  switch (model) {
    case "CompanyValue":
      return prisma.companyValue.update({ where: { id }, data })
    case "Equipo":
      return prisma.equipo.update({ where: { id }, data })
    case "Tecnologia":
      return prisma.tecnologia.update({ where: { id }, data })
    case "Politica":
      return prisma.politica.update({ where: { id }, data })
    case "ProcesoFase":
      return prisma.procesoFase.update({ where: { id }, data })
    case "Plant":
      return prisma.plant.update({ where: { id }, data })
    case "Certificacion":
      return prisma.certificacion.update({ where: { id }, data })
    case "Norma":
      return prisma.norma.update({ where: { id }, data })
    case "HomeFeaturedProject":
      return prisma.homeFeaturedProject.update({ where: { id }, data })
    case "HomeServicioDestacado":
      return prisma.homeServicioDestacado.update({ where: { id }, data })
    case "MenuItem":
      return prisma.menuItem.update({ where: { id }, data })
    default:
      throw new Error(`Model not handled: ${model}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

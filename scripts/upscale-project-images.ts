/**
 * Script de prueba — upscaling masivo de imágenes de un proyecto usando
 * Bria Increase-Resolution 4x (el mismo modelo que /api/upscale-image).
 *
 * Flujo por cada imagen:
 *   1. Fetch ImagenProyecto rows del proyecto
 *   2. Enviar a Replicate (Bria 4x)
 *   3. Descargar resultado y subir a GCS en carpeta "upscaled/<slug>/"
 *   4. Registrar como Media en el pool con tag 'ai:upscale' y tag del slug
 *   5. Reportar URL original vs upscaled para comparar
 *
 * **No modifica** las filas ImagenProyecto originales — crea nuevos items
 * en el pool Media para que podás comparar en /admin/media-library filtrando
 * por tag del slug.
 *
 * Uso:
 *   npx tsx scripts/upscale-project-images.ts [slug] [--dry-run] [--limit N]
 *
 * Ejemplo:
 *   npx tsx scripts/upscale-project-images.ts centro-comercial-campanario
 *   npx tsx scripts/upscale-project-images.ts centro-comercial-campanario --limit 3
 *   npx tsx scripts/upscale-project-images.ts centro-comercial-campanario --dry-run
 *
 * Requiere: REPLICATE_API_TOKEN en .env, GCS credentials configurados.
 */
import { prisma } from "../lib/prisma"
import { MediaKind, Prisma } from "@prisma/client"
import Replicate from "replicate"
import { Storage } from "@google-cloud/storage"

const args = process.argv.slice(2)
const slug = args.find((a) => !a.startsWith("--")) ?? "centro-comercial-campanario"
const dryRun = args.includes("--dry-run")
const limitArg = args.indexOf("--limit")
const limit = limitArg >= 0 ? parseInt(args[limitArg + 1] ?? "0", 10) : 0

const BRIA_VERSION =
  "bria/increase-resolution:19266ced4be9ec28f269ab20a2622104cac9c518158b7761e7edeb30954bd01a"
const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID || "meisa-web-prod-2025"
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || "meisa-imagenes"

function fmt(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`
}

async function main() {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("❌ Falta REPLICATE_API_TOKEN en env")
    process.exit(1)
  }

  console.log(`\n🎯 Proyecto: ${slug}`)
  if (dryRun) console.log("   Modo: DRY-RUN (no llama Replicate, no sube a GCS)")
  if (limit > 0) console.log(`   Límite: ${limit} imágenes`)
  console.log()

  const proyecto = await prisma.proyecto.findUnique({
    where: { slug },
    include: {
      imagenes: {
        orderBy: [{ tipo: "asc" }, { orden: "asc" }],
      },
    },
  })

  if (!proyecto) {
    console.error(`❌ Proyecto "${slug}" no encontrado`)
    process.exit(1)
  }

  console.log(`📦 ${proyecto.titulo} — ${proyecto.imagenes.length} imágenes totales`)

  const pendientes = proyecto.imagenes.filter((im) => !im.url.includes("/upscaled/"))
  const target = limit > 0 ? pendientes.slice(0, limit) : pendientes
  console.log(`🔧 A procesar: ${target.length}\n`)

  if (target.length === 0) {
    console.log("✨ No hay imágenes por procesar.")
    await prisma.$disconnect()
    return
  }

  if (dryRun) {
    console.log("DRY-RUN — URLs que se procesarían:")
    for (const im of target) {
      console.log(
        `  [${im.tipo}] ${im.width ?? "?"}x${im.height ?? "?"} · ${im.url}`,
      )
    }
    await prisma.$disconnect()
    return
  }

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  const storage = new Storage({ projectId: GCS_PROJECT_ID })
  const bucket = storage.bucket(GCS_BUCKET_NAME)

  const results: Array<{
    tipo: string
    original: string
    upscaled: string
    timeMs: number
  }> = []

  for (let i = 0; i < target.length; i++) {
    const im = target[i]
    const n = `[${String(i + 1).padStart(2, "0")}/${target.length}]`
    const startedAt = Date.now()
    try {
      console.log(`${n} ⚡ Enviando a Bria: ${im.url.split("/").pop()?.slice(0, 60)}`)

      const output = (await replicate.run(BRIA_VERSION, {
        input: {
          image_url: im.url,
          desired_increase: 4,
          preserve_alpha: true,
        },
      })) as unknown as string

      // Descargar resultado
      const res = await fetch(output)
      if (!res.ok) throw new Error(`Replicate download fail: ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())

      // Upload a GCS en upscaled/<slug>/
      const filename = im.url.split("/").pop()?.split("?")[0] ?? `image-${i}.jpg`
      const gcsPath = `upscaled/${slug}/${Date.now()}-${filename}`
      await bucket.file(gcsPath).save(buffer, {
        metadata: {
          contentType: "image/jpeg",
          cacheControl: "public, max-age=31536000",
        },
        public: true,
      })
      const upscaledUrl = `https://storage.googleapis.com/${bucket.name}/${gcsPath}`

      // Registrar en Media pool
      await prisma.media.create({
        data: {
          url: upscaledUrl,
          pathGcs: gcsPath,
          fileName: filename,
          contentType: "image/jpeg",
          kind: MediaKind.IMAGE,
          size: buffer.byteLength,
          folder: `upscaled/${slug}`,
          title: `${proyecto.titulo} — ${im.tipo} · upscaled Bria 4x`,
          altText: im.alt,
          tags: ["ai:upscale", "bria-4x", `proyecto:${slug}`, `tipo:${im.tipo}`],
        } satisfies Prisma.MediaCreateInput,
      })

      const elapsed = Date.now() - startedAt
      results.push({ tipo: im.tipo, original: im.url, upscaled: upscaledUrl, timeMs: elapsed })

      console.log(`${n} ✅ OK (${fmt(elapsed)}) → ${upscaledUrl.split("/").pop()}`)
    } catch (e) {
      console.error(`${n} ❌ ERROR:`, (e as Error).message)
    }
  }

  console.log("\n📊 Resumen")
  console.log(`  Procesadas: ${results.length}/${target.length}`)
  if (results.length) {
    const totalMs = results.reduce((s, r) => s + r.timeMs, 0)
    console.log(`  Tiempo total: ${fmt(totalMs)} (promedio ${fmt(totalMs / results.length)} por imagen)`)
    console.log(`\n🔍 Compará en /admin/media-library filtrando por tag:`)
    console.log(`     proyecto:${slug}`)
    console.log(`     bria-4x`)
    console.log(`\n📝 Primeras 3 comparaciones (original → upscaled):`)
    for (const r of results.slice(0, 3)) {
      console.log(`\n  ${r.tipo}`)
      console.log(`     ORIG → ${r.original}`)
      console.log(`     4x   → ${r.upscaled}`)
    }
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

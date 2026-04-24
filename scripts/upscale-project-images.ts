/**
 * Script de prueba — upscaling masivo de imágenes de un proyecto.
 *
 * Modelos soportados:
 *   bria    — Replicate / Bria Increase-Resolution 4x (~$0.02/img)
 *   esrgan  — Replicate / Real-ESRGAN 4x (~$0.002/img)
 *   imagen  — Google Vertex AI / Imagegeneration mode=upscale x4 (~$0.003/img)
 *
 * El modelo `imagen` usa tus credenciales GCP existentes (ADC vía gcloud
 * auth application-default login, o cuenta de servicio configurada para GCS).
 * No requiere token de Replicate. Perfecto si tenés cuota de Workspace
 * Enterprise o crédito Google Cloud.
 *
 * Flujo por cada imagen:
 *   1. Fetch ImagenProyecto rows del proyecto
 *   2. Upscale (Replicate o Vertex AI según modelo)
 *   3. Guardar resultado en disco local (public/.../upscaled/) + subir a GCS
 *   4. Registrar como Media en el pool con tag 'ai:upscale'
 *
 * **No modifica** las filas ImagenProyecto originales.
 *
 * Uso:
 *   npx tsx scripts/upscale-project-images.ts [slug] [--dry-run] [--limit N] [--model=bria|esrgan|imagen]
 *
 * Ejemplos:
 *   npx tsx scripts/upscale-project-images.ts centro-comercial-campanario --model=imagen --limit 1
 *   npx tsx scripts/upscale-project-images.ts centro-comercial-campanario --model=imagen
 *   npx tsx scripts/upscale-project-images.ts centro-comercial-campanario --model=esrgan --limit 1
 *
 * Requisitos por modelo:
 *   bria/esrgan → REPLICATE_API_TOKEN en env (.env o .env.local)
 *   imagen      → ADC configurado (`gcloud auth application-default login`)
 *                 + API Vertex AI habilitada en GCS_PROJECT_ID
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })

import { readFile, writeFile } from "node:fs/promises"
import { existsSync, mkdirSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import sharp from "sharp"
import { prisma } from "../lib/prisma"
import { MediaKind, Prisma } from "@prisma/client"
import Replicate from "replicate"
import { Storage } from "@google-cloud/storage"
import { GoogleAuth } from "google-auth-library"

const args = process.argv.slice(2)
const slug = args.find((a) => !a.startsWith("--")) ?? "centro-comercial-campanario"
const dryRun = args.includes("--dry-run")
const limitArg = args.indexOf("--limit")
const limit = limitArg >= 0 ? parseInt(args[limitArg + 1] ?? "0", 10) : 0
const modelArg = args.find((a) => a.startsWith("--model="))?.split("=")[1] ?? "bria"
type Model = "bria" | "esrgan" | "imagen"
const MODEL: Model =
  modelArg === "imagen" ? "imagen" : modelArg === "esrgan" ? "esrgan" : "bria"

/** Carpeta donde se guardan los resultados locales (para inspección rápida). */
const outArg = args.find((a) => a.startsWith("--out="))?.split("=")[1]
function expandPath(p: string): string {
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2))
  if (p === "~") return os.homedir()
  return path.resolve(p)
}
const OUT_DIR = outArg ? expandPath(outArg) : null

const BRIA_VERSION =
  "bria/increase-resolution:19266ced4be9ec28f269ab20a2622104cac9c518158b7761e7edeb30954bd01a"
const ESRGAN_VERSION =
  "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa"

const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID || "meisa-web-prod-2025"
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || "meisa-imagenes"
const VERTEX_LOCATION = process.env.VERTEX_LOCATION || "us-central1"
const VERTEX_MODEL = process.env.VERTEX_IMAGEN_MODEL || "imagen-4.0-upscale-preview"
const PUBLIC_BASE = process.env.PUBLIC_IMAGES_BASE || "https://dev.meisa.com.co"
const LOCAL_PUBLIC_DIR = path.join(process.cwd(), "public")

function toPublicUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  if (url.startsWith("/")) return `${PUBLIC_BASE}${url}`
  return `${PUBLIC_BASE}/${url}`
}

function toLocalPath(url: string): string | null {
  if (!url.startsWith("/")) return null
  return path.join(LOCAL_PUBLIC_DIR, url.replace(/^\//, ""))
}

function fmt(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`
}

/** Lee el buffer de una imagen, venga de local o GCS/HTTP. */
async function loadImageBuffer(url: string): Promise<Buffer> {
  const localPath = toLocalPath(url)
  if (localPath && existsSync(localPath)) {
    return readFile(localPath)
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`)
    return Buffer.from(await res.arrayBuffer())
  }
  throw new Error(`No encuentro imagen: ${url}`)
}

/** Vertex AI Imagen — upscale x2/x3/x4 vía REST. Devuelve buffer PNG. */
async function runVertexUpscale(
  imageBuffer: Buffer,
  factor: "x2" | "x3" | "x4" = "x4",
): Promise<Buffer> {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  })
  const client = await auth.getClient()
  const accessToken = (await client.getAccessToken()).token
  if (!accessToken) throw new Error("No se pudo obtener access token de GCP")

  const endpoint = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCS_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${VERTEX_MODEL}:predict`

  const body = {
    instances: [
      {
        prompt: "Upscale the image",
        image: { bytesBase64Encoded: imageBuffer.toString("base64") },
      },
    ],
    parameters: {
      mode: "upscale",
      upscaleConfig: { upscaleFactor: factor },
      outputOptions: { mimeType: "image/png" },
    },
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Vertex AI ${res.status}: ${errText.slice(0, 500)}`)
  }

  const json = (await res.json()) as {
    predictions?: Array<{ bytesBase64Encoded?: string; mimeType?: string }>
  }
  const b64 = json.predictions?.[0]?.bytesBase64Encoded
  if (!b64) throw new Error(`Vertex AI: respuesta sin bytesBase64Encoded — ${JSON.stringify(json).slice(0, 300)}`)
  return Buffer.from(b64, "base64")
}

async function main() {
  if (MODEL !== "imagen" && !dryRun && !process.env.REPLICATE_API_TOKEN) {
    console.error("❌ Falta REPLICATE_API_TOKEN en env (.env o .env.local)")
    process.exit(1)
  }

  console.log(`\n🎯 Proyecto: ${slug}`)
  const modelLabel =
    MODEL === "bria"
      ? "Bria Increase-Resolution 4x (Replicate)"
      : MODEL === "esrgan"
      ? "Real-ESRGAN 4x (Replicate)"
      : `Vertex AI Imagen ${VERTEX_MODEL} · mode=upscale x4`
  console.log(`   Modelo: ${modelLabel}`)
  if (dryRun) console.log("   Modo: DRY-RUN (no llama al modelo, no sube a GCS)")
  if (limit > 0) console.log(`   Límite: ${limit} imágenes`)
  console.log()

  const proyecto = await prisma.proyecto.findUnique({
    where: { slug },
    include: { imagenes: { orderBy: [{ tipo: "asc" }, { orden: "asc" }] } },
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

  const replicate =
    MODEL !== "imagen"
      ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
      : null
  const storage = new Storage({ projectId: GCS_PROJECT_ID })
  const bucket = storage.bucket(GCS_BUCKET_NAME)

  const results: Array<{
    tipo: string
    original: string
    upscaled: string
    localPath?: string
    timeMs: number
  }> = []

  const MIN_DIM = 1000 // skip si al menos UN eje ya es ≥1000
  const MAX_OUTPUT_MP = 16 // Vertex AI cap = 17MP; dejamos margen

  async function runUpscaleWithRetry(
    im: { url: string },
    attempt = 1,
  ): Promise<{ buffer: Buffer; skipped?: "already-large"; dims?: { w: number; h: number } }> {
    try {
      // Cargamos el buffer de la fuente (local o remota)
      const srcBuffer = await loadImageBuffer(im.url)

      // Chequeamos dimensiones reales — si al menos UN eje ya es ≥1000, es hi-res suficiente
      const meta = await sharp(srcBuffer).metadata()
      const w = meta.width ?? 0
      const h = meta.height ?? 0
      if (w >= MIN_DIM || h >= MIN_DIM) {
        return { buffer: srcBuffer, skipped: "already-large", dims: { w, h } }
      }
      // Si x4 excede el cap de Vertex AI (17MP), reducimos a x3 o x2.
      let factor: "x2" | "x3" | "x4" = "x4"
      const targetMp = (w * h * 16) / 1e6
      if (targetMp > MAX_OUTPUT_MP) {
        factor = (w * h * 9) / 1e6 <= MAX_OUTPUT_MP ? "x3" : "x2"
      }

      if (MODEL === "imagen") {
        const mult = factor === "x4" ? 4 : factor === "x3" ? 3 : 2
        return {
          buffer: await runVertexUpscale(srcBuffer, factor),
          dims: { w: w * mult, h: h * mult },
        }
      }
      // Replicate path: necesita URL pública (no acepta base64)
      const publicUrl = toPublicUrl(im.url)
      const out =
        MODEL === "bria"
          ? await replicate!.run(BRIA_VERSION, {
              input: { image_url: publicUrl, desired_increase: 4, preserve_alpha: true },
            })
          : await replicate!.run(ESRGAN_VERSION, {
              input: { image: publicUrl, scale: 4, face_enhance: false },
            })
      const resUrl = out as unknown as string
      const r = await fetch(resUrl)
      if (!r.ok) throw new Error(`Replicate download fail: ${r.status}`)
      return { buffer: Buffer.from(await r.arrayBuffer()), dims: { w: w * 4, h: h * 4 } }
    } catch (e: any) {
      const msg = String(e?.message ?? "")
      const retryAfterMatch = msg.match(/retry_after["\s:]+(\d+)/i)
      const waitSec = retryAfterMatch ? parseInt(retryAfterMatch[1], 10) : 10
      if ((msg.includes("429") || msg.includes("Too Many Requests")) && attempt <= 5) {
        console.log(`     ⏳ Rate limited — esperando ${waitSec + 1}s (retry ${attempt}/5)`)
        await new Promise((r) => setTimeout(r, (waitSec + 1) * 1000))
        return runUpscaleWithRetry(im, attempt + 1)
      }
      throw e
    }
  }

  let skipped = 0

  for (let i = 0; i < target.length; i++) {
    const im = target[i]
    const n = `[${String(i + 1).padStart(2, "0")}/${target.length}]`
    const startedAt = Date.now()
    try {
      console.log(`${n} ⚡ ${MODEL}: ${im.url.split("/").pop()?.slice(0, 60)}`)

      const result = await runUpscaleWithRetry(im)
      const buffer = result.buffer
      if (result.skipped === "already-large") {
        const d = result.dims!
        console.log(`${n} ⏭️  SKIP — ya es ${d.w}x${d.h} (≥${MIN_DIM}px)`)
        skipped++
        continue
      }

      // Guardar copia local (para comparar en Finder sin pasar por DB).
      // Si se pasó --out, se guarda ahí; si no, se guarda junto al original en /upscaled/.
      let localSavedPath: string | undefined
      const origLocal = toLocalPath(im.url)
      const baseName = origLocal
        ? path.basename(origLocal, path.extname(origLocal))
        : `image-${i + 1}`
      const ext = MODEL === "imagen" ? ".png" : ".jpg"
      const outName = `${baseName}-${MODEL}4x${ext}`

      if (OUT_DIR) {
        if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })
        localSavedPath = path.join(OUT_DIR, outName)
        await writeFile(localSavedPath, buffer)
      } else if (origLocal) {
        const upscaledDir = path.join(path.dirname(origLocal), "upscaled")
        if (!existsSync(upscaledDir)) mkdirSync(upscaledDir, { recursive: true })
        localSavedPath = path.join(upscaledDir, outName)
        await writeFile(localSavedPath, buffer)
      }

      // GCS — path determinístico por imagen + modelo. Re-runs sobrescriben
      // en vez de duplicar. La Media pool se upserta por pathGcs.
      const filename = im.url.split("/").pop()?.split("?")[0] ?? `image-${i}.jpg`
      const gcsPath = `upscaled/${slug}/${MODEL}-${filename}`
      const contentType = MODEL === "imagen" ? "image/png" : "image/jpeg"
      await bucket.file(gcsPath).save(buffer, {
        metadata: { contentType, cacheControl: "public, max-age=31536000" },
        public: true,
      })
      const upscaledUrl = `https://storage.googleapis.com/${bucket.name}/${gcsPath}`

      // Upsert por pathGcs (única por convención) — si ya existe, actualiza size+fecha.
      const existing = await prisma.media.findFirst({
        where: { pathGcs: gcsPath },
        select: { id: true },
      })
      const mediaData = {
        url: upscaledUrl,
        pathGcs: gcsPath,
        fileName: filename,
        contentType,
        kind: MediaKind.IMAGE,
        size: buffer.byteLength,
        folder: `upscaled/${slug}`,
        title: `${proyecto.titulo} — ${im.tipo} · upscaled ${MODEL} 4x`,
        altText: im.alt,
        tags: ["ai:upscale", `${MODEL}-4x`, `proyecto:${slug}`, `tipo:${im.tipo}`],
      } satisfies Prisma.MediaCreateInput
      if (existing) {
        await prisma.media.update({ where: { id: existing.id }, data: mediaData })
      } else {
        await prisma.media.create({ data: mediaData })
      }

      const elapsed = Date.now() - startedAt
      results.push({
        tipo: im.tipo,
        original: im.url,
        upscaled: upscaledUrl,
        localPath: localSavedPath,
        timeMs: elapsed,
      })

      const sizeMb = (buffer.byteLength / 1024 / 1024).toFixed(2)
      console.log(`${n} ✅ OK (${fmt(elapsed)}, ${sizeMb}MB)`)
      if (localSavedPath)
        console.log(`     💾 local: ${path.relative(process.cwd(), localSavedPath)}`)
      console.log(`     ☁️  gcs:   ${upscaledUrl.split("/").pop()}`)
    } catch (e) {
      console.error(`${n} ❌ ERROR:`, (e as Error).message)
    }
  }

  console.log("\n📊 Resumen")
  console.log(`  Procesadas: ${results.length}/${target.length}`)
  if (skipped > 0) console.log(`  Skipped (ya ≥${MIN_DIM}px): ${skipped}`)
  if (results.length) {
    const totalMs = results.reduce((s, r) => s + r.timeMs, 0)
    console.log(
      `  Tiempo total: ${fmt(totalMs)} (promedio ${fmt(totalMs / results.length)} por imagen)`,
    )
    console.log(`\n🔍 En /admin/media-library filtrá por tag:`)
    console.log(`     proyecto:${slug}`)
    console.log(`     ${MODEL}-4x`)
    console.log(`\n📁 Copias locales:`)
    console.log(`     public/images/projects/.../${slug}/upscaled/`)
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

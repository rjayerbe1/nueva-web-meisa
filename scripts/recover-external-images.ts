/**
 * Recuperación masiva de imágenes externas para proyectos sin imágenes.
 *
 * Flujo:
 *   1. Parse /tmp/matches.txt (output de find-external-images.ts)
 *   2. Filtrar proyectos con matches de alta confianza (≥2 score-2 OR ≥1 score-3)
 *   3. Por cada proyecto:
 *      a. Dedup candidatos por baseName, preferir canonical/mayor dim
 *      b. Tomar top 4-6 (1 PORTADA + 3-5 GALERIA)
 *      c. Por cada imagen:
 *         - Leer archivo
 *         - Obtener dims con sharp
 *         - Si < 1000px: upscalear con Vertex AI Imagen 4
 *         - Convertir a WebP optimizado
 *         - Subir a GCS projects/<slug>/<nombre>
 *         - Crear ImagenProyecto (idempotente)
 *         - Upsert Media pool
 *
 * Uso:
 *   npx tsx scripts/recover-external-images.ts [--dry-run] [--limit N]
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })

import { readFile, stat } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import sharp from "sharp"
import { Storage } from "@google-cloud/storage"
import { GoogleAuth } from "google-auth-library"
import { MediaKind, Prisma, TipoImagen } from "@prisma/client"
import { prisma } from "../lib/prisma"

const dryRun = process.argv.includes("--dry-run")
const limitArg = process.argv.indexOf("--limit")
const limit = limitArg >= 0 ? parseInt(process.argv[limitArg + 1] ?? "0", 10) : 0

const ROOT = "/Users/rjayerbe/Web Development Local/meisa.com.co"
const GCS_PROJECT_ID = "meisa-web-prod-2025"
const GCS_BUCKET_NAME = "meisa-imagenes"
const MIN_DIM = 1000

async function upscale(buf: Buffer): Promise<Buffer> {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  })
  const client = await auth.getClient()
  const token = (await client.getAccessToken()).token
  // Detectar dims para elegir factor
  const meta = await sharp(buf).metadata()
  const w = meta.width ?? 0
  const h = meta.height ?? 0
  let factor: "x2" | "x3" | "x4" = "x4"
  const MAX_MP = 16
  if ((w * h * 16) / 1e6 > MAX_MP) {
    factor = (w * h * 9) / 1e6 <= MAX_MP ? "x3" : "x2"
  }
  const res = await fetch(
    `https://us-central1-aiplatform.googleapis.com/v1/projects/${GCS_PROJECT_ID}/locations/us-central1/publishers/google/models/imagen-4.0-upscale-preview:predict`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [
          { prompt: "Upscale the image", image: { bytesBase64Encoded: buf.toString("base64") } },
        ],
        parameters: {
          mode: "upscale",
          upscaleConfig: { upscaleFactor: factor },
          outputOptions: { mimeType: "image/png" },
        },
      }),
    },
  )
  const json = (await res.json()) as any
  if (!json.predictions?.[0]?.bytesBase64Encoded) {
    throw new Error(`Vertex AI: ${JSON.stringify(json).slice(0, 300)}`)
  }
  return Buffer.from(json.predictions[0].bytesBase64Encoded, "base64")
}

interface Candidate {
  file: string
  score: number
  baseName: string // sin dim suffix
  hasDimSuffix: boolean
}

function baseNameOf(filePath: string): string {
  const name = path.basename(filePath)
  return name
    .replace(/\.(webp|png|jpe?g|gif)$/i, "")
    .replace(/-\d{3,4}x\d{3,4}$/i, "")
    .replace(/-scaled-\d+$/i, "")
    .replace(/-scaled$/i, "")
    .replace(/-\d$/, "") // strip trailing -N duplicates
}

async function parseMatches(matchesFile = "/tmp/matches.txt"): Promise<Map<string, Candidate[]>> {
  const txt = await readFile(matchesFile, "utf8")
  const lines = txt.split("\n")
  const result = new Map<string, Candidate[]>()
  let currentSlug: string | null = null
  let currentScore3 = 0
  let currentScore2 = 0
  let currentScore1 = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith("📦")) {
      currentScore3 = 0
      currentScore2 = 0
      currentScore1 = 0
      continue
    }
    const slugMatch = line.match(/^   ([a-z0-9-]+) · /)
    if (slugMatch) {
      currentSlug = slugMatch[1]
      continue
    }
    const scoreMatch = line.match(/^   \[score (\d+)\] (.+)$/)
    if (scoreMatch && currentSlug) {
      const score = parseInt(scoreMatch[1], 10)
      const file = scoreMatch[2].trim()
      const base = baseNameOf(file)
      const hasDimSuffix = /\d{3,4}x\d{3,4}/.test(path.basename(file))
      if (!result.has(currentSlug)) result.set(currentSlug, [])
      result.get(currentSlug)!.push({ file, score, baseName: base, hasDimSuffix })
      if (score === 3) currentScore3++
      else if (score === 2) currentScore2++
      else if (score === 1) currentScore1++
    }
  }

  // Filtrar proyectos con suficiente confianza
  const filtered = new Map<string, Candidate[]>()
  for (const [slug, candidates] of result) {
    const score3Count = candidates.filter((c) => c.score === 3).length
    const score2Count = candidates.filter((c) => c.score === 2).length
    if (score3Count >= 1 || score2Count >= 2) {
      filtered.set(slug, candidates)
    }
  }
  return filtered
}

// Filename keywords que indican NO es foto del proyecto
const FILENAME_EXCLUDES = [
  "logo",
  "icono",
  "icon-",
  "-icon",
  "banner",
  "header",
  "footer",
  "favicon",
  "thumbnail",
  "avatar",
  "pattern",
  "background",
  "texture",
  "-default",
  "placeholder",
  "stock-",
]

async function pickBestCandidates(
  proyectoSlug: string,
  proyectoTitulo: string,
  candidates: Candidate[],
  maxPerProject: number,
): Promise<Candidate[]> {
  const projectSpecificTokens = new Set([
    ...tokenizeLocal(proyectoSlug),
    ...tokenizeLocal(proyectoTitulo),
  ])

  // Pre-filtrar candidatos con quick-sync sharp para chequear aspect/dim
  const filtered: Candidate[] = []
  for (const c of candidates) {
    const filename = path.basename(c.file).toLowerCase()

    // 1. Bloquear por keywords de exclusión
    let skip = false
    for (const excl of FILENAME_EXCLUDES) {
      if (filename.includes(excl)) {
        skip = true
        break
      }
    }
    if (skip) continue

    // 2. Requerir ≥2 tokens específicos en filename O ≥1 token raro (≥7 chars)
    const fileTokens = new Set(tokenizeLocal(filename))
    let specificMatches = 0
    let hasRareMatch = false
    for (const t of projectSpecificTokens) {
      if (fileTokens.has(t)) {
        specificMatches++
        if (t.length >= 7) hasRareMatch = true
      }
    }
    if (specificMatches < 2 && !hasRareMatch) continue

    // 3. Leer dims con sharp — bloquear si extremo aspect ratio o muy chiquita
    try {
      const absolutePath = path.join(ROOT, c.file)
      if (!existsSync(absolutePath)) continue
      const meta = await sharp(absolutePath).metadata()
      const w = meta.width ?? 0
      const h = meta.height ?? 0
      if (w === 0 || h === 0) continue
      const aspect = w / h
      if (aspect > 2.5 || aspect < 0.4) continue // banners/logos
      if (Math.min(w, h) < 300) continue // demasiado chica para ser foto
      filtered.push(c)
    } catch {
      continue
    }
  }

  // Agrupar por baseName y preferir canonical/mayor dim
  const byBase = new Map<string, Candidate[]>()
  for (const c of filtered) {
    if (!byBase.has(c.baseName)) byBase.set(c.baseName, [])
    byBase.get(c.baseName)!.push(c)
  }

  const picked: Candidate[] = []
  for (const [, group] of byBase) {
    group.sort((a, b) => {
      if (a.hasDimSuffix !== b.hasDimSuffix) return a.hasDimSuffix ? 1 : -1
      if (a.score !== b.score) return b.score - a.score
      const aDim = a.file.match(/(\d{3,4})x(\d{3,4})/)
      const bDim = b.file.match(/(\d{3,4})x(\d{3,4})/)
      const aPx = aDim ? parseInt(aDim[1]) * parseInt(aDim[2]) : 0
      const bPx = bDim ? parseInt(bDim[1]) * parseInt(bDim[2]) : 0
      return bPx - aPx
    })
    picked.push(group[0])
  }

  picked.sort((a, b) => b.score - a.score)
  return picked.slice(0, maxPerProject)
}

const STOPWORDS_LOCAL = new Set([
  "centro",
  "comercial",
  "puente",
  "vehicular",
  "peatonal",
  "cubierta",
  "cubiertas",
  "coliseo",
  "escenario",
  "deportivo",
  "edificio",
  "estructura",
  "estructuras",
  "metalica",
  "industrial",
  "popayan",
  "pereira",
  "cali",
  "bogota",
  "proyecto",
  "colombia",
  "consorcio",
  "unico",
  "ampliacion",
  "etapa",
  "sede",
  "construccion",
  "2012",
  "2013",
  "scaled",
])

function tokenizeLocal(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 4 && !STOPWORDS_LOCAL.has(t))
}

async function main() {
  const matchesArg = process.argv.find((a) => a.startsWith("--matches="))?.split("=")[1]
  const matchesFile = matchesArg ?? "/tmp/matches.txt"
  console.log(`\n🔍 Parseando ${matchesFile}...`)
  const byProject = await parseMatches(matchesFile)
  console.log(`📦 Proyectos elegibles: ${byProject.size}`)
  if (limit > 0) console.log(`   Límite: ${limit}`)
  if (dryRun) console.log(`   DRY-RUN (no sube nada, no toca DB)\n`)

  const slugs = Array.from(byProject.keys())
  const targetSlugs = limit > 0 ? slugs.slice(0, limit) : slugs

  const storage = dryRun ? null : new Storage({ projectId: GCS_PROJECT_ID })
  const bucket = dryRun ? null : storage!.bucket(GCS_BUCKET_NAME)

  let totalUploaded = 0
  let totalUpscaled = 0
  let totalSkipped = 0
  let totalFailed = 0

  for (const slug of targetSlugs) {
    const proyecto = await prisma.proyecto.findUnique({
      where: { slug },
      include: { imagenes: { select: { url: true } } },
    })
    if (!proyecto) {
      console.log(`⚠️  ${slug} no encontrado en DB — skip`)
      continue
    }
    // Si ya tiene imágenes, saltar (idempotente — ya fue recuperado)
    if (proyecto.imagenes.length > 0) {
      console.log(`⏭️  ${slug} ya tiene ${proyecto.imagenes.length} imgs — skip`)
      continue
    }

    const candidates = byProject.get(slug)!
    const picks = await pickBestCandidates(slug, proyecto.titulo, candidates, 6)

    console.log(`\n📦 ${proyecto.titulo}`)
    console.log(`   slug: ${slug}`)
    console.log(`   ${candidates.length} candidates → ${picks.length} picks (dedup)`)

    for (let i = 0; i < picks.length; i++) {
      const c = picks[i]
      const absolutePath = path.join(ROOT, c.file)
      if (!existsSync(absolutePath)) {
        console.log(`   ⚠️  [${i + 1}] no existe: ${c.file}`)
        totalFailed++
        continue
      }

      try {
        let buf = await readFile(absolutePath)
        const meta = await sharp(buf).metadata()
        let width = meta.width ?? 0
        let height = meta.height ?? 0

        // Upscale si chica
        if (width < MIN_DIM && height < MIN_DIM) {
          console.log(`   ⚡ [${i + 1}] ${path.basename(c.file)} ${width}x${height} → upscale...`)
          if (!dryRun) {
            buf = await upscale(buf)
            const upMeta = await sharp(buf).metadata()
            width = upMeta.width ?? width
            height = upMeta.height ?? height
            totalUpscaled++
          }
        } else {
          console.log(`   · [${i + 1}] ${path.basename(c.file)} ${width}x${height}`)
        }

        // WebP optimizado
        if (!dryRun) {
          buf = await sharp(buf).webp({ quality: 88, effort: 5 }).toBuffer()
        }

        // Nombre GCS
        const cleanBase = c.baseName.replace(/[^a-zA-Z0-9-_.]/g, "-")
        const gcsName = `${cleanBase}-${width}x${height}.webp`
        const gcsPath = `projects/${slug}/${gcsName}`
        const url = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${gcsPath}`

        if (!dryRun) {
          await bucket!.file(gcsPath).save(buf, {
            metadata: {
              contentType: "image/webp",
              cacheControl: "public, max-age=31536000, immutable",
            },
            public: true,
          })

          // ImagenProyecto
          await prisma.imagenProyecto.create({
            data: {
              proyectoId: proyecto.id,
              url,
              tipo: (i === 0 ? "PORTADA" : "GALERIA") as TipoImagen,
              orden: i,
              alt: proyecto.titulo,
              width,
              height,
            },
          })

          // Media pool
          const existingM = await prisma.media.findFirst({
            where: { pathGcs: gcsPath },
            select: { id: true },
          })
          const mediaData = {
            url,
            pathGcs: gcsPath,
            fileName: gcsName,
            contentType: "image/webp",
            kind: MediaKind.IMAGE,
            size: buf.byteLength,
            width,
            height,
            folder: `projects/${slug}`,
            title: proyecto.titulo,
            tags: [`proyecto:${slug}`, "projects", "recuperada"],
          } satisfies Prisma.MediaCreateInput
          if (existingM) {
            await prisma.media.update({ where: { id: existingM.id }, data: mediaData })
          } else {
            await prisma.media.create({ data: mediaData })
          }
        }

        console.log(`   ✅ ${gcsPath}`)
        totalUploaded++
      } catch (e) {
        console.error(`   ❌ [${i + 1}] ${path.basename(c.file)}: ${(e as Error).message}`)
        totalFailed++
      }
    }
  }

  console.log(`\n\n📊 Resumen:`)
  console.log(`   Proyectos elegibles procesados: ${targetSlugs.length}`)
  console.log(`   Imágenes subidas:   ${totalUploaded}`)
  console.log(`   Imágenes upscaleadas: ${totalUpscaled}`)
  console.log(`   Fallos:             ${totalFailed}`)
  console.log(`\n💰 Costo estimado Vertex AI: ~$${(totalUpscaled * 0.003).toFixed(3)}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

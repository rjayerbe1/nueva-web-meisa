/**
 * Auditoría de resolución de imágenes por proyecto.
 *
 * Criterios de "necesita upscale":
 *   - width o height < 1000 px
 *   - O url contiene "400x400" / "200x" / "300x" / "600x" / similar
 *   - O width/height son null (desconocido — probable legacy)
 *
 * Salida: tabla por proyecto con conteo y sample URLs.
 * Opcional: --full muestra todas las URLs, no solo sample.
 *
 * Uso:
 *   npx tsx scripts/audit-project-images.ts
 *   npx tsx scripts/audit-project-images.ts --full
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })

import { existsSync } from "node:fs"
import path from "node:path"
import sharp from "sharp"
import { prisma } from "../lib/prisma"

const SMALL_THRESHOLD = 1000
const FILENAME_PATTERNS = [/\d{2,3}x\d{2,3}(?=\.|$|-)/i]

const full = process.argv.includes("--full")
const probe = process.argv.includes("--probe") // leer dims reales de archivos locales con sharp
const PUBLIC_DIR = path.join(process.cwd(), "public")

type Flag = "small" | "unknown" | "ok"

function classify(im: {
  width: number | null
  height: number | null
  url: string
}): Flag {
  if (im.width != null && im.height != null) {
    return im.width < SMALL_THRESHOLD || im.height < SMALL_THRESHOLD ? "small" : "ok"
  }
  // Sin dimensiones — inferir por filename
  const fname = im.url.split("/").pop() ?? ""
  for (const re of FILENAME_PATTERNS) {
    const m = fname.match(re)
    if (m) {
      const dims = m[0].toLowerCase().split("x").map(Number)
      if (dims.some((d) => d < SMALL_THRESHOLD)) return "small"
      return "ok" // filename dice big (p.ej. 2000x2000)
    }
  }
  return "unknown"
}

async function probeLocal(url: string): Promise<{ w: number; h: number } | null> {
  if (!url.startsWith("/")) return null
  const p = path.join(PUBLIC_DIR, url.replace(/^\//, ""))
  if (!existsSync(p)) return null
  try {
    const meta = await sharp(p).metadata()
    if (meta.width && meta.height) return { w: meta.width, h: meta.height }
  } catch {
    // archivo corrupto o formato no soportado — ignorar
  }
  return null
}

async function main() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { titulo: "asc" },
    include: { imagenes: { orderBy: [{ tipo: "asc" }, { orden: "asc" }] } },
  })

  console.log(`\n🔍 Auditoría de imágenes — ${proyectos.length} proyectos`)
  if (probe) console.log("   (--probe activo: leyendo dimensiones reales de archivos locales)")
  console.log()

  type Row = {
    id: string
    url: string
    tipo: string
    width: number | null
    height: number | null
    flag: Flag
  }
  const byProject = new Map<
    string,
    { slug: string; titulo: string; totalImgs: number; rows: Row[] }
  >()

  for (const p of proyectos) {
    const rows: Row[] = []
    for (const im of p.imagenes) {
      let flag = classify(im)
      let width = im.width
      let height = im.height

      // Si pedimos probing y no tenemos dims ni patrón → intentar sharp
      if (probe && flag === "unknown") {
        const probed = await probeLocal(im.url)
        if (probed) {
          width = probed.w
          height = probed.h
          flag =
            probed.w < SMALL_THRESHOLD || probed.h < SMALL_THRESHOLD ? "small" : "ok"
        }
      }

      rows.push({
        id: im.id,
        url: im.url,
        tipo: String(im.tipo),
        width,
        height,
        flag,
      })
    }
    byProject.set(p.slug, {
      slug: p.slug,
      titulo: p.titulo,
      totalImgs: p.imagenes.length,
      rows,
    })
  }

  const projectsWithSmall = Array.from(byProject.values())
    .filter((p) => p.rows.some((r) => r.flag === "small"))
    .sort(
      (a, b) =>
        b.rows.filter((r) => r.flag === "small").length -
        a.rows.filter((r) => r.flag === "small").length,
    )

  const totalSmall = projectsWithSmall.reduce(
    (s, p) => s + p.rows.filter((r) => r.flag === "small").length,
    0,
  )
  const totalUnknown = Array.from(byProject.values()).reduce(
    (s, p) => s + p.rows.filter((r) => r.flag === "unknown").length,
    0,
  )

  console.log(`🚩 Proyectos con imágenes <${SMALL_THRESHOLD}px confirmadas: ${projectsWithSmall.length}`)
  console.log(`❓ Imágenes con dimensiones desconocidas (posiblemente OK): ${totalUnknown}`)
  console.log(`✅ Proyectos sin problemas: ${proyectos.length - projectsWithSmall.length}\n`)

  for (const p of projectsWithSmall) {
    const small = p.rows.filter((r) => r.flag === "small")
    console.log(`─────────────────────────────────────────`)
    console.log(`📦 ${p.titulo}`)
    console.log(`   slug: ${p.slug}`)
    console.log(`   ${small.length}/${p.totalImgs} imágenes chicas`)

    const samples = full ? small : small.slice(0, 3)
    for (const im of samples) {
      const dim = im.width && im.height ? `${im.width}x${im.height}` : "?x?"
      const fname = im.url.split("/").pop()?.slice(0, 65)
      console.log(`     [${im.tipo}] ${dim} · ${fname}`)
    }
    if (!full && small.length > 3) {
      console.log(`     ...y ${small.length - 3} más`)
    }
  }

  console.log(`\n─────────────────────────────────────────`)
  console.log(`📊 Total imágenes a upscalear (confirmadas): ${totalSmall}`)
  console.log(`💰 Costo estimado Imagen 4 Upscale: $${(totalSmall * 0.003).toFixed(3)}`)
  console.log(`⏱️  Tiempo estimado: ~${Math.ceil((totalSmall * 16) / 60)} minutos`)
  if (totalUnknown > 0) {
    console.log(
      `\n💡 Hay ${totalUnknown} imágenes sin dims en DB — corré con --probe para leer del disco.`,
    )
  }
  console.log()

  console.log(`🚀 Para procesar un proyecto:`)
  console.log(
    `   npx tsx scripts/upscale-project-images.ts <slug> --model=imagen --out=~/Downloads/meisa-upscale-<slug>`,
  )
  console.log(
    `   npx tsx scripts/apply-upscaled-images.ts --slug=<slug> --out=~/Downloads/meisa-upscale-<slug>\n`,
  )

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

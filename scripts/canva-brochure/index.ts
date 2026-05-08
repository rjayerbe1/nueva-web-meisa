// Entry point — multi-categoría.
// Por defecto genera las 5 categorías nuevas (todas excepto Puentes — ya tiene v12 pulido).
// Con --categoria=X genera solo esa(s).
//
// Ejemplos:
//   npx tsx scripts/canva-brochure/index.ts
//   npx tsx scripts/canva-brochure/index.ts --categoria=edificaciones
//   npx tsx scripts/canva-brochure/index.ts --categoria=puentes,industrial

import path from "node:path"
import fs from "node:fs"
import PptxGenJS from "pptxgenjs"
import QRCode from "qrcode"
import { PrismaClient, type CategoriaEnum } from "@prisma/client"

import type { LayoutKey, ProyectoBrochure } from "./data"
import { PROYECTOS_SAMPLE } from "./data"
import { CATEGORIAS, categoriaFromSlug, type CategoriaConfig } from "./categorias"
import { loadProyectosByCategoria, loadStatsCategoria } from "./loaders"
import {
  setBrochureContext,
  drawPortada,
  drawContraportada,
  drawLayoutA, drawLayoutB, drawLayoutC, drawLayoutD, drawLayoutE,
  drawLayoutF, drawLayoutG, drawLayoutH, drawLayoutI, drawLayoutJ,
  drawLayoutK, drawLayoutL, drawLayoutM, drawLayoutN, drawLayoutO,
} from "./layouts"
import {
  drawPortadaAngular,
  drawContraportadaAngular,
  drawLayoutP, drawLayoutQ, drawLayoutR, drawLayoutS, drawLayoutT,
} from "./layouts-extra"

// ============================================================
// Layout dispatch — los A-O no necesitan cfg, los P-T sí
// ============================================================

type LayoutFn = (
  pres: PptxGenJS,
  p: ProyectoBrochure,
  pageNumber: number,
  cfg: CategoriaConfig,
) => void

const LAYOUT_FNS: Record<LayoutKey, LayoutFn> = {
  A: (pres, p, n) => drawLayoutA(pres, p as any, n),
  B: (pres, p, n) => drawLayoutB(pres, p as any, n),
  C: (pres, p, n) => drawLayoutC(pres, p as any, n),
  D: (pres, p, n) => drawLayoutD(pres, p as any, n),
  E: (pres, p, n) => drawLayoutE(pres, p as any, n),
  F: (pres, p, n) => drawLayoutF(pres, p as any, n),
  G: (pres, p, n) => drawLayoutG(pres, p as any, n),
  H: (pres, p, n) => drawLayoutH(pres, p as any, n),
  I: (pres, p, n) => drawLayoutI(pres, p as any, n),
  J: (pres, p, n) => drawLayoutJ(pres, p as any, n),
  K: (pres, p, n) => drawLayoutK(pres, p as any, n),
  L: (pres, p, n) => drawLayoutL(pres, p as any, n),
  M: (pres, p, n) => drawLayoutM(pres, p as any, n),
  N: (pres, p, n) => drawLayoutN(pres, p as any, n),
  O: (pres, p, n) => drawLayoutO(pres, p as any, n),
  P: (pres, p, n, cfg) => drawLayoutP(pres, p, n, cfg),
  Q: (pres, p, n, cfg) => drawLayoutQ(pres, p, n, cfg),
  R: (pres, p, n, cfg) => drawLayoutR(pres, p, n, cfg),
  S: (pres, p, n, cfg) => drawLayoutS(pres, p, n, cfg),
  T: (pres, p, n, cfg) => drawLayoutT(pres, p, n, cfg),
}

// ============================================================
// CLI args
// ============================================================

function parseArgs(): { targets: CategoriaEnum[] } {
  const args = process.argv.slice(2)
  const flag = args.find((a) => a.startsWith("--categoria="))?.split("=")[1]

  // Sin flag → las 5 nuevas (no regeneramos Puentes que ya está pulido en v12)
  const ALL_NEW: CategoriaEnum[] = [
    "EDIFICACIONES",
    "COMERCIAL",
    "INDUSTRIAL",
    "DEPORTES_EDUCACION",
    "INFRAESTRUCTURA_URBANA",
  ]
  if (!flag) return { targets: ALL_NEW }

  // Con flag → resolver slugs
  const targets = flag
    .split(",")
    .map((s) => s.trim())
    .map((s) => categoriaFromSlug(s))
    .filter((c): c is CategoriaEnum => c !== null)

  if (targets.length === 0) {
    console.error(`❌ Categoría(s) inválida(s): "${flag}"`)
    console.error(`   Slugs válidos: ${Object.values(CATEGORIAS).map((c) => c.slug).join(", ")}`)
    process.exit(1)
  }
  return { targets }
}

// ============================================================
// Generación por categoría
// ============================================================

async function generarBrochure(
  prisma: PrismaClient,
  cat: CategoriaEnum,
): Promise<{ outPath: string; sizeKB: number; pages: number } | null> {
  const cfg = CATEGORIAS[cat]
  console.log(`\n▶ Generando: ${cat} (${cfg.tagline})`)

  // Configurar contexto global de layouts
  setBrochureContext({
    tagline: cfg.tagline,
    specsVisibles: cfg.specsVisibles,
  })

  // Cargar proyectos: PUENTES usa data legacy (PROYECTOS_SAMPLE), resto desde Prisma
  let proyectos: ProyectoBrochure[]
  if (cat === "PUENTES") {
    proyectos = [...PROYECTOS_SAMPLE]
    console.log(`   · ${proyectos.length} proyectos legacy (PROYECTOS_SAMPLE)`)
  } else {
    proyectos = await loadProyectosByCategoria(prisma, cat)
    const stats = await loadStatsCategoria(prisma, cat)
    console.log(`   · ${proyectos.length} proyectos con imagen / ${stats.total} totales / ${stats.toneladasFmt} ton`)
  }

  if (proyectos.length === 0) {
    console.log(`   ⚠ Sin proyectos con imagen — salto`)
    return null
  }

  // Crear presentación
  const pres = new PptxGenJS()
  pres.layout = "LAYOUT_WIDE"
  pres.title = `MEISA — ${cfg.tagline} 2026`
  pres.author = "MEISA"

  // 1. Portada
  if (cfg.portadaVariant === "angular") {
    drawPortadaAngular(pres, cfg, proyectos[0]?.fotos[0])
  } else {
    drawPortada(pres, pres)
  }

  // 2. Páginas de proyecto
  proyectos.forEach((p, idx) => {
    const fn = LAYOUT_FNS[p.layout]
    if (!fn) {
      console.warn(`   ⚠ Layout "${p.layout}" no implementado, salto proyecto ${p.numero}`)
      return
    }
    fn(pres, p, idx + 2, cfg)
  })

  // 3. Contraportada
  if (cfg.contraportadaVariant === "angular") {
    drawContraportadaAngular(pres)
  } else {
    const qrDataUri = await QRCode.toDataURL("https://meisa.com.co", {
      margin: 0,
      width: 300,
      color: { dark: "#FFFFFF", light: "#1A367200" },
    })
    drawContraportada(pres, qrDataUri)
  }

  // 4. Escribir
  const outDir = path.join(__dirname, "out")
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, `portafolio-${cfg.slug}-2026.pptx`)
  await pres.writeFile({ fileName: outPath })
  const finalPath = outPath.endsWith(".pptx") ? outPath : `${outPath}.pptx`
  const stat = fs.statSync(finalPath)
  return {
    outPath: finalPath,
    sizeKB: stat.size / 1024,
    pages: proyectos.length + 2, // portada + N + contraportada
  }
}

// ============================================================
// Entry
// ============================================================

async function main() {
  const { targets } = parseArgs()
  console.log(`📦 Generando ${targets.length} brochure(s): ${targets.join(", ")}`)

  const prisma = new PrismaClient()
  const results: Array<{ cat: CategoriaEnum; outPath: string; sizeKB: number; pages: number }> = []

  try {
    for (const cat of targets) {
      const res = await generarBrochure(prisma, cat)
      if (res) results.push({ cat, ...res })
    }
  } finally {
    await prisma.$disconnect()
  }

  console.log("\n" + "═".repeat(60))
  console.log("✅ Generación completada")
  console.log("═".repeat(60))
  results.forEach((r) => {
    console.log(
      `   ${r.cat.padEnd(24)} ${r.pages.toString().padStart(3)} pág  ${(r.sizeKB / 1024).toFixed(1).padStart(5)} MB  →  ${r.outPath}`,
    )
  })
  console.log("\nSiguiente paso:")
  console.log("  gsutil cp out/portafolio-*.pptx gs://meisa-imagenes/canva-imports/")
  console.log("  Luego importar cada uno con mcp__canva__import-design-from-url")
}

main().catch((err) => {
  console.error("❌ Error:", err)
  process.exit(1)
})

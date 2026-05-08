// Entry point — v11 con 15 layouts (A-O) demo.
// Estructura: portada + 15 proyectos (uno por layout) + contraportada = 17 páginas.

import path from "node:path"
import fs from "node:fs"
import PptxGenJS from "pptxgenjs"
import QRCode from "qrcode"
import type { LayoutKey } from "./data"
import { PROYECTOS_SAMPLE } from "./data"
import {
  drawPortada,
  drawLayoutA,
  drawLayoutB,
  drawLayoutC,
  drawLayoutD,
  drawLayoutE,
  drawLayoutF,
  drawLayoutG,
  drawLayoutH,
  drawLayoutI,
  drawLayoutJ,
  drawLayoutK,
  drawLayoutL,
  drawLayoutM,
  drawLayoutN,
  drawLayoutO,
  drawContraportada,
} from "./layouts"

async function main() {
  const pres = new PptxGenJS()
  pres.layout = "LAYOUT_WIDE"
  pres.title = "MEISA — Portafolio Puentes 2026"
  pres.author = "MEISA"

  const qrDataUri = await QRCode.toDataURL("https://meisa.com.co", {
    margin: 0,
    width: 300,
    color: { dark: "#FFFFFF", light: "#1A367200" },
  })

  const layoutFns: Record<LayoutKey, (pres: PptxGenJS, p: typeof PROYECTOS_SAMPLE[0], n: number) => void> = {
    A: drawLayoutA, B: drawLayoutB, C: drawLayoutC, D: drawLayoutD, E: drawLayoutE,
    F: drawLayoutF, G: drawLayoutG, H: drawLayoutH, I: drawLayoutI, J: drawLayoutJ,
    K: drawLayoutK, L: drawLayoutL, M: drawLayoutM, N: drawLayoutN, O: drawLayoutO,
  }

  // 1. Portada
  drawPortada(pres, pres)

  // 2-16. 15 proyectos (uno por layout A-O)
  PROYECTOS_SAMPLE.forEach((p, idx) => {
    const fn = layoutFns[p.layout]
    fn(pres, p, idx + 2)
  })

  // 17. Contraportada
  drawContraportada(pres, qrDataUri)

  const outDir = path.join(__dirname, "out")
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, "portafolio-puentes-2026.pptx")
  await pres.writeFile({ fileName: outPath })
  const finalPath = outPath.endsWith(".pptx") ? outPath : `${outPath}.pptx`
  const stat = fs.statSync(finalPath)
  console.log(`✅ PPTX v11 generado: ${finalPath}`)
  console.log(`   Tamaño: ${(stat.size / 1024).toFixed(1)} KB`)
  console.log(`   Páginas: 17 (portada + 15 layouts demo + contraportada)`)
}

main().catch((err) => {
  console.error("❌ Error generando PPTX:", err)
  process.exit(1)
})

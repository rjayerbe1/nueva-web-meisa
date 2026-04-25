/**
 * Genera 6 PDFs (uno por categoría) con thumbnails pre-resizeados.
 * Las imágenes se descargan, resizean a 400x300 con sharp y se embebenen base64.
 * Resultado: PDFs ~5-10MB cada uno, fáciles de leer.
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })
import { writeFileSync } from "node:fs"
import sharp from "sharp"
import { prisma } from "../lib/prisma"

const CATEGORY_TO_ENUM: Record<string, string> = {
  comercial: "COMERCIAL",
  industrial: "INDUSTRIAL",
  puentes: "PUENTES",
  "infraestructura-urbana": "INFRAESTRUCTURA_URBANA",
  edificaciones: "EDIFICACIONES",
  institucional: "DEPORTES_EDUCACION",
}

const STYLES = `
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; background: #fff; color: #000; padding: 12px; }
  h1 { font-size: 22px; margin-bottom: 16px; color: #dc2626; }
  h3 { margin: 18px 0 6px; font-size: 14px; color: #1e40af; border-bottom: 1px solid #ccc; padding-bottom: 3px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .card { border: 1px solid #ddd; overflow: hidden; page-break-inside: avoid; }
  .card.current { border: 2px solid #22c55e; }
  .card img { width: 100%; height: 180px; object-fit: cover; display: block; }
  .card .meta { padding: 4px; font-size: 8px; color: #555; line-height: 1.2; }
  .card .meta .file { font-family: monospace; word-break: break-all; color: #000; font-size: 7px; }
  .card .meta .proj { color: #b45309; margin-bottom: 1px; font-weight: bold; font-size: 9px; }
  .card .meta .dim { color: #1e40af; font-weight: bold; }
  .source-tag { display: inline-block; padding: 1px 3px; background: #e5e5e5; color: #555; font-size: 7px; margin-right: 2px; font-weight: bold; }
  .source-tag.drone { background: #fef3c7; color: #92400e; }
  .source-tag.same-proj { background: #d1fae5; color: #065f46; }
  .source-tag.current { background: #22c55e; color: #fff; }
  .stat { color: #888; font-size: 9px; margin: 2px 0 6px; }
</style>
`

const cache = new Map<string, string>()

async function urlToDataUri(url: string): Promise<string> {
  if (cache.has(url)) return cache.get(url)!
  try {
    const res = await fetch(url)
    if (!res.ok) return ""
    const buf = Buffer.from(await res.arrayBuffer())
    const resized = await sharp(buf).resize(400, 300, { fit: "cover" }).webp({ quality: 70 }).toBuffer()
    const dataUri = `data:image/webp;base64,${resized.toString("base64")}`
    cache.set(url, dataUri)
    return dataUri
  } catch {
    return ""
  }
}

async function main() {
  const cats = await prisma.categoriaProyecto.findMany({ orderBy: { orden: "asc" } })

  for (const c of cats) {
    const esp = (c.especialidades as any[] | null) ?? []
    if (esp.length === 0) continue

    const categoriaEnum = CATEGORY_TO_ENUM[c.slug] ?? ""
    const proyectosCat = await prisma.proyecto.findMany({
      where: { categoria: categoriaEnum as any, imagenes: { some: {} } },
      include: { imagenes: { orderBy: [{ tipo: "asc" }, { orden: "asc" }] } },
      take: 100,
    })

    const dronePool = await prisma.media.findMany({ where: { folder: "drone-pool" } })

    let html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${c.nombre}</title>${STYLES}</head><body>`
    html += `<h1>${c.nombre}</h1>`

    console.log(`\n📂 ${c.nombre} ...`)

    for (let i = 0; i < esp.length; i++) {
      const e = esp[i]
      const currentImg: string = e.imagen ?? ""
      const currentFilename = currentImg.split("/").pop()?.split("?")[0] ?? ""

      html += `<h3>${i + 1}. ${e.titulo}</h3>`
      html += `<div class="stat">Hero actual: ${currentFilename}</div>`

      const proyectoAsignado = proyectosCat.find((p) =>
        p.imagenes.some((im) => im.url === currentImg),
      )

      html += `<div class="grid">`

      // Mismo proyecto
      if (proyectoAsignado) {
        for (const im of proyectoAsignado.imagenes) {
          const isCurrent = im.url === currentImg
          const dataUri = await urlToDataUri(im.url)
          if (!dataUri) continue
          html += `<div class="card${isCurrent ? " current" : ""}">
  <img src="${dataUri}" />
  <div class="meta">
    <span class="source-tag same-proj">PROYECTO</span>${isCurrent ? '<span class="source-tag current">ACTUAL</span>' : ""}
    <div class="proj">${proyectoAsignado.titulo}</div>
    <div class="dim">${im.width}x${im.height}</div>
    <div class="file">${im.url.split("/").pop()?.slice(0, 70)}</div>
  </div>
</div>`
        }
      }

      // Drone pool
      for (const m of dronePool) {
        const dataUri = await urlToDataUri(m.url)
        if (!dataUri) continue
        html += `<div class="card">
  <img src="${dataUri}" />
  <div class="meta">
    <span class="source-tag drone">🚁 DRONE</span>
    <div class="proj">${m.title}</div>
    <div class="dim">${m.width}x${m.height}</div>
    <div class="file">${m.fileName}</div>
  </div>
</div>`
      }

      // Otros proyectos
      for (const p of proyectosCat) {
        if (proyectoAsignado && p.id === proyectoAsignado.id) continue
        const samples = p.imagenes.slice(0, 3)
        for (const im of samples) {
          const dataUri = await urlToDataUri(im.url)
          if (!dataUri) continue
          html += `<div class="card">
  <img src="${dataUri}" />
  <div class="meta">
    <span class="source-tag">OTRO</span>
    <div class="proj">${p.titulo}</div>
    <div class="dim">${im.width}x${im.height}</div>
    <div class="file">${im.url.split("/").pop()?.slice(0, 70)}</div>
  </div>
</div>`
        }
      }

      html += `</div>`
    }

    html += `</body></html>`

    const outPath = `/tmp/hero-picker-${c.slug}.html`
    writeFileSync(outPath, html)
    const sizeMb = (Buffer.byteLength(html, "utf8") / 1024 / 1024).toFixed(1)
    console.log(`✅ ${outPath} (${sizeMb}MB)`)
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

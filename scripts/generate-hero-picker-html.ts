/**
 * Genera 6 HTMLs (uno por categoría) en /tmp/hero-picker-<slug>.html
 * Después se convierten a PDF uno por uno con html-to-pdf.ts
 *
 * Cada HTML muestra:
 *   - Cada especialidad de esa categoría
 *   - Imágenes del proyecto actualmente asignado (PORTADA + GALERIA)
 *   - Drone pool con tags relevantes
 *   - Imágenes de otros proyectos de la misma categoría (top 3 c/u)
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })
import { writeFileSync } from "node:fs"
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
  body { font-family: -apple-system, system-ui, sans-serif; background: #fff; color: #000; padding: 15px; }
  h1 { font-size: 24px; margin-bottom: 20px; color: #dc2626; }
  h3 { margin: 25px 0 8px; font-size: 16px; color: #1e40af; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px; }
  .card { border: 1px solid #ddd; background: #fff; overflow: hidden; page-break-inside: avoid; }
  .card.current { border: 2px solid #22c55e; }
  .card img { width: 100%; height: 220px; object-fit: cover; display: block; }
  .card .meta { padding: 6px; font-size: 9px; color: #555; }
  .card .meta .file { font-family: monospace; word-break: break-all; color: #000; font-size: 8px; }
  .card .meta .proj { color: #b45309; margin-bottom: 2px; font-weight: bold; font-size: 10px; }
  .card .meta .dim { color: #1e40af; font-weight: bold; }
  .source-tag { display: inline-block; padding: 1px 4px; background: #e5e5e5; color: #555; font-size: 8px; margin-right: 3px; font-weight: bold; }
  .source-tag.drone { background: #fef3c7; color: #92400e; }
  .source-tag.same-proj { background: #d1fae5; color: #065f46; }
  .source-tag.current { background: #22c55e; color: #fff; }
  .stat { color: #888; font-size: 11px; margin: 3px 0 10px; }
</style>
`

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

    let html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Hero — ${c.nombre}</title>${STYLES}</head><body>`
    html += `<h1>📂 ${c.nombre}</h1>`

    for (let i = 0; i < esp.length; i++) {
      const e = esp[i]
      const currentImg: string = e.imagen ?? ""
      const currentFilename = currentImg.split("/").pop()?.split("?")[0] ?? ""

      html += `<h3>${i + 1}. ${e.titulo}</h3>`
      html += `<div class="stat">Hero actual: <code>${currentFilename}</code></div>`

      const proyectoAsignado = proyectosCat.find((p) =>
        p.imagenes.some((im) => im.url === currentImg),
      )

      html += `<div class="grid">`

      if (proyectoAsignado) {
        for (const im of proyectoAsignado.imagenes) {
          const isCurrent = im.url === currentImg
          html += `<div class="card${isCurrent ? " current" : ""}">
  <img src="${im.url}" />
  <div class="meta">
    <span class="source-tag same-proj">MISMO PROYECTO</span>${isCurrent ? '<span class="source-tag current">ACTUAL</span>' : ""}
    <div class="proj">${proyectoAsignado.titulo}</div>
    <div class="dim">${im.width}x${im.height} · ${im.tipo}</div>
    <div class="file">${im.url.split("/").pop()?.slice(0, 80)}</div>
  </div>
</div>`
        }
      }

      for (const m of dronePool) {
        html += `<div class="card">
  <img src="${m.url}" />
  <div class="meta">
    <span class="source-tag drone">🚁 DRONE</span>
    <div class="proj">${m.title}</div>
    <div class="dim">${m.width}x${m.height}</div>
    <div class="file">${m.fileName}</div>
  </div>
</div>`
      }

      for (const p of proyectosCat) {
        if (proyectoAsignado && p.id === proyectoAsignado.id) continue
        const samples = p.imagenes.slice(0, 3)
        for (const im of samples) {
          html += `<div class="card">
  <img src="${im.url}" />
  <div class="meta">
    <span class="source-tag">OTRO PROYECTO</span>
    <div class="proj">${p.titulo}</div>
    <div class="dim">${im.width}x${im.height}</div>
    <div class="file">${im.url.split("/").pop()?.slice(0, 80)}</div>
  </div>
</div>`
        }
      }

      html += `</div>`
    }

    html += `</body></html>`

    const outPath = `/tmp/hero-picker-${c.slug}.html`
    writeFileSync(outPath, html)
    console.log(`✅ ${outPath}`)
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

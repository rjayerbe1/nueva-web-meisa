/**
 * Lista todas las especialidades de cada categoría + sugiere fotos reales
 * de proyectos MEISA (de la misma categoría) para reemplazar las imágenes
 * de stock.
 *
 * Uso:
 *   npx tsx scripts/suggest-especialidad-images.ts
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })
import { prisma } from "../lib/prisma"

function isStock(url: string | null | undefined): boolean {
  if (!url) return false
  return url.includes("unsplash") || url.includes("pexels") || url.includes("pixabay")
}

async function main() {
  const categorias = await prisma.categoriaProyecto.findMany({
    orderBy: { orden: "asc" },
  })

  for (const c of categorias) {
    const esp = (c.especialidades as any[] | null) ?? []
    if (esp.length === 0) continue

    console.log(`\n════════════════════════════════════════════`)
    console.log(`📂 ${c.nombre} (${c.slug}) — ${esp.length} especialidades`)
    console.log(`════════════════════════════════════════════`)

    // Proyectos de esta categoría con imágenes reales (GCS + en DB)
    const proyectos = await prisma.proyecto.findMany({
      where: {
        categoria: c.key,
        visible: true,
        imagenes: { some: {} },
      },
      include: {
        imagenes: {
          orderBy: [{ tipo: "asc" }, { orden: "asc" }],
          take: 3,
        },
      },
      take: 20,
      orderBy: [{ destacado: "desc" }, { ordenFrontend: "asc" }],
    })

    console.log(`\n🏗️  Proyectos disponibles (${proyectos.length}):`)
    for (const p of proyectos) {
      const imgCount = p.imagenes.length
      console.log(`   • ${p.titulo}`)
      console.log(`     slug: ${p.slug} · ${imgCount} imágenes`)
      if (p.imagenes[0]) {
        const thumb = p.imagenes[0].url.split("/").pop()?.slice(0, 60)
        console.log(`     preview: ${thumb}`)
      }
    }

    console.log(`\n🎯 Especialidades a reemplazar:`)
    for (let i = 0; i < esp.length; i++) {
      const e = esp[i]
      const stockFlag = isStock(e.imagen) ? " 🚨 STOCK" : ""
      console.log(`   ${String(i + 1).padStart(2, "0")}. ${e.titulo}${stockFlag}`)
      console.log(`       imagen actual: ${e.imagen?.slice(0, 80) || "(sin imagen)"}`)
      if (e.ideal_para) console.log(`       ideal para: ${e.ideal_para.join(", ")}`)
      if (e.descripcion_corta) {
        console.log(`       descripción: ${e.descripcion_corta.slice(0, 100)}...`)
      }
    }
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

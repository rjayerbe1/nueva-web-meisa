/**
 * Reemplaza las imágenes de stock (Unsplash) en cada CategoriaProyecto.especialidades
 * con la portada real de un proyecto MEISA sugerido.
 *
 * Matches definidos manualmente en MAPPING — si un match no existe (o el
 * proyecto no tiene portada), se deja la imagen actual (stock).
 *
 * Uso:
 *   npx tsx scripts/apply-especialidad-real-photos.ts [--dry-run]
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })
import { prisma } from "../lib/prisma"

const dryRun = process.argv.includes("--dry-run")

// Clave = slug de la categoría. Valor = array de slugs de proyecto por
// posición de especialidad (índice 0 = especialidad 1, etc.).
// Usar null si no hay match claro (se queda la imagen actual).
const MAPPING: Record<string, Array<string | null>> = {
  comercial: [
    "centro-comercial-campanario",
    "centro-comercial-unico-cali",
    "centro-comercial-armenia-plaza",
  ],
  industrial: [
    "bodega-protecnica-etapa-ii",
    "industria-torre-cogeneracion-propal",
    "tanques-de-almacenamiento-glp",
  ],
  puentes: [
    "puente-vehicular-la-paila",
    "casa-puente-cascada",
    "puente-peatonal-la-tertulia",
  ],
  "infraestructura-urbana": [
    "escalinata-curva-rio-cali",
    "edificio-estacion-mio-guadalupe",
    null, // Terminales intermunicipal — sin match obvio
  ],
  edificaciones: [
    "edificio-clinica-reina-victoria",
    null, // Estacionamientos — sin match
    "edificio-modulos-medicos",
  ],
  institucional: [
    "coliseo-mayor-juegos-nacionales-2012",
    "complejo-acuatico-popayan",
    "escenario-deportivo-cecun",
  ],
}

async function main() {
  console.log(`\n🎨 Reemplazando imágenes stock de especialidades con fotos MEISA`)
  console.log(`   Modo: ${dryRun ? "DRY-RUN" : "LIVE"}\n`)

  let updatedCount = 0
  let skippedCount = 0

  for (const [catSlug, projectSlugs] of Object.entries(MAPPING)) {
    const categoria = await prisma.categoriaProyecto.findFirst({
      where: { slug: catSlug },
    })
    if (!categoria) {
      console.warn(`⚠️  Categoría ${catSlug} no encontrada`)
      continue
    }

    const especialidades = (categoria.especialidades as any[] | null) ?? []
    if (especialidades.length === 0) {
      console.warn(`⚠️  ${catSlug}: sin especialidades`)
      continue
    }

    console.log(`\n📂 ${categoria.nombre} (${catSlug})`)
    const newEspecialidades = [...especialidades]

    for (let i = 0; i < especialidades.length; i++) {
      const esp = especialidades[i]
      const projectSlug = projectSlugs[i]

      if (!projectSlug) {
        console.log(`   ⏭️  [${i + 1}] ${esp.titulo} — sin match sugerido, skip`)
        skippedCount++
        continue
      }

      // Buscar la portada (ImagenProyecto tipo=PORTADA, o la primera disponible)
      const proyecto = await prisma.proyecto.findFirst({
        where: { slug: projectSlug },
        include: {
          imagenes: {
            orderBy: [{ tipo: "asc" }, { orden: "asc" }],
          },
        },
      })

      if (!proyecto || proyecto.imagenes.length === 0) {
        console.log(`   ⚠️  [${i + 1}] ${esp.titulo} — proyecto ${projectSlug} sin imágenes`)
        skippedCount++
        continue
      }

      // Preferir PORTADA si existe
      const portada =
        proyecto.imagenes.find((im) => String(im.tipo) === "PORTADA") ??
        proyecto.imagenes[0]

      const oldImg = esp.imagen?.slice(0, 60) || "(ninguna)"
      const newImg = portada.url

      console.log(`   ✓ [${i + 1}] ${esp.titulo}`)
      console.log(`       proyecto: ${proyecto.titulo}`)
      console.log(`       antes:  ${oldImg}${esp.imagen && esp.imagen.length > 60 ? "…" : ""}`)
      console.log(`       ahora:  ${newImg.split("/").pop()?.slice(0, 60)}…`)

      newEspecialidades[i] = { ...esp, imagen: newImg }
      updatedCount++
    }

    if (!dryRun) {
      await prisma.categoriaProyecto.update({
        where: { id: categoria.id },
        data: { especialidades: newEspecialidades as any },
      })
    }
  }

  console.log(`\n📊 Resumen:`)
  console.log(`   Actualizadas: ${updatedCount}`)
  console.log(`   Skipped:      ${skippedCount}`)
  if (dryRun) console.log(`   (DRY-RUN — sin cambios)`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

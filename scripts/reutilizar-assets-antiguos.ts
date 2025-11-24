import { PrismaClient, CategoriaEnum } from '@prisma/client'

const prisma = new PrismaClient()

// Mapeo de categorías nuevas → assets de categorías antiguas
const assetsMapping = {
  [CategoriaEnum.COMERCIAL]: {
    imagenCover: '/images/categories/centros-comerciales/cover.jpg',
    icono: 'image:centros-comerciales', // usa el icono PNG existente
    descripcion: 'Centros comerciales, locales retail, cines y espacios de entretenimiento',
  },
  [CategoriaEnum.INDUSTRIAL]: {
    imagenCover: '/images/categories/industria/cover.jpg',
    icono: 'image:industria', // usa el icono PNG existente
    descripcion: 'Bodegas, centros de distribución, plantas industriales y estructuras para producción',
  },
  [CategoriaEnum.PUENTES]: {
    imagenCover: '/images/categories/puentes-vehiculares/cover.jpg',
    icono: 'image:puentes-vehiculares', // usa el icono PNG existente
    descripcion: 'Puentes vehiculares, peatonales, ciclopuentes y viaductos. Uno de nuestros pilares más fuertes con más de 7,500 toneladas de estructura metálica instalada',
  },
  [CategoriaEnum.INFRAESTRUCTURA_URBANA]: {
    imagenCover: '/images/categories/oil-and-gas/cover.jpg',
    icono: 'image:oil-and-gas', // usa el icono PNG existente
    descripcion: 'Estaciones de transporte público, mobiliario urbano y estructuras para infraestructura pública',
  },
  [CategoriaEnum.EDIFICACIONES]: {
    imagenCover: '/images/categories/edificios/cover.jpg',
    icono: 'image:edificios', // usa el icono PNG existente
    descripcion: 'Edificios de oficinas, institucionales, parqueaderos y estructuras arquitectónicas',
  },
  [CategoriaEnum.DEPORTES_EDUCACION]: {
    imagenCover: '/images/categories/escenarios-deportivos/cover.jpg',
    icono: 'image:escenarios-deportivos', // usa el icono PNG existente
    descripcion: 'Coliseos, polideportivos, canchas, graderías e instalaciones deportivas y educativas',
  },
}

async function reutilizarAssets() {
  console.log('=== REUTILIZANDO ASSETS DE CATEGORÍAS ANTIGUAS ===\n')

  try {
    for (const [key, assets] of Object.entries(assetsMapping)) {
      const categoriaEnum = key as CategoriaEnum

      console.log(`📁 Actualizando ${categoriaEnum}...`)

      const updated = await prisma.categoriaProyecto.update({
        where: { key: categoriaEnum },
        data: {
          imagenCover: assets.imagenCover,
          icono: assets.icono,
          descripcion: assets.descripcion,
        },
      })

      console.log(`   ✓ Cover: ${updated.imagenCover}`)
      console.log(`   ✓ Icono: ${updated.icono}`)
      console.log(`   ✓ Descripción actualizada`)
      console.log('')
    }

    console.log('✅ ASSETS ACTUALIZADOS CORRECTAMENTE\n')

    // Mostrar resumen final
    console.log('📊 RESUMEN FINAL:\n')
    const categorias = await prisma.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' },
      select: {
        nombre: true,
        imagenCover: true,
        icono: true,
      }
    })

    categorias.forEach(cat => {
      console.log(`✓ ${cat.nombre}`)
      console.log(`  Cover: ${cat.imagenCover}`)
      console.log(`  Icono: ${cat.icono}\n`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

reutilizarAssets()

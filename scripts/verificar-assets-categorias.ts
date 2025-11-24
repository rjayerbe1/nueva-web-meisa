import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verificarAssets() {
  console.log('=== VERIFICANDO ASSETS DE CATEGORÍAS ===\n')

  const categorias = await prisma.categoriaProyecto.findMany({
    orderBy: { orden: 'asc' },
    select: {
      nombre: true,
      key: true,
      slug: true,
      icono: true,
      imagenCover: true,
      imagenBanner: true,
      videoCover: true,
      color: true,
      colorSecundario: true,
    }
  })

  categorias.forEach(cat => {
    console.log(`📁 ${cat.nombre} (${cat.key})`)
    console.log(`   Slug: /${cat.slug}`)
    console.log(`   Icono: ${cat.icono || '❌ NO TIENE'}`)
    console.log(`   Cover: ${cat.imagenCover || '❌ NO TIENE'}`)
    console.log(`   Banner: ${cat.imagenBanner || '❌ NO TIENE'}`)
    console.log(`   Video Cover: ${cat.videoCover || '❌ NO TIENE'}`)
    console.log(`   Color: ${cat.color || '❌ NO TIENE'}`)
    console.log(`   Color Secundario: ${cat.colorSecundario || '❌ NO TIENE'}`)
    console.log('')
  })

  await prisma.$disconnect()
}

verificarAssets()

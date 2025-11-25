const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verBeneficios() {
  try {
    const categorias = await prisma.categoria.findMany({
      where: {
        slug: {
          in: ['comercial', 'industrial', 'puentes', 'infraestructura-urbana', 'edificaciones', 'deportes-educacion']
        }
      },
      orderBy: { orden: 'asc' }
    })

    console.log('\n' + '='.repeat(80))
    console.log('BENEFICIOS ACTUALES POR CATEGORÍA')
    console.log('='.repeat(80) + '\n')

    for (const cat of categorias) {
      console.log(`📁 ${cat.nombre.toUpperCase()}`)
      console.log(`   Slug: ${cat.slug}`)
      console.log(`   Beneficios:`)
      if (cat.beneficios && cat.beneficios.length > 0) {
        cat.beneficios.forEach((ben, idx) => {
          console.log(`      ${idx + 1}. ${ben}`)
        })
      } else {
        console.log('      (Sin beneficios)')
      }
      console.log('')
    }

    console.log('='.repeat(80))
    console.log('Total categorías:', categorias.length)
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verBeneficios()

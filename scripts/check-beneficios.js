const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkBeneficios() {
  try {
    const categorias = await prisma.categoriaProyecto.findMany({
      select: {
        nombre: true,
        key: true,
        beneficios: true
      },
      orderBy: { orden: 'asc' }
    })

    console.log('\n=== BENEFICIOS ACTUALES ===\n')
    categorias.forEach(cat => {
      console.log(`${cat.nombre} (${cat.key}):`)
      if (cat.beneficios && Array.isArray(cat.beneficios) && cat.beneficios.length > 0) {
        cat.beneficios.forEach((ben, index) => {
          console.log(`  ${index + 1}. ${ben}`)
        })
      } else {
        console.log('  ❌ Sin beneficios')
      }
      console.log()
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBeneficios()

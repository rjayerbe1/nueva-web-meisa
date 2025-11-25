const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verificar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('VERIFICACIÓN: Descripciones en Base de Datos')
    console.log('='.repeat(80) + '\n')

    const categorias = await prisma.categoriaProyecto.findMany({
      where: {
        slug: {
          in: ['comercial', 'industrial', 'puentes', 'edificaciones', 'deportes-educacion']
        }
      },
      orderBy: { orden: 'asc' }
    })

    for (const cat of categorias) {
      console.log(`📁 ${cat.nombre.toUpperCase()}`)
      console.log(`   Slug: ${cat.slug}`)
      console.log(`   Especialidades: ${cat.especialidades?.length || 0}\n`)

      if (cat.especialidades && cat.especialidades.length > 0) {
        cat.especialidades.forEach((esp, idx) => {
          const palabras = esp.descripcion.split(' ').length
          const primeras50 = esp.descripcion.substring(0, 80)

          console.log(`   ${idx + 1}. ${esp.titulo}`)
          console.log(`      📏 ${palabras} palabras`)
          console.log(`      📝 "${primeras50}..."`)
          console.log()
        })
      }
      console.log('-'.repeat(80) + '\n')
    }

    console.log('✅ Verificación completada\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verificar()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function showAllEspecialidades() {
  try {
    const categorias = await prisma.categoriaProyecto.findMany({
      where: {
        especialidades: { not: null }
      },
      select: {
        nombre: true,
        key: true,
        especialidades: true
      },
      orderBy: { orden: 'asc' }
    })

    categorias.forEach(cat => {
      console.log('\n' + '='.repeat(80))
      console.log('CATEGORÍA: ' + cat.nombre.toUpperCase() + ' (' + cat.key + ')')
      console.log('='.repeat(80))

      if (cat.especialidades && Array.isArray(cat.especialidades)) {
        cat.especialidades.forEach((esp, idx) => {
          console.log('\n' + (idx + 1) + '. ' + esp.titulo)
          console.log('   Icono: ' + esp.icono)
          console.log('   Descripción:')
          const desc = esp.descripcion.length > 250 ? esp.descripcion.substring(0, 250) + '...' : esp.descripcion
          console.log('   ' + desc)
          console.log('   Métricas: ' + (esp.metricas && esp.metricas.length > 0 ? esp.metricas.join(', ') : 'N/A'))
          console.log('   Proyectos: ' + (esp.proyectosEjemplo && esp.proyectosEjemplo.length > 0 ? esp.proyectosEjemplo.join(', ') : 'N/A'))
        })
      }
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

showAllEspecialidades()

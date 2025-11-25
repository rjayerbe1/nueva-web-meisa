const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkEspecialidades() {
  try {
    const comercial = await prisma.categoriaProyecto.findFirst({
      where: { key: 'COMERCIAL' }
    })

    console.log('\n=== CATEGORÍA COMERCIAL ===')
    console.log('ID:', comercial.id)
    console.log('Nombre:', comercial.nombre)
    console.log('Slug:', comercial.slug)
    console.log('\n=== ESPECIALIDADES ===')

    if (comercial.especialidades) {
      const especialidades = comercial.especialidades
      console.log('Total especialidades:', Array.isArray(especialidades) ? especialidades.length : 0)
      console.log('Tipo de dato:', typeof especialidades)

      if (Array.isArray(especialidades)) {
        especialidades.forEach((esp, index) => {
          console.log(`\n${index + 1}. ${esp.titulo}`)
          console.log(`   Icono: ${esp.icono}`)
          console.log(`   Activo: ${esp.activo}`)
          console.log(`   Métricas: ${esp.metricas?.length || 0}`)
          console.log(`   Proyectos: ${esp.proyectosEjemplo?.length || 0}`)
        })
      }
    } else {
      console.log('❌ No hay especialidades en la base de datos')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkEspecialidades()

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    // Contar ProyectoHojaVida en DB
    const countHojaVida = await prisma.proyectoHojaVida.findMany({
      select: {
        id: true,
        objetoContrato: true,
        entidadContratante: true,
      }
    })

    console.log('=== ANÁLISIS BASE DE DATOS ACTUAL ===\n')
    console.log(`Total ProyectoHojaVida en DB: ${countHojaVida.length}`)

    // Contar categorías actuales
    const categorias = await prisma.categoriaProyecto.findMany({
      select: {
        key: true,
        nombre: true,
      }
    })

    console.log(`\nCategorías actuales: ${categorias.length}`)
    categorias.forEach(cat => {
      console.log(`  - ${cat.key}: ${cat.nombre}`)
    })

    // Mostrar algunos proyectos de ejemplo
    console.log('\nPrimeros 5 proyectos en DB:')
    countHojaVida.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.objetoContrato} - ${p.entidadContratante}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

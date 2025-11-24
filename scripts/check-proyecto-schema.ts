import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSchema() {
  try {
    // Obtener un proyecto completo para ver sus campos
    const proyecto = await prisma.proyectoHojaVida.findFirst()

    console.log('=== CAMPOS DE ProyectoHojaVida ===\n')
    console.log(JSON.stringify(proyecto, null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSchema()

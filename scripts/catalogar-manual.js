const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function obtenerProyectos() {
  try {
    const proyectos = await prisma.proyectoHojaVida.findMany({
      orderBy: { fechaInicio: 'desc' }
    })

    console.log(JSON.stringify(proyectos, null, 2))
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

obtenerProyectos()

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function leerProyectos2025() {
  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2025-01-01'),
        lte: new Date('2025-12-31')
      }
    },
    orderBy: {
      fechaFin: 'asc'
    },
    select: {
      id: true,
      entidadContratante: true,
      objetoContrato: true,
      ubicacion: true,
      fechaInicio: true,
      fechaFin: true
    }
  })

  console.log('Proyectos 2025:\n')
  proyectos.forEach(p => {
    console.log(`ID: ${p.id}`)
    console.log(`Cliente: ${p.entidadContratante}`)
    console.log(`Proyecto: ${p.objetoContrato}`)
    console.log(`Ubicación: ${p.ubicacion}`)
    console.log(`Fechas: ${p.fechaInicio.toISOString().split('T')[0]} → ${p.fechaFin.toISOString().split('T')[0]}`)
    console.log('---')
  })

  await prisma.$disconnect()
}

leerProyectos2025()

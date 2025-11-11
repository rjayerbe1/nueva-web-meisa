import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyectos = await prisma.proyectoHojaVida.findMany({
  where: {
    fechaFin: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31')
    },
    tituloDisplay: null
  }
})

proyectos.forEach(p => {
  console.log('Entidad:', p.entidadContratante)
  console.log('Objeto completo:', p.objetoContrato)
  console.log('---')
})

await prisma.$disconnect()

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyectos = await prisma.proyectoHojaVida.findMany({
  where: {
    fechaFin: {
      gte: new Date('2021-01-01'),
      lte: new Date('2022-12-31')
    },
    tituloDisplay: null
  },
  orderBy: {
    fechaFin: 'desc'
  }
})

proyectos.forEach(p => {
  const año = new Date(p.fechaFin).getFullYear()
  console.log(`${año} - ${p.entidadContratante}`)
  console.log(`Objeto: ${p.objetoContrato}`)
  console.log('---')
})

await prisma.$disconnect()

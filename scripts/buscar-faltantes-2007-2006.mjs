import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyectos = await prisma.proyectoHojaVida.findMany({
  where: {
    fechaFin: {
      gte: new Date('2006-01-01'),
      lt: new Date('2008-01-01')
    },
    tituloDisplay: null
  },
  orderBy: {
    fechaFin: 'desc'
  }
})

console.log(`Faltan ${proyectos.length} proyectos de 2007-2006:\n`)
proyectos.forEach(p => {
  const año = new Date(p.fechaFin).getFullYear()
  console.log(`[${año}] ${p.entidadContratante}`)
  console.log(`Objeto: ${p.objetoContrato}`)
  console.log('---')
})

await prisma.$disconnect()

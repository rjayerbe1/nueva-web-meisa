import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyectos = await prisma.proyectoHojaVida.findMany({
  where: {
    fechaFin: {
      gte: new Date('2012-01-01'),
      lt: new Date('2013-01-01')
    },
    tituloDisplay: null
  }
})

console.log(`Faltan ${proyectos.length} proyectos de 2012:\n`)
proyectos.forEach(p => {
  console.log(`${p.entidadContratante}`)
  console.log(`Objeto: ${p.objetoContrato}`)
  console.log('---')
})

await prisma.$disconnect()

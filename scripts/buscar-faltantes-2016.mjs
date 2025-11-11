import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyectos = await prisma.proyectoHojaVida.findMany({
  where: {
    fechaFin: {
      gte: new Date('2016-01-01'),
      lt: new Date('2017-01-01')
    },
    tituloDisplay: null
  }
})

console.log(`Faltan ${proyectos.length} proyectos:\n`)
proyectos.forEach(p => {
  console.log(`${p.entidadContratante}`)
  console.log(`Objeto: ${p.objetoContrato}`)
  console.log('---')
})

await prisma.$disconnect()

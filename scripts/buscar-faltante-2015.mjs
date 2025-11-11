import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyectos = await prisma.proyectoHojaVida.findMany({
  where: {
    fechaFin: {
      gte: new Date('2015-01-01'),
      lt: new Date('2016-01-01')
    },
    tituloDisplay: null
  }
})

console.log(`Faltante:\n`)
proyectos.forEach(p => {
  console.log(`${p.entidadContratante}`)
  console.log(`Objeto: ${p.objetoContrato}`)
})

await prisma.$disconnect()

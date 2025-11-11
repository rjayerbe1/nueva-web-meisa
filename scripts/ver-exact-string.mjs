import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyectos = await prisma.proyectoHojaVida.findMany({
  where: {
    fechaFin: {
      gte: new Date('2013-01-01'),
      lt: new Date('2014-01-01')
    },
    entidadContratante: {
      contains: 'PRODYGIO'
    }
  }
})

console.log('Proyecto encontrado:')
console.log('Entidad:', JSON.stringify(proyectos[0].entidadContratante))
console.log('Objeto:', JSON.stringify(proyectos[0].objetoContrato))
console.log('\nBytes del objeto:')
for (let i = 0; i < proyectos[0].objetoContrato.length; i++) {
  const char = proyectos[0].objetoContrato[i]
  const code = proyectos[0].objetoContrato.charCodeAt(i)
  console.log(`${i}: '${char}' (${code})`)
}

await prisma.$disconnect()

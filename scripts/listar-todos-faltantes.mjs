import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyectos = await prisma.proyectoHojaVida.findMany({
  where: {
    fechaFin: {
      gte: new Date('1996-01-01'),
      lt: new Date('2006-01-01')
    },
    tituloDisplay: null
  },
  orderBy: {
    fechaFin: 'desc'
  },
  select: {
    id: true,
    entidadContratante: true,
    objetoContrato: true,
    fechaFin: true
  }
})

console.log(`\n📋 TODOS LOS PROYECTOS FALTANTES (${proyectos.length} total):\n`)

proyectos.forEach((p, idx) => {
  const año = new Date(p.fechaFin).getFullYear()
  console.log(`[${idx + 1}] AÑO: ${año}`)
  console.log(`Entidad: ${p.entidadContratante}`)
  console.log(`Objeto completo: "${p.objetoContrato}"`)
  console.log('---\n')
})

await prisma.$disconnect()

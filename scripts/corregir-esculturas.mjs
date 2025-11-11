import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyecto = await prisma.proyectoHojaVida.findFirst({
  where: {
    fechaFin: {
      gte: new Date('2001-01-01'),
      lt: new Date('2002-01-01')
    },
    entidadContratante: {
      contains: 'GOBERNACIÓN DEL CAUCA'
    },
    objetoContrato: {
      contains: 'esculturas'
    }
  }
})

if (proyecto) {
  await prisma.proyectoHojaVida.update({
    where: { id: proyecto.id },
    data: {
      tituloDisplay: 'Gobernación del Cauca - Esculturas Tierradentro',
      descripcionSecundaria: 'Dos esculturas metálicas'
    }
  })
  console.log('✅ Corregido: Gobernación del Cauca - Esculturas Tierradentro')
} else {
  console.log('❌ No encontrado')
}

await prisma.$disconnect()

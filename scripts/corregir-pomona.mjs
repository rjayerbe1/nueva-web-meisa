import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyecto = await prisma.proyectoHojaVida.findFirst({
  where: {
    entidadContratante: {
      contains: 'POMONA'
    },
    fechaFin: {
      gte: new Date('2006-01-01'),
      lt: new Date('2007-01-01')
    }
  }
})

if (proyecto) {
  await prisma.proyectoHojaVida.update({
    where: { id: proyecto.id },
    data: {
      tituloDisplay: 'Supermercados Pomona - Sede Ciudad Jardín',
      descripcionSecundaria: 'Estructura metálica y cubierta'
    }
  })
  console.log('✅ Corregido: Supermercados Pomona - Sede Ciudad Jardín')
}

await prisma.$disconnect()

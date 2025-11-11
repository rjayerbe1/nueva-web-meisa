import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyecto = await prisma.proyectoHojaVida.findFirst({
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

if (proyecto) {
  await prisma.proyectoHojaVida.update({
    where: { id: proyecto.id },
    data: {
      tituloDisplay: 'Constructora Prodygio - Restaurante La Lomita',
      descripcionSecundaria: 'Estructura metálica y cubierta restaurante'
    }
  })

  console.log('✅ Proyecto actualizado:')
  console.log('   Constructora Prodygio - Restaurante La Lomita')
} else {
  console.log('❌ Proyecto no encontrado')
}

await prisma.$disconnect()

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyecto = await prisma.proyectoHojaVida.findFirst({
  where: {
    fechaFin: {
      gte: new Date('1999-01-01'),
      lt: new Date('2000-01-01')
    },
    entidadContratante: {
      contains: 'YAZAKI'
    }
  }
})

if (proyecto) {
  await prisma.proyectoHojaVida.update({
    where: { id: proyecto.id },
    data: {
      tituloDisplay: 'Yazaki Metrex - Fábrica Parque Industrial',
      descripcionSecundaria: 'Estructura metálica cubierta'
    }
  })
  console.log('✅ Corregido: Yazaki Metrex - Fábrica Parque Industrial')
} else {
  console.log('❌ No encontrado')
}

await prisma.$disconnect()

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const total = await prisma.proyectoHojaVida.count()

const conTitulo = await prisma.proyectoHojaVida.count({
  where: {
    tituloDisplay: {
      not: null
    }
  }
})

const sinTitulo = await prisma.proyectoHojaVida.count({
  where: {
    tituloDisplay: null
  }
})

console.log('\n━'.repeat(40))
console.log('📊 RESUMEN FINAL DE PROYECTOS')
console.log('━'.repeat(40))
console.log(`\n📋 Total proyectos: ${total}`)
console.log(`✅ Con título display: ${conTitulo} (${((conTitulo/total)*100).toFixed(1)}%)`)
console.log(`❌ Sin título display: ${sinTitulo}`)

if (sinTitulo > 0) {
  console.log('\n⚠️  Proyectos sin título:')
  const faltantes = await prisma.proyectoHojaVida.findMany({
    where: {
      tituloDisplay: null
    },
    select: {
      id: true,
      entidadContratante: true,
      objetoContrato: true,
      fechaFin: true
    }
  })

  faltantes.forEach(p => {
    const año = new Date(p.fechaFin).getFullYear()
    console.log(`\n[${año}] ${p.entidadContratante}`)
    console.log(`"${p.objetoContrato.substring(0, 80)}..."`)
  })
} else {
  console.log('\n🎉 ¡TODOS LOS PROYECTOS TIENEN TÍTULO!')
}

console.log('\n' + '━'.repeat(40))

await prisma.$disconnect()

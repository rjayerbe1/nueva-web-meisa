import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const resumenes = await prisma.resumenAnio.findMany({
  orderBy: { anio: 'desc' },
  select: {
    anio: true,
    titulo: true
  }
})

console.log('\n📋 TÍTULOS DE RESÚMENES GENERADOS:\n')
resumenes.forEach(r => {
  console.log(`${r.titulo}`)
})

console.log(`\n✅ Total: ${resumenes.length} resúmenes`)

await prisma.$disconnect()

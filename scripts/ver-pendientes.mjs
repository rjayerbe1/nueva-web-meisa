import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const pendientes = await prisma.proyectoHojaVida.count({
  where: { tituloDisplay: null }
})

console.log(`\n📊 Total proyectos pendientes: ${pendientes}\n`)

// Contar por años restantes
const años = [2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996]

for (const año of años) {
  const count = await prisma.proyectoHojaVida.count({
    where: {
      fechaFin: {
        gte: new Date(`${año}-01-01`),
        lt: new Date(`${año + 1}-01-01`)
      },
      tituloDisplay: null
    }
  })

  if (count > 0) {
    console.log(`${año}: ${count} proyectos`)
  }
}

await prisma.$disconnect()

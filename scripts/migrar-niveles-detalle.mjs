import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n🔄 MIGRACIÓN: Asignando niveles de detalle a proyectos existentes\n')

  // Obtener todos los proyectos
  const proyectos = await prisma.proyectoHojaVida.findMany()

  console.log(`📊 Total de proyectos a procesar: ${proyectos.length}\n`)

  let countAlto = 0
  let countMedio = 0
  let countBajo = 0

  for (const proyecto of proyectos) {
    let nivelDetalle

    // Lógica de asignación:
    // ALTO: Proyectos destacados
    // MEDIO: Proyectos con peso Y área completos
    // BAJO: Resto

    if (proyecto.destacado) {
      nivelDetalle = 'ALTO'
      countAlto++
    } else if (proyecto.pesoKg && proyecto.areaM2) {
      nivelDetalle = 'MEDIO'
      countMedio++
    } else {
      nivelDetalle = 'BAJO'
      countBajo++
    }

    await prisma.proyectoHojaVida.update({
      where: { id: proyecto.id },
      data: { nivelDetalle }
    })
  }

  console.log('✅ Migración completada!\n')
  console.log(`📈 Distribución de niveles:`)
  console.log(`   - ALTO: ${countAlto} proyectos (destacados)`)
  console.log(`   - MEDIO: ${countMedio} proyectos (con datos técnicos completos)`)
  console.log(`   - BAJO: ${countBajo} proyectos (básicos)\n`)

  await prisma.$disconnect()
}

main().catch((error) => {
  console.error('❌ Error en la migración:', error)
  process.exit(1)
})

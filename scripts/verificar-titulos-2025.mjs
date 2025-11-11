/**
 * Script para verificar los títulos actualizados de 2025
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verificarTitulos2025() {
  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2025-01-01'),
        lte: new Date('2025-12-31')
      }
    },
    orderBy: {
      fechaFin: 'asc'
    },
    select: {
      id: true,
      entidadContratante: true,
      objetoContrato: true,
      tituloDisplay: true,
      descripcionSecundaria: true,
      ubicacion: true
    }
  })

  console.log('📊 VERIFICACIÓN DE TÍTULOS 2025\n')
  console.log('━'.repeat(80))

  proyectos.forEach((p, index) => {
    console.log(`\n${index + 1}. ${p.entidadContratante}`)
    console.log('   ' + '─'.repeat(70))
    console.log(`   📍 Ubicación: ${p.ubicacion}`)
    console.log(`   ✏️  Título Display: ${p.tituloDisplay || '❌ NO CONFIGURADO'}`)
    console.log(`   📝 Descripción Secundaria: ${p.descripcionSecundaria || '❌ NO CONFIGURADO'}`)
    console.log(`   📄 Objeto Contrato Original: ${p.objetoContrato}`)
  })

  console.log('\n' + '━'.repeat(80))
  console.log(`\n✅ Total proyectos: ${proyectos.length}`)

  const conTituloDisplay = proyectos.filter(p => p.tituloDisplay).length
  const conDescripcion = proyectos.filter(p => p.descripcionSecundaria).length

  console.log(`✓  Con título display: ${conTituloDisplay}/${proyectos.length}`)
  console.log(`✓  Con descripción secundaria: ${conDescripcion}/${proyectos.length}`)

  await prisma.$disconnect()
}

verificarTitulos2025()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })

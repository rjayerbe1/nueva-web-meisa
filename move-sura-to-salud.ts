#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function moveSuraToSalud() {
  console.log('🏥 Moviendo Grupo SURA al sector SALUD...\n')

  try {
    // Mover Grupo SURA a sector SALUD
    const resultado = await prisma.cliente.updateMany({
      where: { 
        nombre: { contains: 'SURA', mode: 'insensitive' }
      },
      data: { 
        sector: 'SALUD'
      }
    })

    console.log(`✅ Grupo SURA movido al sector SALUD (${resultado.count} registro(s))`)

    // Verificar el cambio
    const suraCliente = await prisma.cliente.findFirst({
      where: { nombre: { contains: 'SURA', mode: 'insensitive' } }
    })

    if (suraCliente) {
      console.log(`\n📋 Estado actualizado de SURA:`)
      console.log(`   Nombre: ${suraCliente.nombre}`)
      console.log(`   Sector: ${suraCliente.sector}`)
      console.log(`   Descripción: ${suraCliente.descripcion}`)
    }

    // Mostrar nueva distribución por sectores
    console.log('\n📊 Nueva distribución por sectores:')
    
    const estadisticas = await prisma.cliente.groupBy({
      by: ['sector'],
      _count: { sector: true },
      where: { activo: true }
    })

    estadisticas
      .sort((a, b) => b._count.sector - a._count.sector)
      .forEach(stat => {
        const emoji = {
          'CONSTRUCCION': '🏗️',
          'INDUSTRIAL': '🏭',
          'COMERCIAL': '🛒',
          'INSTITUCIONAL': '🏛️',
          'SALUD': '🏥',
          'ENERGIA': '⚡',
          'MINERIA': '⛏️',
          'GOBIERNO': '🏛️',
          'OTRO': '🔗'
        }[stat.sector] || '📋'
        
        console.log(`   ${emoji} ${stat.sector}: ${stat._count.sector} clientes`)
      })

    console.log('\n✅ ¡Grupo SURA ahora está correctamente clasificado en el sector SALUD!')
    console.log('💡 Razón: SURA es un grupo que incluye seguros de salud, medicina prepagada y servicios médicos')

  } catch (error) {
    console.error('❌ Error al mover SURA:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
moveSuraToSalud().catch(console.error)
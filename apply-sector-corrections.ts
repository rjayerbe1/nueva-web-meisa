#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function applySectorCorrections() {
  console.log('🔧 APLICANDO CORRECCIONES DE SECTORES\n')

  try {
    const correcciones = [
      {
        nombre: 'Grupo SURA',
        sectorAnterior: 'INSTITUCIONAL',
        sectorNuevo: 'OTRO',
        razon: 'Grupo financiero (seguros, pensiones, inversiones)'
      },
      {
        nombre: 'Mayagüez', 
        sectorAnterior: 'INDUSTRIAL',
        sectorNuevo: 'COMERCIAL',
        razon: 'Ingenio azucarero - sector comercial/agroindustrial'
      },
      {
        nombre: 'SENA',
        sectorAnterior: 'GOBIERNO', 
        sectorNuevo: 'INSTITUCIONAL',
        razon: 'Institución educativa pública'
      }
    ]

    let aplicadas = 0
    let errores = 0

    for (const correccion of correcciones) {
      try {
        console.log(`🔄 Corrigiendo: ${correccion.nombre}`)
        console.log(`   ${correccion.sectorAnterior} → ${correccion.sectorNuevo}`)
        console.log(`   Razón: ${correccion.razon}`)

        const resultado = await prisma.cliente.updateMany({
          where: { 
            nombre: { equals: correccion.nombre, mode: 'insensitive' }
          },
          data: { 
            sector: correccion.sectorNuevo
          }
        })

        if (resultado.count > 0) {
          console.log(`   ✅ Actualizado (${resultado.count} registro(s))`)
          aplicadas++
        } else {
          console.log(`   ⚠️  Cliente no encontrado`)
          errores++
        }
        console.log('')

      } catch (error) {
        console.log(`   ❌ Error: ${error}`)
        errores++
        console.log('')
      }
    }

    // Verificar resultados
    console.log('📊 RESUMEN DE CORRECCIONES:')
    console.log(`   ✅ Aplicadas: ${aplicadas}`)
    console.log(`   ❌ Errores: ${errores}`)
    console.log(`   📋 Total: ${correcciones.length}`)

    if (aplicadas > 0) {
      console.log('\n🔍 VERIFICANDO DISTRIBUCIÓN ACTUAL...')
      
      const estadisticas = await prisma.cliente.groupBy({
        by: ['sector'],
        _count: {
          sector: true
        },
        where: {
          activo: true
        }
      })

      console.log('\n📈 NUEVA DISTRIBUCIÓN POR SECTOR:')
      estadisticas
        .sort((a, b) => b._count.sector - a._count.sector)
        .forEach(stat => {
          console.log(`   ${stat.sector}: ${stat._count.sector} clientes`)
        })

      console.log('\n✅ Correcciones aplicadas exitosamente!')
    }

  } catch (error) {
    console.error('❌ Error durante las correcciones:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
applySectorCorrections().catch(console.error)
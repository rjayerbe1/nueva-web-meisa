#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixLogoBlancoForAllClients() {
  console.log('🔍 Revisando logos normales y logos blancos de todos los clientes...\n')

  try {
    // Obtener todos los clientes activos
    const clientes = await prisma.cliente.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    })

    console.log(`📋 Total clientes activos: ${clientes.length}\n`)

    let clientesSinLogo = 0
    let clientesSinLogoBlanco = 0
    let clientesActualizados = 0

    console.log('=== ESTADO ACTUAL DE LOGOS ===')
    
    for (const cliente of clientes) {
      const tieneLogoNormal = Boolean(cliente.logo)
      const tieneLogoBlanco = Boolean(cliente.logoBlanco)
      
      let status = ''
      if (!tieneLogoNormal && !tieneLogoBlanco) {
        status = '❌ Sin logo normal ni blanco'
        clientesSinLogo++
      } else if (tieneLogoNormal && !tieneLogoBlanco) {
        status = '⚠️  Solo logo normal'
        clientesSinLogoBlanco++
      } else if (!tieneLogoNormal && tieneLogoBlanco) {
        status = '⚠️  Solo logo blanco'
      } else {
        status = '✅ Ambos logos'
      }
      
      console.log(`${cliente.nombre.padEnd(25)} | ${status}`)
      console.log(`   Logo: ${cliente.logo || 'N/A'}`)
      console.log(`   Logo Blanco: ${cliente.logoBlanco || 'N/A'}`)
      console.log('')
    }

    console.log('\n=== APLICANDO CORRECCIONES ===')

    // Actualizar clientes que no tienen logoBlanco pero sí tienen logo
    for (const cliente of clientes) {
      if (cliente.logo && !cliente.logoBlanco) {
        await prisma.cliente.update({
          where: { id: cliente.id },
          data: {
            logoBlanco: cliente.logo
          }
        })
        console.log(`✅ ${cliente.nombre}: logoBlanco asignado desde logo normal`)
        clientesActualizados++
      } else if (!cliente.logo && cliente.logoBlanco) {
        // Si solo tiene logoBlanco, asignar también como logo normal
        await prisma.cliente.update({
          where: { id: cliente.id },
          data: {
            logo: cliente.logoBlanco
          }
        })
        console.log(`✅ ${cliente.nombre}: logo normal asignado desde logoBlanco`)
        clientesActualizados++
      } else if (!cliente.logo && !cliente.logoBlanco) {
        console.log(`⚠️  ${cliente.nombre}: Sin ningún logo - requiere atención manual`)
      }
    }

    // Verificación final
    console.log('\n=== VERIFICACIÓN FINAL ===')
    
    const clientesFinales = await prisma.cliente.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    })

    let clientesCompletos = 0
    let clientesIncompletos = 0

    for (const cliente of clientesFinales) {
      if (cliente.logo && cliente.logoBlanco) {
        clientesCompletos++
      } else {
        clientesIncompletos++
        console.log(`❌ ${cliente.nombre}: Aún incompleto`)
      }
    }

    console.log('\n=== RESUMEN FINAL ===')
    console.log(`📊 Total clientes: ${clientesFinales.length}`)
    console.log(`✅ Clientes con ambos logos: ${clientesCompletos}`)
    console.log(`❌ Clientes incompletos: ${clientesIncompletos}`)
    console.log(`🔄 Clientes actualizados: ${clientesActualizados}`)

    if (clientesCompletos === clientesFinales.length) {
      console.log('\n🎉 ¡PERFECTO! Todos los clientes tienen logo normal y logoBlanco')
    } else {
      console.log('\n⚠️  Algunos clientes necesitan atención manual')
    }

  } catch (error) {
    console.error('❌ Error al revisar logos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixLogoBlancoForAllClients().catch(console.error)
}

export { fixLogoBlancoForAllClients }
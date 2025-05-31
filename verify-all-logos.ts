#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyAllLogos() {
  console.log('🔍 VERIFICACIÓN COMPLETA DE LOGOS DE CLIENTES\n')

  try {
    // Obtener todos los clientes activos
    const todosClientes = await prisma.cliente.findMany({
      where: { activo: true },
      select: {
        id: true,
        nombre: true,
        slug: true,
        logo: true,
        logoBlanco: true,
        mostrarEnHome: true
      },
      orderBy: { nombre: 'asc' }
    })

    console.log(`📋 Total de clientes activos: ${todosClientes.length}\n`)

    // Categorizar clientes por estado de logos
    const conAmbosLogos = todosClientes.filter(c => c.logo && c.logoBlanco)
    const soloLogoNormal = todosClientes.filter(c => c.logo && !c.logoBlanco)
    const soloLogoBlanco = todosClientes.filter(c => !c.logo && c.logoBlanco)
    const sinLogos = todosClientes.filter(c => !c.logo && !c.logoBlanco)
    const enHome = todosClientes.filter(c => c.mostrarEnHome)

    console.log('📊 RESUMEN GENERAL:')
    console.log(`✅ Con ambos logos: ${conAmbosLogos.length}`)
    console.log(`⚠️  Solo logo normal: ${soloLogoNormal.length}`)
    console.log(`⚠️  Solo logo blanco: ${soloLogoBlanco.length}`)
    console.log(`❌ Sin logos: ${sinLogos.length}`)
    console.log(`🏠 Mostrar en home: ${enHome.length}`)
    console.log('')

    // Detallar clientes que necesitan atención
    if (soloLogoNormal.length > 0) {
      console.log('⚠️  CLIENTES CON SOLO LOGO NORMAL (necesitan logo blanco):')
      soloLogoNormal.forEach((cliente, index) => {
        console.log(`   ${index + 1}. ${cliente.nombre}`)
        console.log(`      Logo: ${cliente.logo}`)
        console.log(`      En Home: ${cliente.mostrarEnHome ? 'Sí' : 'No'}`)
        console.log('')
      })
    }

    if (soloLogoBlanco.length > 0) {
      console.log('⚠️  CLIENTES CON SOLO LOGO BLANCO (necesitan logo normal):')
      soloLogoBlanco.forEach((cliente, index) => {
        console.log(`   ${index + 1}. ${cliente.nombre}`)
        console.log(`      Logo Blanco: ${cliente.logoBlanco}`)
        console.log(`      En Home: ${cliente.mostrarEnHome ? 'Sí' : 'No'}`)
        console.log('')
      })
    }

    if (sinLogos.length > 0) {
      console.log('❌ CLIENTES SIN LOGOS:')
      sinLogos.forEach((cliente, index) => {
        console.log(`   ${index + 1}. ${cliente.nombre}`)
        console.log(`      En Home: ${cliente.mostrarEnHome ? 'Sí' : 'No'}`)
        console.log('')
      })
    }

    // Verificar clientes en home sin logos completos
    const enHomeSinLogosCompletos = enHome.filter(c => !c.logo || !c.logoBlanco)
    if (enHomeSinLogosCompletos.length > 0) {
      console.log('🚨 URGENTE - CLIENTES EN HOME SIN LOGOS COMPLETOS:')
      enHomeSinLogosCompletos.forEach((cliente, index) => {
        console.log(`   ${index + 1}. ${cliente.nombre}`)
        console.log(`      Logo: ${cliente.logo || 'FALTA'}`)
        console.log(`      Logo Blanco: ${cliente.logoBlanco || 'FALTA'}`)
        console.log('')
      })
    }

    // Mostrar estadísticas finales
    const porcentajeCompleto = ((conAmbosLogos.length / todosClientes.length) * 100).toFixed(1)
    const porcentajeHomeCompleto = enHome.length > 0 ? (((enHome.length - enHomeSinLogosCompletos.length) / enHome.length) * 100).toFixed(1) : 100

    console.log('📈 ESTADÍSTICAS:')
    console.log(`   - Completitud general: ${porcentajeCompleto}% (${conAmbosLogos.length}/${todosClientes.length})`)
    console.log(`   - Completitud en home: ${porcentajeHomeCompleto}% (${enHome.length - enHomeSinLogosCompletos.length}/${enHome.length})`)
    
    if (soloLogoNormal.length > 0) {
      console.log('\n🔧 ACCIÓN RECOMENDADA:')
      console.log('   Ejecutar fix automático para copiar logos normales como logos blancos')
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
verifyAllLogos().catch(console.error)
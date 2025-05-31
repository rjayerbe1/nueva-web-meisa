#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixLogosBlancos() {
  console.log('🔄 Revisando clientes sin logo blanco...\n')

  try {
    // Buscar clientes que tienen logo pero no logoBlanco
    const clientesSinLogoBlanco = await prisma.cliente.findMany({
      where: {
        AND: [
          { logo: { not: null } },           // Tienen logo
          { 
            OR: [
              { logoBlanco: null },          // No tienen logoBlanco
              { logoBlanco: '' }             // logoBlanco vacío
            ]
          }
        ]
      },
      select: {
        id: true,
        nombre: true,
        slug: true,
        logo: true,
        logoBlanco: true
      }
    })

    console.log(`📋 Encontrados ${clientesSinLogoBlanco.length} clientes sin logo blanco:`)
    
    if (clientesSinLogoBlanco.length === 0) {
      console.log('✅ Todos los clientes con logo ya tienen logo blanco!')
      return
    }

    // Mostrar lista de clientes a actualizar
    clientesSinLogoBlanco.forEach((cliente, index) => {
      console.log(`   ${index + 1}. ${cliente.nombre}`)
      console.log(`      Logo: ${cliente.logo}`)
      console.log(`      Logo Blanco: ${cliente.logoBlanco || 'FALTA'}`)
      console.log('')
    })

    console.log('🔄 Copiando logos normales como logos blancos...\n')

    // Actualizar cada cliente
    let actualizados = 0
    for (const cliente of clientesSinLogoBlanco) {
      try {
        await prisma.cliente.update({
          where: { id: cliente.id },
          data: { logoBlanco: cliente.logo }
        })
        console.log(`✅ ${cliente.nombre} - Logo blanco copiado`)
        actualizados++
      } catch (error) {
        console.log(`❌ Error actualizando ${cliente.nombre}:`, error)
      }
    }

    console.log(`\n🎉 Proceso completado:`)
    console.log(`   - Clientes revisados: ${clientesSinLogoBlanco.length}`)
    console.log(`   - Clientes actualizados: ${actualizados}`)

    // Verificación final
    const clientesConLogos = await prisma.cliente.count({
      where: { 
        AND: [
          { logo: { not: null } },
          { logoBlanco: { not: null } }
        ]
      }
    })

    const totalClientesConLogo = await prisma.cliente.count({
      where: { logo: { not: null } }
    })

    console.log(`\n📊 Estado final:`)
    console.log(`   - Clientes con logo: ${totalClientesConLogo}`)
    console.log(`   - Clientes con ambos logos: ${clientesConLogos}`)
    console.log(`   - Cobertura: ${totalClientesConLogo > 0 ? ((clientesConLogos / totalClientesConLogo) * 100).toFixed(1) : 0}%`)

  } catch (error) {
    console.error('❌ Error durante el proceso:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
fixLogosBlancos().catch(console.error)
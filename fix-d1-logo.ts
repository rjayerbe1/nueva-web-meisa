#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixD1Logo() {
  console.log('🔧 Arreglando logo corrupto de D1...\n')

  try {
    // Actualizar D1 para quitar el logo corrupto
    const result = await prisma.cliente.updateMany({
      where: { 
        OR: [
          { nombre: { contains: 'D1', mode: 'insensitive' } },
          { slug: 'd1-sas' }
        ]
      },
      data: { 
        logo: null,
        logoBlanco: null
      }
    })

    console.log(`✅ D1 actualizado (${result.count} registros)`)
    console.log('📝 Logo corrupto eliminado, D1 queda sin logo temporalmente')
    console.log('💡 Necesitas subir el logo correcto desde el admin panel')

    // Verificar el estado
    const d1Cliente = await prisma.cliente.findFirst({
      where: { nombre: { contains: 'D1', mode: 'insensitive' } }
    })

    if (d1Cliente) {
      console.log(`\n📋 Estado actual de D1:`)
      console.log(`   Nombre: ${d1Cliente.nombre}`)
      console.log(`   Logo: ${d1Cliente.logo || 'SIN LOGO'}`)
      console.log(`   Logo Blanco: ${d1Cliente.logoBlanco || 'SIN LOGO'}`)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
fixD1Logo().catch(console.error)
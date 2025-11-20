#!/usr/bin/env ts-node

/**
 * Script para inicializar la configuración global del sitio
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function initSiteConfig() {
  try {
    console.log('🔧 Inicializando configuración global del sitio...')

    // Verificar si ya existe la configuración
    const existing = await prisma.siteConfig.findUnique({
      where: { key: 'global' }
    })

    if (existing) {
      console.log('✅ La configuración global ya existe')
      console.log('   - Tamaño de iconos:', existing.categoryIconSize)
      return existing
    }

    // Crear la configuración global
    const config = await prisma.siteConfig.create({
      data: {
        key: 'global',
        categoryIconSize: 48, // Tamaño por defecto
      }
    })

    console.log('✅ Configuración global creada exitosamente')
    console.log('   - Tamaño de iconos:', config.categoryIconSize)

    return config
  } catch (error) {
    console.error('❌ Error inicializando configuración:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initSiteConfig()
    .then(() => {
      console.log('\n✨ Proceso completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error:', error)
      process.exit(1)
    })
}

module.exports = { initSiteConfig }

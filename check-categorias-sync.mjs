#!/usr/bin/env node

/**
 * Script para comparar categorías entre base de datos local y Neon
 */

import { PrismaClient } from '@prisma/client'

const prismaLocal = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_LOCAL || 'postgresql://rjayerbe@localhost:5432/meisa_db'
    }
  }
})

const prismaNeon = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_NEON || process.env.DATABASE_URL
    }
  }
})

async function compareCategorias() {
  console.log('\n📊 COMPARANDO CATEGORÍAS: LOCAL vs NEON\n')
  console.log('═'.repeat(80))

  try {
    // Obtener categorías locales
    const categoriasLocal = await prismaLocal.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' },
      select: {
        key: true,
        nombre: true,
        slug: true,
        icono: true,
        imagenCover: true,
        imagenBanner: true,
        videoCover: true,
        videoBanner: true,
        color: true,
        colorSecundario: true,
        destacada: true,
        orden: true,
        totalProyectos: true
      }
    })

    // Obtener categorías Neon
    const categoriasNeon = await prismaNeon.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' },
      select: {
        key: true,
        nombre: true,
        slug: true,
        icono: true,
        imagenCover: true,
        imagenBanner: true,
        videoCover: true,
        videoBanner: true,
        color: true,
        colorSecundario: true,
        destacada: true,
        orden: true,
        totalProyectos: true
      }
    })

    console.log('\n🏠 BASE DE DATOS LOCAL:')
    console.log(`   Total categorías: ${categoriasLocal.length}\n`)
    categoriasLocal.forEach(cat => {
      console.log(`   ${cat.orden}. ${cat.nombre} (${cat.key})`)
      console.log(`      Cover: ${cat.imagenCover ? '✅' : '❌'}`)
      console.log(`      Icono: ${cat.icono ? '✅' : '❌'}`)
      console.log(`      Video Cover: ${cat.videoCover ? '✅' : '❌'}`)
      console.log(`      Video Banner: ${cat.videoBanner ? '✅' : '❌'}`)
      console.log(`      Proyectos: ${cat.totalProyectos}`)
    })

    console.log('\n☁️  BASE DE DATOS NEON (PRODUCCIÓN):')
    console.log(`   Total categorías: ${categoriasNeon.length}\n`)
    categoriasNeon.forEach(cat => {
      console.log(`   ${cat.orden}. ${cat.nombre} (${cat.key})`)
      console.log(`      Cover: ${cat.imagenCover ? '✅' : '❌'}`)
      console.log(`      Icono: ${cat.icono ? '✅' : '❌'}`)
      console.log(`      Video Cover: ${cat.videoCover ? '✅' : '❌'}`)
      console.log(`      Video Banner: ${cat.videoBanner ? '✅' : '❌'}`)
      console.log(`      Proyectos: ${cat.totalProyectos}`)
    })

    // Comparar diferencias
    console.log('\n' + '═'.repeat(80))
    console.log('\n🔍 ANÁLISIS DE DIFERENCIAS:\n')

    let hayDiferencias = false

    // Verificar si el número de categorías es diferente
    if (categoriasLocal.length !== categoriasNeon.length) {
      console.log(`❌ Número de categorías diferente:`)
      console.log(`   Local: ${categoriasLocal.length} | Neon: ${categoriasNeon.length}`)
      hayDiferencias = true
    }

    // Comparar cada categoría
    for (const catLocal of categoriasLocal) {
      const catNeon = categoriasNeon.find(c => c.key === catLocal.key)

      if (!catNeon) {
        console.log(`❌ Categoría "${catLocal.nombre}" existe en LOCAL pero NO en NEON`)
        hayDiferencias = true
        continue
      }

      const diferencias = []

      if (catLocal.nombre !== catNeon.nombre) diferencias.push('nombre')
      if (catLocal.slug !== catNeon.slug) diferencias.push('slug')
      if (catLocal.icono !== catNeon.icono) diferencias.push('icono')
      if (catLocal.imagenCover !== catNeon.imagenCover) diferencias.push('imagenCover')
      if (catLocal.imagenBanner !== catNeon.imagenBanner) diferencias.push('imagenBanner')
      if (catLocal.videoCover !== catNeon.videoCover) diferencias.push('videoCover')
      if (catLocal.videoBanner !== catNeon.videoBanner) diferencias.push('videoBanner')
      if (catLocal.color !== catNeon.color) diferencias.push('color')
      if (catLocal.colorSecundario !== catNeon.colorSecundario) diferencias.push('colorSecundario')
      if (catLocal.destacada !== catNeon.destacada) diferencias.push('destacada')
      if (catLocal.orden !== catNeon.orden) diferencias.push('orden')

      if (diferencias.length > 0) {
        console.log(`⚠️  Categoría "${catLocal.nombre}" tiene diferencias en:`)
        diferencias.forEach(dif => {
          console.log(`   - ${dif}: "${catLocal[dif]}" (local) vs "${catNeon[dif]}" (neon)`)
        })
        hayDiferencias = true
      }
    }

    // Verificar categorías que existen en Neon pero no en Local
    for (const catNeon of categoriasNeon) {
      const catLocal = categoriasLocal.find(c => c.key === catNeon.key)
      if (!catLocal) {
        console.log(`❌ Categoría "${catNeon.nombre}" existe en NEON pero NO en LOCAL`)
        hayDiferencias = true
      }
    }

    if (!hayDiferencias) {
      console.log('✅ ¡Las categorías están SINCRONIZADAS!')
      console.log('   No hay diferencias entre local y Neon.')
    } else {
      console.log('\n⚠️  SE ENCONTRARON DIFERENCIAS')
      console.log('   Necesitas sincronizar los datos de categorías a Neon.')
    }

    console.log('\n' + '═'.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prismaLocal.$disconnect()
    await prismaNeon.$disconnect()
  }
}

compareCategorias()

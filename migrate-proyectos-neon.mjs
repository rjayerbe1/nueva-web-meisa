#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prismaLocal = new PrismaClient({
  datasources: { db: { url: 'postgresql://rjayerbe@localhost:5432/meisa_db' } }
})

const prismaNeon = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } }
})

async function migrarProyectos() {
  console.log('\n🚀 Migrando proyectos y ProyectosHojaVida a Neon...\n')

  try {
    // Migrar proyectos detallados
    console.log('📋 1/3 Migrando proyectos detallados...')
    const proyectos = await prismaLocal.proyecto.findMany()

    for (const p of proyectos) {
      try {
        await prismaNeon.proyecto.create({ data: p })
      } catch (e) {
        console.log(`  ⚠️  ${p.titulo} ya existe`)
      }
    }
    console.log(`  ✅ ${proyectos.length} proyectos procesados\n`)

    // Migrar imágenes
    console.log('📋 2/3 Migrando imágenes de proyectos...')
    const imagenes = await prismaLocal.imagenProyecto.findMany()

    for (const img of imagenes) {
      try {
        await prismaNeon.imagenProyecto.create({ data: img })
      } catch (e) {
        // Silent fail
      }
    }
    console.log(`  ✅ ${imagenes.length} imágenes procesadas\n`)

    // Migrar ProyectosHojaVida
    console.log('📋 3/3 Migrando ProyectosHojaVida...')
    const hojaVida = await prismaLocal.proyectoHojaVida.findMany()

    for (const proy of hojaVida) {
      try {
        await prismaNeon.proyectoHojaVida.create({ data: proy })
      } catch (e) {
        console.log(`  ⚠️  ${proy.nombre} ya existe`)
      }
    }
    console.log(`  ✅ ${hojaVida.length} proyectos hoja de vida procesados\n`)

    // Actualizar contadores
    console.log('🔢 Actualizando contadores de categorías...')
    const categorias = await prismaNeon.categoriaProyecto.findMany()

    for (const cat of categorias) {
      const detallados = await prismaNeon.proyecto.count({
        where: { categoria: cat.key, visible: true }
      })

      const hojaVidaCount = await prismaNeon.proyectoHojaVida.count({
        where: { categoria: cat.key }
      })

      const total = detallados + hojaVidaCount

      await prismaNeon.categoriaProyecto.update({
        where: { key: cat.key },
        data: { totalProyectos: total }
      })

      console.log(`  ✓ ${cat.nombre}: ${total} proyectos`)
    }

    console.log('\n✅ ¡Migración completada!\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prismaLocal.$disconnect()
    await prismaNeon.$disconnect()
  }
}

migrarProyectos()

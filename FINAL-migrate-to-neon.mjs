#!/usr/bin/env node

/**
 * MIGRACIÓN FINAL: Local → Neon
 */

import { PrismaClient } from '@prisma/client'

const local = new PrismaClient({
  datasources: { db: { url: 'postgresql://rjayerbe@localhost:5432/meisa_db' } }
})

const neon = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } }
})

async function migrateAll() {
  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║  📦 MIGRACIÓN FINAL: LOCAL → NEON                         ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')

  try {
    // 1. PROYECTOS
    console.log('📋 1/3 Migrando proyectos detallados desde local...\n')
    const proyectos = await local.proyecto.findMany({ include: { imagenes: true } })

    let count = 0
    for (const p of proyectos) {
      try {
        const { imagenes, ...proyectoData } = p
        await neon.proyecto.create({ data: proyectoData })

        // Migrar imágenes
        for (const img of imagenes) {
          try {
            await neon.imagenProyecto.create({ data: img })
          } catch (e) { /* silent */ }
        }
        count++
      } catch (e) {
        console.log(`  ⚠️  ${p.titulo}: ${e.code}`)
      }
    }
    console.log(`\n✅ ${count}/${proyectos.length} proyectos migrados\n`)

    // 2. HOJA DE VIDA
    console.log('📋 2/3 Migrando proyectos hoja de vida desde local...\n')
    const hojaVida = await local.proyectoHojaVida.findMany()

    count = 0
    for (const hv of hojaVida) {
      try {
        await neon.proyectoHojaVida.create({ data: hv })
        count++
      } catch (e) {
        console.log(`  ⚠️  ${hv.nombre}: ${e.code}`)
      }
    }
    console.log(`\n✅ ${count}/${hojaVida.length} hoja de vida migrados\n`)

    // 3. ACTUALIZAR CONTADORES
    console.log('📋 3/3 Actualizando contadores de categorías...\n')
    const categorias = await neon.categoriaProyecto.findMany()

    for (const cat of categorias) {
      const proy = await neon.proyecto.count({ where: { categoria: cat.key, visible: true } })
      const hv = await neon.proyectoHojaVida.count({ where: { categoria: cat.key } })
      const total = proy + hv

      await neon.categoriaProyecto.update({
        where: { key: cat.key },
        data: { totalProyectos: total }
      })

      console.log(`  ✓ ${cat.nombre}: ${total} proyectos (${proy} + ${hv})`)
    }

    console.log('\n╔════════════════════════════════════════════════════════════╗')
    console.log('║  ✅ ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!                   ║')
    console.log('╚════════════════════════════════════════════════════════════╝\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.error(error)
  } finally {
    await local.$disconnect()
    await neon.$disconnect()
  }
}

migrateAll()

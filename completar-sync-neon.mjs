#!/usr/bin/env node

/**
 * Completar sincronización de tablas faltantes
 */

import { PrismaClient } from '@prisma/client'

const local = new PrismaClient({
  datasources: { db: { url: 'postgresql://rjayerbe@localhost:5432/meisa_db' } }
})

const neon = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } }
})

async function completarSync() {
  console.log('\n🔄 Completando sincronización...\n')

  try {
    // 1. SERVICIOS
    console.log('📋 1/5 Migrando servicios...')
    const servicios = await local.servicio.findMany()

    for (const s of servicios) {
      try {
        await neon.servicio.create({ data: s })
        console.log(`  ✓ ${s.nombre}`)
      } catch (e) {
        console.log(`  ⚠️  ${s.nombre}: ya existe`)
      }
    }

    // 2. CONTACTOS WHATSAPP
    console.log('\n📋 2/5 Migrando contactos WhatsApp...')
    const contactos = await local.contactoWhatsApp.findMany()

    for (const c of contactos) {
      try {
        await neon.contactoWhatsApp.create({ data: c })
        console.log(`  ✓ ${c.nombre}`)
      } catch (e) {
        console.log(`  ⚠️  ${c.nombre}: ya existe`)
      }
    }

    // 3. SITE CONFIG
    console.log('\n📋 3/5 Migrando configuración del sitio...')
    const config = await local.siteConfig.findMany()

    for (const cfg of config) {
      try {
        await neon.siteConfig.create({ data: cfg })
        console.log(`  ✓ Configuración migrada`)
      } catch (e) {
        console.log(`  ⚠️  Configuración: ya existe`)
      }
    }

    // 4. PÁGINAS
    console.log('\n📋 4/5 Migrando páginas...')
    const paginas = await local.pagina.findMany()

    for (const p of paginas) {
      try {
        await neon.pagina.create({ data: p })
        console.log(`  ✓ ${p.titulo}`)
      } catch (e) {
        console.log(`  ⚠️  ${p.titulo}: ya existe`)
      }
    }

    // 5. ACTUALIZAR COVERS DE CATEGORÍAS
    console.log('\n📋 5/5 Actualizando assets de categorías...')
    const catsLocal = await local.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' }
    })

    for (const cat of catsLocal) {
      await neon.categoriaProyecto.update({
        where: { key: cat.key },
        data: {
          imagenCover: cat.imagenCover,
          imagenBanner: cat.imagenBanner,
          videoCover: cat.videoCover,
          videoBanner: cat.videoBanner,
          icono: cat.icono,
          descripcion: cat.descripcion
        }
      })
      console.log(`  ✓ ${cat.nombre}`)
    }

    console.log('\n✅ ¡Sincronización completada!\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.error(error)
  } finally {
    await local.$disconnect()
    await neon.$disconnect()
  }
}

completarSync()

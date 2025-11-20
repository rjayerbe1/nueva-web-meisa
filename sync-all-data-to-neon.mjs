#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

// Base de datos local
const localDb = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://rjayerbe@localhost:5432/meisa_db'
    }
  }
})

// Base de datos Neon (producción)
const neonDb = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
})

async function syncData() {
  try {
    console.log('\n🔄 Iniciando sincronización de datos a Neon...\n')

    // 1. Sincronizar ConfiguracionSitio
    console.log('📋 1. Sincronizando ConfiguracionSitio...')
    const configs = await localDb.configuracionSitio.findMany()
    for (const config of configs) {
      await neonDb.configuracionSitio.upsert({
        where: { id: config.id },
        update: config,
        create: config
      })
    }
    console.log(`   ✓ ${configs.length} configuraciones sincronizadas`)

    // 2. Sincronizar CategoriaProyecto
    console.log('📋 2. Sincronizando CategoriaProyecto...')
    const categorias = await localDb.categoriaProyecto.findMany()
    for (const cat of categorias) {
      await neonDb.categoriaProyecto.upsert({
        where: { id: cat.id },
        update: cat,
        create: cat
      })
    }
    console.log(`   ✓ ${categorias.length} categorías sincronizadas`)

    // 3. Sincronizar Clientes
    console.log('📋 3. Sincronizando Clientes...')
    const clientes = await localDb.cliente.findMany()
    for (const cliente of clientes) {
      await neonDb.cliente.upsert({
        where: { id: cliente.id },
        update: cliente,
        create: cliente
      })
    }
    console.log(`   ✓ ${clientes.length} clientes sincronizados`)

    // 4. Sincronizar Proyectos
    console.log('📋 4. Sincronizando Proyectos...')
    const proyectos = await localDb.proyecto.findMany()
    for (const proyecto of proyectos) {
      await neonDb.proyecto.upsert({
        where: { id: proyecto.id },
        update: proyecto,
        create: proyecto
      })
    }
    console.log(`   ✓ ${proyectos.length} proyectos sincronizados`)

    // 5. Sincronizar ImagenProyecto
    console.log('📋 5. Sincronizando ImagenProyecto...')
    const imagenes = await localDb.imagenProyecto.findMany()
    // Primero eliminar imágenes que ya no existen en local
    await neonDb.imagenProyecto.deleteMany({
      where: {
        proyectoId: { in: proyectos.map(p => p.id) },
        id: { notIn: imagenes.map(i => i.id) }
      }
    })
    // Luego sincronizar las imágenes actuales
    for (const imagen of imagenes) {
      await neonDb.imagenProyecto.upsert({
        where: { id: imagen.id },
        update: imagen,
        create: imagen
      })
    }
    console.log(`   ✓ ${imagenes.length} imágenes sincronizadas`)

    // 6. Sincronizar DocumentoProyecto
    console.log('📋 6. Sincronizando DocumentoProyecto...')
    const documentos = await localDb.documentoProyecto.findMany()
    for (const doc of documentos) {
      await neonDb.documentoProyecto.upsert({
        where: { id: doc.id },
        update: doc,
        create: doc
      })
    }
    console.log(`   ✓ ${documentos.length} documentos sincronizados`)

    // 7. Sincronizar Servicios
    console.log('📋 7. Sincronizando Servicios...')
    const servicios = await localDb.servicio.findMany()
    for (const servicio of servicios) {
      await neonDb.servicio.upsert({
        where: { id: servicio.id },
        update: servicio,
        create: servicio
      })
    }
    console.log(`   ✓ ${servicios.length} servicios sincronizados`)

    // 8. Sincronizar ConfiguracionWhatsApp
    console.log('📋 8. Sincronizando ConfiguracionWhatsApp...')
    const whatsappConfigs = await localDb.configuracionWhatsApp.findMany()
    for (const config of whatsappConfigs) {
      await neonDb.configuracionWhatsApp.upsert({
        where: { id: config.id },
        update: config,
        create: config
      })
    }
    console.log(`   ✓ ${whatsappConfigs.length} configuraciones de WhatsApp sincronizadas`)

    // 9. Sincronizar ContactoWhatsApp
    console.log('📋 9. Sincronizando ContactoWhatsApp...')
    const contactos = await localDb.contactoWhatsApp.findMany()
    for (const contacto of contactos) {
      await neonDb.contactoWhatsApp.upsert({
        where: { id: contacto.id },
        update: contacto,
        create: contacto
      })
    }
    console.log(`   ✓ ${contactos.length} contactos de WhatsApp sincronizados`)

    // 10. Sincronizar Brochures
    console.log('📋 10. Sincronizando Brochures...')
    const brochures = await localDb.brochure.findMany()
    for (const brochure of brochures) {
      await neonDb.brochure.upsert({
        where: { id: brochure.id },
        update: brochure,
        create: brochure
      })
    }
    console.log(`   ✓ ${brochures.length} brochures sincronizados`)

    console.log('\n✅ ¡Sincronización completada exitosamente!\n')
  } catch (error) {
    console.error('\n❌ Error durante la sincronización:', error)
    throw error
  } finally {
    await localDb.$disconnect()
    await neonDb.$disconnect()
  }
}

syncData()

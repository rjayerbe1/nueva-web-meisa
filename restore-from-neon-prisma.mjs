import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })
dotenv.config()

// URL de Neon (producción)
const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

// URL local - usar la variable de entorno
const LOCAL_URL = process.env.DATABASE_URL

const neonPrisma = new PrismaClient({
  datasources: {
    db: {
      url: NEON_URL
    }
  }
})

const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: LOCAL_URL
    }
  }
})

async function main() {
  console.log('\n🔄 Restaurando datos desde Neon (producción) a local...\n')

  try {
    // 1. Copiar Usuarios PRIMERO (requerido por proyectos)
    console.log('📦 1. Copiando usuarios...')
    const users = await neonPrisma.user.findMany()
    let usersCopied = 0
    for (const user of users) {
      try {
        await localPrisma.user.upsert({
          where: { id: user.id },
          update: user,
          create: user
        })
        usersCopied++
      } catch (error) {
        // Ignorar errores de duplicados (puede que algunos usuarios ya existan)
        if (error.code !== 'P2002') throw error
      }
    }
    console.log(`   ✓ ${usersCopied} usuarios copiados`)

    // 2. Copiar Categorías de Proyecto
    console.log('📦 2. Copiando categorías de proyecto...')
    const categories = await neonPrisma.categoriaProyecto.findMany()
    for (const cat of categories) {
      await localPrisma.categoriaProyecto.upsert({
        where: { id: cat.id },
        update: cat,
        create: cat
      })
    }
    console.log(`   ✓ ${categories.length} categorías copiadas`)

    // 3. Copiar Clientes
    console.log('📦 3. Copiando clientes...')
    const clients = await neonPrisma.cliente.findMany()
    for (const client of clients) {
      await localPrisma.cliente.upsert({
        where: { id: client.id },
        update: client,
        create: client
      })
    }
    console.log(`   ✓ ${clients.length} clientes copiados`)

    // 4. Copiar Proyectos
    console.log('📦 4. Copiando proyectos...')
    const projects = await neonPrisma.proyecto.findMany()
    let projectsCopied = 0
    for (const proj of projects) {
      try {
        await localPrisma.proyecto.upsert({
          where: { id: proj.id },
          update: proj,
          create: proj
        })
        projectsCopied++
      } catch (error) {
        // Saltar proyectos con referencias faltantes
        if (error.code !== 'P2003') throw error
        console.log(`   ⚠️  Saltando proyecto "${proj.titulo}" (referencia faltante)`)
      }
    }
    console.log(`   ✓ ${projectsCopied} proyectos copiados`)

    // 5. Copiar Imágenes de proyectos
    console.log('📦 5. Copiando imágenes de proyectos...')
    const images = await neonPrisma.imagenProyecto.findMany()
    for (const img of images) {
      await localPrisma.imagenProyecto.upsert({
        where: { id: img.id },
        update: img,
        create: img
      })
    }
    console.log(`   ✓ ${images.length} imágenes copiadas`)

    // 6. Copiar Progreso de proyectos
    console.log('📦 6. Copiando progreso de proyectos...')
    const progress = await neonPrisma.progresoProyecto.findMany()
    for (const prog of progress) {
      await localPrisma.progresoProyecto.upsert({
        where: { id: prog.id },
        update: prog,
        create: prog
      })
    }
    console.log(`   ✓ ${progress.length} registros de progreso copiados`)

    // 7. Copiar Servicios
    console.log('📦 7. Copiando servicios...')
    const services = await neonPrisma.servicio.findMany()
    for (const service of services) {
      await localPrisma.servicio.upsert({
        where: { id: service.id },
        update: service,
        create: service
      })
    }
    console.log(`   ✓ ${services.length} servicios copiados`)

    // 8. Copiar Configuración del sitio
    console.log('📦 8. Copiando configuración del sitio...')
    const configs = await neonPrisma.configuracionSitio.findMany()
    for (const config of configs) {
      await localPrisma.configuracionSitio.upsert({
        where: { id: config.id },
        update: config,
        create: config
      })
    }
    console.log(`   ✓ ${configs.length} configuraciones copiadas`)

    console.log('\n✅ ¡Restauración completada exitosamente!')
    console.log('   Tu base de datos local ahora tiene los mismos datos que producción\n')

  } catch (error) {
    console.error('\n❌ Error durante la restauración:', error)
    throw error
  } finally {
    await neonPrisma.$disconnect()
    await localPrisma.$disconnect()
  }
}

main()

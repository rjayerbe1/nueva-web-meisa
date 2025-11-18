import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const LOCAL_URL = process.env.DATABASE_URL

const neonPrisma = new PrismaClient({ datasources: { db: { url: NEON_URL } } })
const localPrisma = new PrismaClient({ datasources: { db: { url: LOCAL_URL } } })

async function main() {
  console.log('\n🔄 Restauración COMPLETA desde Neon (producción) a local...\n')

  try {
    // PASO 1: Limpiar base de datos local
    console.log('🗑️  1. Limpiando base de datos local...')
    await localPrisma.imagenProyecto.deleteMany()
    await localPrisma.progresoProyecto.deleteMany()
    await localPrisma.proyecto.deleteMany()
    await localPrisma.categoriaProyecto.deleteMany()
    await localPrisma.cliente.deleteMany()
    await localPrisma.servicio.deleteMany()
    await localPrisma.configuracionSitio.deleteMany()
    await localPrisma.user.deleteMany()
    console.log('   ✓ Base de datos local limpiada')

    // PASO 2: Copiar TODOS los usuarios con sus IDs originales
    console.log('\n📦 2. Copiando usuarios desde producción...')
    const users = await neonPrisma.user.findMany()
    for (const user of users) {
      await localPrisma.user.create({ data: user })
    }
    console.log(`   ✓ ${users.length} usuarios copiados`)

    // PASO 3: Copiar categorías
    console.log('\n📦 3. Copiando categorías...')
    const categories = await neonPrisma.categoriaProyecto.findMany()
    for (const cat of categories) {
      await localPrisma.categoriaProyecto.create({ data: cat })
    }
    console.log(`   ✓ ${categories.length} categorías copiadas`)

    // PASO 4: Copiar clientes
    console.log('\n📦 4. Copiando clientes...')
    const clients = await neonPrisma.cliente.findMany()
    for (const client of clients) {
      await localPrisma.cliente.create({ data: client })
    }
    console.log(`   ✓ ${clients.length} clientes copiados`)

    // PASO 5: Copiar proyectos
    console.log('\n📦 5. Copiando proyectos...')
    const projects = await neonPrisma.proyecto.findMany()
    for (const proj of projects) {
      await localPrisma.proyecto.create({ data: proj })
    }
    console.log(`   ✓ ${projects.length} proyectos copiados`)

    // PASO 6: Copiar imágenes
    console.log('\n📦 6. Copiando imágenes...')
    const images = await neonPrisma.imagenProyecto.findMany()
    for (const img of images) {
      await localPrisma.imagenProyecto.create({ data: img })
    }
    console.log(`   ✓ ${images.length} imágenes copiadas`)

    // PASO 7: Copiar progreso
    console.log('\n📦 7. Copiando progreso de proyectos...')
    const progress = await neonPrisma.progresoProyecto.findMany()
    for (const prog of progress) {
      await localPrisma.progresoProyecto.create({ data: prog })
    }
    console.log(`   ✓ ${progress.length} registros de progreso copiados`)

    // PASO 8: Copiar servicios
    console.log('\n📦 8. Copiando servicios...')
    const services = await neonPrisma.servicio.findMany()
    for (const service of services) {
      await localPrisma.servicio.create({ data: service })
    }
    console.log(`   ✓ ${services.length} servicios copiados`)

    // PASO 9: Copiar configuraciones
    console.log('\n📦 9. Copiando configuraciones del sitio...')
    const configs = await neonPrisma.configuracionSitio.findMany()
    for (const config of configs) {
      await localPrisma.configuracionSitio.create({ data: config })
    }
    console.log(`   ✓ ${configs.length} configuraciones copiadas`)

    console.log('\n✅ ¡Restauración COMPLETA exitosa!')
    console.log(`\n📊 Resumen:`)
    console.log(`   - ${users.length} usuarios`)
    console.log(`   - ${categories.length} categorías`)
    console.log(`   - ${clients.length} clientes`)
    console.log(`   - ${projects.length} proyectos`)
    console.log(`   - ${images.length} imágenes`)
    console.log(`   - ${progress.length} registros de progreso`)
    console.log(`   - ${services.length} servicios`)
    console.log(`   - ${configs.length} configuraciones`)
    console.log('\n   Tu base de datos local ahora es idéntica a producción.\n')

  } catch (error) {
    console.error('\n❌ Error durante la restauración:', error)
    throw error
  } finally {
    await neonPrisma.$disconnect()
    await localPrisma.$disconnect()
  }
}

main()

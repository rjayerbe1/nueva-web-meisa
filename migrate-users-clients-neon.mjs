#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const local = new PrismaClient({
  datasources: { db: { url: 'postgresql://rjayerbe@localhost:5432/meisa_db' } }
})

const neon = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } }
})

async function migrate() {
  console.log('\n🚀 Migrando usuarios y clientes a Neon...\n')

  try {
    // USUARIOS
    console.log('📋 1/2 Migrando usuarios...')
    const users = await local.user.findMany()

    for (const u of users) {
      try {
        await neon.user.create({ data: u })
        console.log(`  ✓ ${u.email}`)
      } catch (e) {
        console.log(`  ⚠️  ${u.email}: ya existe`)
      }
    }

    // CLIENTES
    console.log('\n📋 2/2 Migrando clientes...')
    const clients = await local.cliente.findMany()

    for (const c of clients) {
      try {
        await neon.cliente.create({ data: c })
        console.log(`  ✓ ${c.nombre}`)
      } catch (e) {
        console.log(`  ⚠️  ${c.nombre}: ya existe`)
      }
    }

    console.log('\n✅ ¡Migración completada!\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await local.$disconnect()
    await neon.$disconnect()
  }
}

migrate()

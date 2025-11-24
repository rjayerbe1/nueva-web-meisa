#!/usr/bin/env node

/**
 * Script para revisar el estado de la base de datos Neon
 * Uso: DATABASE_URL="tu-url-de-neon" node check-neon-db.mjs
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('\n🔍 Revisando base de datos de Neon...\n')

  try {
    // 1. Verificar conexión
    await prisma.$connect()
    console.log('✅ Conexión exitosa a la base de datos\n')

    // 2. Verificar si existe la tabla miembros_equipo
    const result = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'miembros_equipo'
    `

    if (result.length > 0) {
      console.log('⚠️  La tabla "miembros_equipo" TODAVÍA EXISTE en la base de datos')

      // Contar registros
      const count = await prisma.$queryRaw`SELECT COUNT(*) as count FROM miembros_equipo`
      console.log(`   📊 Registros en la tabla: ${count[0].count}`)
      console.log('\n❌ Necesitas ejecutar: DATABASE_URL="<neon-url>" npx prisma db push\n')
    } else {
      console.log('✅ La tabla "miembros_equipo" NO existe (base de datos actualizada)')
    }

    // 3. Listar todas las tablas actuales
    console.log('\n📋 Tablas en la base de datos:')
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`)
    })

    console.log('\n✅ Revisión completada\n')

  } catch (error) {
    console.error('❌ Error al revisar la base de datos:')
    console.error(error.message)
    console.log('\n💡 Verifica que la DATABASE_URL sea correcta\n')
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

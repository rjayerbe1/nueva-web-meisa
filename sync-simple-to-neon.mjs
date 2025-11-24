#!/usr/bin/env node

/**
 * Script SIMPLE para sincronizar a Neon
 * Enfoque: Borrar categorías antiguas, luego migrar datos completos desde local
 */

import { execSync } from 'child_process'

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const LOCAL_URL = 'postgresql://rjayerbe@localhost:5432/meisa_db'

console.log('\n╔════════════════════════════════════════════════════════════╗')
console.log('║  🚀 SINCRONIZACIÓN SIMPLE A NEON                          ║')
console.log('╚════════════════════════════════════════════════════════════╝\n')

try {
  // Paso 1: Borrar tabla de categorías en Neon para evitar conflictos
  console.log('🗑️  PASO 1: Eliminando categorías antiguas de Neon...\n')
  execSync(`DATABASE_URL='${NEON_URL}' npx prisma db execute --stdin <<< "DELETE FROM categorias_proyecto;"`, {
    stdio: 'inherit',
    shell: '/bin/bash'
  })
  console.log('✅ Categorías antiguas eliminadas\n')

  // Paso 2: Sincronizar schema
  console.log('═══════════════════════════════════════════════════════════\n')
  console.log('🔄 PASO 2: Sincronizando schema de Prisma a Neon...\n')
  execSync(`DATABASE_URL='${NEON_URL}' npx prisma db push --accept-data-loss --skip-generate`, { stdio: 'inherit' })
  console.log('\n✅ Schema sincronizado\n')

  // Paso 3: Migrar datos completos
  console.log('═══════════════════════════════════════════════════════════\n')
  console.log('📦 PASO 3: Migrando datos completos desde local...\n')
  execSync(`LOCAL_DB_URL='${LOCAL_URL}' PROD_DB_URL='${NEON_URL}' npx tsx scripts/migrate-full-db.ts`, { stdio: 'inherit' })

  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║  ✅ ¡SINCRONIZACIÓN COMPLETADA EXITOSAMENTE!              ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')
  console.log('Próximos pasos:')
  console.log('1. Verifica que las categorías estén correctas en Neon')
  console.log('2. Haz deploy con GitHub Actions cuando estés listo\n')

} catch (error) {
  console.error('\n❌ Error durante la sincronización:', error.message)
  process.exit(1)
}

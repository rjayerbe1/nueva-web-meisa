import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createNewEnum() {
  try {
    console.log('=== PASO 4: Crear nuevo enum y columna ===\n')

    // Paso 1: Eliminar el enum viejo si existe
    console.log('1. Eliminando enum viejo...')
    try {
      await prisma.$executeRaw`DROP TYPE IF EXISTS "CategoriaEnum" CASCADE`
      console.log('   ✓ Enum viejo eliminado')
    } catch (error) {
      console.log('   - Enum ya estaba eliminado')
    }

    // Paso 2: Crear el nuevo enum
    console.log('2. Creando nuevo enum...')
    await prisma.$executeRaw`
      CREATE TYPE "CategoriaEnum" AS ENUM (
        'COMERCIAL',
        'INDUSTRIAL',
        'PUENTES',
        'INFRAESTRUCTURA_URBANA',
        'EDIFICACIONES',
        'DEPORTES_EDUCACION'
      )
    `
    console.log('   ✓ Nuevo enum creado')

    // Paso 3: Agregar columna categoria con el nuevo enum
    console.log('3. Agregando columna categoria...')
    await prisma.$executeRaw`
      ALTER TABLE proyectos
      ADD COLUMN categoria "CategoriaEnum" DEFAULT 'COMERCIAL'::\"CategoriaEnum\"
    `
    console.log('   ✓ Columna categoria agregada')

    // Paso 4: Copiar valores desde categoria_temp
    console.log('4. Restaurando valores desde categoria_temp...')
    await prisma.$executeRaw`
      UPDATE proyectos
      SET categoria = categoria_temp::"CategoriaEnum"
      WHERE categoria_temp IS NOT NULL
    `

    // Verificar
    const verificacion = await prisma.$queryRaw<Array<{categoria: string, count: bigint}>>`
      SELECT categoria, COUNT(*) as count
      FROM proyectos
      GROUP BY categoria
      ORDER BY count DESC
    `

    console.log('\n   Verificación:')
    verificacion.forEach(v => {
      console.log(`     ${v.categoria}: ${v.count} proyectos`)
    })

    // Paso 5: Eliminar columna temporal
    console.log('\n5. Eliminando columna temporal...')
    await prisma.$executeRaw`
      ALTER TABLE proyectos DROP COLUMN categoria_temp
    `
    console.log('   ✓ Columna temporal eliminada')

    // Paso 6: Hacer la columna NOT NULL
    console.log('6. Configurando categoria como NOT NULL...')
    await prisma.$executeRaw`
      ALTER TABLE proyectos
      ALTER COLUMN categoria SET NOT NULL
    `
    console.log('   ✓ Columna configurada como NOT NULL')

    console.log('\n✅ Migración de Proyecto completada')
    console.log('📋 Siguiente: ejecutar "npx prisma db push" para sincronizar schema completo')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createNewEnum()

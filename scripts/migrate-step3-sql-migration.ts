import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateEnumValues() {
  try {
    console.log('=== PASO 3: Migración SQL de valores de enum ===\n')

    // Paso 1: Agregar columna temporal para guardar el mapeo
    console.log('1. Creando columna temporal categoria_temp...')
    await prisma.$executeRaw`
      ALTER TABLE proyectos
      ADD COLUMN IF NOT EXISTS categoria_temp TEXT
    `

    // Paso 2: Mapear valores antiguos a nuevos en la columna temporal
    console.log('2. Mapeando valores antiguos a nuevos...')

    await prisma.$executeRaw`
      UPDATE proyectos SET categoria_temp = 'COMERCIAL' WHERE categoria = 'COMERCIAL'
    `
    await prisma.$executeRaw`
      UPDATE proyectos SET categoria_temp = 'EDIFICACIONES' WHERE categoria = 'EDIFICACIONES'
    `
    await prisma.$executeRaw`
      UPDATE proyectos SET categoria_temp = 'INDUSTRIAL' WHERE categoria = 'INDUSTRIA'
    `
    await prisma.$executeRaw`
      UPDATE proyectos SET categoria_temp = 'PUENTES' WHERE categoria = 'PUENTES_VEHICULARES'
    `
    await prisma.$executeRaw`
      UPDATE proyectos SET categoria_temp = 'PUENTES' WHERE categoria = 'PUENTES_PEATONALES'
    `
    await prisma.$executeRaw`
      UPDATE proyectos SET categoria_temp = 'DEPORTES_EDUCACION' WHERE categoria = 'ESCENARIOS_DEPORTIVOS'
    `
    await prisma.$executeRaw`
      UPDATE proyectos SET categoria_temp = 'EDIFICACIONES' WHERE categoria = 'CUBIERTAS_Y_FACHADAS'
    `
    await prisma.$executeRaw`
      UPDATE proyectos SET categoria_temp = 'INDUSTRIAL' WHERE categoria = 'ESTRUCTURAS_MODULARES'
    `
    await prisma.$executeRaw`
      UPDATE proyectos SET categoria_temp = 'INFRAESTRUCTURA_URBANA' WHERE categoria = 'OTRO'
    `

    // Verificar mapeo
    const verificacion = await prisma.$queryRaw<Array<{categoria_temp: string, count: bigint}>>`
      SELECT categoria_temp, COUNT(*) as count
      FROM proyectos
      GROUP BY categoria_temp
      ORDER BY count DESC
    `

    console.log('\nVerificación de mapeo:')
    verificacion.forEach(v => {
      console.log(`  ${v.categoria_temp}: ${v.count} proyectos`)
    })

    // Paso 3: Eliminar la columna categoria antigua
    console.log('\n3. Eliminando columna categoria antigua...')
    await prisma.$executeRaw`
      ALTER TABLE proyectos DROP COLUMN categoria
    `

    console.log('✅ Migración SQL completada')
    console.log('\n📋 Siguiente paso: ejecutar "npx prisma db push" para aplicar el nuevo schema')
    console.log('   Después ejecutar script para restaurar categoria desde categoria_temp')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateEnumValues()

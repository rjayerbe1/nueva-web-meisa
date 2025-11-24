import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Paso 1: Migrar valores de enum antiguos a nuevos en Neon
 * Esto debe ejecutarse ANTES de cambiar el schema
 */

async function migrateEnumValues() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║  PASO 1: MIGRAR VALORES DE CATEGORÍAS EN NEON            ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  try {
    // Mapeo de categorías antiguas → nuevas
    const mappings = {
      'CENTROS_COMERCIALES': 'COMERCIAL',
      'INDUSTRIA': 'INDUSTRIAL',
      'PUENTES_VEHICULARES': 'PUENTES',
      'PUENTES_PEATONALES': 'PUENTES',
      'OIL_AND_GAS': 'INFRAESTRUCTURA_URBANA',
      'EDIFICIOS': 'EDIFICACIONES',
      'ESCENARIOS_DEPORTIVOS': 'DEPORTES_EDUCACION',
      'CUBIERTAS_Y_FACHADAS': 'EDIFICACIONES',
      'ESTRUCTURAS_MODULARES': 'INDUSTRIAL',
      'OTRO': 'COMERCIAL'
    }

    console.log('🔄 Migrando valores en tabla Proyecto...\n')

    for (const [oldValue, newValue] of Object.entries(mappings)) {
      // Contar proyectos con valor antiguo
      const count = await prisma.$executeRawUnsafe(`
        SELECT COUNT(*) FROM proyectos WHERE categoria = '${oldValue}'
      `)

      if (count > 0) {
        console.log(`   📁 ${oldValue} → ${newValue}`)

        // Actualizar proyectos
        await prisma.$executeRawUnsafe(`
          UPDATE proyectos
          SET categoria = '${newValue}'
          WHERE categoria = '${oldValue}'
        `)

        console.log(`      ✓ ${count} proyectos actualizados`)
      }
    }

    console.log('\n🔄 Migrando valores en tabla ProyectoHojaVida...\n')

    for (const [oldValue, newValue] of Object.entries(mappings)) {
      // Contar proyectos hoja de vida con valor antiguo
      const count = await prisma.$executeRawUnsafe(`
        SELECT COUNT(*) FROM proyectos_hoja_vida WHERE categoria = '${oldValue}'
      `)

      if (count > 0) {
        console.log(`   📁 ${oldValue} → ${newValue}`)

        // Actualizar proyectos hoja de vida
        await prisma.$executeRawUnsafe(`
          UPDATE proyectos_hoja_vida
          SET categoria = '${newValue}'
          WHERE categoria = '${oldValue}'
        `)

        console.log(`      ✓ ${count} proyectos actualizados`)
      }
    }

    console.log('\n✅ Valores de categorías migrados exitosamente\n')
    console.log('═══════════════════════════════════════════════════════════\n')

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateEnumValues()

#!/usr/bin/env node

/**
 * Migración directa de categorías en Neon usando SQL raw
 */

import pkg from 'pg'
const { Client } = pkg

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'

async function migrateCategorias() {
  const client = new Client({
    connectionString: NEON_URL,
  })

  try {
    console.log('\n╔═══════════════════════════════════════════════════════════╗')
    console.log('║  MIGRACIÓN DE CATEGORÍAS EN NEON (SQL DIRECTO)           ║')
    console.log('╚═══════════════════════════════════════════════════════════╝\n')

    await client.connect()
    console.log('✅ Conectado a Neon\n')

    // Ver estado actual
    console.log('📊 ESTADO ACTUAL:\n')

    const proyectos = await client.query(`
      SELECT categoria, COUNT(*) as total
      FROM proyectos
      GROUP BY categoria
      ORDER BY categoria
    `)

    console.log('Categorías en Proyectos:')
    proyectos.rows.forEach(row => {
      console.log(`  ${row.categoria}: ${row.total}`)
    })

    const hojaVida = await client.query(`
      SELECT categoria, COUNT(*) as total
      FROM proyectos_hoja_vida
      GROUP BY categoria
      ORDER BY categoria
    `)

    console.log('\nCategorías en ProyectosHojaVida:')
    hojaVida.rows.forEach(row => {
      console.log(`  ${row.categoria}: ${row.total}`)
    })

    // Mapeo de categorías
    const mappings = [
      { old: 'CENTROS_COMERCIALES', new: 'COMERCIAL' },
      { old: 'INDUSTRIA', new: 'INDUSTRIAL' },
      { old: 'PUENTES_VEHICULARES', new: 'PUENTES' },
      { old: 'PUENTES_PEATONALES', new: 'PUENTES' },
      { old: 'OIL_AND_GAS', new: 'INFRAESTRUCTURA_URBANA' },
      { old: 'EDIFICIOS', new: 'EDIFICACIONES' },
      { old: 'ESCENARIOS_DEPORTIVOS', new: 'DEPORTES_EDUCACION' },
      { old: 'CUBIERTAS_Y_FACHADAS', new: 'EDIFICACIONES' },
      { old: 'ESTRUCTURAS_MODULARES', new: 'INDUSTRIAL' },
      { old: 'OTRO', new: 'COMERCIAL' },
    ]

    console.log('\n🔄 MIGRANDO VALORES...\n')

    // Migrar proyectos
    for (const { old: oldCat, new: newCat } of mappings) {
      const result = await client.query(
        `UPDATE proyectos SET categoria = $1 WHERE categoria = $2`,
        [newCat, oldCat]
      )
      if (result.rowCount > 0) {
        console.log(`  ✓ Proyectos: ${oldCat} → ${newCat} (${result.rowCount} registros)`)
      }
    }

    // Migrar proyectos hoja de vida
    for (const { old: oldCat, new: newCat } of mappings) {
      const result = await client.query(
        `UPDATE proyectos_hoja_vida SET categoria = $1 WHERE categoria = $2`,
        [newCat, oldCat]
      )
      if (result.rowCount > 0) {
        console.log(`  ✓ HojaVida: ${oldCat} → ${newCat} (${result.rowCount} registros)`)
      }
    }

    // Verificar resultado
    console.log('\n📊 RESULTADO FINAL:\n')

    const proyectosNew = await client.query(`
      SELECT categoria, COUNT(*) as total
      FROM proyectos
      GROUP BY categoria
      ORDER BY categoria
    `)

    console.log('Categorías en Proyectos:')
    proyectosNew.rows.forEach(row => {
      console.log(`  ${row.categoria}: ${row.total}`)
    })

    const hojaVidaNew = await client.query(`
      SELECT categoria, COUNT(*) as total
      FROM proyectos_hoja_vida
      GROUP BY categoria
      ORDER BY categoria
    `)

    console.log('\nCategorías en ProyectosHojaVida:')
    hojaVidaNew.rows.forEach(row => {
      console.log(`  ${row.categoria}: ${row.total}`)
    })

    console.log('\n✅ MIGRACIÓN DE VALORES COMPLETADA\n')
    console.log('═══════════════════════════════════════════════════════════\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  } finally {
    await client.end()
  }
}

migrateCategorias()

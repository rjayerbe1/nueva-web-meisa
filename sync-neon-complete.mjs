#!/usr/bin/env node

/**
 * Sincronización completa a Neon - Paso a paso
 */

import pkg from 'pg'
const { Client } = pkg
import { PrismaClient } from '@prisma/client'

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'

const prismaLocal = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://rjayerbe@localhost:5432/meisa_db'
    }
  }
})

async function syncToNeon() {
  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║  🚀 SINCRONIZACIÓN COMPLETA A NEON                        ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')

  const client = new Client({ connectionString: NEON_URL })

  try {
    await client.connect()
    console.log('✅ Conectado a Neon\n')

    // PASO 1: Actualizar valores de enum en proyectos
    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('🔄 PASO 1: Actualizando valores de categorías en proyectos...\n')

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

    for (const { old: oldCat, new: newCat } of mappings) {
      const result = await client.query(
        `UPDATE proyectos SET categoria = $1::"CategoriaEnum" WHERE categoria::text = $2`,
        [newCat, oldCat]
      )
      if (result.rowCount > 0) {
        console.log(`  ✓ Proyectos: ${oldCat} → ${newCat} (${result.rowCount})`)
      }
    }

    // Verificar si existe tabla proyectos_hoja_vida
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'proyectos_hoja_vida'
      )
    `)

    if (tableCheck.rows[0].exists) {
      for (const { old: oldCat, new: newCat } of mappings) {
        const result = await client.query(
          `UPDATE proyectos_hoja_vida SET categoria = $1::"CategoriaEnum" WHERE categoria::text = $2`,
          [newCat, oldCat]
        )
        if (result.rowCount > 0) {
          console.log(`  ✓ HojaVida: ${oldCat} → ${newCat} (${result.rowCount})`)
        }
      }
    }

    console.log('\n✅ Valores de categorías actualizados\n')

    // PASO 2: Borrar tabla de categorías
    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('🗑️  PASO 2: Limpiando categorías antiguas...\n')
    await client.query('DELETE FROM categorias_proyecto')
    console.log('✅ Categorías antiguas eliminadas\n')

    await client.end()

    // PASO 3: Hacer db push (ahora que no hay datos conflictivos)
    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('🔄 PASO 3: Sincronizando schema Prisma...\n')

    const { execSync } = await import('child_process')
    execSync(`DATABASE_URL='${NEON_URL}' npx prisma db push --accept-data-loss --skip-generate`, {
      stdio: 'inherit'
    })

    console.log('\n✅ Schema actualizado\n')

    // PASO 3: Reconectar para migrar categorías
    await client.connect()

    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('📁 PASO 4: Migrando categorías desde local...\n')

    const categorias = await prismaLocal.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' }
    })

    console.log(`Encontradas ${categorias.length} categorías en local\n`)

    for (const cat of categorias) {
      await client.query(`
        INSERT INTO categorias_proyecto (
          id, key, nombre, slug, descripcion, icono,
          "imagenCover", "imagenBanner", "videoCover", "videoBanner",
          color, "colorSecundario", destacada, visible, orden,
          "totalProyectos", "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (key) DO UPDATE SET
          nombre = EXCLUDED.nombre,
          slug = EXCLUDED.slug,
          descripcion = EXCLUDED.descripcion,
          icono = EXCLUDED.icono,
          "imagenCover" = EXCLUDED."imagenCover",
          "imagenBanner" = EXCLUDED."imagenBanner",
          "videoCover" = EXCLUDED."videoCover",
          "videoBanner" = EXCLUDED."videoBanner",
          color = EXCLUDED.color,
          "colorSecundario" = EXCLUDED."colorSecundario",
          destacada = EXCLUDED.destacada,
          visible = EXCLUDED.visible,
          orden = EXCLUDED.orden,
          "updatedAt" = EXCLUDED."updatedAt"
      `, [
        cat.id, cat.key, cat.nombre, cat.slug, cat.descripcion, cat.icono,
        cat.imagenCover, cat.imagenBanner, cat.videoCover, cat.videoBanner,
        cat.color, cat.colorSecundario, cat.destacada, cat.visible, cat.orden,
        cat.totalProyectos, cat.createdAt, cat.updatedAt
      ])

      console.log(`  ✓ ${cat.nombre} (${cat.key})`)
      console.log(`     Cover: ${cat.imagenCover || 'N/A'}`)
      console.log(`     Icono: ${cat.icono || 'N/A'}`)
      console.log(`     Proyectos: ${cat.totalProyectos}`)
      console.log('')
    }

    console.log('✅ Categorías migradas\n')

    // PASO 5: Actualizar contadores
    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('🔢 PASO 5: Actualizando contadores...\n')

    // Verificar si existe tabla proyectos_hoja_vida
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'proyectos_hoja_vida'
      )
    `)

    for (const cat of categorias) {
      // Contar proyectos detallados
      const countDetailed = await client.query(
        'SELECT COUNT(*) as total FROM proyectos WHERE categoria = $1 AND visible = true',
        [cat.key]
      )

      // Contar proyectos hoja de vida si existe la tabla
      let countHojaVida = 0
      if (tableExists.rows[0].exists) {
        const result = await client.query(
          'SELECT COUNT(*) as total FROM proyectos_hoja_vida WHERE categoria = $1',
          [cat.key]
        )
        countHojaVida = parseInt(result.rows[0].total)
      }

      const totalProyectos = parseInt(countDetailed.rows[0].total) + countHojaVida

      await client.query(
        'UPDATE categorias_proyecto SET "totalProyectos" = $1 WHERE key = $2',
        [totalProyectos, cat.key]
      )

      console.log(`  ✓ ${cat.nombre}: ${totalProyectos} proyectos`)
    }

    console.log('\n✅ Contadores actualizados\n')

    // Resumen final
    console.log('╔════════════════════════════════════════════════════════════╗')
    console.log('║  ✅ ¡SINCRONIZACIÓN COMPLETA EXITOSA!                     ║')
    console.log('╚════════════════════════════════════════════════════════════╝\n')

    console.log('📊 RESUMEN:\n')
    const finalCats = await client.query(`
      SELECT key, nombre, "totalProyectos", "imagenCover", icono
      FROM categorias_proyecto
      ORDER BY orden ASC
    `)

    finalCats.rows.forEach(cat => {
      console.log(`✓ ${cat.nombre} (${cat.key})`)
      console.log(`   Proyectos: ${cat.totalproyectos}`)
      console.log(`   Cover: ${cat.imagenCover ? '✅' : '❌'}`)
      console.log(`   Icono: ${cat.icono ? '✅' : '❌'}`)
      console.log('')
    })

    console.log('Próximos pasos:')
    console.log('1. Verifica la base de datos en Neon')
    console.log('2. Haz deploy con GitHub Actions\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.error(error)
    throw error
  } finally {
    await client.end()
    await prismaLocal.$disconnect()
  }
}

syncToNeon()

#!/usr/bin/env node

/**
 * Sincronización SIMPLE: Borrar proyectos, actualizar schema, migrar todo
 */

import pkg from 'pg'
const { Client } = pkg
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'

const prismaLocal = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://rjayerbe@localhost:5432/meisa_db'
    }
  }
})

async function syncSimple() {
  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║  🚀 SINCRONIZACIÓN SIMPLE A NEON (BORRAR Y RECREAR)      ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')
  console.log('⚠️  ADVERTENCIA: Esto borrará temporalmente proyectos en Neon')
  console.log('    y los recreará desde la base de datos local.\n')

  const client = new Client({ connectionString: NEON_URL })

  try {
    await client.connect()
    console.log('✅ Conectado a Neon\n')

    // PASO 1: Borrar proyectos y categorías
    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('🗑️  PASO 1: Limpiando datos existentes...\n')

    await client.query('DELETE FROM imagenes_proyecto')
    console.log('  ✓ Imágenes borradas')

    await client.query('DELETE FROM proyectos_hoja_vida')
    console.log('  ✓ ProyectosHojaVida borrados')

    await client.query('DELETE FROM proyectos')
    console.log('  ✓ Proyectos borrados')

    await client.query('DELETE FROM categorias_proyecto')
    console.log('  ✓ Categorías borradas')

    console.log('\n✅ Datos limpiados\n')

    await client.end()

    // PASO 2: Actualizar schema
    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('🔄 PASO 2: Actualizando schema de Prisma...\n')

    execSync(`DATABASE_URL='${NEON_URL}' npx prisma db push --accept-data-loss --skip-generate`, {
      stdio: 'inherit'
    })

    console.log('\n✅ Schema actualizado\n')

    // PASO 3: Migrar categorías desde local
    await client.connect()

    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('📁 PASO 3: Migrando categorías desde local...\n')

    const categorias = await prismaLocal.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' }
    })

    for (const cat of categorias) {
      await client.query(`
        INSERT INTO categorias_proyecto (
          id, key, nombre, slug, descripcion, icono,
          "imagenCover", "imagenBanner", "videoCover", "videoBanner",
          color, "colorSecundario", destacada, visible, orden,
          "totalProyectos", "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `, [
        cat.id, cat.key, cat.nombre, cat.slug, cat.descripcion, cat.icono,
        cat.imagenCover, cat.imagenBanner, cat.videoCover, cat.videoBanner,
        cat.color, cat.colorSecundario, cat.destacada, cat.visible, cat.orden,
        cat.totalProyectos, cat.createdAt, cat.updatedAt
      ])

      console.log(`  ✓ ${cat.nombre}`)
    }

    console.log('\n✅ Categorías migradas\n')

    // PASO 4: Migrar proyectos desde local
    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('📦 PASO 4: Migrando proyectos desde local...\n')

    const proyectos = await prismaLocal.proyecto.findMany({
      include: {
        imagenes: true
      }
    })

    for (const proy of proyectos) {
      // Insertar proyecto
      await client.query(`
        INSERT INTO proyectos (
          id, titulo, descripcion, categoria, estado, prioridad,
          "fechaInicio", "fechaFin", presupuesto, cliente, ubicacion,
          tags, destacado, "destacadoEnCategoria", visible, slug,
          "createdBy", "createdAt", "updatedAt", "areaTotal", toneladas
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      `, [
        proy.id, proy.titulo, proy.descripcion, proy.categoria, proy.estado, proy.prioridad,
        proy.fechaInicio, proy.fechaFin, proy.presupuesto, proy.cliente, proy.ubicacion,
        proy.tags, proy.destacado, proy.destacadoEnCategoria, proy.visible, proy.slug,
        proy.createdBy, proy.createdAt, proy.updatedAt, proy.areaTotal, proy.toneladas
      ])

      // Insertar imágenes
      for (const img of proy.imagenes) {
        await client.query(`
          INSERT INTO imagenes_proyecto (
            id, url, alt, titulo, orden, tipo, proyectoId,
            "createdAt", "updatedAt"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          img.id, img.url, img.alt, img.titulo, img.orden, img.tipo, img.proyectoId,
          img.createdAt, img.updatedAt
        ])
      }
    }

    console.log(`  ✓ ${proyectos.length} proyectos migrados\n`)

    // PASO 5: Migrar ProyectosHojaVida
    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('📋 PASO 5: Migrando ProyectosHojaVida desde local...\n')

    const hojaVida = await prismaLocal.proyectoHojaVida.findMany()

    for (const proy of hojaVida) {
      await client.query(`
        INSERT INTO proyectos_hoja_vida (
          id, nombre, categoria, descripcion, "ubicacionPrincipal",
          toneladas, destacado, slug, "createdAt", "updatedAt",
          "clienteId", "imagenUrl"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        proy.id, proy.nombre, proy.categoria, proy.descripcion, proy.ubicacionPrincipal,
        proy.toneladas, proy.destacado, proy.slug, proy.createdAt, proy.updatedAt,
        proy.clienteId, proy.imagenUrl
      ])
    }

    console.log(`  ✓ ${hojaVida.length} proyectos hoja de vida migrados\n`)

    // PASO 6: Actualizar contadores
    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('🔢 PASO 6: Actualizando contadores...\n')

    for (const cat of categorias) {
      const countDetailed = await client.query(
        'SELECT COUNT(*) as total FROM proyectos WHERE categoria = $1 AND visible = true',
        [cat.key]
      )

      const countHojaVida = await client.query(
        'SELECT COUNT(*) as total FROM proyectos_hoja_vida WHERE categoria = $1',
        [cat.key]
      )

      const total = parseInt(countDetailed.rows[0].total) + parseInt(countHojaVida.rows[0].total)

      await client.query(
        'UPDATE categorias_proyecto SET "totalProyectos" = $1 WHERE key = $2',
        [total, cat.key]
      )

      console.log(`  ✓ ${cat.nombre}: ${total} proyectos`)
    }

    console.log('\n╔════════════════════════════════════════════════════════════╗')
    console.log('║  ✅ ¡SINCRONIZACIÓN COMPLETADA!                          ║')
    console.log('╚════════════════════════════════════════════════════════════╝\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.error(error)
    throw error
  } finally {
    await client.end()
    await prismaLocal.$disconnect()
  }
}

syncSimple()

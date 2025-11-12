#!/usr/bin/env node

/**
 * Script para comparar DATOS entre local y Neon
 */

import { PrismaClient } from '@prisma/client'

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

async function compareData() {
  console.log('\n📊 Comparando datos LOCAL vs NEON...\n')

  // Conexión LOCAL
  const prismaLocal = new PrismaClient()

  // Conexión NEON
  const prismaNeon = new PrismaClient({
    datasources: {
      db: {
        url: NEON_URL
      }
    }
  })

  try {
    await prismaLocal.$connect()
    await prismaNeon.$connect()
    console.log('✅ Conexiones establecidas\n')

    // Comparar tablas importantes
    const tablas = [
      { nombre: 'proyectos_hoja_vida', query: 'proyectoHojaVida' },
      { nombre: 'configuracion_trayectoria', query: 'configuracionTrayectoria' },
      { nombre: 'resumenes_anio', query: 'resumenAnio' },
      { nombre: 'proyectos', query: 'proyecto' },
      { nombre: 'clientes', query: 'cliente' },
      { nombre: 'servicios', query: 'servicio' }
    ]

    console.log('┌─────────────────────────────────┬──────────┬──────────┬────────────┐')
    console.log('│ Tabla                           │ Local    │ Neon     │ Diferencia │')
    console.log('├─────────────────────────────────┼──────────┼──────────┼────────────┤')

    for (const tabla of tablas) {
      const countLocal = await prismaLocal[tabla.query].count()
      const countNeon = await prismaNeon[tabla.query].count()
      const diff = countLocal - countNeon

      const diffStr = diff === 0
        ? '✓ OK'
        : diff > 0
          ? `⚠️  +${diff}`
          : `⚠️  ${diff}`

      console.log(
        `│ ${tabla.nombre.padEnd(31)} │ ${String(countLocal).padEnd(8)} │ ${String(countNeon).padEnd(8)} │ ${diffStr.padEnd(10)} │`
      )
    }

    console.log('└─────────────────────────────────┴──────────┴──────────┴────────────┘')

    // Detalles de proyectos_hoja_vida si hay diferencia
    const localProyectos = await prismaLocal.proyectoHojaVida.count()
    const neonProyectos = await prismaNeon.proyectoHojaVida.count()

    if (localProyectos > 0 && neonProyectos === 0) {
      console.log('\n⚠️  Neon NO tiene proyectos de trayectoria')
      console.log('   Necesitas copiar los datos de local a Neon\n')

      const proyectos = await prismaLocal.proyectoHojaVida.findMany({
        select: {
          entidadContratante: true,
          objetoContrato: true,
          fechaInicio: true
        },
        orderBy: { fechaInicio: 'desc' },
        take: 5
      })

      console.log('📋 Primeros 5 proyectos en LOCAL:')
      proyectos.forEach((p, i) => {
        const fecha = new Date(p.fechaInicio).getFullYear()
        console.log(`   ${i + 1}. ${p.entidadContratante} (${fecha})`)
        console.log(`      ${p.objetoContrato.substring(0, 60)}...`)
      })

      console.log('\n💡 Para copiar datos: node copy-data-to-neon.mjs\n')
    } else if (localProyectos === neonProyectos) {
      console.log('\n✅ Los datos están sincronizados\n')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prismaLocal.$disconnect()
    await prismaNeon.$disconnect()
  }
}

compareData()

#!/usr/bin/env node

/**
 * Script para copiar datos de LOCAL a NEON
 * IMPORTANTE: Solo copia datos que NO existen en Neon
 */

import { PrismaClient } from '@prisma/client'

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

async function copyData() {
  console.log('\n🔄 Copiando datos de LOCAL a NEON...\n')

  const prismaLocal = new PrismaClient()
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

    let totalCopiados = 0

    // 1. Copiar configuracion_trayectoria
    console.log('📋 1. Copiando configuración de trayectoria...')
    const configLocal = await prismaLocal.configuracionTrayectoria.findFirst()
    const configNeon = await prismaNeon.configuracionTrayectoria.findFirst()

    if (configLocal && !configNeon) {
      await prismaNeon.configuracionTrayectoria.create({
        data: {
          resenaHistorica: configLocal.resenaHistorica,
          mision: configLocal.mision,
          vision: configLocal.vision,
          valores: configLocal.valores
        }
      })
      console.log('   ✓ Configuración copiada')
      totalCopiados++
    } else if (configNeon) {
      console.log('   ⊘ Ya existe, saltando')
    } else {
      console.log('   ⊘ No hay configuración en local')
    }

    // 2. Copiar proyectos_hoja_vida
    console.log('\n📂 2. Copiando proyectos de trayectoria...')
    const proyectosLocal = await prismaLocal.proyectoHojaVida.findMany()
    const proyectosNeonCount = await prismaNeon.proyectoHojaVida.count()

    if (proyectosNeonCount === 0 && proyectosLocal.length > 0) {
      console.log(`   Copiando ${proyectosLocal.length} proyectos...`)

      for (let i = 0; i < proyectosLocal.length; i++) {
        const proyecto = proyectosLocal[i]

        await prismaNeon.proyectoHojaVida.create({
          data: {
            entidadContratante: proyecto.entidadContratante,
            objetoContrato: proyecto.objetoContrato,
            tituloDisplay: proyecto.tituloDisplay,
            descripcionSecundaria: proyecto.descripcionSecundaria,
            fechaInicio: proyecto.fechaInicio,
            fechaFin: proyecto.fechaFin,
            pesoKg: proyecto.pesoKg,
            areaM2: proyecto.areaM2,
            ubicacion: proyecto.ubicacion,
            departamento: proyecto.departamento,
            valorContrato: proyecto.valorContrato,
            moneda: proyecto.moneda,
            imagenes: proyecto.imagenes,
            destacado: proyecto.destacado,
            visible: proyecto.visible,
            orden: proyecto.orden
          }
        })

        if ((i + 1) % 25 === 0) {
          console.log(`   ⏳ Progreso: ${i + 1}/${proyectosLocal.length}`)
        }
      }

      console.log(`   ✓ ${proyectosLocal.length} proyectos copiados`)
      totalCopiados += proyectosLocal.length
    } else if (proyectosNeonCount > 0) {
      console.log('   ⊘ Ya existen proyectos, saltando')
    } else {
      console.log('   ⊘ No hay proyectos en local')
    }

    // 3. Copiar resumenes_anio
    console.log('\n📅 3. Copiando resúmenes por año...')
    const resumenesLocal = await prismaLocal.resumenAnio.findMany()
    const resumenesNeonCount = await prismaNeon.resumenAnio.count()

    if (resumenesNeonCount === 0 && resumenesLocal.length > 0) {
      console.log(`   Copiando ${resumenesLocal.length} resúmenes...`)

      for (const resumen of resumenesLocal) {
        await prismaNeon.resumenAnio.create({
          data: {
            anio: resumen.anio,
            titulo: resumen.titulo,
            descripcion: resumen.descripcion,
            categorias: resumen.categorias,
            imagenesFeatured: resumen.imagenesFeatured,
            estadisticas: resumen.estadisticas,
            visible: resumen.visible,
            orden: resumen.orden
          }
        })
      }

      console.log(`   ✓ ${resumenesLocal.length} resúmenes copiados`)
      totalCopiados += resumenesLocal.length
    } else if (resumenesNeonCount > 0) {
      console.log('   ⊘ Ya existen resúmenes, saltando')
    } else {
      console.log('   ⊘ No hay resúmenes en local')
    }

    // Resumen final
    console.log('\n' + '='.repeat(50))
    console.log(`✅ Proceso completado`)
    console.log(`📊 Total de registros copiados: ${totalCopiados}`)
    console.log('='.repeat(50) + '\n')

    console.log('🔍 Verificando resultado...\n')

    // Verificar
    const finalCount = await prismaNeon.proyectoHojaVida.count()
    console.log(`   Proyectos en Neon: ${finalCount}`)
    console.log(`   Proyectos en Local: ${proyectosLocal.length}`)

    if (finalCount === proyectosLocal.length) {
      console.log('\n✅ ¡Datos sincronizados correctamente!')
      console.log('   Visita: https://meisa-web-660800767729.us-central1.run.app/trayectoria\n')
    } else {
      console.log('\n⚠️  Hay diferencias, revisa manualmente\n')
    }

  } catch (error) {
    console.error('\n❌ Error al copiar datos:')
    console.error(error.message)
    console.error('\n💡 Si el error es de duplicados, es seguro (significa que ya existen)\n')
  } finally {
    await prismaLocal.$disconnect()
    await prismaNeon.$disconnect()
  }
}

copyData()

#!/usr/bin/env tsx

/**
 * Script completo para asegurar que TODAS las historias tengan todos los campos nuevos
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function completeHistoriasUpdate() {
  console.log('🔧 COMPLETANDO ACTUALIZACIÓN DE HISTORIAS')
  console.log('========================================\n')

  try {
    // Obtener todas las historias
    const historias = await prisma.historiaProyecto.findMany({
      include: {
        proyecto: {
          select: {
            titulo: true,
            cliente: true
          }
        }
      }
    })

    console.log(`📊 Procesando ${historias.length} historias...\n`)

    for (let i = 0; i < historias.length; i++) {
      const historia = historias[i]
      console.log(`[${i + 1}/${historias.length}] Actualizando: ${historia.proyecto.titulo}`)

      // Preparar datos de actualización asegurando que todos los campos existan
      const updateData: any = {}

      // Campos de texto que deben existir con valores por defecto
      if (!historia.leccionesAprendidas) {
        updateData.leccionesAprendidas = `Proyecto exitoso que demuestra la capacidad técnica de MEISA para entregar soluciones de alta calidad en ${historia.proyecto.titulo}.`
      }

      // Campos de arrays que deben ser arrays vacíos si no existen
      if (!historia.equipoEspecialista || !Array.isArray(historia.equipoEspecialista)) {
        updateData.equipoEspecialista = []
      }

      if (!historia.fasesEjecucion || !Array.isArray(historia.fasesEjecucion)) {
        updateData.fasesEjecucion = []
      }

      if (!historia.reconocimientos || !Array.isArray(historia.reconocimientos)) {
        updateData.reconocimientos = []
      }

      if (!historia.imagenesDesafio || !Array.isArray(historia.imagenesDesafio)) {
        updateData.imagenesDesafio = []
      }

      if (!historia.imagenesSolucion || !Array.isArray(historia.imagenesSolucion)) {
        updateData.imagenesSolucion = []
      }

      if (!historia.imagenesResultado || !Array.isArray(historia.imagenesResultado)) {
        updateData.imagenesResultado = []
      }

      // Campos de objetos que deben ser objetos vacíos
      if (!historia.datosInteres || typeof historia.datosInteres !== 'object') {
        updateData.datosInteres = {}
      }

      // Campos de texto que pueden ser null
      if (historia.videoUrl === undefined) {
        updateData.videoUrl = null
      }

      // Solo actualizar si hay cambios
      if (Object.keys(updateData).length > 0) {
        await prisma.historiaProyecto.update({
          where: { id: historia.id },
          data: updateData
        })
        console.log(`   ✅ Actualizado ${Object.keys(updateData).length} campos`)
      } else {
        console.log(`   ⚠️  Ya estaba completo`)
      }
    }

    console.log('\n✅ ACTUALIZACIÓN COMPLETADA')

    // Verificación final
    console.log('\n🔍 VERIFICACIÓN FINAL...')
    const historiasVerificacion = await prisma.historiaProyecto.findMany()
    
    let todasCompletas = true
    historiasVerificacion.forEach(h => {
      const problemas = []
      
      if (h.leccionesAprendidas === null || h.leccionesAprendidas === undefined) {
        problemas.push('leccionesAprendidas')
      }
      if (!Array.isArray(h.equipoEspecialista)) {
        problemas.push('equipoEspecialista')
      }
      if (!Array.isArray(h.fasesEjecucion)) {
        problemas.push('fasesEjecucion')
      }
      if (!Array.isArray(h.reconocimientos)) {
        problemas.push('reconocimientos')
      }
      if (!Array.isArray(h.imagenesDesafio)) {
        problemas.push('imagenesDesafio')
      }
      if (!Array.isArray(h.imagenesSolucion)) {
        problemas.push('imagenesSolucion')
      }
      if (!Array.isArray(h.imagenesResultado)) {
        problemas.push('imagenesResultado')
      }
      if (typeof h.datosInteres !== 'object' || h.datosInteres === null) {
        problemas.push('datosInteres')
      }

      if (problemas.length > 0) {
        console.log(`❌ Historia ${h.id} tiene problemas: ${problemas.join(', ')}`)
        todasCompletas = false
      }
    })

    if (todasCompletas) {
      console.log('✅ TODAS las historias tienen el esquema completo')
    } else {
      console.log('❌ Algunas historias aún tienen problemas')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

completeHistoriasUpdate().catch(console.error)
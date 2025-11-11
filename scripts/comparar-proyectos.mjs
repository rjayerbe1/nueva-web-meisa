#!/usr/bin/env node

/**
 * Script para comparar proyectos entre dos tablas:
 * - proyectos_hoja_vida (Trayectoria)
 * - proyectos (Proyectos principales)
 */

import { PrismaClient } from '@prisma/client'
import stringSimilarity from 'string-similarity'
import fs from 'fs'

const prisma = new PrismaClient()

// Función para limpiar y normalizar texto para comparación
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^\w\s]/g, ' ') // Eliminar caracteres especiales
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim()
}

// Función para encontrar la mejor coincidencia
function findBestMatch(targetText, candidates) {
  if (!candidates || candidates.length === 0) {
    return { bestMatch: null, rating: 0 }
  }

  const normalizedTarget = normalizeText(targetText)
  const normalizedCandidates = candidates.map(c => normalizeText(c.text))

  const matches = stringSimilarity.findBestMatch(normalizedTarget, normalizedCandidates)

  return {
    bestMatch: candidates[matches.bestMatchIndex],
    rating: matches.bestMatch.rating
  }
}

async function compararProyectos() {
  console.log('🔍 Iniciando comparación de proyectos...\n')

  try {
    // 1. Obtener proyectos de Trayectoria
    console.log('📋 Consultando proyectos de Trayectoria...')
    const proyectosTrayectoria = await prisma.proyectoHojaVida.findMany({
      select: {
        id: true,
        entidadContratante: true,
        objetoContrato: true,
        fechaInicio: true,
        fechaFin: true,
        ubicacion: true,
        visible: true,
        destacado: true
      },
      orderBy: { fechaInicio: 'desc' }
    })

    // 2. Obtener proyectos principales
    console.log('📋 Consultando proyectos principales...')
    const proyectosPrincipales = await prisma.proyecto.findMany({
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        cliente: true,
        fechaInicio: true,
        fechaFin: true,
        ubicacion: true,
        categoria: true,
        visible: true,
        destacado: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`\n✅ Trayectoria: ${proyectosTrayectoria.length} proyectos`)
    console.log(`✅ Principales: ${proyectosPrincipales.length} proyectos\n`)

    // 3. Preparar datos para comparación
    const candidatesPrincipales = proyectosPrincipales.map(p => ({
      id: p.id,
      text: p.titulo,
      proyecto: p
    }))

    // 4. Comparar cada proyecto de Trayectoria con los principales
    console.log('🔄 Comparando proyectos...\n')

    const coincidencias = []
    const soloEnTrayectoria = []
    const threshold = 0.6 // Umbral de similitud (60%)

    for (const proyTray of proyectosTrayectoria) {
      const { bestMatch, rating } = findBestMatch(
        proyTray.objetoContrato,
        candidatesPrincipales
      )

      if (bestMatch && rating >= threshold) {
        coincidencias.push({
          trayectoria: {
            id: proyTray.id,
            titulo: `${proyTray.entidadContratante} - ${proyTray.objetoContrato}`,
            fechaInicio: proyTray.fechaInicio,
            ubicacion: proyTray.ubicacion
          },
          principal: {
            id: bestMatch.proyecto.id,
            titulo: bestMatch.proyecto.titulo,
            cliente: bestMatch.proyecto.cliente,
            categoria: bestMatch.proyecto.categoria,
            fechaInicio: bestMatch.proyecto.fechaInicio,
            ubicacion: bestMatch.proyecto.ubicacion
          },
          similitud: Math.round(rating * 100)
        })
      } else {
        soloEnTrayectoria.push({
          id: proyTray.id,
          titulo: `${proyTray.entidadContratante} - ${proyTray.objetoContrato}`,
          fechaInicio: proyTray.fechaInicio,
          ubicacion: proyTray.ubicacion,
          visible: proyTray.visible,
          destacado: proyTray.destacado
        })
      }
    }

    // 5. Encontrar proyectos que solo están en Principales
    const idsEncontrados = new Set(coincidencias.map(c => c.principal.id))
    const soloEnPrincipales = proyectosPrincipales
      .filter(p => !idsEncontrados.has(p.id))
      .map(p => ({
        id: p.id,
        titulo: p.titulo,
        cliente: p.cliente,
        categoria: p.categoria,
        fechaInicio: p.fechaInicio,
        ubicacion: p.ubicacion,
        visible: p.visible,
        destacado: p.destacado
      }))

    // 6. Generar reporte
    const reporte = {
      fecha: new Date().toISOString(),
      estadisticas: {
        totalTrayectoria: proyectosTrayectoria.length,
        totalPrincipales: proyectosPrincipales.length,
        coincidencias: coincidencias.length,
        soloTrayectoria: soloEnTrayectoria.length,
        soloPrincipales: soloEnPrincipales.length
      },
      coincidencias: coincidencias.sort((a, b) => b.similitud - a.similitud),
      soloEnTrayectoria: soloEnTrayectoria,
      soloEnPrincipales: soloEnPrincipales
    }

    // 7. Guardar reporte en JSON
    const reportePath = './scripts/reporte-comparacion-proyectos.json'
    fs.writeFileSync(reportePath, JSON.stringify(reporte, null, 2))

    // 8. Mostrar resumen en consola
    console.log('═══════════════════════════════════════════════════════════')
    console.log('                    RESUMEN DE COMPARACIÓN                 ')
    console.log('═══════════════════════════════════════════════════════════\n')

    console.log('📊 ESTADÍSTICAS:')
    console.log(`   Total en Trayectoria:        ${reporte.estadisticas.totalTrayectoria}`)
    console.log(`   Total en Principales:        ${reporte.estadisticas.totalPrincipales}`)
    console.log(`   ✅ Coincidencias:            ${reporte.estadisticas.coincidencias} (${Math.round(reporte.estadisticas.coincidencias / reporte.estadisticas.totalTrayectoria * 100)}%)`)
    console.log(`   📋 Solo en Trayectoria:      ${reporte.estadisticas.soloTrayectoria}`)
    console.log(`   📋 Solo en Principales:      ${reporte.estadisticas.soloPrincipales}\n`)

    // Mostrar algunas coincidencias (top 10)
    if (coincidencias.length > 0) {
      console.log('✅ TOP 10 COINCIDENCIAS (ordenadas por similitud):\n')
      coincidencias.slice(0, 10).forEach((c, i) => {
        console.log(`${i + 1}. [${c.similitud}%] ${c.trayectoria.titulo.substring(0, 60)}...`)
        console.log(`   ↔️  ${c.principal.titulo.substring(0, 60)}...\n`)
      })
    }

    // Mostrar algunos proyectos únicos de cada lado
    if (soloEnTrayectoria.length > 0) {
      console.log('\n📋 ALGUNOS PROYECTOS SOLO EN TRAYECTORIA (primeros 5):\n')
      soloEnTrayectoria.slice(0, 5).forEach((p, i) => {
        console.log(`${i + 1}. ${p.titulo.substring(0, 80)}`)
        console.log(`   📅 ${new Date(p.fechaInicio).getFullYear()} | 📍 ${p.ubicacion}`)
        console.log(`   ${p.destacado ? '⭐ Destacado' : ''} ${p.visible ? '👁️  Visible' : '🚫 Oculto'}\n`)
      })
    }

    if (soloEnPrincipales.length > 0) {
      console.log('\n📋 ALGUNOS PROYECTOS SOLO EN PRINCIPALES (primeros 5):\n')
      soloEnPrincipales.slice(0, 5).forEach((p, i) => {
        console.log(`${i + 1}. ${p.titulo}`)
        console.log(`   🏢 ${p.cliente} | 🏷️  ${p.categoria}`)
        console.log(`   📅 ${new Date(p.fechaInicio).getFullYear()} | 📍 ${p.ubicacion}`)
        console.log(`   ${p.destacado ? '⭐ Destacado' : ''} ${p.visible ? '👁️  Visible' : '🚫 Oculto'}\n`)
      })
    }

    console.log('═══════════════════════════════════════════════════════════')
    console.log(`\n✅ Reporte completo guardado en: ${reportePath}\n`)

  } catch (error) {
    console.error('❌ Error al comparar proyectos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
compararProyectos()
  .then(() => {
    console.log('✅ Comparación completada exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })

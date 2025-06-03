#!/usr/bin/env tsx

/**
 * Script de análisis SEGURO para revisar el estado actual de las historias
 * Este script NO modifica datos, solo los analiza
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function analyzeHistoriasState() {
  console.log('🔍 ANÁLISIS DEL ESTADO ACTUAL DE HISTORIAS')
  console.log('==========================================\n')

  try {
    // Obtener todas las historias existentes
    const historias = await prisma.historiaProyecto.findMany({
      include: {
        proyecto: {
          select: {
            titulo: true,
            cliente: true,
            slug: true,
            categoria: true
          }
        }
      }
    })

    console.log(`📊 Total de historias en la base de datos: ${historias.length}\n`)

    if (historias.length === 0) {
      console.log('⚠️  No hay historias en la base de datos')
      return
    }

    // Analizar campos presentes en cada historia
    console.log('📋 ANÁLISIS POR HISTORIA:')
    console.log('========================\n')

    historias.forEach((historia, index) => {
      console.log(`${index + 1}. ${historia.proyecto.titulo} (${historia.proyecto.cliente})`)
      console.log(`   ID: ${historia.id}`)
      console.log(`   Categoría: ${historia.proyecto.categoria}`)
      console.log(`   Activo: ${historia.activo}`)
      
      // Campos de contenido principales
      const camposContenido = {
        'Contexto': historia.contexto,
        'Problemas Iniciales': historia.problemasIniciales,
        'Enfoque': historia.enfoque,
        'Solución Técnica': historia.solucionTecnica,
        'Metodología': historia.metodologia,
        'Impacto Cliente': historia.impactoCliente,
        'Valor Agregado': historia.valorAgregado,
        'Lecciones Aprendidas': historia.leccionesAprendidas,
        'Testimonio Cliente': historia.testimonioCliente,
        'Testimonio Equipo': historia.testimonioEquipo
      }

      console.log('   📝 Campos de texto:')
      Object.entries(camposContenido).forEach(([campo, valor]) => {
        const status = valor ? '✅' : '❌'
        const preview = valor ? ` (${valor.length} chars)` : ''
        console.log(`      ${status} ${campo}${preview}`)
      })

      // Campos JSON/Array
      const camposArray = {
        'Desafíos': historia.desafios,
        'Innovaciones': historia.innovaciones,
        'Equipo Especialista': historia.equipoEspecialista,
        'Fases Ejecución': historia.fasesEjecucion,
        'Recursos': historia.recursos,
        'Resultados': historia.resultados,
        'Reconocimientos': historia.reconocimientos,
        'Tags Técnicos': historia.tagsTecnicos,
        'Datos Interés': historia.datosInteres,
        'Imágenes Desafío': historia.imagenesDesafio,
        'Imágenes Solución': historia.imagenesSolucion,
        'Imágenes Resultado': historia.imagenesResultado
      }

      console.log('   📋 Campos de arrays/JSON:')
      Object.entries(camposArray).forEach(([campo, valor]) => {
        let status = '❌'
        let info = ''
        
        if (valor) {
          if (Array.isArray(valor)) {
            status = valor.length > 0 ? '✅' : '⚠️'
            info = ` (${valor.length} items)`
          } else if (typeof valor === 'object') {
            const keys = Object.keys(valor)
            status = keys.length > 0 ? '✅' : '⚠️'
            info = ` (${keys.length} keys)`
          } else {
            status = '✅'
          }
        }
        
        console.log(`      ${status} ${campo}${info}`)
      })

      // Campos numéricos
      const camposNumericos = {
        'Dificultad Técnica': historia.dificultadTecnica,
        'Nivel Innovación': historia.innovacionNivel
      }

      console.log('   🔢 Campos numéricos:')
      Object.entries(camposNumericos).forEach(([campo, valor]) => {
        const status = valor !== null ? '✅' : '❌'
        const info = valor !== null ? ` (${valor}/10)` : ''
        console.log(`      ${status} ${campo}${info}`)
      })

      // Campos de assets
      const camposAssets = {
        'Imagen Destacada': historia.imagenDestacada,
        'Video URL': historia.videoUrl,
        'Título Alternativo': historia.tituloAlternativo,
        'Resumen Corto': historia.resumenCorto
      }

      console.log('   🎨 Assets y presentación:')
      Object.entries(camposAssets).forEach(([campo, valor]) => {
        const status = valor ? '✅' : '❌'
        console.log(`      ${status} ${campo}`)
      })

      console.log('') // Espacio entre historias
    })

    // Estadísticas globales
    console.log('\n📊 ESTADÍSTICAS GLOBALES:')
    console.log('=========================\n')

    const stats = {
      totalHistorias: historias.length,
      historiasActivas: historias.filter(h => h.activo).length,
      conContexto: historias.filter(h => h.contexto).length,
      conProblemasIniciales: historias.filter(h => h.problemasIniciales).length,
      conEnfoque: historias.filter(h => h.enfoque).length,
      conSolucionTecnica: historias.filter(h => h.solucionTecnica).length,
      conMetodologia: historias.filter(h => h.metodologia).length,
      conImpactoCliente: historias.filter(h => h.impactoCliente).length,
      conValorAgregado: historias.filter(h => h.valorAgregado).length,
      conLeccionesAprendidas: historias.filter(h => h.leccionesAprendidas).length,
      conTestimonioCliente: historias.filter(h => h.testimonioCliente).length,
      conTestimonioEquipo: historias.filter(h => h.testimonioEquipo).length,
      conDesafios: historias.filter(h => h.desafios && Array.isArray(h.desafios) && h.desafios.length > 0).length,
      conInnovaciones: historias.filter(h => h.innovaciones && Array.isArray(h.innovaciones) && h.innovaciones.length > 0).length,
      conEquipoEspecialista: historias.filter(h => h.equipoEspecialista && Array.isArray(h.equipoEspecialista) && h.equipoEspecialista.length > 0).length,
      conFasesEjecucion: historias.filter(h => h.fasesEjecucion && Array.isArray(h.fasesEjecucion) && h.fasesEjecucion.length > 0).length,
      conResultados: historias.filter(h => h.resultados && Array.isArray(h.resultados) && h.resultados.length > 0).length,
      conReconocimientos: historias.filter(h => h.reconocimientos && Array.isArray(h.reconocimientos) && h.reconocimientos.length > 0).length,
      conDificultadTecnica: historias.filter(h => h.dificultadTecnica !== null).length,
      conNivelInnovacion: historias.filter(h => h.innovacionNivel !== null).length,
      conImagenDestacada: historias.filter(h => h.imagenDestacada).length,
      conVideoUrl: historias.filter(h => h.videoUrl).length,
      conTituloAlternativo: historias.filter(h => h.tituloAlternativo).length,
      conResumenCorto: historias.filter(h => h.resumenCorto).length,
      conImagenesDesafio: historias.filter(h => h.imagenesDesafio && Array.isArray(h.imagenesDesafio) && h.imagenesDesafio.length > 0).length,
      conImagenesSolucion: historias.filter(h => h.imagenesSolucion && Array.isArray(h.imagenesSolucion) && h.imagenesSolucion.length > 0).length,
      conImagenesResultado: historias.filter(h => h.imagenesResultado && Array.isArray(h.imagenesResultado) && h.imagenesResultado.length > 0).length
    }

    console.log(`Total de historias: ${stats.totalHistorias}`)
    console.log(`Historias activas: ${stats.historiasActivas}`)
    console.log('')

    console.log('📝 CAMPOS DE TEXTO:')
    console.log(`   Contexto: ${stats.conContexto}/${stats.totalHistorias} (${((stats.conContexto/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Problemas Iniciales: ${stats.conProblemasIniciales}/${stats.totalHistorias} (${((stats.conProblemasIniciales/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Enfoque: ${stats.conEnfoque}/${stats.totalHistorias} (${((stats.conEnfoque/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Solución Técnica: ${stats.conSolucionTecnica}/${stats.totalHistorias} (${((stats.conSolucionTecnica/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Metodología: ${stats.conMetodologia}/${stats.totalHistorias} (${((stats.conMetodologia/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Impacto Cliente: ${stats.conImpactoCliente}/${stats.totalHistorias} (${((stats.conImpactoCliente/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Valor Agregado: ${stats.conValorAgregado}/${stats.totalHistorias} (${((stats.conValorAgregado/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Lecciones Aprendidas: ${stats.conLeccionesAprendidas}/${stats.totalHistorias} (${((stats.conLeccionesAprendidas/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log('')

    console.log('🗣️ TESTIMONIOS:')
    console.log(`   Testimonio Cliente: ${stats.conTestimonioCliente}/${stats.totalHistorias} (${((stats.conTestimonioCliente/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Testimonio Equipo: ${stats.conTestimonioEquipo}/${stats.totalHistorias} (${((stats.conTestimonioEquipo/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log('')

    console.log('📋 ARRAYS/LISTAS:')
    console.log(`   Desafíos: ${stats.conDesafios}/${stats.totalHistorias} (${((stats.conDesafios/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Innovaciones: ${stats.conInnovaciones}/${stats.totalHistorias} (${((stats.conInnovaciones/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Equipo Especialista: ${stats.conEquipoEspecialista}/${stats.totalHistorias} (${((stats.conEquipoEspecialista/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Fases Ejecución: ${stats.conFasesEjecucion}/${stats.totalHistorias} (${((stats.conFasesEjecucion/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Resultados: ${stats.conResultados}/${stats.totalHistorias} (${((stats.conResultados/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Reconocimientos: ${stats.conReconocimientos}/${stats.totalHistorias} (${((stats.conReconocimientos/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log('')

    console.log('🔢 MÉTRICAS:')
    console.log(`   Dificultad Técnica: ${stats.conDificultadTecnica}/${stats.totalHistorias} (${((stats.conDificultadTecnica/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Nivel Innovación: ${stats.conNivelInnovacion}/${stats.totalHistorias} (${((stats.conNivelInnovacion/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log('')

    console.log('🎨 ASSETS VISUALES:')
    console.log(`   Imagen Destacada: ${stats.conImagenDestacada}/${stats.totalHistorias} (${((stats.conImagenDestacada/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Video URL: ${stats.conVideoUrl}/${stats.totalHistorias} (${((stats.conVideoUrl/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Título Alternativo: ${stats.conTituloAlternativo}/${stats.totalHistorias} (${((stats.conTituloAlternativo/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Resumen Corto: ${stats.conResumenCorto}/${stats.totalHistorias} (${((stats.conResumenCorto/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log('')

    console.log('🖼️ SELECCIÓN DE IMÁGENES:')
    console.log(`   Imágenes Desafío: ${stats.conImagenesDesafio}/${stats.totalHistorias} (${((stats.conImagenesDesafio/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Imágenes Solución: ${stats.conImagenesSolucion}/${stats.totalHistorias} (${((stats.conImagenesSolucion/stats.totalHistorias)*100).toFixed(1)}%)`)
    console.log(`   Imágenes Resultado: ${stats.conImagenesResultado}/${stats.totalHistorias} (${((stats.conImagenesResultado/stats.totalHistorias)*100).toFixed(1)}%)`)

    // Identificar historias que necesitan más trabajo
    console.log('\n⚠️  HISTORIAS QUE NECESITAN ATENCIÓN:')
    console.log('===================================\n')

    const historiasIncompletas = historias.filter(h => {
      const camposImportantes = [
        h.contexto, h.enfoque, h.solucionTecnica, h.impactoCliente, h.valorAgregado
      ]
      const camposCompletos = camposImportantes.filter(Boolean).length
      return camposCompletos < 3 // Menos de 3 campos importantes completos
    })

    if (historiasIncompletas.length > 0) {
      console.log(`Encontradas ${historiasIncompletas.length} historias con contenido insuficiente:\n`)
      historiasIncompletas.forEach(h => {
        console.log(`• ${h.proyecto.titulo} (${h.proyecto.cliente})`)
        console.log(`  Estado: ${h.activo ? 'Activa' : 'Inactiva'}`)
        
        const problemas = []
        if (!h.contexto) problemas.push('Sin contexto')
        if (!h.enfoque) problemas.push('Sin enfoque')
        if (!h.solucionTecnica) problemas.push('Sin solución técnica')
        if (!h.impactoCliente) problemas.push('Sin impacto cliente')
        if (!h.valorAgregado) problemas.push('Sin valor agregado')
        
        console.log(`  Problemas: ${problemas.join(', ')}`)
        console.log('')
      })
    } else {
      console.log('✅ Todas las historias tienen contenido básico completo')
    }

  } catch (error) {
    console.error('❌ Error analizando historias:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar análisis
analyzeHistoriasState().catch(console.error)
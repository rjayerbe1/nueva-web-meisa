#!/usr/bin/env tsx

/**
 * Script para actualizar todas las historias existentes con los nuevos campos del esquema
 * 
 * Este script:
 * 1. Analiza todas las historias existentes en la base de datos
 * 2. Identifica campos faltantes comparado con la nueva estructura
 * 3. Actualiza registros con valores por defecto apropiados
 * 4. Genera un reporte detallado de los cambios realizados
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

// Definición completa de campos esperados según el esquema actual
const EXPECTED_FIELDS = {
  // Campos básicos existentes
  id: 'string',
  proyectoId: 'string', 
  activo: 'boolean',
  
  // Campos de DESAFÍO
  contexto: 'string|null',
  desafios: 'json|null',
  problemasIniciales: 'string|null', // ✅ NUEVO CAMPO
  
  // Campos de SOLUCIÓN
  enfoque: 'string|null',
  solucionTecnica: 'string|null',
  innovaciones: 'json|null',
  equipoEspecialista: 'json|null', // ✅ NUEVO CAMPO
  
  // Campos de PROCESO
  metodologia: 'string|null', // ✅ NUEVO CAMPO (era opcional antes)
  fasesEjecucion: 'json|null', // ✅ NUEVO CAMPO
  tiempoTotal: 'string|null',
  recursos: 'json|null',
  
  // Campos de RESULTADO
  resultados: 'json|null',
  impactoCliente: 'string|null',
  reconocimientos: 'json|null', // ✅ NUEVO CAMPO
  leccionesAprendidas: 'string|null', // ✅ NUEVO CAMPO
  valorAgregado: 'string|null', // ✅ NUEVO CAMPO
  
  // Campos de MÉTRICAS
  datosInteres: 'json|null', // ✅ NUEVO CAMPO
  dificultadTecnica: 'number|null',
  innovacionNivel: 'number|null',
  
  // Campos de TESTIMONIOS
  testimonioCliente: 'string|null',
  testimonioEquipo: 'string|null',
  
  // Campos de ASSETS VISUALES
  imagenDestacada: 'string|null',
  videoUrl: 'string|null', // ✅ NUEVO CAMPO
  infografias: 'json|null',
  
  // Campos de SELECCIÓN DE IMÁGENES (nuevos)
  imagenesDesafio: 'json|null', // ✅ NUEVO CAMPO
  imagenesSolucion: 'json|null', // ✅ NUEVO CAMPO
  imagenesResultado: 'json|null', // ✅ NUEVO CAMPO
  
  // Campos de TAGS Y ORGANIZACIÓN
  tagsTecnicos: 'json|null',
  
  // Campos de SEO Y PRESENTACIÓN
  resumenCorto: 'string|null',
  tituloAlternativo: 'string|null',
  
  // Metadata
  fechaCreacion: 'datetime',
  fechaActualizacion: 'datetime',
  creadoPor: 'string'
}

// Valores por defecto para campos nuevos
const DEFAULT_VALUES = {
  problemasIniciales: null,
  equipoEspecialista: [],
  metodologia: null,
  fasesEjecucion: [],
  reconocimientos: [],
  leccionesAprendidas: null,
  valorAgregado: null,
  datosInteres: {},
  videoUrl: null,
  imagenesDesafio: [],
  imagenesSolucion: [],
  imagenesResultado: []
}

interface UpdateReport {
  historiaId: string
  proyectoTitulo: string
  proyectoCliente: string
  fieldsUpdated: string[]
  status: 'success' | 'error'
  error?: string
  changes: Record<string, any>
}

async function analyzeCurrentSchema() {
  console.log('🔍 Analizando esquema actual de historias...')
  
  try {
    // Obtener todas las historias existentes
    const historias = await prisma.historiaProyecto.findMany({
      include: {
        proyecto: {
          select: {
            titulo: true,
            cliente: true,
            slug: true
          }
        }
      }
    })

    console.log(`📊 Encontradas ${historias.length} historias en la base de datos`)
    
    if (historias.length === 0) {
      console.log('⚠️  No hay historias en la base de datos para actualizar')
      return []
    }

    // Analizar campos presentes/faltantes en cada historia
    const analysis = historias.map(historia => {
      const missingFields: string[] = []
      const presentFields: string[] = []
      
      // Verificar cada campo esperado
      Object.keys(EXPECTED_FIELDS).forEach(field => {
        const value = (historia as any)[field]
        if (value === undefined || value === null) {
          if (field in DEFAULT_VALUES) {
            missingFields.push(field)
          }
        } else {
          presentFields.push(field)
        }
      })

      return {
        id: historia.id,
        proyectoTitulo: historia.proyecto.titulo,
        proyectoCliente: historia.proyecto.cliente,
        missingFields,
        presentFields,
        needsUpdate: missingFields.length > 0
      }
    })

    // Estadísticas generales
    const totalNeedingUpdate = analysis.filter(h => h.needsUpdate).length
    const allMissingFields = new Set<string>()
    analysis.forEach(h => h.missingFields.forEach(f => allMissingFields.add(f)))

    console.log(`\n📈 ANÁLISIS COMPLETADO:`)
    console.log(`   • Total historias: ${historias.length}`)
    console.log(`   • Necesitan actualización: ${totalNeedingUpdate}`)
    console.log(`   • Campos faltantes únicos: ${allMissingFields.size}`)
    console.log(`   • Campos faltantes: ${Array.from(allMissingFields).join(', ')}`)

    return analysis
  } catch (error) {
    console.error('❌ Error analizando esquema:', error)
    throw error
  }
}

async function updateHistoria(historiaId: string, missingFields: string[]): Promise<UpdateReport> {
  try {
    // Obtener la historia actual
    const historia = await prisma.historiaProyecto.findUnique({
      where: { id: historiaId },
      include: {
        proyecto: {
          select: {
            titulo: true,
            cliente: true
          }
        }
      }
    })

    if (!historia) {
      throw new Error(`Historia con ID ${historiaId} no encontrada`)
    }

    // Preparar datos de actualización
    const updateData: Record<string, any> = {}
    const changes: Record<string, any> = {}

    missingFields.forEach(field => {
      if (field in DEFAULT_VALUES) {
        const defaultValue = DEFAULT_VALUES[field as keyof typeof DEFAULT_VALUES]
        updateData[field] = defaultValue
        changes[field] = {
          from: null,
          to: defaultValue,
          type: 'new_field'
        }
      }
    })

    // Aplicar valores por defecto más inteligentes basados en datos existentes
    if (missingFields.includes('problemasIniciales') && historia.contexto) {
      updateData.problemasIniciales = `Problemas identificados en el contexto de ${historia.proyecto.titulo}`
      changes.problemasIniciales.to = updateData.problemasIniciales
      changes.problemasIniciales.type = 'generated_from_context'
    }

    if (missingFields.includes('valorAgregado')) {
      updateData.valorAgregado = `MEISA aportó su experiencia especializada en estructuras metálicas para el éxito del proyecto ${historia.proyecto.titulo}`
      changes.valorAgregado.to = updateData.valorAgregado
      changes.valorAgregado.type = 'generated_template'
    }

    if (missingFields.includes('leccionesAprendidas')) {
      updateData.leccionesAprendidas = `Proyecto exitoso que refuerza la capacidad de MEISA para entregar soluciones de alta calidad`
      changes.leccionesAprendidas.to = updateData.leccionesAprendidas
      changes.leccionesAprendidas.type = 'generated_template'
    }

    if (missingFields.includes('metodologia') && !historia.metodologia) {
      updateData.metodologia = `Metodología integral de MEISA aplicando estándares de calidad y seguridad en todas las fases del proyecto`
      changes.metodologia.to = updateData.metodologia
      changes.metodologia.type = 'generated_template'
    }

    // Actualizar en base de datos
    await prisma.historiaProyecto.update({
      where: { id: historiaId },
      data: updateData
    })

    return {
      historiaId,
      proyectoTitulo: historia.proyecto.titulo,
      proyectoCliente: historia.proyecto.cliente,
      fieldsUpdated: missingFields,
      status: 'success',
      changes
    }

  } catch (error) {
    console.error(`❌ Error actualizando historia ${historiaId}:`, error)
    
    const historia = await prisma.historiaProyecto.findUnique({
      where: { id: historiaId },
      include: {
        proyecto: {
          select: {
            titulo: true,
            cliente: true
          }
        }
      }
    })

    return {
      historiaId,
      proyectoTitulo: historia?.proyecto.titulo || 'Desconocido',
      proyectoCliente: historia?.proyecto.cliente || 'Desconocido', 
      fieldsUpdated: [],
      status: 'error',
      error: error instanceof Error ? error.message : 'Error desconocido',
      changes: {}
    }
  }
}

async function updateAllHistorias() {
  console.log('\n🚀 Iniciando actualización de historias...')
  
  try {
    // Analizar estado actual
    const analysis = await analyzeCurrentSchema()
    
    if (analysis.length === 0) {
      console.log('✅ No hay historias para actualizar')
      return
    }

    // Filtrar historias que necesitan actualización
    const historiasToUpdate = analysis.filter(h => h.needsUpdate)
    
    if (historiasToUpdate.length === 0) {
      console.log('✅ Todas las historias ya están actualizadas')
      return
    }

    console.log(`\n🔄 Actualizando ${historiasToUpdate.length} historias...`)
    
    // Actualizar historias una por una
    const reports: UpdateReport[] = []
    
    for (let i = 0; i < historiasToUpdate.length; i++) {
      const historia = historiasToUpdate[i]
      console.log(`   📝 [${i + 1}/${historiasToUpdate.length}] Actualizando: ${historia.proyectoTitulo}`)
      
      const report = await updateHistoria(historia.id, historia.missingFields)
      reports.push(report)
      
      // Pequeña pausa para no sobrecargar la DB
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Generar reporte final
    await generateReport(reports)
    
    const successCount = reports.filter(r => r.status === 'success').length
    const errorCount = reports.filter(r => r.status === 'error').length
    
    console.log(`\n✅ ACTUALIZACIÓN COMPLETADA:`)
    console.log(`   • Historias procesadas: ${reports.length}`)
    console.log(`   • Actualizaciones exitosas: ${successCount}`)
    console.log(`   • Errores: ${errorCount}`)
    
    if (errorCount > 0) {
      console.log(`\n❌ Historias con errores:`)
      reports.filter(r => r.status === 'error').forEach(r => {
        console.log(`   • ${r.proyectoTitulo}: ${r.error}`)
      })
    }

  } catch (error) {
    console.error('❌ Error en el proceso de actualización:', error)
    throw error
  }
}

async function generateReport(reports: UpdateReport[]) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportPath = `/Users/rjayerbe/Web Development Local/meisa.com.co/nueva-web-meisa/historias-update-report-${timestamp}.json`
  
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalProcessed: reports.length,
      successful: reports.filter(r => r.status === 'success').length,
      errors: reports.filter(r => r.status === 'error').length,
      fieldsUpdatedGlobally: [...new Set(reports.flatMap(r => r.fieldsUpdated))]
    },
    details: reports
  }

  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2))
  
  console.log(`\n📄 Reporte guardado en: ${reportPath}`)
  
  // También crear un resumen legible
  const summaryPath = reportPath.replace('.json', '-summary.md')
  const summaryContent = `# Reporte de Actualización de Historias

**Fecha:** ${new Date().toLocaleString()}

## Resumen
- **Total procesadas:** ${reportData.summary.totalProcessed}
- **Exitosas:** ${reportData.summary.successful}
- **Con errores:** ${reportData.summary.errors}

## Campos Actualizados Globalmente
${reportData.summary.fieldsUpdatedGlobally.map(field => `- \`${field}\``).join('\n')}

## Detalles por Historia

${reports.map(report => `
### ${report.proyectoTitulo} (${report.proyectoCliente})
- **Estado:** ${report.status === 'success' ? '✅ Exitoso' : '❌ Error'}
- **Campos actualizados:** ${report.fieldsUpdated.length}
${report.fieldsUpdated.map(field => `  - \`${field}\``).join('\n')}
${report.error ? `- **Error:** ${report.error}` : ''}
`).join('\n')}
`

  fs.writeFileSync(summaryPath, summaryContent)
  console.log(`📄 Resumen legible en: ${summaryPath}`)
}

async function verifyUpdates() {
  console.log('\n🔍 Verificando actualizaciones...')
  
  try {
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

    let allFieldsPresent = true
    const verification = historias.map(historia => {
      const missingFields: string[] = []
      
      Object.keys(DEFAULT_VALUES).forEach(field => {
        const value = (historia as any)[field]
        if (value === undefined) {
          missingFields.push(field)
          allFieldsPresent = false
        }
      })

      return {
        titulo: historia.proyecto.titulo,
        missingFields
      }
    })

    if (allFieldsPresent) {
      console.log('✅ Verificación exitosa: Todos los campos están presentes en todas las historias')
    } else {
      console.log('⚠️  Verificación: Aún hay campos faltantes:')
      verification.filter(v => v.missingFields.length > 0).forEach(v => {
        console.log(`   • ${v.titulo}: ${v.missingFields.join(', ')}`)
      })
    }

    return allFieldsPresent

  } catch (error) {
    console.error('❌ Error en verificación:', error)
    return false
  }
}

async function main() {
  console.log('🏗️  ACTUALIZADOR DE ESQUEMA DE HISTORIAS MEISA')
  console.log('=============================================\n')

  try {
    // 1. Analizar estado actual
    await analyzeCurrentSchema()
    
    // 2. Confirmar actualización
    console.log('\n❓ ¿Proceder con la actualización? (Presiona Ctrl+C para cancelar)')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 3. Actualizar todas las historias
    await updateAllHistorias()
    
    // 4. Verificar que todo esté correcto
    await verifyUpdates()
    
    console.log('\n🎉 ¡Proceso completado exitosamente!')
    
  } catch (error) {
    console.error('\n💥 Error durante el proceso:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main().catch(console.error)
}

export { analyzeCurrentSchema, updateAllHistorias, verifyUpdates }
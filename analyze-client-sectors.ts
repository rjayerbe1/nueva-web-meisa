#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Definir sectores disponibles
const SECTORES = {
  INDUSTRIAL: 'INDUSTRIAL',
  COMERCIAL: 'COMERCIAL', 
  CONSTRUCCION: 'CONSTRUCCION',
  INSTITUCIONAL: 'INSTITUCIONAL',
  GOBIERNO: 'GOBIERNO',
  ENERGIA: 'ENERGIA',
  MINERIA: 'MINERIA',
  OTRO: 'OTRO'
} as const

// Base de conocimiento para clasificar clientes por sector
const clienteSectorMap: Record<string, keyof typeof SECTORES> = {
  // COMERCIAL - Centros comerciales, retail, tiendas
  'Arkadia': 'COMERCIAL',
  'Centro Comercial Arkadia': 'COMERCIAL',
  'Centro Comercial Fontanar': 'COMERCIAL',
  'Centro Comercial Hayuelos': 'COMERCIAL',
  'Centro Comercial Portal del Quindío': 'COMERCIAL',
  'Centro Comercial Unicentro': 'COMERCIAL',
  'Centro Comercial Villa Country': 'COMERCIAL',
  'Centro Comercial Viva Tunja': 'COMERCIAL',
  'Centro Comercial Viva Villavicencio': 'COMERCIAL',
  'Cencosud': 'COMERCIAL',
  'D1 SAS': 'COMERCIAL',
  'Dollarcity': 'COMERCIAL',
  'Royal Films': 'COMERCIAL',
  'Mayagüez': 'COMERCIAL',
  
  // CONSTRUCCION - Constructoras, ingeniería civil
  'Construandes': 'CONSTRUCCION',
  'Consorcio Edificar': 'CONSTRUCCION',
  'Constructora Bolívar': 'CONSTRUCCION',
  'Constructora Colpatria': 'CONSTRUCCION',
  'Constructora Inverteq SAS': 'CONSTRUCCION',
  'Emco Ingeniería SAS': 'CONSTRUCCION',
  'Grupo Constructor Prodigyo SA': 'CONSTRUCCION',
  'Conconcreto': 'CONSTRUCCION',
  'Pavimentos Colombia SAS': 'CONSTRUCCION',
  
  // INSTITUCIONAL - Educación, salud, instituciones
  'Comfacauca': 'INSTITUCIONAL',
  'SENA': 'INSTITUCIONAL',
  'Universidad del Valle': 'INSTITUCIONAL',
  
  // INDUSTRIAL - Manufactura, producción, plantas
  'Protecnica': 'INDUSTRIAL',
  'Cargill': 'INDUSTRIAL',
  'Crystal SAS': 'INDUSTRIAL',
  'Tecnofar TQ SAS': 'INDUSTRIAL',
  'Avícola Pollo Listo SAS': 'INDUSTRIAL',
  
  // ENERGIA - Servicios públicos, energía
  'EPM': 'ENERGIA',
  'EPSA': 'ENERGIA',
  
  // GOBIERNO - Entidades públicas
  'Alcaldía de Cali': 'GOBIERNO',
  'Ministerio de Agricultura': 'GOBIERNO',
  
  // OTRO - Seguros, financiero, servicios
  'Grupo SURA': 'OTRO',
  'SURA': 'OTRO'
}

async function analyzeClientSectors() {
  console.log('🔍 ANÁLISIS DE SECTORES DE CLIENTES\n')

  try {
    // Obtener todos los clientes
    const todosClientes = await prisma.cliente.findMany({
      select: {
        id: true,
        nombre: true,
        slug: true,
        sector: true,
        descripcion: true,
        sitioWeb: true,
        activo: true
      },
      orderBy: { nombre: 'asc' }
    })

    console.log(`📋 Total de clientes: ${todosClientes.length}\n`)

    // Analizar cada cliente
    const correcciones: Array<{
      cliente: any,
      sectorActual: string,
      sectorSugerido: string,
      razon: string
    }> = []

    const estadisticasSector: Record<string, number> = {}

    for (const cliente of todosClientes) {
      // Contar por sector actual
      estadisticasSector[cliente.sector] = (estadisticasSector[cliente.sector] || 0) + 1

      // Buscar sector sugerido basado en el nombre
      let sectorSugerido: string | null = null
      let razon = ''

      // Buscar coincidencia exacta primero
      if (clienteSectorMap[cliente.nombre]) {
        sectorSugerido = clienteSectorMap[cliente.nombre]
        razon = 'Coincidencia exacta en base de conocimiento'
      } else {
        // Buscar por palabras clave en el nombre
        const nombreLower = cliente.nombre.toLowerCase()
        
        if (nombreLower.includes('centro comercial') || nombreLower.includes('mall')) {
          sectorSugerido = 'COMERCIAL'
          razon = 'Contiene "centro comercial" o "mall"'
        } else if (nombreLower.includes('constructora') || nombreLower.includes('constructor')) {
          sectorSugerido = 'CONSTRUCCION'
          razon = 'Contiene "constructora" o "constructor"'
        } else if (nombreLower.includes('universidad') || nombreLower.includes('sena')) {
          sectorSugerido = 'INSTITUCIONAL'
          razon = 'Institución educativa'
        } else if (nombreLower.includes('alcaldía') || nombreLower.includes('ministerio')) {
          sectorSugerido = 'GOBIERNO'
          razon = 'Entidad gubernamental'
        } else if (nombreLower.includes('avícola') || nombreLower.includes('industrial')) {
          sectorSugerido = 'INDUSTRIAL'
          razon = 'Empresa industrial/manufacturera'
        } else if (nombreLower.includes('ingeniería') && !nombreLower.includes('comercial')) {
          sectorSugerido = 'CONSTRUCCION'
          razon = 'Empresa de ingeniería'
        } else if (nombreLower.includes('epm') || nombreLower.includes('epsa')) {
          sectorSugerido = 'ENERGIA'
          razon = 'Empresa de servicios públicos'
        }
      }

      // Si encontramos una sugerencia diferente al sector actual
      if (sectorSugerido && sectorSugerido !== cliente.sector) {
        correcciones.push({
          cliente,
          sectorActual: cliente.sector,
          sectorSugerido,
          razon
        })
      }
    }

    // Mostrar estadísticas actuales
    console.log('📊 DISTRIBUCIÓN ACTUAL POR SECTOR:')
    Object.entries(estadisticasSector)
      .sort(([,a], [,b]) => b - a)
      .forEach(([sector, count]) => {
        console.log(`   ${sector}: ${count} clientes`)
      })

    console.log('\n')

    // Mostrar correcciones sugeridas
    if (correcciones.length > 0) {
      console.log(`🔄 CORRECCIONES SUGERIDAS (${correcciones.length}):`)
      console.log('=' .repeat(80))
      
      correcciones.forEach((correccion, index) => {
        console.log(`${index + 1}. ${correccion.cliente.nombre}`)
        console.log(`   Sector actual: ${correccion.sectorActual}`)
        console.log(`   Sector sugerido: ${correccion.sectorSugerido}`)
        console.log(`   Razón: ${correccion.razon}`)
        if (correccion.cliente.descripcion) {
          console.log(`   Descripción: ${correccion.cliente.descripcion}`)
        }
        if (correccion.cliente.sitioWeb) {
          console.log(`   Web: ${correccion.cliente.sitioWeb}`)
        }
        console.log('')
      })

      // Preguntar si aplicar correcciones
      console.log('🔧 ¿APLICAR CORRECCIONES AUTOMÁTICAMENTE?')
      console.log('   Ejecuta: npx tsx apply-sector-corrections.ts')
      
    } else {
      console.log('✅ Todos los clientes están en el sector correcto!')
    }

    // Mostrar estadísticas proyectadas después de correcciones
    if (correcciones.length > 0) {
      const estadisticasProyectadas = { ...estadisticasSector }
      
      correcciones.forEach(correccion => {
        estadisticasProyectadas[correccion.sectorActual]--
        estadisticasProyectadas[correccion.sectorSugerido] = 
          (estadisticasProyectadas[correccion.sectorSugerido] || 0) + 1
      })

      console.log('\n📈 DISTRIBUCIÓN DESPUÉS DE CORRECCIONES:')
      Object.entries(estadisticasProyectadas)
        .sort(([,a], [,b]) => b - a)
        .forEach(([sector, count]) => {
          const cambio = count - (estadisticasSector[sector] || 0)
          const indicador = cambio > 0 ? `(+${cambio})` : cambio < 0 ? `(${cambio})` : ''
          console.log(`   ${sector}: ${count} clientes ${indicador}`)
        })
    }

  } catch (error) {
    console.error('❌ Error durante el análisis:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
analyzeClientSectors().catch(console.error)
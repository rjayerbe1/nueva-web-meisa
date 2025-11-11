/**
 * Script para generar resúmenes de años
 *
 * USO:
 * - Los títulos DEBEN estar en el archivo titulos-anos-propuestos.json
 * - Las descripciones DEBEN estar en el archivo descripciones-anos-propuestas.json
 * - Para editar: modifica estos archivos JSON o usa el admin en /admin/trayectoria/resumenes
 * - IMPORTANTE: Este script SOLO usa títulos y descripciones propuestos manualmente
 * - Si un año no tiene título o descripción propuesta, se SALTA ese año
 *
 * NO GENERA AUTOMÁTICAMENTE - Todos los resúmenes deben estar pre-escritos
 * en los archivos JSON basándose en los proyectos reales de cada año.
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

// Cargar títulos propuestos manualmente por Claude Code
// Para modificarlos: edita el archivo titulos-anos-propuestos.json
const titulosPropuestos = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'titulos-anos-propuestos.json'), 'utf-8')
)

// Cargar descripciones propuestas manualmente por Claude Code
// Para modificarlas: edita el archivo descripciones-anos-propuestas.json
const descripcionesPropuestas = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'descripciones-anos-propuestas.json'), 'utf-8')
)

// Palabras clave para detectar categorías de proyectos
const CATEGORIAS_KEYWORDS = {
  'Puentes': ['puente', 'viaducto', 'paso elevado', 'paso peatonal', 'vehicular', 'ponton'],
  'Plantas Industriales': ['planta', 'bodega', 'galpón', 'almacén', 'industrial', 'fabrica', 'manufactura', 'producción'],
  'Edificios': ['edificio', 'torre', 'oficinas', 'sede', 'corporativo'],
  'Centros Comerciales': ['centro comercial', 'mall', 'plaza comercial', 'comercial'],
  'Cubiertas y Fachadas': ['cubierta', 'fachada', 'techo', 'cerramiento', 'recubrimiento'],
  'Escenarios Deportivos': ['estadio', 'coliseo', 'escenario deportivo', 'cancha', 'polideportivo'],
  'Estructuras Metálicas': ['estructura metálica', 'metalica', 'acero', 'porteria', 'pórtico'],
  'Torres y Telecomunicaciones': ['torre', 'antena', 'telecomunicaciones'],
  'Infraestructura Vial': ['vial', 'via', 'carretera', 'peaje', 'transporte'],
  'Educación y Cultura': ['colegio', 'escuela', 'universidad', 'biblioteca', 'cultural']
}

// Detectar todas las categorías que aplican a un proyecto
function detectarCategorias(objetoContrato) {
  const texto = objetoContrato.toLowerCase()
  const categoriasEncontradas = []

  for (const [categoria, keywords] of Object.entries(CATEGORIAS_KEYWORDS)) {
    for (const keyword of keywords) {
      if (texto.includes(keyword)) {
        if (!categoriasEncontradas.includes(categoria)) {
          categoriasEncontradas.push(categoria)
        }
        break
      }
    }
  }

  return categoriasEncontradas.length > 0 ? categoriasEncontradas : ['Estructuras Metálicas']
}

async function generarResumenes() {
  console.log('🚀 Generando resúmenes automáticos de años...\n')

  try {
    // 1. Obtener todos los proyectos
    const proyectos = await prisma.proyectoHojaVida.findMany({
      where: { visible: true },
      orderBy: { fechaInicio: 'asc' }
    })

    console.log(`📊 Total proyectos encontrados: ${proyectos.length}\n`)

    // 2. Distribuir proyectos proporcionalmente por los años que abarca
    // Si un proyecto dura varios años, aparece en cada año con toneladas proporcionales
    const proyectosPorAnio = {}

    proyectos.forEach(proyecto => {
      const fechaInicio = new Date(proyecto.fechaInicio)
      const fechaFin = new Date(proyecto.fechaFin)
      const yearInicio = fechaInicio.getFullYear()
      const yearFin = fechaFin.getFullYear()

      // Si el proyecto está en un solo año, asignar completo
      if (yearInicio === yearFin) {
        if (!proyectosPorAnio[yearFin]) {
          proyectosPorAnio[yearFin] = []
        }
        proyectosPorAnio[yearFin].push({
          ...proyecto,
          pesoKgProporcional: proyecto.pesoKg,
          areaM2Proporcional: proyecto.areaM2,
          mesesEnEsteAnio: (fechaFin.getMonth() - fechaInicio.getMonth()) + 1
        })
      } else {
        // Proyecto multi-año: distribuir proporcionalmente
        // Calcular meses totales del proyecto
        const mesesTotales = (yearFin - yearInicio) * 12 + (fechaFin.getMonth() - fechaInicio.getMonth()) + 1

        // Distribuir en cada año que abarca
        for (let year = yearInicio; year <= yearFin; year++) {
          let mesesEnEsteAnio = 0

          if (year === yearInicio) {
            // Primer año: desde mes de inicio hasta diciembre
            mesesEnEsteAnio = 12 - fechaInicio.getMonth()
          } else if (year === yearFin) {
            // Último año: desde enero hasta mes de fin
            mesesEnEsteAnio = fechaFin.getMonth() + 1
          } else {
            // Años intermedios: 12 meses completos
            mesesEnEsteAnio = 12
          }

          const proporcion = mesesEnEsteAnio / mesesTotales

          if (!proyectosPorAnio[year]) {
            proyectosPorAnio[year] = []
          }

          proyectosPorAnio[year].push({
            ...proyecto,
            pesoKgProporcional: proyecto.pesoKg ? proyecto.pesoKg * proporcion : null,
            areaM2Proporcional: proyecto.areaM2 ? proyecto.areaM2 * proporcion : null,
            mesesEnEsteAnio,
            esMultiAnio: true,
            añoInicio: yearInicio,
            añoFin: yearFin
          })
        }
      }
    })

    // 3. Generar resumen para cada año
    for (const [anio, proyectosAnio] of Object.entries(proyectosPorAnio)) {
      console.log(`📅 Procesando año ${anio} (${proyectosAnio.length} proyectos)...`)

      // Análisis profundo de categorías
      const conteoCateg = {}
      proyectosAnio.forEach(p => {
        const cats = detectarCategorias(p.objetoContrato)
        cats.forEach(cat => {
          conteoCateg[cat] = (conteoCateg[cat] || 0) + 1
        })
      })

      // Categorías ordenadas con detalles
      const categoriasArray = Object.entries(conteoCateg)
        .sort((a, b) => b[1] - a[1])
        .map(([nombre, count]) => ({ nombre, count }))

      // Categorías para almacenar (formato anterior para compatibilidad)
      const categoriasParaDB = categoriasArray.map(c => `${c.nombre}: ${c.count}`)

      // Análisis de ubicaciones únicas
      const ubicacionesSet = new Set()
      proyectosAnio.forEach(p => {
        if (p.ubicacion && p.ubicacion.trim()) {
          ubicacionesSet.add(p.ubicacion.trim())
        }
      })
      const ubicaciones = Array.from(ubicacionesSet)

      // Análisis de clientes
      const conteoClientes = {}
      proyectosAnio.forEach(p => {
        const cliente = p.entidadContratante?.trim()
        if (cliente) {
          conteoClientes[cliente] = (conteoClientes[cliente] || 0) + 1
        }
      })

      const clientesPorFrecuencia = Object.entries(conteoClientes)
        .sort((a, b) => b[1] - a[1])

      const clienteAnalisis = {
        total: Object.keys(conteoClientes).length,
        principal: clientesPorFrecuencia[0] ? {
          nombre: clientesPorFrecuencia[0][0],
          count: clientesPorFrecuencia[0][1]
        } : null
      }

      // Proyectos destacados (por peso)
      const proyectosDestacados = proyectosAnio
        .filter(p => p.pesoKg && Number(p.pesoKg) > 0)
        .sort((a, b) => Number(b.pesoKg) - Number(a.pesoKg))
        .slice(0, 3)

      // Calcular estadísticas usando valores proporcionales
      const toneladas = proyectosAnio.reduce((sum, p) =>
        sum + (p.pesoKgProporcional ? Number(p.pesoKgProporcional) / 1000 : 0), 0
      )
      const m2 = proyectosAnio.reduce((sum, p) =>
        sum + (p.areaM2Proporcional ? Number(p.areaM2Proporcional) : 0), 0
      )

      // Contar proyectos únicos (un proyecto multi-año se cuenta solo una vez)
      const proyectosUnicos = new Set(proyectosAnio.map(p => p.id)).size

      const estadisticas = {
        proyectos: proyectosUnicos,
        toneladas: Math.round(toneladas),
        m2: Math.round(m2)
      }

      // Seleccionar fotos destacadas (hasta 4) - priorizar proyectos grandes
      const imagenesFeatured = []

      // Primero intentar proyectos grandes con imágenes
      const proyectosGrandesConImagenes = proyectosDestacados
        .filter(p => p.imagenes && Array.isArray(p.imagenes) && p.imagenes.length > 0)

      proyectosGrandesConImagenes.forEach(p => {
        if (imagenesFeatured.length < 4 && p.imagenes[0]) {
          imagenesFeatured.push(p.imagenes[0])
        }
      })

      // Si no hay suficientes, agregar de proyectos destacados
      if (imagenesFeatured.length < 4) {
        const proyectosConImagenes = proyectosAnio
          .filter(p => p.destacado && p.imagenes && Array.isArray(p.imagenes) && p.imagenes.length > 0)

        proyectosConImagenes.forEach(p => {
          if (imagenesFeatured.length < 4 && p.imagenes[0] && !imagenesFeatured.includes(p.imagenes[0])) {
            imagenesFeatured.push(p.imagenes[0])
          }
        })
      }

      // Preparar análisis para generación de texto
      const analisis = {
        categorias: categoriasArray,
        stats: estadisticas,
        ubicaciones,
        clientes: clienteAnalisis,
        proyectosDestacados
      }

      // SIEMPRE usar título propuesto manualmente - NUNCA generar automáticamente
      if (!titulosPropuestos[anio]) {
        console.warn(`  ⚠️  ADVERTENCIA: No hay título propuesto para ${anio} en titulos-anos-propuestos.json`)
        continue // Saltar este año si no tiene título propuesto
      }
      const titulo = `${anio}: ${titulosPropuestos[anio]}`

      // SIEMPRE usar descripción propuesta manualmente - NUNCA generar automáticamente
      if (!descripcionesPropuestas[anio]) {
        console.warn(`  ⚠️  ADVERTENCIA: No hay descripción propuesta para ${anio} en descripciones-anos-propuestas.json`)
        continue // Saltar este año si no tiene descripción propuesta
      }
      const descripcion = descripcionesPropuestas[anio]

      // Crear o actualizar resumen
      await prisma.resumenAnio.upsert({
        where: { anio: parseInt(anio) },
        update: {
          titulo,
          descripcion,
          categorias: categoriasParaDB,
          imagenesFeatured: imagenesFeatured.length > 0 ? imagenesFeatured : null,
          estadisticas,
          visible: true
        },
        create: {
          anio: parseInt(anio),
          titulo,
          descripcion,
          categorias: categoriasParaDB,
          imagenesFeatured: imagenesFeatured.length > 0 ? imagenesFeatured : null,
          estadisticas,
          visible: true
        }
      })

      console.log(`  ✅ ${titulo}`)
      console.log(`     ${descripcion.substring(0, 80)}...`)
      console.log(`     Categorías: ${categoriasParaDB.slice(0, 2).join(', ')}`)
      console.log(`     Ubicaciones: ${ubicaciones.slice(0, 3).join(', ')}${ubicaciones.length > 3 ? '...' : ''}`)
      console.log(`     Estadísticas: ${estadisticas.proyectos} proyectos, ${estadisticas.toneladas} ton`)
      console.log(`     Fotos: ${imagenesFeatured.length} imágenes destacadas\n`)
    }

    console.log('✨ Resúmenes generados exitosamente!')

  } catch (error) {
    console.error('❌ Error generando resúmenes:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
generarResumenes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

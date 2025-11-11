/**
 * Script de reporte detallado por año
 *
 * Este script genera un reporte completo de cada año mostrando:
 * - Todos los proyectos (incluyendo multi-año)
 * - Detalles de cada proyecto
 * - Clientes principales
 * - Ubicaciones
 * - Tipos de proyecto
 *
 * USA ESTE REPORTE para escribir manualmente títulos y descripciones
 * mejores en los archivos:
 * - titulos-anos-propuestos.json
 * - descripciones-anos-propuestas.json
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function generarReporte() {
  console.log('📊 REPORTE DETALLADO POR AÑO\n')
  console.log('Usa este reporte para escribir mejores títulos y descripciones\n')
  console.log('='.repeat(100))

  try {
    const proyectos = await prisma.proyectoHojaVida.findMany({
      where: { visible: true },
      orderBy: { fechaInicio: 'asc' }
    })

    // Agrupar proyectos por año (distribución proporcional para multi-año)
    const proyectosPorAnio = {}

    proyectos.forEach(proyecto => {
      const fechaInicio = new Date(proyecto.fechaInicio)
      const fechaFin = new Date(proyecto.fechaFin)
      const yearInicio = fechaInicio.getFullYear()
      const yearFin = fechaFin.getFullYear()

      if (yearInicio === yearFin) {
        if (!proyectosPorAnio[yearFin]) proyectosPorAnio[yearFin] = []
        proyectosPorAnio[yearFin].push({
          ...proyecto,
          esMultiAnio: false
        })
      } else {
        // Multi-año: agregar a todos los años que abarca
        for (let year = yearInicio; year <= yearFin; year++) {
          if (!proyectosPorAnio[year]) proyectosPorAnio[year] = []
          proyectosPorAnio[year].push({
            ...proyecto,
            esMultiAnio: true,
            yearInicio,
            yearFin
          })
        }
      }
    })

    // Generar reporte para cada año
    const años = Object.keys(proyectosPorAnio).sort((a, b) => Number(a) - Number(b))

    for (const año of años) {
      const proyectosAño = proyectosPorAnio[año]
      const proyectosUnicos = new Set(proyectosAño.map(p => p.id)).size

      console.log(`\n\n${'█'.repeat(100)}`)
      console.log(`AÑO ${año}`)
      console.log(`${'█'.repeat(100)}`)
      console.log(`Total proyectos únicos: ${proyectosUnicos}`)
      console.log(`Total apariciones (con multi-año): ${proyectosAño.length}`)

      // Separar proyectos por categoría
      const soloEsteAño = proyectosAño.filter(p => !p.esMultiAnio)
      const multiAnioInician = proyectosAño.filter(p => p.esMultiAnio && p.yearInicio === Number(año))
      const multiAnioContinuan = proyectosAño.filter(p => p.esMultiAnio && p.yearInicio < Number(año) && p.yearFin > Number(año))
      const multiAnioTerminan = proyectosAño.filter(p => p.esMultiAnio && p.yearFin === Number(año) && p.yearInicio < Number(año))

      // PROYECTOS QUE SOLO ESTÁN EN ESTE AÑO
      if (soloEsteAño.length > 0) {
        console.log(`\n${'─'.repeat(100)}`)
        console.log(`📍 PROYECTOS SOLO DE ${año} (${soloEsteAño.length} proyectos)`)
        console.log(`${'─'.repeat(100)}`)

        soloEsteAño.forEach((p, i) => {
          const inicio = new Date(p.fechaInicio).toISOString().split('T')[0]
          const fin = new Date(p.fechaFin).toISOString().split('T')[0]

          console.log(`\n${i + 1}. ${p.entidadContratante}`)
          console.log(`   ${p.objetoContrato}`)
          console.log(`   📅 ${inicio} a ${fin}`)
          if (p.ubicacion) console.log(`   📍 ${p.ubicacion}`)
          if (p.pesoKg) console.log(`   ⚖️  ${Math.round(p.pesoKg / 1000)} toneladas`)
          if (p.areaM2) console.log(`   📐 ${Math.round(p.areaM2).toLocaleString()} m²`)
        })
      }

      // PROYECTOS MULTI-AÑO QUE INICIAN ESTE AÑO
      if (multiAnioInician.length > 0) {
        console.log(`\n${'─'.repeat(100)}`)
        console.log(`🚀 PROYECTOS MULTI-AÑO QUE INICIAN EN ${año} (${multiAnioInician.length} proyectos)`)
        console.log(`${'─'.repeat(100)}`)

        multiAnioInician.forEach((p, i) => {
          const inicio = new Date(p.fechaInicio).toISOString().split('T')[0]
          const fin = new Date(p.fechaFin).toISOString().split('T')[0]

          console.log(`\n${i + 1}. ${p.entidadContratante}`)
          console.log(`   ${p.objetoContrato}`)
          console.log(`   📅 ${inicio} a ${fin} (hasta ${p.yearFin})`)
          if (p.ubicacion) console.log(`   📍 ${p.ubicacion}`)
          if (p.pesoKg) console.log(`   ⚖️  ${Math.round(p.pesoKg / 1000)} toneladas TOTAL`)
          if (p.areaM2) console.log(`   📐 ${Math.round(p.areaM2).toLocaleString()} m²`)
        })
      }

      // PROYECTOS MULTI-AÑO QUE CONTINÚAN
      if (multiAnioContinuan.length > 0) {
        console.log(`\n${'─'.repeat(100)}`)
        console.log(`🔄 PROYECTOS EN CURSO DURANTE ${año} (${multiAnioContinuan.length} proyectos)`)
        console.log(`   (Iniciados en años anteriores, continúan en ${año})`)
        console.log(`${'─'.repeat(100)}`)

        multiAnioContinuan.forEach((p, i) => {
          const inicio = new Date(p.fechaInicio).toISOString().split('T')[0]
          const fin = new Date(p.fechaFin).toISOString().split('T')[0]

          console.log(`\n${i + 1}. ${p.entidadContratante}`)
          console.log(`   ${p.objetoContrato}`)
          console.log(`   📅 ${inicio} (desde ${p.yearInicio}) a ${fin} (hasta ${p.yearFin})`)
          if (p.ubicacion) console.log(`   📍 ${p.ubicacion}`)
          if (p.pesoKg) console.log(`   ⚖️  ${Math.round(p.pesoKg / 1000)} toneladas TOTAL`)
        })
      }

      // PROYECTOS MULTI-AÑO QUE TERMINAN ESTE AÑO
      if (multiAnioTerminan.length > 0) {
        console.log(`\n${'─'.repeat(100)}`)
        console.log(`🏁 PROYECTOS QUE TERMINAN EN ${año} (${multiAnioTerminan.length} proyectos)`)
        console.log(`   (Iniciados en años anteriores)`)
        console.log(`${'─'.repeat(100)}`)

        multiAnioTerminan.forEach((p, i) => {
          const inicio = new Date(p.fechaInicio).toISOString().split('T')[0]
          const fin = new Date(p.fechaFin).toISOString().split('T')[0]

          console.log(`\n${i + 1}. ${p.entidadContratante}`)
          console.log(`   ${p.objetoContrato}`)
          console.log(`   📅 ${inicio} (desde ${p.yearInicio}) a ${fin}`)
          if (p.ubicacion) console.log(`   📍 ${p.ubicacion}`)
          if (p.pesoKg) console.log(`   ⚖️  ${Math.round(p.pesoKg / 1000)} toneladas TOTAL`)
        })
      }

      // RESUMEN DEL AÑO
      console.log(`\n${'═'.repeat(100)}`)
      console.log(`📊 RESUMEN ${año}`)
      console.log(`${'═'.repeat(100)}`)

      // Clientes principales
      const clientes = {}
      proyectosAño.forEach(p => {
        const cliente = p.entidadContratante
        clientes[cliente] = (clientes[cliente] || 0) + 1
      })
      const topClientes = Object.entries(clientes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      console.log(`\n🏢 PRINCIPALES CLIENTES:`)
      topClientes.forEach(([cliente, count]) => {
        console.log(`   • ${cliente} (${count} ${count === 1 ? 'proyecto' : 'proyectos'})`)
      })

      // Ubicaciones principales
      const ubicaciones = {}
      proyectosAño.forEach(p => {
        if (p.ubicacion) {
          ubicaciones[p.ubicacion] = (ubicaciones[p.ubicacion] || 0) + 1
        }
      })
      const topUbicaciones = Object.entries(ubicaciones)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      console.log(`\n📍 UBICACIONES PRINCIPALES:`)
      topUbicaciones.forEach(([ubicacion, count]) => {
        console.log(`   • ${ubicacion} (${count} ${count === 1 ? 'proyecto' : 'proyectos'})`)
      })

      // Tipos de proyecto
      const tipos = {}
      proyectosAño.forEach(p => {
        const tipo = identificarTipo(p.objetoContrato)
        tipos[tipo] = (tipos[tipo] || 0) + 1
      })
      const topTipos = Object.entries(tipos)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      console.log(`\n🏗️  TIPOS DE PROYECTO:`)
      topTipos.forEach(([tipo, count]) => {
        console.log(`   • ${tipo} (${count} ${count === 1 ? 'proyecto' : 'proyectos'})`)
      })

      console.log(`\n${'═'.repeat(100)}`)
      console.log(`✍️  SUGERENCIA: Usa esta información para escribir un título y descripción`)
      console.log(`   más específicos para el año ${año} en:`)
      console.log(`   - scripts/titulos-anos-propuestos.json`)
      console.log(`   - scripts/descripciones-anos-propuestas.json`)
    }

    console.log(`\n\n${'█'.repeat(100)}`)
    console.log(`FIN DEL REPORTE`)
    console.log(`${'█'.repeat(100)}`)
    console.log(`\nAhora edita los archivos JSON con mejores títulos y descripciones.`)
    console.log(`Luego ejecuta: node scripts/generar-resumenes-anio.mjs`)

  } catch (error) {
    console.error('❌ Error generando reporte:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

function identificarTipo(objetoContrato) {
  const texto = objetoContrato.toLowerCase()

  if (texto.includes('puente') || texto.includes('viaducto') || texto.includes('peatonal')) return 'Puentes'
  if (texto.includes('bodega') || texto.includes('almacen') || texto.includes('galpón')) return 'Bodegas'
  if (texto.includes('planta') || texto.includes('fabrica')) return 'Plantas Industriales'
  if (texto.includes('edificio') || texto.includes('torre') || texto.includes('mezzanine')) return 'Edificios'
  if (texto.includes('cubierta') || texto.includes('techo')) return 'Cubiertas'
  if (texto.includes('centro comercial') || texto.includes('mall') || texto.includes('comercial')) return 'Centros Comerciales'
  if (texto.includes('coliseo') || texto.includes('estadio') || texto.includes('escenario')) return 'Escenarios Deportivos'
  if (texto.includes('transmilenio') || texto.includes('estación') || texto.includes('estacion')) return 'Infraestructura de Transporte'
  if (texto.includes('porteria') || texto.includes('porton') || texto.includes('portón')) return 'Porterías'
  if (texto.includes('fachada') || texto.includes('cerramiento')) return 'Fachadas y Cerramientos'

  return 'Estructuras Metálicas'
}

// Ejecutar
generarReporte()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

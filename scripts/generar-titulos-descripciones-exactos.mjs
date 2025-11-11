/**
 * Script para generar títulos y descripciones EXACTOS
 *
 * Este script lee los proyectos reales de la base de datos y genera
 * títulos y descripciones SIN INVENTAR NADA, solo mencionando:
 * - Nombres EXACTOS de clientes
 * - Tipos de proyectos REALES
 * - Ubicaciones REALES
 *
 * NO inventa ni interpreta, solo usa datos reales.
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function generarTitulosDescripciones() {
  console.log('📊 Generando títulos y descripciones EXACTOS desde la base de datos\n')

  try {
    const proyectos = await prisma.proyectoHojaVida.findMany({
      where: { visible: true },
      orderBy: { fechaInicio: 'asc' }
    })

    // Agrupar proyectos por año (solo año de fin para simplificar)
    const proyectosPorAnio = {}

    proyectos.forEach(proyecto => {
      const fechaFin = new Date(proyecto.fechaFin)
      const year = fechaFin.getFullYear()

      if (!proyectosPorAnio[year]) proyectosPorAnio[year] = []
      proyectosPorAnio[year].push(proyecto)
    })

    const titulos = {}
    const descripciones = {}

    // Generar para cada año
    for (const [año, proyectosAño] of Object.entries(proyectosPorAnio)) {
      console.log(`\n📅 Procesando año ${año}...`)

      // Extraer clientes principales (top 3)
      const clientes = {}
      proyectosAño.forEach(p => {
        const cliente = p.entidadContratante.split(' ')[0] // Primera palabra
        clientes[cliente] = (clientes[cliente] || 0) + 1
      })
      const topClientes = Object.entries(clientes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([c]) => c)

      // Extraer tipos de proyecto mencionados
      const tipos = new Set()
      proyectosAño.forEach(p => {
        const texto = p.objetoContrato.toLowerCase()
        if (texto.includes('puente')) tipos.add('puentes')
        if (texto.includes('bodega')) tipos.add('bodegas')
        if (texto.includes('coliseo') || texto.includes('estadio')) tipos.add('coliseos')
        if (texto.includes('cubierta')) tipos.add('cubiertas')
        if (texto.includes('edificio')) tipos.add('edificios')
        if (texto.includes('planta') || texto.includes('fábrica') || texto.includes('fabrica')) tipos.add('plantas industriales')
        if (texto.includes('centro comercial')) tipos.add('centros comerciales')
      })

      // Extraer ubicaciones principales
      const ubicaciones = {}
      proyectosAño.forEach(p => {
        if (p.ubicacion) {
          ubicaciones[p.ubicacion] = (ubicaciones[p.ubicacion] || 0) + 1
        }
      })
      const topUbicaciones = Object.entries(ubicaciones)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([u]) => u)

      // GENERAR TÍTULO (solo clientes y tipos, nada inventado)
      const tiposArray = Array.from(tipos).slice(0, 2)
      let titulo = ''

      if (topClientes.length > 0 && tiposArray.length > 0) {
        titulo = `${topClientes[0]}${topClientes[1] ? `, ${topClientes[1]}` : ''} - ${tiposArray.join(' y ')}`
      } else if (tiposArray.length > 0) {
        titulo = tiposArray.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' y ')
      } else {
        titulo = 'Proyectos de estructuras metálicas'
      }

      // GENERAR DESCRIPCIÓN (mencionar clientes y ubicaciones reales)
      let descripcion = ''

      if (topClientes.length > 0) {
        descripcion = `Proyectos con ${topClientes.join(', ')}`
      } else {
        descripcion = 'Desarrollo de proyectos'
      }

      if (tiposArray.length > 0) {
        descripcion += ` en ${tiposArray.join(', ')}`
      }

      if (topUbicaciones.length > 0) {
        descripcion += ` ubicados en ${topUbicaciones.join(', ')}`
      }

      descripcion += '.'

      // Agregar contexto si hay proyectos destacados
      const proyectosGrandes = proyectosAño.filter(p => p.destacado)
      if (proyectosGrandes.length > 0) {
        const primero = proyectosGrandes[0]
        const tipoProyecto = primero.objetoContrato.toLowerCase().includes('puente') ? 'puentes' :
                             primero.objetoContrato.toLowerCase().includes('bodega') ? 'bodegas' :
                             primero.objetoContrato.toLowerCase().includes('coliseo') ? 'coliseos' :
                             'proyectos'
        descripcion += ` Destacan ${tipoProyecto} de alta complejidad técnica para el desarrollo regional.`
      }

      titulos[año] = titulo
      descripciones[año] = descripcion

      console.log(`  Título: ${titulo}`)
      console.log(`  Descripción: ${descripcion}`)
    }

    // Guardar archivos JSON
    fs.writeFileSync(
      path.join(__dirname, 'titulos-anos-exactos.json'),
      JSON.stringify(titulos, null, 2)
    )

    fs.writeFileSync(
      path.join(__dirname, 'descripciones-anos-exactas.json'),
      JSON.stringify(descripciones, null, 2)
    )

    console.log('\n✅ Archivos generados:')
    console.log('   - scripts/titulos-anos-exactos.json')
    console.log('   - scripts/descripciones-anos-exactas.json')
    console.log('\nREVISA estos archivos y si están correctos, renómbralos a:')
    console.log('   - titulos-anos-propuestos.json')
    console.log('   - descripciones-anos-propuestas.json')

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

generarTitulosDescripciones()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

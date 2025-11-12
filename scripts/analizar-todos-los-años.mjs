#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

// Analizar proyectos por año
async function analizarAño(año) {
  // Obtener todos los proyectos que tocan este año (incluyendo multi-año)
  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      AND: [
        { fechaInicio: { lt: new Date(`${año + 1}-01-01`) } },
        { fechaFin: { gte: new Date(`${año}-01-01`) } }
      ]
    },
    orderBy: [
      { destacado: 'desc' },
      { fechaInicio: 'asc' }
    ]
  })

  if (proyectos.length === 0) return null

  // Análisis de clientes principales
  const clientesCount = {}
  proyectos.forEach(p => {
    clientesCount[p.entidadContratante] = (clientesCount[p.entidadContratante] || 0) + 1
  })

  // Ordenar clientes por cantidad de proyectos
  const topClientes = Object.entries(clientesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cliente, count]) => ({ cliente, count }))

  // Identificar proyectos destacados o de gran escala
  const proyectosGrandes = proyectos
    .filter(p => {
      const peso = p.pesoKg ? Number(p.pesoKg) : 0
      const area = p.areaM2 ? Number(p.areaM2) : 0
      return peso > 100000 || area > 1000 // más de 100 ton o 1000 m²
    })
    .slice(0, 3)

  // Análisis de ubicaciones
  const ubicaciones = [...new Set(proyectos.map(p => p.ubicacion))]

  // Clasificar por tipo de proyecto
  const tipos = {
    puentes: 0,
    edificios: 0,
    industrial: 0,
    comercial: 0,
    deportivo: 0,
    transporte: 0,
    cubiertas: 0
  }

  proyectos.forEach(p => {
    const texto = `${p.objetoContrato} ${p.entidadContratante}`.toLowerCase()
    if (texto.includes('puente') || texto.includes('viaducto')) tipos.puentes++
    if (texto.includes('edificio') || texto.includes('torre')) tipos.edificios++
    if (texto.includes('bodega') || texto.includes('planta') || texto.includes('industrial')) tipos.industrial++
    if (texto.includes('centro comercial') || texto.includes('retail') || texto.includes('dollar')) tipos.comercial++
    if (texto.includes('coliseo') || texto.includes('deportivo') || texto.includes('piscina')) tipos.deportivo++
    if (texto.includes('estacion') || texto.includes('transmilenio') || texto.includes('ciclopuente')) tipos.transporte++
    if (texto.includes('cubierta') || texto.includes('fachada')) tipos.cubiertas++
  })

  return {
    año,
    totalProyectos: proyectos.length,
    topClientes,
    proyectosGrandes,
    ubicaciones,
    tipos,
    proyectos: proyectos.slice(0, 5) // Solo primeros 5 para análisis
  }
}

// Generar título siguiendo el patrón
function generarTitulo(analisis) {
  const { año, topClientes, proyectosGrandes } = analisis

  // Usar los 2 clientes principales
  const clientesPrincipales = topClientes.slice(0, 2).map(c => c.cliente)

  // Identificar el proyecto más relevante
  let proyectoDestacado = ''
  if (proyectosGrandes.length > 0) {
    const p = proyectosGrandes[0]
    if (p.tituloDisplay) {
      proyectoDestacado = p.tituloDisplay.split(' - ')[1] || p.tituloDisplay
    } else {
      const texto = p.objetoContrato
      if (texto.includes('Centro Comercial')) proyectoDestacado = 'Centros Comerciales'
      else if (texto.includes('Puente')) proyectoDestacado = 'Puentes'
      else if (texto.includes('Coliseo')) proyectoDestacado = 'Coliseos'
      else proyectoDestacado = 'Proyectos Industriales'
    }
  }

  // Construir título
  let titulo = `${año}: ${clientesPrincipales.join(' y ')}`
  if (proyectoDestacado) {
    titulo += ` - ${proyectoDestacado}`
  }

  return titulo
}

// Generar descripción
function generarDescripcion(analisis) {
  const { topClientes, proyectosGrandes, ubicaciones, tipos } = analisis

  let desc = 'Año '

  // Describir proyectos principales
  if (proyectosGrandes.length > 0) {
    const p1 = proyectosGrandes[0]
    const clienteP1 = p1.entidadContratante
    const tituloP1 = p1.tituloDisplay || p1.objetoContrato.substring(0, 50)
    desc += `de ${tituloP1.toLowerCase()} con ${clienteP1}`
  } else {
    desc += `con ${topClientes[0].count} proyectos para ${topClientes[0].cliente}`
  }

  // Agregar más clientes importantes
  if (topClientes.length > 1) {
    desc += `, trabajos con ${topClientes[1].cliente}`
    if (topClientes.length > 2 && topClientes[2].count > 1) {
      desc += ` y ${topClientes[2].cliente}`
    }
  }

  // Mencionar ubicaciones principales
  const ubicacionesPrincipales = ubicaciones.slice(0, 3)
  if (ubicacionesPrincipales.length > 0) {
    desc += ` en ${ubicacionesPrincipales.join(', ')}`
  }

  desc += '.'

  return desc
}

// Generar categorías
function generarCategorias(analisis) {
  const { tipos, totalProyectos } = analisis
  const categorias = []

  if (tipos.puentes > 0) categorias.push(`Puentes: ${tipos.puentes}`)
  if (tipos.transporte > 0) categorias.push(`Transporte Urbano: ${tipos.transporte}`)
  if (tipos.edificios > 0) categorias.push(`Edificios: ${tipos.edificios}`)
  if (tipos.comercial > 0) categorias.push(`Centros Comerciales: ${tipos.comercial}`)
  if (tipos.industrial > 0) categorias.push(`Plantas Industriales: ${tipos.industrial}`)
  if (tipos.deportivo > 0) categorias.push(`Escenarios Deportivos: ${tipos.deportivo}`)
  if (tipos.cubiertas > 0) categorias.push(`Cubiertas y Fachadas: ${tipos.cubiertas}`)

  categorias.push(`Estructuras Metálicas: ${totalProyectos}`)

  return categorias
}

async function main() {
  console.log('🔍 Analizando todos los años desde 1996 hasta 2024...\n')

  const resultados = []

  for (let año = 1995; año <= 2024; año++) {
    const analisis = await analizarAño(año)
    if (!analisis) continue

    const titulo = generarTitulo(analisis)
    const descripcion = generarDescripcion(analisis)
    const categorias = generarCategorias(analisis)

    // Obtener el resumen actual si existe
    const resumenActual = await prisma.resumenAnio.findUnique({
      where: { anio: año }
    })

    resultados.push({
      año,
      totalProyectos: analisis.totalProyectos,
      propuesta: {
        titulo,
        descripcion,
        categorias
      },
      actual: resumenActual ? {
        titulo: resumenActual.titulo,
        descripcion: resumenActual.descripcion,
        categorias: resumenActual.categorias
      } : null,
      topClientes: analisis.topClientes,
      tipos: analisis.tipos
    })

    console.log(`✅ ${año}: ${analisis.totalProyectos} proyectos`)
  }

  // Guardar resultados en JSON
  const output = {
    fecha: new Date().toISOString(),
    total_años: resultados.length,
    resultados
  }

  fs.writeFileSync(
    'scripts/propuestas-resumenes-años.json',
    JSON.stringify(output, null, 2)
  )

  console.log(`\n📄 Resultados guardados en: scripts/propuestas-resumenes-años.json`)
  console.log(`\n📊 RESUMEN:`)
  console.log(`   - Años analizados: ${resultados.length}`)
  console.log(`   - Con ResumenAnio actual: ${resultados.filter(r => r.actual).length}`)
  console.log(`   - Sin ResumenAnio: ${resultados.filter(r => !r.actual).length}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })

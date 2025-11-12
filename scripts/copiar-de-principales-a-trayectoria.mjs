#!/usr/bin/env node

/**
 * Script para copiar proyectos desde Principales → Hoja de Vida
 * Solo copia los que NO existen ya en Hoja de Vida
 */

import { PrismaClient } from '@prisma/client'
import stringSimilarity from 'string-similarity'

const prisma = new PrismaClient()

// Función para normalizar texto
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Verificar si el proyecto ya existe en Hoja de Vida
async function proyectoYaExiste(proyectoPrincipal, proyectosHojaVida) {
  const tituloPrincipal = normalizeText(proyectoPrincipal.titulo)
  const clientePrincipal = normalizeText(proyectoPrincipal.cliente)

  for (const proyHV of proyectosHojaVida) {
    const tituloHV = normalizeText(proyHV.objetoContrato)
    const clienteHV = normalizeText(proyHV.entidadContratante)

    // Comparar similitud de títulos
    const similitudTitulo = stringSimilarity.compareTwoStrings(tituloPrincipal, tituloHV)
    const similitudCliente = stringSimilarity.compareTwoStrings(clientePrincipal, clienteHV)

    // Si hay alta similitud en título O cliente + ubicación similar
    if (similitudTitulo > 0.7 || (similitudCliente > 0.7 && similitudTitulo > 0.4)) {
      return {
        existe: true,
        proyecto: proyHV,
        similitudTitulo: Math.round(similitudTitulo * 100),
        similitudCliente: Math.round(similitudCliente * 100)
      }
    }
  }

  return { existe: false }
}

async function copiarProyectos() {
  console.log('🔍 Verificando proyectos para copiar...\n')

  try {
    // 1. Obtener todos los proyectos de Hoja de Vida
    const proyectosHojaVida = await prisma.proyectoHojaVida.findMany({
      select: {
        id: true,
        entidadContratante: true,
        objetoContrato: true,
        ubicacion: true,
        fechaInicio: true,
        proyectoDetalladoId: true
      }
    })

    console.log(`📋 Total en Hoja de Vida: ${proyectosHojaVida.length}\n`)

    // 2. Obtener proyectos de Principales que NO tienen relación con Hoja de Vida
    const proyectosPrincipales = await prisma.proyecto.findMany({
      where: {
        hojaVida: null // Solo los que NO tienen relación
      },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        cliente: true,
        categoria: true,
        fechaInicio: true,
        fechaFin: true,
        ubicacion: true,
        presupuesto: true,
        moneda: true,
        areaTotal: true,
        toneladas: true,
        destacado: true,
        visible: true
      }
    })

    console.log(`📋 Total en Principales sin relación: ${proyectosPrincipales.length}\n`)

    // Filtrar solo los reales (fecha < 2023)
    const proyectosReales = proyectosPrincipales.filter(p => {
      const year = new Date(p.fechaInicio).getFullYear()
      return year >= 2011 && year <= 2022
    })

    console.log(`✅ Proyectos reales a verificar: ${proyectosReales.length}\n`)

    const yaExisten = []
    const aCopiar = []

    // 3. Verificar cada proyecto
    for (const proyPrinc of proyectosReales) {
      const verificacion = await proyectoYaExiste(proyPrinc, proyectosHojaVida)

      if (verificacion.existe) {
        yaExisten.push({
          principal: proyPrinc,
          hojaVida: verificacion.proyecto,
          similitudTitulo: verificacion.similitudTitulo,
          similitudCliente: verificacion.similitudCliente
        })
      } else {
        aCopiar.push(proyPrinc)
      }
    }

    // 4. Mostrar resultados
    console.log('═══════════════════════════════════════════════════════════')
    console.log('                RESULTADOS DE VERIFICACIÓN                 ')
    console.log('═══════════════════════════════════════════════════════════\n')

    console.log(`📊 ESTADÍSTICAS:`)
    console.log(`   Ya existen en Hoja de Vida: ${yaExisten.length}`)
    console.log(`   Por copiar (nuevos):         ${aCopiar.length}\n`)

    if (yaExisten.length > 0) {
      console.log('✅ PROYECTOS QUE YA EXISTEN (no se copiarán):\n')
      yaExisten.forEach((p, i) => {
        console.log(`${i + 1}. ${p.principal.titulo}`)
        console.log(`   Cliente: ${p.principal.cliente}`)
        console.log(`   🔗 Ya existe como: "${p.hojaVida.entidadContratante} - ${p.hojaVida.objetoContrato.substring(0, 60)}..."`)
        console.log(`   Similitud: Título ${p.similitudTitulo}% | Cliente ${p.similitudCliente}%\n`)
      })
    }

    if (aCopiar.length > 0) {
      console.log('\n📋 PROYECTOS NUEVOS A COPIAR:\n')
      aCopiar.forEach((p, i) => {
        console.log(`${i + 1}. ${p.titulo}`)
        console.log(`   Cliente: ${p.cliente}`)
        console.log(`   Fecha: ${new Date(p.fechaInicio).getFullYear()}`)
        console.log(`   Ubicación: ${p.ubicacion}`)
        console.log(`   ${p.destacado ? '⭐ Destacado' : ''}\n`)
      })

      console.log('\n🚀 Copiando proyectos nuevos...\n')

      const copiados = []

      for (const proyPrinc of aCopiar) {
        try {
          // Crear en Hoja de Vida
          const nuevoHV = await prisma.proyectoHojaVida.create({
            data: {
              entidadContratante: proyPrinc.cliente,
              objetoContrato: proyPrinc.descripcion || proyPrinc.titulo,
              fechaInicio: proyPrinc.fechaInicio,
              fechaFin: proyPrinc.fechaFin || proyPrinc.fechaInicio,
              ubicacion: proyPrinc.ubicacion || 'No especificada',
              valorContrato: proyPrinc.presupuesto ? Number(proyPrinc.presupuesto) : 0,
              moneda: proyPrinc.moneda || 'COP',
              pesoKg: proyPrinc.toneladas ? Number(proyPrinc.toneladas) * 1000 : null,
              areaM2: proyPrinc.areaTotal ? Number(proyPrinc.areaTotal) : null,
              destacado: proyPrinc.destacado,
              visible: proyPrinc.visible,
              proyectoDetalladoId: proyPrinc.id // Vincular
            }
          })

          copiados.push({
            titulo: proyPrinc.titulo,
            id: nuevoHV.id
          })

          console.log(`   ✅ Copiado: ${proyPrinc.titulo}`)
          console.log(`   🔗 Vinculado con ID: ${proyPrinc.id}\n`)

        } catch (error) {
          console.error(`   ❌ Error copiando "${proyPrinc.titulo}": ${error.message}\n`)
        }
      }

      console.log('\n═══════════════════════════════════════════════════════════')
      console.log(`✅ Copiados exitosamente: ${copiados.length} de ${aCopiar.length}`)
      console.log('═══════════════════════════════════════════════════════════\n')
    } else {
      console.log('\n✅ No hay proyectos nuevos para copiar. Todos ya existen en Hoja de Vida.\n')
    }

  } catch (error) {
    console.error('❌ Error fatal:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
copiarProyectos()
  .then(() => {
    console.log('✅ Proceso completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })

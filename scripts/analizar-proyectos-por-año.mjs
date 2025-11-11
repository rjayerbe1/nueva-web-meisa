/**
 * Script para analizar proyectos agrupados por año
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function analizarProyectosPorAño() {
  // Obtener todos los proyectos
  const proyectos = await prisma.proyectoHojaVida.findMany({
    orderBy: {
      fechaFin: 'desc'
    },
    select: {
      id: true,
      entidadContratante: true,
      objetoContrato: true,
      fechaInicio: true,
      fechaFin: true,
      tituloDisplay: true,
      descripcionSecundaria: true
    }
  })

  // Agrupar por año
  const proyectosPorAño = {}

  proyectos.forEach(p => {
    const año = new Date(p.fechaFin).getFullYear()
    if (!proyectosPorAño[año]) {
      proyectosPorAño[año] = []
    }
    proyectosPorAño[año].push(p)
  })

  // Mostrar estadísticas
  console.log('📊 ANÁLISIS DE PROYECTOS POR AÑO\n')
  console.log('━'.repeat(80))

  const años = Object.keys(proyectosPorAño).sort((a, b) => b - a)

  años.forEach(año => {
    const proyectosAño = proyectosPorAño[año]
    const conTitulo = proyectosAño.filter(p => p.tituloDisplay).length

    console.log(`\n📅 AÑO ${año}: ${proyectosAño.length} proyectos`)
    console.log(`   ✓ Con título display: ${conTitulo}/${proyectosAño.length}`)

    if (conTitulo === 0) {
      console.log(`   ⚠️  Necesita organización de títulos`)
      console.log(`   \nProyectos:`)
      proyectosAño.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.entidadContratante}`)
        console.log(`      "${p.objetoContrato.substring(0, 80)}${p.objetoContrato.length > 80 ? '...' : ''}"`)
      })
    }
  })

  console.log('\n' + '━'.repeat(80))
  console.log(`\n✅ Total proyectos: ${proyectos.length}`)
  console.log(`📅 Años con proyectos: ${años.length} (${años[años.length - 1]} - ${años[0]})`)

  await prisma.$disconnect()
}

analizarProyectosPorAño()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })

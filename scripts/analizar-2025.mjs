#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Obtener TODOS los proyectos que tocan el año 2025
  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      AND: [
        { fechaInicio: { lt: new Date('2026-01-01') } },
        { fechaFin: { gte: new Date('2025-01-01') } }
      ]
    },
    orderBy: { fechaInicio: 'asc' }
  })

  console.log('=== TODOS LOS PROYECTOS QUE TOCAN EL AÑO 2025 ===\n')
  console.log(`Total: ${proyectos.length}\n`)

  proyectos.forEach((p, i) => {
    const inicio = new Date(p.fechaInicio)
    const fin = new Date(p.fechaFin)
    const yearInicio = inicio.getFullYear()
    const yearFin = fin.getFullYear()
    const esMulti = yearInicio !== yearFin

    console.log(`${i+1}. Cliente: ${p.entidadContratante}`)
    console.log(`   Título: ${p.tituloDisplay || 'Sin título'}`)
    console.log(`   Objeto: ${p.objetoContrato.substring(0, 80)}...`)
    console.log(`   Fechas: ${yearInicio} - ${yearFin} ${esMulti ? '🔄 MULTI-AÑO' : ''}`)
    console.log(`   Ubicación: ${p.ubicacion}`)
    console.log(`   Peso: ${p.pesoKg ? (Number(p.pesoKg)/1000).toFixed(1) + ' ton' : 'N/A'}`)
    console.log(`   Área: ${p.areaM2 ? Number(p.areaM2).toFixed(0) + ' m²' : 'N/A'}`)
    console.log(`   Destacado: ${p.destacado ? '⭐ SÍ' : 'No'}`)
    console.log('')
  })

  const clientes = [...new Set(proyectos.map(p => p.entidadContratante))]
  const ubicaciones = [...new Set(proyectos.map(p => p.ubicacion))]

  console.log('=== RESUMEN ESTADÍSTICO ===')
  console.log(`Total proyectos: ${proyectos.length}`)
  console.log(`Clientes únicos: ${clientes.join(', ')}`)
  console.log(`Ubicaciones: ${ubicaciones.join(', ')}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })

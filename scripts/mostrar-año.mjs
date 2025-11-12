#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const año = process.argv[2] ? parseInt(process.argv[2]) : 2024

async function main() {
  // Obtener todos los proyectos que tocan este año
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

  console.log(`\n📅 AÑO ${año} - ${proyectos.length} proyectos\n`)
  console.log('═'.repeat(80))

  proyectos.forEach((p, i) => {
    const inicio = new Date(p.fechaInicio).getFullYear()
    const fin = new Date(p.fechaFin).getFullYear()
    const esMulti = inicio !== fin

    console.log(`\n${i + 1}. ${p.entidadContratante}`)
    console.log(`   Título: ${p.tituloDisplay || 'Sin título'}`)
    console.log(`   Proyecto: ${p.objetoContrato.substring(0, 100)}...`)
    console.log(`   Fechas: ${inicio}-${fin} ${esMulti ? '(MULTI-AÑO)' : ''}`)
    console.log(`   Ubicación: ${p.ubicacion}`)
    if (p.pesoKg) console.log(`   Peso: ${(Number(p.pesoKg) / 1000).toFixed(1)} ton`)
    if (p.areaM2) console.log(`   Área: ${Number(p.areaM2).toFixed(0)} m²`)
    if (p.destacado) console.log(`   ⭐ DESTACADO`)
  })

  // Resumen actual
  const resumen = await prisma.resumenAnio.findUnique({ where: { anio: año } })

  console.log(`\n${'═'.repeat(80)}`)
  console.log('\n📝 RESUMEN ACTUAL:')
  if (resumen) {
    console.log(`Título: ${resumen.titulo}`)
    console.log(`Descripción: ${resumen.descripcion}`)
    console.log(`Categorías: ${resumen.categorias}`)
  } else {
    console.log('Sin ResumenAnio')
  }

  console.log(`\n${'═'.repeat(80)}\n`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })

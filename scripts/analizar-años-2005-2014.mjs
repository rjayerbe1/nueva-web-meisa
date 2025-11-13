#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function analizarAño(año) {
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

  const resumen = await prisma.resumenAnio.findUnique({ where: { anio: año } })

  return { proyectos, resumen }
}

async function main() {
  for (let año = 2005; año <= 2014; año++) {
    const { proyectos, resumen } = await analizarAño(año)

    console.log(`\n${'='.repeat(80)}`)
    console.log(`AÑO ${año} - ${proyectos.length} proyectos`)
    console.log('='.repeat(80))

    // Mostrar primeros 10 proyectos
    proyectos.slice(0, 10).forEach((p, i) => {
      const inicio = new Date(p.fechaInicio).getFullYear()
      const fin = new Date(p.fechaFin).getFullYear()
      const esMulti = inicio !== fin

      console.log(`\n${i + 1}. ${p.entidadContratante}`)
      if (p.tituloDisplay) console.log(`   Título: ${p.tituloDisplay}`)
      console.log(`   Objeto: ${p.objetoContrato.substring(0, 80)}...`)
      console.log(`   Fechas: ${inicio}-${fin} ${esMulti ? '(MULTI-AÑO)' : ''}`)
      if (p.pesoKg) console.log(`   Peso: ${(Number(p.pesoKg) / 1000).toFixed(1)} ton`)
      if (p.areaM2) console.log(`   Área: ${Number(p.areaM2).toFixed(0)} m²`)
    })

    if (proyectos.length > 10) {
      console.log(`\n... y ${proyectos.length - 10} proyectos más`)
    }

    console.log(`\n${'─'.repeat(80)}`)
    console.log('RESUMEN ACTUAL:')
    if (resumen) {
      console.log(`Título: ${resumen.titulo}`)
      console.log(`Descripción: ${resumen.descripcion}`)
    } else {
      console.log('Sin ResumenAnio')
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })

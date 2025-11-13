#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const templates = await prisma.pageTemplate.findMany({
    orderBy: [
      { categoria: 'asc' },
      { nombre: 'asc' }
    ],
    select: {
      nombre: true,
      categoria: true,
      createdBy: true,
      isPublic: true,
      thumbnail: true,
      canvasData: true
    }
  })

  console.log('\n📊 PLANTILLAS EN BASE DE DATOS:\n')
  console.log('Total:', templates.length, '\n')

  const groupedByCategory = templates.reduce((acc, t) => {
    const cat = t.categoria || 'Sin categoría'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t)
    return acc
  }, {})

  Object.entries(groupedByCategory).forEach(([categoria, temps]) => {
    console.log(`\n📁 ${categoria} (${temps.length}):`)
    temps.forEach(t => {
      const hasThumbnail = t.thumbnail ? '✅' : '❌'
      const hasCanvas = t.canvasData ? '✅' : '❌'
      console.log(`  - ${t.nombre}`)
      console.log(`    Thumbnail: ${hasThumbnail} | Canvas: ${hasCanvas} | Creado por: ${t.createdBy} | Público: ${t.isPublic ? 'Sí' : 'No'}`)
    })
  })

  console.log('\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

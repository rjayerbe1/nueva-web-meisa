#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Placeholder thumbnails por categoría (SVG simples sin texto especial)
const PLACEHOLDER_THUMBNAILS = {
  'Portadas': 'data:image/svg+xml,%3Csvg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1200" height="800" fill="%231E40AF"/%3E%3Crect x="400" y="300" width="400" height="200" fill="white" opacity="0.2"/%3E%3C/svg%3E',

  'Proyectos': 'data:image/svg+xml,%3Csvg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1200" height="800" fill="white"/%3E%3Crect y="80" width="1200" height="120" fill="%231E40AF"/%3E%3Crect x="60" y="240" width="340" height="240" fill="%23E5E7EB" stroke="%239CA3AF" stroke-width="2"/%3E%3Crect x="430" y="240" width="340" height="240" fill="%23E5E7EB" stroke="%239CA3AF" stroke-width="2"/%3E%3Crect x="800" y="240" width="340" height="240" fill="%23E5E7EB" stroke="%239CA3AF" stroke-width="2"/%3E%3C/svg%3E',

  'Galerías': 'data:image/svg+xml,%3Csvg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1200" height="800" fill="white"/%3E%3Crect x="60" y="80" width="520" height="320" fill="%23E5E7EB" stroke="%231E40AF" stroke-width="3"/%3E%3Crect x="620" y="80" width="520" height="320" fill="%23E5E7EB" stroke="%231E40AF" stroke-width="3"/%3E%3Crect x="60" y="440" width="520" height="320" fill="%23E5E7EB" stroke="%231E40AF" stroke-width="3"/%3E%3Crect x="620" y="440" width="520" height="320" fill="%23E5E7EB" stroke="%231E40AF" stroke-width="3"/%3E%3C/svg%3E',

  'Contenido': 'data:image/svg+xml,%3Csvg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1200" height="800" fill="white"/%3E%3Crect width="20" height="800" fill="%231E40AF"/%3E%3Crect x="80" y="100" width="600" height="40" fill="%231E40AF"/%3E%3Crect x="80" y="150" width="200" height="5" fill="%23DC2626"/%3E%3Cline x1="80" y1="220" x2="1120" y2="220" stroke="%23E5E7EB" stroke-width="2"/%3E%3Cline x1="80" y1="280" x2="1120" y2="280" stroke="%23E5E7EB" stroke-width="2"/%3E%3Cline x1="80" y1="340" x2="1120" y2="340" stroke="%23E5E7EB" stroke-width="2"/%3E%3Cline x1="80" y1="400" x2="1120" y2="400" stroke="%23E5E7EB" stroke-width="2"/%3E%3C/svg%3E'
}

async function main() {
  console.log('🎨 Actualizando thumbnails de plantillas de páginas...\n')

  // Obtener todas las plantillas (para actualizar con nuevos SVG corregidos)
  const templates = await prisma.pageTemplate.findMany({
    where: {
      OR: [
        { thumbnail: null },
        { thumbnail: { startsWith: 'data:image/svg+xml;base64' } }
      ]
    }
  })

  console.log(`📊 Encontradas ${templates.length} plantillas para actualizar\n`)

  if (templates.length === 0) {
    console.log('✅ No hay plantillas para actualizar')
    return
  }

  let updated = 0
  let errors = 0

  for (const template of templates) {
    try {
      // Obtener el thumbnail placeholder basado en la categoría
      const thumbnail = PLACEHOLDER_THUMBNAILS[template.categoria] || PLACEHOLDER_THUMBNAILS['Contenido']

      await prisma.pageTemplate.update({
        where: { id: template.id },
        data: { thumbnail }
      })

      console.log(`✅ Actualizada: "${template.nombre}" (${template.categoria})`)
      updated++
    } catch (error) {
      console.error(`❌ Error actualizando "${template.nombre}":`, error.message)
      errors++
    }
  }

  console.log(`\n🎉 Proceso completado!`)
  console.log(`✅ Actualizadas: ${updated}`)
  if (errors > 0) {
    console.log(`❌ Errores: ${errors}`)
  }

  // Mostrar resumen
  const totalWithThumbnail = await prisma.pageTemplate.count({
    where: {
      thumbnail: { not: null }
    }
  })
  const total = await prisma.pageTemplate.count()

  console.log(`\n📊 Resumen: ${totalWithThumbnail}/${total} plantillas con thumbnails`)
}

main()
  .catch((e) => {
    console.error('❌ Error general:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

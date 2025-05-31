import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeProjectsWithoutImages() {
  console.log('🧹 ELIMINANDO PROYECTOS SIN IMÁGENES...\n')

  // Buscar proyectos sin imágenes
  const projectsWithoutImages = await prisma.proyecto.findMany({
    where: {
      imagenes: {
        none: {}
      }
    },
    select: {
      id: true,
      titulo: true,
      categoria: true
    }
  })

  console.log(`📊 Proyectos sin imágenes encontrados: ${projectsWithoutImages.length}`)

  if (projectsWithoutImages.length > 0) {
    console.log(`\n❌ PROYECTOS A ELIMINAR:`)
    projectsWithoutImages.forEach(p => {
      console.log(`   🗑️  ${p.titulo} [${p.categoria}]`)
    })

    // Eliminar proyectos sin imágenes
    const deletedCount = await prisma.proyecto.deleteMany({
      where: {
        imagenes: {
          none: {}
        }
      }
    })

    console.log(`\n✅ Eliminados ${deletedCount.count} proyectos sin imágenes`)
  }

  // Estadísticas finales
  const finalProjects = await prisma.proyecto.findMany({
    select: {
      titulo: true,
      categoria: true,
      _count: {
        select: { imagenes: true }
      }
    },
    orderBy: [
      { categoria: 'asc' },
      { titulo: 'asc' }
    ]
  })

  const finalByCategory = await prisma.proyecto.groupBy({
    by: ['categoria'],
    _count: true
  })

  console.log(`\n🎉 PROYECTOS FINALES CON IMÁGENES: ${finalProjects.length}`)
  console.log(`📋 Por categoría:`)
  
  finalByCategory.forEach(cat => {
    console.log(`   ${cat.categoria}: ${cat._count}`)
  })

  console.log(`\n✅ LISTA FINAL DE PROYECTOS:`)
  finalProjects.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.titulo} (${p._count.imagenes} img) [${p.categoria}]`)
  })

  // Verificar que las rutas de imágenes existen
  console.log(`\n🔍 VERIFICANDO RUTAS DE IMÁGENES...`)
  
  const fs = require('fs')
  const path = require('path')
  
  const sampleImages = await prisma.imagenProyecto.findMany({
    take: 5,
    select: {
      url: true,
      proyecto: {
        select: { titulo: true }
      }
    }
  })

  sampleImages.forEach(img => {
    const fullPath = path.join(process.cwd(), 'public', img.url)
    const exists = fs.existsSync(fullPath)
    console.log(`   ${exists ? '✅' : '❌'} ${img.url} (${img.proyecto.titulo})`)
  })

  await prisma.$disconnect()
}

removeProjectsWithoutImages().catch(console.error)
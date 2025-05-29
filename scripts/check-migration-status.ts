import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function checkMigrationStatus() {
  try {
    console.log('📊 ESTADO DE LA MIGRACIÓN DE IMÁGENES\n')
    console.log('=' .repeat(50) + '\n')

    // Total de proyectos
    const totalProjects = await prisma.proyecto.count()
    console.log(`📋 Total proyectos: ${totalProjects}`)

    // Total de imágenes
    const totalImages = await prisma.imagenProyecto.count()
    console.log(`🖼️  Total imágenes: ${totalImages}`)

    // Proyectos con imágenes
    const projectsWithImages = await prisma.proyecto.count({
      where: {
        imagenes: {
          some: {}
        }
      }
    })

    console.log(`✅ Proyectos con imágenes: ${projectsWithImages}`)
    console.log(`⚠️  Proyectos sin imágenes: ${totalProjects - projectsWithImages}`)

    // Distribución por categoría
    console.log('\n📊 DISTRIBUCIÓN POR CATEGORÍA:')
    const categorias = await prisma.proyecto.groupBy({
      by: ['categoria'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    categorias.forEach(cat => {
      console.log(`   ${cat.categoria}: ${cat._count.id} proyectos`)
    })

    // Promedio de imágenes por proyecto
    if (projectsWithImages > 0) {
      const avgImages = Math.round(totalImages / projectsWithImages * 100) / 100
      console.log(`\n📈 Promedio imágenes por proyecto: ${avgImages}`)
    }

    // Algunos ejemplos de proyectos con más imágenes
    const projectsWithMostImages = await prisma.proyecto.findMany({
      include: {
        imagenes: true
      },
      orderBy: {
        imagenes: {
          _count: 'desc'
        }
      },
      take: 5
    })

    console.log('\n🏆 PROYECTOS CON MÁS IMÁGENES:')
    projectsWithMostImages.forEach(project => {
      console.log(`   ${project.titulo}: ${project.imagenes.length} imágenes`)
    })

    // Verificar si hay imágenes reales (no placeholders)
    const realImages = await prisma.imagenProyecto.count({
      where: {
        url: {
          contains: '-1748550'  // timestamp de las imágenes descargadas hoy
        }
      }
    })

    console.log(`\n🎯 Imágenes reales descargadas hoy: ${realImages}`)

    console.log('\n✅ REVISIÓN COMPLETADA')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkMigrationStatus()
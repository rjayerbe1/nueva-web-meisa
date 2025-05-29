import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function seedImages() {
  try {
    // Buscar proyectos existentes
    const projects = await prisma.proyecto.findMany({
      take: 4
    })

    if (projects.length === 0) {
      console.error('❌ No se encontraron proyectos. Por favor crea algunos primero.')
      return
    }

    // Imágenes de ejemplo para proyectos
    const projectImages = [
      {
        project: projects[0],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=1200&q=80',
            descripcion: 'Vista general de la estructura metálica'
          },
          {
            url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
            descripcion: 'Proceso de construcción'
          },
          {
            url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
            descripcion: 'Detalle de conexiones metálicas'
          }
        ]
      },
      {
        project: projects[1],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
            descripcion: 'Vista exterior de la bodega'
          },
          {
            url: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&q=80',
            descripcion: 'Interior de la bodega industrial'
          }
        ]
      },
      {
        project: projects[2],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590417975631-87d9b0458191?w=1200&q=80',
            descripcion: 'Puente peatonal terminado'
          },
          {
            url: 'https://images.unsplash.com/photo-1597476817120-6ae6a644ea40?w=1200&q=80',
            descripcion: 'Vista lateral del puente'
          }
        ]
      },
      {
        project: projects[3],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1200&q=80',
            descripcion: 'Render del edificio corporativo'
          },
          {
            url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
            descripcion: 'Estructura en construcción'
          }
        ]
      }
    ]

    console.log('🚀 Creando imágenes para proyectos...')

    for (const projectData of projectImages) {
      if (!projectData.project) continue
      
      for (const image of projectData.images) {
        await prisma.imagenProyecto.create({
          data: {
            url: image.url,
            alt: image.descripcion,
            descripcion: image.descripcion,
            proyectoId: projectData.project.id
          }
        })
        console.log(`✅ Imagen añadida a: ${projectData.project.titulo}`)
      }
    }

    const totalImages = await prisma.imagenProyecto.count()
    console.log(`\n🎉 ¡Proceso completado! Total de imágenes en la base de datos: ${totalImages}`)
    
  } catch (error) {
    console.error('❌ Error al crear imágenes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedImages()
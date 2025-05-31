/**
 * Script para reorganizar imágenes existentes a la nueva estructura
 * Ejecutar con: npx ts-node scripts/reorganize-existing-images.ts
 */

import { PrismaClient } from '@prisma/client'
import { generateImagePath, ensureDirectoryExists, getCategoryFolder, slugify } from '../lib/image-utils'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface ImageToReorganize {
  id: string
  url: string
  proyectoId: string
  proyecto: {
    titulo: string
    categoria: string
  }
}

async function reorganizeExistingImages() {
  console.log('🚀 Iniciando reorganización de imágenes existentes...')

  // Verificar si se debe incluir uploads
  const includeUploads = process.argv.includes('--include-uploads')
  if (includeUploads) {
    console.log('📤 Incluyendo imágenes de carpeta uploads')
  }

  try {
    // Obtener todas las imágenes con información del proyecto
    let whereClause = {}
    if (includeUploads) {
      // Incluir todas las imágenes
      whereClause = {}
    } else {
      // Excluir imágenes de uploads por defecto
      whereClause = {
        url: {
          not: {
            startsWith: '/uploads/'
          }
        }
      }
    }

    const imagenes = await prisma.imagenProyecto.findMany({
      where: whereClause,
      include: {
        proyecto: {
          select: {
            titulo: true,
            categoria: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    }) as ImageToReorganize[]

    console.log(`📁 Encontradas ${imagenes.length} imágenes para analizar`)

    const projectImageCounts: Record<string, number> = {}
    const imagesToMove: Array<{
      image: ImageToReorganize
      currentPath: string
      newPath: string
      newUrl: string
      imageIndex: number
    }> = []

    // Analizar cada imagen
    for (const imagen of imagenes) {
      // Contar imágenes por proyecto para generar índices secuenciales
      if (!projectImageCounts[imagen.proyectoId]) {
        projectImageCounts[imagen.proyectoId] = 0
      }
      projectImageCounts[imagen.proyectoId]++
      const imageIndex = projectImageCounts[imagen.proyectoId]

      // Verificar si ya está en la estructura correcta
      const expectedCategoryFolder = getCategoryFolder(imagen.proyecto.categoria as any)
      const expectedProjectSlug = slugify(imagen.proyecto.titulo)
      const expectedPathPrefix = `/images/projects/${expectedCategoryFolder}/${expectedProjectSlug}/`

      if (imagen.url.startsWith(expectedPathPrefix)) {
        console.log(`✅ Imagen ya organizada: ${imagen.url}`)
        continue
      }

      // Generar nueva ruta
      const fileName = path.basename(imagen.url)
      const newImagePath = generateImagePath(
        imagen.proyecto.categoria as any,
        imagen.proyecto.titulo,
        fileName,
        imageIndex
      )

      // Manejar diferentes rutas de origen
      let currentFullPath: string
      if (imagen.url.startsWith('/uploads/')) {
        currentFullPath = path.join(process.cwd(), 'public', imagen.url.replace('/uploads/', 'uploads/'))
      } else if (imagen.url.startsWith('/images/')) {
        currentFullPath = path.join(process.cwd(), 'public', imagen.url.replace('/images/', 'images/'))
      } else {
        currentFullPath = path.join(process.cwd(), 'public', imagen.url.startsWith('/') ? imagen.url.slice(1) : imagen.url)
      }
      
      const newFullPath = path.join(process.cwd(), 'public', 'images', 'projects', newImagePath)

      // Verificar que el archivo actual existe
      if (!fs.existsSync(currentFullPath)) {
        console.warn(`⚠️  Archivo no encontrado: ${currentFullPath}`)
        continue
      }

      imagesToMove.push({
        image: imagen,
        currentPath: currentFullPath,
        newPath: newFullPath,
        newUrl: `/images/projects/${newImagePath}`,
        imageIndex
      })
    }

    console.log(`📦 ${imagesToMove.length} imágenes necesitan reorganización`)

    if (imagesToMove.length === 0) {
      console.log('✨ Todas las imágenes ya están organizadas correctamente')
      return
    }

    // Confirmar antes de proceder
    console.log('\n📋 Resumen de cambios:')
    const projectSummary: Record<string, number> = {}
    imagesToMove.forEach(({ image }) => {
      const key = `${image.proyecto.categoria}/${image.proyecto.titulo}`
      projectSummary[key] = (projectSummary[key] || 0) + 1
    })

    Object.entries(projectSummary).forEach(([project, count]) => {
      console.log(`  - ${project}: ${count} imágenes`)
    })

    console.log('\n🔄 Iniciando reorganización...')

    let movedCount = 0
    let errorCount = 0

    // Mover imágenes
    for (const { image, currentPath, newPath, newUrl, imageIndex } of imagesToMove) {
      try {
        // Crear directorio de destino
        ensureDirectoryExists(path.dirname(newPath.replace(path.join(process.cwd(), 'public', 'images', 'projects') + path.sep, '')))

        // Mover archivo
        fs.renameSync(currentPath, newPath)

        // Actualizar URL en base de datos
        await prisma.imagenProyecto.update({
          where: { id: image.id },
          data: { url: newUrl }
        })

        console.log(`✅ Movida: ${image.url} → ${newUrl}`)
        movedCount++

      } catch (error) {
        console.error(`❌ Error moviendo ${image.url}:`, error)
        errorCount++
      }
    }

    console.log(`\n📊 Reorganización completada:`)
    console.log(`  ✅ Imágenes movidas: ${movedCount}`)
    console.log(`  ❌ Errores: ${errorCount}`)

    // Limpiar directorios vacíos
    console.log('\n🧹 Limpiando directorios vacíos...')
    await cleanupEmptyDirectories()

    console.log('🎉 Reorganización finalizada')

  } catch (error) {
    console.error('❌ Error en reorganización:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function cleanupEmptyDirectories() {
  const projectsDir = path.join(process.cwd(), 'public', 'images', 'projects')
  
  try {
    // Buscar directorios vacíos en cada categoría
    const categories = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const category of categories) {
      const categoryPath = path.join(projectsDir, category)
      
      try {
        const projects = fs.readdirSync(categoryPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)

        for (const project of projects) {
          const projectPath = path.join(categoryPath, project)
          
          try {
            const files = fs.readdirSync(projectPath)
            if (files.length === 0) {
              fs.rmdirSync(projectPath)
              console.log(`🗑️  Directorio vacío eliminado: ${category}/${project}`)
            }
          } catch (error) {
            // Ignore errors for individual project directories
          }
        }

        // Verificar si la categoría quedó vacía
        const remainingProjects = fs.readdirSync(categoryPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
        
        if (remainingProjects.length === 0) {
          fs.rmdirSync(categoryPath)
          console.log(`🗑️  Categoría vacía eliminada: ${category}`)
        }

      } catch (error) {
        // Ignore errors for individual categories
      }
    }
  } catch (error) {
    console.error('Error limpiando directorios:', error)
  }
}

// Ejecutar script
if (require.main === module) {
  reorganizeExistingImages()
    .then(() => {
      console.log('Script finalizado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error ejecutando script:', error)
      process.exit(1)
    })
}

export { reorganizeExistingImages }
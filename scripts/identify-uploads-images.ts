/**
 * Script para identificar a qué proyectos pertenecen las imágenes en uploads
 * Ejecutar con: npx ts-node scripts/identify-uploads-images.ts
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function identifyUploadsImages() {
  console.log('🔍 Identificando imágenes en carpeta uploads...')

  try {
    // Obtener archivos de uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    const uploadFiles = findAllUploadFiles(uploadsDir)
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const imageFiles = uploadFiles.filter(file => 
      imageExtensions.includes(path.extname(file.toLowerCase()))
    )

    console.log(`📤 Imágenes encontradas en uploads: ${imageFiles.length}`)

    if (imageFiles.length === 0) {
      console.log('No hay imágenes en uploads')
      return
    }

    // Obtener todas las imágenes de la base de datos que apuntan a uploads
    const uploadsImages = await prisma.imagenProyecto.findMany({
      where: {
        url: {
          startsWith: '/uploads/'
        }
      },
      include: {
        proyecto: {
          select: {
            id: true,
            titulo: true,
            categoria: true
          }
        }
      }
    })

    console.log(`📋 Imágenes en BD que apuntan a uploads: ${uploadsImages.length}`)

    if (uploadsImages.length > 0) {
      console.log('\n🗂️  Imágenes identificadas:')
      uploadsImages.forEach(imagen => {
        const fileName = path.basename(imagen.url)
        console.log(`  - ${fileName}`)
        console.log(`    Proyecto: ${imagen.proyecto.titulo}`)
        console.log(`    Categoría: ${imagen.proyecto.categoria}`)
        console.log(`    URL actual: ${imagen.url}`)
        console.log('')
      })
    }

    // Verificar archivos huérfanos (en uploads pero no en BD)
    const dbFileNames = uploadsImages.map(img => path.basename(img.url))
    const orphanFiles = imageFiles.filter(file => {
      const fileName = path.basename(file)
      return !dbFileNames.includes(fileName)
    })

    if (orphanFiles.length > 0) {
      console.log(`🚨 Archivos huérfanos en uploads (no están en BD): ${orphanFiles.length}`)
      orphanFiles.forEach(file => {
        const relativePath = file.replace(process.cwd() + path.sep, '')
        const stats = fs.statSync(file)
        const sizeKB = Math.round(stats.size / 1024)
        console.log(`  - ${relativePath} (${sizeKB}KB)`)
      })
    }

    // Verificar archivos faltantes (en BD pero no en uploads)
    const missingFiles = uploadsImages.filter(img => {
      const fullPath = path.join(process.cwd(), 'public', img.url.replace('/uploads/', 'uploads/'))
      return !fs.existsSync(fullPath)
    })

    if (missingFiles.length > 0) {
      console.log(`❌ Archivos faltantes (en BD pero no en uploads): ${missingFiles.length}`)
      missingFiles.forEach(img => {
        console.log(`  - ${img.url} (Proyecto: ${img.proyecto.titulo})`)
      })
    }

    // Mostrar resumen
    console.log('\n📊 Resumen:')
    console.log(`  📤 Archivos físicos en uploads: ${imageFiles.length}`)
    console.log(`  📋 Referencias en BD: ${uploadsImages.length}`)
    console.log(`  🚨 Archivos huérfanos: ${orphanFiles.length}`)
    console.log(`  ❌ Referencias faltantes: ${missingFiles.length}`)

    if (uploadsImages.length > 0) {
      console.log('\n💡 Para mover estas imágenes a la estructura organizada:')
      console.log('   npx ts-node scripts/reorganize-existing-images.ts --include-uploads')
    }

  } catch (error) {
    console.error('❌ Error identificando imágenes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function findAllUploadFiles(dir: string): string[] {
  const files: string[] = []
  
  if (!fs.existsSync(dir)) {
    return files
  }
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name)
      
      if (item.isDirectory()) {
        files.push(...findAllUploadFiles(fullPath))
      } else {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.error(`Error leyendo directorio ${dir}:`, error)
  }
  
  return files
}

// Ejecutar script
if (require.main === module) {
  identifyUploadsImages()
    .then(() => {
      console.log('\nIdentificación completada')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error ejecutando identificación:', error)
      process.exit(1)
    })
}

export { identifyUploadsImages }
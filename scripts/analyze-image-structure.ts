/**
 * Script para analizar la estructura actual de imágenes
 * Ejecutar con: npx ts-node scripts/analyze-image-structure.ts
 */

import { PrismaClient } from '@prisma/client'
import { getCategoryFolder, slugify } from '../lib/image-utils'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function analyzeImageStructure() {
  console.log('🔍 Analizando estructura actual de imágenes...')

  try {
    // Obtener todas las imágenes con información del proyecto
    const imagenes = await prisma.imagenProyecto.findMany({
      include: {
        proyecto: {
          select: {
            titulo: true,
            categoria: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📁 Total de imágenes en base de datos: ${imagenes.length}`)

    const analysis = {
      correctStructure: 0,
      needsReorganization: 0,
      missingFiles: 0,
      byCategory: {} as Record<string, {
        total: number,
        organized: number,
        needsReorg: number,
        missing: number
      }>
    }

    const projectCounts: Record<string, number> = {}

    for (const imagen of imagenes) {
      const category = imagen.proyecto.categoria
      const projectKey = `${category}|${imagen.proyecto.titulo}`
      
      // Inicializar contadores por categoría
      if (!analysis.byCategory[category]) {
        analysis.byCategory[category] = {
          total: 0,
          organized: 0,
          needsReorg: 0,
          missing: 0
        }
      }
      analysis.byCategory[category].total++

      // Verificar si el archivo existe
      const currentFullPath = path.join(process.cwd(), 'public', imagen.url.replace('/images/', 'images/'))
      if (!fs.existsSync(currentFullPath)) {
        console.warn(`⚠️  Archivo faltante: ${imagen.url}`)
        analysis.missingFiles++
        analysis.byCategory[category].missing++
        continue
      }

      // Verificar si está en la estructura correcta
      const expectedCategoryFolder = getCategoryFolder(category as any)
      const expectedProjectSlug = slugify(imagen.proyecto.titulo)
      const expectedPathPrefix = `/images/projects/${expectedCategoryFolder}/${expectedProjectSlug}/`

      if (imagen.url.startsWith(expectedPathPrefix)) {
        analysis.correctStructure++
        analysis.byCategory[category].organized++
      } else {
        analysis.needsReorganization++
        analysis.byCategory[category].needsReorg++
        
        // Contar imágenes por proyecto para mostrar índices
        if (!projectCounts[projectKey]) {
          projectCounts[projectKey] = 0
        }
        projectCounts[projectKey]++
      }
    }

    // Mostrar resultados
    console.log('\n📊 Resumen del análisis:')
    console.log(`  ✅ Imágenes correctamente organizadas: ${analysis.correctStructure}`)
    console.log(`  📦 Imágenes que necesitan reorganización: ${analysis.needsReorganization}`)
    console.log(`  ❌ Archivos faltantes: ${analysis.missingFiles}`)

    console.log('\n📋 Por categoría:')
    Object.entries(analysis.byCategory).forEach(([category, stats]) => {
      const organizedPercent = stats.total > 0 ? Math.round((stats.organized / stats.total) * 100) : 0
      console.log(`  ${category}:`)
      console.log(`    Total: ${stats.total}`)
      console.log(`    Organizadas: ${stats.organized} (${organizedPercent}%)`)
      console.log(`    Necesitan reorganización: ${stats.needsReorg}`)
      console.log(`    Faltantes: ${stats.missing}`)
    })

    // Mostrar proyectos que necesitan reorganización
    if (analysis.needsReorganization > 0) {
      console.log('\n🔄 Proyectos que necesitan reorganización:')
      Object.entries(projectCounts).forEach(([projectKey, count]) => {
        const [category, title] = projectKey.split('|')
        console.log(`  - ${category}/${title}: ${count} imágenes`)
      })

      console.log('\n💡 Para reorganizar las imágenes, ejecuta:')
      console.log('   npx ts-node scripts/reorganize-existing-images.ts')
    } else {
      console.log('\n✨ ¡Todas las imágenes están correctamente organizadas!')
    }

    // Verificar estructura de directorios físicos
    console.log('\n🗂️  Analizando estructura de directorios físicos...')
    analyzePhysicalStructure()

    // Verificar imágenes en uploads
    console.log('\n📤 Analizando carpeta uploads...')
    analyzeUploadsFolder()

  } catch (error) {
    console.error('❌ Error en análisis:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function analyzePhysicalStructure() {
  const projectsDir = path.join(process.cwd(), 'public', 'images', 'projects')
  
  if (!fs.existsSync(projectsDir)) {
    console.log('📁 El directorio projects no existe')
    return
  }

  try {
    const categories = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    console.log(`📂 Categorías encontradas: ${categories.length}`)
    
    let totalProjects = 0
    let totalFiles = 0

    categories.forEach(category => {
      const categoryPath = path.join(projectsDir, category)
      
      try {
        const projects = fs.readdirSync(categoryPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)

        totalProjects += projects.length

        let categoryFiles = 0
        projects.forEach(project => {
          const projectPath = path.join(categoryPath, project)
          try {
            const files = fs.readdirSync(projectPath, { withFileTypes: true })
              .filter(dirent => dirent.isFile())
            categoryFiles += files.length
          } catch (error) {
            // Ignore errors for individual projects
          }
        })

        totalFiles += categoryFiles
        console.log(`  ${category}: ${projects.length} proyectos, ${categoryFiles} archivos`)

      } catch (error) {
        console.error(`Error leyendo categoría ${category}:`, error)
      }
    })

    console.log(`📊 Total: ${totalProjects} proyectos, ${totalFiles} archivos físicos`)

  } catch (error) {
    console.error('Error analizando estructura física:', error)
  }
}

function analyzeUploadsFolder() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('📤 No existe carpeta uploads')
    return
  }

  try {
    // Buscar archivos en uploads y subdirectorios
    const uploadFiles = findAllUploadFiles(uploadsDir)
    
    if (uploadFiles.length === 0) {
      console.log('📤 No hay archivos en uploads')
      return
    }

    console.log(`📤 Archivos encontrados en uploads: ${uploadFiles.length}`)
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const imageFiles = uploadFiles.filter(file => 
      imageExtensions.includes(path.extname(file.toLowerCase()))
    )

    console.log(`🖼️  Imágenes en uploads: ${imageFiles.length}`)
    
    if (imageFiles.length > 0) {
      console.log('\n📋 Archivos de imagen en uploads:')
      imageFiles.forEach(file => {
        const relativePath = file.replace(process.cwd() + path.sep, '')
        const stats = fs.statSync(file)
        const sizeKB = Math.round(stats.size / 1024)
        console.log(`  - ${relativePath} (${sizeKB}KB)`)
      })

      console.log('\n💡 Estas imágenes pueden ser organizadas ejecutando:')
      console.log('   npx ts-node scripts/reorganize-existing-images.ts --include-uploads')
    }

  } catch (error) {
    console.error('Error analizando uploads:', error)
  }
}

function findAllUploadFiles(dir: string): string[] {
  const files: string[] = []
  
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
  analyzeImageStructure()
    .then(() => {
      console.log('\nAnálisis completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error ejecutando análisis:', error)
      process.exit(1)
    })
}

export { analyzeImageStructure }
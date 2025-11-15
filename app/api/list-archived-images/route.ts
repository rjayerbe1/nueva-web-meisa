import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Función auxiliar para leer recursivamente
function getAllImageFiles(dir: string, baseDir: string = dir): string[] {
  const results: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      // Recursivamente leer subdirectorios
      results.push(...getAllImageFiles(fullPath, baseDir))
    } else {
      // Verificar si es una imagen
      const ext = entry.name.toLowerCase()
      if (ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp')) {
        // Guardar ruta relativa desde baseDir
        const relativePath = path.relative(baseDir, fullPath)
        results.push(relativePath)
      }
    }
  }

  return results
}

export async function GET() {
  try {
    // Leer desde ambas carpetas FUERA del proyecto
    const archivedDir = '/Users/rjayerbe/Web Development Local/meisa.com.co/archived-outros-images'
    const brochureDir = '/Users/rjayerbe/Web Development Local/meisa.com.co/IMAGENES STOCK BROCHURE'

    // Leer todos los archivos recursivamente de ambas carpetas
    const archivedImages = getAllImageFiles(archivedDir).map(file => ({
      path: file,
      source: 'archived'
    }))

    const brochureImages = getAllImageFiles(brochureDir).map(file => ({
      path: file,
      source: 'brochure'
    }))

    // Combinar todas las imágenes
    const allImageFiles = [...archivedImages, ...brochureImages]

    // Convertir todas las imágenes a URLs (SIN FILTRAR DUPLICADOS)
    const allImages = allImageFiles
      .map(item => `/api/serve-archived-image?filename=${encodeURIComponent(item.path)}&source=${item.source}`)
      .sort()

    console.log(`Total de imágenes: ${allImages.length} (archived: ${archivedImages.length}, brochure: ${brochureImages.length})`)

    return NextResponse.json({
      images: allImages,
      total: allImages.length,
      sources: {
        archived: archivedImages.length,
        brochure: brochureImages.length
      }
    })
  } catch (error) {
    console.error('Error listing images:', error)
    return NextResponse.json({ images: [], total: 0, error: 'Error loading images' })
  }
}

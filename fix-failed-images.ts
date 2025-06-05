import fs from 'fs'
import path from 'path'
import https from 'https'
import { prisma } from './lib/prisma'

// URLs alternativas para las imágenes que fallaron
const failedImages = {
  'consultoria-2.jpg': 'https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1920&auto=format&fit=crop',
  'default-2.jpg': 'https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=1920&auto=format&fit=crop',
  'gestion-4.jpg': 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1920&auto=format&fit=crop',
  'montaje-1.jpg': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1920&auto=format&fit=crop'
}

// Función mejorada para descargar imagen
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Eliminar archivo existente si es muy pequeño
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath)
      if (stats.size < 1000) { // Menos de 1KB probablemente es un error
        fs.unlinkSync(filepath)
        console.log(`🗑️  Deleted corrupted file: ${filepath}`)
      }
    }

    const file = fs.createWriteStream(filepath)
    
    const request = https.get(url, (response) => {
      // Seguir redirecciones
      if (response.statusCode === 301 || response.statusCode === 302) {
        const newUrl = response.headers.location
        if (newUrl) {
          console.log(`↪️  Following redirect to: ${newUrl}`)
          https.get(newUrl, (redirectResponse) => {
            redirectResponse.pipe(file)
          })
          return
        }
      }
      
      response.pipe(file)
      
      file.on('finish', () => {
        file.close()
        const stats = fs.statSync(filepath)
        console.log(`✓ Downloaded: ${filepath} (${(stats.size / 1024).toFixed(2)} KB)`)
        resolve()
      })
    })
    
    request.on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
    
    request.setTimeout(30000, () => {
      request.destroy()
      reject(new Error('Download timeout'))
    })
  })
}

async function main() {
  try {
    const baseDir = path.join(process.cwd(), 'public', 'images', 'servicios')
    
    console.log('🔧 Fixing failed images...\n')
    
    // Descargar imágenes que fallaron
    for (const [filename, url] of Object.entries(failedImages)) {
      const filepath = path.join(baseDir, filename)
      console.log(`Downloading ${filename}...`)
      
      try {
        await downloadImage(url, filepath)
      } catch (error) {
        console.error(`❌ Failed to download ${filename}:`, error.message)
      }
    }
    
    // Verificar todas las imágenes
    console.log('\n📊 Verifying all images...')
    const files = fs.readdirSync(baseDir).filter(f => f.endsWith('.jpg'))
    
    for (const file of files) {
      const filepath = path.join(baseDir, file)
      const stats = fs.statSync(filepath)
      
      if (stats.size < 1000) {
        console.log(`⚠️  ${file} is too small (${stats.size} bytes)`)
      } else {
        console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`)
      }
    }
    
    // Actualizar base de datos con las rutas correctas
    console.log('\n🔄 Updating database...')
    
    const services = [
      {
        slug: 'consultoria-en-diseno-estructural',
        images: [
          '/images/servicios/consultoria-1.jpg',
          '/images/servicios/consultoria-2.jpg',
          '/images/servicios/consultoria-3.jpg',
          '/images/servicios/consultoria-4.jpg'
        ]
      },
      {
        slug: 'fabricacion-de-estructuras-metalicas',
        images: [
          '/images/servicios/fabricacion-1.jpg',
          '/images/servicios/fabricacion-2.jpg',
          '/images/servicios/fabricacion-3.jpg',
          '/images/servicios/fabricacion-4.jpg'
        ]
      },
      {
        slug: 'montaje-de-estructuras',
        images: [
          '/images/servicios/montaje-1.jpg',
          '/images/servicios/montaje-2.jpg',
          '/images/servicios/montaje-3.jpg',
          '/images/servicios/montaje-4.jpg'
        ]
      },
      {
        slug: 'gestion-integral-de-proyectos',
        images: [
          '/images/servicios/gestion-1.jpg',
          '/images/servicios/gestion-2.jpg',
          '/images/servicios/gestion-3.jpg',
          '/images/servicios/gestion-4.jpg'
        ]
      }
    ]
    
    for (const service of services) {
      await prisma.servicio.update({
        where: { slug: service.slug },
        data: {
          imagenesGaleria: service.images
        }
      })
      console.log(`✓ Updated ${service.slug}`)
    }
    
    console.log('\n✅ All done!')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
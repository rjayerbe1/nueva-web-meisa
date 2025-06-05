import { prisma } from './lib/prisma'
import fs from 'fs'
import path from 'path'
import https from 'https'

// Definir las imágenes para cada servicio
const serviceImagesData = {
  'consultoria-en-diseno-estructural': [
    {
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1920&auto=format&fit=crop',
      filename: 'consultoria-1.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1581094794329-c8112c4e5190?q=80&w=1920&auto=format&fit=crop',
      filename: 'consultoria-2.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop',
      filename: 'consultoria-3.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?q=80&w=1920&auto=format&fit=crop',
      filename: 'consultoria-4.jpg'
    }
  ],
  'fabricacion-de-estructuras-metalicas': [
    {
      url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1920&auto=format&fit=crop',
      filename: 'fabricacion-1.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?q=80&w=1920&auto=format&fit=crop',
      filename: 'fabricacion-2.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1920&auto=format&fit=crop',
      filename: 'fabricacion-3.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1920&auto=format&fit=crop',
      filename: 'fabricacion-4.jpg'
    }
  ],
  'montaje-de-estructuras': [
    {
      url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1920&auto=format&fit=crop',
      filename: 'montaje-1.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1920&auto=format&fit=crop',
      filename: 'montaje-2.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?q=80&w=1920&auto=format&fit=crop',
      filename: 'montaje-3.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=1920&auto=format&fit=crop',
      filename: 'montaje-4.jpg'
    }
  ],
  'gestion-integral-de-proyectos': [
    {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1920&auto=format&fit=crop',
      filename: 'gestion-1.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1920&auto=format&fit=crop',
      filename: 'gestion-2.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1920&auto=format&fit=crop',
      filename: 'gestion-3.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd16ce?q=80&w=1920&auto=format&fit=crop',
      filename: 'gestion-4.jpg'
    }
  ]
}

// Función para descargar una imagen
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    
    https.get(url, (response) => {
      response.pipe(file)
      
      file.on('finish', () => {
        file.close()
        console.log(`✓ Downloaded: ${filepath}`)
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}) // Delete the file on error
      reject(err)
    })
  })
}

async function main() {
  try {
    // Crear directorio si no existe
    const baseDir = path.join(process.cwd(), 'public', 'images', 'servicios')
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true })
      console.log('✓ Created directory:', baseDir)
    }

    // Descargar imágenes para cada servicio
    for (const [slug, images] of Object.entries(serviceImagesData)) {
      console.log(`\nProcessing service: ${slug}`)
      
      for (const image of images) {
        const filepath = path.join(baseDir, image.filename)
        
        // Solo descargar si no existe
        if (!fs.existsSync(filepath)) {
          await downloadImage(image.url, filepath)
        } else {
          console.log(`⚡ Already exists: ${image.filename}`)
        }
      }
    }

    console.log('\n📸 All images downloaded successfully!')

    // Actualizar la base de datos
    console.log('\n🔄 Updating database...')
    
    for (const [slug, images] of Object.entries(serviceImagesData)) {
      const imageUrls = images.map(img => `/images/servicios/${img.filename}`)
      
      await prisma.servicio.update({
        where: { slug },
        data: {
          imagenesGaleria: imageUrls
        }
      })
      
      console.log(`✓ Updated ${slug} with ${imageUrls.length} images`)
    }

    console.log('\n✅ Database updated successfully!')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
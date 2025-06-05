import fs from 'fs'
import path from 'path'
import https from 'https'

// Imágenes por defecto
const defaultImages = [
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop',
    filename: 'default-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1504307299409-15071b27c638?q=80&w=1920&auto=format&fit=crop',
    filename: 'default-2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1920&auto=format&fit=crop',
    filename: 'default-3.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1920&auto=format&fit=crop',
    filename: 'default-4.jpg'
  }
]

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

    console.log('Downloading default images...\n')
    
    for (const image of defaultImages) {
      const filepath = path.join(baseDir, image.filename)
      
      // Solo descargar si no existe
      if (!fs.existsSync(filepath)) {
        await downloadImage(image.url, filepath)
      } else {
        console.log(`⚡ Already exists: ${image.filename}`)
      }
    }

    console.log('\n✅ Default images downloaded successfully!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
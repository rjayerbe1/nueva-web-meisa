import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'

// Configuración de imágenes placeholder
const placeholders = [
  // Hero images
  { path: 'hero/estructura-metalica-1.jpg', width: 1920, height: 1080, text: 'Estructura Metálica Centro Comercial', color: '#1e293b' },
  { path: 'hero/puente-metalico.jpg', width: 1920, height: 1080, text: 'Puente Metálico', color: '#1e293b' },
  { path: 'hero/edificio-construccion.jpg', width: 1920, height: 1080, text: 'Edificio en Construcción', color: '#1e293b' },
  
  // Service images
  { path: 'services/diseno-estructural.jpg', width: 800, height: 600, text: 'Diseño Estructural', color: '#3b82f6' },
  { path: 'services/fabricacion.jpg', width: 800, height: 600, text: 'Fabricación', color: '#f97316' },
  { path: 'services/montaje.jpg', width: 800, height: 600, text: 'Montaje', color: '#10b981' },
  { path: 'services/mantenimiento.jpg', width: 800, height: 600, text: 'Mantenimiento', color: '#8b5cf6' },
]

function createPlaceholderImage(width: number, height: number, text: string, bgColor: string): Buffer {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Fondo con gradiente
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, bgColor)
  gradient.addColorStop(1, '#0f172a')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Patrón de líneas
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i < width; i += 50) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, height)
    ctx.stroke()
  }
  for (let i = 0; i < height; i += 50) {
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(width, i)
    ctx.stroke()
  }

  // Texto
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.font = `bold ${Math.min(width / 20, 48)}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)

  // Texto secundario
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.font = `${Math.min(width / 30, 24)}px Arial`
  ctx.fillText('MEISA - Metálicas e Ingeniería', width / 2, height / 2 + 50)

  return canvas.toBuffer('image/jpeg', { quality: 0.9 })
}

async function main() {
  const publicDir = path.join(process.cwd(), 'public', 'images')

  // Crear directorios si no existen
  for (const placeholder of placeholders) {
    const dirPath = path.join(publicDir, path.dirname(placeholder.path))
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
  }

  // Generar imágenes
  for (const placeholder of placeholders) {
    const imagePath = path.join(publicDir, placeholder.path)
    
    // Solo crear si no existe
    if (!fs.existsSync(imagePath)) {
      const buffer = createPlaceholderImage(
        placeholder.width,
        placeholder.height,
        placeholder.text,
        placeholder.color
      )
      
      fs.writeFileSync(imagePath, buffer)
      console.log(`✅ Creado: ${placeholder.path}`)
    } else {
      console.log(`⏭️  Ya existe: ${placeholder.path}`)
    }
  }

  console.log('\n✨ Imágenes placeholder creadas exitosamente')
}

main().catch(console.error)
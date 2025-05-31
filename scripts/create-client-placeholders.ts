import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// SVG placeholder para logos
const createPlaceholderSVG = (text: string, bgColor: string) => {
  return `<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="100" fill="${bgColor}" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
      ${text}
    </text>
  </svg>`
}

// Colores por sector
const sectorColors: Record<string, string> = {
  INDUSTRIAL: '#3B82F6',
  COMERCIAL: '#10B981',
  CONSTRUCCION: '#6B7280',
  INSTITUCIONAL: '#8B5CF6',
  GOBIERNO: '#EF4444',
  ENERGIA: '#F59E0B',
  MINERIA: '#F97316',
  OTRO: '#6366F1'
}

async function createClientPlaceholders() {
  console.log('🖼️  Creando imágenes placeholder para clientes...')

  try {
    // Obtener todos los clientes
    const clientes = await prisma.cliente.findMany()
    
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'clients')
    
    // Crear directorio si no existe
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
    }

    for (const cliente of clientes) {
      const fileName = cliente.slug || cliente.nombre.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const bgColor = sectorColors[cliente.sector] || sectorColors.OTRO
      
      // Crear SVG placeholder
      const svg = createPlaceholderSVG(
        cliente.nombre.substring(0, 10),
        bgColor
      )
      
      // Guardar archivo SVG
      const filePath = path.join(imagesDir, `cliente-${fileName}.svg`)
      fs.writeFileSync(filePath, svg)
      
      console.log(`✅ Placeholder creado: cliente-${fileName}.svg`)
      
      // Actualizar la base de datos con la ruta del placeholder
      await prisma.cliente.update({
        where: { id: cliente.id },
        data: {
          logo: `/images/clients/cliente-${fileName}.svg`,
          logoBlanco: `/images/clients/cliente-${fileName}.svg`
        }
      })
    }

    console.log(`\n✅ ${clientes.length} placeholders creados exitosamente`)
    console.log('📍 Ubicación: public/images/clients/')
  } catch (error) {
    console.error('❌ Error al crear placeholders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createClientPlaceholders()
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function cleanTestImages() {
  try {
    // Eliminar solo las imágenes de prueba (Unsplash)
    const result = await prisma.imagenProyecto.deleteMany({
      where: {
        url: {
          contains: 'unsplash.com'
        }
      }
    })

    console.log(`✅ ${result.count} imágenes de prueba eliminadas`)
    
    // Mostrar estadísticas
    const remaining = await prisma.imagenProyecto.count()
    console.log(`📊 Imágenes restantes en la base de datos: ${remaining}`)
    
  } catch (error) {
    console.error('❌ Error al limpiar imágenes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanTestImages()
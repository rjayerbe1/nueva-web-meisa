import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function cleanTestProjects() {
  try {
    // Eliminar todos los proyectos de prueba (los que no vienen de WordPress)
    const testProjectSlugs = [
      'centro-comercial-plaza-norte',
      'bodega-industrial-zona-franca', 
      'puente-peatonal-universidad',
      'edificio-corporativo-torre-45'
    ]

    const result = await prisma.proyecto.deleteMany({
      where: {
        slug: {
          in: testProjectSlugs
        }
      }
    })

    console.log(`✅ ${result.count} proyectos de prueba eliminados`)
    
    // Mostrar estadísticas
    const remaining = await prisma.proyecto.count()
    console.log(`📊 Proyectos restantes en la base de datos: ${remaining}`)
    
  } catch (error) {
    console.error('❌ Error al limpiar proyectos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanTestProjects()
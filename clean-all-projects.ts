import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanAllProjects() {
  try {
    console.log('🧹 Iniciando limpieza de todos los proyectos...')
    
    // 1. Eliminar todas las imágenes de proyectos
    const deletedImages = await prisma.imagenProyecto.deleteMany({})
    console.log(`✅ Eliminadas ${deletedImages.count} imágenes de proyectos`)
    
    // 2. Eliminar todos los progresos de proyectos
    const deletedProgress = await prisma.progresoProyecto.deleteMany({})
    console.log(`✅ Eliminados ${deletedProgress.count} registros de progreso`)
    
    // 3. Eliminar todos los proyectos
    const deletedProjects = await prisma.proyecto.deleteMany({})
    console.log(`✅ Eliminados ${deletedProjects.count} proyectos`)
    
    console.log('🎉 Limpieza completada exitosamente!')
    console.log('📊 Resumen:')
    console.log(`   - Proyectos eliminados: ${deletedProjects.count}`)
    console.log(`   - Imágenes eliminadas: ${deletedImages.count}`)
    console.log(`   - Registros de progreso eliminados: ${deletedProgress.count}`)
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanAllProjects()
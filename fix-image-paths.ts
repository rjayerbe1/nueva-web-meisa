import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixImagePaths() {
  try {
    console.log('🔧 Corrigiendo rutas de imágenes...')
    
    // Obtener todas las imágenes que empiecen con /images/projects/
    const imagenes = await prisma.imagenProyecto.findMany({
      where: {
        url: {
          startsWith: '/images/projects/'
        }
      }
    })
    
    console.log(`📊 Encontradas ${imagenes.length} imágenes para corregir`)
    
    let contador = 0
    
    for (const imagen of imagenes) {
      // Cambiar /images/projects/ por /uploads/projects/
      const nuevaUrl = imagen.url.replace('/images/projects/', '/uploads/projects/')
      
      await prisma.imagenProyecto.update({
        where: { id: imagen.id },
        data: { url: nuevaUrl }
      })
      
      contador++
      if (contador <= 10) { // Solo mostrar los primeros 10 para no saturar la consola
        console.log(`✅ Corregido: ${imagen.url} → ${nuevaUrl}`)
      }
    }
    
    if (contador > 10) {
      console.log(`... y ${contador - 10} más`)
    }
    
    console.log(`\n🎉 Se corrigieron ${contador} rutas de imágenes`)
    
  } catch (error) {
    console.error('❌ Error corrigiendo rutas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixImagePaths()
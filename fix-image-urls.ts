import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixImageUrls() {
  try {
    console.log('🖼️ Corrigiendo URLs de imágenes...')
    
    // Obtener todas las imágenes
    const imagenes = await prisma.imagenProyecto.findMany()
    
    console.log(`📊 Encontradas ${imagenes.length} imágenes para corregir`)
    
    let contador = 0
    
    for (const imagen of imagenes) {
      // Si la URL no empieza con / o http, la corregimos
      if (!imagen.url.startsWith('/') && !imagen.url.startsWith('http')) {
        const nuevaUrl = `/images/projects/${imagen.url}`
        
        await prisma.imagenProyecto.update({
          where: { id: imagen.id },
          data: { url: nuevaUrl }
        })
        
        contador++
        console.log(`✅ Corregido: ${imagen.url} → ${nuevaUrl}`)
      }
    }
    
    console.log(`\n🎉 Se corrigieron ${contador} URLs de imágenes`)
    
  } catch (error) {
    console.error('❌ Error corrigiendo URLs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixImageUrls()
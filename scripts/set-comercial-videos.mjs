import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setVideos() {
  try {
    const videoUrl = 'https://storage.googleapis.com/meisa-imagenes/categories/videos/comercial-ceiling-1763561202789.mp4'

    console.log('📹 Configurando videos para COMERCIAL...\n')

    const updated = await prisma.categoriaProyecto.update({
      where: { key: 'COMERCIAL' },
      data: {
        videoCover: videoUrl,    // Video para la tarjeta
        videoBanner: videoUrl    // Video para el hero
      }
    })

    console.log('✅ Categoría COMERCIAL actualizada:')
    console.log('='.repeat(60))
    console.log('videoCover:  ', updated.videoCover)
    console.log('videoBanner: ', updated.videoBanner)
    console.log('='.repeat(60))
    console.log('\n✅ Ahora el video aparecerá en:')
    console.log('   - Tarjetas de categoría (homepage/galería)')
    console.log('   - Hero de la página /proyectos/categoria/comercial')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setVideos()

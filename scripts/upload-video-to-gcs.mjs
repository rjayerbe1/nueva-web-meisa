import { Storage } from '@google-cloud/storage'
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'

const prisma = new PrismaClient()

// Inicializar Google Cloud Storage
const storage = new Storage({
  projectId: 'meisa-web-prod-2025'
})
const bucket = storage.bucket('meisa-imagenes')

async function uploadVideoAndUpdateCategory() {
  try {
    const videoPath = '/Users/rjayerbe/Downloads/Futuristic_Ceiling_Video_Generation.mp4'
    const categoryKey = 'COMERCIAL'

    console.log('📹 Subiendo video a Google Cloud Storage...\n')
    console.log(`   Archivo: ${videoPath}`)

    // Leer el video
    const videoBuffer = readFileSync(videoPath)
    const fileSizeMB = (videoBuffer.length / 1024 / 1024).toFixed(2)
    console.log(`   Tamaño: ${fileSizeMB} MB\n`)

    // Crear nombre para el video en GCS
    const timestamp = Date.now()
    const filename = `comercial-ceiling-${timestamp}.mp4`
    const gcsPath = `categories/videos/${filename}`

    console.log(`   Subiendo a: gs://meisa-imagenes/${gcsPath}`)

    // Subir a GCS
    const gcsFile = bucket.file(gcsPath)
    await gcsFile.save(videoBuffer, {
      metadata: {
        contentType: 'video/mp4',
        cacheControl: 'public, max-age=31536000',
      },
      public: true
    })

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${gcsPath}`
    console.log(`   ✅ Video subido: ${publicUrl}\n`)

    // Actualizar categoría COMERCIAL
    console.log(`📝 Actualizando categoría ${categoryKey}...`)

    const categoria = await prisma.categoriaProyecto.update({
      where: { key: categoryKey },
      data: { videoBanner: publicUrl }
    })

    console.log(`   ✅ Categoría "${categoria.nombre}" actualizada\n`)

    console.log('='.repeat(60))
    console.log('✅ PROCESO COMPLETADO')
    console.log('='.repeat(60))
    console.log(`Video URL: ${publicUrl}`)
    console.log(`Categoría: ${categoria.nombre} (${categoria.slug})`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

uploadVideoAndUpdateCategory()

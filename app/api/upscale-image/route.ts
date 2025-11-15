import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { Storage } from '@google-cloud/storage'
import Replicate from 'replicate'

// Inicializar Google Cloud Storage
const storage = new Storage({
  projectId: 'meisa-web-prod-2025'
})
const bucket = storage.bucket('meisa-imagenes')

// Inicializar Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL de imagen requerida' }, { status: 400 })
    }

    // Validar que la imagen sea de Google Cloud Storage
    if (!imageUrl.includes('storage.googleapis.com')) {
      return NextResponse.json({ error: 'Solo se pueden upscalear imágenes de Google Cloud Storage' }, { status: 400 })
    }

    console.log('🚀 [Upscale] Iniciando upscaling de:', imageUrl)

    // Extraer el path de la imagen en GCS
    const urlParts = imageUrl.split('meisa-imagenes/')
    if (urlParts.length < 2) {
      return NextResponse.json({ error: 'URL de imagen inválida' }, { status: 400 })
    }
    const gcsPath = urlParts[1]

    // Llamar a Replicate Real-ESRGAN 4x
    console.log('⚡ [Upscale] Enviando a Replicate Real-ESRGAN 4x...')
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: imageUrl,
          scale: 4,
          face_enhance: false
        }
      }
    ) as string

    console.log('✨ [Upscale] Imagen procesada por Replicate:', output)

    // Descargar la imagen upscaled
    const response = await fetch(output)
    if (!response.ok) {
      throw new Error('Error descargando imagen upscaled de Replicate')
    }
    const buffer = Buffer.from(await response.arrayBuffer())

    // Crear nombre para la imagen upscaled (agregar sufijo -upscaled)
    const pathParts = gcsPath.split('/')
    const filename = pathParts[pathParts.length - 1]
    const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'))
    const extension = filename.substring(filename.lastIndexOf('.'))
    const upscaledFilename = `${filenameWithoutExt}-upscaled${extension}`

    // Mantener la misma carpeta que la imagen original
    const folder = pathParts.slice(0, -1).join('/')
    const upscaledPath = folder ? `${folder}/${upscaledFilename}` : upscaledFilename

    console.log('📤 [Upscale] Subiendo a GCS:', upscaledPath)

    // Subir a Google Cloud Storage
    const gcsFile = bucket.file(upscaledPath)
    await gcsFile.save(buffer, {
      metadata: {
        contentType: 'image/png', // Real-ESRGAN retorna PNG
        cacheControl: 'public, max-age=31536000',
      },
      public: true
    })

    // URL pública de la imagen upscaled
    const upscaledUrl = `https://storage.googleapis.com/${bucket.name}/${upscaledPath}`

    console.log('✅ [Upscale] Completado:', upscaledUrl)

    return NextResponse.json({
      success: true,
      originalUrl: imageUrl,
      upscaledUrl,
      message: 'Imagen upscaled exitosamente con Real-ESRGAN 4x'
    })
  } catch (error) {
    console.error('❌ [Upscale] Error:', error)

    // Manejar errores específicos de Replicate
    if (error instanceof Error) {
      if (error.message.includes('API token')) {
        return NextResponse.json({
          error: 'Token de Replicate no configurado. Agrega REPLICATE_API_TOKEN al archivo .env'
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      error: 'Error al procesar imagen con AI upscaling',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

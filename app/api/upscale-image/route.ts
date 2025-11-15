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

    // Llamar a Bria Increase-Resolution 4x (soporta hasta 8192x8192)
    console.log('⚡ [Upscale] Enviando a Bria Increase-Resolution 4x...')
    const output = await replicate.run(
      "bria/increase-resolution:19266ced4be9ec28f269ab20a2622104cac9c518158b7761e7edeb30954bd01a",
      {
        input: {
          image_url: imageUrl,
          desired_increase: 4,
          preserve_alpha: true
        }
      }
    ) as unknown as string

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
      method: 'bria-increase-resolution',
      cost: 0.04,
      message: 'Imagen upscaled exitosamente con Bria Increase-Resolution 4x'
    })
  } catch (error) {
    console.error('❌ [Upscale] Error:', error)

    // Manejar errores específicos de Replicate
    if (error instanceof Error) {
      // Error de API token no configurado
      if (error.message.includes('API token')) {
        return NextResponse.json({
          error: 'Token de Replicate no configurado. Agrega REPLICATE_API_TOKEN al archivo .env'
        }, { status: 500 })
      }

      // Error 402: Sin crédito suficiente
      if (error.message.includes('402') || error.message.includes('Insufficient credit')) {
        return NextResponse.json({
          error: 'Sin crédito en Replicate',
          details: 'Tu cuenta de Replicate no tiene crédito suficiente. Ve a https://replicate.com/account/billing para agregar crédito o una tarjeta de crédito. Costo: ~$0.002 USD por imagen.'
        }, { status: 402 })
      }

      // Error de rate limit
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json({
          error: 'Límite de uso excedido',
          details: 'Has alcanzado el límite de uso de Replicate. Espera unos minutos e intenta de nuevo.'
        }, { status: 429 })
      }

      // Error de imagen demasiado grande
      if (error.message.includes('exceed maximum size') || error.message.includes('8K UHD')) {
        return NextResponse.json({
          error: 'Imagen demasiado grande para upscaling',
          details: 'Esta imagen excedería el límite máximo de 8K UHD (67 megapixels) al hacer upscale 4x. La imagen es demasiado grande para procesarse. Intenta con una imagen más pequeña o que no haya sido upscaled previamente.'
        }, { status: 400 })
      }

      // Error de imagen muy grande (Real-ESRGAN legacy)
      if (error.message.includes('total number of pixels') || error.message.includes('greater than the max size')) {
        return NextResponse.json({
          error: 'Imagen demasiado grande',
          details: 'La imagen es demasiado grande para procesarse. Intenta con una imagen más pequeña.'
        }, { status: 400 })
      }
    }

    return NextResponse.json({
      error: 'Error al procesar imagen con AI upscaling',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

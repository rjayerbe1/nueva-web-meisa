import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { Storage } from '@google-cloud/storage'
import Replicate from 'replicate'

// Inicializar Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Inicializar Google Cloud Storage
const storage = new Storage({
  projectId: 'meisa-web-prod-2025'
})
const bucket = storage.bucket('meisa-imagenes')

interface ExpandImageRequest {
  imageUrl: string
  top: number      // Pixeles a expandir arriba
  right: number    // Pixeles a expandir derecha
  bottom: number   // Pixeles a expandir abajo
  left: number     // Pixeles a expandir izquierda
  originalWidth: number
  originalHeight: number
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body: ExpandImageRequest = await request.json()
    const { imageUrl, top, right, bottom, left, originalWidth, originalHeight } = body

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL de imagen requerida' }, { status: 400 })
    }

    // Validar que la imagen sea de Google Cloud Storage
    if (!imageUrl.includes('storage.googleapis.com')) {
      return NextResponse.json({
        error: 'Solo se pueden expandir imágenes de Google Cloud Storage'
      }, { status: 400 })
    }

    console.log('🎨 [Expand] Iniciando expansión con IA (Bria Expand):', imageUrl)
    console.log('📐 [Expand] Expansión:', { top, right, bottom, left })

    // Calcular dimensiones del canvas expandido
    const canvasWidth = originalWidth + left + right
    const canvasHeight = originalHeight + top + bottom

    console.log(`📊 [Expand] Original: ${originalWidth}x${originalHeight}`)
    console.log(`📊 [Expand] Expandido: ${canvasWidth}x${canvasHeight}`)

    // Validar que haya expansión
    if (top === 0 && bottom === 0 && left === 0 && right === 0) {
      throw new Error('Debes especificar al menos un lado para expandir')
    }

    // Calcular posición de la imagen original en el canvas expandido
    // La imagen original se posiciona según la expansión que hagamos
    const originalImageX = left  // Si expandimos left, la imagen se desplaza a la derecha
    const originalImageY = top   // Si expandimos top, la imagen se desplaza hacia abajo

    console.log(`📍 [Expand] Posición imagen original: (${originalImageX}, ${originalImageY})`)

    // Llamar a Bria Expand
    console.log('🤖 [Expand] Llamando a Bria Expand AI...')

    const output = await replicate.run(
      "bria/expand-image:18d2dffd371ca05b45b7a4e9d82bae0f1f356563633f48d48dca4ccf82ec489d",
      {
        input: {
          image_url: imageUrl,
          canvas_size: [canvasWidth, canvasHeight],
          original_image_size: [originalWidth, originalHeight],
          original_image_location: [originalImageX, originalImageY],
          prompt: "high quality, detailed, professional photography",
          preserve_alpha: true
        }
      }
    ) as unknown as string

    console.log('✅ [Expand] Bria Expand completado')

    // Descargar imagen expandida
    console.log('📥 [Expand] Descargando imagen expandida desde Replicate...')
    const expandedResponse = await fetch(output)
    if (!expandedResponse.ok) {
      throw new Error('Error descargando imagen expandida')
    }
    const expandedImage = Buffer.from(await expandedResponse.arrayBuffer())

    // Extraer el path de la imagen en GCS
    const urlParts = imageUrl.split('meisa-imagenes/')
    if (urlParts.length < 2) {
      return NextResponse.json({ error: 'URL de imagen inválida' }, { status: 400 })
    }
    const gcsPath = urlParts[1]

    // Crear nombre para la imagen expandida
    const pathParts = gcsPath.split('/')
    const filename = pathParts[pathParts.length - 1]
    const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename
    const extension = filename.lastIndexOf('.') !== -1 ? filename.substring(filename.lastIndexOf('.')) : '.png'
    const expandedFilename = `${filenameWithoutExt}-expanded${extension}`

    // Mantener la misma carpeta que la imagen original
    const folder = pathParts.slice(0, -1).join('/')
    const expandedPath = folder ? `${folder}/${expandedFilename}` : expandedFilename

    console.log('📤 [Expand] Subiendo a GCS:', expandedPath)

    // Subir a Google Cloud Storage
    const gcsFile = bucket.file(expandedPath)
    await gcsFile.save(expandedImage, {
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000',
      },
      public: true
    })

    // URL pública de la imagen expandida
    const expandedUrl = `https://storage.googleapis.com/${bucket.name}/${expandedPath}`

    console.log('✅ [Expand] Completado:', expandedUrl)
    console.log('💡 [Expand] Método usado: Bria Expand AI')
    console.log('💰 [Expand] Costo estimado: ~$0.04 USD')

    return NextResponse.json({
      success: true,
      originalUrl: imageUrl,
      expandedUrl,
      originalSize: { width: originalWidth, height: originalHeight },
      expandedSize: { width: canvasWidth, height: canvasHeight },
      expansion: { top, right, bottom, left },
      method: 'bria-expand-ai',
      cost: 0.04, // Costo de Bria Expand
      message: 'Imagen expandida exitosamente con IA (Bria Expand)'
    })
  } catch (error) {
    console.error('❌ [Expand] Error:', error)

    return NextResponse.json({
      error: 'Error al expandir imagen',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

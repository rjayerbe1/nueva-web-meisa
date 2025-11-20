import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { imageUrl, quality = 85, format = 'auto' } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL de imagen requerida' },
        { status: 400 }
      )
    }

    console.log('🖼️  Optimizando imagen:', imageUrl)
    console.log('   Quality:', quality, '| Format:', format)

    // Descargar la imagen original
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Error al descargar la imagen')
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
    const originalSize = imageBuffer.length

    console.log('   📊 Tamaño original:', (originalSize / 1024 / 1024).toFixed(2), 'MB')

    // Obtener metadata de la imagen
    const metadata = await sharp(imageBuffer).metadata()
    const { width, height, format: originalFormat } = metadata

    console.log('   📐 Dimensiones:', width, 'x', height)
    console.log('   🎨 Formato original:', originalFormat)

    // Determinar formato de salida
    let outputFormat = format === 'auto' ? (originalFormat === 'png' ? 'png' : 'jpeg') : format

    // Configurar Sharp para optimización
    let sharpInstance = sharp(imageBuffer)

    // Aplicar optimizaciones según el formato
    if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      sharpInstance = sharpInstance.jpeg({
        quality: quality,
        progressive: true,
        mozjpeg: true // Mejor compresión con mozjpeg
      })
    } else if (outputFormat === 'png') {
      sharpInstance = sharpInstance.png({
        quality: quality,
        compressionLevel: 9,
        palette: true // Usar paleta si es posible para reducir tamaño
      })
    } else if (outputFormat === 'webp') {
      sharpInstance = sharpInstance.webp({
        quality: quality,
        effort: 6 // Mayor esfuerzo = mejor compresión
      })
    }

    // Procesar imagen
    const optimizedBuffer = await sharpInstance.toBuffer()
    const optimizedSize = optimizedBuffer.length
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1)

    console.log('   ✅ Tamaño optimizado:', (optimizedSize / 1024 / 1024).toFixed(2), 'MB')
    console.log('   💾 Reducción:', reduction + '%')

    // Subir a Google Cloud Storage
    const uploadFormData = new FormData()
    const blob = new Blob([optimizedBuffer], {
      type: `image/${outputFormat === 'jpg' ? 'jpeg' : outputFormat}`
    })
    uploadFormData.append('file', blob, `optimized-${Date.now()}.${outputFormat}`)
    uploadFormData.append('folder', 'categories')

    const uploadResponse = await fetch(
      new URL('/api/admin/upload', request.url).toString(),
      {
        method: 'POST',
        body: uploadFormData,
        headers: {
          'Cookie': request.headers.get('Cookie') || ''
        }
      }
    )

    if (!uploadResponse.ok) {
      throw new Error('Error al subir imagen optimizada')
    }

    const uploadResult = await uploadResponse.json()

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      originalSize: originalSize,
      optimizedSize: optimizedSize,
      reduction: parseFloat(reduction),
      format: outputFormat,
      dimensions: { width, height }
    })

  } catch (error) {
    console.error('❌ Error optimizing image:', error)
    return NextResponse.json(
      {
        error: 'Error al optimizar imagen',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { Storage } from '@google-cloud/storage'

// Inicializar Google Cloud Storage
const storage = new Storage({
  projectId: 'meisa-web-prod-2025'
})
const bucket = storage.bucket('meisa-imagenes')

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    console.log('📤 [Upload Cropped] Subiendo imagen recortada...')

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generar nombre único para la imagen recortada
    const timestamp = Date.now()
    const filename = `cropped-${timestamp}.png`

    // Construir path en GCS
    const gcsPath = folder ? `${folder}/${filename}` : filename

    console.log('📂 [Upload Cropped] Ruta GCS:', gcsPath)

    // Subir a Google Cloud Storage
    const gcsFile = bucket.file(gcsPath)
    await gcsFile.save(buffer, {
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000',
      },
      public: true
    })

    // URL pública de la imagen
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${gcsPath}`

    console.log('✅ [Upload Cropped] Imagen subida:', imageUrl)

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Imagen recortada subida exitosamente'
    })
  } catch (error) {
    console.error('❌ [Upload Cropped] Error:', error)

    return NextResponse.json({
      error: 'Error al subir imagen recortada',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

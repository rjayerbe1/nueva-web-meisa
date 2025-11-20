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
    const folder = (formData.get('folder') as string) || 'categories'

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validar tipo de archivo (imágenes y videos)
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'
    ]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 })
    }

    // Validar tamaño (10MB para imágenes, 100MB para videos)
    const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith('video/') ? '100MB' : '10MB'
      return NextResponse.json({ error: `El archivo es demasiado grande (máx. ${maxSizeMB})` }, { status: 400 })
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`

    // Ruta en GCS
    const gcsPath = `${folder}/${filename}`
    const gcsFile = bucket.file(gcsPath)

    // Subir a Google Cloud Storage
    await gcsFile.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000', // 1 año
      },
      public: true
    })

    // URL pública del archivo
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${gcsPath}`

    console.log('✅ [Upload] Archivo subido a GCS:', publicUrl)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('❌ [Upload] Error al subir archivo:', error)
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
  }
}
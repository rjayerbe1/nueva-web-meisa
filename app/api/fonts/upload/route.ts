import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Storage } from '@google-cloud/storage'

// Inicializar cliente de Google Cloud Storage
const storage = new Storage({
  projectId: 'meisa-web-prod-2025'
})
const bucket = storage.bucket('meisa-imagenes')

// Formatos de fuente permitidos
const ALLOWED_FORMATS = ['ttf', 'otf', 'woff', 'woff2']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const nombre = formData.get('nombre') as string
    const fontFamily = formData.get('fontFamily') as string
    const description = formData.get('description') as string | null
    const category = formData.get('category') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 })
    }

    if (!nombre || !fontFamily) {
      return NextResponse.json({ error: 'Nombre y familia de fuente son requeridos' }, { status: 400 })
    }

    // Validar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }, { status: 400 })
    }

    // Validar formato
    const fileName = file.name
    const fileExtension = fileName.split('.').pop()?.toLowerCase()

    if (!fileExtension || !ALLOWED_FORMATS.includes(fileExtension)) {
      return NextResponse.json({
        error: `Formato no permitido. Formatos válidos: ${ALLOWED_FORMATS.join(', ')}`
      }, { status: 400 })
    }

    // Verificar si ya existe una fuente con ese nombre
    const existingFont = await prisma.customFont.findUnique({
      where: { nombre }
    })

    if (existingFont) {
      return NextResponse.json({
        error: 'Ya existe una fuente con ese nombre'
      }, { status: 400 })
    }

    // Subir archivo a Google Cloud Storage
    console.log('📤 Subiendo fuente a Google Cloud Storage...', fileName)

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const gcsFileName = `${timestamp}-${randomString}.${fileExtension}`

    // Ruta en GCS
    const gcsPath = `fonts/${gcsFileName}`
    const gcsFile = bucket.file(gcsPath)

    // Subir a Google Cloud Storage
    await gcsFile.save(buffer, {
      metadata: {
        contentType: file.type || 'font/woff2',
        cacheControl: 'public, max-age=31536000', // 1 año
      },
      public: true
    })

    // URL pública del archivo
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${gcsPath}`

    console.log('✅ Fuente subida a Google Cloud Storage:', fileUrl)

    // Guardar en base de datos
    const customFont = await prisma.customFont.create({
      data: {
        nombre,
        fontFamily,
        fileUrl,
        fileName,
        fileFormat: fileExtension,
        fileSize: file.size,
        description: description || null,
        category: category || 'Sans-serif',
        uploadedBy: session.user.id,
        isActive: true
      }
    })

    console.log('✅ Fuente guardada en BD:', customFont.id)

    return NextResponse.json({
      message: 'Fuente subida exitosamente',
      font: {
        id: customFont.id,
        nombre: customFont.nombre,
        fontFamily: customFont.fontFamily,
        fileUrl: customFont.fileUrl,
        category: customFont.category
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Error subiendo fuente:', error)
    return NextResponse.json(
      { error: error.message || 'Error al subir la fuente' },
      { status: 500 }
    )
  }
}

// GET: Obtener todas las fuentes personalizadas
export async function GET() {
  try {
    const fonts = await prisma.customFont.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nombre: true,
        fontFamily: true,
        fileUrl: true,
        fileName: true,
        fileFormat: true,
        description: true,
        category: true,
        createdAt: true
      }
    })

    return NextResponse.json({ fonts }, { status: 200 })
  } catch (error: any) {
    console.error('❌ Error obteniendo fuentes:', error)
    return NextResponse.json(
      { error: 'Error al obtener las fuentes' },
      { status: 500 }
    )
  }
}

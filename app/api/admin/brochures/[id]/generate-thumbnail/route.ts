import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await req.json()
    const { thumbnailDataUrl } = body

    if (!thumbnailDataUrl || !thumbnailDataUrl.startsWith('data:image/')) {
      return NextResponse.json({ error: "URL de imagen inválida" }, { status: 400 })
    }

    // Verificar que el brochure existe
    const brochure = await prisma.brochure.findUnique({
      where: { id: params.id }
    })

    if (!brochure) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }

    // Convertir data URL a Buffer
    const base64Data = thumbnailDataUrl.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const filename = `${timestamp}-${randomString}.png`

    // Subir a Google Cloud Storage
    const { Storage } = require('@google-cloud/storage')
    const storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: process.env.GCS_CREDENTIALS ? JSON.parse(process.env.GCS_CREDENTIALS) : undefined
    })

    const bucketName = process.env.GCS_BUCKET_NAME || 'meisa-imagenes'
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(`brochures/thumbnails/${filename}`)

    await file.save(buffer, {
      metadata: {
        contentType: 'image/png',
      },
      public: true,
    })

    const publicUrl = `https://storage.googleapis.com/${bucketName}/brochures/thumbnails/${filename}`

    // Actualizar el thumbnail del brochure
    const updatedBrochure = await prisma.brochure.update({
      where: { id: params.id },
      data: { thumbnail: publicUrl }
    })

    return NextResponse.json({
      success: true,
      thumbnail: publicUrl,
      brochure: updatedBrochure
    })

  } catch (error) {
    console.error('Error generando thumbnail:', error)
    return NextResponse.json({
      error: "Error interno del servidor",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

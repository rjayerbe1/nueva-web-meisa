import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Storage } from '@google-cloud/storage'

// Inicializar Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: process.env.GCS_CREDENTIALS
    ? JSON.parse(process.env.GCS_CREDENTIALS)
    : undefined
})

const bucketName = process.env.GCS_BUCKET_NAME || 'meisa-imagenes'

export async function GET() {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Listar archivos en el bucket con prefijo "categories/videos/"
    const [files] = await storage.bucket(bucketName).getFiles({
      prefix: 'categories/videos/',
      delimiter: '/'
    })

    // Filtrar solo videos y obtener metadata
    const videos = await Promise.all(
      files
        .filter(file => {
          const ext = file.name.split('.').pop()?.toLowerCase()
          return ext && ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v'].includes(ext)
        })
        .map(async (file) => {
          const [metadata] = await file.getMetadata()
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${file.name}`

          return {
            url: publicUrl,
            name: file.name.split('/').pop() || file.name,
            size: typeof metadata.size === 'string' ? parseInt(metadata.size) : (metadata.size || 0),
            updated: metadata.updated || new Date().toISOString(),
            contentType: metadata.contentType || 'video/mp4'
          }
        })
    )

    // Ordenar por fecha de actualización (más reciente primero)
    videos.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())

    return NextResponse.json({
      videos,
      count: videos.length
    })
  } catch (error) {
    console.error('Error listing category videos:', error)
    return NextResponse.json(
      { error: 'Error al listar videos de categorías' },
      { status: 500 }
    )
  }
}

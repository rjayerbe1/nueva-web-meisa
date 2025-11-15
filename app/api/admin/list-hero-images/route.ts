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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    console.log('📸 [List Hero Images] Listando imágenes de hero/')

    // Listar todos los archivos en la carpeta hero/
    const [files] = await bucket.getFiles({
      prefix: 'hero/',
      delimiter: '/'
    })

    // Filtrar solo imágenes y crear URLs públicas
    const imageFiles = files
      .filter(file => {
        const name = file.name.toLowerCase()
        return (
          name.endsWith('.jpg') ||
          name.endsWith('.jpeg') ||
          name.endsWith('.png') ||
          name.endsWith('.webp') ||
          name.endsWith('.gif')
        )
      })
      .map(file => ({
        name: file.name.split('/').pop() || file.name,
        url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
        uploadedAt: file.metadata.timeCreated || new Date().toISOString(),
        size: file.metadata.size || 0
      }))
      .sort((a, b) => {
        // Ordenar por fecha de subida, más recientes primero
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      })

    console.log(`✅ [List Hero Images] Encontradas ${imageFiles.length} imágenes`)

    return NextResponse.json({
      success: true,
      images: imageFiles,
      total: imageFiles.length
    })

  } catch (error) {
    console.error('❌ [List Hero Images] Error:', error)
    return NextResponse.json({
      error: 'Error al listar imágenes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

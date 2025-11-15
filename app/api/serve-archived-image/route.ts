import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filename = searchParams.get('filename')
    const source = searchParams.get('source') || 'archived'

    if (!filename) {
      return new NextResponse('Filename required', { status: 400 })
    }

    // Determinar la carpeta base según la fuente
    const baseDir = source === 'brochure'
      ? '/Users/rjayerbe/Web Development Local/meisa.com.co/IMAGENES STOCK BROCHURE'
      : '/Users/rjayerbe/Web Development Local/meisa.com.co/archived-outros-images'

    const filePath = path.join(baseDir, filename)

    // Verificar que el archivo existe y está dentro de la carpeta permitida
    if (!filePath.startsWith(baseDir)) {
      return new NextResponse('Invalid path', { status: 403 })
    }

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Leer el archivo
    const fileBuffer = fs.readFileSync(filePath)

    // Determinar el content-type basado en la extensión
    const ext = path.extname(filename).toLowerCase()
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    }
    const contentType = contentTypeMap[ext] || 'application/octet-stream'

    // Devolver la imagen
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

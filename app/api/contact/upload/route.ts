import { NextRequest, NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'

const storage = new Storage({ projectId: 'meisa-web-prod-2025' })
const bucket = storage.bucket('meisa-imagenes')

const MAX_SIZE_BYTES = 25 * 1024 * 1024
const FOLDER = 'contacto'

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/acad',
  'application/x-acad',
  'image/vnd.dwg',
  'application/dxf',
  'image/vnd.dxf',
  'application/octet-stream',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
])

const ALLOWED_EXTENSIONS = new Set([
  'pdf',
  'dwg',
  'dxf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'zip',
  'rar',
  'jpg',
  'jpeg',
  'png',
  'webp',
])

function sanitizeFilename(name: string): string {
  const cleaned = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
  return cleaned.length > 80 ? cleaned.slice(-80) : cleaned
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `El archivo supera los ${MAX_SIZE_BYTES / 1024 / 1024} MB` },
        { status: 400 },
      )
    }

    const originalName = file.name || 'archivo'
    const ext = (originalName.split('.').pop() || '').toLowerCase()

    const mimeOk = ALLOWED_MIME.has(file.type)
    const extOk = ALLOWED_EXTENSIONS.has(ext)
    if (!mimeOk && !extOk) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido' },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 10)
    const safeName = sanitizeFilename(originalName)
    const gcsPath = `${FOLDER}/${timestamp}-${random}-${safeName}`

    const gcsFile = bucket.file(gcsPath)
    await gcsFile.save(buffer, {
      metadata: {
        contentType: file.type || 'application/octet-stream',
        cacheControl: 'private, max-age=86400',
        metadata: { source: 'contacto-form' },
      },
      public: true,
    })

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${gcsPath}`

    return NextResponse.json({
      url: publicUrl,
      name: originalName,
      size: file.size,
      mime: file.type || 'application/octet-stream',
    })
  } catch (error) {
    console.error('[Contact Upload] Error:', error)
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 },
    )
  }
}

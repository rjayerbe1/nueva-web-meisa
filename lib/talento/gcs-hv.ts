import { Storage } from "@google-cloud/storage"

// Bucket PRIVADO para hojas de vida (public-access-prevention enforced).
// Nunca usar meisa-imagenes aquí: ese bucket es público a nivel de bucket
// y un CV expuesto es una violación de datos personales (Ley 1581/2012).
// Los archivos se sirven únicamente vía el proxy autenticado
// /api/admin/talento/cv/[candidatoId].
const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID || "meisa-web-prod-2025"
const HV_BUCKET_NAME = process.env.GCS_HV_BUCKET_NAME || "meisa-hojas-de-vida"

let _bucket: ReturnType<Storage["bucket"]> | null = null

function getBucket() {
  if (!_bucket) {
    const storage = new Storage({ projectId: GCS_PROJECT_ID })
    _bucket = storage.bucket(HV_BUCKET_NAME)
  }
  return _bucket
}

export interface CvUploadResult {
  pathGcs: string
  fileName: string
  contentType: string
  size: number
}

export async function uploadCv(
  buffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<CvUploadResult> {
  const bucket = getBucket()
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80)
  const pathGcs = `cv/${timestamp}-${random}-${safeName}`

  await bucket.file(pathGcs).save(buffer, {
    metadata: {
      contentType,
      cacheControl: "private, no-store",
    },
  })

  return { pathGcs, fileName: safeName, contentType, size: buffer.byteLength }
}

export async function downloadCv(pathGcs: string): Promise<Buffer> {
  const [buffer] = await getBucket().file(pathGcs).download()
  return buffer
}

export async function deleteCv(pathGcs: string): Promise<void> {
  try {
    await getBucket().file(pathGcs).delete({ ignoreNotFound: true })
  } catch (error) {
    console.warn(`[gcs-hv] failed to delete ${pathGcs}:`, error)
  }
}

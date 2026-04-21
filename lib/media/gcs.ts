import { Storage } from "@google-cloud/storage"

const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID || "meisa-web-prod-2025"
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || "meisa-imagenes"

let _storage: Storage | null = null
let _bucket: ReturnType<Storage["bucket"]> | null = null

function getBucket() {
  if (!_bucket) {
    _storage = new Storage({ projectId: GCS_PROJECT_ID })
    _bucket = _storage.bucket(GCS_BUCKET_NAME)
  }
  return _bucket
}

export function bucketName() {
  return GCS_BUCKET_NAME
}

export interface UploadResult {
  url: string
  pathGcs: string
  fileName: string
  contentType: string
  size: number
}

export async function uploadToGcs(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  folder = "general",
): Promise<UploadResult> {
  const bucket = getBucket()
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
  const pathGcs = `${folder}/${timestamp}-${random}-${safeName}`
  const gcsFile = bucket.file(pathGcs)

  await gcsFile.save(buffer, {
    metadata: {
      contentType,
      cacheControl: "public, max-age=31536000",
    },
    public: true,
  })

  return {
    url: `https://storage.googleapis.com/${bucket.name}/${pathGcs}`,
    pathGcs,
    fileName: safeName,
    contentType,
    size: buffer.byteLength,
  }
}

export async function deleteFromGcs(pathGcs: string): Promise<void> {
  const bucket = getBucket()
  try {
    await bucket.file(pathGcs).delete({ ignoreNotFound: true })
  } catch (error) {
    console.warn(`[gcs] failed to delete ${pathGcs}:`, error)
  }
}

export function pathFromPublicUrl(url: string): string | null {
  const prefix = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/`
  if (!url.startsWith(prefix)) return null
  return url.slice(prefix.length)
}

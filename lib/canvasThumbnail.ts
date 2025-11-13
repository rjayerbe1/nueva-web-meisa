import * as fabric from 'fabric'

/**
 * Genera un thumbnail (imagen en base64) desde un canvas de Fabric.js
 *
 * @param canvas - Instancia de fabric.Canvas
 * @param options - Opciones de generación
 * @returns Data URL (base64) del thumbnail
 */
export async function generateCanvasThumbnail(
  canvas: any,
  options: {
    format?: 'png' | 'jpeg' | 'jpg'
    quality?: number
    multiplier?: number
    width?: number
    height?: number
  } = {}
): Promise<string> {
  const {
    format = 'png',
    quality = 0.8,
    multiplier = 0.3, // Escala para thumbnail (30% del tamaño original)
  } = options

  try {
    // Generar data URL del canvas
    const dataURL = canvas.toDataURL({
      format,
      quality,
      multiplier
    })

    return dataURL
  } catch (error) {
    console.error('Error generando thumbnail del canvas:', error)
    throw new Error('No se pudo generar el thumbnail')
  }
}

/**
 * Genera un thumbnail desde canvasData JSON (sin instancia de canvas)
 * Crea un canvas temporal, carga el JSON, genera thumbnail y lo destruye
 *
 * @param canvasData - JSON de Fabric.js
 * @param config - Configuración del canvas (width, height)
 * @returns Data URL (base64) del thumbnail
 */
export async function generateThumbnailFromJSON(
  canvasData: any,
  config: { width: number; height: number } = { width: 1200, height: 800 }
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Crear canvas temporal en memoria
    const tempCanvas = new (fabric as any).Canvas(null as any, {
      width: config.width,
      height: config.height
    })

    // Cargar el JSON
    tempCanvas.loadFromJSON(canvasData, () => {
      try {
        // Generar thumbnail
        const dataURL = tempCanvas.toDataURL({
          format: 'png',
          quality: 0.8,
          multiplier: 0.3
        })

        // Limpiar
        tempCanvas.dispose()

        resolve(dataURL)
      } catch (error) {
        tempCanvas.dispose()
        reject(error)
      }
    })
  })
}

/**
 * Sube un thumbnail en base64 a Uploadcare y retorna la URL
 *
 * @param base64Data - Data URL en base64
 * @returns URL pública del thumbnail en Uploadcare
 */
export async function uploadThumbnailToUploadcare(base64Data: string): Promise<string> {
  try {
    // Convertir base64 a blob
    const response = await fetch(base64Data)
    const blob = await response.blob()

    // Crear FormData
    const formData = new FormData()
    formData.append('file', blob, 'thumbnail.png')

    // Subir a tu API de upload
    const uploadResponse = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    })

    if (!uploadResponse.ok) {
      throw new Error('Error al subir thumbnail')
    }

    const data = await uploadResponse.json()
    return data.url
  } catch (error) {
    console.error('Error subiendo thumbnail:', error)
    throw error
  }
}

/**
 * Función completa: genera thumbnail y lo sube automáticamente
 *
 * @param canvas - Instancia de fabric.Canvas
 * @param uploadToServer - Si es true, sube a Uploadcare; si es false, retorna base64
 * @returns URL del thumbnail (Uploadcare) o data URL (base64)
 */
export async function generateAndUploadThumbnail(
  canvas: any,
  uploadToServer: boolean = true
): Promise<string> {
  // Generar thumbnail en base64
  const base64Thumbnail = await generateCanvasThumbnail(canvas)

  if (!uploadToServer) {
    return base64Thumbnail
  }

  // Subir a servidor
  const thumbnailUrl = await uploadThumbnailToUploadcare(base64Thumbnail)
  return thumbnailUrl
}

/**
 * Valida si un data URL es válido
 */
export function isValidDataURL(dataURL: string): boolean {
  return dataURL.startsWith('data:image/')
}

/**
 * Obtiene el tamaño en bytes de un data URL
 */
export function getDataURLSize(dataURL: string): number {
  const base64 = dataURL.split(',')[1]
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  return (base64.length * 0.75) - padding
}

/**
 * Formatea el tamaño en bytes a formato legible
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

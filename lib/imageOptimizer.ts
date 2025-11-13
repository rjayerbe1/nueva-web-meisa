/**
 * Utilidad para optimizar imágenes antes de subirlas
 * - Redimensiona imágenes grandes
 * - Comprime para reducir tamaño
 * - Genera thumbnails
 * - Convierte a formatos optimizados
 */

import imageCompression from 'browser-image-compression'

export interface ImageOptimizationConfig {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  thumbnailSize?: number
  base64Threshold?: number
}

export interface OptimizedImageResult {
  original: {
    file: File
    url: string
    size: number
    width: number
    height: number
  }
  optimized: {
    file: File
    url: string
    size: number
    width: number
    height: number
  }
  thumbnail: {
    file: File
    url: string
    size: number
  }
  shouldUseBase64: boolean
  base64?: string
}

const DEFAULT_CONFIG: Required<ImageOptimizationConfig> = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
  thumbnailSize: 300,
  base64Threshold: 100 * 1024, // 100KB
}

/**
 * Obtiene dimensiones reales de una imagen
 */
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Convierte archivo a Base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Optimiza una imagen para uso general
 */
async function optimizeImage(
  file: File,
  config: Required<ImageOptimizationConfig>
): Promise<File> {
  const options = {
    maxWidthOrHeight: Math.max(config.maxWidth, config.maxHeight),
    useWebWorker: true,
    quality: config.quality,
    fileType: file.type as any,
  }

  try {
    const compressedFile = await imageCompression(file, options)
    console.log('✅ [ImageOptimizer] Imagen optimizada:', {
      originalSize: (file.size / 1024).toFixed(2) + 'KB',
      optimizedSize: (compressedFile.size / 1024).toFixed(2) + 'KB',
      reduction: (((file.size - compressedFile.size) / file.size) * 100).toFixed(1) + '%'
    })
    return compressedFile
  } catch (error) {
    console.error('❌ [ImageOptimizer] Error optimizando imagen:', error)
    return file
  }
}

/**
 * Genera thumbnail de una imagen
 */
async function generateThumbnail(
  file: File,
  size: number
): Promise<File> {
  const options = {
    maxWidthOrHeight: size,
    useWebWorker: true,
    quality: 0.8,
    fileType: file.type as any,
  }

  try {
    const thumbnail = await imageCompression(file, options)
    // Renombrar archivo para indicar que es thumbnail
    const thumbnailFile = new File(
      [thumbnail],
      file.name.replace(/(\.\w+)$/, '-thumb$1'),
      { type: thumbnail.type }
    )
    console.log('✅ [ImageOptimizer] Thumbnail generado:', (thumbnailFile.size / 1024).toFixed(2) + 'KB')
    return thumbnailFile
  } catch (error) {
    console.error('❌ [ImageOptimizer] Error generando thumbnail:', error)
    return file
  }
}

/**
 * Función principal: optimiza una imagen completamente
 */
export async function optimizeImageComplete(
  file: File,
  config: Partial<ImageOptimizationConfig> = {}
): Promise<OptimizedImageResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  console.log('🖼️ [ImageOptimizer] Iniciando optimización:', file.name)

  try {
    // 1. Obtener dimensiones originales
    const originalDimensions = await getImageDimensions(file)
    const originalUrl = URL.createObjectURL(file)

    // 2. Optimizar imagen principal
    const optimizedFile = await optimizeImage(file, finalConfig)
    const optimizedUrl = URL.createObjectURL(optimizedFile)
    const optimizedDimensions = await getImageDimensions(optimizedFile)

    // 3. Generar thumbnail
    const thumbnailFile = await generateThumbnail(file, finalConfig.thumbnailSize)
    const thumbnailUrl = URL.createObjectURL(thumbnailFile)

    // 4. Decidir si usar Base64 (solo para imágenes pequeñas)
    const shouldUseBase64 = optimizedFile.size < finalConfig.base64Threshold
    let base64: string | undefined

    if (shouldUseBase64) {
      base64 = await fileToBase64(optimizedFile)
      console.log('📦 [ImageOptimizer] Imagen convertida a Base64 (pequeña)')
    } else {
      console.log('🔗 [ImageOptimizer] Imagen usará URL (grande)')
    }

    const result: OptimizedImageResult = {
      original: {
        file,
        url: originalUrl,
        size: file.size,
        width: originalDimensions.width,
        height: originalDimensions.height,
      },
      optimized: {
        file: optimizedFile,
        url: optimizedUrl,
        size: optimizedFile.size,
        width: optimizedDimensions.width,
        height: optimizedDimensions.height,
      },
      thumbnail: {
        file: thumbnailFile,
        url: thumbnailUrl,
        size: thumbnailFile.size,
      },
      shouldUseBase64,
      base64,
    }

    console.log('✅ [ImageOptimizer] Optimización completada:', {
      originalSize: (result.original.size / 1024).toFixed(2) + 'KB',
      optimizedSize: (result.optimized.size / 1024).toFixed(2) + 'KB',
      thumbnailSize: (result.thumbnail.size / 1024).toFixed(2) + 'KB',
      shouldUseBase64: result.shouldUseBase64,
    })

    return result
  } catch (error) {
    console.error('❌ [ImageOptimizer] Error en optimización completa:', error)
    // En caso de error, devolver el archivo original sin optimizar
    const originalUrl = URL.createObjectURL(file)
    const dimensions = await getImageDimensions(file)

    return {
      original: {
        file,
        url: originalUrl,
        size: file.size,
        width: dimensions.width,
        height: dimensions.height,
      },
      optimized: {
        file,
        url: originalUrl,
        size: file.size,
        width: dimensions.width,
        height: dimensions.height,
      },
      thumbnail: {
        file,
        url: originalUrl,
        size: file.size,
      },
      shouldUseBase64: file.size < finalConfig.base64Threshold,
      base64: file.size < finalConfig.base64Threshold ? await fileToBase64(file) : undefined,
    }
  }
}

/**
 * Valida si un archivo es una imagen válida
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no válido. Solo se permiten: JPEG, PNG, GIF, WebP, SVG'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo: 10MB`
    }
  }

  return { valid: true }
}

/**
 * Limpia URLs creadas con createObjectURL
 */
export function cleanupImageUrls(...urls: string[]) {
  urls.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
}

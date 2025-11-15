/**
 * Utilidades para manipulación de canvas e imágenes
 */

/**
 * Convierte un canvas a Blob
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string = 'image/png',
  quality: number = 1.0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert canvas to blob'))
        }
      },
      mimeType,
      quality
    )
  })
}

/**
 * Convierte un canvas a File
 */
export async function canvasToFile(
  canvas: HTMLCanvasElement,
  filename: string,
  mimeType: string = 'image/png',
  quality: number = 1.0
): Promise<File> {
  const blob = await canvasToBlob(canvas, mimeType, quality)
  return new File([blob], filename, { type: mimeType })
}

/**
 * Carga una imagen desde una URL y retorna un HTMLImageElement
 */
export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * Crea un canvas con las dimensiones de una imagen
 */
export function createCanvasFromImage(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(img, 0, 0)
  }
  return canvas
}

/**
 * Convierte un canvas de máscara a escala de grises
 * (blanco = área a editar, negro = área a preservar)
 */
export function normalizeMaskCanvas(maskCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = maskCanvas.width
  canvas.height = maskCanvas.height

  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  ctx.drawImage(maskCanvas, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Convertir a escala de grises: si tiene alpha > 0, es blanco (255), sino negro (0)
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]
    const value = alpha > 0 ? 255 : 0
    data[i] = value     // R
    data[i + 1] = value // G
    data[i + 2] = value // B
    data[i + 3] = 255   // A
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

/**
 * Redimensiona una imagen manteniendo aspect ratio
 */
export function resizeImage(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): HTMLCanvasElement {
  let width = img.width
  let height = img.height

  // Calcular nuevo tamaño manteniendo aspect ratio
  if (width > maxWidth) {
    height = (maxWidth / width) * height
    width = maxWidth
  }

  if (height > maxHeight) {
    width = (maxHeight / height) * width
    height = maxHeight
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(img, 0, 0, width, height)
  }

  return canvas
}

/**
 * Obtiene coordenadas del mouse/touch relativas al canvas
 */
export function getCanvasCoordinates(
  event: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  let clientX: number
  let clientY: number

  if ('touches' in event && event.touches.length > 0) {
    clientX = event.touches[0].clientX
    clientY = event.touches[0].clientY
  } else if ('clientX' in event) {
    clientX = event.clientX
    clientY = event.clientY
  } else {
    return { x: 0, y: 0 }
  }

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  }
}

/**
 * Invierte los colores de una máscara
 */
export function invertMask(maskCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = maskCanvas.width
  canvas.height = maskCanvas.height

  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  ctx.drawImage(maskCanvas, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Invertir cada pixel
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]         // R
    data[i + 1] = 255 - data[i + 1] // G
    data[i + 2] = 255 - data[i + 2] // B
    // Alpha se mantiene igual
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

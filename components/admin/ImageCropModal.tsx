'use client'

import React, { useState, useRef } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { X, Check, RotateCcw, Upload } from 'lucide-react'
import { toast } from 'sonner'

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedImageUrl: string) => void
  imageFile: File | null
  aspectRatio?: number // Nuevo prop para aspect ratio (ancho/alto)
  folder?: string // Carpeta en GCS donde subir la imagen
  freeCrop?: boolean // Recorte libre sin proporción fija (ideal para logos)
  outputType?: 'image/jpeg' | 'image/png' | 'image/webp' // Formato de salida
}

export default function ImageCropModal({
  isOpen,
  onClose,
  onCropComplete,
  imageFile,
  aspectRatio = 1, // Default 1:1 (cuadrado)
  folder = 'hero', // Default folder
  freeCrop = false,
  outputType = 'image/jpeg'
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  })
  const [imageUrl, setImageUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      setImageUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [imageFile])

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Set canvas size based on aspect ratio - mejor calidad
    let canvasWidth: number
    let canvasHeight: number

    if (freeCrop) {
      // Recorte libre: tamaño real del recorte, limitado a 1600px en el lado mayor
      let w = crop.width * scaleX
      let h = crop.height * scaleY
      const max = 1600
      if (w > max || h > max) {
        const r = Math.min(max / w, max / h)
        w *= r
        h *= r
      }
      canvasWidth = Math.max(1, Math.round(w))
      canvasHeight = Math.max(1, Math.round(h))
    } else if (aspectRatio >= 1) {
      // Landscape or square
      canvasWidth = 1600
      canvasHeight = Math.round(1600 / aspectRatio)
    } else {
      // Portrait
      canvasHeight = 2000
      canvasWidth = Math.round(2000 * aspectRatio)
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvasWidth,
      canvasHeight
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        resolve(blob)
      }, outputType, 0.95)
    })
  }

  const handleCropComplete = async () => {
    if (!imgRef.current || !crop.width || !crop.height) return

    try {
      setUploading(true)
      const toastId = toast.loading('Recortando y subiendo imagen...')

      // Obtener blob de la imagen cropped
      const croppedBlob = await getCroppedImg(imgRef.current, {
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height,
        unit: 'px'
      } as PixelCrop)

      // Subir a Google Cloud Storage
      const formData = new FormData()
      const ext = outputType === 'image/png' ? 'png' : outputType === 'image/webp' ? 'webp' : 'jpg'
      const fileName = `cropped-${Date.now()}.${ext}`
      formData.append('file', croppedBlob, fileName)
      formData.append('folder', folder)

      const response = await fetch('/api/admin/upload-to-gcs', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error subiendo imagen')
      }

      const data = await response.json()

      toast.success('Imagen recortada y subida exitosamente', { id: toastId })
      onCropComplete(data.url)
      onClose()

    } catch (error) {
      console.error('Error cropping image:', error)
      toast.error(error instanceof Error ? error.message : 'Error procesando imagen')
    } finally {
      setUploading(false)
    }
  }

  const resetCrop = () => {
    if (imgRef.current) {
      if (freeCrop) {
        const { width, height } = imgRef.current
        setCrop({ unit: 'px', x: 0, y: 0, width, height })
        return
      }
      const { width, height } = imgRef.current

      let cropWidth: number
      let cropHeight: number

      if (aspectRatio >= 1) {
        cropWidth = Math.min(width, height * aspectRatio) * 0.8
        cropHeight = cropWidth / aspectRatio
      } else {
        cropHeight = Math.min(height, width / aspectRatio) * 0.8
        cropWidth = cropHeight * aspectRatio
      }
      
      const x = (width - cropWidth) / 2
      const y = (height - cropHeight) / 2
      
      setCrop({
        unit: 'px',
        x,
        y,
        width: cropWidth,
        height: cropHeight,
      })
    }
  }

  if (!isOpen || !imageFile) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">
            Ajustar Imagen
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-sm text-gray-600 mb-4">
            {freeCrop
              ? 'Arrastra las esquinas para seleccionar el área del logo que quieres mantener.'
              : `Arrastra para seleccionar el área que quieres mantener. La imagen se recortará con proporción ${aspectRatio >= 1 ? `${Math.round(aspectRatio * 100) / 100}:1` : `1:${Math.round(100 / aspectRatio) / 100}`}.`}
          </p>

          <div className="flex justify-center mb-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={freeCrop ? undefined : aspectRatio}
              circularCrop={false}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Crop preview"
                className="max-w-full max-h-[50vh] object-contain"
                onLoad={() => {
                  // Inicializar el crop cuando la imagen se carga
                  if (freeCrop) {
                    const { width, height } = imgRef.current!
                    setCrop({ unit: 'px', x: 0, y: 0, width, height })
                    return
                  }
                  const { width, height } = imgRef.current!

                  let cropWidth: number
                  let cropHeight: number

                  if (aspectRatio >= 1) {
                    // Landscape: basar en el ancho
                    cropWidth = Math.min(width, height * aspectRatio) * 0.8
                    cropHeight = cropWidth / aspectRatio
                  } else {
                    // Portrait: basar en la altura
                    cropHeight = Math.min(height, width / aspectRatio) * 0.8
                    cropWidth = cropHeight * aspectRatio
                  }
                  
                  const x = (width - cropWidth) / 2
                  const y = (height - cropHeight) / 2
                  
                  setCrop({
                    unit: 'px',
                    x,
                    y,
                    width: cropWidth,
                    height: cropHeight,
                  })
                }}
              />
            </ReactCrop>
          </div>

          {/* Preview */}
          {!freeCrop && (
            <div className="flex items-center gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                <div
                  className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50"
                  style={{
                    width: aspectRatio >= 1 ? '96px' : `${Math.round(80 * aspectRatio)}px`,
                    height: aspectRatio >= 1 ? `${Math.round(96 / aspectRatio)}px` : '80px'
                  }}
                >
                  {imageUrl && crop.width && crop.height && (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundPosition: `${-crop.x}px ${-crop.y}px`,
                        backgroundSize: `${imgRef.current?.width || 0}px ${imgRef.current?.height || 0}px`,
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  La imagen será redimensionada manteniendo la proporción {aspectRatio >= 1 ? `${Math.round(aspectRatio * 100) / 100}:1` : `1:${Math.round(100 / aspectRatio) / 100}`} y la calidad.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Always visible */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={resetCrop}
            disabled={uploading}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Restablecer
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleCropComplete}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 animate-pulse" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Aplicar y Subir
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
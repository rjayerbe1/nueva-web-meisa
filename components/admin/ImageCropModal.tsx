'use client'

import React, { useState, useRef } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { X, Check, RotateCcw } from 'lucide-react'

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedImageUrl: string) => void
  imageFile: File | null
  aspectRatio?: number // Nuevo prop para aspect ratio (ancho/alto)
}

export default function ImageCropModal({ 
  isOpen, 
  onClose, 
  onCropComplete, 
  imageFile,
  aspectRatio = 1 // Default 1:1 (cuadrado)
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  })
  const [imageUrl, setImageUrl] = useState<string>('')
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
  ): Promise<string> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Set canvas size based on aspect ratio
    let canvasWidth: number
    let canvasHeight: number
    
    if (aspectRatio >= 1) {
      // Landscape or square
      canvasWidth = 800
      canvasHeight = Math.round(800 / aspectRatio)
    } else {
      // Portrait
      canvasHeight = 800
      canvasWidth = Math.round(800 * aspectRatio)
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

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty')
        }
        const url = URL.createObjectURL(blob)
        resolve(url)
      }, 'image/jpeg', 0.9)
    })
  }

  const handleCropComplete = async () => {
    if (!imgRef.current || !crop.width || !crop.height) return

    try {
      const croppedImageUrl = await getCroppedImg(imgRef.current, {
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height,
        unit: 'px'
      } as PixelCrop)
      
      onCropComplete(croppedImageUrl)
      onClose()
    } catch (error) {
      console.error('Error cropping image:', error)
    }
  }

  const resetCrop = () => {
    if (imgRef.current) {
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
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
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

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Arrastra para seleccionar el área que quieres mantener. La imagen se recortará con proporción {aspectRatio >= 1 ? `${Math.round(aspectRatio * 100) / 100}:1` : `1:${Math.round(100 / aspectRatio) / 100}`}.
          </p>
          
          <div className="flex justify-center mb-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={aspectRatio} // Usar aspect ratio dinámico
              circularCrop={false}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Crop preview"
                className="max-w-full max-h-96 object-contain"
                onLoad={() => {
                  // Inicializar el crop cuando la imagen se carga
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={resetCrop}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Restablecer
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCropComplete}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Check className="h-4 w-4" />
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
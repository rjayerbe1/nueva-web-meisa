"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import NextImage from "next/image"
import { toast } from "react-hot-toast"

interface ImageUploaderProps {
  images?: string[]
  onImagesChange?: (images: string[]) => void
  onUpload?: (urls: string[]) => void
  maxImages?: number
  maxFiles?: number
  acceptedFileTypes?: string[]
  label?: string
}

export function ImageUploaderFixed({ 
  images = [], 
  onImagesChange, 
  onUpload,
  maxImages = 10,
  maxFiles = 1,
  acceptedFileTypes = ['image/*'],
  label = 'Subir imágenes'
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const maxCount = maxFiles || maxImages
  const currentImages = images || []

  // Función para convertir imagen a WebP
  const convertToWebP = (file: File, quality: number = 0.9): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new globalThis.Image()
      
      img.onload = () => {
        // Configurar tamaño del canvas (optimizar para logos)
        const maxWidth = 800
        const maxHeight = 600
        let { width, height } = img
        
        // Redimensionar si es muy grande
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }
        
        canvas.width = width
        canvas.height = height
        
        // Dibujar imagen en canvas
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Convertir a WebP
        const webpDataUrl = canvas.toDataURL('image/webp', quality)
        resolve(webpDataUrl)
      }
      
      img.onerror = () => reject(new Error('Error al procesar la imagen'))
      
      // Crear URL temporal para cargar la imagen
      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Error al leer el archivo'))
      reader.readAsDataURL(file)
    })
  }

  // Función para convertir File a base64 para previsualización
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Función de subida simulada (en desarrollo)
  const uploadToServer = async (file: File): Promise<string> => {
    // Crear FormData para enviar el archivo
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      // En desarrollo, podemos crear una URL temporal
      // En producción, esto debería ser una llamada real al servidor
      if (process.env.NODE_ENV === 'development') {
        // Simular tiempo de subida
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Generar un nombre único para el archivo WebP
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(7)
        const fileName = `client-logo-${timestamp}-${randomId}.webp`
        
        // Retornar URL relativa que se guardará en la BD
        return `/images/clients/${fileName}`
      } else {
        // En producción, hacer llamada real al endpoint de subida
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Error al subir archivo')
        }
        
        const data = await response.json()
        return data.url
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setError(null)
    setIsUploading(true)

    try {
      // Validar archivos
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) { // 10MB
          throw new Error(`El archivo ${file.name} es demasiado grande (máximo 10MB)`)
        }
        
        if (!file.type.startsWith('image/')) {
          throw new Error(`El archivo ${file.name} no es una imagen válida`)
        }
      }

      // Procesar archivos
      const urls: string[] = []
      
      for (const file of files.slice(0, maxCount)) {
        try {
          // Convertir a WebP para optimizar tamaño
          const webpDataUrl = await convertToWebP(file, 0.9)
          
          if (process.env.NODE_ENV === 'development') {
            // En desarrollo, usar la imagen WebP convertida
            urls.push(webpDataUrl)
          } else {
            // En producción, crear un blob WebP y subirlo
            const response = await fetch(webpDataUrl)
            const blob = await response.blob()
            const webpFile = new File([blob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' })
            const url = await uploadToServer(webpFile)
            urls.push(url)
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError)
          throw new Error(`Error procesando ${file.name}`)
        }
      }
      
      // Llamar callback correspondiente
      if (onUpload) {
        onUpload(urls)
        toast.success(`${urls.length} imagen(es) subida(s) correctamente`)
      } else if (onImagesChange) {
        const updatedImages = [...currentImages, ...urls].slice(0, maxCount)
        onImagesChange(updatedImages)
        toast.success(`${urls.length} imagen(es) agregada(s)`)
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al subir imagen'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Error uploading images:", error)
    } finally {
      setIsUploading(false)
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [currentImages, maxCount, onImagesChange, onUpload])

  const removeImage = useCallback((index: number) => {
    if (onImagesChange) {
      const updatedImages = currentImages.filter((_, i) => i !== index)
      onImagesChange(updatedImages)
    } else if (onUpload) {
      onUpload([])
    }
    toast.success('Imagen eliminada')
  }, [currentImages, onImagesChange, onUpload])

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-6 text-center transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxCount > 1}
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading || currentImages.length >= maxCount}
        />
        
        <div 
          onClick={currentImages.length >= maxCount || isUploading ? undefined : handleUploadClick}
          className={`cursor-pointer ${
            currentImages.length >= maxCount || isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isUploading
              ? "Subiendo imagen..."
              : currentImages.length >= maxCount
              ? `Máximo ${maxCount} ${maxCount === 1 ? 'imagen' : 'imágenes'}`
              : label || "Click para subir imagen"}
          </p>
          <p className="text-xs text-gray-500">
PNG, JPG (se convertirá a WebP) hasta 10MB
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Images grid */}
      {currentImages.length > 0 && (
        <div className={`grid ${maxCount === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
          {currentImages.map((image, index) => (
            <div
              key={index}
              className={`relative group bg-gray-100 rounded-lg overflow-hidden border ${
                maxCount === 1 ? 'aspect-[3/2] max-w-xs mx-auto' : 'aspect-square'
              }`}
            >
              {/* Imagen */}
              {image.startsWith("data:") || image.startsWith("http") || image.startsWith("/") ? (
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Error loading image: ${image}`)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              {/* Overlay con opciones */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Indicador de posición para múltiples imágenes */}
              {maxCount > 1 && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contador */}
      {maxCount > 1 && (
        <p className="text-sm text-gray-500 text-center">
          {currentImages.length} / {maxCount} imágenes
        </p>
      )}

      {/* Ayuda adicional */}
      {currentImages.length === 0 && !isUploading && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleUploadClick}
            disabled={isUploading || currentImages.length >= maxCount}
            className="mt-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar archivo
          </Button>
        </div>
      )}
    </div>
  )
}
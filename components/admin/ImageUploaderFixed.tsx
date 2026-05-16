"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Image as ImageIcon, AlertCircle, Crop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import ImageCropModal from "./ImageCropModal"

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
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cropFile, setCropFile] = useState<File | null>(null)
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

  const uploadToServer = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'clientes')

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error || `Error al subir archivo (${response.status})`)
    }

    const data = await response.json()
    return data.url
  }

  const processFiles = useCallback(async (files: File[]) => {
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
          const webpDataUrl = await convertToWebP(file, 0.9)
          const response = await fetch(webpDataUrl)
          const blob = await response.blob()
          const baseName = file.name.replace(/\.[^.]+$/, '') || 'logo'
          const webpFile = new File([blob], `${baseName}.webp`, { type: 'image/webp' })
          const url = await uploadToServer(webpFile)
          urls.push(url)
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError)
          const msg = fileError instanceof Error ? fileError.message : 'error desconocido'
          throw new Error(`Error procesando ${file.name}: ${msg}`)
        }
      }

      // Llamar callback correspondiente
      if (onUpload) {
        onUpload(urls)
        toast.success(`${urls.length} imagen(es) subida(s) correctamente`)
      } else if (onImagesChange) {
        // En modo de 1 sola imagen, reemplazar; en galería, agregar
        const updatedImages = (maxCount === 1 ? urls : [...currentImages, ...urls]).slice(0, maxCount)
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

  // En modo de 1 sola imagen, permitir reemplazar aunque el cupo esté lleno
  const isSingle = maxCount === 1
  const slotsFull = currentImages.length >= maxCount
  const canAcceptDrop = !isUploading && (!slotsFull || isSingle)

  // En modo de 1 imagen el archivo pasa primero por el modal de recorte;
  // en modo galería se procesa directo.
  const handleIncomingFiles = useCallback((files: File[]) => {
    if (files.length === 0) return
    if (isSingle) {
      const file = files[0]
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten imágenes')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('La imagen es demasiado grande (máximo 10MB)')
        return
      }
      setCropFile(file)
    } else {
      processFiles(files)
    }
  }, [isSingle, processFiles])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleIncomingFiles(Array.from(e.target.files || []))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [handleIncomingFiles])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (!canAcceptDrop) return
    const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'))
    if (files.length === 0) {
      toast.error('Solo se permiten imágenes')
      return
    }
    handleIncomingFiles(files)
  }, [canAcceptDrop, handleIncomingFiles])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (canAcceptDrop && !isDragging) setIsDragging(true)
  }, [canAcceptDrop, isDragging])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
  }, [])

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

  const errorBox = error && (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm">{error}</span>
    </div>
  )

  // ── Modo de 1 sola imagen: caja única (dropzone + preview combinados) ──
  if (isSingle) {
    const image = currentImages[0]
    const hasImage =
      !!image &&
      (image.startsWith('data:') || image.startsWith('http') || image.startsWith('/'))

    // Abre el modal de recorte sobre la imagen ya subida
    const openCropForExisting = async () => {
      if (!image) return
      try {
        const res = await fetch(image)
        if (!res.ok) throw new Error('fetch failed')
        const blob = await res.blob()
        const type = blob.type || 'image/png'
        const ext = type.split('/')[1] || 'png'
        setCropFile(new File([blob], `logo-actual.${ext}`, { type }))
      } catch (e) {
        console.error('Error abriendo imagen para recortar:', e)
        toast.error('No se pudo abrir la imagen para recortar')
      }
    }

    return (
      <div className="space-y-2">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={canAcceptDrop && !hasImage ? handleUploadClick : undefined}
          className={`group relative mx-auto aspect-[2/1] w-full max-w-sm overflow-hidden rounded-lg border-2 transition-colors ${
            isDragging
              ? 'border-solid border-blue-500 bg-blue-50'
              : hasImage
              ? 'border-solid border-gray-200 bg-white'
              : 'cursor-pointer border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
            disabled={!canAcceptDrop}
          />

          {hasImage && !isDragging ? (
            <>
              <img
                key={image}
                src={image}
                alt={label || 'Imagen'}
                className="h-full w-full object-contain p-5"
                onLoad={(e) => {
                  e.currentTarget.style.display = ''
                }}
                onError={(e) => {
                  console.error(`Error loading image: ${image}`)
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="h-8 w-36 justify-start px-3 text-xs"
                >
                  <Upload className="mr-2 h-3.5 w-3.5" />
                  Reemplazar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={openCropForExisting}
                  disabled={isUploading}
                  className="h-8 w-36 justify-start px-3 text-xs"
                >
                  <Crop className="mr-2 h-3.5 w-3.5" />
                  Recortar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeImage(0)}
                  disabled={isUploading}
                  className="h-8 w-36 justify-start px-3 text-xs"
                >
                  <X className="mr-2 h-3.5 w-3.5" />
                  Quitar
                </Button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <Upload
                className={`mb-2 h-9 w-9 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
              />
              <p className="text-sm font-medium text-gray-600">
                {isUploading
                  ? 'Subiendo imagen…'
                  : isDragging
                  ? 'Suelta la imagen aquí'
                  : label || 'Click o arrastra una imagen'}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                PNG, JPG · se convierte a WebP · máx 10MB
              </p>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-700" />
            </div>
          )}
        </div>

        {hasImage && (
          <p className="text-xs text-gray-400 text-center">
            Vista previa al tamaño real — así se mostrará en la página
          </p>
        )}
        {errorBox}

        <ImageCropModal
          isOpen={!!cropFile}
          imageFile={cropFile}
          freeCrop
          outputType="image/webp"
          folder="clientes"
          onClose={() => setCropFile(null)}
          onCropComplete={(url) => {
            setCropFile(null)
            if (onUpload) {
              onUpload([url])
            } else if (onImagesChange) {
              onImagesChange([url])
            }
          }}
        />
      </div>
    )
  }

  // ── Modo galería (varias imágenes) ──
  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxCount > 1}
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileChange}
          className="hidden"
          disabled={!canAcceptDrop}
        />

        <div
          onClick={canAcceptDrop ? handleUploadClick : undefined}
          className={`cursor-pointer ${canAcceptDrop ? "" : "opacity-50 cursor-not-allowed"}`}
        >
          <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="mt-2 text-sm text-gray-600">
            {isUploading
              ? "Subiendo imagen..."
              : isDragging
              ? "Suelta la imagen aquí"
              : slotsFull
              ? `Máximo ${maxCount} imágenes`
              : label || "Click o arrastra una imagen aquí"}
          </p>
          <p className="text-xs text-gray-500">
PNG, JPG (se convertirá a WebP) hasta 10MB
          </p>
        </div>
      </div>

      {/* Error message */}
      {errorBox}

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
                  key={image}
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={(e) => {
                    e.currentTarget.style.display = ''
                  }}
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
'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EspecialidadImageUploaderProps {
  currentImage?: string
  onImageChange: (url: string) => void
}

export function EspecialidadImageUploader({
  currentImage,
  onImageChange
}: EspecialidadImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImage || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido')
      return
    }

    // Preview local
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    setUploading(true)
    try {
      // Subir al servidor
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al subir imagen')
      }

      const { url } = await response.json()

      // Actualizar con la URL del servidor
      setPreviewUrl(url)
      onImageChange(url)

      alert('✅ Imagen subida exitosamente')
    } catch (error) {
      console.error('Error:', error)
      alert(`❌ Error al subir imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      // Revertir preview
      setPreviewUrl(currentImage || '')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl('')
    onImageChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Subiendo...' : 'Subir Imagen'}
        </Button>

        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="w-4 h-4 mr-2" />
            Quitar
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl && (
        <div className="relative w-full max-w-xs h-56 border rounded-lg overflow-hidden bg-gray-50">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-sm">Subiendo...</div>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Vista previa (aspect ratio real)
          </div>
        </div>
      )}

      {!previewUrl && (
        <div className="w-full max-w-xs h-56 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400">
          <div className="text-center">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No hay imagen</p>
            <p className="text-xs mt-1">(Se verá como tarjeta vertical)</p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Recomendado: 800x600px mínimo, formato JPG o PNG
      </p>
    </div>
  )
}

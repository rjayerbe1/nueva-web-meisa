"use client"

import { useState, useEffect } from 'react'
import { X, Download, Check, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface CategoryImage {
  url: string
  name: string
  size: number
  updated: string
}

interface CategoryImageSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (imageUrl: string) => void
  currentImageUrl?: string
}

export function CategoryImageSelector({
  isOpen,
  onClose,
  onSelect,
  currentImageUrl
}: CategoryImageSelectorProps) {
  const [images, setImages] = useState<CategoryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadImages()
    }
  }, [isOpen])

  const loadImages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/category-images')
      if (response.ok) {
        const data = await response.json()
        setImages(data.images || [])
      } else {
        toast.error('Error al cargar imágenes')
      }
    } catch (error) {
      console.error('Error loading images:', error)
      toast.error('Error al cargar imágenes')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = imageName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Imagen descargada')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Error al descargar imagen')
    }
  }

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage)
      onClose()
      toast.success('Imagen seleccionada')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Imágenes de Categorías en Google Cloud Storage
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Selecciona una imagen anterior o descárgala
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Cargando imágenes...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600">No hay imágenes disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                    selectedImage === image.url
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  {/* Imagen */}
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-white rounded-b-lg">
                    <p className="text-xs font-medium text-gray-900 truncate" title={image.name}>
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(image.size)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(image.updated)}
                    </p>
                  </div>

                  {/* Botón de descarga */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(image.url, image.name)
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Descargar imagen"
                  >
                    <Download className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* Check de selección */}
                  {selectedImage === image.url && (
                    <div className="absolute top-2 left-2 p-1.5 bg-blue-600 rounded-full shadow-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Indicador si es la imagen actual */}
                  {currentImageUrl === image.url && (
                    <div className="absolute bottom-16 left-2 right-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
                      Actual
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            {selectedImage ? 'Imagen seleccionada' : 'Selecciona una imagen'}
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSelect}
              disabled={!selectedImage}
            >
              Usar Imagen Seleccionada
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

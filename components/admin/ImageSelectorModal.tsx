'use client'

import { useState } from 'react'
import { X, Save, Plus, Trash2, Edit3 } from 'lucide-react'

interface ImageData {
  id: string
  url: string
  urlOptimized: string | null
  alt: string
  titulo: string | null
  descripcion: string | null
}

interface SelectedImage {
  id: string
  titulo: string
  descripcion: string
}

interface ImageSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (selectedImages: SelectedImage[]) => void
  availableImages: ImageData[]
  currentSelection: SelectedImage[]
  sectionTitle: string
  sectionColor?: 'red' | 'blue' | 'green'
  maxImages?: number
}

export default function ImageSelectorModal({
  isOpen,
  onClose,
  onSave,
  availableImages,
  currentSelection,
  sectionTitle,
  sectionColor,
  maxImages = 4
}: ImageSelectorModalProps) {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>(currentSelection)
  const [editingImage, setEditingImage] = useState<string | null>(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editDescripcion, setEditDescripcion] = useState('')

  if (!isOpen) return null

  const colors = {
    border: 'border-slate-500 ring-slate-200',
    hover: 'hover:border-slate-300',
    bg: 'bg-slate-500/20',
    badge: 'bg-slate-500',
    button: 'bg-slate-600 hover:bg-slate-700'
  }

  const handleImageSelect = (image: ImageData) => {
    if (selectedImages.some(img => img.id === image.id)) {
      // Deseleccionar
      setSelectedImages(prev => prev.filter(img => img.id !== image.id))
    } else if (selectedImages.length < maxImages) {
      // Seleccionar nueva imagen
      setSelectedImages(prev => [...prev, {
        id: image.id,
        titulo: image.titulo || image.alt || 'Sin título',
        descripcion: image.descripcion || ''
      }])
    }
  }

  const handleEditImage = (imageId: string) => {
    const image = selectedImages.find(img => img.id === imageId)
    if (image) {
      setEditingImage(imageId)
      setEditTitulo(image.titulo)
      setEditDescripcion(image.descripcion)
    }
  }

  const handleSaveEdit = () => {
    if (editingImage) {
      setSelectedImages(prev => prev.map(img => 
        img.id === editingImage 
          ? { ...img, titulo: editTitulo, descripcion: editDescripcion }
          : img
      ))
      setEditingImage(null)
      setEditTitulo('')
      setEditDescripcion('')
    }
  }

  const handleSave = () => {
    onSave(selectedImages)
    onClose()
  }

  const isSelected = (imageId: string) => selectedImages.some(img => img.id === imageId)

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl max-h-[90vh] w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Seleccionar imágenes para {sectionTitle}
            </h2>
            <p className="text-gray-600 mt-1">
              Selecciona hasta {maxImages} imágenes. Puedes personalizar título y descripción.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Galería de imágenes disponibles */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Imágenes disponibles ({selectedImages.length}/{maxImages} seleccionadas)
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableImages.map((image) => {
                const selected = isSelected(image.id)
                const canSelect = selectedImages.length < maxImages || selected
                
                return (
                  <div
                    key={image.id}
                    onClick={() => canSelect && handleImageSelect(image)}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selected 
                        ? `${colors.border} ring-2` 
                        : canSelect 
                          ? `border-gray-200 ${colors.hover}` 
                          : 'border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="aspect-[4/3] relative">
                      <img
                        src={image.urlOptimized || image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      {selected && (
                        <div className={`absolute inset-0 ${colors.bg} flex items-center justify-center`}>
                          <div className={`${colors.badge} text-white px-2 py-1 rounded text-xs font-medium`}>
                            Seleccionada
                          </div>
                        </div>
                      )}
                      {!canSelect && !selected && (
                        <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
                          <div className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium">
                            Máximo {maxImages}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">{image.titulo || image.alt}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Panel de imágenes seleccionadas */}
          <div className="w-96 border-l border-gray-200 p-6 overflow-y-auto bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Imágenes seleccionadas
            </h3>
            
            {selectedImages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Plus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No hay imágenes seleccionadas</p>
                <p className="text-sm">Haz clic en las imágenes de la izquierda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedImages.map((selectedImage, index) => {
                  const imageData = availableImages.find(img => img.id === selectedImage.id)
                  if (!imageData) return null

                  return (
                    <div key={selectedImage.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={imageData.urlOptimized || imageData.url}
                            alt={imageData.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {editingImage === selectedImage.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editTitulo}
                                onChange={(e) => setEditTitulo(e.target.value)}
                                placeholder="Título personalizado"
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                              />
                              <textarea
                                value={editDescripcion}
                                onChange={(e) => setEditDescripcion(e.target.value)}
                                placeholder="Descripción personalizada"
                                rows={2}
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={handleSaveEdit}
                                  className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                >
                                  <Save className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setEditingImage(null)}
                                  className="text-xs bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {selectedImage.titulo}
                              </p>
                              {selectedImage.descripcion && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {selectedImage.descripcion}
                                </p>
                              )}
                              <div className="flex gap-1 mt-2">
                                <button
                                  onClick={() => handleEditImage(selectedImage.id)}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleImageSelect(imageData)}
                                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="text-sm text-gray-600">
            {selectedImages.length} de {maxImages} imágenes seleccionadas
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 text-white rounded-lg transition-colors font-medium bg-slate-600 hover:bg-slate-700"
            >
              Guardar selección
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
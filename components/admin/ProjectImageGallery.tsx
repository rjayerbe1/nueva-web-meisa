"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Trash2, Image as ImageIcon, Eye, Download, Star } from "lucide-react"

interface ProjectImage {
  id: string
  url: string
  alt: string
  descripcion: string | null
  tipo: 'PORTADA' | 'GALERIA' | 'PROCESO' | 'ANTES_DESPUES' | 'PLANOS'
  createdAt: Date
}

interface ProjectImageGalleryProps {
  projectId: string
  projectTitle: string
  images: ProjectImage[]
  canEdit?: boolean
}

export default function ProjectImageGallery({ 
  projectId, 
  projectTitle, 
  images, 
  canEdit = true 
}: ProjectImageGalleryProps) {
  const router = useRouter()
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [updatingCoverId, setUpdatingCoverId] = useState<string | null>(null)
  
  // Form para subir imágenes
  const [files, setFiles] = useState<FileList | null>(null)
  const [description, setDescription] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files || files.length === 0) {
      alert('Por favor selecciona al menos un archivo')
      return
    }

    setUploading(true)
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Subir archivo al servidor
        const formData = new FormData()
        formData.append('file', file)
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!uploadResponse.ok) {
          const error = await uploadResponse.json()
          throw new Error(error.error || 'Error al subir archivo')
        }
        
        const { url } = await uploadResponse.json()
        
        // Guardar referencia en la base de datos
        const mediaResponse = await fetch('/api/admin/media', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            originalFileName: file.name,
            descripcion: description || file.name,
            proyectoId: projectId
          }),
        })
        
        if (!mediaResponse.ok) {
          const error = await mediaResponse.json()
          throw new Error(error.error || 'Error al guardar imagen')
        }
      }
      
      router.refresh()
      setShowUpload(false)
      setFiles(null)
      setDescription('')
      alert(`✅ ${files.length} imagen(es) subida(s) exitosamente`)
      
    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Error al subir las imágenes')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return
    
    setDeletingImageId(imageId)
    try {
      const response = await fetch(`/api/admin/media/${imageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
        if (selectedImage?.id === imageId) {
          setSelectedImage(null)
        }
      } else {
        alert('Error al eliminar la imagen')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar la imagen')
    } finally {
      setDeletingImageId(null)
    }
  }

  const handleSetCover = async (imageId: string) => {
    setUpdatingCoverId(imageId)
    try {
      const response = await fetch(`/api/admin/media/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'PORTADA'
        }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Error al establecer imagen de portada')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al establecer imagen de portada')
    } finally {
      setUpdatingCoverId(null)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Galería de Imágenes
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-meisa-blue rounded-md hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Subir Imágenes
          </button>
        )}
      </div>

      {/* Grid de imágenes */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-40 object-cover rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(image)}
              />
              
              {/* Indicador de imagen de portada */}
              {image.tipo === 'PORTADA' && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Portada
                </div>
              )}
              
              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-gray-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {canEdit && image.tipo !== 'PORTADA' && (
                    <button
                      onClick={() => handleSetCover(image.id)}
                      disabled={updatingCoverId === image.id}
                      className="p-2 bg-white rounded-full text-yellow-600 hover:text-yellow-700 disabled:opacity-50"
                      title="Establecer como portada"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={() => handleDelete(image.id)}
                      disabled={deletingImageId === image.id}
                      className="p-2 bg-white rounded-full text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No hay imágenes en este proyecto</p>
          {canEdit && (
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-meisa-blue bg-blue-50 rounded-md hover:bg-blue-100"
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Primera Imagen
            </button>
          )}
        </div>
      )}

      {/* Modal de subida */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Subir Imágenes</h3>
                <p className="text-sm text-gray-600 mt-1">Para: {projectTitle}</p>
              </div>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivos *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-meisa-blue hover:text-blue-500">
                        <span>Subir archivos</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => setFiles(e.target.files)}
                        />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                </div>
                {files && files.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {files.length} archivo(s) seleccionado(s)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue"
                  placeholder="Descripción de las imágenes..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading || !files}
                  className="px-4 py-2 text-sm font-medium text-white bg-meisa-blue rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Subiendo...' : 'Subir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de vista previa */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="w-full h-auto"
              />
              {selectedImage.descripcion && (
                <div className="p-4">
                  <p className="text-gray-700">{selectedImage.descripcion}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Subida el {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
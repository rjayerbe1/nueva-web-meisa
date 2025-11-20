"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, Download, Trash2 } from "lucide-react"
import { UpscaleButton } from "@/components/admin/UpscaleButton"
import { InpaintButton } from "@/components/admin/InpaintButton"
import { ExpandImageButton } from "@/components/admin/ExpandImageButton"
import { OptimizeButton } from "@/components/admin/OptimizeButton"

interface MediaImage {
  id: string
  url: string
  descripcion: string | null
  proyectoId: string | null
  proyecto: {
    titulo: string
  } | null
}

interface MediaCardProps {
  image: MediaImage
}

export default function MediaCard({ image }: MediaCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState(image.url)

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/media/${image.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Error al eliminar la imagen')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar la imagen')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const projectName = image.proyecto?.titulo || 'sin-proyecto'
      link.download = `${projectName}-${image.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      alert('Error al descargar la imagen')
    }
  }

  const handleAIComplete = async (newUrl: string) => {
    // Actualizar la URL en la base de datos
    try {
      const response = await fetch(`/api/admin/media/${image.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newUrl }),
      })

      if (response.ok) {
        setCurrentImageUrl(newUrl)
        router.refresh()
      } else {
        alert('Error al actualizar la imagen')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar la imagen')
    }
  }

  return (
    <>
      <div className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={currentImageUrl}
          alt={image.descripcion || 'Imagen del proyecto'}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-opacity duration-200">
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2">
            {/* AI Tools */}
            <div className="grid grid-cols-2 gap-1 mb-2">
              <UpscaleButton
                imageUrl={currentImageUrl}
                onUpscaleComplete={handleAIComplete}
                size="sm"
                variant="secondary"
                showLabel={false}
              />
              <InpaintButton
                imageUrl={currentImageUrl}
                onInpaintComplete={handleAIComplete}
                size="sm"
                variant="secondary"
                showLabel={false}
              />
              <ExpandImageButton
                imageUrl={currentImageUrl}
                onExpandComplete={handleAIComplete}
                size="sm"
                variant="secondary"
                showLabel={false}
              />
              <OptimizeButton
                imageUrl={currentImageUrl}
                onOptimizeComplete={handleAIComplete}
                size="sm"
                variant="secondary"
                showLabel={false}
              />
            </div>

            {/* Basic Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowModal(true)}
                className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                title="Ver"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                title="Descargar"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Project name badge */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
          <p className="text-xs text-white truncate">
            {image.proyecto?.titulo || 'Sin proyecto'}
          </p>
        </div>
      </div>

      {/* Modal for full view */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
            >
              ✕
            </button>
            <img
              src={currentImageUrl}
              alt={image.descripcion || 'Imagen del proyecto'}
              className="max-w-full max-h-[calc(100vh-8rem)] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto bg-black bg-opacity-75 text-white p-3 rounded-lg">
              <h3 className="font-semibold">{image.proyecto?.titulo || 'Sin proyecto'}</h3>
              {image.descripcion && (
                <p className="text-sm opacity-90 mt-1">{image.descripcion}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
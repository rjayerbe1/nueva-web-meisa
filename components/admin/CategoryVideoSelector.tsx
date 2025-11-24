"use client"

import { useState, useEffect } from 'react'
import { X, Download, Check, Video as VideoIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface CategoryVideo {
  url: string
  name: string
  size: number
  updated: string
  contentType?: string
}

interface CategoryVideoSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (videoUrl: string) => void
  currentVideoUrl?: string
}

export function CategoryVideoSelector({
  isOpen,
  onClose,
  onSelect,
  currentVideoUrl
}: CategoryVideoSelectorProps) {
  const [videos, setVideos] = useState<CategoryVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadVideos()
    }
  }, [isOpen])

  const loadVideos = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/category-videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
      } else {
        toast.error('Error al cargar videos')
      }
    } catch (error) {
      console.error('Error loading videos:', error)
      toast.error('Error al cargar videos')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (videoUrl: string, videoName: string) => {
    try {
      const response = await fetch(videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = videoName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Video descargado')
    } catch (error) {
      console.error('Error downloading video:', error)
      toast.error('Error al descargar video')
    }
  }

  const handleSelect = () => {
    if (selectedVideo) {
      onSelect(selectedVideo)
      onClose()
      toast.success('Video seleccionado')
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
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Videos de Categorías en Google Cloud Storage
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Selecciona un video anterior o descárgalo
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
              <p className="text-gray-600">Cargando videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <VideoIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">No hay videos disponibles</p>
              <p className="text-sm text-gray-500 mt-2">
                Sube un video primero para verlo aquí
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer rounded-lg border-2 transition-all overflow-hidden ${
                    selectedVideo === video.url
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedVideo(video.url)}
                >
                  {/* Video Preview */}
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause()
                        e.currentTarget.currentTime = 0
                      }}
                    />

                    {/* Play indicator overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[16px] border-l-blue-600 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 bg-white">
                    <p className="text-sm font-medium text-gray-900 truncate mb-1" title={video.name}>
                      {video.name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(video.size)}</span>
                      <span>{formatDate(video.updated)}</span>
                    </div>
                  </div>

                  {/* Botón de descarga */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(video.url, video.name)
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Descargar video"
                  >
                    <Download className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* Check de selección */}
                  {selectedVideo === video.url && (
                    <div className="absolute top-3 left-3 p-1.5 bg-blue-600 rounded-full shadow-lg z-10">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Indicador si es el video actual */}
                  {currentVideoUrl === video.url && (
                    <div className="absolute bottom-20 left-3 right-3">
                      <div className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg text-center">
                        ✓ Video Actual
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t">
          <div>
            {selectedVideo ? (
              <div>
                <p className="text-sm font-medium text-gray-900">Video seleccionado</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {videos.find(v => v.url === selectedVideo)?.name}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Selecciona un video</p>
            )}
          </div>
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
              disabled={!selectedVideo}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Usar Video Seleccionado
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

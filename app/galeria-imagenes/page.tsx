'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

export default function GaleriaImagenesPage() {
  const [allImages, setAllImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(100)
  const [sourceFilter, setSourceFilter] = useState<'all' | 'archived' | 'brochure'>('all')
  const [sourceCounts, setSourceCounts] = useState({ archived: 0, brochure: 0 })

  useEffect(() => {
    // Cargar todas las imágenes desde el servidor
    fetch('/api/list-archived-images')
      .then(res => res.json())
      .then(data => {
        console.log('Total de imágenes:', data.total)
        setAllImages(data.images || [])
        setSourceCounts(data.sources || { archived: 0, brochure: 0 })
        setLoading(false)
      })
      .catch(err => {
        console.error('Error cargando imágenes:', err)
        setLoading(false)
      })
  }, [])

  // Filtrar imágenes según la fuente seleccionada
  const filteredImages = allImages.filter(img => {
    if (sourceFilter === 'all') return true
    return img.includes(`source=${sourceFilter}`)
  })

  const toggleImage = (imagePath: string) => {
    if (selectedImages.includes(imagePath)) {
      setSelectedImages(selectedImages.filter(i => i !== imagePath))
    } else if (selectedImages.length < 5) {
      setSelectedImages([...selectedImages, imagePath])
    }
  }

  const copyToClipboard = () => {
    const text = selectedImages.join('\n')
    navigator.clipboard.writeText(text)
    alert('Rutas copiadas al portapapeles!')
  }

  const loadMore = () => {
    setDisplayCount(prev => prev + 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Cargando imágenes...</p>
        </div>
      </div>
    )
  }

  const displayedImages = filteredImages.slice(0, displayCount)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header fijo */}
      <div className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-blue-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Galería Completa MEISA
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredImages.length} imágenes {sourceFilter === 'all' ? 'totales' : `(${sourceFilter})`} • Mostrando {displayedImages.length} • {selectedImages.length}/5 seleccionadas
              </p>
            </div>

            {/* Filtros por carpeta */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSourceFilter('all')
                  setDisplayCount(100)
                }}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                  sourceFilter === 'all'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todas ({allImages.length})
              </button>
              <button
                onClick={() => {
                  setSourceFilter('archived')
                  setDisplayCount(100)
                }}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                  sourceFilter === 'archived'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Archived ({sourceCounts.archived})
              </button>
              <button
                onClick={() => {
                  setSourceFilter('brochure')
                  setDisplayCount(100)
                }}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                  sourceFilter === 'brochure'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Brochure ({sourceCounts.brochure})
              </button>
            </div>
            <div className="flex gap-4">
              {selectedImages.length > 0 && (
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Copiar Rutas
                </button>
              )}
              <a
                href="/"
                className="px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors"
              >
                Volver
              </a>
            </div>
          </div>

          {/* Seleccionadas */}
          {selectedImages.length > 0 && (
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h3 className="font-bold text-blue-900 mb-2">Seleccionadas:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="font-mono text-xs">{img}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid de imágenes */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayedImages.map((imagePath, index) => {
            const isSelected = selectedImages.includes(imagePath)
            const fileName = imagePath.split('/').pop() || ''

            return (
              <div
                key={index}
                className={`relative group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-blue-600 transform scale-105' : 'hover:shadow-xl'
                }`}
              >
                {/* Imagen */}
                <div className="relative w-full aspect-[3/4] bg-gray-200">
                  <Image
                    src={imagePath}
                    alt={fileName}
                    fill
                    className="object-cover"
                    unoptimized
                    loading="lazy"
                  />

                  {/* Overlay con botón */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => toggleImage(imagePath)}
                      disabled={!isSelected && selectedImages.length >= 5}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 rounded-lg font-bold ${
                        isSelected
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : selectedImages.length >= 5
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isSelected ? 'Quitar' : selectedImages.length >= 5 ? 'Máximo 5' : 'Seleccionar'}
                    </button>
                  </div>

                  {/* Badge seleccionada */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-2">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  {/* Número */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-gray-600 truncate" title={fileName}>
                    {fileName}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Botón cargar más */}
        {displayCount < filteredImages.length && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-lg transition-colors"
            >
              Cargar 100 más ({filteredImages.length - displayCount} restantes)
            </button>
          </div>
        )}

        {/* Mensaje si se cargaron todas */}
        {displayCount >= filteredImages.length && filteredImages.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg font-bold">
              ✓ Todas las {filteredImages.length} imágenes cargadas
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

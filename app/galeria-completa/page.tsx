'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function GaleriaCompletaPage() {
  const [allImages, setAllImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(50)

  useEffect(() => {
    // Cargar lista de imágenes del servidor
    fetch('/api/list-archived-images')
      .then(res => res.json())
      .then(data => {
        setAllImages(data.images || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  const toggleImage = (img: string) => {
    if (selectedImages.includes(img)) {
      setSelectedImages(selectedImages.filter(i => i !== img))
    } else if (selectedImages.length < 5) {
      setSelectedImages([...selectedImages, img])
    }
  }

  const copyToClipboard = () => {
    const text = selectedImages.join('\n')
    navigator.clipboard.writeText(text)
    alert('¡Rutas copiadas!')
  }

  const loadMore = () => {
    setDisplayCount(prev => prev + 50)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Cargando 1500+ imágenes...</p>
        </div>
      </div>
    )
  }

  const displayedImages = allImages.slice(0, displayCount)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header fijo */}
      <div className="sticky top-0 z-50 bg-gray-800 shadow-xl border-b-2 border-blue-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                🎨 Galería Completa MEISA
              </h1>
              <p className="text-gray-300 text-sm">
                {allImages.length} imágenes totales • Mostrando {displayedImages.length} • {selectedImages.length}/5 seleccionadas
              </p>
            </div>
            <div className="flex gap-3">
              {selectedImages.length > 0 && (
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 text-sm"
                >
                  ✓ Copiar {selectedImages.length}
                </button>
              )}
              <a
                href="/"
                className="px-4 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 text-sm"
              >
                Volver
              </a>
            </div>
          </div>

          {/* Seleccionadas */}
          {selectedImages.length > 0 && (
            <div className="mt-3 bg-blue-900/50 border-l-4 border-blue-500 p-3 rounded text-xs">
              <div className="font-bold mb-1">Seleccionadas:</div>
              {selectedImages.map((img, idx) => (
                <div key={idx} className="font-mono text-blue-200 truncate">{img}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {displayedImages.map((img, idx) => {
            const isSelected = selectedImages.includes(img)
            const fileName = img.split('/').pop() || ''

            return (
              <div
                key={idx}
                className={`relative bg-gray-800 rounded overflow-hidden transition-all ${
                  isSelected ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105'
                }`}
              >
                <div className="relative w-full aspect-[3/4] bg-gray-700">
                  <Image
                    src={img}
                    alt={fileName}
                    fill
                    className="object-cover"
                    unoptimized
                    loading="lazy"
                  />

                  {/* Badge número */}
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{idx + 1}
                  </div>

                  {/* Check si seleccionada */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  )}

                  {/* Botón hover */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/60 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                    <button
                      onClick={() => toggleImage(img)}
                      disabled={!isSelected && selectedImages.length >= 5}
                      className={`px-3 py-1 rounded text-xs font-bold ${
                        isSelected
                          ? 'bg-red-600 hover:bg-red-700'
                          : selectedImages.length >= 5
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isSelected ? 'Quitar' : selectedImages.length >= 5 ? 'Máx 5' : 'Elegir'}
                    </button>
                  </div>
                </div>

                <div className="p-2">
                  <p className="text-xs text-gray-400 truncate" title={fileName}>
                    {fileName}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Botón cargar más */}
        {displayCount < allImages.length && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-lg"
            >
              ⬇ Cargar 50 más ({allImages.length - displayCount} restantes)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

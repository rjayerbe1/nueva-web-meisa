'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function TestGaleriaPage() {
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const allImages = [
    // Hero actuales
    'https://storage.googleapis.com/meisa-imagenes/site/hero/techo-metalico.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/hero/ciclopuente-atardecer.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/hero/estructura-perspectiva.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/hero/coliseo-estructuras-rojas.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/hero/montaje-grua.jpg',
    // Demo
    'https://storage.googleapis.com/meisa-imagenes/site/demo/01-mhc-2-perspectiva-VERTICAL.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/demo/03-ciclopuente-atardecer-horizontal.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/demo/06-techo-metalico-cuadrada.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/demo/08-puente-peatonal-blanco-VERTICAL.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/demo/09-puente-interior-negro-VERTICAL.jpg',
    // Imágenes Archivadas (48 nuevas!)
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagen-1-banner-home.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagen-2-banner-home.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagen-3-banner-home.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagen-4-banner-home.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagen-5-banner-home.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagen-6-banner-home.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagenes-banner-HOME-1_.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagenes-banner-HOME-2.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagenes-banner-HOME3.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagenes-banner-HOME4.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagenes-banner-HOME5.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagenes-banner-HOME6.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/Fabricación-1-slider-servicios.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/Fabricación-2-slider-servicios.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/Fabricación-3-slider-servicios.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/Montaje-1-slider-servicios.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/Montaje-3-slider-servicios.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/consultoria-en-diseño-1-slider-servicios.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/consultoria-en-diseño-2-slider-servicios.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/consultoria-en-diseño-3-slider-servicios.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/obra-civil-slider-1-servicios.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/obra-civil-2-slider-servicios.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/Monserrat-Plaza-1.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/Monserrat-Plaza3.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/terminal-mio-miniatura-48.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/BANNER-PROYECTOS-oscura.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/imagen-Meisa-Home-quienes-somos.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/1284136006-huge.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/3-19.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/shutterstock_121713346.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/un-poco-mas-de-meisa-1-2.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/un-poco-mas-de-meisa-2-2.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/un-poco-mas-de-meisa-3-2.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/archived/un-poco-mas-de-meisa-4-2.jpg',
  ]

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
    alert('¡Rutas copiadas al portapapeles!')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">Galería MEISA - {allImages.length} Imágenes</h1>
        <p className="text-gray-600 mb-4">
          Seleccionadas: {selectedImages.length}/5
        </p>
        {selectedImages.length > 0 && (
          <button
            onClick={copyToClipboard}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
          >
            Copiar {selectedImages.length} Rutas
          </button>
        )}
      </div>

      {/* Grid de imágenes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {allImages.map((img, idx) => {
          const isSelected = selectedImages.includes(img)
          const fileName = img.split('/').pop()

          return (
            <div
              key={idx}
              className={`bg-white rounded-lg shadow overflow-hidden transition-all ${
                isSelected ? 'ring-4 ring-blue-600 transform scale-105' : 'hover:shadow-xl'
              }`}
            >
              <div className="relative w-full aspect-[3/4] bg-gray-200">
                <Image
                  src={img}
                  alt={fileName || ''}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    ✓
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-600 truncate mb-2" title={fileName}>
                  {fileName}
                </p>
                <button
                  onClick={() => toggleImage(img)}
                  disabled={!isSelected && selectedImages.length >= 5}
                  className={`w-full px-3 py-2 rounded text-sm font-bold ${
                    isSelected
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : selectedImages.length >= 5
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSelected ? 'Quitar' : selectedImages.length >= 5 ? 'Máx 5' : 'Seleccionar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Seleccionadas */}
      {selectedImages.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Tus {selectedImages.length} Imágenes Seleccionadas:</h2>
          <div className="bg-blue-50 p-4 rounded">
            {selectedImages.map((img, idx) => (
              <div key={idx} className="text-sm font-mono text-blue-900 mb-1">
                {img}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import Image from 'next/image'
import { useState } from 'react'

const images = [
  { name: '01-mhc-2-perspectiva-VERTICAL.jpg', orientation: 'VERTICAL', dims: '2268x4032', desc: 'Perspectiva infinita estructura metálica' },
  { name: '02-mhc-3-perspectiva-horizontal.jpg', orientation: 'Horizontal', dims: '4032x2268', desc: 'Vista horizontal estructura metálica' },
  { name: '03-ciclopuente-atardecer-horizontal.jpg', orientation: 'Horizontal', dims: '4032x2268', desc: 'Ciclopuente al atardecer espectacular' },
  { name: '04-montaje-grua-horizontal.jpg', orientation: 'Horizontal', dims: '4000x3000', desc: 'Montaje viga con grúas amarillas' },
  { name: '05-coliseo-estructuras-rojas-horizontal.jpg', orientation: 'Horizontal', dims: '1280x960', desc: 'Estructuras rojas MEISA coliseo' },
  { name: '06-techo-metalico-cuadrada.jpg', orientation: 'Cuadrada', dims: '2992x2992', desc: 'Techo metálico geometría espectacular' },
  { name: '07-puente-peatonal-moderno-horizontal.jpg', orientation: 'Horizontal', dims: '4032x2268', desc: 'Puente peatonal estructura negra' },
  { name: '08-puente-peatonal-blanco-VERTICAL.jpg', orientation: 'VERTICAL', dims: '2268x4032', desc: 'Puente peatonal vigas blancas' },
  { name: '09-puente-interior-negro-VERTICAL.jpg', orientation: 'VERTICAL', dims: '2268x4032', desc: 'Interior puente estructura negra' },
  { name: '10-puente-soportes-amarillos-horizontal.jpg', orientation: 'Horizontal', dims: '4000x3000', desc: 'Puente soportes amarillos' },
  { name: '11-cubierta-montaje-grua-horizontal.jpg', orientation: 'Horizontal', dims: '4000x3000', desc: 'Cubierta en montaje con grúa' },
  { name: '12-cubierta-perspectiva-horizontal.jpg', orientation: 'Horizontal', dims: '4000x3000', desc: 'Cubierta perspectiva industrial' },
  { name: '13-cubierta-blanca-industrial-cuadrada.jpg', orientation: 'Cuadrada', dims: '2992x2992', desc: 'Cubierta blanca estructura visible' },
  { name: '14-trilladora-estructura-interior-horizontal.jpg', orientation: 'Horizontal', dims: '1600x1200', desc: 'Interior trilladora estructura' },
  { name: '15-puente-grua-amarilla-horizontal.jpg', orientation: 'Horizontal', dims: '4000x3000', desc: 'Puente con grúa amarilla montaje' },
]

export default function DemoHeroPage() {
  const [selectedImages, setSelectedImages] = useState<number[]>([])

  const toggleImage = (index: number) => {
    if (selectedImages.includes(index)) {
      setSelectedImages(selectedImages.filter(i => i !== index))
    } else if (selectedImages.length < 5) {
      setSelectedImages([...selectedImages, index])
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Selección de Imágenes - Hero MEISA</h1>
          <p className="text-xl text-gray-600 mb-2">Elige las mejores 5 imágenes donde la estructura metálica sea protagonista</p>
          <p className="text-sm text-gray-500">
            Seleccionadas: {selectedImages.length}/5
          </p>
        </div>

        {/* Leyenda */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                V
              </div>
              <h3 className="font-bold text-green-700">VERTICAL</h3>
              <p className="text-sm text-gray-600">Perfecta sin crop</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                C
              </div>
              <h3 className="font-bold text-blue-700">CUADRADA</h3>
              <p className="text-sm text-gray-600">Crop mínimo</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                H
              </div>
              <h3 className="font-bold text-orange-700">HORIZONTAL</h3>
              <p className="text-sm text-gray-600">Crop moderado</p>
            </div>
          </div>
        </div>

        {/* Grid de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, index) => {
            const isVertical = img.orientation === 'VERTICAL'
            const isCuadrada = img.orientation === 'Cuadrada'
            const isSelected = selectedImages.includes(index)

            const bgColor = isVertical
              ? 'from-green-600 to-green-700'
              : isCuadrada
                ? 'from-blue-600 to-blue-700'
                : 'from-orange-600 to-orange-700'

            return (
              <div
                key={img.name}
                className={`bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-blue-500 transform scale-105' : ''
                }`}
              >
                {/* Header */}
                <div className={`p-6 bg-gradient-to-r ${bgColor}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-white">#{index + 1}</h2>
                      <h3 className="text-sm font-semibold text-white/90 mt-1">{img.orientation}</h3>
                    </div>
                    {isSelected && (
                      <div className="bg-white text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
                        SELECCIONADA
                      </div>
                    )}
                  </div>
                  <p className="text-white/80 mt-2 text-xs">{img.dims}</p>
                </div>

                {/* Imagen Preview */}
                <div className="relative w-full aspect-[3/4] bg-gray-200">
                  <Image
                    src={`/images/demo/${img.name}`}
                    alt={img.desc}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t">
                  <p className="text-sm text-gray-700 mb-4 min-h-[40px]">{img.desc}</p>
                  <button
                    onClick={() => toggleImage(index)}
                    disabled={!isSelected && selectedImages.length >= 5}
                    className={`w-full px-6 py-3 font-bold rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : selectedImages.length >= 5
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-700 text-white hover:bg-blue-800'
                    }`}
                  >
                    {isSelected ? 'Quitar selección' : selectedImages.length >= 5 ? 'Máximo 5' : 'Seleccionar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Resumen de selección */}
        {selectedImages.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tus Imágenes Seleccionadas ({selectedImages.length}/5)
            </h2>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {selectedImages.map(idx => (
                <div key={idx} className="text-center">
                  <div className="bg-blue-100 rounded-lg p-4 mb-2">
                    <span className="text-2xl font-bold text-blue-700">#{idx + 1}</span>
                  </div>
                  <p className="text-xs text-gray-600">{images[idx].orientation}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-900 font-semibold">
                Números seleccionados: {selectedImages.map(i => `#${i + 1}`).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="mt-12 text-center space-x-4">
          <a
            href="/"
            className="inline-block px-8 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors"
          >
            Volver al Home
          </a>
        </div>
      </div>
    </div>
  )
}

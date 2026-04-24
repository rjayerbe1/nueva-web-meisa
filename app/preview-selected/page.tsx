'use client'

import Image from 'next/image'
import { useState } from 'react'

const selectedImages = [
  { id: 1, name: '01-javeriana.jpeg', desc: 'Escenario Deportivo - Javeriana' },
  { id: 2, name: '02-mhc-3.jpg', desc: 'MHC 3' },
  { id: 3, name: '03-cendis-2.jpg', desc: 'Cendis 2' },
  { id: 4, name: '04-bochalema-2.jpg', desc: 'Bochalema 2' },
  { id: 5, name: '05-cendis-2-industria.jpg', desc: 'Cendis 2 - Industria' },
  { id: 6, name: '06-citricos-1.jpeg', desc: 'Cítricos 1' },
  { id: 7, name: '07-puente-cascada.jpg', desc: 'Puente Cascada' },
  { id: 8, name: '08-puente-peatonal-1.jpeg', desc: 'Puente Peatonal 1' },
  { id: 9, name: '09-puente-peatonal-2.jpg', desc: 'Puente Peatonal 2' },
  { id: 10, name: '10-ciclopuente.jpeg', desc: 'Ciclopuente' },
]

export default function PreviewSelectedPage() {
  const [selectedForHero, setSelectedForHero] = useState<string[]>([])

  const toggleImage = (imageName: string) => {
    if (selectedForHero.includes(imageName)) {
      setSelectedForHero(selectedForHero.filter(i => i !== imageName))
    } else if (selectedForHero.length < 5) {
      setSelectedForHero([...selectedForHero, imageName])
    }
  }

  const copyPaths = () => {
    const paths = selectedForHero.map(name => `https://storage.googleapis.com/meisa-imagenes/site/selected-hero/${name}`).join('\n')
    navigator.clipboard.writeText(paths)
    alert('Rutas copiadas al portapapeles!')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-blue-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Vista Previa - Imágenes Seleccionadas
              </h1>
              <p className="text-gray-600 mt-1">
                10 imágenes disponibles • {selectedForHero.length}/5 seleccionadas para Hero
              </p>
            </div>
            <div className="flex gap-4">
              {selectedForHero.length > 0 && (
                <button
                  onClick={copyPaths}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Copiar Rutas ({selectedForHero.length})
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

          {/* Rutas seleccionadas */}
          {selectedForHero.length > 0 && (
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h3 className="font-bold text-blue-900 mb-2">Seleccionadas para Hero:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                {selectedForHero.map((name, idx) => (
                  <div key={idx} className="font-mono text-xs">
                    /images/selected-hero/{name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid de imágenes */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedImages.map((img) => {
            const isSelected = selectedForHero.includes(img.name)
            const imagePath = `https://storage.googleapis.com/meisa-imagenes/site/selected-hero/${img.name}`

            return (
              <div
                key={img.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-blue-600 transform scale-105' : 'hover:shadow-xl'
                }`}
              >
                {/* Imagen */}
                <div className="relative w-full aspect-[4/3] bg-gray-200">
                  <Image
                    src={imagePath}
                    alt={img.desc}
                    fill
                    className="object-cover"
                    unoptimized
                  />

                  {/* Badge de selección */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                      ✓
                    </div>
                  )}

                  {/* Número */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white text-sm font-bold px-3 py-2 rounded">
                    #{img.id}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{img.desc}</h3>
                  <p className="text-xs text-gray-600 font-mono mb-3 truncate" title={img.name}>
                    {img.name}
                  </p>
                  <button
                    onClick={() => toggleImage(img.name)}
                    disabled={!isSelected && selectedForHero.length >= 5}
                    className={`w-full px-4 py-3 rounded-lg font-bold transition-colors ${
                      isSelected
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : selectedForHero.length >= 5
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSelected ? 'Quitar del Hero' : selectedForHero.length >= 5 ? 'Máximo 5' : 'Agregar al Hero'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Información</h2>
          <div className="space-y-2 text-gray-700">
            <p>📁 <strong>Ubicación:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/public/images/selected-hero/</code></p>
            <p>🎨 <strong>Total de imágenes:</strong> {selectedImages.length}</p>
            <p>✅ <strong>Seleccionadas para Hero:</strong> {selectedForHero.length}/5</p>
            <p>📝 <strong>README:</strong> Consulta <code className="bg-gray-100 px-2 py-1 rounded">/public/images/selected-hero/README.md</code> para más detalles</p>
          </div>
        </div>
      </div>
    </div>
  )
}

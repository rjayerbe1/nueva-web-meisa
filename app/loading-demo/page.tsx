'use client'

import { useState } from 'react'
import { LoadingScreen, LoadingVariant } from '@/components/loading/LoadingScreen'
import { Play, Check } from 'lucide-react'

const variants: Array<{
  id: LoadingVariant
  name: string
  description: string
  color: string
}> = [
  {
    id: 'fade-scale',
    name: 'Fade & Scale',
    description: 'Animación elegante y minimalista con fade in/out suave y escalado del logo',
    color: 'from-slate-600 to-slate-700'
  },
  {
    id: 'spinner',
    name: 'Spinner Circular',
    description: 'Logo con círculo giratorio dinámico alrededor, perfecto para indicar carga',
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'metallic',
    name: 'Construcción Metálica',
    description: 'Efecto de ensamblaje estructural que refleja la identidad de MEISA',
    color: 'from-red-600 to-red-700'
  },
  {
    id: 'pulse-glow',
    name: 'Pulso & Glow',
    description: 'Efecto de luz pulsante con brillo y partículas, muy moderno y llamativo',
    color: 'from-cyan-600 to-cyan-700'
  },
  {
    id: 'fade-glow',
    name: 'Fade Glow (Mezcla)',
    description: 'Combinación perfecta: elegancia del fade-scale con brillo sutil que no tapa el logo',
    color: 'from-indigo-600 to-indigo-700'
  }
]

export default function LoadingDemoPage() {
  const [activeVariant, setActiveVariant] = useState<LoadingVariant>('fade-scale')
  const [showDemo, setShowDemo] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<LoadingVariant>('fade-scale')

  const playDemo = (variant: LoadingVariant) => {
    setActiveVariant(variant)
    setShowDemo(true)

    // Auto-hide después de 2 segundos
    setTimeout(() => {
      setShowDemo(false)
    }, 2000)
  }

  const selectVariant = (variant: LoadingVariant) => {
    setSelectedVariant(variant)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bebas text-gray-900 mb-4 text-center">
          Demo de Pantallas de Carga
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Prueba las diferentes animaciones y selecciona la que más te guste para tu sitio web de MEISA.
          Haz clic en el botón de reproducción para ver cada animación en acción.
        </p>
      </div>

      {/* Grid de variantes */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {variants.map((variant) => {
          const isSelected = selectedVariant === variant.id
          const isPlaying = showDemo && activeVariant === variant.id

          return (
            <div
              key={variant.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
                isSelected ? 'ring-4 ring-blue-600 scale-105' : 'hover:shadow-2xl'
              }`}
            >
              {/* Header de la tarjeta */}
              <div className={`bg-gradient-to-r ${variant.color} p-6 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bebas mb-2">{variant.name}</h3>
                    <p className="text-white/90 text-sm">{variant.description}</p>
                  </div>
                  {isSelected && (
                    <div className="ml-4 bg-white/20 rounded-full p-2">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Preview area */}
              <div className="relative h-80 bg-gray-50 flex items-center justify-center">
                {/* Vista previa estática cuando no está reproduciendo */}
                {!isPlaying && (
                  <div className="text-center">
                    <div className="mb-4 opacity-50">
                      <div className="w-48 h-14 bg-gray-300 rounded mx-auto" />
                    </div>
                    <p className="text-gray-500 text-sm mb-6">
                      Haz clic en reproducir para ver la animación
                    </p>

                    {/* Botones de acción */}
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => playDemo(variant.id)}
                        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${variant.color} text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-lato font-bold`}
                      >
                        <Play className="w-4 h-4" />
                        Reproducir
                      </button>

                      <button
                        onClick={() => selectVariant(variant.id)}
                        className={`px-6 py-3 rounded-lg font-lato font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {isSelected ? 'Seleccionado' : 'Seleccionar'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Animación en vivo */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-white">
                    <LoadingScreen
                      isVisible={true}
                      variant={variant.id}
                    />
                  </div>
                )}
              </div>

              {/* Footer con información técnica */}
              <div className="p-4 bg-gray-100 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Duración:</span>
                    <span className="ml-2 font-semibold text-gray-700">2 segundos</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tipo:</span>
                    <span className="ml-2 font-semibold text-gray-700">
                      {variant.id === 'fade-scale' && 'Minimalista'}
                      {variant.id === 'spinner' && 'Dinámico'}
                      {variant.id === 'metallic' && 'Temático'}
                      {variant.id === 'pulse-glow' && 'Moderno'}
                      {variant.id === 'fade-glow' && 'Elegante'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sección de selección actual */}
      <div className="max-w-6xl mx-auto mt-12 bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bebas text-gray-900 mb-3">
            Variante Seleccionada
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
            <p className="text-xl font-lato font-bold text-blue-700">
              {variants.find(v => v.id === selectedVariant)?.name}
            </p>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            {variants.find(v => v.id === selectedVariant)?.description}
          </p>

          {/* Botón para ver la selección en pantalla completa */}
          <button
            onClick={() => playDemo(selectedVariant)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-lato font-bold text-lg flex items-center gap-3 mx-auto"
          >
            <Play className="w-5 h-5" />
            Ver en Pantalla Completa
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="max-w-6xl mx-auto mt-12 text-center text-gray-500 text-sm">
        <p>
          Esta pantalla de carga aparecerá cuando los usuarios visiten la página principal de MEISA por primera vez.
        </p>
        <p className="mt-2">
          La animación tiene una duración mínima garantizada de 2 segundos para asegurar una experiencia visual completa.
        </p>
      </div>
    </div>
  )
}

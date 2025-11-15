'use client'

import { useState } from 'react'
import { LogoHoverEffect, LogoHoverVariant } from '@/components/logo/LogoHoverEffect'
import { Check, MousePointer2, Sparkles } from 'lucide-react'

const effects: Array<{
  id: LogoHoverVariant
  name: string
  description: string
  trend: string
  color: string
}> = [
  {
    id: '3d-tilt',
    name: '3D Tilt',
    description: 'El logo se inclina sutilmente siguiendo el movimiento del mouse con efecto de profundidad 3D',
    trend: 'Muy Popular 2025',
    color: 'from-purple-600 to-purple-700'
  },
  {
    id: 'magnetic',
    name: 'Magnetic',
    description: 'El logo se "atrae" magnéticamente hacia el cursor con movimiento fluido y natural',
    trend: 'Gaming-UI Trend',
    color: 'from-cyan-600 to-cyan-700'
  },
  {
    id: 'glitch',
    name: 'Glitch/Digital',
    description: 'Efecto de distorsión digital tipo glitch con separación RGB, perfecto para look tech/innovador',
    trend: 'Tech/Digital Style',
    color: 'from-pink-600 to-pink-700'
  },
  {
    id: 'glow-scale',
    name: 'Glow + Scale',
    description: 'Logo escala con brillo dinámico que sigue al mouse y sombras envolventes premium',
    trend: 'Elegante Premium',
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'parallax-3d',
    name: 'Parallax 3D',
    description: 'Capas del logo se mueven en profundidades diferentes creando efecto parallax multi-dimensional',
    trend: 'Ultra Moderno',
    color: 'from-indigo-600 to-indigo-700'
  }
]

export default function LogoEffectsDemoPage() {
  const [selectedEffect, setSelectedEffect] = useState<LogoHoverVariant>('3d-tilt')

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-lato font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            TENDENCIAS 2024-2025
          </div>
          <h1 className="text-4xl md:text-5xl font-bebas text-gray-900 mb-4">
            Efectos Hover Modernos para Logo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pasa el mouse sobre cada logo para ver el efecto en acción. Basado en las últimas tendencias de diseño web.
          </p>
        </div>
      </div>

      {/* Grid de efectos */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {effects.map((effect) => {
          const isSelected = selectedEffect === effect.id

          return (
            <div
              key={effect.id}
              className={`relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden shadow-lg ${
                isSelected
                  ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
              }`}
            >
              {/* Header de la tarjeta */}
              <div className={`bg-gradient-to-r ${effect.color} p-4`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bebas text-white mb-1">{effect.name}</h3>
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/20 rounded-full text-white/90 text-xs font-lato">
                      <Sparkles className="w-3 h-3" />
                      {effect.trend}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-4 bg-white/30 rounded-full p-1.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Área de demostración */}
              <div className="relative h-64 bg-white flex items-center justify-center border-t border-b border-gray-100">
                {/* Instrucción */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-lato font-semibold">
                  <MousePointer2 className="w-3 h-3" />
                  Pasa el mouse
                </div>

                {/* Logo con efecto */}
                <div className="flex items-center justify-center w-full h-full">
                  <LogoHoverEffect variant={effect.id} width={250} height={71} />
                </div>

                {/* Grid de fondo decorativo - muy sutil */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="p-4 bg-gray-50">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {effect.description}
                </p>

                <button
                  onClick={() => setSelectedEffect(effect.id)}
                  className={`w-full px-4 py-2.5 rounded-lg font-lato font-bold transition-all duration-300 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isSelected ? 'Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sección de efecto seleccionado */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bebas text-gray-900 mb-3">
              Efecto Seleccionado
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
              <p className="text-2xl font-lato font-bold text-blue-700">
                {effects.find(e => e.id === selectedEffect)?.name}
              </p>
            </div>
            <p className="text-gray-700 max-w-2xl mx-auto mb-8">
              {effects.find(e => e.id === selectedEffect)?.description}
            </p>
          </div>

          {/* Vista previa grande */}
          <div className="bg-white rounded-xl p-12 mb-6 relative overflow-hidden border border-gray-200 shadow-inner">
            {/* Grid de fondo */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px'
                }}
              />
            </div>

            <div className="relative flex items-center justify-center">
              <LogoHoverEffect variant={selectedEffect} width={350} height={99} />
            </div>
          </div>

          {/* Info adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-500 text-sm mb-1">Tendencia</p>
              <p className="text-gray-900 font-lato font-bold">
                {effects.find(e => e.id === selectedEffect)?.trend}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-500 text-sm mb-1">Tecnología</p>
              <p className="text-gray-900 font-lato font-bold">Framer Motion</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-500 text-sm mb-1">Rendimiento</p>
              <p className="text-gray-900 font-lato font-bold">Optimizado GPU</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <p className="text-gray-600 text-sm">
          Este efecto se aplicará al logo del Hero Section en la página principal cuando hagas hover sobre él.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Todos los efectos están optimizados para rendimiento usando transformaciones GPU y Framer Motion.
        </p>
      </div>
    </div>
  )
}

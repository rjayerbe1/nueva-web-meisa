'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Especialidad {
  id: string
  titulo: string
  icono: string
  descripcion: string
  metricas: string[]
  proyectosEjemplo: string[]
  orden: number
  activo: boolean
  imagen?: string
}

interface Props {
  especialidades: Especialidad[]
  color?: string
  onEspecialidadChange?: (especialidad: Especialidad) => void
}

export function EspecialidadesTabs({
  especialidades,
  color = '#3b82f6',
  onEspecialidadChange
}: Props) {
  const especialidadesActivas = especialidades?.filter(e => e.activo) || []
  const [activeIndex, setActiveIndex] = useState(0)

  const handleEspecialidadChange = (index: number) => {
    setActiveIndex(index)
    if (onEspecialidadChange && especialidadesActivas[index]) {
      onEspecialidadChange(especialidadesActivas[index])
    }
  }

  useEffect(() => {
    if (onEspecialidadChange && especialidadesActivas[0]) {
      onEspecialidadChange(especialidadesActivas[0])
    }
  }, [especialidadesActivas.length])

  if (!especialidadesActivas || especialidadesActivas.length === 0) {
    return null
  }

  const especialidadActual = especialidadesActivas[activeIndex]

  return (
    <div className="w-full h-full flex flex-col px-0 lg:px-2 gap-2 lg:gap-4">

      {/* NAVEGACIÓN - TARJETAS */}
      <div className="flex-shrink-0">

        {/* MÓVIL PORTRAIT: Carrusel horizontal deslizable */}
        <div className="flex lg:hidden overflow-x-auto gap-3 px-4 py-2 snap-x snap-mandatory scrollbar-hide">
          {especialidadesActivas.map((esp, index) => {
            const hueRotation = index * 40
            const gradientStart = `hsl(${210 + hueRotation}, 70%, 35%)`
            const gradientEnd = `hsl(${210 + hueRotation}, 60%, 25%)`

            return (
              <button
                key={esp.id}
                onClick={() => handleEspecialidadChange(index)}
                className={`group relative flex-shrink-0 w-[280px] h-[160px] overflow-hidden rounded-xl snap-center transition-all duration-300 ${
                  index === activeIndex
                    ? 'border-2 border-white shadow-xl scale-[1.02]'
                    : 'border border-white/30 opacity-80'
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: esp.imagen
                      ? `url(${esp.imagen})`
                      : `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`
                  }}
                />
                <div className={`absolute inset-0 transition-all duration-300 ${
                  index === activeIndex ? 'bg-black/20' : 'bg-black/50'
                }`} />
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <h4
                    className={`font-bebas uppercase text-center leading-tight drop-shadow-lg ${
                      index === activeIndex
                        ? 'text-white font-bold text-2xl'
                        : 'text-white/90 text-xl'
                    }`}
                    style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}
                  >
                    {esp.titulo}
                  </h4>
                </div>
              </button>
            )
          })}
        </div>

        {/* DESKTOP: Grid de 3 columnas */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 px-2">
          {especialidadesActivas.map((esp, index) => {
            const hueRotation = index * 40
            const gradientStart = `hsl(${210 + hueRotation}, 70%, 35%)`
            const gradientEnd = `hsl(${210 + hueRotation}, 60%, 25%)`

            return (
              <button
                key={esp.id}
                onClick={() => handleEspecialidadChange(index)}
                className={`group relative overflow-hidden rounded-lg transition-all duration-300 h-48 xl:h-56 ${
                  index === activeIndex
                    ? 'border-[3px] border-white shadow-2xl scale-105'
                    : 'border-2 border-white/20 hover:border-white/50 hover:scale-102'
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: esp.imagen
                      ? `url(${esp.imagen})`
                      : `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`
                  }}
                />
                <div className={`absolute inset-0 transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-black/20'
                    : 'bg-black/40 group-hover:bg-black/30'
                }`} />
                <div className="absolute top-1.5 left-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white/90 font-bebas text-xs font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center px-4 py-2">
                  <h4
                    className={`font-bebas uppercase text-center leading-tight drop-shadow-lg ${
                      index === activeIndex
                        ? 'text-white text-2xl lg:text-3xl xl:text-4xl font-bold'
                        : 'text-white/95 text-xl lg:text-2xl xl:text-3xl group-hover:text-white'
                    }`}
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                  >
                    {esp.titulo}
                  </h4>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* CONTENIDO - DESCRIPCIÓN */}
      <div className="flex-1 px-4 py-3 lg:px-6 lg:py-4 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            <div className="text-base sm:text-lg lg:text-xl text-white font-lato mb-4 text-left flex-1 space-y-3 sm:space-y-4 leading-relaxed">
              {especialidadActual.descripcion.split('\n\n').map((parrafo, idx) => (
                <p
                  key={idx}
                  className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  dangerouslySetInnerHTML={{
                    __html: parrafo.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
                  }}
                />
              ))}
            </div>

            {especialidadActual.proyectosEjemplo && especialidadActual.proyectosEjemplo.length > 0 && (
              <div className="mt-auto">
                <h4 className="text-xs sm:text-sm font-lato font-semibold text-white/70 uppercase tracking-wide mb-2">
                  Ideal para
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {especialidadActual.proyectosEjemplo.map((proyecto, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 text-white text-xs sm:text-sm md:text-base font-lato rounded-lg border border-white/20 hover:bg-white/15 transition-all"
                    >
                      <span className="text-blue-400">●</span>
                      {proyecto}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

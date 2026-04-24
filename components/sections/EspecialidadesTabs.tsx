'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Especialidad {
  id: string
  titulo: string
  icono: string
  descripcion: string
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
  onEspecialidadChange,
}: Props) {
  const especialidadesActivas = especialidades?.filter((e) => e.activo) || []
  const [activeIndex, setActiveIndex] = useState(0)

  const handleEspecialidadChange = (index: number) => {
    setActiveIndex(index)
    if (onEspecialidadChange && especialidadesActivas[index]) {
      onEspecialidadChange(especialidadesActivas[index])
    }
  }

  // Al montar, auto-seleccionar la primera especialidad activa
  // para que la imagen del hero tenga una fuente.
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
    <div className="w-full h-full flex flex-col mobile-landscape-layout px-0 lg:px-2 gap-2 lg:gap-4">
      {/* NAVEGACIÓN — TABS BRUTALIST */}
      <div className="flex-shrink-0 mobile-landscape-sidebar">
        {/* MÓVIL PORTRAIT: scroll horizontal sharp */}
        <div className="flex lg:hidden hide-on-mobile-landscape overflow-x-auto gap-0 px-4 py-2 snap-x snap-mandatory scrollbar-hide border-y border-white/10">
          {especialidadesActivas.map((esp, index) => (
            <button
              key={esp.id}
              onClick={() => handleEspecialidadChange(index)}
              className={`group relative flex-shrink-0 w-[240px] h-[120px] snap-center transition-colors duration-300 ${
                index === activeIndex
                  ? 'border border-white bg-white/5'
                  : 'border border-white/15 hover:border-white/40'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-start px-5">
                <div>
                  <span className="text-white/40 font-bebas text-2xl leading-none block mb-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4
                    className={`font-bebas uppercase leading-[0.95] text-xl ${
                      index === activeIndex ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    {esp.titulo}
                  </h4>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* MÓVIL LANDSCAPE: verticales al lado izquierdo */}
        <div className="hidden show-on-mobile-landscape mobile-landscape-cards">
          {especialidadesActivas.map((esp, index) => (
            <button
              key={esp.id}
              onClick={() => handleEspecialidadChange(index)}
              className={`mobile-landscape-card group relative transition-colors duration-300 ${
                index === activeIndex
                  ? 'border border-white bg-white/5 mobile-landscape-card-active'
                  : 'border border-white/15 hover:border-white/40'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center px-2">
                <h4
                  className={`font-bebas uppercase text-center leading-tight text-sm ${
                    index === activeIndex ? 'text-white' : 'text-white/80'
                  }`}
                >
                  {esp.titulo}
                </h4>
              </div>
            </button>
          ))}
        </div>

        {/* DESKTOP: grid 3-col brutalist */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-0 border-y border-white/10">
          {especialidadesActivas.map((esp, index) => (
            <button
              key={esp.id}
              onClick={() => handleEspecialidadChange(index)}
              className={`group relative h-40 xl:h-44 transition-colors duration-300 text-left ${
                index === activeIndex
                  ? 'bg-white/5 border-l-2 border-white'
                  : 'border-l border-white/10 hover:bg-white/[0.02]'
              } ${index === 0 ? '' : ''}`}
            >
              <div className="absolute inset-0 flex items-end px-6 py-5">
                <div className="w-full">
                  <span
                    className={`font-bebas text-3xl leading-none block mb-2 transition-colors duration-300 ${
                      index === activeIndex ? 'text-red-500' : 'text-white/30'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4
                    className={`font-bebas uppercase leading-[0.95] text-2xl xl:text-3xl transition-colors duration-300 ${
                      index === activeIndex
                        ? 'text-white'
                        : 'text-white/70 group-hover:text-white'
                    }`}
                  >
                    {esp.titulo}
                  </h4>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENIDO — DESCRIPCIÓN */}
      <div className="flex-1 mobile-landscape-content px-4 py-3 lg:px-6 lg:py-4 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            <div className="text-base sm:text-lg lg:text-xl text-white/80 font-lato mb-4 text-left flex-1 space-y-3 sm:space-y-4 leading-relaxed max-w-3xl">
              {especialidadActual.descripcion.split('\n\n').map((parrafo, idx) => (
                <p
                  key={idx}
                  className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  dangerouslySetInnerHTML={{
                    __html: parrafo.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="font-bold text-white">$1</strong>',
                    ),
                  }}
                />
              ))}
            </div>

            {especialidadActual.proyectosEjemplo &&
              especialidadActual.proyectosEjemplo.length > 0 && (
                <div className="mt-auto ideal-para-section">
                  <p className="text-white/40 font-lato font-bold text-xs uppercase tracking-[0.2em] mb-3">
                    Ideal para
                  </p>
                  <p className="text-white/70 font-lato text-sm sm:text-base ideal-para-tags leading-relaxed">
                    {especialidadActual.proyectosEjemplo.map((proyecto, idx) => (
                      <span key={idx} className="ideal-para-tag">
                        {idx > 0 && (
                          <span className="mx-2 text-white/30">·</span>
                        )}
                        <span className="text-white">{proyecto}</span>
                      </span>
                    ))}
                  </p>
                </div>
              )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

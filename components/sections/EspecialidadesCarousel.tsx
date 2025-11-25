'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Especialidad {
  id: string
  titulo: string
  icono: string
  descripcion: string
  metricas: string[]
  proyectosEjemplo: string[]
  orden: number
  activo: boolean
}

interface Props {
  especialidades: Especialidad[]
  color?: string
  autoRotate?: boolean
  rotateInterval?: number
}

export function EspecialidadesCarousel({
  especialidades,
  color = '#3b82f6',
  autoRotate = true,
  rotateInterval = 8000
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Filtrar solo especialidades activas
  const especialidadesActivas = especialidades?.filter(e => e.activo) || []

  // Auto-rotación
  useEffect(() => {
    if (!autoRotate || especialidadesActivas.length <= 1) return

    const interval = setInterval(() => {
      siguiente()
    }, rotateInterval)

    return () => clearInterval(interval)
  }, [currentIndex, autoRotate, rotateInterval, especialidadesActivas.length])

  const siguiente = () => {
    setDirection(1)
    setCurrentIndex((prev) =>
      prev === especialidadesActivas.length - 1 ? 0 : prev + 1
    )
  }

  const anterior = () => {
    setDirection(-1)
    setCurrentIndex((prev) =>
      prev === 0 ? especialidadesActivas.length - 1 : prev - 1
    )
  }

  const irA = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  if (!especialidadesActivas || especialidadesActivas.length === 0) {
    return null
  }

  const especialidadActual = especialidadesActivas[currentIndex]

  // Resaltar métricas en el texto
  const highlightMetricas = (texto: string) => {
    let textoConHighlights = texto

    especialidadActual.metricas?.forEach((metrica) => {
      const regex = new RegExp(`(${metrica.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
      textoConHighlights = textoConHighlights.replace(
        regex,
        '<span class="font-bold text-blue-300">$1</span>'
      )
    })

    return textoConHighlights
  }

  // Variantes para animación
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <div className="w-full relative">
      {/* Carrusel container */}
      <div className="relative bg-white/10 backdrop-blur-md border-y border-white/20 overflow-hidden min-h-[320px] md:min-h-[380px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="px-6 py-8 md:px-12 md:py-10 lg:px-16 lg:py-12"
          >
            {/* Título */}
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bebas uppercase text-white leading-tight">
                {especialidadActual.titulo}
              </h3>
            </div>

            {/* Descripción con métricas destacadas */}
            <div
              className="text-base md:text-lg lg:text-xl text-white/90 font-lato leading-relaxed mb-6 text-justify max-w-5xl"
              dangerouslySetInnerHTML={{
                __html: highlightMetricas(especialidadActual.descripcion)
              }}
            />

            {/* Footer con métricas y proyectos */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Métricas */}
              {especialidadActual.metricas && especialidadActual.metricas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {especialidadActual.metricas.slice(0, 4).map((metrica, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/30 text-white text-xs md:text-sm font-lato font-semibold rounded-full border border-blue-400/30"
                    >
                      ▸ {metrica}
                    </span>
                  ))}
                </div>
              )}

              {/* Proyectos ejemplo */}
              {especialidadActual.proyectosEjemplo && especialidadActual.proyectosEjemplo.length > 0 && (
                <div className="text-xs md:text-sm text-white/70 font-lato italic">
                  Proyectos: {especialidadActual.proyectosEjemplo.join(', ')}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navegación - Flechas */}
        {especialidadesActivas.length > 1 && (
          <>
            <button
              onClick={anterior}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/30 transition-all duration-300 group"
              aria-label="Anterior especialidad"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={siguiente}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/30 transition-all duration-300 group"
              aria-label="Siguiente especialidad"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
      </div>

      {/* Indicadores (dots) */}
      {especialidadesActivas.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {especialidadesActivas.map((_, index) => (
            <button
              key={index}
              onClick={() => irA(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Ir a especialidad ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

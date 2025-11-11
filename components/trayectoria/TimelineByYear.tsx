"use client"

import { useState, useMemo, useEffect } from 'react'
import { AnimatedSection } from '@/components/animations/AnimatedSection'
import { ProyectoListItem } from '@/components/trayectoria/ProyectoListItem'
import { ProyectoModal } from '@/components/trayectoria/ProyectoModal'
import { ResumenAnioCard } from '@/components/trayectoria/ResumenAnioCard'

interface Proyecto {
  id: string
  entidadContratante: string
  objetoContrato: string
  fechaInicio: string
  fechaFin: string
  ubicacion: string
  departamento: string | null
  valorContrato: number
  pesoKg: number | null
  areaM2: number | null
  nivelDetalle: 'BAJO' | 'MEDIO' | 'ALTO'
  imagenes: string[] | null
  destacado: boolean
}

interface ResumenAnio {
  id: string
  anio: number
  titulo: string
  descripcion: string
  categorias: string[] | null
  imagenesFeatured: string[] | null
  estadisticas: {
    proyectos: number
    toneladas: number
    m2: number
  } | null
  visible: boolean
}

interface Props {
  proyectos: Proyecto[]
}

export function TimelineByYear({ proyectos }: Props) {
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null)
  const [resumenes, setResumenes] = useState<Record<number, ResumenAnio>>({})
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())

  // Cargar resúmenes de años
  useEffect(() => {
    fetch('/api/trayectoria/resumenes?visible=true')
      .then(res => res.json())
      .then((data: ResumenAnio[]) => {
        const resumenesMap = data.reduce((acc, resumen) => {
          acc[resumen.anio] = resumen
          return acc
        }, {} as Record<number, ResumenAnio>)
        setResumenes(resumenesMap)
      })
      .catch(err => console.error('Error loading resumenes:', err))
  }, [])

  const toggleYear = (year: number) => {
    setExpandedYears(prev => {
      const newSet = new Set(prev)
      if (newSet.has(year)) {
        newSet.delete(year)
      } else {
        newSet.add(year)
      }
      return newSet
    })
  }

  // Agrupar proyectos por año (distribución proporcional para multi-año)
  const proyectosPorAño = useMemo(() => {
    const grouped: Record<number, Array<Proyecto & { pesoKgProporcional?: number }>> = {}

    proyectos.forEach((proyecto) => {
      const fechaInicio = new Date(proyecto.fechaInicio)
      const fechaFin = new Date(proyecto.fechaFin)
      const yearInicio = fechaInicio.getFullYear()
      const yearFin = fechaFin.getFullYear()

      // Si el proyecto está en un solo año
      if (yearInicio === yearFin) {
        if (!grouped[yearFin]) grouped[yearFin] = []
        grouped[yearFin].push({
          ...proyecto,
          pesoKgProporcional: proyecto.pesoKg || undefined
        })
      } else {
        // Proyecto multi-año: distribuir proporcionalmente
        const mesesTotales = (yearFin - yearInicio) * 12 + (fechaFin.getMonth() - fechaInicio.getMonth()) + 1

        for (let year = yearInicio; year <= yearFin; year++) {
          let mesesEnAño = 0

          if (year === yearInicio) {
            mesesEnAño = 12 - fechaInicio.getMonth()
          } else if (year === yearFin) {
            mesesEnAño = fechaFin.getMonth() + 1
          } else {
            mesesEnAño = 12
          }

          const proporcion = mesesEnAño / mesesTotales

          if (!grouped[year]) grouped[year] = []
          grouped[year].push({
            ...proyecto,
            pesoKgProporcional: proyecto.pesoKg ? proyecto.pesoKg * proporcion : undefined
          })
        }
      }
    })

    // Ordenar por año descendente (más reciente primero)
    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => b - a)
      .map((año) => ({
        año,
        proyectos: grouped[año].sort((a, b) => {
          // Destacados primero
          if (a.destacado && !b.destacado) return -1
          if (!a.destacado && b.destacado) return 1
          // Luego por fecha
          return new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
        })
      }))
  }, [proyectos])

  return (
    <div className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6">
        <AnimatedSection direction="up" className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Nuestra Trayectoria
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Un recorrido cronológico por los proyectos que han marcado nuestra historia
          </p>
        </AnimatedSection>

        {/* Zigzag Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical line in center */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-400 hidden md:block" />

          {/* Timeline items */}
          <div className="space-y-16">
            {proyectosPorAño.map(({ año, proyectos: proyectosAño }, index) => {
              const isLeft = index % 2 === 0

              const resumenAnio = resumenes[año]

              return (
                <div key={año} className="relative">
                  {/* Year badge - Always in center with connection lines */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-12 z-10 hidden md:flex items-center">
                    {/* Left line */}
                    <div className="w-6 h-0.5 bg-blue-400 mr-2"></div>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full shadow-xl border-4 border-white">
                      <p className="text-2xl font-bold">{año}</p>
                    </div>
                    {/* Right line */}
                    <div className="w-6 h-0.5 bg-blue-400 ml-2"></div>
                  </div>

                  {/* Year badge mobile - At top */}
                  <div className="md:hidden mb-6 text-center">
                    <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full shadow-xl">
                      <p className="text-2xl font-bold">{año}</p>
                    </div>
                  </div>

                  {/* Projects container - alternates left/right */}
                  <AnimatedSection
                    direction={isLeft ? 'right' : 'left'}
                    delay={index * 0.05}
                    className={`md:w-[calc(50%-4rem)] ${
                      isLeft ? 'md:mr-auto md:pr-6' : 'md:ml-auto md:pl-6'
                    }`}
                  >
                    {/* Projects list */}
                    <div className="space-y-3 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                      {/* Proyectos destacados siempre se muestran primero */}
                      {(() => {
                        const isExpanded = expandedYears.has(año)
                        const proyectosAMostrar = isExpanded ? proyectosAño : proyectosAño.slice(0, 4)
                        const hayMas = proyectosAño.length > 4

                        return (
                          <>
                            {proyectosAMostrar.map((proyecto) => (
                              <ProyectoListItem
                                key={proyecto.id}
                                proyecto={proyecto}
                                onClick={() => setSelectedProyecto(proyecto)}
                              />
                            ))}

                            {/* Botón Mostrar más/menos */}
                            {hayMas && (
                              <button
                                onClick={() => toggleYear(año)}
                                className="w-full mt-4 py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                {isExpanded ? (
                                  <>
                                    Mostrar menos
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    Mostrar más ({proyectosAño.length - 4} proyectos adicionales)
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </>
                                )}
                              </button>
                            )}
                          </>
                        )
                      })()}
                    </div>

                  </AnimatedSection>

                  {/* Resumen Año Card - lado opuesto */}
                  {resumenAnio && (
                    <AnimatedSection
                      direction={isLeft ? 'left' : 'right'}
                      delay={index * 0.05 + 0.2}
                      className={`md:w-[calc(50%-4rem)] md:absolute md:top-0 mt-6 md:mt-0 ${
                        isLeft ? 'md:ml-auto md:right-0 md:pl-6' : 'md:mr-auto md:left-0 md:pr-6'
                      }`}
                    >
                      <ResumenAnioCard resumen={resumenAnio} />
                    </AnimatedSection>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal de Detalles */}
      {selectedProyecto && (
        <ProyectoModal
          proyecto={selectedProyecto}
          onClose={() => setSelectedProyecto(null)}
        />
      )}
    </div>
  )
}

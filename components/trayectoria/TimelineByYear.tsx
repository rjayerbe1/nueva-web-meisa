"use client"

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    const currentYear = new Date().getFullYear()

    proyectos.forEach((proyecto) => {
      const fechaInicio = new Date(proyecto.fechaInicio)
      const fechaFin = new Date(proyecto.fechaFin)
      const yearInicio = fechaInicio.getFullYear()
      const yearFin = fechaFin.getFullYear()

      // Si el proyecto está en un solo año
      if (yearInicio === yearFin) {
        if (yearFin > currentYear) return // año futuro: aún no llega
        if (!grouped[yearFin]) grouped[yearFin] = []
        grouped[yearFin].push({
          ...proyecto,
          pesoKgProporcional: proyecto.pesoKg || undefined
        })
      } else {
        // Proyecto multi-año: distribuir proporcionalmente
        const mesesTotales = (yearFin - yearInicio) * 12 + (fechaFin.getMonth() - fechaInicio.getMonth()) + 1

        for (let year = yearInicio; year <= yearFin; year++) {
          if (year > currentYear) continue // no crear bucket de años futuros

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
    <section className="py-20 md:py-28 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20 max-w-3xl"
        >
          <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
            Recorrido cronológico
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
            Año a año
          </h2>
          <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
            construyendo.
          </h3>
          <p className="mt-6 text-base md:text-lg text-slate-700 font-lato leading-relaxed">
            Cada proyecto entregado es parte de una historia técnica que se escribe en acero.
          </p>
        </motion.div>

        {/* Timeline zigzag */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical line central - sharp */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 hidden md:block" />

          <div className="space-y-20 md:space-y-28">
            {proyectosPorAño.map(({ año, proyectos: proyectosAño }, index) => {
              const isLeft = index % 2 === 0
              const resumenAnio = resumenes[año]

              return (
                <div key={año} className="relative">
                  {/* Year block - brutalist, sharp, centered */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 hidden md:block">
                    <div className="bg-slate-950 text-white px-6 py-3 border-4 border-stone-50">
                      <p className="text-3xl font-bebas uppercase leading-none tracking-wider">
                        {año}
                      </p>
                    </div>
                  </div>

                  {/* Year block mobile */}
                  <div className="md:hidden mb-6">
                    <div className="inline-block bg-slate-950 text-white px-6 py-3">
                      <p className="text-3xl font-bebas uppercase leading-none tracking-wider">
                        {año}
                      </p>
                    </div>
                  </div>

                  {/* Projects container — alternates left/right */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: index * 0.04 }}
                    className={`md:w-[calc(50%-4rem)] md:pt-16 ${
                      isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                    }`}
                  >
                    <div className="bg-white border border-slate-200 p-6 md:p-8">
                      <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                        Proyectos del año
                      </p>
                      <div className="space-y-2">
                        {(() => {
                          const isExpanded = expandedYears.has(año)
                          const hasResumenWithImages = resumenAnio && resumenAnio.imagenesFeatured && resumenAnio.imagenesFeatured.length > 0
                          const defaultCount = hasResumenWithImages ? 7 : 4
                          const proyectosAMostrar = isExpanded ? proyectosAño : proyectosAño.slice(0, defaultCount)
                          const hayMas = proyectosAño.length > defaultCount

                          return (
                            <>
                              {proyectosAMostrar.map((proyecto) => (
                                <ProyectoListItem
                                  key={proyecto.id}
                                  proyecto={proyecto}
                                  onClick={() => setSelectedProyecto(proyecto)}
                                />
                              ))}

                              {hayMas && (
                                <button
                                  onClick={() => toggleYear(año)}
                                  className="group w-full mt-4 py-3 px-4 border border-slate-300 hover:border-slate-950 hover:bg-slate-950 hover:text-white text-slate-700 font-lato font-bold text-xs uppercase tracking-[0.15em] transition-colors duration-300 flex items-center justify-center gap-2"
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
                                      Mostrar {proyectosAño.length - defaultCount} más
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
                    </div>
                  </motion.div>

                  {/* Resumen Año Card - lado opuesto */}
                  {resumenAnio && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.6, delay: index * 0.04 + 0.1 }}
                      className={`md:w-[calc(50%-4rem)] md:absolute md:top-16 mt-6 md:mt-0 ${
                        isLeft ? 'md:ml-auto md:right-0 md:pl-8' : 'md:mr-auto md:left-0 md:pr-8'
                      }`}
                    >
                      <ResumenAnioCard resumen={resumenAnio} />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selectedProyecto && (
        <ProyectoModal
          proyecto={selectedProyecto}
          onClose={() => setSelectedProyecto(null)}
        />
      )}
    </section>
  )
}

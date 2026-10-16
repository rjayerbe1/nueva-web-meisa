"use client"

import { useState } from 'react'
import Link from 'next/link'
import { HeroTrayectoria } from '@/components/trayectoria/HeroTrayectoria'
import { TimelineByYear } from '@/components/trayectoria/TimelineByYear'

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
  visible: boolean
  destacado: boolean
}

interface Stats {
  totalProyectos: number
  totalToneladas: number
  departamentos: number
  añosExperiencia: number
  proyectosPorAño: Record<number, number>
}

interface Props {
  proyectos: Proyecto[]
  stats: Stats | null
}

export function TrayectoriaClient({ proyectos, stats }: Props) {
  const [filteredProyectos, setFilteredProyectos] = useState(proyectos)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroTrayectoria stats={stats} />

      {/* Campaña 30 años: enlace al artículo con los cinco hitos */}
      <Link
        href="/construccion-acero-colombia-30-anos"
        className="group block border-b border-slate-200 bg-stone-50"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-8 flex flex-col md:flex-row md:items-center gap-3 md:gap-10">
          <p className="text-red-600 font-lato font-bold text-xs uppercase tracking-[0.25em] flex-none">
            1996 — 2026
          </p>
          <p className="font-bebas uppercase text-3xl md:text-4xl leading-none text-slate-950">
            30 años de estructura: nuestra historia en cinco hitos
          </p>
          <span className="md:ml-auto font-lato font-bold text-sm uppercase tracking-[0.18em] text-slate-950 transition-transform duration-300 group-hover:translate-x-1">
            Leer la historia <span className="text-red-600">→</span>
          </span>
        </div>
      </Link>

      {/* Timeline de Proyectos por Año */}
      <TimelineByYear proyectos={filteredProyectos} />
    </div>
  )
}

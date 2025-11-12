"use client"

import { useState } from 'react'
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
  valorTotal: number
  valorTotalFormateado: string
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

      {/* Timeline de Proyectos por Año */}
      <TimelineByYear proyectos={filteredProyectos} />
    </div>
  )
}

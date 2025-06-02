"use client"

import { useMemo } from "react"
import ProjectCategoriesSection from "@/components/sections/ProjectCategoriesSection"

interface Proyecto {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  estado: string
  cliente: string
  ubicacion: string
  fechaInicio: Date
  presupuesto: any
  slug: string
  destacado: boolean
}

interface ProjectsPageClientProps {
  proyectos: Proyecto[]
}

export default function ProjectsPageClient({ proyectos }: ProjectsPageClientProps) {
  // Agrupar proyectos por categoría para el conteo
  const projectsByCategory = useMemo(() => {
    const groups: Record<string, Proyecto[]> = {}
    proyectos.forEach(proyecto => {
      if (!groups[proyecto.categoria]) {
        groups[proyecto.categoria] = []
      }
      groups[proyecto.categoria].push(proyecto)
    })
    return groups
  }, [proyectos])

  return (
    <div className="min-h-screen bg-white">
      {/* Categories Section */}
      <ProjectCategoriesSection projectsByCategory={projectsByCategory} />
    </div>
  )
}
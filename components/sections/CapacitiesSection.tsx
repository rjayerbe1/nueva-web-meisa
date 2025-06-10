'use client'

import { UnifiedStatsGrid } from '@/components/ui/unified-stats-card'

const capacities = [
  {
    number: "600",
    label: "Capacidad de Producción",
    suffix: " ton/mes"
  },
  {
    number: "3",
    label: "Plantas Industriales",
    suffix: ""
  },
  {
    number: "320",
    label: "Equipo Especializado",
    suffix: ""
  },
  {
    number: "27",
    label: "Años de Experiencia",
    suffix: "+"
  },
  {
    number: "62",
    label: "Proyectos Ejecutados",
    suffix: "+"
  },
  {
    number: "8",
    label: "Puentes Grúa",
    suffix: ""
  }
]

export function CapacitiesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="relative z-10">
        <UnifiedStatsGrid
          title="Infraestructura que Respalda la Excelencia"
          subtitle="Con más de dos décadas de experiencia, contamos con la infraestructura, tecnología y talento humano para ejecutar los proyectos más ambiciosos de Colombia."
          stats={capacities}
          variant="default"
          colorScheme="blue"
          columns={3}
          showDecorator={true}
        />
      </div>
    </section>
  )
}
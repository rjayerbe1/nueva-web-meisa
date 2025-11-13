'use client'

import { UnifiedStatsGrid } from '@/components/ui/unified-stats-card'
import { siteConfig } from '@/lib/site-config'

const capacities = [
  {
    number: String(siteConfig.empresa.aniosExperiencia),
    label: "Años de Experiencia",
    suffix: "+"
  },
  {
    number: "500",
    label: "Proyectos Ejecutados",
    suffix: "+"
  },
  {
    number: "600",
    label: "Capacidad de Producción",
    suffix: " ton/mes"
  },
  {
    number: "220",
    label: "Empleados Directos",
    suffix: ""
  },
  {
    number: "10,400",
    label: "M² en 3 Plantas",
    suffix: ""
  },
  {
    number: "8",
    label: "Puentes Grúa",
    suffix: ""
  },
  {
    number: "3",
    label: "Mesas de Corte CNC",
    suffix: ""
  },
  {
    number: "8",
    label: "Software Especializado",
    suffix: ""
  }
]

export function CapacitiesSection() {
  return (
    <section id="capacidades" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="relative z-10">
        <UnifiedStatsGrid
          title="Números que Respaldan la Excelencia"
          subtitle="Más de dos décadas de trayectoria respaldadas por infraestructura de clase mundial, talento humano especializado y resultados concretos en los proyectos más ambiciosos de Colombia."
          stats={capacities}
          variant="default"
          colorScheme="blue"
          columns={4}
          showDecorator={true}
        />
      </div>
    </section>
  )
}
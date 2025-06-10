'use client'

import { COMPANY_STATS } from '@/lib/company-data'
import { UnifiedStatsGrid } from '@/components/ui/unified-stats-card'

const stats = [
  {
    number: COMPANY_STATS.EMPLOYEES.toString(),
    label: 'Empleados Directos',
    suffix: ''
  },
  {
    number: COMPANY_STATS.YEARS_EXPERIENCE.toString(),
    label: 'Años de Experiencia',
    suffix: '+'
  },
  {
    number: COMPANY_STATS.PLANTS.toString(),
    label: 'Plantas Industriales',
    suffix: ''
  },
  {
    number: COMPANY_STATS.MONTHLY_CAPACITY.toString(),
    label: 'Capacidad Total',
    suffix: ' ton/mes'
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Fondo decorativo simplificado */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-gray-50/50" />
      </div>

      <div className="relative z-10">
        <UnifiedStatsGrid
          title="Números que Respaldan Nuestra Experiencia"
          subtitle="Décadas de experiencia respaldadas por resultados concretos y clientes satisfechos"
          stats={stats}
          variant="default"
          colorScheme="blue"
          columns={4}
          showDecorator={true}
        />
      </div>
    </section>
  )
}
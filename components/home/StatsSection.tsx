"use client"

import { COMPANY_STATS } from '@/lib/company-data'
import { UnifiedStatsGrid } from '@/components/ui/unified-stats-card'

const stats = [
  {
    number: COMPANY_STATS.PROJECTS_COMPLETED.toString(),
    label: 'Proyectos Completados',
    suffix: '+'
  },
  {
    number: COMPANY_STATS.YEARS_EXPERIENCE.toString(),
    label: 'Años de Experiencia',
    suffix: ''
  },
  {
    number: COMPANY_STATS.MONTHLY_CAPACITY.toString(),
    label: 'Toneladas/Mes',
    suffix: ''
  },
  {
    number: COMPANY_STATS.TOTAL_TEAM.toString(),
    label: 'Colaboradores',
    suffix: '+'
  }
]

export function StatsSection() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 sm:py-24">
      <div className="relative z-10">
        <UnifiedStatsGrid
          title="Números que hablan por nosotros"
          subtitle="Nuestro compromiso con la excelencia se refleja en cada proyecto"
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
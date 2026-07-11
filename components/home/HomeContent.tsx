'use client'

import { HeroImageConfig } from '@/lib/hero-config'
import { LoadingProvider } from '@/contexts/LoadingContext'

import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSectionNew'
import { ProjectsByCategorySection } from '@/components/sections/ProjectsByCategorySection'
import { SolucionesSeoSection } from '@/components/sections/SolucionesSeoSection'
import { ClientesSection } from '@/components/sections/ClientesSection'
import {
  FeaturedProjectSection,
  type FeaturedProjectData,
} from '@/components/sections/FeaturedProjectSection'
import { StatsStrip, type StatItem } from '@/components/sections/StatsStrip'
import {
  ContactSection,
  type ContactoConfig,
  type ContactSectionCopy,
} from '@/components/sections/ContactSection'
import type { ServicioItem } from '@/components/sections/ServicesSectionNew'
import type { ClientesCopy, ObraEnCifras } from '@/components/sections/ClientesSection'
import type { CategoriaPublica } from '@/lib/content/categorias'

export interface HomeContentProps {
  projectsByCategory: Record<string, any[]>
  categorias: CategoriaPublica[]
  heroImages: HeroImageConfig
  heroVideos?: { desktop: string | null; mobile: string | null }
  especialidades: string[]
  stats: StatItem[]
  featured: FeaturedProjectData | null
  servicios: ServicioItem[]
  clientesCopy: ClientesCopy | null
  obrasEnCifras?: ObraEnCifras[]
  contactCopy: ContactSectionCopy | null
  contactoConfig: ContactoConfig | null
  orden: Array<{ clave: string; activo: boolean }>
  foundingYear: number
}

type SeccionKey =
  | 'hero'
  | 'stats'
  | 'featured-project'
  | 'servicios'
  | 'proyectos'
  | 'soluciones'
  | 'clientes'
  | 'contacto'

const DEFAULT_ORDEN: Array<{ clave: SeccionKey; activo: boolean }> = [
  { clave: 'hero', activo: true },
  { clave: 'stats', activo: true },
  { clave: 'featured-project', activo: true },
  { clave: 'servicios', activo: true },
  { clave: 'clientes', activo: true },
  { clave: 'proyectos', activo: true },
  { clave: 'soluciones', activo: true },
  { clave: 'contacto', activo: true },
]

export function HomeContent({
  projectsByCategory,
  categorias,
  heroImages,
  heroVideos,
  especialidades,
  stats,
  featured,
  servicios,
  clientesCopy,
  obrasEnCifras,
  contactCopy,
  contactoConfig,
  orden,
  foundingYear,
}: HomeContentProps) {
  const ordenBase = (orden && orden.length > 0 ? orden : DEFAULT_ORDEN) as Array<{
    clave: SeccionKey
    activo: boolean
  }>
  // Secciones nuevas del código que aún no están en el orden guardado en DB:
  // se insertan en su posición por defecto (no desaparecen silenciosamente).
  const ordenResuelto = [...ordenBase]
  DEFAULT_ORDEN.forEach((def, defIdx) => {
    if (ordenResuelto.some((s) => s.clave === def.clave)) return
    const anterior = DEFAULT_ORDEN[defIdx - 1]?.clave
    const idx = anterior
      ? ordenResuelto.findIndex((s) => s.clave === anterior)
      : -1
    ordenResuelto.splice(idx >= 0 ? idx + 1 : ordenResuelto.length, 0, def)
  })

  const renderSeccion = (clave: SeccionKey) => {
    switch (clave) {
      case 'hero':
        return (
          <section id="inicio" className="w-full" key={clave}>
            <HeroSection
              heroImages={heroImages}
              heroVideos={heroVideos}
              specialties={especialidades}
            />
          </section>
        )
      case 'stats':
        return (
          <section id="cifras" className="relative z-40" key={clave}>
            <StatsStrip stats={stats} />
          </section>
        )
      case 'featured-project':
        return (
          <section id="nosotros" className="relative z-40 bg-white" key={clave}>
            <FeaturedProjectSection featured={featured} />
          </section>
        )
      case 'servicios':
        return (
          <section id="servicios" className="relative z-40 bg-white" key={clave}>
            <ServicesSection servicios={servicios} />
          </section>
        )
      case 'proyectos':
        return (
          <section id="proyectos" className="relative z-40 bg-white" key={clave}>
            <ProjectsByCategorySection projectsByCategory={projectsByCategory} categorias={categorias} />
          </section>
        )
      case 'soluciones':
        return (
          <section id="soluciones" className="relative z-40" key={clave}>
            <SolucionesSeoSection />
          </section>
        )
      case 'clientes':
        return (
          <section id="clientes" className="relative z-40" key={clave}>
            <ClientesSection copy={clientesCopy} foundingYear={foundingYear} obrasEnCifras={obrasEnCifras} />
          </section>
        )
      case 'contacto':
        return (
          <section id="contacto" className="relative z-40" key={clave}>
            <ContactSection
              config={contactoConfig}
              copy={contactCopy}
              foundingYear={foundingYear}
            />
          </section>
        )
      default:
        return null
    }
  }

  return (
    <LoadingProvider>
      <div className="w-full bg-white">
        {ordenResuelto
          .filter((s) => s.activo)
          .map((s) => renderSeccion(s.clave))}
      </div>
    </LoadingProvider>
  )
}

'use client'

import { HeroImageConfig } from '@/lib/hero-config'
import { LoadingProvider } from '@/contexts/LoadingContext'

import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSectionNew'
import { ExpertiseTransitionSection } from '@/components/sections/ExpertiseTransitionSection'
import { ProjectsByCategorySection } from '@/components/sections/ProjectsByCategorySection'
import { ClientesSection } from '@/components/sections/ClientesSection'
import { AboutSection } from '@/components/sections/AboutSectionNew'
import { ContactSection } from '@/components/sections/ContactSection'

interface HomeContentProps {
  projectsByCategory: Record<string, any[]>
  heroImages: HeroImageConfig
}

export function HomeContent({ projectsByCategory, heroImages }: HomeContentProps) {
  return (
    <LoadingProvider>
      <div className="w-full bg-white">
        <section id="inicio" className="w-full">
          <HeroSection heroImages={heroImages} />
        </section>

        <section id="nosotros" className="relative z-40 bg-white">
          <AboutSection />
        </section>

        <section id="servicios" className="relative z-40 bg-white">
          <ServicesSection />
        </section>

        <ExpertiseTransitionSection />

        <section id="proyectos" className="relative z-40 bg-white">
          <ProjectsByCategorySection projectsByCategory={projectsByCategory} />
        </section>

        <section id="clientes" className="relative z-40 bg-white">
          <ClientesSection />
        </section>

        <section id="contacto" className="relative z-40 bg-white">
          <ContactSection />
        </section>
      </div>
    </LoadingProvider>
  )
}

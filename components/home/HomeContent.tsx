'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ChevronLeft, ChevronRight, ArrowDown,
  Home, Building2, BarChart3, Users, Settings,
  Monitor, Factory, Award, UserCheck, Heart, MessageSquare
} from 'lucide-react'
import * as Icons from 'lucide-react'

// Importaciones de componentes
import { HeroSection } from '@/components/sections/HeroSection'
import { CapacitiesSection } from '@/components/sections/CapacitiesSection'
import { ServicesSection } from '@/components/sections/ServicesSectionNew'
import { ProjectsByCategorySection } from '@/components/sections/ProjectsByCategorySection'
import { ClientesSection } from '@/components/sections/ClientesSection'
import { AboutSection } from '@/components/sections/AboutSectionNew'
import { ContactSection } from '@/components/sections/ContactSection'

interface HomeSection {
  id: string
  titulo: string
  icon: string
}

interface HomeContentProps {
  projectsByCategory: Record<string, any[]>
  sections: HomeSection[]
}

export function HomeContent({ projectsByCategory, sections }: HomeContentProps) {
  const [activeSection, setActiveSection] = useState('inicio') // Inicializar con 'inicio'
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [showSideNav, setShowSideNav] = useState(false) // Para mostrar nav lateral
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})
  const navRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  // Scroll spy mejorado para hero de pantalla completa
  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 640
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Definir límites específicos para cada tipo de pantalla
      const heroThreshold = isMobile ? windowHeight * 0.8 : windowHeight * 0.7 // 80% en móvil, 70% en desktop

      // Mostrar navegación lateral cuando pasamos el hero (solo desktop)
      if (!isMobile) {
        setShowSideNav(scrollY > heroThreshold)
      }

      // Si estamos en la sección hero (primera pantalla)
      if (scrollY < heroThreshold) {
        setActiveSection('inicio')
        return
      }

      // Para las demás secciones, usar detección por posición del scroll
      let currentSection = 'inicio'
      let minDistance = Infinity

      // Revisar todas las secciones excepto inicio
      Object.entries(sectionsRef.current).forEach(([id, element]) => {
        if (element && id !== 'inicio') {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + scrollY
          
          // Calcular la distancia desde el top de la ventana al inicio de la sección
          const distanceFromTop = Math.abs(scrollY + (windowHeight * 0.3) - elementTop)
          
          // Si esta sección está más cerca del área de detección
          if (distanceFromTop < minDistance) {
            minDistance = distanceFromTop
            currentSection = id
          }
        }
      })

      setActiveSection(currentSection)
    }

    // Ejecutar inmediatamente y en scroll
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // También ejecutar cuando cambie el tamaño de ventana
    window.addEventListener('resize', handleScroll, { passive: true })
    
    // Ejecutar varias veces durante la carga para asegurar detección
    const timers = [200, 600, 1200].map(delay => 
      setTimeout(handleScroll, delay)
    )
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [sections])

  // Auto-scroll de la navegación a la sección activa
  useEffect(() => {
    if (activeSection && navRef.current) {
      const activeButton = navRef.current.querySelector(`[data-section-id="${activeSection}"]`) as HTMLButtonElement
      if (activeButton) {
        const navContainer = navRef.current.querySelector('.scroll-container') as HTMLDivElement
        if (navContainer) {
          const scrollLeft = activeButton.offsetLeft - (navContainer.clientWidth / 2) + (activeButton.clientWidth / 2)
          navContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' })
        }
      }
    }
  }, [activeSection])

  // Detectar si hay contenido scrolleable en la navegación
  useEffect(() => {
    const checkScrollIndicators = () => {
      const navContainer = navRef.current?.querySelector('.scroll-container') as HTMLDivElement
      if (navContainer) {
        const canScrollLeft = navContainer.scrollLeft > 0
        const canScrollRight = navContainer.scrollLeft < (navContainer.scrollWidth - navContainer.clientWidth - 10)
        setShowLeftArrow(canScrollLeft)
        setShowRightArrow(canScrollRight)
      }
    }

    const navContainer = navRef.current?.querySelector('.scroll-container')
    if (navContainer) {
      navContainer.addEventListener('scroll', checkScrollIndicators)
      checkScrollIndicators()
      
      return () => navContainer.removeEventListener('scroll', checkScrollIndicators)
    }
  }, [])

  // Función de scroll simplificada para móvil
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const element = sectionsRef.current[sectionId]
    if (element) {
      const isMobile = window.innerWidth < 640
      
      if (isMobile) {
        // En móvil, scroll directo sin offsets complicados
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const offset = window.innerHeight * 0.15 // 15% desde el top en móvil
        
        window.scrollTo({ 
          top: Math.max(0, elementTop - offset), 
          behavior: 'smooth' 
        })
      } else {
        // En desktop, mantener el comportamiento original
        const navHeight = navRef.current?.offsetHeight || 0
        const mainNavHeight = 80
        const elementPosition = element.offsetTop - navHeight - mainNavHeight - 20
        
        window.scrollTo({ 
          top: Math.max(0, elementPosition), 
          behavior: 'smooth' 
        })
      }
    }
  }

  // Función para scroll manual de la navegación
  const scrollNavigation = (direction: 'left' | 'right') => {
    const navContainer = navRef.current?.querySelector('.scroll-container') as HTMLDivElement
    if (navContainer) {
      const scrollAmount = 200
      const newScrollLeft = direction === 'left' 
        ? navContainer.scrollLeft - scrollAmount 
        : navContainer.scrollLeft + scrollAmount
      
      navContainer.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
    }
  }

  // Función para obtener el icono dinámicamente
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Home
    return Icon
  }

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white" style={{ overflowX: 'hidden', overflowY: 'visible' }}>
      {/* Hero Section - Original que te gustaba */}
      <motion.section
        id="inicio"
        ref={(el) => { sectionsRef.current['inicio'] = el }}
        className="w-full overflow-hidden"
      >
        <HeroSection />
      </motion.section>

      {/* Navegación horizontal sticky - Visible al inicio, se oculta al pasar el hero */}
      <div
        className={`hidden sm:block sticky top-20 z-40 transition-all duration-500 ${
          showSideNav ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200/60 shadow-xl"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(255,255,255,0.95))',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 16px rgba(0,0,0,0.08)'
          }}
        >
          <div className="w-full px-3">
            <div className="flex items-center justify-center gap-1.5 py-3">
              {sections.map((section) => {
                const IconComponent = getIcon(section.icon)
                const isActive = activeSection === section.id

                return (
                  <button
                    key={section.id}
                    data-section-id={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      group relative flex items-center gap-2 px-3.5 py-2.5 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap text-sm
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105 border border-blue-500/20'
                        : 'text-gray-700 hover:bg-gray-50/80 hover:text-blue-600 hover:shadow-md border border-transparent hover:border-blue-200/50'
                      }
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300
                      ${isActive ? 'bg-white/20 shadow-inner' : 'bg-gray-100 group-hover:bg-blue-50'}
                    `}>
                      <IconComponent className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                    </div>
                    <span className="leading-none">{section.titulo}</span>

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicatorHorizontal"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navegación lateral - Similar a móvil, aparece después del hero */}
      <div
        ref={navRef}
        className={`hidden sm:block fixed right-3 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-500 ${
          showSideNav ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'
        }`}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-gray-200/50 py-4 px-3">
          <div className="flex flex-col space-y-3">
            {sections.map((section) => {
              const isActive = activeSection === section.id
              const IconComponent = getIcon(section.icon)
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    relative w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center group
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg scale-110'
                      : 'bg-gray-100 hover:bg-blue-50 hover:scale-105'
                    }
                  `}
                  title={section.titulo}
                  aria-label={`Ir a sección ${section.titulo}`}
                >
                  <IconComponent className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20 -z-10" />
                  )}
                  {/* Tooltip */}
                  <div className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {section.titulo}
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Indicador lateral móvil - Simplificado y visible */}
      <div className="sm:hidden fixed right-3 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-gray-200/50 py-3 px-2">
          <div className="flex flex-col space-y-2">
            {sections.map((section, index) => {
              const isActive = activeSection === section.id
              const IconComponent = getIcon(section.icon)
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    relative w-3 h-3 rounded-full transition-all duration-300 touch-manipulation flex items-center justify-center
                    ${isActive 
                      ? 'bg-blue-600 scale-150 shadow-lg' 
                      : 'bg-gray-400 hover:bg-blue-500 active:bg-blue-600'
                    }
                  `}
                  title={section.titulo}
                  aria-label={`Ir a sección ${section.titulo}`}
                >
                  {isActive ? (
                    <IconComponent className="w-2 h-2 text-white" />
                  ) : (
                    <div className="w-full h-full rounded-full" />
                  )}
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-40 -z-10" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Secciones con referencias para scroll spy */}
      <section
        id="capacidades"
        ref={(el) => { sectionsRef.current['capacidades'] = el }}
      >
        <CapacitiesSection />
      </section>

      <section
        id="nosotros"
        ref={(el) => { sectionsRef.current['nosotros'] = el }}
      >
        <AboutSection />
      </section>
      
      <section
        id="servicios"
        ref={(el) => { sectionsRef.current['servicios'] = el }}
      >
        <ServicesSection />
      </section>

      <section
        id="proyectos"
        ref={(el) => { sectionsRef.current['proyectos'] = el }}
      >
        <ProjectsByCategorySection projectsByCategory={projectsByCategory} />
      </section>

      <section
        id="clientes"
        ref={(el) => { sectionsRef.current['clientes'] = el }}
      >
        <ClientesSection />
      </section>

      <section
        id="contacto"
        ref={(el) => { sectionsRef.current['contacto'] = el }}
      >
        <ContactSection />
      </section>
    </div>
  )
}
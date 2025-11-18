'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, ArrowDown,
  Home, Building2, BarChart3, Users, Settings,
  Monitor, Factory, Award, UserCheck, Heart, MessageSquare
} from 'lucide-react'
import * as Icons from 'lucide-react'
import { HeroImageConfig } from '@/lib/hero-config'

// Importaciones de componentes
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSectionNew'
import { ExpertiseTransitionSection } from '@/components/sections/ExpertiseTransitionSection'
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
  heroImages: HeroImageConfig
}

export function HomeContent({ projectsByCategory, sections, heroImages }: HomeContentProps) {
  const [activeSection, setActiveSection] = useState('inicio') // Inicializar con 'inicio'
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
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
      // Ajustado para que aparezca después de que termine la animación del hero (180vh)
      const heroThreshold = isMobile ? windowHeight * 0.8 : windowHeight * 1.6 // 1.6 pantallas en desktop

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
    <>
      <div className="w-full bg-white">
        {/* Hero Section - DHK Style con sticky */}
        <section
          id="inicio"
          ref={(el) => { sectionsRef.current['inicio'] = el }}
          className="w-full"
        >
          <HeroSection heroImages={heroImages} />
        </section>


      {/* Secciones con referencias para scroll spy - Con fondo blanco y z-index superior al hero */}
      <section
        id="nosotros"
        ref={(el) => { sectionsRef.current['nosotros'] = el }}
        className="relative z-40 bg-white"
      >
        <AboutSection />
      </section>

      <section
        id="servicios"
        ref={(el) => { sectionsRef.current['servicios'] = el }}
        className="relative z-40 bg-white"
      >
        <ServicesSection />
      </section>

      {/* Sección de transición: Expertos en Acero */}
      <ExpertiseTransitionSection />

      <section
        id="proyectos"
        ref={(el) => { sectionsRef.current['proyectos'] = el }}
        className="relative z-40 bg-white"
      >
        <ProjectsByCategorySection projectsByCategory={projectsByCategory} />
      </section>

      <section
        id="clientes"
        ref={(el) => { sectionsRef.current['clientes'] = el }}
        className="relative z-40 bg-white"
      >
        <ClientesSection />
      </section>

      <section
        id="contacto"
        ref={(el) => { sectionsRef.current['contacto'] = el }}
        className="relative z-40 bg-white"
      >
        <ContactSection />
      </section>
      </div>
    </>
  )
}
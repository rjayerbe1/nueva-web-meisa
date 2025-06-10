'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { UnifiedStatsGrid } from '@/components/ui/unified-stats-card'
import { 
  Monitor,
  Settings,
  Factory,
  ArrowRight,
  CheckCircle2,
  Play,
  ChevronLeft,
  ChevronRight,
  Code,
  Zap,
  Shield,
  BarChart3,
  Gauge
} from 'lucide-react'

// Estructura coherente - 3 secciones alineadas con proceso tecnológico
const tecnologiaSections = [
  {
    id: 'diseno-analisis',
    titulo: 'Diseño y Análisis',
    icon: Monitor,
    content: {
      titulo: 'Diseño y Análisis',
      subtitulo: 'Modelado BIM + Análisis estructural integrado',
      descripcion: 'Utilizamos las herramientas BIM y de análisis estructural más avanzadas para diseño, coordinación multidisciplinaria y verificación de estructuras.'
    }
  },
  {
    id: 'fabricacion-montaje',
    titulo: 'Fabricación y Montaje',
    icon: Settings,
    content: {
      titulo: 'Fabricación y Montaje',
      subtitulo: 'Tecnologías CNC + Equipos de montaje especializados',
      descripcion: 'Tecnologías avanzadas para fabricación de precisión y montaje de estructuras metálicas con equipamiento especializado distribuido en nuestras plantas.'
    }
  },
  {
    id: 'control-digital',
    titulo: 'Control Digital',
    icon: Gauge,
    content: {
      titulo: 'Control Digital',
      subtitulo: 'Trazabilidad QR y calidad certificada',
      descripcion: 'Sistemas digitales integrados que garantizan calidad y trazabilidad completa en cada proceso productivo.'
    }
  }
]

// Nuevas funciones helper completamente rediseñadas y configurables desde backend
const createSoftwareCategories = (getText: Function, getImage: Function) => [
  {
    category: getText('Diseño BIM', 'softwareCategories.0.category'),
    description: getText('Modelado 3D y coordinación multidisciplinaria', 'softwareCategories.0.description'),
    image: getImage('/images/servicios/consultoria-1.jpg', 'softwareCategories.0.image'),
    tools: [
      {
        name: getText('Trimble Tekla Structures', 'softwareCategories.0.tools.0.name'),
        specialty: getText('Líder mundial en BIM para estructuras', 'softwareCategories.0.tools.0.specialty'),
        image: getImage('/images/servicios/consultoria-1.jpg', 'softwareCategories.0.tools.0.image')
      },
      {
        name: getText('AutoCAD', 'softwareCategories.0.tools.1.name'),
        specialty: getText('Diseño técnico 2D/3D', 'softwareCategories.0.tools.1.specialty'),
        image: getImage('/images/servicios/consultoria-2.jpg', 'softwareCategories.0.tools.1.image')
      }
    ]
  },
  {
    category: getText('Análisis Estructural', 'softwareCategories.1.category'),
    description: getText('Simulación y análisis avanzado de estructuras', 'softwareCategories.1.description'),
    image: getImage('/images/servicios/consultoria-4.jpg', 'softwareCategories.1.image'),
    tools: [
      {
        name: getText('ETABS', 'softwareCategories.1.tools.0.name'),
        specialty: getText('Análisis de edificios y estructuras complejas', 'softwareCategories.1.tools.0.specialty'),
        image: getImage('/images/servicios/consultoria-4.jpg', 'softwareCategories.1.tools.0.image')
      },
      {
        name: getText('SAP2000', 'softwareCategories.1.tools.1.name'),
        specialty: getText('Análisis universal de estructuras', 'softwareCategories.1.tools.1.specialty'),
        image: getImage('/images/servicios/consultoria-3.jpg', 'softwareCategories.1.tools.1.image')
      }
    ]
  },
  {
    category: getText('Conexiones Especializadas', 'softwareCategories.2.category'),
    description: getText('Diseño y verificación de conexiones críticas', 'softwareCategories.2.description'),
    image: getImage('/images/servicios/gestion-1.jpg', 'softwareCategories.2.image'),
    tools: [
      {
        name: getText('IDEA StatiCa', 'softwareCategories.2.tools.0.name'),
        specialty: getText('Conexiones complejas con análisis CBFEM', 'softwareCategories.2.tools.0.specialty'),
        image: getImage('/images/servicios/gestion-1.jpg', 'softwareCategories.2.tools.0.image')
      }
    ]
  }
]

const createEquipmentCategories = (getText: Function, getImage: Function) => [
  {
    category: getText('Corte CNC', 'equipmentCategories.0.category'),
    description: getText('Mesas de corte automatizado de precisión', 'equipmentCategories.0.description'),
    image: getImage('/images/equipo/equipo-industrial-1.jpg', 'equipmentCategories.0.image'),
    specs: [
      getText('3 Mesas CNC distribuidas estratégicamente', 'equipmentCategories.0.specs.0'),
      getText('Control numérico computarizado', 'equipmentCategories.0.specs.1'),
      getText('Precisión milimétrica garantizada', 'equipmentCategories.0.specs.2'),
      getText('Corte hasta 150mm de espesor', 'equipmentCategories.0.specs.3')
    ]
  },
  {
    category: getText('Equipos de Izaje', 'equipmentCategories.1.category'),
    description: getText('Sistemas de manejo de cargas pesadas', 'equipmentCategories.1.description'),
    image: getImage('/images/general/industria-general.jpg', 'equipmentCategories.1.image'),
    specs: [
      getText('8 Puentes grúa en total', 'equipmentCategories.1.specs.0'),
      getText('5 en Planta Popayán', 'equipmentCategories.1.specs.1'),
      getText('3 en Planta Jamundí', 'equipmentCategories.1.specs.2'),
      getText('Capacidades de 5 a 20 toneladas', 'equipmentCategories.1.specs.3')
    ]
  },
  {
    category: getText('Equipos Especializados', 'equipmentCategories.2.category'),
    description: getText('Maquinaria especializada para procesos únicos', 'equipmentCategories.2.description'),
    image: getImage('/images/servicios/fabricacion-1.jpg', 'equipmentCategories.2.image'),
    specs: [
      getText('Granalladora industrial', 'equipmentCategories.2.specs.0'),
      getText('Ensambladora de perfiles', 'equipmentCategories.2.specs.1'),
      getText('Curvadora de tejas especializada', 'equipmentCategories.2.specs.2'),
      getText('Sistemas de soldadura certificados', 'equipmentCategories.2.specs.3')
    ]
  }
]

const createDigitalProcesses = (getText: Function, getImage: Function) => [
  {
    process: getText('Trazabilidad QR', 'digitalProcesses.0.process'),
    description: getText('Seguimiento completo mediante códigos QR', 'digitalProcesses.0.description'),
    image: getImage('/images/servicios/gestion-2.jpg', 'digitalProcesses.0.image'),
    benefits: [
      getText('Historial completo de cada pieza', 'digitalProcesses.0.benefits.0'),
      getText('Ubicación en tiempo real', 'digitalProcesses.0.benefits.1'),
      getText('Control de calidad digital', 'digitalProcesses.0.benefits.2')
    ]
  },
  {
    process: getText('Reportes Digitales', 'digitalProcesses.1.process'),
    description: getText('Documentación automática de procesos', 'digitalProcesses.1.description'),
    image: getImage('/images/servicios/gestion-3.jpg', 'digitalProcesses.1.image'),
    benefits: [
      getText('Informes en tiempo real', 'digitalProcesses.1.benefits.0'),
      getText('Evidencia fotográfica', 'digitalProcesses.1.benefits.1'),
      getText('Certificación digital', 'digitalProcesses.1.benefits.2')
    ]
  }
]

interface TecnologiaContentProps {
  paginaData?: any
}

export default function TecnologiaContent({ paginaData }: TecnologiaContentProps) {
  const [activeSection, setActiveSection] = useState('')
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  
  // Función para obtener texto dinámico
  const getText = (defaultText: string, path?: string) => {
    if (!paginaData?.contenido) return defaultText
    
    if (path) {
      const parts = path.split('.')
      let current = paginaData.contenido
      
      for (const part of parts) {
        current = current?.[part]
        if (current === undefined) return defaultText
      }
      
      return current || defaultText
    }
    
    return paginaData.titulo || defaultText
  }

  // Función para obtener imágenes dinámicas
  const getImage = (defaultPath: string, path?: string) => {
    if (!paginaData?.contenido) return defaultPath
    
    if (path) {
      const parts = path.split('.')
      let current = paginaData.contenido
      
      for (const part of parts) {
        current = current?.[part]
        if (current === undefined) return defaultPath
      }
      
      return current || defaultPath
    }
    
    return defaultPath
  }

  // Crear instancias dinámicas de los datos rediseñados
  const softwareCategories = createSoftwareCategories(getText, getImage)
  const equipmentCategories = createEquipmentCategories(getText, getImage)
  const digitalProcesses = createDigitalProcesses(getText, getImage)
  
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})
  const navRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  // Scroll detection for active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150
      let currentSection = ''

      Object.entries(sectionsRef.current).forEach(([id, element]) => {
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = id
          }
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto scroll navigation to active section
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

  // Check scroll indicators
  const checkScrollIndicators = () => {
    const navContainer = navRef.current?.querySelector('.scroll-container') as HTMLDivElement
    if (navContainer) {
      const canScrollLeft = navContainer.scrollLeft > 0
      const canScrollRight = navContainer.scrollLeft < (navContainer.scrollWidth - navContainer.clientWidth - 10)
      setShowLeftArrow(canScrollLeft)
      setShowRightArrow(canScrollRight)
    }
  }

  useEffect(() => {
    const navContainer = navRef.current?.querySelector('.scroll-container')
    if (navContainer) {
      navContainer.addEventListener('scroll', checkScrollIndicators)
      checkScrollIndicators()
      
      return () => navContainer.removeEventListener('scroll', checkScrollIndicators)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId]
    if (element) {
      const navHeight = navRef.current?.offsetHeight || 0
      const mainNavHeight = 80
      const elementPosition = element.offsetTop - navHeight - mainNavHeight - 20
      window.scrollTo({ top: elementPosition, behavior: 'smooth' })
    }
  }

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

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Parallax */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getImage('/images/tecnologia/tecnologia-industrial-1.jpg', 'heroImage')}
            alt="Tecnología Industrial MEISA"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-800/80" />
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/patterns/tech-grid.svg')] bg-center bg-repeat" />
        </div>
        
        {/* Floating Elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 right-16 w-48 h-48 bg-cyan-400/20 rounded-full blur-xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-block px-4 py-2 bg-blue-100/90 text-blue-600 text-sm font-semibold rounded-full mb-8 backdrop-blur-sm"
          >
{getText('TECNOLOGÍA E INNOVACIÓN', 'heroTag')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6"
          >
            {getText('Tecnología e Innovación', 'heroTitle')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-4">
{getText('de Vanguardia', 'heroTitleHighlight')}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            {getText('En MEISA utilizamos las herramientas más avanzadas del mercado para diseñar, fabricar y montar estructuras metálicas con la máxima precisión y eficiencia. Desde modelado BIM hasta control de calidad digital, la tecnología es nuestro aliado para entregar excelencia.', 'heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href="/contacto"
              className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="flex items-center gap-2">
                {getText('Solicitar Consultoría', 'heroCta1')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/proyectos"
              className="group px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
            >
              {getText('Ver Proyectos Realizados', 'heroCta2')}
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Proceso Integral Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {getText('Proceso Tecnológico Integral', 'procesoIntegral.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {getText('Tres etapas fundamentales con tecnología de vanguardia: desde diseño BIM hasta control digital', 'procesoIntegral.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: getText("Diseño y Análisis", 'procesoFases.0.title'), 
                desc: getText("Modelado BIM + Análisis estructural integrado", 'procesoFases.0.description'), 
                icon: Monitor,
                step: "01",
                image: getImage('/images/servicios/consultoria-1.jpg', 'procesoFases.0.image')
              },
              { 
                title: getText("Fabricación y Montaje", 'procesoFases.1.title'), 
                desc: getText("Tecnologías CNC + Equipos de montaje especializados", 'procesoFases.1.description'), 
                icon: Settings,
                step: "02",
                image: getImage('/images/equipo/equipo-industrial-1.jpg', 'procesoFases.1.image')
              },
              { 
                title: getText("Control Digital", 'procesoFases.2.title'), 
                desc: getText("Trazabilidad QR y calidad certificada", 'procesoFases.2.description'), 
                icon: Gauge,
                step: "03",
                image: getImage('/images/servicios/gestion-2.jpg', 'procesoFases.2.image')
              }
            ].map((phase, index) => {
              const IconComponent = phase.icon
              return (
                <motion.div
                  key={phase.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  {/* Imagen de fondo */}
                  <div className="absolute inset-0">
                    <Image
                      src={phase.image}
                      alt={phase.title}
                      fill
                      className="object-cover opacity-20"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  
                  <div className="relative z-10 p-8">
                    <div className="text-6xl font-bold text-blue-400/50 mb-4">{phase.step}</div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{phase.title}</h3>
                    <p className="text-gray-200">{phase.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <div 
        ref={navRef}
        className="sticky top-20 z-40 bg-white/98 backdrop-blur-md border-b border-gray-200 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={() => scrollNavigation('left')}
                className="absolute left-0 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {/* Navigation Container */}
            <div className="overflow-x-auto scroll-container mx-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex space-x-1 py-4 min-w-max">
                {tecnologiaSections.map((section) => {
                  const IconComponent = section.icon
                  const isActive = activeSection === section.id
                  
                  return (
                    <button
                      key={section.id}
                      data-section-id={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`
                        relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                        ${isActive 
                          ? 'bg-blue-600 text-white shadow-lg scale-105' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                        }
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${isActive ? 'bg-white/20' : 'bg-gray-100'}
                      `}>
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <span>{section.titulo}</span>
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={() => scrollNavigation('right')}
                className="absolute right-0 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nueva estructura de secciones rediseñadas - elimina duplicaciones */}
      {tecnologiaSections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          ref={(el) => { sectionsRef.current[section.id] = el }}
          className={`py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {getText(section.content.titulo, `sections.${section.id.replace(/-/g, '')}.title`)}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {getText(section.content.descripcion, `sections.${section.id.replace(/-/g, '')}.subtitle`)}
              </p>
            </motion.div>

            {/* Diseño y Análisis Section - UNIFICADO SIN DUPLICACIONES */}
            {section.id === 'diseno-analisis' && (
              <div className="space-y-16">
                {/* Software Gallery Único - Elimina duplicaciones de categorías + gallery */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      {
                        title: getText('Trimble Tekla Structures', 'softwareGallery.tools.0.title'),
                        description: getText('Software BIM líder mundial para modelado detallado de estructuras metálicas y concreto', 'softwareGallery.tools.0.description'),
                        image: getImage('/images/tecnologia/software-diseno-cad.jpg', 'softwareGallery.tools.0.image'),
                        features: [
                          getText('Modelado 3D completo y detallado', 'softwareGallery.tools.0.features.0'),
                          getText('Coordinación multidisciplinaria BIM', 'softwareGallery.tools.0.features.1'),
                          getText('Generación automática de planos de fabricación', 'softwareGallery.tools.0.features.2')
                        ],
                        badge: getText('BIM Líder Mundial', 'softwareGallery.tools.0.badge'),
                        color: 'from-blue-500 to-blue-600'
                      },
                      {
                        title: getText('ETABS & SAP2000', 'softwareGallery.tools.1.title'),
                        description: getText('Suite completa de análisis estructural para edificios y estructuras complejas', 'softwareGallery.tools.1.description'),
                        image: getImage('/images/servicios/consultoria-4.jpg', 'softwareGallery.tools.1.image'),
                        features: [
                          getText('Análisis sísmico y dinámico avanzado', 'softwareGallery.tools.1.features.0'),
                          getText('Diseño según normativas internacionales', 'softwareGallery.tools.1.features.1'),
                          getText('Optimización estructural y de materiales', 'softwareGallery.tools.1.features.2')
                        ],
                        badge: getText('Análisis Avanzado', 'softwareGallery.tools.1.badge'),
                        color: 'from-green-500 to-green-600'
                      },
                      {
                        title: getText('IDEA StatiCa Connection', 'softwareGallery.tools.2.title'),
                        description: getText('Software revolucionario para diseño y verificación de conexiones de acero complejas', 'softwareGallery.tools.2.description'),
                        image: getImage('/images/servicios/consultoria-3.jpg', 'softwareGallery.tools.2.image'),
                        features: [
                          getText('Análisis por elementos finitos CBFEM', 'softwareGallery.tools.2.features.0'),
                          getText('Verificación según códigos internacionales', 'softwareGallery.tools.2.features.1'),
                          getText('Reportes detallados de cálculo', 'softwareGallery.tools.2.features.2')
                        ],
                        badge: getText('Conexiones Especializadas', 'softwareGallery.tools.2.badge'),
                        color: 'from-purple-500 to-purple-600'
                      },
                      {
                        title: getText('Suite Complementaria', 'softwareGallery.tools.3.title'),
                        description: getText('Midas Civil, SAFE, DC-CAD y herramientas especializadas para análisis integral', 'softwareGallery.tools.3.description'),
                        image: getImage('/images/tecnologia/tecnologia-industrial-1.jpg', 'softwareGallery.tools.3.image'),
                        features: [
                          getText('Análisis de losas y cimentaciones', 'softwareGallery.tools.3.features.0'),
                          getText('Diseño de elementos de concreto', 'softwareGallery.tools.3.features.1'),
                          getText('Integración completa con workflow BIM', 'softwareGallery.tools.3.features.2')
                        ],
                        badge: getText('Suite Completa', 'softwareGallery.tools.3.badge'),
                        color: 'from-orange-500 to-orange-600'
                      }
                    ].map((software, index) => (
                      <motion.div
                        key={software.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group border border-gray-100 hover:border-blue-200"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={software.image}
                            alt={software.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/20" />
                          
                          {/* Badge superior */}
                          <div className="absolute top-4 left-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm bg-gradient-to-r ${software.color}`}>
                              {software.badge}
                            </div>
                          </div>
                          
                          {/* Icono del software */}
                          <div className="absolute top-4 right-4">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                              <Monitor className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                              {software.title}
                            </h4>
                            <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300">
                              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300" />
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-6 leading-relaxed">{software.description}</p>
                          
                          <div className="space-y-3">
                            {software.features.map((feature, featureIndex) => (
                              <motion.div
                                key={featureIndex}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + featureIndex * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-3 group/item"
                              >
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="text-gray-700 text-sm group-hover/item:text-gray-900 transition-colors duration-200">
                                  {feature}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Estadísticas Tecnológicas - Usando componente unificado */}
                <div className="mt-20">
                  <UnifiedStatsGrid
                    title={getText('Tecnología en Números', 'techStats.title')}
                    subtitle={getText('Datos que demuestran nuestro compromiso con la innovación tecnológica', 'techStats.subtitle')}
                    stats={[
                      {
                        number: getText('15', 'techStats.stats.0.number'),
                        label: getText('Software Especializados', 'techStats.stats.0.label'),
                        suffix: '+'
                      },
                      {
                        number: getText('99.8', 'techStats.stats.1.number'),
                        label: getText('Precisión CNC', 'techStats.stats.1.label'),
                        suffix: '%'
                      },
                      {
                        number: getText('100', 'techStats.stats.2.number'),
                        label: getText('Trazabilidad Digital', 'techStats.stats.2.label'),
                        suffix: '%'
                      },
                      {
                        number: getText('27', 'techStats.stats.3.number'),
                        label: getText('Años de Innovación', 'techStats.stats.3.label'),
                        suffix: ''
                      }
                    ]}
                    variant="default"
                    colorScheme="blue"
                    columns={4}
                    showDecorator={false}
                  />
                </div>
              </div>
            )}

            {/* Fabricación y Montaje Section - UNIFICADO SIN DUPLICACIONES */}
            {section.id === 'fabricacion-montaje' && (
              <div className="space-y-16">
                {/* Equipamiento Industrial Único - Elimina duplicaciones de categorías + visual mejorado */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      {
                        title: getText('Corte CNC', 'equipmentCategories.0.category'),
                        subtitle: getText('3 Mesas Automatizadas', 'equipmentCategories.0.subtitle'),
                        image: getImage('/images/equipo/equipo-industrial-1.jpg', 'equipmentCategories.0.image'),
                        description: getText('Control numérico computarizado para corte de precisión milimétrica', 'equipmentCategories.0.description'),
                        specs: [
                          getText('Precisión ±0.5mm', 'equipmentCategories.0.specs.0'),
                          getText('Corte hasta 150mm', 'equipmentCategories.0.specs.1'),
                          getText('3 mesas distribuidas', 'equipmentCategories.0.specs.2')
                        ],
                        color: 'from-orange-500 to-orange-600'
                      },
                      {
                        title: getText('Sistemas de Izaje', 'equipmentCategories.1.category'),
                        subtitle: getText('8 Puentes Grúa', 'equipmentCategories.1.subtitle'),
                        image: getImage('/images/general/industria-general.jpg', 'equipmentCategories.1.image'),
                        description: getText('Sistemas de manejo de cargas para fabricación y montaje', 'equipmentCategories.1.description'),
                        specs: [
                          getText('5 en Popayán', 'equipmentCategories.1.specs.0'),
                          getText('3 en Jamundí', 'equipmentCategories.1.specs.1'),
                          getText('Hasta 20 toneladas', 'equipmentCategories.1.specs.2')
                        ],
                        color: 'from-blue-500 to-blue-600'
                      },
                      {
                        title: getText('Equipos de Montaje', 'equipmentCategories.2.category'),
                        subtitle: getText('Tecnología Móvil', 'equipmentCategories.2.subtitle'),
                        image: getImage('/images/servicios/montaje-1.jpg', 'equipmentCategories.2.image'),
                        description: getText('Equipamiento especializado para montaje en obra', 'equipmentCategories.2.description'),
                        specs: [
                          getText('Grúas móviles', 'equipmentCategories.2.specs.0'),
                          getText('Equipos de soldadura', 'equipmentCategories.2.specs.1'),
                          getText('Sistemas de posicionamiento', 'equipmentCategories.2.specs.2')
                        ],
                        color: 'from-purple-500 to-purple-600'
                      },
                      {
                        title: getText('Equipos Especializados', 'equipmentCategories.3.category'),
                        subtitle: getText('Procesos Únicos', 'equipmentCategories.3.subtitle'),
                        image: getImage('/images/servicios/fabricacion-1.jpg', 'equipmentCategories.3.image'),
                        description: getText('Maquinaria para procesos especializados de acabado', 'equipmentCategories.3.description'),
                        specs: [
                          getText('Granalladora industrial', 'equipmentCategories.3.specs.0'),
                          getText('Curvadora de tejas', 'equipmentCategories.3.specs.1'),
                          getText('Sistemas de pintura', 'equipmentCategories.3.specs.2')
                        ],
                        color: 'from-green-500 to-green-600'
                      }
                    ].map((equipo, index) => (
                      <motion.div
                        key={equipo.title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={equipo.image}
                            alt={equipo.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                          
                          {/* Badge superior */}
                          <div className="absolute top-4 left-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm bg-gradient-to-r ${equipo.color}`}>
                              {equipo.subtitle}
                            </div>
                          </div>
                          
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <h3 className="text-xl font-bold mb-2">{equipo.title}</h3>
                            <p className="text-gray-200 text-sm">{equipo.description}</p>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="space-y-3">
                            {equipo.specs.map((spec, specIndex) => (
                              <div key={specIndex} className="flex items-center gap-3">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="text-gray-700 text-sm">{spec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Control Digital Section - UNIFICADO SIN DUPLICACIONES */}
            {section.id === 'control-digital' && (
              <div className="space-y-16">
                {/* Control Digital Único - Elimina duplicaciones de procesos + innovación */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      {
                        title: getText('Trazabilidad QR Integral', 'digitalProcesses.0.process'),
                        subtitle: getText('Seguimiento en Tiempo Real', 'digitalProcesses.0.subtitle'),
                        image: getImage('/images/servicios/gestion-2.jpg', 'digitalProcesses.0.image'),
                        description: getText('Sistema completo de códigos QR que permite seguimiento desde fabricación hasta montaje con ubicación GPS en tiempo real', 'digitalProcesses.0.description'),
                        benefits: [
                          getText('Historial completo de cada pieza', 'digitalProcesses.0.benefits.0'),
                          getText('Ubicación GPS en tiempo real', 'digitalProcesses.0.benefits.1'),
                          getText('Control de calidad digital integrado', 'digitalProcesses.0.benefits.2')
                        ],
                        color: 'from-purple-500 to-purple-600'
                      },
                      {
                        title: getText('Reportes Digitales Automáticos', 'digitalProcesses.1.process'),
                        subtitle: getText('Certificación Digital', 'digitalProcesses.1.subtitle'),
                        image: getImage('/images/servicios/gestion-3.jpg', 'digitalProcesses.1.image'),
                        description: getText('Documentación automática completa con evidencia fotográfica y certificaciones digitales blockchain', 'digitalProcesses.1.description'),
                        benefits: [
                          getText('Informes automáticos en tiempo real', 'digitalProcesses.1.benefits.0'),
                          getText('Evidencia fotográfica completa', 'digitalProcesses.1.benefits.1'),
                          getText('Certificación digital blockchain', 'digitalProcesses.1.benefits.2')
                        ],
                        color: 'from-blue-500 to-blue-600'
                      }
                    ].map((sistema, index) => (
                      <motion.div
                        key={sistema.title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={sistema.image}
                            alt={sistema.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                          
                          {/* Badge superior */}
                          <div className="absolute top-4 left-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm bg-gradient-to-r ${sistema.color}`}>
                              {sistema.subtitle}
                            </div>
                          </div>
                          
                          {/* Icono del sistema */}
                          <div className="absolute top-4 right-4">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                              <Shield className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <h3 className="text-xl font-bold mb-2">{sistema.title}</h3>
                            <p className="text-gray-200 text-sm">{sistema.description}</p>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="space-y-3">
                            {sistema.benefits.map((benefit, benefitIndex) => (
                              <motion.div
                                key={benefitIndex}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + benefitIndex * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-3"
                              >
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="text-gray-700 text-sm">{benefit}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {getText('Tecnología al Servicio de tus Proyectos', 'cta.title')}
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              {getText('Descubre cómo nuestra tecnología de punta puede optimizar tu próximo proyecto de estructuras metálicas. Desde el diseño hasta el montaje, te acompañamos con las mejores herramientas del mercado.', 'cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {getText('Solicitar Consultoría', 'ctaCta1')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                {getText('Ver Proyectos Realizados', 'ctaCta2')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Cpu, 
  Layers, 
  Settings, 
  Monitor,
  Database,
  BarChart3,
  Gauge,
  ArrowRight,
  CheckCircle2,
  Wrench,
  Factory,
  Eye,
  Target,
  Grid3x3,
  Package,
  Link2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const tecnologiaSections = [
  {
    id: 'software-diseno',
    titulo: 'Software de Diseño',
    icon: Monitor,
    color: 'from-blue-500 to-blue-600',
    content: {
      titulo: 'Software de Diseño e Ingeniería',
      subtitulo: 'Herramientas BIM de vanguardia',
      descripcion: 'Utilizamos las herramientas más avanzadas del mercado para garantizar precisión y eficiencia en cada proyecto.',
      destacados: [
        'Trimble Tekla Structures - Líder mundial en BIM',
        'ETABS - Análisis estructural avanzado',
        'SAP2000 - Diseño universal de estructuras',
        'SAFE - Especialista en losas y cimentaciones'
      ]
    }
  },
  {
    id: 'software-conexiones',
    titulo: 'Conexiones y Elementos',
    icon: Link2,
    color: 'from-red-500 to-red-600',
    content: {
      titulo: 'Software de Conexiones y Elementos',
      subtitulo: 'Diseño especializado de conexiones',
      descripcion: 'Software revolucionario para el diseño y verificación de conexiones de acero y elementos de concreto.',
      destacados: [
        'IDEA StatiCa Connection - Conexiones complejas',
        'DC-CAD Vigas y Columnas - Concreto reforzado',
        'Análisis por elementos finitos CBFEM',
        'Verificación según códigos internacionales'
      ]
    }
  },
  {
    id: 'software-analisis',
    titulo: 'Análisis Avanzado',
    icon: BarChart3,
    color: 'from-purple-500 to-purple-600',
    content: {
      titulo: 'Software de Análisis Avanzado',
      subtitulo: 'Capacidades de simulación superiores',
      descripcion: 'Herramientas de análisis avanzado con capacidades BIM integradas para estructuras complejas.',
      destacados: [
        'Midas - Análisis estructural avanzado',
        'Construcción por etapas',
        'Análisis de fatiga y durabilidad',
        'BIM integrado completo'
      ]
    }
  },
  {
    id: 'gestion-produccion',
    titulo: 'Gestión y Producción',
    icon: Database,
    color: 'from-green-500 to-green-600',
    content: {
      titulo: 'Software de Gestión y Producción',
      subtitulo: 'Control integral de fabricación',
      descripcion: 'Sistemas líderes mundiales en gestión integral y control de producción para fabricantes de estructuras metálicas.',
      destacados: [
        'StruM.I.S - Gestión integral líder mundial',
        'Control de producción en tiempo real',
        'Trazabilidad completa de materiales',
        'FastCAM - Optimización de corte CNC'
      ]
    }
  },
  {
    id: 'equipamiento',
    titulo: 'Equipamiento',
    icon: Wrench,
    color: 'from-orange-500 to-orange-600',
    content: {
      titulo: 'Equipamiento Industrial',
      subtitulo: 'Maquinaria de última generación',
      descripcion: 'Nuestras 3 plantas cuentan con maquinaria de última generación para garantizar la máxima precisión.',
      destacados: [
        '3 Mesas de corte CNC distribuidas',
        '8 Puentes grúa (5 en Popayán, 3 en Jamundí)',
        'Equipos especializados de alta precisión',
        'Sistemas de soldadura certificados'
      ]
    }
  },
  {
    id: 'innovacion',
    titulo: 'Innovación',
    icon: Eye,
    color: 'from-cyan-500 to-cyan-600',
    content: {
      titulo: 'Innovación en Procesos',
      subtitulo: 'Tecnología BIM y control digital',
      descripcion: 'Implementamos las últimas innovaciones tecnológicas para optimizar cada etapa del proceso productivo.',
      destacados: [
        'Tecnología BIM en mayoría de proyectos',
        'Control de calidad digital',
        'Trazabilidad mediante códigos QR',
        'Reportes digitales en tiempo real'
      ]
    }
  }
]

// Función helper para crear softwareTools dinámicos
const createSoftwareTools = (getText: Function) => [
  {
    name: getText('Trimble Tekla Structures', 'softwareTools.0.name'),
    description: getText('Software BIM líder mundial para modelado de estructuras metálicas y concreto', 'softwareTools.0.description'),
    features: [
      getText('Modelado 3D detallado de estructuras complejas', 'softwareTools.0.features.0'),
      getText('Coordinación multidisciplinaria BIM', 'softwareTools.0.features.1'),
      getText('Generación automática de planos de fabricación', 'softwareTools.0.features.2'),
      getText('Detección de interferencias', 'softwareTools.0.features.3'),
      getText('Cuantificación exacta de materiales', 'softwareTools.0.features.4')
    ],
    icon: Layers,
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: getText('ETABS', 'softwareTools.1.name'),
    description: getText('Software de análisis y diseño estructural de edificios líder en la industria', 'softwareTools.1.description'),
    features: [
      getText('Análisis no lineal avanzado', 'softwareTools.1.features.0'),
      getText('Diseño sísmico con normativas internacionales', 'softwareTools.1.features.1'),
      getText('Modelado de estructuras complejas', 'softwareTools.1.features.2'),
      getText('Análisis dinámico y pushover', 'softwareTools.1.features.3'),
      getText('Diseño de elementos de concreto y acero', 'softwareTools.1.features.4')
    ],
    icon: BarChart3,
    color: 'from-green-500 to-green-600'
  },
  {
    name: getText('SAP2000', 'softwareTools.2.name'),
    description: getText('Programa de análisis estructural y diseño para todo tipo de estructuras', 'softwareTools.2.description'),
    features: [
      getText('Análisis estructural completo', 'softwareTools.2.features.0'),
      getText('Diseño de puentes y estructuras especiales', 'softwareTools.2.features.1'),
      getText('Análisis no lineal y dinámico', 'softwareTools.2.features.2'),
      getText('Modelado paramétrico avanzado', 'softwareTools.2.features.3'),
      getText('Integración con BIM', 'softwareTools.2.features.4')
    ],
    icon: Grid3x3,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: getText('IDEA StatiCa Connection', 'softwareTools.3.name'),
    description: getText('Software revolucionario para el diseño y verificación de conexiones de acero', 'softwareTools.3.description'),
    features: [
      getText('Diseño de conexiones complejas', 'softwareTools.3.features.0'),
      getText('Análisis por elementos finitos CBFEM', 'softwareTools.3.features.1'),
      getText('Verificación según códigos internacionales', 'softwareTools.3.features.2'),
      getText('Optimización de conexiones', 'softwareTools.3.features.3'),
      getText('Reportes detallados de cálculo', 'softwareTools.3.features.4')
    ],
    icon: Link2,
    color: 'from-red-500 to-red-600'
  }
]

// Función helper para crear equipment dinámico
const createEquipment = (getText: Function) => [
  {
    title: getText('Maquinaria de Corte', 'equipment.0.title'),
    items: [
      getText('3 Mesas de corte CNC distribuidas en nuestras plantas', 'equipment.0.items.0'),
      getText('Control numérico computarizado', 'equipment.0.items.1'),
      getText('Precisión milimétrica', 'equipment.0.items.2'),
      getText('Capacidad para espesores diversos', 'equipment.0.items.3'),
      getText('Alta velocidad de producción', 'equipment.0.items.4')
    ],
    icon: Wrench,
    color: 'from-red-500 to-red-600'
  },
  {
    title: getText('Equipos de Izaje', 'equipment.1.title'),
    items: [
      getText('8 Puentes grúa (5 en Popayán, 3 en Jamundí)', 'equipment.1.items.0'),
      getText('Capacidad de manejo seguro de piezas pesadas', 'equipment.1.items.1'),
      getText('Optimización de flujo en planta', 'equipment.1.items.2'),
      getText('Seguridad certificada', 'equipment.1.items.3'),
      getText('Mantenimiento preventivo continuo', 'equipment.1.items.4')
    ],
    icon: Factory,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: getText('Equipos Especializados', 'equipment.2.title'),
    items: [
      getText('Granalladora industrial para limpieza y preparación', 'equipment.2.items.0'),
      getText('Ensambladora de perfiles de alta precisión', 'equipment.2.items.1'),
      getText('Curvadora de tejas para cubiertas especiales', 'equipment.2.items.2'),
      getText('Equipos de soldadura con personal certificado', 'equipment.2.items.3'),
      getText('Sistemas de pintura y recubrimientos', 'equipment.2.items.4')
    ],
    icon: Settings,
    color: 'from-green-500 to-green-600'
  }
]

// Función helper para crear innovations dinámico
const createInnovations = (getText: Function) => [
  {
    title: getText('Tecnología BIM', 'innovations.0.title'),
    description: getText('La mayoría de nuestros proyectos se coordinan utilizando Building Information Modeling', 'innovations.0.description'),
    benefits: [
      getText('Reducción de errores en obra', 'innovations.0.benefits.0'),
      getText('Mayor precisión en fabricación', 'innovations.0.benefits.1'),
      getText('Coordinación entre disciplinas', 'innovations.0.benefits.2'),
      getText('Visualización 3D para clientes', 'innovations.0.benefits.3'),
      getText('Detección temprana de conflictos', 'innovations.0.benefits.4')
    ],
    icon: Eye
  },
  {
    title: getText('Control de Calidad Digital', 'innovations.1.title'),
    description: getText('Sistemas digitales integrados para garantizar la excelencia en cada proceso', 'innovations.1.description'),
    benefits: [
      getText('Trazabilidad mediante códigos QR', 'innovations.1.benefits.0'),
      getText('Registro fotográfico de procesos', 'innovations.1.benefits.1'),
      getText('Reportes digitales en tiempo real', 'innovations.1.benefits.2'),
      getText('Certificados de calidad digitalizados', 'innovations.1.benefits.3'),
      getText('Control de espesores digitales', 'innovations.1.benefits.4')
    ],
    icon: Gauge
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

  // Crear instancias dinámicas de los datos
  const softwareTools = createSoftwareTools(getText)
  const equipment = createEquipment(getText)
  const innovations = createInnovations(getText)
  
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
              {getText('Desde el diseño BIM hasta la fabricación CNC, cada etapa cuenta con tecnología de vanguardia', 'procesoIntegral.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                title: getText("Diseño BIM", 'procesoFases.0.title'), 
                desc: getText("Modelado 3D con Tekla Structures", 'procesoFases.0.description'), 
                icon: Monitor,
                step: "01",
                image: getImage('/images/servicios/consultoria-1.jpg', 'procesoFases.0.image')
              },
              { 
                title: getText("Análisis Estructural", 'procesoFases.1.title'), 
                desc: getText("ETABS, SAP2000, Midas", 'procesoFases.1.description'), 
                icon: BarChart3,
                step: "02",
                image: getImage('/images/servicios/consultoria-4.jpg', 'procesoFases.1.image')
              },
              { 
                title: getText("Fabricación CNC", 'procesoFases.2.title'), 
                desc: getText("Corte automatizado de precisión", 'procesoFases.2.description'), 
                icon: Settings,
                step: "03",
                image: getImage('/images/equipo/equipo-industrial-1.jpg', 'procesoFases.2.image')
              },
              { 
                title: getText("Control Digital", 'procesoFases.3.title'), 
                desc: getText("Trazabilidad y calidad", 'procesoFases.3.description'), 
                icon: Gauge,
                step: "04",
                image: getImage('/images/servicios/gestion-2.jpg', 'procesoFases.3.image')
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

      {/* Dynamic Sections */}
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

            {section.id === 'software-diseno' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                  {softwareTools.map((tool, toolIndex) => {
                    const IconComponent = tool.icon
                    return (
                      <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: toolIndex * 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                      >
                        <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-6`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <h4 className="text-2xl font-bold text-gray-900 mb-3">{tool.name}</h4>
                        <p className="text-gray-600 mb-6 leading-relaxed">{tool.description}</p>
                        
                        <div className="space-y-3">
                          {tool.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.6 + featureIndex * 0.1 }}
                              viewport={{ once: true }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Screenshots de Software */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-12">
                    Software Especializado en Acción
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      {
                        title: 'Trimble Tekla Structures',
                        description: 'Modelado BIM 3D detallado',
                        image: getImage('/images/servicios/consultoria-1.jpg', 'softwareTools.0.screenshot')
                      },
                      {
                        title: 'ETABS',
                        description: 'Análisis estructural avanzado',
                        image: getImage('/images/servicios/consultoria-4.jpg', 'softwareTools.1.screenshot')
                      },
                      {
                        title: 'SAP2000',
                        description: 'Diseño de estructuras complejas',
                        image: getImage('/images/servicios/consultoria-2.jpg', 'softwareTools.2.screenshot')
                      },
                      {
                        title: 'IDEA StatiCa Connection',
                        description: 'Diseño de conexiones',
                        image: getImage('/images/servicios/consultoria-3.jpg', 'softwareTools.3.screenshot')
                      }
                    ].map((software, index) => (
                      <motion.div
                        key={software.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-48">
                          <Image
                            src={software.image}
                            alt={software.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                        </div>
                        <div className="p-6">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{software.title}</h4>
                          <p className="text-gray-600 text-sm">{software.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {(section.id === 'software-conexiones' || section.id === 'software-analisis' || section.id === 'gestion-produccion') && (
              <div className="text-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {section.content.destacados.map((destacado, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                        <section.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">
                        {destacado.split(' - ')[0]}
                      </h4>
                      {destacado.split(' - ')[1] && (
                        <p className="text-gray-600">{destacado.split(' - ')[1]}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {section.id === 'equipamiento' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {equipment.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                        
                        <div className="space-y-3">
                          {item.items.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.4 + featureIndex * 0.1 }}
                              viewport={{ once: true }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600 text-sm">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Equipamiento Industrial Visual */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-12">
                    Nuestro Equipamiento Industrial
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      {
                        title: 'Maquinaria de Corte CNC',
                        subtitle: '3 Mesas CNC',
                        image: getImage('/images/equipo/equipo-industrial-1.jpg', 'equipment.0.image'),
                        description: 'Control numérico computarizado de alta precisión'
                      },
                      {
                        title: 'Equipos de Izaje',
                        subtitle: '8 Puentes Grúa',
                        image: getImage('/images/general/industria-general.jpg', 'equipment.1.image'),
                        description: 'Distribución estratégica en nuestras plantas'
                      },
                      {
                        title: 'Equipos Especializados',
                        subtitle: 'Granalladora y Más',
                        image: getImage('/images/servicios/fabricacion-1.jpg', 'equipment.2.image'),
                        description: 'Granalladora, ensambladora y curvadora especializada'
                      }
                    ].map((equipo, index) => (
                      <motion.div
                        key={equipo.title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-64">
                          <Image
                            src={equipo.image}
                            alt={equipo.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <span className="text-blue-300 text-sm font-medium">{equipo.subtitle}</span>
                            <h3 className="text-xl font-bold">{equipo.title}</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600">{equipo.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {section.id === 'innovacion' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                  {innovations.map((innovation, idx) => {
                    const IconComponent = innovation.icon
                    return (
                      <motion.div
                        key={innovation.title}
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex flex-col"
                      >
                        <div className="bg-white rounded-2xl p-8 shadow-lg flex-1">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{innovation.title}</h3>
                          </div>
                          
                          <p className="text-gray-600 mb-6 leading-relaxed">{innovation.description}</p>
                          
                          <div className="space-y-3">
                            {innovation.benefits.map((benefit, benefitIndex) => (
                              <motion.div
                                key={benefitIndex}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 + benefitIndex * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-3"
                              >
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700">{benefit}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Innovaciones en Acción */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-12">
                    Innovación en Cada Proceso
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      {
                        title: 'Tecnología BIM Integrada',
                        subtitle: 'Building Information Modeling',
                        image: getImage('/images/servicios/gestion-1.jpg', 'innovations.0.image'),
                        description: 'Coordinación multidisciplinaria y detección temprana de conflictos'
                      },
                      {
                        title: 'Control Digital de Calidad',
                        subtitle: 'Trazabilidad QR',
                        image: getImage('/images/servicios/gestion-2.jpg', 'innovations.1.image'),
                        description: 'Reportes digitales en tiempo real y certificación digitalizada'
                      }
                    ].map((innovacion, index) => (
                      <motion.div
                        key={innovacion.title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-64">
                          <Image
                            src={innovacion.image}
                            alt={innovacion.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <span className="text-cyan-300 text-sm font-medium">{innovacion.subtitle}</span>
                            <h3 className="text-xl font-bold">{innovacion.title}</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600">{innovacion.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
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
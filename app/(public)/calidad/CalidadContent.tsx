'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Shield, 
  Award, 
  CheckCircle2, 
  FileCheck,
  Users,
  Settings,
  Leaf,
  Target,
  ArrowRight,
  BarChart3,
  Clock,
  AlertTriangle,
  Eye,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const calidadSections = [
  {
    id: 'sig',
    titulo: 'Sistema SIG',
    icon: Shield,
    color: 'from-blue-500 to-blue-600',
    content: {
      titulo: 'Sistema Integrado de Gestión (SIG)',
      subtitulo: 'Cuatro pilares de la excelencia',
      descripcion: 'Nuestro SIG integra cuatro pilares fundamentales que aseguran la excelencia operacional.',
      destacados: [
        'Gestión de Calidad Total',
        'Seguridad y Salud Ocupacional',
        'Gestión Ambiental Sostenible',
        'Gestión Integral de Riesgos'
      ]
    }
  },
  {
    id: 'politicas',
    titulo: 'Políticas',
    icon: Eye,
    color: 'from-purple-500 to-purple-600',
    content: {
      titulo: 'Políticas Corporativas',
      subtitulo: 'Marco de actuación empresarial',
      descripcion: 'Nuestras políticas definen el marco de actuación y los compromisos con todos nuestros grupos de interés.',
      destacados: [
        'Política de Calidad Total',
        'Política de Seguridad y Salud en el Trabajo',
        'Política de Transparencia y Ética Empresarial',
        'Política Antilavado de Activos (SARLAFT)'
      ]
    }
  },
  {
    id: 'cumplimiento',
    titulo: 'Cumplimiento',
    icon: FileCheck,
    color: 'from-green-500 to-green-600',
    content: {
      titulo: 'Cumplimiento Normativo',
      subtitulo: 'Estándares internacionales',
      descripcion: 'Cumplimos rigurosamente con las normas técnicas más exigentes del sector metalmecánico.',
      destacados: [
        'NSR-10 - Norma Sismo Resistente',
        'AWS - American Welding Society',
        'AISC - American Institute of Steel Construction',
        'ICONTEC - Normas técnicas colombianas'
      ]
    }
  },
  {
    id: 'control-calidad',
    titulo: 'Control de Calidad',
    icon: Settings,
    color: 'from-orange-500 to-orange-600',
    content: {
      titulo: 'Control de Calidad',
      subtitulo: 'Excelencia en cada etapa',
      descripcion: 'Implementamos controles rigurosos en cada etapa del proceso para garantizar los más altos estándares.',
      destacados: [
        'Control en Diseño - Revisión por pares',
        'Control en Fabricación - Inspección continua',
        'Control en Montaje - Protocolos de entrega',
        'Liberación por Inspector SIG'
      ]
    }
  },
]

// Función helper para crear sigComponents dinámicos
const createSigComponents = (getText: Function, getImage: Function) => [
  {
    title: getText('Gestión de Calidad', 'sigComponents.0.title'),
    description: getText('Sistemas y procesos para garantizar la excelencia en todos nuestros productos y servicios', 'sigComponents.0.description'),
    image: getImage('/images/certificaciones/certificacion-calidad-1.jpg', 'sigComponents.0.image'),
    icon: Award,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: getText('Seguridad y Salud Ocupacional', 'sigComponents.1.title'),
    description: getText('Protección integral de colaboradores, contratistas y visitantes', 'sigComponents.1.description'),
    image: getImage('/images/equipo/equipo-industrial-1.jpg', 'sigComponents.1.image'),
    icon: Shield,
    color: 'from-green-500 to-green-600'
  },
  {
    title: getText('Gestión Ambiental', 'sigComponents.2.title'),
    description: getText('Compromiso con el desarrollo sostenible y la protección del medio ambiente', 'sigComponents.2.description'),
    image: getImage('/images/empresa/instalaciones-planta.jpg', 'sigComponents.2.image'),
    icon: Leaf,
    color: 'from-green-600 to-green-700'
  },
  {
    title: getText('Gestión de Riesgos', 'sigComponents.3.title'),
    description: getText('Identificación, evaluación y control de riesgos en todos los procesos', 'sigComponents.3.description'),
    image: getImage('/images/proyectos/obra-construccion.jpg', 'sigComponents.3.image'),
    icon: AlertTriangle,
    color: 'from-orange-500 to-orange-600'
  }
]

// Función helper para crear policies dinámicas
const createPolicies = (getText: Function) => [
  {
    title: getText('Política de Calidad Total', 'policies.0.title'),
    description: getText('Adoptamos la Calidad Total como valor estratégico fundamental', 'policies.0.description'),
    commitments: [
      getText('Satisfacer plenamente las necesidades y expectativas de clientes', 'policies.0.commitments.0'),
      getText('Cumplir requisitos reglamentarios aplicables', 'policies.0.commitments.1'),
      getText('Prevenir defectos y no conformidades', 'policies.0.commitments.2'),
      getText('Mejorar continuamente nuestros procesos', 'policies.0.commitments.3'),
      getText('Proporcionar recursos necesarios para el SIG', 'policies.0.commitments.4')
    ],
    icon: Target,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: getText('Política de Seguridad y Salud en el Trabajo', 'policies.1.title'),
    description: getText('Compromiso integral con la seguridad de nuestro equipo', 'policies.1.description'),
    commitments: [
      getText('Protección integral de colaboradores, contratistas y visitantes', 'policies.1.commitments.0'),
      getText('Identificación, evaluación y control de riesgos laborales', 'policies.1.commitments.1'),
      getText('Prevención proactiva de riesgos laborales', 'policies.1.commitments.2'),
      getText('Cumplimiento de normatividad nacional vigente', 'policies.1.commitments.3'),
      getText('Condiciones laborales seguras y saludables', 'policies.1.commitments.4')
    ],
    icon: Shield,
    color: 'from-green-500 to-green-600'
  },
  {
    title: getText('Política de Transparencia y Ética Empresarial', 'policies.2.title'),
    description: getText('Integridad y transparencia en todas nuestras operaciones', 'policies.2.description'),
    commitments: [
      getText('Programa para mitigar riesgos de corrupción y soborno', 'policies.2.commitments.0'),
      getText('Canal ético para reportes confidenciales', 'policies.2.commitments.1'),
      getText('Declaración de conflictos de interés', 'policies.2.commitments.2'),
      getText('Compromiso con la integridad empresarial', 'policies.2.commitments.3'),
      getText('Cero tolerancia a prácticas indebidas', 'policies.2.commitments.4')
    ],
    icon: Eye,
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: getText('Política Antilavado de Activos', 'policies.3.title'),
    description: getText('Cumplimiento riguroso de normativas SARLAFT', 'policies.3.description'),
    commitments: [
      getText('Mitigación del riesgo de LA/FT', 'policies.3.commitments.0'),
      getText('Debida diligencia en relaciones comerciales', 'policies.3.commitments.1'),
      getText('Reporte de operaciones sospechosas', 'policies.3.commitments.2'),
      getText('Cumplimiento normativo SARLAFT', 'policies.3.commitments.3'),
      getText('Capacitación continua del personal', 'policies.3.commitments.4')
    ],
    icon: Lock,
    color: 'from-red-500 to-red-600'
  }
]

// Función helper para crear standards dinámicos
const createStandards = (getText: Function) => [
  {
    category: getText('Normas Técnicas', 'standards.0.category'),
    items: [
      { name: getText('NSR-10', 'standards.0.items.0.name'), description: getText('Norma Sismo Resistente Colombiana', 'standards.0.items.0.description') },
      { name: getText('AWS', 'standards.0.items.1.name'), description: getText('American Welding Society', 'standards.0.items.1.description') },
      { name: getText('AISC', 'standards.0.items.2.name'), description: getText('American Institute of Steel Construction', 'standards.0.items.2.description') },
      { name: getText('ICONTEC', 'standards.0.items.3.name'), description: getText('Normas técnicas colombianas aplicables', 'standards.0.items.3.description') }
    ]
  },
  {
    category: getText('Estándares de Fabricación', 'standards.1.category'),
    items: [
      { name: getText('Tolerancias', 'standards.1.items.0.name'), description: getText('Según normas internacionales', 'standards.1.items.0.description') },
      { name: getText('Soldadura', 'standards.1.items.1.name'), description: getText('Procedimientos calificados', 'standards.1.items.1.description') },
      { name: getText('Ensayos', 'standards.1.items.2.name'), description: getText('No destructivos cuando se requieren', 'standards.1.items.2.description') },
      { name: getText('Materiales', 'standards.1.items.3.name'), description: getText('Certificados de calidad', 'standards.1.items.3.description') }
    ]
  },
  {
    category: getText('Protocolos de Seguridad', 'standards.2.category'),
    items: [
      { name: getText('Alturas', 'standards.2.items.0.name'), description: getText('Trabajo seguro en alturas', 'standards.2.items.0.description') },
      { name: getText('Cargas', 'standards.2.items.1.name'), description: getText('Manejo de cargas críticas', 'standards.2.items.1.description') },
      { name: getText('Espacios', 'standards.2.items.2.name'), description: getText('Espacios confinados', 'standards.2.items.2.description') },
      { name: getText('Emergencias', 'standards.2.items.3.name'), description: getText('Plan de emergencias', 'standards.2.items.3.description') }
    ]
  }
]

// Función helper para crear qualityControl dinámico
const createQualityControl = (getText: Function) => [
  {
    stage: getText('En Diseño', 'qualityControl.0.stage'),
    processes: [
      getText('Revisión por pares de ingenieros', 'qualityControl.0.processes.0'),
      getText('Verificación de cálculos estructurales', 'qualityControl.0.processes.1'),
      getText('Validación contra normas vigentes', 'qualityControl.0.processes.2'),
      getText('Aprobación del cliente', 'qualityControl.0.processes.3')
    ],
    icon: FileCheck,
    color: 'from-blue-500 to-blue-600'
  },
  {
    stage: getText('En Fabricación', 'qualityControl.1.stage'),
    processes: [
      getText('Inspección de materias primas', 'qualityControl.1.processes.0'),
      getText('Control dimensional continuo', 'qualityControl.1.processes.1'),
      getText('Verificación de soldaduras', 'qualityControl.1.processes.2'),
      getText('Pruebas de pintura y recubrimientos', 'qualityControl.1.processes.3'),
      getText('Liberación por inspector SIG', 'qualityControl.1.processes.4')
    ],
    icon: Settings,
    color: 'from-orange-500 to-orange-600'
  },
  {
    stage: getText('En Montaje', 'qualityControl.2.stage'),
    processes: [
      getText('Check list pre-montaje', 'qualityControl.2.processes.0'),
      getText('Verificación de torques', 'qualityControl.2.processes.1'),
      getText('Control de verticalidad y alineación', 'qualityControl.2.processes.2'),
      getText('Protocolo de entrega final', 'qualityControl.2.processes.3')
    ],
    icon: CheckCircle2,
    color: 'from-green-500 to-green-600'
  }
]


interface CalidadContentProps {
  paginaData?: any
}

export default function CalidadContent({ paginaData }: CalidadContentProps) {
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
  const sigComponents = createSigComponents(getText, getImage)
  const policies = createPolicies(getText)
  const standards = createStandards(getText)
  const qualityControl = createQualityControl(getText)
  
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
            src={getImage('/images/hero/hero-construccion-industrial.jpg', 'heroImage')}
            alt="Construcción Industrial MEISA"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-800/80" />
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/patterns/quality-grid.svg')] bg-center bg-repeat" />
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
          className="absolute top-20 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-xl"
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
          className="absolute bottom-32 right-16 w-48 h-48 bg-blue-400/20 rounded-full blur-xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-block px-4 py-2 bg-green-100/90 text-green-600 text-sm font-semibold rounded-full mb-8 backdrop-blur-sm"
          >
{getText('CALIDAD Y CERTIFICACIONES', 'heroTag')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6"
          >
            {getText('Nuestro Compromiso con la ', 'heroTitle')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mt-4">
{getText('Excelencia', 'heroTitleHighlight')}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            {getText('MEISA cuenta con un robusto Sistema Integrado de Gestión (SIG) que garantiza calidad, seguridad, cumplimiento normativo y mejora continua en todos nuestros procesos. Más de 27 años de excelencia en seguridad respaldan nuestro compromiso con la calidad.', 'heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href="/contacto"
              className="group px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="flex items-center gap-2">
                {getText('Solicitar Certificaciones', 'heroCta1')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/proyectos"
              className="group px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
            >
              {getText('Ver Proyectos Certificados', 'heroCta2')}
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
              {getText('Sistema de Gestión Integral', 'procesoIntegral.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {getText('Cuatro pilares fundamentales que aseguran la excelencia operacional y el cumplimiento de los más altos estándares', 'procesoIntegral.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sigComponents.map((component, index) => {
              const IconComponent = component.icon
              return (
                <motion.div
                  key={component.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${component.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{component.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{component.description}</p>
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
                {calidadSections.map((section) => {
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
                          ? 'bg-green-600 text-white shadow-lg scale-105' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
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
      {calidadSections.map((section, index) => (
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
                {getText(section.content.titulo, `sections.${section.id}.title`)}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {getText(section.content.descripcion, `sections.${section.id}.subtitle`)}
              </p>
            </motion.div>

            {section.id === 'sig' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {sigComponents.map((component, idx) => {
                  const IconComponent = component.icon
                  return (
                    <motion.div
                      key={component.title}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {/* Imagen del componente */}
                      <div className="relative h-48">
                        <Image
                          src={component.image}
                          alt={component.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className={`absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br ${component.color} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="p-6 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{component.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{component.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {section.id === 'politicas' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {policies.map((policy, idx) => {
                  const IconComponent = policy.icon
                  return (
                    <motion.div
                      key={policy.title}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.2 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 bg-gradient-to-br ${policy.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{policy.title}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">{policy.description}</p>
                      
                      <div className="space-y-3">
                        {policy.commitments.map((commitment, commitmentIndex) => (
                          <motion.div
                            key={commitmentIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 + commitmentIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{commitment}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {section.id === 'cumplimiento' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {standards.map((category, categoryIndex) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-8 shadow-lg"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                      {category.category}
                    </h3>
                    
                    <div className="space-y-4">
                      {category.items.map((item, itemIndex) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 + itemIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="flex flex-col"
                        >
                          <span className="font-semibold text-gray-900">{item.name}</span>
                          <span className="text-gray-600 text-sm">{item.description}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {section.id === 'control-calidad' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {qualityControl.map((stage, idx) => {
                  const IconComponent = stage.icon
                  return (
                    <motion.div
                      key={stage.stage}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.2 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-8 shadow-lg"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${stage.color} rounded-xl flex items-center justify-center mb-6`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-6">{stage.stage}</h3>
                      
                      <div className="space-y-3">
                        {stage.processes.map((process, processIndex) => (
                          <motion.div
                            key={processIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 + processIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{process}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {getText('Calidad que Trasciende en cada Proyecto', 'cta.title')}
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              {getText('Nuestro compromiso con la calidad, seguridad y cumplimiento normativo nos ha posicionado como líderes en el sector metalmecánico colombiano. Más de 27 años de excelencia operacional y cientos de proyectos exitosos respaldan nuestra trayectoria.', 'cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {getText('Solicitar Certificaciones', 'ctaCta1')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all"
              >
                {getText('Ver Proyectos Certificados', 'ctaCta2')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
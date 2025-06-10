'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Building2, 
  Target, 
  Eye, 
  Heart, 
  Shield, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Users,
  Award,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

interface EmpresaContentProps {
  paginaData?: any
}

export default function EmpresaContent({ paginaData }: EmpresaContentProps) {
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
  
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})
  const navRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  const empresaSections = [
    {
      id: 'historia',
      titulo: 'Historia',
      icon: 'Building2'
    },
    {
      id: 'identidad',
      titulo: 'Identidad',
      icon: 'Target'
    },
    {
      id: 'capacidades',
      titulo: 'Capacidades',
      icon: 'Award'
    },
    {
      id: 'politicas',
      titulo: 'Políticas',
      icon: 'Shield'
    },
    {
      id: 'gobierno',
      titulo: 'Gobierno',
      icon: 'FileText'
    }
  ]

  const getIcon = (iconName: string) => {
    const icons = {
      Building2,
      Target,
      Award,
      Shield,
      FileText
    }
    return icons[iconName as keyof typeof icons] || Building2
  }

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
            src={getImage('/images/empresa/instalaciones-planta.jpg', 'heroImage')}
            alt="Instalaciones MEISA"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-800/80" />
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-block px-4 py-2 bg-blue-100/90 text-blue-600 text-sm font-semibold rounded-full mb-8 backdrop-blur-sm"
          >
{getText('NUESTRA EMPRESA', 'heroTag')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6"
          >
            {getText('Nuestra Empresa', 'heroTitle')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-4">
{getText('Líderes en Estructuras Metálicas', 'heroTitleHighlight')}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            {getText('Líderes en estructuras metálicas con más de 29 años de experiencia', 'heroSubtitle')}
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
                {getText('Hablemos de tu Proyecto', 'heroCta1')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/proyectos"
              className="group px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
            >
{getText('Ver Nuestros Proyectos', 'heroCta2')}
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Numbers Section */}
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
              {getText('MEISA en Números', 'numeros.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {getText('Más de 27 años de experiencia nos han posicionado como líderes en el sector metalmecánico.', 'numeros.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: getText("27", 'numeroStats.0.number'), label: getText("Años de Experiencia", 'numeroStats.0.label'), icon: Award },
              { number: getText("350", 'numeroStats.1.number'), label: getText("Toneladas/Mes", 'numeroStats.1.label'), icon: Building2 },
              { number: getText("3", 'numeroStats.2.number'), label: getText("Plantas", 'numeroStats.2.label'), icon: Target },
              { number: getText("100+", 'numeroStats.3.number'), label: getText("Colaboradores", 'numeroStats.3.label'), icon: Users }
            ].map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{item.number}</div>
                  <div className="text-white font-semibold">{item.label}</div>
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
            <div 
              className="overflow-x-auto scroll-container mx-8" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex space-x-1 py-4 min-w-max">
                {empresaSections.map((section) => {
                  const IconComponent = getIcon(section.icon)
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

      {/* Sections */}
      <section
        id="historia"
        ref={(el) => { sectionsRef.current['historia'] = el }}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {getText('Nuestra Historia', 'sections.historia.title')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">{getText('Más de dos décadas forjando el futuro de la construcción en Colombia', 'sections.historia.subtitle')}</p>
              <div className="space-y-6 text-lg leading-8 text-gray-600">
                <p>
                  {getText('Desde 1998, MEISA ha sido pionera en el diseño, fabricación y montaje de estructuras metálicas en Colombia. Fundada en Popayán, Cauca, hemos crecido hasta convertirnos en una empresa líder del sector.', 'historia.parrafo1')}
                </p>
                <p>
                  {getText('Con el objeto de lograr una mayor competitividad y continuar brindando productos y servicios de calidad, nuestra empresa año a año ha incorporado talento humano altamente competente, máquinas y equipos de última tecnología.', 'historia.parrafo2')}
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Imagen principal de historia */}
              <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={getImage('/images/empresa/instalaciones-planta.jpg', 'historia.mainImage')}
                  alt="Historia de MEISA"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{getText('Desde 1998', 'historia.card.title')}</h3>
                  <p className="text-blue-100">
                    {getText('Construyendo el futuro de Colombia con estructuras metálicas de la más alta calidad', 'historia.card.subtitle')}
                  </p>
                </div>
              </div>

              {/* Timeline visual opcional */}
              {getImage('', 'historia.timelineImage') && (
                <div className="relative h-32 rounded-xl overflow-hidden">
                  <Image
                    src={getImage('/images/empresa/instalaciones-planta.jpg', 'historia.timelineImage')}
                    alt="Timeline MEISA"
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="identidad"
        ref={(el) => { sectionsRef.current['identidad'] = el }}
        className="py-24 bg-gray-50"
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
              {getText('Misión, Visión y Valores', 'sections.identidad.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getText('Los principios que guían nuestro trabajo', 'sections.identidad.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{getText('Nuestra Misión', 'identidad.mision.title')}</h3>
              </div>
              <p className="text-lg leading-8 text-gray-600">
                {getText('Diseñar, fabricar y montar estructuras metálicas con los más altos estándares de calidad, cumpliendo los tiempos de entrega acordados y contribuyendo al desarrollo de la infraestructura nacional.', 'identidad.mision.texto')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{getText('Nuestra Visión', 'identidad.vision.title')}</h3>
              </div>
              <p className="text-lg leading-8 text-gray-600">
                {getText('Ser la empresa líder en Colombia en el diseño, fabricación y montaje de estructuras metálicas, reconocida por su excelencia, innovación y compromiso con el desarrollo sostenible.', 'identidad.vision.texto')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="capacidades"
        ref={(el) => { sectionsRef.current['capacidades'] = el }}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {getText('Nuestras Capacidades', 'sections.capacidades.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getText('La experiencia y capacidad productiva que nos posiciona como líderes del sector.', 'sections.capacidades.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: getText("27", 'capacidadStats.0.number'), label: getText("Años de Experiencia", 'capacidadStats.0.label'), desc: getText("Liderando el sector", 'capacidadStats.0.desc'), icon: Award },
              { number: getText("350", 'capacidadStats.1.number'), label: getText("Toneladas/Mes", 'capacidadStats.1.label'), desc: getText("Capacidad de producción", 'capacidadStats.1.desc'), icon: Building2 },
              { number: getText("3", 'capacidadStats.2.number'), label: getText("Plantas", 'capacidadStats.2.label'), desc: getText("Popayán, Jamundí y expansión", 'capacidadStats.2.desc'), icon: Target },
              { number: getText("100+", 'capacidadStats.3.number'), label: getText("Colaboradores", 'capacidadStats.3.label'), desc: getText("Equipo especializado", 'capacidadStats.3.desc'), icon: Users }
            ].map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{item.number}</div>
                  <div className="text-gray-900 font-semibold mb-1">{item.label}</div>
                  <div className="text-gray-600 text-sm">{item.desc}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Capacidades Visuales */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Nuestras Fortalezas en Acción
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Equipo Técnico Especializado',
                  image: getImage('/images/equipo/equipo-industrial-1.jpg', 'capacidades.equipoTecnico'),
                  description: 'Ingenieros y técnicos altamente calificados'
                },
                {
                  title: 'Proceso de Fabricación',
                  image: getImage('/images/servicios/gestion-3.jpg', 'capacidades.procesoFabricacion'),
                  description: 'Control de calidad en cada etapa'
                },
                {
                  title: 'Maquinaria y Equipos',
                  image: getImage('/images/general/industria-general.jpg', 'capacidades.maquinariaEquipos'),
                  description: 'Tecnología de punta en nuestras plantas'
                },
                {
                  title: 'Instalaciones de Producción',
                  image: getImage('/images/empresa/instalaciones-planta.jpg', 'capacidades.instalacionesProduccion'),
                  description: 'Plantas modernas en Popayán y Jamundí'
                }
              ].map((capacidad, index) => (
                <motion.div
                  key={capacidad.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={capacidad.image}
                      alt={capacidad.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{capacidad.title}</h4>
                    <p className="text-gray-600 text-sm">{capacidad.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instalaciones y Ubicaciones */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nuestras Instalaciones
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plantas estratégicamente ubicadas para servir todo el territorio colombiano
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Planta Popayán',
                subtitle: 'Planta Principal',
                image: getImage('/images/empresa/instalaciones-planta.jpg', 'instalaciones.plantaPopayan'),
                description: 'Nuestra sede principal con capacidad de 200 toneladas/mes'
              },
              {
                title: 'Planta Jamundí',
                subtitle: 'Expansión Estratégica',
                image: getImage('/images/general/industria-general.jpg', 'instalaciones.plantaJamundi'),
                description: 'Ampliación que incrementa nuestra capacidad productiva'
              },
              {
                title: 'Vista Panorámica',
                subtitle: 'Infraestructura Moderna',
                image: getImage('/images/servicios/gestion-4.jpg', 'instalaciones.vistaPanoramica'),
                description: 'Instalaciones diseñadas para la eficiencia y calidad'
              }
            ].map((instalacion, index) => (
              <motion.div
                key={instalacion.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={instalacion.image}
                    alt={instalacion.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-blue-300 text-sm font-medium">{instalacion.subtitle}</span>
                    <h3 className="text-xl font-bold">{instalacion.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{instalacion.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="politicas"
        ref={(el) => { sectionsRef.current['politicas'] = el }}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                {getText('Política Integrada de Gestión', 'sections.politicas.title')}
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {getText('Nuestro marco de gestión integra calidad, seguridad, medio ambiente y cumplimiento normativo.', 'sections.politicas.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{getText('Nuestros Objetivos:', 'politicas.objetivosTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                getText("Satisfacer plenamente las necesidades y expectativas de nuestros clientes", 'politicas.objetivos.0'),
                getText("Cumplir con todos los requisitos reglamentarios aplicables", 'politicas.objetivos.1'),
                getText("Prevenir defectos y no conformidades en nuestros procesos", 'politicas.objetivos.2'),
                getText("Mejorar continuamente la eficacia de nuestro sistema de gestión", 'politicas.objetivos.3'),
                getText("Proporcionar los recursos necesarios para el logro de estos objetivos", 'politicas.objetivos.4'),
                getText("Promover la participación activa de todo el personal", 'politicas.objetivos.5')
              ].map((objetivo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{objetivo}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="gobierno"
        ref={(el) => { sectionsRef.current['gobierno'] = el }}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                {getText('Gobierno Corporativo', 'sections.gobierno.title')}
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getText('Documentos y políticas que rigen nuestro comportamiento empresarial.', 'sections.gobierno.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Manual de Sagrilaft",
                desc: "Políticas para la mitigación del riesgo de LAVADO DE ACTIVOS Y FINANCIACIÓN DEL TERRORISMO.",
                url: "https://meisa.com.co/manual-sagrilaft/",
                icon: Shield
              },
              {
                title: "Política de Transparencia y Ética",
                desc: "Política para mitigar los riesgos de corrupción y soborno transnacional.",
                url: "https://meisa.com.co/politica-programa/",
                icon: Eye
              },
              {
                title: "Política de Tratamiento de Datos",
                desc: "Política para el Tratamiento de los Datos Personales según normativas vigentes.",
                url: "https://meisa.com.co/politica-tratamiento-datos/",
                icon: FileText
              }
            ].map((doc, index) => {
              const IconComponent = doc.icon
              return (
                <motion.div
                  key={doc.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{doc.title}</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">{doc.desc}</p>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    Abrir PDF
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Logros y Reconocimientos */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Logros y Reconocimientos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Certificaciones y reconocimientos que avalan nuestro compromiso con la excelencia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Certificaciones Obtenidas',
                subtitle: 'ISO y Normativas',
                image: getImage('/images/certificaciones/iso-certificacion.jpg', 'logros.certificaciones'),
                description: 'Certificaciones internacionales que garantizan nuestros estándares de calidad'
              },
              {
                title: 'Premios y Reconocimientos',
                subtitle: 'Excelencia Empresarial',
                image: getImage('/images/certificaciones/certificacion-calidad-1.jpg', 'logros.premios'),
                description: 'Reconocimientos por nuestra contribución al desarrollo del sector'
              }
            ].map((logro, index) => (
              <motion.div
                key={logro.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={logro.image}
                    alt={logro.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-blue-300 text-sm font-medium">{logro.subtitle}</span>
                    <h3 className="text-xl font-bold">{logro.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{logro.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              {getText('Construyamos el Futuro Juntos', 'cta.title')}
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              {getText('Con más de 27 años de experiencia, MEISA continúa siendo el aliado estratégico para proyectos de estructuras metálicas en Colombia.', 'cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {getText('Hablemos de tu Proyecto', 'ctaCta1')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                {getText('Conoce Nuestros Proyectos', 'ctaCta2')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
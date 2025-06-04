'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  CheckCircle2, ArrowRight, Award, 
  FileText, Settings, Truck, Shield, Calculator,
  ChevronDown, ChevronRight, Play, Users, 
  Building2, Cog, HardHat, MessageSquare,
  Target, Lightbulb, Zap, Globe, ArrowDown,
  ChevronLeft
} from 'lucide-react'
import * as Icons from 'lucide-react'
import { getServiceColors } from '@/lib/service-colors'

interface ServicioData {
  id: string
  titulo: string
  subtitulo: string
  descripcion: string
  capacidades: string[]
  tecnologias?: { titulo: string; items: string[] }
  normativas?: { titulo: string; items: string[] }
  equipamiento?: { titulo: string; items: string[] }
  certificaciones?: { titulo: string; items: string[] }
  metodologia?: { titulo: string; items: string[] }
  ventajas?: { titulo: string; items: string[] }
  equipos?: { titulo: string; items: string[] }
  seguridad?: { titulo: string; items: string[] }
  expertise: { titulo: string; descripcion: string }
  imagen: string
  icono: string
  color: string
  bgGradient: string
}

interface ProcesoStep {
  fase: number
  titulo: string
  descripcion: string
  fortalezas: string[]
  entregables: string
  icono: string
}

interface ServiciosContentProps {
  servicios: ServicioData[]
  procesoIntegral: ProcesoStep[]
}

export default function ServiciosContent({ 
  servicios, 
  procesoIntegral
}: ServiciosContentProps) {
  const [activeSection, setActiveSection] = useState('')
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})
  const navRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  // Scroll spy para detectar sección activa
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

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

  // Auto-scroll de la navegación al servicio activo
  useEffect(() => {
    if (activeSection && navRef.current) {
      const navContainer = navRef.current.querySelector('nav')
      const activeButton = navRef.current.querySelector(`[data-service-id="${activeSection}"]`) as HTMLElement
      
      if (activeButton && navContainer) {
        const containerRect = navContainer.getBoundingClientRect()
        const buttonRect = activeButton.getBoundingClientRect()
        
        // Calcular si el botón está fuera del área visible
        const isOutOfView = buttonRect.left < containerRect.left || buttonRect.right > containerRect.right
        
        if (isOutOfView) {
          // Scroll para centrar el botón activo
          const scrollLeft = activeButton.offsetLeft - (navContainer.clientWidth / 2) + (activeButton.clientWidth / 2)
          navContainer.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          })
        }
      }
    }
  }, [activeSection])

  // Detectar si hay contenido scrolleable en la navegación
  useEffect(() => {
    const checkScrollIndicators = () => {
      if (navRef.current) {
        const navContainer = navRef.current.querySelector('nav')
        if (navContainer) {
          const canScrollLeft = navContainer.scrollLeft > 0
          const canScrollRight = navContainer.scrollLeft < (navContainer.scrollWidth - navContainer.clientWidth)
          
          setShowLeftArrow(canScrollLeft)
          setShowRightArrow(canScrollRight)
        }
      }
    }

    // Verificar al cargar y en resize
    checkScrollIndicators()
    window.addEventListener('resize', checkScrollIndicators)

    // Verificar cuando se hace scroll en la navegación
    const navContainer = navRef.current?.querySelector('nav')
    if (navContainer) {
      navContainer.addEventListener('scroll', checkScrollIndicators)
    }

    return () => {
      window.removeEventListener('resize', checkScrollIndicators)
      if (navContainer) {
        navContainer.removeEventListener('scroll', checkScrollIndicators)
      }
    }
  }, [servicios])

  // Función para scroll suave a sección
  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId]
    if (element) {
      const navHeight = navRef.current?.offsetHeight || 0
      const mainNavHeight = 80 // Altura fija de la navegación principal (h-20)
      const elementPosition = element.offsetTop - navHeight - mainNavHeight - 20
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  // Funciones para scroll manual de la navegación
  const scrollNavLeft = () => {
    const navContainer = navRef.current?.querySelector('nav')
    if (navContainer) {
      navContainer.scrollBy({
        left: -200,
        behavior: 'smooth'
      })
    }
  }

  const scrollNavRight = () => {
    const navContainer = navRef.current?.querySelector('nav')
    if (navContainer) {
      navContainer.scrollBy({
        left: 200,
        behavior: 'smooth'
      })
    }
  }

  // Función para obtener el icono dinámicamente
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Settings
    return Icon
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section con Parallax */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/images/backgrounds/steel-texture.jpg')] opacity-10"></div>
        
        {/* Elementos flotantes animados con colores MEISA */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-blue-600/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-blue-700/30 rounded-full blur-2xl"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Servicios <span className="text-blue-400">Integrales</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12">
              Soluciones completas en estructuras metálicas con{' '}
              <span className="font-semibold text-blue-400">29+ años de experiencia</span>{' '}
              y tecnología de vanguardia
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Nuestro Compromiso</h2>
              <p className="text-lg text-gray-200">
                "Brindar una atención integral es clave para finalizar los proyectos 
                de manera eficiente y eficaz. Combinamos expertise técnico, tecnología avanzada y 
                un enfoque centrado en el cliente para entregar resultados excepcionales."
              </p>
            </div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12"
            >
              <ArrowDown className="w-8 h-8 text-white/80 mx-auto" />
              <p className="text-white/80 text-sm mt-2 font-medium">Scroll para explorar</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Proceso Integral MEISA - Rediseño Moderno */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white relative overflow-hidden">
        {/* Elementos de fondo mejorados */}
        <div className="absolute inset-0 bg-[url('/images/backgrounds/grid-pattern.svg')] opacity-5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 font-semibold text-sm uppercase tracking-wider">Metodología Comprobada</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Proceso Integral
              </span>
              <br />
              <span className="text-blue-400">MEISA</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Un <span className="text-blue-300 font-semibold">enfoque sistemático y comprobado</span> que garantiza 
              resultados excepcionales en cada proyecto, desde la conceptualización hasta la entrega final
            </p>
            
            {/* Estadísticas destacadas */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">4</div>
                <div className="text-sm text-gray-400">Fases Integradas</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">500+</div>
                <div className="text-sm text-gray-400">Proyectos Exitosos</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">100%</div>
                <div className="text-sm text-gray-400">Metodología Propia</div>
              </div>
            </div>
          </motion.div>

          {/* Proceso rediseñado */}
          <div className="relative">
            {/* Línea de conexión central */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {procesoIntegral.map((paso, index) => {
                const StepIcon = getIcon(paso.icono)
                
                return (
                  <motion.div
                    key={paso.fase}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {/* Efecto de brillo al hacer hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                    
                    <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 group-hover:border-blue-400/50 transition-all duration-300 h-full">
                      {/* Número de fase */}
                      <div className="absolute -top-4 left-8">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {paso.fase}
                        </div>
                      </div>
                      
                      {/* Icono principal */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:shadow-blue-500/25 transition-shadow duration-300">
                        <StepIcon className="w-10 h-10 text-white" />
                      </div>
                      
                      {/* Contenido */}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">
                          {paso.titulo}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {paso.descripcion}
                        </p>
                      </div>
                      
                      {/* Fortalezas mejoradas */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-blue-300 border-b border-blue-400/30 pb-2">
                          Fortalezas Clave
                        </h4>
                        <ul className="space-y-2">
                          {paso.fortalezas.slice(0, 3).map((fortaleza, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs">
                              <div className="w-4 h-4 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                              </div>
                              <span className="text-gray-300 leading-relaxed">{fortaleza}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Entregables */}
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="text-xs text-blue-300 font-medium mb-1">Entregable:</div>
                        <div className="text-xs text-gray-400 leading-relaxed">{paso.entregables}</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          
          {/* Footer de la sección */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">¿Por qué nuestro proceso es único?</h3>
              <p className="text-gray-300 leading-relaxed">
                Cada fase está diseñada para <span className="text-blue-300 font-semibold">integrar tecnología BIM</span>, 
                <span className="text-blue-300 font-semibold"> seguimiento en tiempo real</span> y 
                <span className="text-blue-300 font-semibold"> control de calidad certificado</span>, 
                garantizando que su proyecto se entregue a tiempo, dentro del presupuesto y con los más altos estándares.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tecnología y Herramientas - Movido aquí para mejor flujo */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tecnología y Herramientas Especializadas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Utilizamos las herramientas más avanzadas de la industria para garantizar precisión, 
              eficiencia y seguimiento en tiempo real de cada proyecto
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* BIM y Modelado 3D */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">BIM y Modelado 3D</h3>
              <p className="text-gray-600 mb-6">
                Tecnología de vanguardia para modelado paramétrico y coordinación multidisciplinaria
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-gray-700">Tekla Structures</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-gray-700">Autodesk BIM 360</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-gray-700">Detección de interferencias</span>
                </div>
              </div>
            </motion.div>

            {/* Fabricación CNC */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6">
                <Cog className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fabricación Automatizada</h3>
              <p className="text-gray-600 mb-6">
                Maquinaria CNC de precisión para corte y fabricación de componentes estructurales
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-gray-700">Corte plasma CNC</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-gray-700">Control numérico computarizado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-gray-700">Capacidad 600 ton/mes</span>
                </div>
              </div>
            </motion.div>

            {/* Seguimiento de Proyectos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Seguimiento Digital</h3>
              <p className="text-gray-600 mb-6">
                Sistemas integrados para el seguimiento en tiempo real del progreso de fabricación
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full" />
                  <span className="text-gray-700">Sistema ERP integrado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full" />
                  <span className="text-gray-700">Trazabilidad completa</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full" />
                  <span className="text-gray-700">Reportes en tiempo real</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mensaje destacado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Integración Tecnológica Completa</h3>
            <p className="text-blue-100 text-lg max-w-3xl mx-auto">
              Desde el diseño BIM hasta la entrega final, cada proyecto es gestionado con tecnología de vanguardia 
              que permite comunicación transparente, seguimiento detallado y entrega oportuna con los más altos estándares de calidad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navegación Sticky */}
      <div 
        ref={navRef}
        className="sticky top-20 z-40 bg-white/98 backdrop-blur-md border-b border-gray-200 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Indicador izquierdo */}
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={scrollNavLeft}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-2 transition-all duration-200 border border-gray-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}

          {/* Navegación scrolleable */}
          <nav className="flex overflow-x-auto py-4 space-x-4 scrollbar-hide scroll-smooth px-12">
            {servicios.map((servicio) => {
              const Icon = getIcon(servicio.icono)
              return (
                <button
                  key={servicio.id}
                  data-service-id={servicio.id}
                  onClick={() => scrollToSection(servicio.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    activeSection === servicio.id
                      ? 'bg-slate-900 text-white shadow-lg scale-105 border-2 border-blue-500'
                      : 'text-gray-700 hover:text-slate-900 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{servicio.titulo}</span>
                  {activeSection === servicio.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"
                    />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Indicador derecho */}
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={scrollNavRight}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-2 transition-all duration-200 border border-gray-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}

          {/* Gradientes laterales para indicar scroll */}
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/98 to-transparent pointer-events-none z-5" />
          )}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/98 to-transparent pointer-events-none z-5" />
          )}
        </div>
      </div>

      {/* Servicios - Scroll Continuo */}
      {servicios.map((servicio, index) => {
        const Icon = getIcon(servicio.icono)
        const colors = getServiceColors(servicio.color)
        
        return (
          <section
            key={servicio.id}
            id={servicio.id}
            ref={(el) => { sectionsRef.current[servicio.id] = el }}
            className={`min-h-screen py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Header del Servicio */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full px-4 py-2 mb-6">
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                      <span className="text-sm font-medium text-slate-700">Servicio Especializado</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                      {servicio.titulo}
                    </h2>
                    <p className="text-xl text-gray-600 mb-6">
                      {servicio.subtitulo}
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed mb-8">
                      {servicio.descripcion}
                    </p>
                    
                    {/* Expertise destacado */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                      className={`bg-gradient-to-r ${colors.gradient} p-6 rounded-2xl text-white shadow-xl`}
                    >
                      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <Award className="w-6 h-6" />
                        {servicio.expertise.titulo}
                      </h3>
                      <p className="text-white/95">{servicio.expertise.descripcion}</p>
                    </motion.div>
                  </div>
                  
                  <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className="w-full h-[500px] relative rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                          src={servicio.imagen}
                          alt={servicio.titulo}
                          fill
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Capacidades Grid */}
                <div className="mb-20">
                  <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                    Capacidades Principales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {servicio.capacidades.map((capacidad, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:${colors.bgHover} transition-colors shadow-sm`}>
                            <CheckCircle2 className={`w-6 h-6 ${colors.text}`} />
                          </div>
                          <p className="text-gray-800 font-medium leading-relaxed">{capacidad}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Información Adicional - Layout Mejorado */}
                {(servicio.normativas || servicio.certificaciones || servicio.seguridad || servicio.ventajas) && (
                  <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                      {/* Sección de Estándares/Certificaciones */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl border border-green-100 shadow-lg"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-green-600" />
                          </div>
                          {servicio.normativas?.titulo || 
                           servicio.certificaciones?.titulo || 
                           servicio.seguridad?.titulo || 
                           servicio.ventajas?.titulo}
                        </h3>
                        <ul className="space-y-5">
                          {(servicio.normativas?.items || 
                            servicio.certificaciones?.items || 
                            servicio.seguridad?.items || 
                            servicio.ventajas?.items)?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-4">
                              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      {/* Destacado de Valor Agregado */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className={`bg-gradient-to-br ${colors.gradient} p-10 rounded-3xl text-white relative overflow-hidden shadow-xl`}
                      >
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                              <Award className="w-6 h-6" />
                            </div>
                            Valor Agregado MEISA
                          </h3>
                          <div className="space-y-5">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white/95 leading-relaxed">Tecnología BIM integrada</span>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white/95 leading-relaxed">Seguimiento en tiempo real</span>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white/95 leading-relaxed">Equipo técnico especializado</span>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white/95 leading-relaxed">Capacidad 600 ton/mes</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute top-6 right-6 opacity-10">
                          <Target className="w-20 h-20" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Separador sutil entre servicios */}
            {index < servicios.length - 1 && (
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
            )}
          </section>
        )
      })}

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/backgrounds/dots-pattern.svg')] opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trabajemos Juntos en su Próximo Proyecto
            </h2>
            <p className="text-xl mb-12 text-gray-200 max-w-2xl mx-auto">
              Con 29+ años de experiencia y más de 500 proyectos exitosos, 
              estamos listos para hacer realidad su visión
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Solicitar Cotización
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
              >
                Ver Nuestros Proyectos
                <Play className="w-5 h-5" />
              </Link>
            </div>

            {/* Estadísticas finales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { numero: '500+', texto: 'Proyectos Exitosos' },
                { numero: '15,000+', texto: 'Toneladas Fabricadas' },
                { numero: '29+', texto: 'Años de Experiencia' },
                { numero: '100%', texto: 'Satisfacción Cliente' }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                    {stat.numero}
                  </div>
                  <div className="text-sm text-gray-200 font-medium">{stat.texto}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
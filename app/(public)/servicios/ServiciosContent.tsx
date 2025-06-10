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
  slug: string
  titulo: string
  subtitulo: string
  descripcion: string
  tecnologias?: { titulo: string; items: string[] }
  normativas?: { titulo: string; items: string[] }
  equipamiento?: { titulo: string; items: string[] }
  equipos?: { titulo: string; items: string[] }
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/40"></div>
        
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
                <div className="text-sm text-gray-400">Fases Optimizadas</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">500+</div>
                <div className="text-sm text-gray-400">Proyectos Exitosos</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">100</div>
                <div className="text-sm text-gray-400">Toneladas Transporte</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">50</div>
                <div className="text-sm text-gray-400">Años Garantía</div>
              </div>
            </div>
            
            {/* Timeline visual del proceso */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-16 bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Flujo de Trabajo Integrado</h3>
                  <p className="text-sm text-gray-400">Cada fase se conecta perfectamente con la siguiente</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-green-400"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-yellow-400"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-red-400"></div>
                  </div>
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Proceso rediseñado con interactividad mejorada */}
          <div className="relative">
            {/* Línea de conexión central animada */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent origin-left"
            />
            
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
                      
                      {/* Lista integrada sin etiquetas */}
                      <div className="space-y-3">
                        <ul className="space-y-3">
                          {paso.fortalezas.map((fortaleza, idx) => (
                            <motion.li 
                              key={idx} 
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                              viewport={{ once: true }}
                              className="flex items-start gap-3 text-sm group/item"
                            >
                              <div className="w-5 h-5 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-blue-400/30 transition-colors">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              </div>
                              <span className="text-gray-300 leading-relaxed group-hover/item:text-gray-200 transition-colors">{fortaleza}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Indicador de progreso */}
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center gap-1">
                            {[...Array(4)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  i < paso.fase ? 'bg-blue-400' : 'bg-white/20'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          
          {/* Footer de la sección con CTA y métricas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">¿Por qué nuestro proceso es único?</h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                Cada fase está diseñada para <span className="text-blue-300 font-semibold">integrar tecnología BIM</span>, 
                <span className="text-blue-300 font-semibold"> seguimiento en tiempo real</span> y 
                <span className="text-blue-300 font-semibold"> control de calidad certificado</span>, 
                garantizando que su proyecto se entregue a tiempo, dentro del presupuesto y con los más altos estándares.
              </p>
              
              {/* Métricas de éxito del proceso */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold text-blue-400">98%</div>
                  <div className="text-xs text-gray-400 mt-1">Entrega a Tiempo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-xs text-gray-400 mt-1">Defectos Críticos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">24/7</div>
                  <div className="text-xs text-gray-400 mt-1">Seguimiento Digital</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">100%</div>
                  <div className="text-xs text-gray-400 mt-1">Trazabilidad</div>
                </div>
              </div>
              
              {/* CTA para conocer más del proceso */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8"
              >
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  <MessageSquare className="w-5 h-5" />
                  Conocer más sobre nuestro proceso
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
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
            className={`py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
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
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full px-4 py-2">
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                        <span className="text-sm font-medium text-slate-700">Servicio Especializado</span>
                      </div>
                      <Link 
                        href={`/servicios/${servicio.slug}`}
                        className={`group inline-flex items-center gap-3 px-6 py-3 ${colors.bg} ${colors.text} hover:${colors.bg.replace('bg-', 'bg-opacity-90')} font-semibold text-sm rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105`}
                      >
                        Explorar este servicio
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
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

                {/* Información Adicional - Solo mostrar si hay contenido real */}
                {servicio.normativas && servicio.normativas.items && servicio.normativas.items.length > 0 && (
                  <div className="max-w-6xl mx-auto mt-16">
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
                        {servicio.normativas.titulo}
                      </h3>
                      <ul className="space-y-5">
                        {servicio.normativas.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-4">
                            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
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
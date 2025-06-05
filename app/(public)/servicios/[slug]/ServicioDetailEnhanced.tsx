'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  ChevronRight,
  Shield,
  Award,
  Users,
  Wrench,
  FileCheck,
  TrendingUp,
  Clock,
  Target,
  Zap,
  BookOpen,
  Building2,
  HardHat,
  Briefcase,
  ChevronDown,
  Image as ImageIcon,
  BarChart3,
  GitBranch,
  Trophy,
  Quote,
  Play,
  Radar
} from 'lucide-react'
import * as Icons from 'lucide-react'
import { getServiceColors } from '@/lib/service-colors'

interface TecnologiaItem {
  nombre: string
  descripcion: string
  nivel?: 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto'
}

interface EquipamientoItem {
  nombre: string
  capacidad: string
  cantidad?: number
}

interface MetodologiaFase {
  fase: string
  actividades: string[]
  entregables?: string[]
  duracion?: string
}

interface CertificacionItem {
  nombre: string
  entidad: string
  vigencia?: string
}

interface ServicioData {
  id: string
  slug: string
  titulo: string
  subtitulo: string
  descripcion: string
  tecnologias?: TecnologiaItem[]
  equipamiento?: EquipamientoItem[]
  equipos?: string[]
  normativas?: string[]
  expertise: { titulo: string; descripcion: string }
  imagen: string
  icono: string
  color: string
  bgGradient: string
  // New enhanced fields
  imagenesGaleria?: string[]
  estadisticas?: Array<{ label: string; value: string; icon: string }>
  procesoPasos?: Array<{ title: string; description: string; icon: string }>
}

interface OtroServicio {
  id: string
  slug: string
  titulo: string
  subtitulo: string
  descripcion: string
  imagen: string
  icono: string
  color: string
  bgGradient: string
}

interface ServicioDetailEnhancedProps {
  servicio: ServicioData
  otrosServicios: OtroServicio[]
}

export default function ServicioDetailEnhanced({ servicio, otrosServicios }: ServicioDetailEnhancedProps) {
  const [activeSection, setActiveSection] = useState('overview')
  const [showFloatingNav, setShowFloatingNav] = useState(false)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1])
  
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Settings
    return Icon
  }

  const ServicioIcon = getIcon(servicio.icono)
  const colors = getServiceColors(servicio.color)

  // Navigation sections
  const sections = [
    { id: 'overview', label: 'Descripción General', icon: BookOpen },
    { id: 'normativas', label: 'Normativas', icon: Shield },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { id: 'proceso', label: 'Proceso', icon: GitBranch }
  ]

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Hide floating nav when near the end of the page (CTA section)
      const isNearEnd = scrollPosition + windowHeight > documentHeight - 800
      
      // Show floating nav after scrolling past hero but before CTA
      setShowFloatingNav(scrollPosition > 600 && !isNearEnd)
      
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }))

      const currentSection = sectionElements.find(section => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 150 // Increased to account for navbar + sticky navigation
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Progress bar at the very top */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-200"
      >
        <motion.div
          className={`h-full bg-gradient-to-r ${colors.gradient}`}
          style={{
            scaleX: useTransform(scrollY, [0, 3000], [0, 1]),
            transformOrigin: "left"
          }}
        />
      </motion.div>
      {/* Enhanced Hero Section with Parallax */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${servicio.bgGradient}`}
          style={{ scale: heroScale }}
        />
        <motion.div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070')] bg-cover bg-center"
          style={{ opacity: 0.1, scale: heroScale }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/40"
          style={{ opacity: heroOpacity }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white"
          >
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 mb-8 text-white/80">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{servicio.titulo}</span>
            </div>

            {/* Animated Icon */}
            <motion.div 
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl animate-pulse" />
                <ServicioIcon className="w-16 h-16 text-white relative z-10" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                {servicio.titulo}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
                {servicio.subtitulo}
              </p>
            </motion.div>

            {/* Enhanced CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-3 bg-white text-slate-900 hover:bg-white/90 font-semibold py-5 px-10 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                <MessageSquare className="w-6 h-6" />
                Solicitar Cotización
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => scrollToSection('overview')}
                className="inline-flex items-center gap-3 bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white font-semibold py-5 px-10 rounded-2xl transition-all duration-300 backdrop-blur-sm"
              >
                Explorar Servicio
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Mobile Floating Navigation */}
      <motion.div
        className="fixed bottom-20 left-4 right-4 z-50 lg:hidden"
        initial={{ opacity: 0, y: 100 }}
        animate={{ 
          opacity: showFloatingNav ? 1 : 0, 
          y: showFloatingNav ? 0 : 100 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-3 border border-gray-200">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {sections.map((section) => {
              const SectionIcon = section.icon
              const isActive = activeSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 min-w-[80px] ${
                    isActive 
                      ? `${colors.bg} ${colors.text}` 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <SectionIcon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="text-xs font-medium">
                    {section.label.split(' ')[0]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Desktop Floating Side Navigation */}
      <motion.div
        className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block"
        initial={{ opacity: 0, x: 100 }}
        animate={{ 
          opacity: showFloatingNav ? 1 : 0, 
          x: showFloatingNav ? 0 : 100 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-gray-200">
          <div className="space-y-3">
            {sections.map((section) => {
              const SectionIcon = section.icon
              const isActive = activeSection === section.id
              
              return (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    isActive 
                      ? `${colors.bg} ${colors.text}` 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated background for active state */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-20`}
                      initial={{ x: -100 }}
                      animate={{ x: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    />
                  )}
                  
                  <SectionIcon className={`w-5 h-5 relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className={`font-medium text-sm relative z-10 ${isActive ? 'font-bold' : ''}`}>
                    {section.label}
                  </span>
                  
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
          
          {/* Current section indicator */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2">Sección actual:</p>
            <p className={`font-bold text-center ${colors.text.replace('text-', '').includes('white') ? 'text-gray-800' : colors.text}`}>
              {sections.find(s => s.id === activeSection)?.label}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Overview Section */}
      <section id="overview" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {servicio.titulo}
              </h2>
              <div className="prose prose-lg text-gray-700">
                <p className="leading-relaxed mb-6">
                  {servicio.descripcion}
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Clock className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h4 className="text-3xl font-bold text-gray-900">25+</h4>
                  <p className="text-gray-600">Años de experiencia</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Building2 className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h4 className="text-3xl font-bold text-gray-900">500+</h4>
                  <p className="text-gray-600">Proyectos completados</p>
                </div>
              </div>
            </motion.div>

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={servicio.imagenesGaleria?.[0] || servicio.imagen}
                      alt={`${servicio.titulo} 1`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={servicio.imagenesGaleria?.[1] || servicio.imagen}
                      alt={`${servicio.titulo} 2`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={servicio.imagenesGaleria?.[2] || servicio.imagen}
                      alt={`${servicio.titulo} 3`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={servicio.imagenesGaleria?.[3] || servicio.imagen}
                      alt={`${servicio.titulo} 4`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Expertise Badge */}
              <div className={`absolute -bottom-8 -left-8 bg-gradient-to-r ${colors.gradient} p-6 rounded-2xl text-white shadow-2xl max-w-sm`}>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {servicio.expertise.titulo}
                </h3>
                <p className="text-white/90 text-sm">{servicio.expertise.descripcion}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Tecnología Section */}
      {servicio.tecnologias && servicio.tecnologias.length > 0 && (
        <section id="tecnologia" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tecnología de Vanguardia
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Utilizamos las últimas tecnologías y software especializado para garantizar resultados óptimos
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicio.tecnologias.map((tech, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">
                        {typeof tech === 'string' ? tech : (tech?.nombre || 'Tecnología')}
                      </h4>
                      {typeof tech !== 'string' && tech.nivel && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          tech.nivel === 'Experto' ? 'bg-blue-100 text-blue-700' :
                          tech.nivel === 'Avanzado' ? 'bg-green-100 text-green-700' :
                          tech.nivel === 'Intermedio' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {tech.nivel}
                        </span>
                      )}
                    </div>
                    {typeof tech !== 'string' && tech.descripcion && (
                      <p className="text-sm text-gray-600">
                        {tech.descripcion}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Equipamiento Section */}
      {servicio.equipamiento && servicio.equipamiento.length > 0 && (
        <section id="equipamiento" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Equipamiento Especializado
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Maquinaria y equipos de última generación para garantizar precisión y eficiencia
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicio.equipamiento.map((equipo, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                        <Wrench className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {typeof equipo === 'string' ? equipo : (equipo?.nombre || 'Equipo')}
                      </h4>
                    </div>
                    {typeof equipo !== 'string' && equipo.capacidad && (
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Capacidad:</span> {equipo.capacidad}
                        </p>
                        {equipo.cantidad && (
                          <p className="text-gray-600">
                            <span className="font-medium">Cantidad:</span> {equipo.cantidad} unidades
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* Normativas Section */}
      {servicio.normativas && servicio.normativas.length > 0 && (
        <section id="normativas" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Normativas y Estándares
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Cumplimiento estricto de todas las normativas nacionales e internacionales
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {servicio.normativas.map((normativa, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Shield className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <p className="text-gray-700 font-medium">{normativa}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}




      {/* Statistics Section */}
      {servicio.estadisticas && servicio.estadisticas.length > 0 && (
        <section id="estadisticas" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nuestros Números
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Resultados que respaldan nuestra experiencia y calidad
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {servicio.estadisticas.map((stat, idx) => {
                const StatIcon = getIcon(stat.icon)
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <StatIcon className={`w-10 h-10 ${colors.text}`} />
                    </div>
                    <h3 className="text-4xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600">
                      {stat.label}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {servicio.procesoPasos && servicio.procesoPasos.length > 0 && (
        <section id="proceso" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nuestro Proceso
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Metodología paso a paso para garantizar resultados excepcionales
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 md:transform md:-translate-x-1/2"></div>
              
              {servicio.procesoPasos.map((paso, idx) => {
                const StepIcon = getIcon(paso.icon)
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center mb-12 ${
                      idx % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                    }`}
                  >
                    <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                      <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <div className={`flex items-center gap-4 mb-4 ${idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                            <StepIcon className={`w-6 h-6 ${colors.text}`} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {paso.title}
                          </h3>
                        </div>
                        <p className="text-gray-700">
                          {paso.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className={`absolute left-8 md:left-1/2 w-4 h-4 ${colors.bg} rounded-full transform md:-translate-x-1/2 ring-4 ring-white`}>
                      <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${colors.bg}`}></div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}




      {/* Related Services Section */}
      {otrosServicios.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Soluciones integrales para tu proyecto
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Nuestros 4 servicios principales trabajan en perfecta sinergia para ofrecerte una solución completa de principio a fin.
              </p>
              
              {/* Service integration benefits - more compact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 text-left bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GitBranch className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Sinergia perfecta</h4>
                    <p className="text-gray-600 text-xs">Servicios diseñados para complementarse</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-left bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Un solo proveedor</h4>
                    <p className="text-gray-600 text-xs">Mayor control y comunicación</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otrosServicios.map((otroServicio, index) => {
                const OtroIcon = getIcon(otroServicio.icono)
                const otherColors = getServiceColors(otroServicio.color)
                
                return (
                  <motion.div
                    key={otroServicio.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/servicios/${otroServicio.slug}`}>
                      <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer h-full relative overflow-hidden">
                        {/* Service icon - positioned correctly */}
                        <div className={`w-16 h-16 ${otherColors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10`}>
                          <OtroIcon className={`w-8 h-8 ${otherColors.text}`} />
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {otroServicio.titulo}
                        </h4>
                        
                        <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                          {otroServicio.descripcion}
                        </p>
                        
                        
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                            Ver detalles
                          </span>
                          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
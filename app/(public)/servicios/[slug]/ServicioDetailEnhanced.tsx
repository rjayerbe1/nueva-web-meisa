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
  ChevronDown
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
  capacidades: string[]
  tecnologias?: TecnologiaItem[]
  equipamiento?: EquipamientoItem[]
  equipos?: string[]
  certificaciones?: CertificacionItem[]
  metodologia?: MetodologiaFase[]
  normativas?: string[]
  seguridad?: string[]
  ventajas?: string[]
  expertise: { titulo: string; descripcion: string }
  imagen: string
  icono: string
  color: string
  bgGradient: string
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
    { id: 'capacidades', label: 'Capacidades', icon: Target },
    { id: 'tecnologia', label: 'Tecnología', icon: Zap },
    { id: 'equipamiento', label: 'Equipamiento', icon: Wrench },
    { id: 'metodologia', label: 'Metodología', icon: FileCheck },
    { id: 'certificaciones', label: 'Certificaciones', icon: Award },
    { id: 'normativas', label: 'Normativas', icon: Shield },
    { id: 'seguridad', label: 'Seguridad', icon: HardHat },
    { id: 'ventajas', label: 'Ventajas', icon: TrendingUp }
  ]

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
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
      const offset = 100
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

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            {sections.map((section) => {
              const SectionIcon = section.icon
              const isActive = activeSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive 
                      ? `${colors.bg} ${colors.text} shadow-lg scale-105` 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <SectionIcon className="w-4 h-4" />
                  {section.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

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
                Descripción General del Servicio
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
                      src={servicio.imagen}
                      alt={`${servicio.titulo} 1`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={servicio.imagen}
                      alt={`${servicio.titulo} 2`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={servicio.imagen}
                      alt={`${servicio.titulo} 3`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={servicio.imagen}
                      alt={`${servicio.titulo} 4`}
                      fill
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

      {/* Capacidades Section */}
      <section id="capacidades" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestras Capacidades
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contamos con las capacidades técnicas y operativas para ejecutar proyectos de cualquier envergadura
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicio.capacidades.map((capacidad, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 group-hover:border-blue-200">
                  <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <CheckCircle2 className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Capacidad {idx + 1}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {capacidad}
                  </p>
                </div>
              </motion.div>
            ))}
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
                        {typeof tech === 'string' ? tech : tech.nombre}
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
                        {typeof equipo === 'string' ? equipo : equipo.nombre}
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

      {/* Metodología Section */}
      {servicio.metodologia && servicio.metodologia.length > 0 && (
        <section id="metodologia" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Metodología de Trabajo
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Proceso estructurado y probado para garantizar el éxito de cada proyecto
              </p>
            </motion.div>

            <div className="relative">
              {servicio.metodologia.map((fase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-8 mb-12 ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Timeline line */}
                  {idx < servicio.metodologia!.length - 1 && (
                    <div className="absolute left-1/2 top-12 bottom-0 w-0.5 bg-gray-300" />
                  )}
                  
                  <div className={`w-full max-w-xl ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 ${idx % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                      <div className={`flex items-center gap-4 mb-4 ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {typeof fase === 'string' ? `Fase ${idx + 1}` : fase.fase}
                        </h3>
                        <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center text-white font-bold`}>
                          {idx + 1}
                        </div>
                      </div>
                      
                      {typeof fase !== 'string' && (
                        <>
                          {fase.actividades && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-700 mb-2">Actividades:</h4>
                              <ul className={`space-y-2 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                {fase.actividades.map((actividad, actIdx) => (
                                  <li key={actIdx} className="text-gray-600">
                                    {actividad}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {fase.duracion && (
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Duración: {fase.duracion}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certificaciones Section */}
      {servicio.certificaciones && servicio.certificaciones.length > 0 && (
        <section id="certificaciones" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Certificaciones y Acreditaciones
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Respaldo de calidad y cumplimiento de los más altos estándares
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicio.certificaciones.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 text-center"
                >
                  <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Award className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {typeof cert === 'string' ? cert : cert.nombre}
                  </h4>
                  {typeof cert !== 'string' && (
                    <>
                      {cert.entidad && (
                        <p className="text-sm text-gray-600 mb-1">{cert.entidad}</p>
                      )}
                      {cert.vigencia && (
                        <p className="text-xs text-gray-500">Vigente hasta: {cert.vigencia}</p>
                      )}
                    </>
                  )}
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

      {/* Seguridad Section */}
      {servicio.seguridad && servicio.seguridad.length > 0 && (
        <section id="seguridad" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Protocolos de Seguridad
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                La seguridad es nuestra prioridad en cada fase del proyecto
              </p>
            </motion.div>

            <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicio.seguridad.map((protocolo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <HardHat className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-gray-700">{protocolo}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ventajas Section */}
      {servicio.ventajas && servicio.ventajas.length > 0 && (
        <section id="ventajas" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ventajas Competitivas
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Lo que nos diferencia y garantiza el éxito de tu proyecto
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {servicio.ventajas.map((ventaja, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-${servicio.color}-200`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <TrendingUp className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          Ventaja {idx + 1}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {ventaja}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced CTA Section */}
      <section className={`py-24 bg-gradient-to-br ${servicio.bgGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">
              ¿Listo para transformar tu proyecto?
            </h2>
            <p className="text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
              Nuestro equipo de expertos está preparado para hacer realidad tu visión con la más alta calidad y profesionalismo
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-3 bg-white text-slate-900 hover:bg-white/90 font-bold py-6 px-12 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 text-lg"
              >
                <Briefcase className="w-6 h-6" />
                Iniciar mi Proyecto
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href={`https://wa.me/573108765432?text=Hola,%20estoy%20interesado%20en%20el%20servicio%20de%20${encodeURIComponent(servicio.titulo)}`}
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 text-lg"
              >
                <MessageSquare className="w-6 h-6" />
                Contactar por WhatsApp
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-white/80">
                <CheckCircle2 className="w-6 h-6" />
                <span>Respuesta en 24 horas</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/80">
                <Shield className="w-6 h-6" />
                <span>Garantía de calidad</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/80">
                <Users className="w-6 h-6" />
                <span>Equipo certificado</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Services */}
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Servicios Relacionados
              </h2>
              <p className="text-xl text-gray-600">
                Soluciones integrales para tu proyecto
              </p>
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
                      <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer h-full">
                        <div className={`w-20 h-20 ${otherColors.bg} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto`}>
                          <OtroIcon className={`w-10 h-10 ${otherColors.text}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors text-center">
                          {otroServicio.titulo}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-3 text-center">
                          {otroServicio.descripcion}
                        </p>
                        <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                          Explorar servicio
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
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
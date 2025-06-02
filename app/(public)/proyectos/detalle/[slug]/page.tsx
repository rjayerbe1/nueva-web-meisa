'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Calendar, Building, Award, Settings, ExternalLink, Phone, Mail, Star, Clock, Ruler, Weight, Share2, Eye, X, ChevronLeft, ChevronRight, ZoomIn, Target, Lightbulb, TrendingUp, Users, Quote, CheckCircle, Play, BarChart3, Wrench, Users2, Trophy, BookOpen, FileText, Camera, Video, Download } from 'lucide-react'

interface Proyecto {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  cliente: string
  ubicacion: string
  slug: string
  fechaInicio: string
  fechaFin: string | null
  estado: string
  destacado: boolean
  toneladas: string | null
  areaTotal: string | null
  tags: string[]
  presupuesto: number | null
  moneda: string
  imagenes: Array<{
    id: string
    url: string
    urlOptimized: string | null
    alt: string
    titulo: string | null
    descripcion: string | null
    orden: number
    tipo: string
  }>
  historia?: {
    id: string
    tituloAlternativo: string | null
    resumenCorto: string | null
    contexto: string | null
    problemasIniciales: string | null
    desafios: any
    enfoque: string | null
    solucionTecnica: string | null
    innovaciones: any
    metodologia: string | null
    tiempoTotal: string | null
    resultados: any
    impactoCliente: string | null
    valorAgregado: string | null
    testimonioCliente: string | null
    testimonioEquipo: string | null
    dificultadTecnica: number | null
    innovacionNivel: number | null
    tagsTecnicos: any
    imagenDestacada: string | null
    imagenDesafio: string | null
    imagenSolucion: string | null
    imagenResultado: string | null
    imagenesGaleria: any
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(0)

  useEffect(() => {
    const slug = params.slug as string
    
    if (!slug) return

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/by-slug/${slug}`)
        
        if (!response.ok) {
          throw new Error('Proyecto no encontrado')
        }
        
        const projectData = await response.json()
        setProyecto(projectData)
      } catch (error) {
        console.error('Error fetching project:', error)
        setError('Error al cargar el proyecto')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.slug])

  // Lightbox functions
  const openLightbox = (imageIndex: number) => {
    setLightboxImage(imageIndex)
    setIsLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    if (!proyecto) return
    setLightboxImage((prev) => (prev + 1) % proyecto.imagenes.length)
  }

  const prevImage = () => {
    if (!proyecto) return
    setLightboxImage((prev) => (prev - 1 + proyecto.imagenes.length) % proyecto.imagenes.length)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!proyecto) return
      
      if (isLightboxOpen) {
        switch (e.key) {
          case 'Escape':
            e.preventDefault()
            closeLightbox()
            break
          case 'ArrowLeft':
            e.preventDefault()
            prevImage()
            break
          case 'ArrowRight':
            e.preventDefault()
            nextImage()
            break
        }
      } else {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault()
            setSelectedImage((prev) => (prev - 1 + proyecto.imagenes.length) % proyecto.imagenes.length)
            break
          case 'ArrowRight':
            e.preventDefault()
            setSelectedImage((prev) => (prev + 1) % proyecto.imagenes.length)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isLightboxOpen, proyecto, lightboxImage, selectedImage])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    )
  }

  if (error || !proyecto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Proyecto no encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'El proyecto solicitado no existe'}</p>
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a proyectos
          </Link>
        </div>
      </div>
    )
  }

  // Parse historia data for easier use
  const hasHistoria = !!proyecto.historia
  const desafios = hasHistoria && Array.isArray(proyecto.historia?.desafios) ? proyecto.historia.desafios : []
  const innovaciones = hasHistoria && Array.isArray(proyecto.historia?.innovaciones) ? proyecto.historia.innovaciones : []
  const resultados = hasHistoria && Array.isArray(proyecto.historia?.resultados) ? proyecto.historia.resultados : []
  const tagsTecnicos = hasHistoria && Array.isArray(proyecto.historia?.tagsTecnicos) ? proyecto.historia.tagsTecnicos : []
  const equipoEspecialista = hasHistoria && Array.isArray(proyecto.historia?.equipoEspecialista) ? proyecto.historia.equipoEspecialista : []
  const fasesEjecucion = hasHistoria && Array.isArray(proyecto.historia?.fasesEjecucion) ? proyecto.historia.fasesEjecucion : []
  const recursos = hasHistoria && Array.isArray(proyecto.historia?.recursos) ? proyecto.historia.recursos : []
  const reconocimientos = hasHistoria && Array.isArray(proyecto.historia?.reconocimientos) ? proyecto.historia.reconocimientos : []
  const infografias = hasHistoria && Array.isArray(proyecto.historia?.infografias) ? proyecto.historia.infografias : []
  const datosInteres = hasHistoria && proyecto.historia?.datosInteres ? proyecto.historia.datosInteres : {}

  // Helper function to find image by ID
  const findImageById = (imageId: string | null) => {
    if (!imageId || !proyecto.imagenes) return null
    return proyecto.imagenes.find(img => img.id === imageId)
  }

  // Get selected images for each section
  const imagenDesafio = hasHistoria ? findImageById(proyecto.historia?.imagenDesafio) : null
  const imagenSolucion = hasHistoria ? findImageById(proyecto.historia?.imagenSolucion) : null
  const imagenResultado = hasHistoria ? findImageById(proyecto.historia?.imagenResultado) : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Adaptado según si tiene historia */}
      <section className={`relative text-white overflow-hidden ${
        hasHistoria 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900' 
          : 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900'
      }`}>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-300 transition-colors">
                  Inicio
                </Link>
              </li>
              <li className="text-white/60">/</li>
              <li>
                <Link href="/proyectos" className="hover:text-blue-300 transition-colors">
                  Proyectos
                </Link>
              </li>
              <li className="text-white/60">/</li>
              <li className="text-white/80">{proyecto.titulo}</li>
            </ol>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Project Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                {/* Badges - Historia o Estado */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {hasHistoria && (
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      <Award className="w-4 h-4 mr-2" />
                      Caso de Éxito MEISA
                    </div>
                  )}
                  
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    proyecto.estado === 'COMPLETADO' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : proyecto.estado === 'EN_PROGRESO'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                    {proyecto.estado === 'COMPLETADO' ? '✓ Completado' : 
                     proyecto.estado === 'EN_PROGRESO' ? '⚡ En Progreso' : 
                     proyecto.estado}
                  </div>

                  {proyecto.destacado && (
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                      <Star className="w-4 h-4 mr-2" />
                      Destacado
                    </div>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {hasHistoria && proyecto.historia?.tituloAlternativo 
                    ? proyecto.historia.tituloAlternativo 
                    : proyecto.titulo}
                </h1>
                
                <p className="text-xl text-blue-100 leading-relaxed">
                  {hasHistoria && proyecto.historia?.resumenCorto 
                    ? proyecto.historia.resumenCorto 
                    : proyecto.descripcion}
                </p>
              </motion.div>

              {/* Enhanced Stats con métricas de historia si está disponible */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`grid gap-4 ${
                  hasHistoria && (proyecto.historia?.dificultadTecnica || proyecto.historia?.innovacionNivel)
                    ? 'grid-cols-2 md:grid-cols-3' 
                    : 'grid-cols-2 md:grid-cols-4'
                }`}
              >
                {/* Métricas de Historia (si está disponible) */}
                {hasHistoria && proyecto.historia?.dificultadTecnica && (
                  <div className="rounded-xl p-4 text-center border border-slate-500/30 bg-slate-800/50 shadow-lg">
                    <Target className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{proyecto.historia.dificultadTecnica}/10</div>
                    <div className="text-xs text-blue-100">Complejidad</div>
                  </div>
                )}

                {hasHistoria && proyecto.historia?.innovacionNivel && (
                  <div className="rounded-xl p-4 text-center border border-slate-500/30 bg-slate-800/50 shadow-lg">
                    <Lightbulb className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{proyecto.historia.innovacionNivel}/10</div>
                    <div className="text-xs text-blue-100">Innovación</div>
                  </div>
                )}

                {/* Métricas tradicionales */}
                <div className="rounded-xl p-4 text-center border border-slate-500/30 bg-slate-800/50 shadow-lg">
                  <Calendar className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {proyecto.fechaInicio ? new Date(proyecto.fechaInicio).getFullYear() : '-'}
                  </div>
                  <div className="text-xs text-blue-100">Año</div>
                </div>
                
                {proyecto.toneladas && (
                  <div className="rounded-xl p-4 text-center border border-slate-500/30 bg-slate-800/50 shadow-lg">
                    <Weight className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{proyecto.toneladas}</div>
                    <div className="text-xs text-blue-100">Toneladas</div>
                  </div>
                )}
                
                {proyecto.areaTotal && (
                  <div className="rounded-xl p-4 text-center border border-slate-500/30 bg-slate-800/50 shadow-lg">
                    <Ruler className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{proyecto.areaTotal}</div>
                    <div className="text-xs text-blue-100">m² área</div>
                  </div>
                )}
                
                {proyecto.fechaFin && (
                  <div className="rounded-xl p-4 text-center border border-slate-500/30 bg-slate-800/50 shadow-lg">
                    <Clock className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {Math.round((new Date(proyecto.fechaFin).getTime() - new Date(proyecto.fechaInicio).getTime()) / (1000 * 60 * 60 * 24 * 30))}
                    </div>
                    <div className="text-xs text-blue-100">Meses</div>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-4 mt-8"
              >
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all duration-300 border border-slate-500/50 shadow-lg">
                  <Share2 className="w-4 h-4" />
                  Compartir proyecto
                </button>
                
                <Link 
                  href="/contacto"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Solicitar información
                </Link>
              </motion.div>
            </div>

            {/* Image Slider - Más compacto */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative h-80 lg:h-96">
                <div 
                  className="relative h-full rounded-3xl overflow-hidden shadow-2xl cursor-pointer group transform-gpu transition-all duration-700 hover:scale-[1.02] border border-slate-500/30"
                  onClick={() => openLightbox(selectedImage)}
                  style={{
                    background: 'linear-gradient(145deg, rgba(71, 85, 105, 0.8) 0%, rgba(51, 65, 85, 0.9) 50%, rgba(30, 41, 59, 0.8) 100%)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {proyecto.imagenes[selectedImage] ? (
                    <Image
                      src={proyecto.imagenes[selectedImage].urlOptimized || proyecto.imagenes[selectedImage].url}
                      alt={proyecto.imagenes[selectedImage].alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
                      <Building className="w-24 h-24 text-white/50" />
                    </div>
                  )}
                  
                  {/* Hover Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center shadow-xl border-2 border-slate-400/50">
                        <ZoomIn className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-semibold bg-slate-800/90 px-6 py-3 rounded-full shadow-xl border border-slate-500/50">Ver en alta resolución</p>
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="absolute bottom-6 right-6 bg-slate-800/90 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-500/50 shadow-lg">
                    {selectedImage + 1} / {proyecto.imagenes.length}
                  </div>

                  {/* Navigation Arrows */}
                  {proyecto.imagenes.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedImage((prev) => (prev - 1 + proyecto.imagenes.length) % proyecto.imagenes.length)
                        }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-400/50 shadow-xl z-10"
                        type="button"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedImage((prev) => (prev + 1) % proyecto.imagenes.length)
                        }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-400/50 shadow-xl z-10"
                        type="button"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery - Solo si hay múltiples imágenes */}
              {proyecto.imagenes.length > 1 && (
                <div className="mt-6">
                  <div className="relative bg-slate-800/40 rounded-2xl p-4 border border-slate-500/30 shadow-xl">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {proyecto.imagenes.map((imagen, index) => (
                        <motion.button
                          key={imagen.id}
                          onClick={() => setSelectedImage(index)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-500 ${
                            selectedImage === index 
                              ? 'ring-2 ring-blue-500 scale-105 shadow-xl' 
                              : 'hover:shadow-lg opacity-80 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={imagen.urlOptimized || imagen.url}
                            alt={imagen.alt}
                            fill
                            className="object-cover"
                          />
                          {selectedImage === index && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Historia Completa Integrada o Información Tradicional */}
      {hasHistoria ? (
        /* Historia Completa en 3 Actos */
        <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header de Historia */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                Historia de Éxito MEISA
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Cómo MEISA Transformó Este Desafío en Éxito
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                La historia completa del proyecto desde el desafío inicial hasta los resultados excepcionales.
              </p>
            </motion.div>

            {/* Historia de Éxito en 3 Actos - Diseño Premium */}
            <div className="space-y-12">
              {/* Timeline Visual */}
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-slate-300 via-blue-500 to-slate-300 rounded-full"></div>
                
                <div className="space-y-16">
                  {/* 1. EL DESAFÍO */}
                  {(proyecto.historia?.contexto || desafios.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                    >
                      {/* Número del acto */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10">
                        <span className="text-white font-bold text-xl">01</span>
                      </div>
                      
                      {/* Contenido */}
                      <div className="lg:pr-8">
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 shadow-xl border border-slate-200">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <Target className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900">El Desafío</h3>
                              <p className="text-red-600 font-medium">Problemas complejos a resolver</p>
                            </div>
                          </div>
                          
                          {proyecto.historia?.contexto && (
                            <div className="mb-6">
                              <p className="text-slate-700 leading-relaxed text-lg">{proyecto.historia.contexto}</p>
                            </div>
                          )}
                          
                          {desafios.length > 0 && (
                            <div>
                              <h4 className="font-bold text-slate-900 mb-4 text-lg">Desafíos específicos:</h4>
                              <div className="space-y-3">
                                {desafios.map((desafio: string, index: number) => (
                                  <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-red-100">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-slate-800 font-medium">{desafio}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Imagen contextual del proyecto */}
                      <div className="hidden lg:block pl-8">
                        {imagenDesafio ? (
                          <div className="h-80 rounded-3xl shadow-2xl overflow-hidden relative group">
                            <Image
                              src={imagenDesafio.urlOptimized || imagenDesafio.url}
                              alt={imagenDesafio.alt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                              <p className="font-bold text-xl mb-2">Situación Inicial</p>
                              <p className="text-white/80 text-sm">Estado previo al proyecto</p>
                            </div>
                          </div>
                        ) : proyecto.imagenes && proyecto.imagenes.length > 1 ? (
                          <div className="h-80 rounded-3xl shadow-2xl overflow-hidden relative group">
                            <Image
                              src={proyecto.imagenes[1].urlOptimized || proyecto.imagenes[1].url}
                              alt={proyecto.imagenes[1].alt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                              <p className="font-bold text-xl mb-2">Situación Inicial</p>
                              <p className="text-white/80 text-sm">Estado previo al proyecto</p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl flex items-center justify-center">
                            <div className="text-center text-white/80">
                              <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Building className="w-12 h-12" />
                              </div>
                              <p className="font-bold text-xl">Desafío Estructural</p>
                              <p className="text-white/60">Análisis de problemas</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* 2. LA SOLUCIÓN */}
                  {(proyecto.historia?.enfoque || innovaciones.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                    >
                      {/* Número del acto */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10">
                        <span className="text-white font-bold text-xl">02</span>
                      </div>
                      
                      {/* Imagen contextual del proceso - Izquierda en desktop */}
                      <div className="hidden lg:block pr-8 order-1 lg:order-none">
                        {imagenSolucion ? (
                          <div className="h-80 rounded-3xl shadow-2xl overflow-hidden relative group">
                            <Image
                              src={imagenSolucion.urlOptimized || imagenSolucion.url}
                              alt={imagenSolucion.alt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/30 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                              <p className="font-bold text-xl mb-2">Proceso MEISA</p>
                              <p className="text-blue-100 text-sm">Solución en desarrollo</p>
                            </div>
                          </div>
                        ) : proyecto.imagenes && proyecto.imagenes.length > 2 ? (
                          <div className="h-80 rounded-3xl shadow-2xl overflow-hidden relative group">
                            <Image
                              src={proyecto.imagenes[2].urlOptimized || proyecto.imagenes[2].url}
                              alt={proyecto.imagenes[2].alt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/30 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                              <p className="font-bold text-xl mb-2">Proceso MEISA</p>
                              <p className="text-blue-100 text-sm">Solución en desarrollo</p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-80 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-2xl flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Lightbulb className="w-12 h-12" />
                              </div>
                              <p className="font-bold text-xl">Solución MEISA</p>
                              <p className="text-blue-100">Ingeniería avanzada</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Contenido */}
                      <div className="lg:pl-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 shadow-xl border border-blue-200">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                              <Lightbulb className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900">La Solución</h3>
                              <p className="text-blue-600 font-medium">Enfoque técnico MEISA</p>
                            </div>
                          </div>
                          
                          {proyecto.historia?.enfoque && (
                            <div className="mb-6">
                              <p className="text-slate-700 leading-relaxed text-lg">{proyecto.historia.enfoque}</p>
                            </div>
                          )}
                          
                          {innovaciones.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-bold text-slate-900 mb-4 text-lg">Innovaciones aplicadas:</h4>
                              <div className="space-y-3">
                                {innovaciones.map((innovacion: string, index: number) => (
                                  <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-slate-800 font-medium">{innovacion}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {proyecto.historia?.tiempoTotal && (
                            <div className="pt-4 border-t border-blue-200">
                              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="font-bold text-slate-900">Tiempo total: {proyecto.historia.tiempoTotal}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 3. EL RESULTADO */}
                  {(resultados.length > 0 || proyecto.historia?.impactoCliente) && (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                    >
                      {/* Número del acto */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10">
                        <span className="text-white font-bold text-xl">03</span>
                      </div>
                      
                      {/* Contenido */}
                      <div className="lg:pr-8">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 shadow-xl border border-green-200">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                              <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900">Los Resultados</h3>
                              <p className="text-green-600 font-medium">Éxito comprobado</p>
                            </div>
                          </div>
                          
                          {resultados.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-bold text-slate-900 mb-4 text-lg">Logros específicos:</h4>
                              <div className="space-y-3">
                                {resultados.map((resultado: string, index: number) => (
                                  <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-green-100">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-800 font-medium">{resultado}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {proyecto.historia?.impactoCliente && (
                            <div className="pt-4 border-t border-green-200">
                              <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-slate-700 leading-relaxed text-lg font-medium">{proyecto.historia.impactoCliente}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Imagen del resultado final */}
                      <div className="hidden lg:block pl-8">
                        {imagenResultado ? (
                          <div className="h-80 rounded-3xl shadow-2xl overflow-hidden relative group">
                            <Image
                              src={imagenResultado.urlOptimized || imagenResultado.url}
                              alt={imagenResultado.alt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/30 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                              <p className="font-bold text-xl mb-2">Resultado Final</p>
                              <p className="text-green-100 text-sm">Proyecto completado</p>
                            </div>
                          </div>
                        ) : proyecto.imagenes && proyecto.imagenes.length > 0 ? (
                          <div className="h-80 rounded-3xl shadow-2xl overflow-hidden relative group">
                            <Image
                              src={proyecto.imagenes[0].urlOptimized || proyecto.imagenes[0].url}
                              alt={proyecto.imagenes[0].alt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/30 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                              <p className="font-bold text-xl mb-2">Resultado Final</p>
                              <p className="text-green-100 text-sm">Proyecto completado</p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-80 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl shadow-2xl flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Award className="w-12 h-12" />
                              </div>
                              <p className="font-bold text-xl">Resultados</p>
                              <p className="text-green-100">Éxito verificado</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Secciones Adicionales de Información Rica */}
            
            {/* Video Explicativo */}
            {proyecto.historia?.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mb-16"
              >
                <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Video del Proyecto</h3>
                      <p className="text-blue-200">Conoce el proyecto en detalle</p>
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
                    <iframe
                      src={proyecto.historia.videoUrl}
                      className="w-full h-full"
                      allowFullScreen
                      title={`Video de ${proyecto.titulo}`}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Datos Técnicos de Interés */}
            {Object.keys(datosInteres).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mb-16"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Especificaciones Técnicas</h3>
                      <p className="text-slate-600">Datos técnicos destacados del proyecto</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(datosInteres).map(([key, value], index) => (
                      <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-slate-900 mb-2">{String(value)}</div>
                          <div className="text-sm font-medium text-slate-600 capitalize">
                            {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Timeline de Ejecución */}
            {fasesEjecucion.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="mb-16"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Timeline de Ejecución</h3>
                      <p className="text-slate-600">Fases del proyecto y cronograma</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {fasesEjecucion.map((fase: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-slate-900">{fase.fase || fase.name || 'Fase'}</h4>
                            {fase.duracion && (
                              <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {fase.duracion}
                              </span>
                            )}
                          </div>
                          {fase.descripcion && (
                            <p className="text-slate-700">{fase.descripcion}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Equipo Especialista */}
            {equipoEspecialista.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="mb-16"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Equipo Especialista</h3>
                      <p className="text-slate-600">Profesionales asignados al proyecto</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {equipoEspecialista.map((miembro: any, index: number) => (
                      <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="font-bold text-slate-900 mb-2">{miembro.rol || miembro.name}</h4>
                          {miembro.experiencia && (
                            <p className="text-green-700 text-sm font-medium">{miembro.experiencia}</p>
                          )}
                          {miembro.especialidad && (
                            <p className="text-slate-600 text-sm mt-1">{miembro.especialidad}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recursos Utilizados */}
            {recursos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mb-16"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Wrench className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Recursos Especializados</h3>
                      <p className="text-slate-600">Equipos y recursos utilizados</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recursos.map((recurso: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                        <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <span className="text-slate-800 font-medium">{recurso}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reconocimientos y Premios */}
            {reconocimientos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="mb-16"
              >
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-8 shadow-xl border border-yellow-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Reconocimientos</h3>
                      <p className="text-amber-700">Premios y certificaciones obtenidas</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reconocimientos.map((reconocimiento: any, index: number) => (
                      <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-2">
                              {reconocimiento.titulo || reconocimiento.name || 'Reconocimiento'}
                            </h4>
                            {reconocimiento.descripcion && (
                              <p className="text-slate-700 text-sm mb-2">{reconocimiento.descripcion}</p>
                            )}
                            {reconocimiento.entidad && (
                              <p className="text-amber-700 text-sm font-medium">Otorgado por: {reconocimiento.entidad}</p>
                            )}
                            {reconocimiento.fecha && (
                              <p className="text-slate-500 text-xs mt-1">{reconocimiento.fecha}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Lecciones Aprendidas */}
            {proyecto.historia?.leccionesAprendidas && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="mb-16"
              >
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 shadow-xl border border-purple-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Lecciones Aprendidas</h3>
                      <p className="text-purple-700">Conocimientos valiosos del proyecto</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <p className="text-slate-700 leading-relaxed text-lg">{proyecto.historia.leccionesAprendidas}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Infografías */}
            {infografias.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="mb-16"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Infografías y Documentos</h3>
                      <p className="text-slate-600">Material técnico adicional</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {infografias.map((infografia: string, index: number) => (
                      <div key={index} className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                          <a 
                            href={infografia}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Ver Infografía {index + 1}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Valor Agregado MEISA */}
            {proyecto.historia?.valorAgregado && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="mb-16"
              >
                <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-8 shadow-2xl text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">El Valor Único de MEISA</h3>
                      <p className="text-blue-200">Lo que nos diferencia del resto</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <p className="text-lg leading-relaxed text-blue-100">{proyecto.historia.valorAgregado}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Testimonios si están disponibles */}
            {(proyecto.historia?.testimonioCliente || proyecto.historia?.testimonioEquipo) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.7 }}
                className="mb-16"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Testimonios</h3>
                    <p className="text-slate-600">Lo que dicen nuestros clientes y equipo</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {proyecto.historia?.testimonioCliente && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 relative">
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <Quote className="w-6 h-6 text-white" />
                        </div>
                        <div className="pt-4">
                          <div className="mb-4">
                            <h4 className="font-bold text-slate-900 text-lg">Testimonio del Cliente</h4>
                            <p className="text-blue-700 font-medium">{proyecto.cliente}</p>
                          </div>
                          <blockquote className="text-slate-700 text-lg italic leading-relaxed">
                            "{proyecto.historia.testimonioCliente}"
                          </blockquote>
                        </div>
                      </div>
                    )}
                    
                    {proyecto.historia?.testimonioEquipo && (
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 relative">
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="pt-4">
                          <div className="mb-4">
                            <h4 className="font-bold text-slate-900 text-lg">Testimonio del Equipo</h4>
                            <p className="text-slate-700 font-medium">Equipo MEISA</p>
                          </div>
                          <blockquote className="text-slate-700 text-lg italic leading-relaxed">
                            "{proyecto.historia.testimonioEquipo}"
                          </blockquote>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Galería Visual del Proyecto */}
            {proyecto.imagenes && proyecto.imagenes.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.7 }}
                className="mb-16"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Galería Visual del Proyecto</h3>
                      <p className="text-slate-600">Progreso y detalles técnicos del desarrollo</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proyecto.imagenes.slice(3).map((imagen, index) => (
                      <motion.div 
                        key={imagen.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.8 + (index * 0.1) }}
                        className="relative group cursor-pointer"
                        onClick={() => openLightbox(index + 3)}
                      >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                          <Image
                            src={imagen.urlOptimized || imagen.url}
                            alt={imagen.alt}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm font-medium">Ver en detalle</p>
                            </div>
                          </div>
                          
                          <div className="absolute top-3 right-3 bg-slate-800/90 text-white px-2 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {index + 4} / {proyecto.imagenes.length}
                          </div>
                        </div>
                        
                        {imagen.titulo && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-slate-900">{imagen.titulo}</p>
                            {imagen.descripcion && (
                              <p className="text-xs text-slate-600 mt-1">{imagen.descripcion}</p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tags Técnicos si están disponibles */}
            {tagsTecnicos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="mb-16"
              >
                <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Especialidades Técnicas Aplicadas</h3>
                    <p className="text-slate-300">Tecnologías y metodologías especializadas de MEISA</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    {tagsTecnicos.map((tag: string, index: number) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1.8 + (index * 0.1) }}
                        className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg border border-slate-500/50 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      ) : (
        /* Información Tradicional del Proyecto - Cuando NO hay historia */
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl shadow-xl p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalles del Proyecto</h2>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {proyecto.descripcion}
                    </p>
                  </div>

                  {/* Tags */}
                  {proyecto.tags && proyecto.tags.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Servicios Incluidos</h3>
                      <div className="flex flex-wrap gap-3">
                        {proyecto.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Image Gallery */}
                {proyecto.imagenes.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      Galería del Proyecto
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {proyecto.imagenes.slice(1).map((imagen, index) => (
                        <motion.div 
                          key={imagen.id} 
                          className="relative group cursor-pointer"
                          onClick={() => openLightbox(index + 1)}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                            <Image
                              src={imagen.urlOptimized || imagen.url}
                              alt={imagen.alt}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm font-medium">Ver imagen completa</p>
                              </div>
                            </div>
                          </div>
                          
                          {imagen.titulo && (
                            <p className="mt-2 text-sm text-gray-600 font-medium">{imagen.titulo}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Project Info Card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Información del Proyecto</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{proyecto.cliente}</p>
                        <p className="text-sm text-gray-500">Cliente</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{proyecto.ubicacion}</p>
                        <p className="text-sm text-gray-500">Ubicación</p>
                      </div>
                    </div>

                    {proyecto.fechaInicio && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {new Date(proyecto.fechaInicio).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long'
                            })}
                            {proyecto.fechaFin && ` - ${new Date(proyecto.fechaFin).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long'
                            })}`}
                          </p>
                          <p className="text-sm text-gray-500">Periodo de construcción</p>
                        </div>
                      </div>
                    )}

                    {proyecto.toneladas && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{proyecto.toneladas} toneladas</p>
                          <p className="text-sm text-gray-500">Estructura metálica</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Contact CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white"
                >
                  <h3 className="text-xl font-bold mb-4">¿Te interesa un proyecto similar?</h3>
                  <p className="text-blue-100 mb-6 text-sm">
                    Contacta con nuestro equipo para conocer cómo podemos ayudarte con tu proyecto de estructuras metálicas.
                  </p>
                  
                  <div className="space-y-3">
                    <Link
                      href="/contacto"
                      className="w-full inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Solicitar Cotización
                    </Link>
                    
                    <a
                      href="tel:+5723120050"
                      className="w-full inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Llamar Ahora
                    </a>
                  </div>
                </motion.div>

                {/* Back Button */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Link
                    href="/proyectos"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Proyectos
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Projects Section */}
      <section className="py-16 bg-gradient-to-br from-gray-100 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {hasHistoria ? 'Más Casos de Éxito' : 'Proyectos Similares'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {hasHistoria 
                ? 'Descubre otras historias de éxito donde MEISA transformó desafíos complejos en resultados excepcionales.'
                : `Explora otros proyectos destacados de ${proyecto.categoria.toLowerCase().replace(/_/g, ' ')} que hemos desarrollado con los más altos estándares de calidad.`
              }
            </p>
          </motion.div>

          <div className="text-center">
            <Link
              href={`/proyectos/categoria/${proyecto.categoria.toLowerCase().replace(/_/g, '-')}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Building className="w-5 h-5" />
              Ver todos los proyectos de {proyecto.categoria.toLowerCase().replace(/_/g, ' ')}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {hasHistoria ? '¿Listo para Tu Próximo Caso de Éxito?' : '¿Tienes un proyecto en mente?'}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {hasHistoria 
                ? 'Con más de 27 años transformando desafíos en éxitos, MEISA está listo para hacer de tu proyecto la próxima historia de éxito.'
                : 'Somos expertos en estructuras metálicas con más de 27 años de experiencia. Convierte tu visión en realidad con la calidad y confianza que nos caracteriza.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5" />
                Solicitar Cotización Gratuita
              </Link>
              
              <a
                href="tel:+5723120050"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Llamar: (2) 312 0050
              </a>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>600 Ton/Mes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>27+ Años</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>3 Plantas</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {isLightboxOpen && proyecto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div 
            className="absolute inset-0 w-full h-full"
            onClick={() => closeLightbox()}
          />
          
          <button
            onClick={() => closeLightbox()}
            className="absolute top-4 right-4 z-60 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute top-4 left-4 z-60 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
            {lightboxImage + 1} / {proyecto.imagenes.length}
          </div>

          {proyecto.imagenes.length > 1 && (
            <>
              <button
                onClick={() => prevImage()}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                type="button"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                onClick={() => nextImage()}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                type="button"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="relative max-w-[90vw] max-h-[90vh] z-10">
            <Image
              src={proyecto.imagenes[lightboxImage].urlOptimized || proyecto.imagenes[lightboxImage].url}
              alt={proyecto.imagenes[lightboxImage].alt}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              priority
            />

            {proyecto.imagenes[lightboxImage].titulo && (
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg text-center max-w-md">
                <p className="font-medium">{proyecto.imagenes[lightboxImage].titulo}</p>
                {proyecto.imagenes[lightboxImage].descripcion && (
                  <p className="text-sm text-gray-300 mt-1">{proyecto.imagenes[lightboxImage].descripcion}</p>
                )}
              </div>
            )}
          </div>

          {proyecto.imagenes.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-3 rounded-full z-20">
              {proyecto.imagenes.map((imagen, index) => (
                <button
                  key={imagen.id}
                  onClick={() => setLightboxImage(index)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                    lightboxImage === index 
                      ? 'ring-2 ring-blue-400 scale-110' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  type="button"
                >
                  <Image
                    src={imagen.urlOptimized || imagen.url}
                    alt={imagen.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg z-20">
            <p>ESC para cerrar • ← → para navegar</p>
          </div>
        </div>
      )}
    </div>
  )
}
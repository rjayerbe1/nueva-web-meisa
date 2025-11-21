'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ExternalLink, Building, Calendar, MapPin, User, BookOpen, ChevronDown, Check, FileBadge } from 'lucide-react'
import { getCategoryIconComponent } from '@/lib/get-category-icon'
import { UnifiedStatsCard } from '@/components/ui/unified-stats-card'
import { CanvasRenderer } from '@/components/brochure/CanvasRenderer'

// Helper para parsear posición desde formato "X,Y"
const parsePosition = (posStr: string | null): { x: number; y: number } => {
  if (!posStr || posStr.includes(' ')) {
    return { x: 0, y: 0 }
  }
  const [x, y] = posStr.split(',').map(v => parseFloat(v) || 0)
  return { x, y }
}

interface Brochure {
  id: string
  titulo: string
  descripcion: string | null
  urlAmigable: string
  thumbnail: string | null
  pdfUrl: string | null
  publicado: boolean
  activo: boolean
  fechaPublicacion: string | null
  totalPages: number
  primeraPagePreview: {
    id: string
    nombre: string
    canvasData: any
    configuracion: any
    orden: number
  } | null
  pages: Array<{
    id: string
    nombre: string
    canvasData: any
    configuracion: any
    orden: number
  }>
}

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
  toneladas: number | null
  areaTotal: number | null
  imagenes: Array<{
    id: string
    url: string
    urlOptimized: string | null
    alt: string
    titulo: string | null
    descripcion: string | null
    orden: number
  }>
}

interface Categoria {
  id: string
  key: string
  nombre: string
  descripcion: string | null
  slug: string
  imagenCover: string | null
  imagenBanner: string | null
  videoBanner: string | null
  usarVideoBanner: boolean
  videoBannerScale: number | null
  videoBannerPosition: string | null
  icono: string | null
  color: string | null
  colorSecundario: string | null
  overlayColor: string | null
  overlayOpacity: number | null
  metaTitle: string | null
  metaDescription: string | null
  // Campos adicionales para contenido ampliado
  descripcionAmpliada: string | null
  beneficios: any | null
  procesoTrabajo: any | null
  estadisticas: any | null
  casosExitoIds: any | null
}

export default function CategoryProjectsPage() {
  const params = useParams()
  const [categoria, setCategoria] = useState<Categoria | null>(null)
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [brochure, setBrochure] = useState<Brochure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  console.log('Component rendered, params:', params)

  const handleDownloadPDF = async () => {
    if (!brochure || downloadingPDF) return

    try {
      setDownloadingPDF(true)

      // Si existe un PDF pregenerado, descargarlo directamente
      if (brochure.pdfUrl && brochure.pdfUrl.trim() !== '') {
        console.log('📥 Descargando PDF pregenerado:', brochure.pdfUrl)

        // Crear un enlace temporal para descargar el archivo
        const link = document.createElement('a')
        link.href = brochure.pdfUrl
        link.download = `${brochure.titulo.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        console.log('✅ PDF descargado exitosamente')
      } else {
        // Si no existe PDF pregenerado, mostrar mensaje
        alert('El PDF aún no ha sido generado. Por favor, contacta al administrador para generar el PDF del brochure.')
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error)
      alert('Error al descargar el PDF')
    } finally {
      setDownloadingPDF(false)
    }
  }

  useEffect(() => {
    const slug = params.slug as string
    console.log('useEffect called with slug:', slug, 'params:', params)
    
    if (!slug) {
      console.log('No slug available yet, returning...')
      return
    }

    const fetchCategoryAndProjects = async () => {
      try {
        console.log('=== STARTING FETCH ===', slug)
        setLoading(true)
        setError(null)
        
        // Fetch category info
        console.log('Fetching category from:', `/api/categories/${slug}`)
        const categoryResponse = await fetch(`/api/categories/${slug}`)
        console.log('Category response status:', categoryResponse.status)
        
        if (!categoryResponse.ok) {
          const errorText = await categoryResponse.text()
          console.log('Category error response:', errorText)
          throw new Error('Categoría no encontrada')
        }
        
        const categoryData = await categoryResponse.json()
        console.log('Category data received:', categoryData)
        setCategoria(categoryData)

        // Fetch projects for this category
        console.log('Fetching projects for key:', categoryData.key)
        const projectsResponse = await fetch(`/api/projects/by-category/${categoryData.key}`)
        console.log('Projects response status:', projectsResponse.status)
        
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          console.log('Projects data received, length:', projectsData.length)
          setProyectos(projectsData)
        } else {
          console.log('Projects fetch failed, but continuing...')
          setProyectos([])
        }

        // Fetch brochure for this category
        console.log('Fetching brochure for category id:', categoryData.id)
        try {
          const brochureResponse = await fetch(`/api/brochures/by-category/${categoryData.id}`)
          if (brochureResponse.ok) {
            const brochureData = await brochureResponse.json()
            console.log('Brochure data received:', brochureData)
            setBrochure(brochureData)
          } else {
            console.log('No brochure found for this category')
            setBrochure(null)
          }
        } catch (brochureError) {
          console.log('Error fetching brochure, but continuing...', brochureError)
          setBrochure(null)
        }

        console.log('=== FETCH COMPLETED SUCCESSFULLY ===')
      } catch (error) {
        console.error('=== ERROR IN FETCH ===', error)
        setError('Error al cargar la información de la categoría')
      } finally {
        console.log('=== SETTING LOADING FALSE ===')
        setLoading(false)
      }
    }

    fetchCategoryAndProjects()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando categoría...</p>
        </div>
      </div>
    )
  }

  if (error || !categoria) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoría no encontrada</h1>
          <p className="text-gray-600 mb-6">{error || 'La categoría solicitada no existe'}</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - 1 Pantalla (100vh) */}
      <section className="relative h-screen overflow-hidden">
        {/* Background - Video o Imagen de fondo */}
        {(categoria.videoBanner || categoria.imagenBanner || categoria.imagenCover) && (
          <div className="absolute inset-0">
            {(categoria.usarVideoBanner && categoria.videoBanner) ? (
              <video
                src={categoria.videoBanner}
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  transform: `translate(${parsePosition(categoria.videoBannerPosition).x}%, ${parsePosition(categoria.videoBannerPosition).y}%) scale(${categoria.videoBannerScale || 1.0})`,
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d',
                  WebkitFontSmoothing: 'antialiased',
                  imageRendering: 'crisp-edges'
                }}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={categoria.imagenBanner || categoria.imagenCover || ''}
                alt={`Banner de ${categoria.nombre}`}
                className="w-full h-full object-cover"
              />
            )}
            {/* Overlay con gradiente oscuro graduado */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          </div>
        )}

        {/* Contenido del Hero - Todo en 100vh */}
        <div className="relative z-10 h-full flex flex-col justify-between px-4 sm:px-6 lg:px-16 xl:px-24 py-8">
          <div className="max-w-6xl w-full mx-auto h-full flex flex-col justify-between">
            {/* SECCIÓN SUPERIOR - Layout 70/30 */}
            <div>
              {/* Breadcrumb - Ancho completo */}
              <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <ol className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                  <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
                  <li>/</li>
                  <li><Link href="/proyectos" className="hover:text-white transition-colors">Proyectos</Link></li>
                  <li>/</li>
                  <li className="text-white/90 font-medium">{categoria.nombre}</li>
                </ol>
              </motion.nav>

              {/* Título principal */}
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase text-white leading-none mb-4"
              >
                {categoria.nombre}
              </motion.h1>

              {/* Descripción ampliada - 100% ancho */}
              {categoria.descripcionAmpliada && (
                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-sm sm:text-base md:text-lg text-white/70 font-lato leading-relaxed italic mb-6 text-justify"
                >
                  {categoria.descripcionAmpliada}
                </motion.p>
              )}

              {/* Toggle Brochure - Debajo de la descripción */}
              {brochure && brochure.publicado && brochure.activo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="max-w-md"
                >
                  {/* Toggle compacto y profesional */}
                  <div className="grid grid-cols-2 gap-0 rounded-lg backdrop-blur-md bg-white/10 border border-white/30 overflow-hidden shadow-lg">
                    {/* Botón Ver Brochure */}
                    <Link
                      href={`/brochure/${brochure.urlAmigable}`}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-white/20 text-white transition-all duration-300 group"
                    >
                      <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-lato font-semibold">Ver Brochure</span>
                    </Link>

                    {/* Divisor vertical */}
                    <div className="absolute left-1/2 top-2 bottom-2 w-px bg-white/30"></div>

                    {/* Botón Descarga Brochure */}
                    <button
                      onClick={handleDownloadPDF}
                      disabled={downloadingPDF}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-white/20 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <FileBadge className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-lato font-semibold">
                        {downloadingPDF ? 'Descargando...' : 'Descarga Brochure'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* SECCIÓN INFERIOR - Icono + Stats + Beneficios + Brochure Compacto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              {/* Icono de categoría centrado */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center mb-4"
                style={{ color: categoria.color || '#3b82f6' }}
              >
                {getCategoryIconComponent(categoria.icono, "w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56")}
              </motion.div>

              {/* Estadísticas - Muy compactas en línea */}
              {categoria.estadisticas && (
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                  {categoria.estadisticas.toneladasTotal && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                      <span className="text-2xl sm:text-3xl font-bebas text-white">{categoria.estadisticas.toneladasTotal.toLocaleString()}</span>
                      <span className="text-white/70 font-lato text-xs uppercase">Ton</span>
                    </div>
                  )}
                  {categoria.estadisticas.proyectosCompletados && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                      <span className="text-2xl sm:text-3xl font-bebas text-white">{categoria.estadisticas.proyectosCompletados}+</span>
                      <span className="text-white/70 font-lato text-xs uppercase">Proyectos</span>
                    </div>
                  )}
                </div>
              )}

              {/* Beneficios - Ocupan todo el ancho del hero */}
              {categoria.beneficios && categoria.beneficios.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
                  {categoria.beneficios.map((beneficio: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 flex-1 min-w-[200px]">
                      <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-white/90 font-lato text-xs sm:text-sm">{beneficio.length > 80 ? beneficio.substring(0, 80) + '...' : beneficio}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>


      {/* Proyectos - Estilo ProjectCategoriesSection */}
      <section className="bg-gray-900">
        {proyectos.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 opacity-50">
                {getCategoryIconComponent(categoria.icono, "w-24 h-24 text-white")}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No hay proyectos disponibles
              </h3>
              <p className="text-gray-400 mb-6">
                Actualmente no tenemos proyectos publicados en esta categoría.
              </p>
              <Link
                href="/proyectos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Ver todos los proyectos
              </Link>
            </motion.div>
          </div>
        ) : (() => {
          // Obtener IDs de proyectos destacados
          const proyectosDestacadosIds: string[] = categoria.casosExitoIds && categoria.casosExitoIds.length > 0
            ? categoria.casosExitoIds
            : []

          // Ordenar proyectos: destacados primero, luego el resto
          const proyectosOrdenados = [...proyectos].sort((a, b) => {
            const aEsDestacado = proyectosDestacadosIds.includes(a.id)
            const bEsDestacado = proyectosDestacadosIds.includes(b.id)
            if (aEsDestacado && !bEsDestacado) return -1
            if (!aEsDestacado && bEsDestacado) return 1
            return 0
          })

          return (
            <>
              {/* Grid de proyectos estilo ProjectCategoriesSection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {proyectosOrdenados.map((proyecto, index) => {
                  const esDestacado = proyectosDestacadosIds.includes(proyecto.id)

                  return (
                    <Link
                      key={proyecto.id}
                      href={`/proyectos/detalle/${proyecto.slug}`}
                      className="group block"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="relative h-[60vh] lg:h-[70vh] overflow-hidden"
                      >
                        {/* Imagen de fondo con hover */}
                        {proyecto.imagenes[0] ? (
                          <div className="absolute inset-0">
                            <Image
                              src={proyecto.imagenes[0].urlOptimized || proyecto.imagenes[0].url}
                              alt={proyecto.imagenes[0].alt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                        )}

                        {/* Overlay oscuro */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

                        {/* Overlay hover azul */}
                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-500" />

                        {/* Contenido - Centrado */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-8 text-center">

                          {/* Badge destacado */}
                          {esDestacado && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                              viewport={{ once: true }}
                              className="mb-6 bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-lato font-bold uppercase tracking-wider border border-white/30"
                            >
                              ⭐ Proyecto Destacado
                            </motion.div>
                          )}

                          {/* Título del proyecto */}
                          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bebas uppercase text-white mb-4 drop-shadow-2xl leading-tight">
                            {proyecto.titulo}
                          </h3>

                          {/* Cliente */}
                          <p className="text-lg sm:text-xl text-blue-300 font-lato font-semibold mb-6">
                            {proyecto.cliente}
                          </p>

                          {/* Información adicional */}
                          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-white/80 font-lato">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{proyecto.ubicacion}</span>
                            </div>
                            {proyecto.fechaInicio && (
                              <>
                                <span className="text-white/40">•</span>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(proyecto.fechaInicio).getFullYear()}</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Botón Ver proyecto */}
                          <div className="inline-flex items-center gap-3 group/btn">
                            <span className="text-white font-lato uppercase tracking-wider text-sm lg:text-base font-semibold">
                              Ver Proyecto
                            </span>

                            <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                              <div className="absolute inset-0 rounded-full border-2 border-white/80 group-hover/btn:border-white transition-all duration-300 group-hover/btn:scale-110" />
                              <div className="absolute inset-0 rounded-full bg-white/0 group-hover/btn:bg-white transition-all duration-300" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover/btn:text-blue-600 transition-all duration-300 transform group-hover/btn:translate-x-1" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Línea divisoria inferior */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                      </motion.div>
                    </Link>
                  )
                })}
              </div>

              {/* Back to all categories */}
              <div className="py-16 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href="/proyectos"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-lato font-semibold rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Explorar todas las categorías
                  </Link>
                </motion.div>
              </div>

              </>
            )
          })()}
      </section>
    </div>
  )
}
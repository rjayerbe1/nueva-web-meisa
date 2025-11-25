'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ExternalLink, Building, Calendar, MapPin, User, BookOpen, ChevronDown, FileBadge } from 'lucide-react'
import { getCategoryIconComponent } from '@/lib/get-category-icon'
import { UnifiedStatsCard } from '@/components/ui/unified-stats-card'
import { CanvasRenderer } from '@/components/brochure/CanvasRenderer'
import { EspecialidadesTabs } from '@/components/sections/EspecialidadesTabs'

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
  especialidades: any | null
}

export default function CategoryProjectsPage() {
  const params = useParams()
  const [categoria, setCategoria] = useState<Categoria | null>(null)
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [brochure, setBrochure] = useState<Brochure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [heroBackground, setHeroBackground] = useState<string | null>(null)

  console.log('Component rendered, params:', params)

  // Handler para cambio de especialidad
  const handleEspecialidadChange = (especialidad: any) => {
    if (especialidad?.imagen) {
      setHeroBackground(especialidad.imagen)
    }
  }

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
        {/* Background - Video o Imagen de fondo (dinámico con especialidades) */}
        {(heroBackground || categoria.videoBanner || categoria.imagenBanner || categoria.imagenCover) && (
          <div className="absolute inset-0">
            {/* Imagen de especialidad (si existe) */}
            {heroBackground && (
              <motion.img
                key={heroBackground}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={heroBackground}
                alt="Fondo de especialidad"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {/* Video o imagen de categoría como fallback */}
            {!heroBackground && (
              <>
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
              </>
            )}
            {/* Overlay con gradiente oscuro graduado */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          </div>
        )}

        {/* Contenido del Hero - Todo en 100vh */}
        <div className="relative z-10 h-full flex flex-col py-6">
          {/* SECCIÓN SUPERIOR - Edge to Edge (todo el ancho) */}
          <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <ol className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li>/</li>
                <li><Link href="/proyectos" className="hover:text-white transition-colors">Proyectos</Link></li>
                <li>/</li>
                <li className="text-white/90 font-medium">{categoria.nombre}</li>
              </ol>
            </motion.nav>

            {/* Fila con Título y Extras */}
            <div className="flex items-center gap-3 lg:gap-6 mb-4 lg:mb-6 mobile-landscape-header-section">
              {/* Título principal */}
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bebas uppercase text-white leading-none mobile-landscape-title"
              >
                {categoria.nombre}
              </motion.h1>

              {/* Botones Brochure - Ver y Descargar (pegados al título) */}
              {brochure && brochure.publicado && brochure.activo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex gap-1.5 lg:gap-2 mobile-landscape-brochure-buttons"
                >
                  {/* Ver Brochure */}
                  <Link
                    href={`/brochure/${brochure.urlAmigable}`}
                    className="flex items-center gap-1.5 lg:gap-2 px-2 py-1 lg:px-3 lg:py-1.5 backdrop-blur-md bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 text-white transition-all duration-300"
                  >
                    <BookOpen className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="text-[10px] lg:text-xs font-lato font-semibold">Brochure</span>
                  </Link>

                  {/* Descargar PDF */}
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    className="flex items-center gap-1.5 lg:gap-2 px-2 py-1 lg:px-3 lg:py-1.5 backdrop-blur-md bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileBadge className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="text-[10px] lg:text-xs font-lato font-semibold">
                      {downloadingPDF ? '...' : 'PDF'}
                    </span>
                  </button>
                </motion.div>
              )}

              {/* Estadísticas - Solo desktop, al final */}
              {categoria.estadisticas && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="hidden lg:flex items-center gap-3 ml-auto"
                >
                  {categoria.estadisticas.toneladasTotal && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                      <span className="text-xl font-bebas text-white">{categoria.estadisticas.toneladasTotal.toLocaleString()}</span>
                      <span className="text-white/70 font-lato text-xs uppercase">Ton</span>
                    </div>
                  )}
                  {categoria.estadisticas.proyectosCompletados && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                      <span className="text-xl font-bebas text-white">{categoria.estadisticas.proyectosCompletados}+</span>
                      <span className="text-white/70 font-lato text-xs uppercase">Proy</span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Tabs de Especialidades - TODO EL ANCHO (sin padding lateral) */}
          {categoria.especialidades && categoria.especialidades.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex-1 w-full min-h-0"
            >
              <EspecialidadesTabs
                especialidades={categoria.especialidades}
                color={categoria.color || '#3b82f6'}
                onEspecialidadChange={handleEspecialidadChange}
              />
            </motion.div>
          )}

          {/* Indicador de Scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 mt-4 mb-2 mobile-landscape-scroll-indicator"
          >
            <span className="text-white/60 font-lato text-[11px] uppercase tracking-wider">
              Ver Proyectos
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1 scroll-wheel"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-1 h-1 bg-white rounded-full scroll-dot"
              />
            </motion.div>
            <ChevronDown className="w-4 h-4 text-white/40 scroll-chevron" />
          </motion.div>
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
          // Separar proyectos con y sin imágenes
          const proyectosConImagenes = proyectos.filter(p => p.imagenes && p.imagenes.length > 0)
          const proyectosSinImagenes = proyectos.filter(p => !p.imagenes || p.imagenes.length === 0)

          // Obtener IDs de proyectos destacados
          const proyectosDestacadosIds: string[] = categoria.casosExitoIds && categoria.casosExitoIds.length > 0
            ? categoria.casosExitoIds
            : []

          // Ordenar proyectos con imágenes: destacados primero, luego el resto
          const proyectosConImagenesOrdenados = [...proyectosConImagenes].sort((a, b) => {
            const aEsDestacado = proyectosDestacadosIds.includes(a.id)
            const bEsDestacado = proyectosDestacadosIds.includes(b.id)
            if (aEsDestacado && !bEsDestacado) return -1
            if (!aEsDestacado && bEsDestacado) return 1
            return 0
          })

          return (
            <>
              {/* Grid de proyectos con imágenes */}
              {proyectosConImagenesOrdenados.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-0 mobile-landscape-projects-grid">
                  {proyectosConImagenesOrdenados.map((proyecto, index) => {
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
                          className="relative h-[50vh] sm:h-[50vh] lg:h-[91vh] overflow-hidden mobile-landscape-project-card"
                        >
                          {/* Imagen de fondo con hover */}
                          <div className="absolute inset-0">
                            <Image
                              src={proyecto.imagenes[0].urlOptimized || proyecto.imagenes[0].url}
                              alt={proyecto.imagenes[0].alt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                          </div>

                        {/* Overlay sutil */}
                        <div className="absolute inset-0 bg-black/25" />

                        {/* Contenido - Centrado verticalmente, alineado a la izquierda */}
                        <div className="absolute inset-0 flex flex-col items-start justify-center px-8 sm:px-12 lg:px-10 text-left">

                          {/* Badge destacado */}
                          {esDestacado && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                              viewport={{ once: true }}
                              className="mb-2 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-lato font-bold uppercase tracking-wider border border-white/30"
                            >
                              Proyecto Destacado
                            </motion.div>
                          )}

                          {/* Ubicación */}
                          <p className="text-lg sm:text-xl lg:text-lg text-white/90 font-lato italic leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                            {proyecto.ubicacion}
                          </p>

                          {/* Título del proyecto */}
                          <h3 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bebas uppercase text-white leading-none" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            {proyecto.titulo}
                          </h3>

                          {/* Toneladas */}
                          {proyecto.toneladas && (
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-lato font-light text-white/80 leading-none mt-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                              {Math.round(proyecto.toneladas).toLocaleString('es-CO')} TONS
                            </p>
                          )}

                          {/* Botón Ver proyecto */}
                          <div className="inline-flex items-center gap-2 mt-4 group/btn">
                            <span className="text-white font-lato uppercase tracking-wider text-xs lg:text-sm font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                              Ver Proyecto
                            </span>

                            <div className="relative w-8 h-8 lg:w-10 lg:h-10">
                              <div className="absolute inset-0 rounded-full border-2 border-white group-hover/btn:scale-110 transition-all duration-300" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-white transition-all duration-300 transform group-hover/btn:translate-x-0.5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
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
              )}

              {/* Lista de proyectos sin imágenes */}
              {proyectosSinImagenes.length > 0 && (
                <div className="py-16 px-4 sm:px-6 lg:px-16 xl:px-24 bg-white">
                  <div className="max-w-7xl mx-auto">
                    {/* Título de la sección */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="mb-12"
                    >
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bebas uppercase text-gray-900 text-center">
                        Más Proyectos
                      </h2>
                    </motion.div>

                    {/* Contenedor centrado - ocupa 2 de 4 columnas */}
                    <div className="max-w-5xl mx-auto">
                      {/* Lista simple de proyectos estilo HTML clásico */}
                      <motion.ul
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="columns-1 md:columns-2 gap-x-20 gap-y-8"
                        style={{ columnFill: 'balance' }}
                      >
                        {proyectosSinImagenes.map((proyecto, index) => (
                          <motion.li
                            key={proyecto.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.02 }}
                            viewport={{ once: true }}
                            className="break-inside-avoid mb-8 border-l-[12px] border-blue-600 pl-6"
                          >
                            {/* Nombre del proyecto */}
                            <div className="text-gray-900 font-lato font-bold text-xl md:text-2xl leading-tight">
                              {proyecto.titulo}
                            </div>

                            {/* Ubicación */}
                            <div className="text-gray-900 font-lato text-base leading-tight">
                              {proyecto.ubicacion}
                            </div>

                            {/* Toneladas */}
                            {proyecto.toneladas && (
                              <div className="text-gray-500 font-lato text-sm tracking-wide">
                                {proyecto.toneladas.toLocaleString()} TONS
                              </div>
                            )}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Section */}
              <div className="py-20 px-4 sm:px-6 lg:px-16 xl:px-24 bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="max-w-6xl mx-auto text-center">
                  {/* Título */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12"
                  >
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bebas uppercase text-white mb-4">
                      ¿Listo para tu próximo proyecto?
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-300 font-lato max-w-3xl mx-auto">
                      Descubre más sobre nuestros servicios, conoce nuestra trayectoria o solicita una cotización personalizada.
                    </p>
                  </motion.div>

                  {/* Botones CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  >
                    {/* Explorar categorías */}
                    <Link
                      href="/proyectos"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-lato font-semibold rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Explorar Categorías
                    </Link>

                    {/* Ver trayectoria */}
                    <Link
                      href="/trayectoria"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-lato font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                      <Building className="w-5 h-5" />
                      Nuestra Trayectoria
                    </Link>

                    {/* Cotizar proyecto */}
                    <Link
                      href="/contacto"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-lato font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Cotizar Proyecto
                    </Link>
                  </motion.div>
                </div>
              </div>

              </>
            )
          })()}
      </section>
    </div>
  )
}
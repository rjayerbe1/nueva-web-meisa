'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Building, Calendar, MapPin, User, BookOpen } from 'lucide-react'
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
      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900 overflow-hidden pt-32">
        {/* Background - Video o Imagen - Decidir basado en usarVideoBanner */}
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
            {/* Overlay */}
            {categoria.overlayOpacity && categoria.overlayOpacity > 0 && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: categoria.overlayColor || '#000000',
                  opacity: categoria.overlayOpacity
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
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
                <li className="text-white/80">{categoria.nombre}</li>
              </ol>
            </motion.nav>

            <div className="flex items-center gap-6">
              {/* Category Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-20 h-20 flex items-center justify-center"
                style={{ color: categoria.color || '#3b82f6' }}
              >
                {getCategoryIconComponent(categoria.icono, "w-20 h-20")}
              </motion.div>

              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  {categoria.nombre}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-white/90 max-w-2xl"
                >
                  {categoria.descripcion}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-6 flex flex-wrap items-center gap-4"
                >
                  <span className="flex items-center gap-2 text-white/80">
                    <Building className="w-4 h-4" />
                    {proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Unificada: Sobre esta especialidad + Estadísticas + Brochure */}
      {(categoria.descripcionAmpliada || categoria.estadisticas || brochure) && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Título de Sección */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sobre {categoria.nombre}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto"></div>
            </motion.div>

            {/* Layout de 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* COLUMNA 1: Descripción y Beneficios (60% = 7 cols) */}
              {categoria.descripcionAmpliada && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="lg:col-span-7"
                >
                  <div className="prose prose-lg max-w-none mb-8">
                    <p className="text-gray-700 leading-relaxed text-lg text-justify">
                      {categoria.descripcionAmpliada}
                    </p>
                  </div>

                  {/* Beneficios */}
                  {categoria.beneficios && categoria.beneficios.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        ¿Por qué elegir MEISA?
                      </h3>
                      <ul className="space-y-3">
                        {categoria.beneficios.slice(0, 5).map((beneficio: any, index: number) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3"
                          >
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-gray-700">{beneficio}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Proceso de trabajo compacto */}
                  {categoria.procesoTrabajo && categoria.procesoTrabajo.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        Nuestro Proceso
                      </h3>
                      <div className="space-y-2">
                        {categoria.procesoTrabajo.slice(0, 4).map((paso: any, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-600">{paso}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* COLUMNA 2: Estadísticas + Brochure (40% = 5 cols) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="lg:col-span-5 space-y-6"
              >
                {/* Estadísticas Grid 2x2 */}
                {categoria.estadisticas && (
                  <div className="grid grid-cols-2 gap-4">
                    {categoria.estadisticas.toneladasTotal && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow"
                      >
                        <div className="text-center">
                          <div className="text-3xl font-black bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1">
                            {categoria.estadisticas.toneladasTotal.toLocaleString()}
                          </div>
                          <p className="text-gray-600 font-semibold text-sm">Toneladas</p>
                        </div>
                      </motion.div>
                    )}

                    {categoria.estadisticas.proyectosCompletados && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow"
                      >
                        <div className="text-center">
                          <div className="text-3xl font-black bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1">
                            {categoria.estadisticas.proyectosCompletados}+
                          </div>
                          <p className="text-gray-600 font-semibold text-sm">Proyectos</p>
                        </div>
                      </motion.div>
                    )}

                    {categoria.estadisticas.anosExperiencia && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow"
                      >
                        <div className="text-center">
                          <div className="text-3xl font-black bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1">
                            {categoria.estadisticas.anosExperiencia}+
                          </div>
                          <p className="text-gray-600 font-semibold text-sm">Años</p>
                        </div>
                      </motion.div>
                    )}

                    {categoria.estadisticas.tiempoPromedioEntrega && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow"
                      >
                        <div className="text-center">
                          <div className="text-2xl font-black bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1">
                            {categoria.estadisticas.tiempoPromedioEntrega}
                          </div>
                          <p className="text-gray-600 font-semibold text-xs line-clamp-2">Tiempo Promedio</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Brochure Digital Card */}
                {brochure && brochure.publicado && brochure.activo && (
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Preview del Brochure */}
                    <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden group">
                      {brochure.thumbnail && brochure.thumbnail.trim() !== '' ? (
                        <Image
                          src={brochure.thumbnail}
                          alt={brochure.titulo}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-900 relative">
                          {/* Fondo decorativo */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
                          </div>

                          {/* Icono y texto centrados */}
                          <div className="relative z-10 text-center">
                            <div className="mb-4 inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl">
                              <BookOpen className="w-12 h-12 text-white" />
                            </div>
                            <p className="text-white/80 text-lg font-semibold">
                              Brochure Digital
                            </p>
                            <p className="text-white/60 text-sm mt-1">
                              {brochure.totalPages} páginas disponibles
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/40 to-transparent pointer-events-none"></div>

                      {/* Badge de páginas */}
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                        {brochure.totalPages} página{brochure.totalPages !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-5 h-5 text-white" />
                        <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                          Brochure Digital
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">
                        {brochure.titulo}
                      </h3>

                      {brochure.descripcion && (
                        <p className="text-blue-100 text-sm mb-4 line-clamp-2">
                          {brochure.descripcion}
                        </p>
                      )}

                      <div className="space-y-2">
                        <Link
                          href={`/brochure/${brochure.urlAmigable}`}
                          className="block w-full bg-white hover:bg-blue-50 text-blue-700 font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                        >
                          Ver Brochure Completo
                        </Link>
                        <button
                          onClick={handleDownloadPDF}
                          disabled={downloadingPDF}
                          className="block w-full bg-blue-800/50 hover:bg-blue-800/70 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloadingPDF ? 'Preparando...' : 'Descargar PDF'}
                        </button>
                      </div>

                      {brochure.fechaPublicacion && (
                        <div className="mt-3 text-xs text-blue-200 text-center">
                          Actualizado: {new Date(brochure.fechaPublicacion).toLocaleDateString('es-CO')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

            </div>
          </div>
        </section>
      )}

      {/* Casos de éxito destacados */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Casos de Éxito Destacados
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Proyectos emblemáticos que demuestran nuestra excelencia en {categoria.nombre.toLowerCase()}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mt-4"></div>
          </motion.div>

          {/* Mostrar casos de éxito configurados o los primeros 3 proyectos */}
          {proyectos.length > 0 && (() => {
            // Obtener proyectos para casos de éxito
            let casosExito: Proyecto[] = []
            
            if (categoria.casosExitoIds && categoria.casosExitoIds.length > 0) {
              // Usar los proyectos configurados como casos de éxito
              casosExito = categoria.casosExitoIds
                .map((id: any) => proyectos.find(p => p.id === id))
                .filter((p: any) => p !== undefined) as Proyecto[]
            } else {
              // Fallback: usar los primeros 3 proyectos
              casosExito = proyectos.slice(0, 3)
            }
            
            return casosExito.length > 0 ? (
              <div className="space-y-16">
                {casosExito.map((proyecto, index) => (
                <motion.div
                  key={proyecto.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  {/* Imagen del proyecto */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group">
                      {proyecto.imagenes[0] ? (
                        <Image
                          src={proyecto.imagenes[0].urlOptimized || proyecto.imagenes[0].url}
                          alt={proyecto.imagenes[0].alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="text-center text-gray-400">
                            <div className="w-16 h-16 mx-auto mb-3 opacity-60" style={{ color: categoria.color || '#3b82f6' }}>
                              {getCategoryIconComponent(categoria.icono, "w-16 h-16")}
                            </div>
                            <p className="text-sm">Imagen no disponible</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay con información rápida */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <span className="bg-gradient-to-r from-blue-500/90 to-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                          ⭐ Caso de Éxito {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información del proyecto */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {proyecto.titulo}
                            </h3>
                            <p className="text-blue-600 font-semibold">{proyecto.cliente}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {proyecto.descripcion}
                        </p>
                      </div>

                      {/* Detalles clave */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">Ubicación</span>
                          </div>
                          <p className="text-gray-900 font-semibold">{proyecto.ubicacion}</p>
                        </div>
                        
                        {proyecto.fechaInicio && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-gray-600">Año</span>
                            </div>
                            <p className="text-gray-900 font-semibold">
                              {new Date(proyecto.fechaInicio).getFullYear()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Botón de acción */}
                      <Link
                        href={`/proyectos/detalle/${proyecto.slug}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Ver caso completo
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
                ))}
              </div>
            ) : null
          })()}
          {/* Transición suave al resto del portafolio */}
          {(() => {
            // Verificar si hay casos de éxito configurados
            let casosExitoIds: string[] = []
            if (categoria.casosExitoIds && categoria.casosExitoIds.length > 0) {
              casosExitoIds = categoria.casosExitoIds
            } else if (proyectos.length > 3) {
              casosExitoIds = proyectos.slice(0, 3).map(p => p.id)
            }
            
            // Proyectos restantes (excluyendo casos de éxito)
            const proyectosRestantes = proyectos.filter(p => !casosExitoIds.includes(p.id))
            
            // Solo mostrar transición si hay casos de éxito Y proyectos restantes
            return casosExitoIds.length > 0 && proyectosRestantes.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-16 text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-50 px-6 py-2 text-gray-500 text-sm font-medium rounded-full">
                      Nuestro Portafolio Completo
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : casosExitoIds.length > 0 && proyectosRestantes.length === 0 ? (
              // Cierre elegante cuando solo hay casos de éxito
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-16 text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-50 px-6 py-2 text-gray-500 text-sm font-medium rounded-full">
                      ¿Te interesa esta especialidad?
                    </span>
                  </div>
                </div>
                
                <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
                  Estos son nuestros principales proyectos en {categoria.nombre.toLowerCase()}. Explora otras especialidades para conocer más sobre nuestra experiencia.
                </p>
                
                <Link
                  href="/proyectos"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Explorar todas las categorías
                </Link>
              </motion.div>
            ) : null
          })()}
        </div>
      </section>

      {/* Portfolio Completo - Integrado */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {proyectos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 opacity-50">
                {getCategoryIconComponent(categoria.icono, "w-24 h-24")}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay proyectos disponibles
              </h3>
              <p className="text-gray-600 mb-6">
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
          ) : (() => {
            // Calcular proyectos para mostrar en esta sección
            let casosExitoIds: string[] = []
            if (categoria.casosExitoIds && categoria.casosExitoIds.length > 0) {
              casosExitoIds = categoria.casosExitoIds
            } else if (proyectos.length > 3) {
              casosExitoIds = proyectos.slice(0, 3).map(p => p.id)
            }
            
            // Si hay casos de éxito configurados, mostrar solo los proyectos restantes
            // Si no hay casos de éxito, mostrar todos los proyectos
            const proyectosAMostrar = casosExitoIds.length > 0 
              ? proyectos.filter(p => !casosExitoIds.includes(p.id))
              : proyectos
            
            // Título más simple y directo
            const tituloSeccion = casosExitoIds.length > 0 
              ? `Otros Proyectos` 
              : `Portafolio de ${categoria.nombre}`
            
            const descripcionSeccion = casosExitoIds.length > 0
              ? `${proyectosAMostrar.length} proyecto${proyectosAMostrar.length !== 1 ? 's' : ''} adicional${proyectosAMostrar.length !== 1 ? 'es' : ''} que complementan nuestra experiencia en ${categoria.nombre.toLowerCase()}`
              : `Nuestros ${proyectos.length} proyecto${proyectos.length !== 1 ? 's' : ''} en esta especialidad`

            return (
              <>
                {proyectosAMostrar.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {tituloSeccion}
                    </h2>
                    <p className="text-gray-600">
                      {descripcionSeccion}
                    </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {proyectosAMostrar.map((proyecto, index) => (
                    <motion.div
                      key={proyecto.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group cursor-pointer"
                    >
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100 h-full flex flex-col">
                      {/* Project Image with Overlay Info */}
                      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {proyecto.imagenes[0] ? (
                          <Image
                            src={proyecto.imagenes[0].urlOptimized || proyecto.imagenes[0].url}
                            alt={proyecto.imagenes[0].alt}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 bg-gradient-to-br from-blue-50 to-gray-100">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-3 opacity-60" style={{ color: categoria.color || '#3b82f6' }}>
                                {getCategoryIconComponent(categoria.icono, "w-16 h-16")}
                              </div>
                              <p className="text-sm font-medium text-gray-500">Imagen no disponible</p>
                            </div>
                          </div>
                        )}

                        {/* Gradient Overlay permanente para legibilidad */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Status Badge */}
                        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                          proyecto.estado === 'COMPLETADO' 
                            ? 'bg-green-500/90 text-white' 
                            : proyecto.estado === 'EN_PROGRESO'
                            ? 'bg-blue-500/90 text-white'
                            : 'bg-gray-500/90 text-white'
                        }`}>
                          {proyecto.estado === 'COMPLETADO' ? '✓' : 
                           proyecto.estado === 'EN_PROGRESO' ? '⚡' : 
                           '⏸'}
                        </div>

                        {/* Featured Badge */}
                        {proyecto.destacado && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                            ⭐
                          </div>
                        )}

                        {/* Información superpuesta en la imagen */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-lg font-bold mb-1 line-clamp-2 drop-shadow-lg">
                            {proyecto.titulo}
                          </h3>
                          
                          {/* Info compacta responsiva */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-white/90 mb-2 gap-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="flex items-center gap-1 text-xs">
                                <User className="w-3 h-3" />
                                <span className="truncate max-w-[120px]">{proyecto.cliente}</span>
                              </span>
                              <span className="flex items-center gap-1 text-xs">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[100px]">{proyecto.ubicacion}</span>
                              </span>
                            </div>
                            {proyecto.fechaInicio && (
                              <span className="flex items-center gap-1 text-xs">
                                <Calendar className="w-3 h-3" />
                                {new Date(proyecto.fechaInicio).getFullYear()}
                              </span>
                            )}
                          </div>

                          {/* Información técnica adicional */}
                          {(proyecto.toneladas || proyecto.areaTotal) && (
                            <div className="flex items-center gap-2 text-xs text-white/80">
                              {proyecto.toneladas && (
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                  {proyecto.toneladas} ton
                                </span>
                              )}
                              {proyecto.areaTotal && (
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                  {proyecto.areaTotal.toLocaleString()} m²
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contenido - Descripción completa y botón */}
                      <div className="p-5 flex-1 flex flex-col">
                        <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">
                          {proyecto.descripcion}
                        </p>

                        {/* Action Button - Elegante y consistente */}
                        <Link
                          href={`/proyectos/detalle/${proyecto.slug}`}
                          className="group relative w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 rounded-xl p-3 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-600 group-hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </div>
                              <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                                Ver detalles completos
                              </span>
                            </div>
                            <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

                {/* Back to Projects */}
                {proyectosAMostrar.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                  >
                    <Link
                      href="/proyectos"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Explorar todas las categorías
                    </Link>
                  </motion.div>
                )}
              </>
            )
          })()}
        </div>
      </section>
    </div>
  )
}
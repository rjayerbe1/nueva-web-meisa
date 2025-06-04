'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Building, Calendar, MapPin, User } from 'lucide-react'
import { getCategoryIconComponent } from '@/lib/get-category-icon'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('Component rendered, params:', params)

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
      <section className="relative h-80 bg-gray-900 overflow-hidden">
        {/* Background Image - Usar banner si existe, sino cover */}
        {(categoria.imagenBanner || categoria.imagenCover) && (
          <div className="absolute inset-0">
            <img
              src={categoria.imagenBanner || categoria.imagenCover || ''}
              alt={`Banner de ${categoria.nombre}`}
              className="w-full h-full object-cover"
            />
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
                  className="mt-4 flex items-center gap-4 text-white/80"
                >
                  <span className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    {proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección "Sobre esta especialidad" */}
      {categoria.descripcionAmpliada && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Descripción ampliada */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {categoria.descripcionAmpliada}
                  </p>
                </div>

                {/* Beneficios */}
                {categoria.beneficios && categoria.beneficios.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      ¿Por qué elegir MEISA para {categoria.nombre}?
                    </h3>
                    <ul className="space-y-3">
                      {categoria.beneficios.map((beneficio: any, index: number) => (
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
              </motion.div>

              {/* Proceso de trabajo */}
              {categoria.procesoTrabajo && categoria.procesoTrabajo.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl p-8"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    Nuestro Proceso
                  </h3>
                  <div className="space-y-4">
                    {categoria.procesoTrabajo.map((paso: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 mt-1">{paso}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Estadísticas */}
      {categoria.estadisticas && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Nuestra Experiencia en {categoria.nombre}
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Cifras que respaldan nuestra trayectoria y excelencia en esta especialidad
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categoria.estadisticas.toneladasTotal && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {categoria.estadisticas.toneladasTotal.toLocaleString()}
                  </div>
                  <div className="text-blue-300 font-semibold">Toneladas</div>
                  <div className="text-gray-400 text-sm">Fabricadas</div>
                </motion.div>
              )}

              {categoria.estadisticas.proyectosCompletados && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {categoria.estadisticas.proyectosCompletados}+
                  </div>
                  <div className="text-green-300 font-semibold">Proyectos</div>
                  <div className="text-gray-400 text-sm">Completados</div>
                </motion.div>
              )}

              {categoria.estadisticas.anosExperiencia && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {categoria.estadisticas.anosExperiencia}+
                  </div>
                  <div className="text-yellow-300 font-semibold">Años</div>
                  <div className="text-gray-400 text-sm">de Experiencia</div>
                </motion.div>
              )}

              {categoria.estadisticas.tiempoPromedioEntrega && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {categoria.estadisticas.tiempoPromedioEntrega}
                  </div>
                  <div className="text-purple-300 font-semibold">Tiempo</div>
                  <div className="text-gray-400 text-sm">Promedio</div>
                </motion.div>
              )}
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
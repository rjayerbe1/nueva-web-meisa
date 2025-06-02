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
  icono: string | null
  color: string | null
  colorSecundario: string | null
  overlayColor: string | null
  overlayOpacity: number | null
  metaTitle: string | null
  metaDescription: string | null
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
        {/* Background Image */}
        {categoria.imagenCover && (
          <div className="absolute inset-0">
            <img
              src={categoria.imagenCover}
              alt={`Cover de ${categoria.nombre}`}
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

      {/* Projects Grid */}
      <section className="py-16">
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
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Proyectos de {categoria.nombre}
                </h2>
                <p className="text-gray-600">
                  Descubre nuestros {proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''} destacado{proyectos.length !== 1 ? 's' : ''} en esta categoría
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {proyectos.map((proyecto, index) => (
                  <motion.div
                    key={proyecto.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100">
                      {/* Project Image */}
                      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Status Badge */}
                        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                          proyecto.estado === 'COMPLETADO' 
                            ? 'bg-green-500/90 text-white' 
                            : proyecto.estado === 'EN_PROGRESO'
                            ? 'bg-blue-500/90 text-white'
                            : 'bg-gray-500/90 text-white'
                        }`}>
                          {proyecto.estado === 'COMPLETADO' ? '✓ Completado' : 
                           proyecto.estado === 'EN_PROGRESO' ? '⚡ En Progreso' : 
                           proyecto.estado}
                        </div>

                        {/* Featured Badge */}
                        {proyecto.destacado && (
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                            ⭐ Destacado
                          </div>
                        )}

                        {/* Hover overlay with quick info */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="mb-2">
                              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                {proyecto.toneladas ? `${proyecto.toneladas} ton` : 'Ver detalles'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {proyecto.titulo}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                            {proyecto.descripcion}
                          </p>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{proyecto.cliente}</p>
                              <p className="text-xs text-gray-500">Cliente</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{proyecto.ubicacion}</p>
                              <p className="text-xs text-gray-500">Ubicación</p>
                            </div>
                          </div>

                          {proyecto.fechaInicio && (
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{new Date(proyecto.fechaInicio).getFullYear()}</p>
                                <p className="text-xs text-gray-500">Año de construcción</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <Link
                          href={`/proyectos/detalle/${proyecto.slug}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
                        >
                          Ver proyecto completo
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Back to Projects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center mt-12"
              >
                <Link
                  href="/proyectos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Ver todos los proyectos
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { getCategoryIconComponent } from '@/lib/get-category-icon'

interface ProjectImage {
  url: string
  alt: string
}

interface Proyecto {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  cliente: string
  ubicacion: string
  slug: string
  imagenPortada?: ProjectImage
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
  visible: boolean
  destacada: boolean
}

interface ProjectsByCategorySectionProps {
  projectsByCategory: Record<string, Proyecto[]>
}


export function ProjectsByCategorySection({ projectsByCategory }: ProjectsByCategorySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar categorías desde la base de datos
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategorias(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategorias()
  }, [])

  // Filtrar solo las categorías que tienen proyectos
  const categoriesWithProjects = categorias.filter(categoria => 
    projectsByCategory[categoria.key] && projectsByCategory[categoria.key].length > 0
  )

  const handleCategoryClick = (categoryKey: string) => {
    if (activeCategory === categoryKey) {
      setActiveCategory(null)
    } else {
      setActiveCategory(categoryKey)
      setCurrentImageIndex(0)
    }
  }

  const nextImage = () => {
    if (activeCategory && projectsByCategory[activeCategory]) {
      setCurrentImageIndex((prev) => 
        prev === projectsByCategory[activeCategory].length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (activeCategory && projectsByCategory[activeCategory]) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? projectsByCategory[activeCategory].length - 1 : prev - 1
      )
    }
  }

  return (
    <section id="proyectos-categorias" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-blue-400 font-semibold text-lg mb-2">Nuestro Portafolio</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Proyectos por
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-400"> Categoría</span>
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre nuestros proyectos más destacados organizados por especialidad
          </p>
        </motion.div>

        {/* Grid de categorías */}
        {loading ? (
          <div className="text-center text-white">Cargando categorías...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categoriesWithProjects.map((categoria, index) => {
              const projectCount = projectsByCategory[categoria.key]?.length || 0
              const isActive = activeCategory === categoria.key

              return (
                <motion.div
                  key={categoria.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleCategoryClick(categoria.key)}
                >
                  <div className={`
                    relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500
                    ${isActive 
                      ? 'ring-4 ring-blue-500 ring-opacity-50 shadow-2xl shadow-blue-500/20' 
                      : 'hover:shadow-2xl hover:ring-2 hover:ring-blue-400/30'
                    }
                  `}>
                    {/* Imagen de fondo */}
                    {categoria.imagenCover ? (
                      <div className="relative">
                        <img
                          src={categoria.imagenCover}
                          alt={`Cover de ${categoria.nombre}`}
                          className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Overlay personalizable para el ícono */}
                        {categoria.overlayOpacity && categoria.overlayOpacity > 0 && (
                          <div 
                            className="absolute inset-0"
                            style={{ 
                              backgroundColor: categoria.overlayColor || '#000000',
                              opacity: categoria.overlayOpacity
                            }}
                          />
                        )}
                        
                        {/* Overlay oscuro para legibilidad del texto */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Ícono centrado */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div 
                            className="w-32 h-32 flex items-center justify-center opacity-80 transform -translate-y-4"
                            style={{ color: categoria.color || '#3b82f6' }}
                          >
                            {getCategoryIconComponent(categoria.icono, "w-40 h-40")}
                          </div>
                        </div>

                        {/* Texto superpuesto en la parte inferior */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-bold mb-1 drop-shadow-lg">
                            {categoria.nombre}
                          </h3>
                          <p className="text-sm text-white/90 mb-2 drop-shadow">
                            {projectCount} proyecto{projectCount !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-white/70 drop-shadow line-clamp-2">
                            {categoria.descripcion}
                          </p>
                        </div>

                        {/* Indicador activo */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 left-4 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
                          />
                        )}

                        {/* Efecto hover overlay */}
                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all duration-300" />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gray-800 flex items-center justify-center">
                        <span className="text-white">Sin imagen</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Galería de proyectos de la categoría activa */}
        <AnimatePresence mode="wait">
          {activeCategory && projectsByCategory[activeCategory] && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                {/* Header de la categoría activa */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                      {getCategoryIconComponent(
                        categorias.find(cat => cat.key === activeCategory)?.icono || null,
                        "w-6 h-6"
                      )}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">
                        {categorias.find(cat => cat.key === activeCategory)?.nombre}
                      </h4>
                      <p className="text-gray-400">
                        {projectsByCategory[activeCategory].length} proyectos destacados
                      </p>
                    </div>
                  </div>
                  
                  <Link
                    href={`/proyectos/categoria/${categorias.find(cat => cat.key === activeCategory)?.slug}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Ver todos
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                {/* Carrusel de proyectos */}
                <div className="relative">
                  {projectsByCategory[activeCategory].length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                      {/* Imagen del proyecto */}
                      <div className="relative h-80 bg-gray-700 rounded-xl overflow-hidden">
                        {projectsByCategory[activeCategory][currentImageIndex]?.imagenPortada ? (
                          <Image
                            src={projectsByCategory[activeCategory][currentImageIndex].imagenPortada.url}
                            alt={projectsByCategory[activeCategory][currentImageIndex].imagenPortada.alt}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                                {getCategoryIconComponent(
                                  categorias.find(cat => cat.key === activeCategory)?.icono || null,
                                  "w-16 h-16"
                                )}
                              </div>
                              <p>Imagen no disponible</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Información del proyecto */}
                      <div className="flex flex-col justify-center">
                        <h5 className="text-2xl font-bold text-white mb-4">
                          {projectsByCategory[activeCategory][currentImageIndex]?.titulo}
                        </h5>
                        
                        <p className="text-gray-300 mb-6 leading-relaxed">
                          {projectsByCategory[activeCategory][currentImageIndex]?.descripcion}
                        </p>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 font-medium">Cliente:</span>
                            <span className="text-white">
                              {projectsByCategory[activeCategory][currentImageIndex]?.cliente}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 font-medium">Ubicación:</span>
                            <span className="text-white">
                              {projectsByCategory[activeCategory][currentImageIndex]?.ubicacion}
                            </span>
                          </div>
                        </div>
                        
                        <Link
                          href={`/proyectos/${projectsByCategory[activeCategory][currentImageIndex]?.slug}`}
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                        >
                          Ver proyecto completo
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Indicadores de página */}
                  {projectsByCategory[activeCategory].length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {projectsByCategory[activeCategory].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Ver todos los proyectos
            <ExternalLink className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
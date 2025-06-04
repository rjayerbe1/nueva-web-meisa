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

  const handleCategoryClick = (categoria: Categoria) => {
    // Navegar directamente a la página de la categoría
    window.location.href = `/proyectos/categoria/${categoria.slug}`
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

              return (
                <motion.div
                  key={categoria.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleCategoryClick(categoria)}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:ring-2 hover:ring-blue-400/30">
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
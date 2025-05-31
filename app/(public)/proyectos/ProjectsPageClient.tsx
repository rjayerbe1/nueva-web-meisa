"use client"

import { useState, useMemo } from "react"
import { Building2, Filter, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ProjectCategoriesSection from "@/components/sections/ProjectCategoriesSection"
import { getCategoryByDbValue } from "@/lib/categories-config"

interface Proyecto {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  estado: string
  cliente: string
  ubicacion: string
  fechaInicio: Date
  presupuesto: any
  slug: string
  destacado: boolean
}

interface ProjectsPageClientProps {
  proyectos: Proyecto[]
}

export default function ProjectsPageClient({ proyectos }: ProjectsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCategories, setShowCategories] = useState(true)

  const formatCurrency = (amount: any) => {
    if (!amount) return 'Presupuesto no definido'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount))
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO': return 'bg-green-100 text-green-800'
      case 'EN_PROGRESO': return 'bg-blue-100 text-blue-800'
      case 'PAUSADO': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (categoria: string) => {
    const categoryConfig = getCategoryByDbValue(categoria)
    return categoryConfig?.name || categoria.replace('_', ' ')
  }

  const filteredProyectos = useMemo(() => {
    if (!selectedCategory) return proyectos
    return proyectos.filter(proyecto => proyecto.categoria === selectedCategory)
  }, [proyectos, selectedCategory])

  const handleCategorySelect = (categoryDbValue: string) => {
    setSelectedCategory(categoryDbValue)
    setShowCategories(false)
    // Scroll to projects section
    const projectsSection = document.getElementById('projects-list')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const clearFilter = () => {
    setSelectedCategory(null)
    setShowCategories(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">
              Nuestros <span className="border-2 border-white px-4 py-2">Proyectos</span>
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Descubre los proyectos más emblemáticos que hemos realizado en estructuras metálicas
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProjectCategoriesSection onCategorySelect={handleCategorySelect} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List Section */}
      <section id="projects-list" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedCategory ? `Proyectos de ${getCategoryName(selectedCategory)}` : 'Todos los Proyectos'}
              </h2>
              
              <div className="flex items-center gap-4">
                {selectedCategory && (
                  <button
                    onClick={clearFilter}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Limpiar filtro
                  </button>
                )}
                
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  {showCategories ? 'Ocultar categorías' : 'Ver categorías'}
                </button>
              </div>
            </div>
            
            <p className="text-gray-600">
              {filteredProyectos.length} proyecto{filteredProyectos.length !== 1 ? 's' : ''} 
              {selectedCategory ? ` en ${getCategoryName(selectedCategory)}` : ' en total'}
            </p>
          </div>

          {/* Projects Grid */}
          {filteredProyectos.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredProyectos.map((proyecto, index) => (
                <motion.div
                  key={proyecto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-white/30" />
                    </div>
                    {proyecto.destacado && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                          Destacado
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600 font-medium">
                        {getCategoryName(proyecto.categoria)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(proyecto.estado)}`}>
                        {proyecto.estado.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {proyecto.titulo}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {proyecto.descripcion}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="font-medium">Cliente:</span>
                        <span className="ml-2">{proyecto.cliente}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Ubicación:</span>
                        <span className="ml-2">{proyecto.ubicacion}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Fecha:</span>
                        <span className="ml-2">
                          {new Date(proyecto.fechaInicio).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Presupuesto:</span>
                        <span className="ml-2">{formatCurrency(proyecto.presupuesto)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay proyectos en esta categoría
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedCategory 
                  ? `No hay proyectos disponibles en la categoría ${getCategoryName(selectedCategory)}.`
                  : 'Los proyectos se mostrarán aquí cuando estén disponibles.'
                }
              </p>
              {selectedCategory && (
                <button
                  onClick={clearFilter}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todos los proyectos
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
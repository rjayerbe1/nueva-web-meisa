"use client"

import { useState, useEffect } from "react"
import ProjectCategoryCard from "@/components/animations/ProjectCategoryCard"
import { motion } from "framer-motion"
import Image from "next/image"

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

interface ProjectCategoriesSectionProps {
  onCategorySelect?: (categoryKey: string) => void
  projectsByCategory?: Record<string, any[]>
}

export default function ProjectCategoriesSection({ onCategorySelect, projectsByCategory = {} }: ProjectCategoriesSectionProps) {
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

  const handleCategorySelect = (categoryKey: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryKey)
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Categorías de <span className="text-blue-600">Proyectos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            En MEISA hemos fabricado e instalado estructuras metálicas para todo tipo de proyectos 
            de construcción e infraestructura. Las siguientes categorías muestran los diferentes 
            sectores en los que hemos estado presentes.
          </p>
        </motion.div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center">
            <p className="text-gray-600">Cargando categorías...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categorias.map((category, index) => (
              <ProjectCategoryCard
                key={category.id}
                category={category}
                delay={index * 0.15}
                projectCount={projectsByCategory[category.key]?.length || 0}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            ¿No encuentras el tipo de proyecto que buscas?
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Contáctanos para más información
          </button>
        </motion.div>
      </div>
    </section>
  )
}
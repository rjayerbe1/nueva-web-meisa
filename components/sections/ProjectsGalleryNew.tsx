'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Calendar, Building2 } from 'lucide-react'

const categories = [
  { id: 'todos', label: 'Todos', count: 52 },
  { id: 'PUENTES', label: 'Puentes', count: 12 },
  { id: 'EDIFICIOS', label: 'Edificios', count: 15 },
  { id: 'CENTROS_COMERCIALES', label: 'Centros Comerciales', count: 8 },
  { id: 'INDUSTRIAL', label: 'Industrial', count: 10 },
  { id: 'OIL_GAS', label: 'Oil & Gas', count: 7 },
]

interface Project {
  id: string
  titulo: string
  categoria: string
  ubicacion: string
  fechaInicio: Date
  cliente: string
  descripcion: string
  imagenes: Array<{
    url: string
    alt: string
    tipo?: string
  }>
  imagenPortada?: {
    url: string
    alt: string
  }
}

interface ProjectsGalleryProps {
  projects: Project[]
}

export function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const filteredProjects = selectedCategory === 'todos' 
    ? projects 
    : projects.filter(p => p.categoria === selectedCategory)

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-blue-400 font-semibold text-lg mb-2">Nuestro Trabajo</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Proyectos que 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400"> transforman</span>
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Más de 500 proyectos exitosos en todo Colombia, desde puentes icónicos hasta 
            estructuras industriales de gran envergadura.
          </p>
        </motion.div>

        {/* Filtros de categoría */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-6 py-3 rounded-full font-medium transition-all duration-300
                ${selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                }
              `}
            >
              {category.label} 
              <span className="ml-2 text-sm opacity-60">({category.count})</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Grid de proyectos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className="group relative"
              >
                <Link href={`/proyectos/${project.id}`}>
                  <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                    {/* Imagen */}
                    <div className="relative h-64 overflow-hidden">
                      {(project.imagenPortada || project.imagenes?.[0]) ? (
                        <Image
                          src={project.imagenPortada?.url || project.imagenes[0].url}
                          alt={project.imagenPortada?.alt || project.imagenes[0].alt || project.titulo}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-gray-600" />
                        </div>
                      )}
                      
                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      
                      {/* Categoría badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                          {project.categoria.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                        {project.titulo}
                      </h4>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {project.descripcion}
                      </p>

                      {/* Metadatos */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{project.ubicacion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.fechaInicio).getFullYear()}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{project.cliente}</span>
                        <motion.div
                          animate={{ x: hoveredProject === project.id ? 5 : 0 }}
                          transition={{ type: "spring", stiffness: 400 }}
                          className="text-blue-400 group-hover:text-blue-300"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Efecto de brillo en hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.15), transparent 40%)'
                      }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA para ver más */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
          >
            Ver todos los proyectos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
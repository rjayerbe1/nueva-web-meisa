'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, Calendar, MapPin, ChevronRight } from 'lucide-react'
import { Proyecto } from '@prisma/client'

interface ProjectWithImages extends Proyecto {
  imagenes: { url: string; alt: string }[]
}

interface ProjectsGalleryProps {
  projects: ProjectWithImages[]
}

// Componente de tarjeta hexagonal
function HexagonCard({ project, index }: { project: ProjectWithImages; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const imagenPrincipal = project.imagenes[0]?.url || '/placeholder.jpg'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="hexagon-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hexagon">
        <div className="hexagon-inner">
          {/* Imagen de fondo */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={imagenPrincipal}
              alt={project.titulo}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 filter-none' : 'scale-100 filter grayscale'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Efecto blueprint */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-900/80 to-transparent mix-blend-multiply transition-opacity duration-500 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`} />
          </div>
          
          {/* Overlay con información */}
          <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {/* Categoría */}
              <span className="inline-block px-3 py-1 bg-orange-500 text-xs font-semibold rounded-full mb-2">
                {project.categoria.replace('_', ' ')}
              </span>
              
              {/* Título */}
              <h3 className="text-xl font-bold mb-2">{project.titulo}</h3>
              
              {/* Detalles */}
              <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {project.ubicacion}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(project.fechaInicio).getFullYear()}
                </span>
              </div>
              
              {/* CTA */}
              <Link
                href={`/proyectos/${project.slug}`}
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
              >
                Ver proyecto
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Icono de vista en hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center"
              >
                <Eye className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// Filtros de categoría
const categories = [
  { value: 'TODOS', label: 'Todos', icon: '🏗️' },
  { value: 'CENTROS_COMERCIALES', label: 'Centros Comerciales', icon: '🏬' },
  { value: 'EDIFICIOS', label: 'Edificios', icon: '🏢' },
  { value: 'PUENTES', label: 'Puentes', icon: '🌉' },
  { value: 'INDUSTRIAL', label: 'Industrial', icon: '🏭' },
  { value: 'OIL_GAS', label: 'Oil & Gas', icon: '⛽' },
]

export function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('TODOS')
  const [filteredProjects, setFilteredProjects] = useState(projects)

  useEffect(() => {
    if (selectedCategory === 'TODOS') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => p.categoria === selectedCategory))
    }
  }, [selectedCategory, projects])

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Proyectos Destacados
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Más de 29 años construyendo el futuro de Colombia
          </p>
        </motion.div>
        
        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-orange-500 text-white shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </motion.div>
        
        {/* Grid hexagonal */}
        <div className="hexagon-grid">
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <HexagonCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
          >
            Ver todos los proyectos
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
      
      <style jsx>{`
        .hexagon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          padding: 20px 0;
        }
        
        .hexagon-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 115%;
        }
        
        .hexagon {
          position: absolute;
          width: 100%;
          height: 100%;
          clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
          transition: transform 0.3s ease;
        }
        
        .hexagon:hover {
          transform: translateY(-5px);
        }
        
        .hexagon-inner {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #1a1a1a;
        }
        
        @media (min-width: 768px) {
          .hexagon-grid {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          }
        }
      `}</style>
    </section>
  )
}
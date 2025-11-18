'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
  hoverOverlayColor: string | null
  hoverOverlayOpacity: number | null
  enableHoverOverlay: boolean
  visible: boolean
  destacada: boolean
}

interface ProjectsByCategorySectionProps {
  projectsByCategory: Record<string, Proyecto[]>
}

// Componente de categoría individual con parallax
function CategoryCard({ categoria, index, projectCount }: { categoria: Categoria; index: number; projectCount: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Efecto parallax para la imagen - se mueve más lento que el scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  // Efecto parallax para el contenido - se mueve más lento que el scroll
  const contentY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%'])

  const words = categoria.nombre.split(' ')

  return (
    <Link
      href={`/proyectos/categoria/${categoria.slug}`}
      className="group block"
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        viewport={{ once: true, margin: "-50px" }}
        className="relative h-[50vh] lg:h-[75vh] overflow-hidden"
      >
        {/* Imagen de fondo con parallax */}
        {categoria.imagenCover ? (
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-0 h-[120%] -top-[10%]"
          >
            <img
              src={categoria.imagenCover}
              alt={`Cover de ${categoria.nombre}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        )}

        {/* Overlay configurable desde BD */}
        {categoria.overlayOpacity && categoria.overlayOpacity > 0 ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: categoria.overlayColor || '#000000',
              opacity: categoria.overlayOpacity
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40" />
        )}

        {/* Overlay hover - configurable desde BD */}
        {categoria.enableHoverOverlay && (
          <style jsx>{`
            .hover-overlay-${categoria.id} {
              background-color: ${categoria.hoverOverlayColor || '#1e40af'};
              opacity: 0;
              transition: opacity 500ms;
            }
            .group:hover .hover-overlay-${categoria.id} {
              opacity: ${categoria.hoverOverlayOpacity ?? 0.2};
            }
          `}</style>
        )}
        {categoria.enableHoverOverlay && (
          <div className={`absolute inset-0 hover-overlay-${categoria.id}`} />
        )}

        {/* Contenido con parallax en la parte inferior */}
        <motion.div
          style={{ y: contentY }}
          className="absolute inset-0 flex flex-col items-center justify-end px-12 sm:px-14 lg:px-12 pb-8 lg:pb-12 text-center"
        >
          {/* Ícono de categoría centrado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            viewport={{ once: true }}
            className="mb-6 transform group-hover:scale-110 transition-transform duration-500"
            style={{ color: categoria.color || '#3b82f6' }}
          >
            {getCategoryIconComponent(categoria.icono, "w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40")}
          </motion.div>

          {/* Título sin animación de letras - cada palabra en una línea, altura fija de 2 líneas */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bebas uppercase text-white mb-6 drop-shadow-2xl leading-tight min-h-[6rem] sm:min-h-[7rem] lg:min-h-[9rem] xl:min-h-[11rem] flex flex-col justify-center">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="block">
                {word}
              </span>
            ))}
          </h1>

          {/* Botón Descubrir */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 group/btn"
          >
            <span className="text-white font-lato uppercase tracking-wider text-sm lg:text-base font-semibold">
              Descubrir
            </span>

            {/* Círculo con flecha */}
            <div className="relative w-10 h-10 lg:w-12 lg:h-12">
              <div className="absolute inset-0 rounded-full border-2 border-white/80 group-hover/btn:border-white transition-all duration-300 group-hover/btn:scale-110" />
              <div className="absolute inset-0 rounded-full bg-white/0 group-hover/btn:bg-white transition-all duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover/btn:text-blue-600 transition-all duration-300 transform group-hover/btn:translate-x-1" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Línea divisoria inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      </motion.div>
    </Link>
  )
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

  return (
    <section id="proyectos-categorias" className="bg-gray-900">
      {/* Grid de categorías estilo Ferrari - 2 columnas */}
      {loading ? (
        <div className="text-center text-white font-lato py-20">Cargando categorías...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {categoriesWithProjects.map((categoria, index) => {
            const projectCount = projectsByCategory[categoria.key]?.length || 0
            return (
              <CategoryCard
                key={categoria.id}
                categoria={categoria}
                index={index}
                projectCount={projectCount}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
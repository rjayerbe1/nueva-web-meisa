"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getCategoryIconComponent } from "@/lib/get-category-icon"

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

interface ProjectCategoriesSectionProps {
  onCategorySelect?: (categoryKey: string) => void
  projectsByCategory?: Record<string, any[]>
}

// Componente para el título animado con letras individuales
const AnimatedTitle = ({ text, className = "" }: { text: string; className?: string }) => {
  const words = text.split(' ')

  return (
    <h1 className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-3">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: (wordIndex * word.length + charIndex) * 0.02,
                ease: "easeOut"
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  )
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

  return (
    <section className="bg-gray-900">
      {/* Header de sección */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-blue-400 font-bebas uppercase text-xl mb-2">Nuestro Portafolio</h2>
          <h3 className="text-5xl md:text-6xl font-bebas uppercase text-white mb-4">
            Categorías de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-400"> Proyectos</span>
          </h3>
          <p className="text-xl font-lato text-gray-300 max-w-4xl mx-auto">
            En MEISA hemos fabricado e instalado estructuras metálicas para todo tipo de proyectos
            de construcción e infraestructura
          </p>
        </motion.div>
      </div>

      {/* Grid de categorías estilo Ferrari - 2 columnas */}
      {loading ? (
        <div className="text-center text-white font-lato py-20">Cargando categorías...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {categorias.map((categoria, index) => {
            const projectCount = projectsByCategory[categoria.key]?.length || 0

            return (
              <Link
                key={categoria.id}
                href={`/proyectos/categoria/${categoria.slug}`}
                className="group block"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="relative h-[85vh] lg:h-[75vh] overflow-hidden"
                >
                  {/* Imagen de fondo */}
                  {categoria.imagenCover ? (
                    <div className="absolute inset-0">
                      <img
                        src={categoria.imagenCover}
                        alt={`Cover de ${categoria.nombre}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
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
                    // Overlay por defecto si no está configurado
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

                  {/* Contenido en la parte inferior */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end px-6 lg:px-12 pb-8 lg:pb-12 text-center">
                    {/* Ícono de categoría - MUCHO MÁS GRANDE */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                      className="mb-6 transform group-hover:scale-110 transition-transform duration-500"
                      style={{ color: categoria.color || '#3b82f6' }}
                    >
                      {getCategoryIconComponent(categoria.icono, "w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40")}
                    </motion.div>

                    {/* Título animado con letras */}
                    <AnimatedTitle
                      text={categoria.nombre.toUpperCase()}
                      className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bebas uppercase text-white mb-6 drop-shadow-2xl leading-tight"
                    />

                    {/* Botón Descubrir estilo Ferrari */}
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

                      {/* Círculo con flecha estilo Ferrari */}
                      <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                        {/* Círculo exterior */}
                        <div className="absolute inset-0 rounded-full border-2 border-white/80 group-hover/btn:border-white transition-all duration-300 group-hover/btn:scale-110" />

                        {/* Círculo interior animado en hover */}
                        <div className="absolute inset-0 rounded-full bg-white/0 group-hover/btn:bg-white transition-all duration-300" />

                        {/* Flecha */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover/btn:text-blue-600 transition-all duration-300 transform group-hover/btn:translate-x-1" />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Línea divisoria inferior (excepto en la última categoría) */}
                  {index < categorias.length - 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Call to action final */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-gray-300 font-lato mb-6">
            ¿No encuentras el tipo de proyecto que buscas?
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-lato font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
          >
            Contáctanos para más información
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
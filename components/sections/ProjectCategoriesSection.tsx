"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getCategoryIconComponent } from "@/lib/get-category-icon"

// Helper para parsear posición desde formato "X,Y"
const parsePosition = (posStr: string | null): { x: number; y: number } => {
  if (!posStr || posStr.includes(' ')) {
    return { x: 0, y: 0 }
  }
  const [x, y] = posStr.split(',').map(v => parseFloat(v) || 0)
  return { x, y }
}

interface Categoria {
  id: string
  key: string
  nombre: string
  descripcion: string | null
  slug: string
  imagenCover: string | null
  videoCover: string | null
  usarVideoCover: boolean
  videoCoverScale: number | null
  videoCoverPosition: string | null
  icono: string | null
  // iconSize removido - ahora es global
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

// Componente de categoría individual con parallax
function CategoryCard({ categoria, index, projectCount, iconSize = 48 }: { categoria: Categoria; index: number; projectCount: number; iconSize?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

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
        className="relative h-[50vh] lg:h-[55vh] overflow-hidden mobile-landscape-category-card"
      >
        {/* Video o Imagen de fondo con parallax */}
        {(categoria.usarVideoCover && categoria.videoCover) ? (
          <div className="absolute inset-0">
            {/* Imagen de fondo como placeholder mientras el video carga */}
            {categoria.imagenCover && (
              <img
                src={categoria.imagenCover}
                alt={`Cover de ${categoria.nombre}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {/* Video que aparece cuando está listo */}
            <video
              src={categoria.videoCover}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{
                objectFit: 'cover',
                transform: `translate(${parsePosition(categoria.videoCoverPosition).x}%, ${parsePosition(categoria.videoCoverPosition).y}%) scale(${categoria.videoCoverScale || 1.0})`,
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                WebkitFontSmoothing: 'antialiased',
                imageRendering: 'crisp-edges'
              }}
              autoPlay
              muted
              loop
              playsInline
              onCanPlayThrough={() => setVideoLoaded(true)}
            />
          </div>
        ) : categoria.imagenCover ? (
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
            className="mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-500"
            style={{
              color: categoria.color || '#3b82f6'
            }}
          >
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 category-icon">
              {getCategoryIconComponent(categoria.icono, "w-full h-full")}
            </div>
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

export default function ProjectCategoriesSection({ onCategorySelect, projectsByCategory = {} }: ProjectCategoriesSectionProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [globalIconSize, setGlobalIconSize] = useState(48) // Tamaño global de iconos

  // Cargar configuración global (endpoint público)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/site-config')
        if (response.ok) {
          const config = await response.json()
          setGlobalIconSize(config.categoryIconSize || 48)
        }
      } catch (error) {
        console.error('Error fetching site config:', error)
      }
    }
    fetchConfig()
  }, [])

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
    <section className="bg-slate-950">
      {/* Grid 3×2: 6 tarjetas de igual tamaño */}
      {loading ? (
        <div className="text-center text-white font-lato py-20">Cargando categorías...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mobile-landscape-categories-grid">
          {categorias.map((categoria, index) => {
            const projectCount = projectsByCategory[categoria.key]?.length || 0
            return (
              <CategoryCard
                key={categoria.id}
                categoria={categoria}
                index={index}
                projectCount={projectCount}
                iconSize={globalIconSize}
              />
            )
          })}
        </div>
      )}

      {/* CTA final — Dark brutalist */}
      <div className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mb-10 md:mb-12"
          >
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              ¿No encuentras tu proyecto?
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white">
              Podemos
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              ayudarte.
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Contáctanos para una solución personalizada a tu medida.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            <Link
              href="/contacto"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700"
            >
              Solicitar cotización
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <a
              href="https://wa.me/573104327227?text=Hola,%20me%20gustaría%20solicitar%20información%20sobre%20sus%20servicios."
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCategoryIconComponent } from '@/lib/get-category-icon'

// Helper para parsear posición desde formato "X,Y"
const parsePosition = (posStr: string | null): { x: number; y: number } => {
  if (!posStr || posStr.includes(' ')) {
    return { x: 0, y: 0 }
  }
  const [x, y] = posStr.split(',').map(v => parseFloat(v) || 0)
  return { x, y }
}

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
  videoCover: string | null
  usarVideoCover: boolean
  videoCoverScale: number | null
  videoCoverPosition: string | null
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
function CategoryCard({
  categoria,
  index,
  projectCount,
  iconSize = 48,
  isHero = false,
  isActive = false,
  onHoverStart,
  onHoverEnd,
}: {
  categoria: Categoria
  index: number
  projectCount: number
  iconSize?: number
  isHero?: boolean
  isActive?: boolean
  onHoverStart?: () => void
  onHoverEnd?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Video: solo se reproduce cuando la tarjeta está activa (hover en desktop)
  useEffect(() => {
    if (isMobile) return
    const video = videoRef.current
    if (!video) return
    if (isActive) {
      video.currentTime = 0
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isActive, isMobile])

  // Efecto parallax para la imagen - se mueve más lento que el scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  // Efecto parallax para el contenido - se mueve más lento que el scroll
  const contentY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%'])

  const words = categoria.nombre.split(' ')

  // Tamaño del icono: más pequeño en móvil; más grande en hero
  const baseIcon = isMobile ? iconSize * 2 : iconSize * (isHero ? 5 : 3)
  const finalIconSize = baseIcon

  return (
    <Link
      href={`/proyectos/categoria/${categoria.slug}`}
      className="group block h-full"
      onMouseEnter={isMobile ? undefined : onHoverStart}
      onMouseLeave={isMobile ? undefined : onHoverEnd}
      onFocus={isMobile ? undefined : onHoverStart}
      onBlur={isMobile ? undefined : onHoverEnd}
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        viewport={{ once: true, margin: "-50px" }}
        className="relative h-full overflow-hidden"
      >
        {/* Video o Imagen de fondo con parallax */}
        {(categoria.usarVideoCover && categoria.videoCover) ? (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              src={categoria.videoCover}
              className="w-full h-full"
              style={{
                objectFit: 'cover',
                transform: `translate(${parsePosition(categoria.videoCoverPosition).x}%, ${parsePosition(categoria.videoCoverPosition).y}%) scale(${categoria.videoCoverScale || 1.0})`,
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                WebkitFontSmoothing: 'antialiased',
                imageRendering: 'crisp-edges'
              }}
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
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
            className="mb-6 transform group-hover:scale-110 transition-transform duration-500"
            style={{
              color: categoria.color || '#3b82f6',
              width: `${finalIconSize}px`,
              height: `${finalIconSize}px`
            }}
          >
            {getCategoryIconComponent(categoria.icono, "w-full h-full")}
          </motion.div>

          {/* Título sin animación de letras - cada palabra en una línea */}
          <h1 className={`${isHero ? 'text-5xl sm:text-6xl lg:text-7xl xl:text-8xl' : 'text-3xl sm:text-4xl lg:text-4xl xl:text-5xl'} font-bebas uppercase text-white mb-6 drop-shadow-2xl leading-tight flex flex-col justify-center`}>
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="block">
                {word}
              </span>
            ))}
          </h1>

          {/* Indicador sutil de interacción: aparece en hover */}
          <div className="h-6 lg:h-8 flex items-center justify-center">
            <ArrowRight
              className="w-6 h-6 lg:w-7 lg:h-7 text-white opacity-0 -translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0"
              aria-hidden="true"
            />
          </div>
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
  const [globalIconSize, setGlobalIconSize] = useState(48) // Tamaño global de iconos
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)

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

  // Mostrar todas las categorías visibles excepto "OTRO" (misma lógica que /proyectos)
  const orderedCategories = categorias.filter(categoria => categoria.key !== 'OTRO')

  return (
    <section id="proyectos-categorias" className="bg-gray-900">
      {/* Grid 3×2: 6 tarjetas de igual tamaño */}
      {loading ? (
        <div className="text-center text-white font-lato py-20">Cargando categorías...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {orderedCategories.map((categoria, index) => {
            const projectCount = projectsByCategory[categoria.key]?.length || 0
            return (
              <div
                key={categoria.id}
                className="h-[50vh] lg:h-[55vh]"
              >
                <CategoryCard
                  categoria={categoria}
                  index={index}
                  projectCount={projectCount}
                  iconSize={globalIconSize}
                  isActive={activeCategoryId === categoria.id}
                  onHoverStart={() => setActiveCategoryId(categoria.id)}
                  onHoverEnd={() =>
                    setActiveCategoryId((current) =>
                      current === categoria.id ? null : current,
                    )
                  }
                />
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
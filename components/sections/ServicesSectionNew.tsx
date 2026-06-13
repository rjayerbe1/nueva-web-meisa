'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { videoPoster } from '@/lib/video-poster'

const AnimatedTitle = ({ text, className = '' }: { text: string; className?: string }) => {
  const words = text.split(' ')

  return (
    <h2 className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="block sm:inline-block sm:mr-3">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: (wordIndex * word.length + charIndex) * 0.02,
                ease: 'easeOut',
              }}
              viewport={{ once: true, margin: '-100px' }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </h2>
  )
}

export interface ServicioItem {
  id: string
  nombre: string
  subtitulo?: string | null
  descripcion?: string | null
  video?: string | null
  image?: string | null
  color?: string | null
  overlayColor?: string | null
  overlayOpacity?: number | null
  href: string
}

function ServiceCard({
  servicio,
  index,
  isActive,
  isMobile,
  totalServices,
  onHoverStart,
  onHoverEnd,
}: {
  servicio: ServicioItem
  index: number
  isActive: boolean
  isMobile: boolean
  totalServices: number
  onHoverStart: () => void
  onHoverEnd: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%'])

  // Montar el video solo cuando la card se acerca al viewport — evita
  // descargar los mp4 de toda la sección al cargar la página
  const nearViewport = useInView(containerRef, { once: true, margin: '300px' })

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

  // En móvil no hay hover: reproducir al entrar al viewport (muted +
  // playsInline — iOS no pinta ningún frame si el video nunca reproduce)
  useEffect(() => {
    if (!isMobile || !nearViewport) return
    videoRef.current?.play().catch(() => {})
  }, [isMobile, nearViewport])

  return (
    <Link
      href={servicio.href}
      className="group block"
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
        viewport={{ once: true, margin: '-50px' }}
        className="relative h-[50vh] lg:h-[85vh] overflow-hidden"
      >
        <div className="absolute inset-0">
          {servicio.video && nearViewport && (
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              preload="metadata"
              poster={videoPoster(servicio.video)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={
                servicio.id === 'diseno'
                  ? { objectPosition: '15% 70%', transform: 'scale(1.30)' }
                  : servicio.id === 'construccion'
                  ? { transform: 'scale(1.60)' }
                  : undefined
              }
              aria-hidden="true"
            >
              <source src={servicio.video} type="video/mp4" />
            </video>
          )}
        </div>

        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#000000',
            opacity: servicio.overlayOpacity ?? 0.4,
          }}
        />

        {servicio.overlayColor && (
          <>
            <style jsx>{`
              .hover-overlay-${servicio.id} {
                background-color: ${servicio.overlayColor};
                opacity: 0;
                transition: opacity 500ms;
              }
              .group:hover .hover-overlay-${servicio.id} {
                opacity: 0.2;
              }
            `}</style>
            <div className={`absolute inset-0 hover-overlay-${servicio.id}`} />
          </>
        )}

        <motion.div
          style={{ y: contentY }}
          className="absolute inset-0 flex flex-col items-center justify-end px-6 lg:px-12 pb-8 lg:pb-12 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            viewport={{ once: true }}
            className="text-gray-300 font-lato text-sm lg:text-base mb-2 uppercase tracking-wider"
          >
            {servicio.subtitulo}
          </motion.p>

          <AnimatedTitle
            text={servicio.nombre.toUpperCase()}
            className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bebas uppercase text-white mb-4 drop-shadow-2xl leading-tight"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            viewport={{ once: true }}
            className="text-gray-200 font-lato text-sm lg:text-base mb-6 max-w-md"
          >
            {servicio.descripcion}
          </motion.p>

          {/* Indicador sutil de interacción: aparece en hover */}
          <div className="h-6 lg:h-8 flex items-center justify-center">
            <ArrowRight
              className="w-6 h-6 lg:w-7 lg:h-7 text-white opacity-0 -translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0"
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {index < totalServices - 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        )}
      </motion.div>
    </Link>
  )
}

interface ServicesSectionProps {
  servicios: ServicioItem[]
}

export function ServicesSection({ servicios }: ServicesSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (servicios.length === 0) return null

  const cols =
    servicios.length === 1
      ? 'lg:grid-cols-1'
      : servicios.length === 2
      ? 'lg:grid-cols-2'
      : servicios.length === 4
      ? 'lg:grid-cols-4'
      : 'lg:grid-cols-3'

  return (
    <section id="servicios" className="bg-gray-900">
      <div className={`grid grid-cols-1 ${cols} gap-0`}>
        {servicios.map((servicio, index) => (
          <ServiceCard
            key={servicio.id}
            servicio={servicio}
            index={index}
            totalServices={servicios.length}
            isActive={activeId === servicio.id}
            isMobile={isMobile}
            onHoverStart={() => setActiveId(servicio.id)}
            onHoverEnd={() => setActiveId((current) => (current === servicio.id ? null : current))}
          />
        ))}
      </div>
    </section>
  )
}

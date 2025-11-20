'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useLoading } from '@/contexts/LoadingContext'

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentVideo, setCurrentVideo] = useState('/videos/engineering-plant.mp4')
  const [isMobile, setIsMobile] = useState(false)
  const { registerResource, markResourceLoaded } = useLoading()

  // Registrar el video como recurso a cargar (solo en desktop)
  useEffect(() => {
    if (!isMobile) {
      registerResource()
    }
  }, [isMobile, registerResource])

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Alternar entre video normal y reversa (solo desktop)
  useEffect(() => {
    if (isMobile) return
    const video = videoRef.current
    if (!video) return

    video.playbackRate = 0.5 // 50% de velocidad

    const handleEnded = () => {
      // Cuando termine el video, cambiar al otro
      setCurrentVideo(prev =>
        prev === '/videos/engineering-plant.mp4'
          ? '/videos/engineering-plant-reverse.mp4'
          : '/videos/engineering-plant.mp4'
      )
    }

    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('ended', handleEnded)
    }
  }, [isMobile])

  // Reproducir automáticamente cuando cambie el video (solo desktop)
  useEffect(() => {
    if (isMobile) return
    const video = videoRef.current
    if (video) {
      video.load()
      video.playbackRate = 0.5
      video.play().catch(() => {})
    }
  }, [currentVideo, isMobile])

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Transform para parallax - el video se mueve más lento que el scroll (invertido)
  const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6])

  // Efecto zoom para imagen en móvil
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2])

  // Efecto parallax para el texto - se queda atrás al hacer scroll
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Imagen con zoom en móvil / Video con parallax en desktop */}
      {isMobile ? (
        <motion.div
          style={{ scale }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="/images/about/meisa-planta-aerea.jpg"
            alt="MEISA - Planta de producción vista aérea"
            fill
            className="object-cover"
            style={{ objectPosition: '65% center' }}
            priority
            sizes="100vw"
          />
        </motion.div>
      ) : (
        <motion.div
          style={{ y }}
          className="absolute -top-[15%] left-0 w-full h-[130%]"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onLoadedData={() => markResourceLoaded(currentVideo)}
          >
            <source src={currentVideo} type="video/mp4" />
          </video>
        </motion.div>
      )}

      {/* Overlay oscuro con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/50" />

      {/* Contenido alineado a la izquierda con efecto parallax */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 h-full flex items-end pb-72 md:items-center md:pb-0 px-4 sm:px-6 lg:px-16 xl:px-24"
      >
        <div className="max-w-3xl">
          {/* Título principal - Dos líneas con tamaños diferentes */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-3 max-h-[500px]:mb-2"
          >
            <h2 className="text-5xl max-h-[500px]:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase text-white leading-none">
              EXCELENCIA
            </h2>
            <h3 className="text-2xl max-h-[500px]:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bebas uppercase text-white leading-tight -mt-1 max-h-[500px]:-mt-0.5">
              Nuestro Único Estándar
            </h3>
          </motion.div>

          {/* Subtítulo/Descripción */}
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[13px] max-h-[500px]:text-[10px] sm:text-sm md:text-base lg:text-lg text-gray-200 font-lato leading-relaxed mb-4 max-h-[500px]:mb-2 bg-black/40 px-1 py-2 max-h-[500px]:px-0.5 max-h-[500px]:py-1 rounded-lg max-w-[280px] sm:max-w-md whitespace-normal md:whitespace-nowrap md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
          >
            Cada proyecto es <span className="text-red-600 font-bold">único</span>. Nuestra <span className="text-red-600 font-bold">excelencia</span> en <span className="text-red-600 font-bold">diseño, fabricación y montaje</span>, una constante
          </motion.p>

          {/* Botón CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href="/empresa"
              className="group relative inline-block overflow-hidden"
            >
              {/* Barra roja que se expande en hover */}
              <span className="absolute left-0 top-0 h-full w-1.5 bg-red-600 transition-all duration-500 ease-out group-hover:w-full z-0"></span>

              {/* Texto del botón */}
              <span className="relative z-10 inline-flex items-center gap-2 px-6 max-h-[500px]:px-5 py-1.5 max-h-[500px]:py-1 text-white font-lato font-bold text-sm max-h-[500px]:text-xs md:text-lg transition-colors duration-500 group-hover:text-gray-900">
                Conoce Nuestra Empresa
                <ArrowRight className="w-4 h-4 max-h-[500px]:w-3 max-h-[500px]:h-3 lg:w-6 lg:h-6 opacity-0 transition-all duration-300 transform group-hover:opacity-100 group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

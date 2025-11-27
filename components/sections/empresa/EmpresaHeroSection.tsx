'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function EmpresaHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Intentar reproducir el video
      const playVideo = async () => {
        try {
          await video.play()
        } catch (error) {
          console.log('Video autoplay failed:', error)
        }
      }

      // Si el video ya está listo, reproducir
      if (video.readyState >= 3) {
        playVideo()
      } else {
        // Esperar a que esté listo
        video.addEventListener('canplay', playVideo)
        return () => video.removeEventListener('canplay', playVideo)
      }
    }
  }, [])

  const scrollToNext = () => {
    const nextSection = containerRef.current?.nextElementSibling
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Video Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Fallback color mientras carga el video */}
        <div className="absolute inset-0 bg-gray-900" />

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover scale-125"
        >
          <source src="/videos/fabricacion-metalica.mp4" type="video/mp4" />
        </video>

        {/* Overlay gradiente lateral - oscuro izquierda, transparente derecha */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        {/* Overlay adicional en la parte inferior para transición suave */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </motion.div>

      {/* Content - Alineado a la izquierda */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 max-w-5xl"
      >
        {/* Main Title - Estilo similar a AboutSection */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-3"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase text-white leading-none" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
            ESTRUCTURAS QUE
          </h1>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500 leading-none" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
            TRANSFORMAN
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg text-gray-200 font-lato leading-relaxed mb-6 max-w-md"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
        >
          Más de <span className="font-bold">500 proyectos</span> en todo el país
        </motion.p>

      </motion.div>

      {/* Scroll Indicator - Centrado abajo */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer group"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Descubre más</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>

    </div>
  )
}

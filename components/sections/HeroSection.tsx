'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import gsap from 'gsap'
import { HeroScene } from '../three/scenes/HeroScene'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

export function HeroSection() {
  const controls = useAnimation()
  const titleRef = useRef(null)
  const isInView = useInView(titleRef)

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
      
      // Animación de construcción del texto con GSAP
      gsap.fromTo(
        '.hero-title-char',
        {
          opacity: 0,
          y: 50,
          rotateX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out',
        }
      )
    }
  }, [isInView, controls])

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  // Dividir el título en caracteres para animar
  const title = "CONSTRUYENDO EL FUTURO EN ACERO"
  const titleChars = title.split('').map((char, index) => (
    <span
      key={index}
      className="hero-title-char inline-block"
      style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Escena 3D de fondo */}
      <HeroScene />
      
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-transparent z-10" />
      
      {/* Contenido */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Título principal */}
          <motion.h1
            ref={titleRef}
            variants={titleVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
            style={{ perspective: '1000px' }}
          >
            {titleChars}
          </motion.h1>
          
          {/* Subtítulo */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8 font-light"
          >
            <span className="text-orange-500 font-semibold">29 años</span> de experiencia en estructuras metálicas
          </motion.p>
          
          {/* Descripción */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Diseño, fabricación y montaje de estructuras metálicas para los proyectos más ambiciosos de Colombia
          </motion.p>
          
          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/proyectos"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Ver Proyectos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              href="/contacto"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-white/50 backdrop-blur-sm"
            >
              <span className="relative z-10">Solicitar Cotización</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        </div>
        
        {/* Indicador de scroll */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center text-white/60">
            <span className="text-sm mb-2">Descubre más</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </div>
        </motion.div>
      </motion.div>
      
      {/* Efecto de partículas adicional */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-20 left-10 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-500 rounded-full animate-ping" />
        <div className="absolute bottom-30 left-1/3 w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-500" />
      </div>
    </section>
  )
}
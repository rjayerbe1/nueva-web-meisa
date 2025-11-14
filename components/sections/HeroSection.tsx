'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const heroImages = [
  {
    src: '/images/hero/centro-comercial.webp',
    alt: 'Centro Comercial Campanario - Estructura metálica moderna',
  },
  {
    src: '/images/hero/puente-metalico.jpg',
    alt: 'Puente Carrera 100 - Infraestructura vial',
  },
  {
    src: '/images/hero/edificios.jpg',
    alt: 'Edificios con estructuras metálicas de MEISA',
  },
]

const specialties = [
  'DISEÑO\nESTRUCTURAL',
  'FABRICACIÓN\nMETÁLICA',
  'MONTAJE\nESPECIALIZADO',
  'GESTIÓN DE\nPROYECTOS'
]

export function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0)
  const [currentSpecialty, setCurrentSpecialty] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length)
    }, 3000) // Cambia cada 3 segundos
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[65vh] w-full overflow-hidden bg-gray-900 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-16">
      {/* Fondo de imágenes con transición suave */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[currentImage].src}
            alt={heroImages[currentImage].alt}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Contenido */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-full text-slate-200 text-base font-bebas uppercase mb-4"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              LÍDER EN COLOMBIA • DESDE 1996
            </motion.div>

            {/* Título principal rediseñado */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bebas text-white mb-2 leading-none tracking-tight">
                <div className="block h-20 sm:h-24 md:h-32 lg:h-36 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSpecialty}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-start text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-blue-200 to-slate-400 whitespace-pre-line text-center sm:text-left"
                    >
                      {specialties[currentSpecialty]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-slate-400"></div>
                <span className="text-blue-400 font-bebas uppercase text-2xl tracking-widest">MEISA</span>
              </div>
            </motion.div>

            {/* Propuesta de valor impactante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mb-8"
            >
              <p className="text-3xl md:text-4xl font-bebas uppercase text-white mb-4 leading-tight">
                Construimos el futuro de Colombia
              </p>
              <p className="text-xl font-lato text-slate-300 max-w-2xl leading-relaxed">
                Desde <span className="text-blue-400 font-lato font-semibold">1996</span> desarrollando soluciones integrales con
                <span className="text-blue-400 font-lato font-semibold"> 320 profesionales</span> especializados en
                <span className="text-blue-400 font-lato font-semibold"> múltiples disciplinas</span> de la ingeniería.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/proyectos"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-lato font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Ver proyectos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-lato font-bold rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Solicitar cotización
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
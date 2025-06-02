'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Building2, HardHat, Cog } from 'lucide-react'

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
  'ESTRUCTURAS\nMETÁLICAS',
  'OBRAS\nCIVILES',
  'RECIPIENTES\nA PRESIÓN',
  'INTERCAMBIADORES\nDE CALOR',
  'CUBIERTAS\nSTEEL SEAM',
  'EQUIPOS\nINDUSTRIALES',
  'STEEL\nDECK',
  'OIL &\nGAS'
]

const stats = [
  { 
    icon: Building2, 
    value: '10,400', 
    label: 'M² industriales',
    description: 'Área total de plantas',
    highlight: 'CAPACIDAD'
  },
  { 
    icon: HardHat, 
    value: '8', 
    label: 'Puentes grúa',
    description: 'Equipamiento especializado',
    highlight: 'TECNOLOGÍA'
  },
  { 
    icon: Cog, 
    value: '100', 
    label: 'Ton transporte',
    description: 'Capacidad logística',
    highlight: 'LOGÍSTICA'
  },
]

const achievements = [
  { value: '50+', label: 'Años protección' },
  { value: '8', label: 'Software BIM' },
  { value: '9', label: 'Categorías proyectos' },
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
    <section className="relative min-h-screen overflow-hidden bg-gray-900 pt-20 lg:pt-24">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-full text-slate-200 text-sm font-medium mb-4"
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
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-2 leading-none tracking-tight">
                <div className="block h-24 md:h-32 lg:h-36 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSpecialty}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-start text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-blue-200 to-slate-400 whitespace-pre-line text-center md:text-left"
                    >
                      {specialties[currentSpecialty]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-slate-400"></div>
                <span className="text-blue-400 font-semibold text-lg tracking-widest">MEISA</span>
              </div>
            </motion.div>

            {/* Propuesta de valor impactante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mb-8"
            >
              <p className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                Construimos el futuro de Colombia
              </p>
              <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                Desde <span className="text-blue-400 font-semibold">1996</span> desarrollando soluciones integrales con 
                <span className="text-blue-400 font-semibold"> 320 profesionales</span> especializados en 
                <span className="text-blue-400 font-semibold"> múltiples disciplinas</span> de la ingeniería.
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
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Ver proyectos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Solicitar cotización
              </Link>
            </motion.div>

            {/* Estadísticas mejoradas */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-16"
            >
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="relative group"
                    >
                      <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
                        {/* Badge de destacado */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all">
                            <Icon className="w-6 h-6 text-blue-400" />
                          </div>
                          <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                            {stat.highlight}
                          </span>
                        </div>
                        
                        {/* Número principal */}
                        <div className="mb-2">
                          <p className="text-3xl font-black text-white group-hover:text-blue-100 transition-colors">
                            {stat.value}
                          </p>
                          <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                            {stat.label}
                          </p>
                        </div>
                        
                        {/* Descripción */}
                        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                          {stat.description}
                        </p>
                        
                        {/* Línea de progreso animada */}
                        <motion.div
                          className="mt-3 h-0.5 bg-gray-700 rounded-full overflow-hidden"
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, delay: 1.6 + index * 0.1 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              {/* Logros adicionales */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="mt-8 grid grid-cols-3 gap-6"
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 group-hover:bg-white/10 transition-all">
                      <p className="text-xl font-bold text-white mb-1">{achievement.value}</p>
                      <p className="text-xs text-gray-400">{achievement.label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>


      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}
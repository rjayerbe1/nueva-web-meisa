'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"

const specialties = [
  'DISEÑO\nESTRUCTURAL',
  'FABRICACIÓN\nMETÁLICA',
  'MONTAJE\nESPECIALIZADO',
  'GESTIÓN DE\nPROYECTOS'
]

export function HeroSection() {
  const [currentSpecialty, setCurrentSpecialty] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Detectar cuando el scroll sale de la sección hero
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        // Si la sección hero ya pasó completamente (su bottom está arriba de la pantalla)
        setIsVisible(rect.bottom > 0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Ejecutar inicialmente

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Transformaciones para las columnas de imágenes - efecto escalonado DHK
  // Columna central: empieza a revelarse desde el inicio (0-50% del scroll)
  const centerClipPath = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["polygon(-5% 100%, 105% 100%, 105% 100%, -5% 100%)", "polygon(-5% 0%, 105% 0%, 105% 100%, -5% 100%)"]
  )

  // Columna derecha: empieza a revelarse más tarde (25-85% del scroll)
  const rightClipPath = useTransform(
    scrollYProgress,
    [0.25, 0.85],
    ["polygon(-5% 100%, 105% 100%, 105% 100%, -5% 100%)", "polygon(-5% 0%, 105% 0%, 105% 100%, -5% 100%)"]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={containerRef} className="relative h-[250vh] md:h-[350vh]">
      {/* Grid de 3 columnas en DESKTOP - permanece FIJO mientras se anima, se oculta al salir */}
      <div
        className={`fixed top-0 left-0 w-full h-screen flex z-30 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* VERSIÓN MÓVIL - 3 filas con scroll horizontal */}
        <div className="md:hidden w-full h-screen relative flex flex-col">
          {/* Fila 1 - Logo y Contenido */}
          <div className="h-1/3 bg-white flex flex-col justify-center items-center px-6 py-4 border-b border-gray-200">
            <div className="space-y-3 flex flex-col items-center w-full">
              <div className="w-44">
                <Image
                  src="/images/logo/logo-meisa.png"
                  alt="MEISA"
                  width={280}
                  height={79}
                  unoptimized
                  priority
                  className="w-full h-auto"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-[10px] font-lato font-semibold tracking-wider">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                </span>
                LÍDER EN COLOMBIA
              </div>

              <div className="h-16 relative overflow-hidden w-full">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentSpecialty}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center text-center text-lg font-bold text-gray-900 whitespace-pre-line leading-tight font-lato"
                  >
                    {specialties[currentSpecialty]}
                  </motion.h2>
                </AnimatePresence>
              </div>

              <p className="text-sm font-bold text-gray-900 font-lato text-center leading-tight">
                Construimos el futuro de Colombia
              </p>
            </div>
          </div>

          {/* Fila 2 - Primera Imagen con Scroll Reveal */}
          <div className="h-1/3 relative border-b border-white/10 overflow-hidden">
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <Image
                src="/images/hero/centro-comercial.webp"
                alt="MEISA - Centro Comercial"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Imagen que se revela con scroll */}
            <motion.div
              className="absolute inset-0"
              style={{
                clipPath: useTransform(
                  scrollYProgress,
                  [0, 0.3],
                  ["polygon(0 0, 0 0, 0 100%, 0% 100%)", "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"]
                )
              }}
            >
              <Image
                src="/images/hero/puente-metalico.jpg"
                alt="MEISA - Puente Metálico"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Fila 3 - Segunda Imagen con Scroll Reveal */}
          <div className="h-1/3 relative overflow-hidden">
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <Image
                src="/images/hero/edificios.jpg"
                alt="MEISA - Edificios"
                fill
                className="object-cover"
              />
            </div>

            {/* Imagen que se revela con scroll */}
            <motion.div
              className="absolute inset-0"
              style={{
                clipPath: useTransform(
                  scrollYProgress,
                  [0.15, 0.5],
                  ["polygon(0 0, 0 0, 0 100%, 0% 100%)", "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"]
                )
              }}
            >
              <Image
                src="/images/hero/centro-comercial.webp"
                alt="MEISA - Proyecto"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* CTAs superpuestos */}
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-8 px-6 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <Link
                  href="/proyectos"
                  className="group inline-flex items-center justify-between px-6 py-3 bg-white text-gray-900 font-bold transition-all duration-300 hover:bg-blue-700 hover:text-white font-lato text-sm"
                >
                  <span>Ver proyectos</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contacto"
                  className="group inline-flex items-center justify-between px-6 py-3 border border-white text-white font-bold transition-all duration-300 hover:bg-white hover:text-gray-900 font-lato text-sm"
                >
                  <span>Solicitar cotización</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* VERSIÓN DESKTOP - Grid de 3 columnas */}
        {/* Columna Izquierda - Logo + Contenido (FONDO BLANCO) */}
        <div className="hidden md:flex w-1/3 bg-white flex-col justify-between p-16 border-r border-gray-200">
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {/* Logo Centrado */}
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logo/logo-meisa.png"
                alt="MEISA"
                width={260}
                height={74}
                unoptimized
                priority
              />
            </div>

            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-lato font-semibold tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                LÍDER EN COLOMBIA • DESDE 1996
              </div>
            </div>

            {/* Título Animado */}
            <div className="h-28 relative overflow-hidden my-2">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentSpecialty}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center text-center text-3xl font-bold text-gray-900 whitespace-pre-line leading-tight font-lato"
                >
                  {specialties[currentSpecialty]}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Descripción */}
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold text-gray-900 font-lato leading-snug">
                Construimos el futuro<br/>de Colombia
              </h1>
              <p className="text-sm text-gray-600 font-lato leading-relaxed">
                Desde <span className="text-blue-700 font-semibold">1996</span> con{" "}
                <span className="text-blue-700 font-semibold">320 profesionales</span><br/>especializados.
              </p>
            </div>

            {/* CTAs Modernos - Estilo minimalista */}
            <div className="flex flex-col gap-4 pt-6">
              <Link
                href="/proyectos"
                className="group relative inline-flex items-center justify-between px-8 py-4 bg-gray-900 text-white font-bold transition-all duration-300 hover:bg-blue-700 font-lato overflow-hidden"
              >
                <span className="relative z-10">Ver proyectos</span>
                <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-blue-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>

              <Link
                href="/contacto"
                className="group relative inline-flex items-center justify-between px-8 py-4 border border-gray-900 text-gray-900 font-bold transition-all duration-300 hover:border-blue-700 hover:text-blue-700 font-lato"
              >
                <span>Solicitar cotización</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Indicador de scroll - Abajo */}
          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-gray-400"
            >
              <span className="text-xs font-lato uppercase tracking-wide">Scroll</span>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        {/* Columna Central - Imágenes con Scroll Reveal - SOLO DESKTOP */}
        <div className="hidden md:block w-1/3 relative border-r border-white/10">
          {/* Imagen Top */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero/centro-comercial.webp"
              alt="Centro Comercial Campanario - Estructura metálica moderna"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Imagen Bottom - Se revela al hacer scroll */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: centerClipPath }}
          >
            <Image
              src="/images/hero/puente-metalico.jpg"
              alt="Puente Carrera 100 - Infraestructura vial"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Columna Derecha - Imágenes con Scroll Reveal - SOLO DESKTOP */}
        <div className="hidden md:block w-1/3 relative">
          {/* Imagen Top */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero/edificios.jpg"
              alt="Edificios con estructuras metálicas de MEISA"
              fill
              className="object-cover"
            />
          </div>

          {/* Imagen Bottom - Se revela al hacer scroll (más lento) */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: rightClipPath }}
          >
            <Image
              src="/images/hero/centro-comercial.webp"
              alt="MEISA Proyecto - Arquitectura"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

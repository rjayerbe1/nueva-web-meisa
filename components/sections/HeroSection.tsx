'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { HeroImageConfig } from "@/lib/hero-config"
import { LogoHoverEffect } from "@/components/logo/LogoHoverEffect"
import { HeroImageLoader } from "@/components/loading/HeroImageLoader"

const specialties = [
  'DISEÑO\nESTRUCTURAL',
  'FABRICACIÓN\nMETÁLICA',
  'MONTAJE\nESPECIALIZADO',
  'GESTIÓN DE\nPROYECTOS'
]

interface HeroSectionProps {
  heroImages: HeroImageConfig
}

export function HeroSection({ heroImages }: HeroSectionProps) {
  const [currentSpecialty, setCurrentSpecialty] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadedImagesSet = useRef<Set<string>>(new Set())

  // Determinar número total de imágenes según el dispositivo
  const totalImages = isMobile ? 4 : 5

  // Calcular progreso real de carga basado en imágenes únicas
  const targetProgress = (loadedCount / totalImages) * 100
  // Solo mostrar como cargado si TODO está listo: imágenes cargadas, tiempo mínimo Y animación llegó a 100%
  const allImagesLoaded = loadedCount >= totalImages && minTimeElapsed && displayProgress >= 99.9

  // Animar el progreso mostrado para que siempre se vea crecer suavemente
  useEffect(() => {
    if (displayProgress < targetProgress) {
      // Si el salto es muy grande (ej: todo en caché), usar más tiempo
      const progressJump = targetProgress - displayProgress
      const baseDuration = progressJump > 80 ? 500 : 150 // Si salta >80%, animar por 500ms
      const steps = 25
      const stepValue = progressJump / steps
      const stepDuration = baseDuration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        setDisplayProgress(prev => {
          const next = prev + stepValue
          if (next >= targetProgress || currentStep >= steps) {
            clearInterval(interval)
            return targetProgress
          }
          return next
        })
      }, stepDuration)

      return () => clearInterval(interval)
    }
  }, [targetProgress, displayProgress])

  // Handler para cuando una imagen carga - recibe la URL para evitar duplicados
  const handleImageLoad = (imageUrl: string) => {
    if (!loadedImagesSet.current.has(imageUrl)) {
      loadedImagesSet.current.add(imageUrl)
      const newCount = loadedImagesSet.current.size
      setLoadedCount(newCount)
      console.log(`🖼️ Imagen única cargada: ${newCount}/${totalImages}`, imageUrl)
    }
  }

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Tiempo mínimo de visualización del loader: 700ms
  useEffect(() => {
    const minTimeout = setTimeout(() => {
      setMinTimeElapsed(true)
      console.log('⏱️ Tiempo mínimo de loader transcurrido')
    }, 700)
    return () => clearTimeout(minTimeout)
  }, [])

  // Timeout de seguridad: forzar carga completa después de 1.5 segundos
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!allImagesLoaded) {
        console.log('⚠️ Timeout de seguridad: forzando carga completa')
        setLoadedCount(totalImages)
        setMinTimeElapsed(true)
      }
    }, 1500)
    return () => clearTimeout(timeout)
  }, [allImagesLoaded, totalImages])

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

  // Transformaciones para las columnas de imágenes - efecto secuencial superpuesto izquierda → centro → derecha
  // Columna izquierda: primera en revelarse (0-30% del scroll)
  const leftClipPath = useTransform(
    scrollYProgress,
    [0, 0.3],
    ["polygon(-5% 100%, 105% 100%, 105% 100%, -5% 100%)", "polygon(-5% 0%, 105% 0%, 105% 100%, -5% 100%)"]
  )

  // Columna central: segunda en revelarse (10-40% del scroll) - empieza cuando izquierda va al 33%
  const centerClipPath = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    ["polygon(-5% 100%, 105% 100%, 105% 100%, -5% 100%)", "polygon(-5% 0%, 105% 0%, 105% 100%, -5% 100%)"]
  )

  // Columna derecha: última en revelarse (20-50% del scroll) - empieza cuando central va al 33%
  const rightClipPath = useTransform(
    scrollYProgress,
    [0.2, 0.5],
    ["polygon(-5% 100%, 105% 100%, 105% 100%, -5% 100%)", "polygon(-5% 0%, 105% 0%, 105% 100%, -5% 100%)"]
  )

  // Transformaciones para versión móvil
  const mobileRow2ClipPath = useTransform(
    scrollYProgress,
    [0, 0.3],
    ["polygon(0 0, 0 0, 0 100%, 0% 100%)", "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"]
  )

  const mobileRow3ClipPath = useTransform(
    scrollYProgress,
    [0.15, 0.5],
    ["polygon(0 0, 0 0, 0 100%, 0% 100%)", "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Loader de imágenes del Hero */}
      <HeroImageLoader isVisible={!allImagesLoaded} progress={displayProgress} />

      <section ref={containerRef} className="relative h-[150vh] md:h-[180vh]">
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
                <LogoHoverEffect
                  variant="3d-tilt"
                  width={280}
                  height={79}
                  className="w-full"
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
                src={heroImages.mobile?.row2Top || heroImages.centerTop}
                alt="MEISA - Ciclopuente al atardecer"
                fill
                className="object-cover"
                priority
                onLoad={() => handleImageLoad(heroImages.mobile?.row2Top || heroImages.centerTop)}
              />
            </div>

            {/* Imagen que se revela con scroll */}
            <motion.div
              className="absolute inset-0"
              style={{
                clipPath: mobileRow2ClipPath
              }}
            >
              <Image
                src={heroImages.mobile?.row2Bottom || heroImages.centerBottom}
                alt="MEISA - Estructura metálica perspectiva"
                fill
                className="object-cover"
                priority
                onLoad={() => handleImageLoad(heroImages.mobile?.row2Bottom || heroImages.centerBottom)}
              />
            </motion.div>
          </div>

          {/* Fila 3 - Segunda Imagen con Scroll Reveal */}
          <div className="h-1/3 relative overflow-hidden">
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <Image
                src={heroImages.mobile?.row3Top || heroImages.rightTop}
                alt="MEISA - Coliseo estructuras rojas"
                fill
                className="object-cover"
                priority
                onLoad={() => handleImageLoad(heroImages.mobile?.row3Top || heroImages.rightTop)}
              />
            </div>

            {/* Imagen que se revela con scroll */}
            <motion.div
              className="absolute inset-0"
              style={{
                clipPath: mobileRow3ClipPath
              }}
            >
              <Image
                src={heroImages.mobile?.row3Bottom || heroImages.rightBottom}
                alt="MEISA - Montaje con grúa"
                fill
                className="object-cover"
                priority
                onLoad={() => handleImageLoad(heroImages.mobile?.row3Bottom || heroImages.rightBottom)}
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
        {/* Columna Izquierda - Logo centrado con Scroll Reveal */}
        <div className="hidden md:block w-1/3 bg-white border-r border-gray-200 relative">
          {/* Fondo blanco con logo con efecto 3D Tilt */}
          <div className="absolute inset-0 flex items-center justify-center">
            <LogoHoverEffect
              variant="3d-tilt"
              width={300}
              height={85}
            />
          </div>

          {/* Imagen que se revela al hacer scroll - Tapa el logo */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: leftClipPath }}
          >
            <Image
              src={heroImages.leftColumn}
              alt="Estructura metálica de techo - MEISA"
              fill
              className="object-cover"
              priority
              onLoad={() => handleImageLoad(heroImages.leftColumn)}
            />
          </motion.div>
        </div>

        {/* Columna Central - Imágenes con Scroll Reveal - SOLO DESKTOP */}
        <div className="hidden md:block w-1/3 relative border-r border-white/10">
          {/* Imagen Top */}
          <div className="absolute inset-0">
            <Image
              src={heroImages.centerTop}
              alt="Ciclopuente al atardecer - Estructura metálica MEISA"
              fill
              className="object-cover"
              priority
              onLoad={() => handleImageLoad(heroImages.centerTop)}
            />
          </div>

          {/* Imagen Bottom - Se revela al hacer scroll */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: centerClipPath }}
          >
            <Image
              src={heroImages.centerBottom}
              alt="Vista interior de estructura metálica - Perspectiva"
              fill
              className="object-cover"
              priority
              onLoad={() => handleImageLoad(heroImages.centerBottom)}
            />
          </motion.div>
        </div>

        {/* Columna Derecha - Imágenes con Scroll Reveal - SOLO DESKTOP */}
        <div className="hidden md:block w-1/3 relative">
          {/* Imagen Top */}
          <div className="absolute inset-0">
            <Image
              src={heroImages.rightTop}
              alt="Coliseo con estructuras metálicas rojas MEISA"
              fill
              className="object-cover"
              priority
              onLoad={() => handleImageLoad(heroImages.rightTop)}
            />
          </div>

          {/* Imagen Bottom - Se revela al hacer scroll (más lento) */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: rightClipPath }}
          >
            <Image
              src={heroImages.rightBottom}
              alt="Montaje de viga metálica con grúa - MEISA en acción"
              fill
              className="object-cover"
              priority
              onLoad={() => handleImageLoad(heroImages.rightBottom)}
            />
          </motion.div>
        </div>
      </div>
    </section>
    </>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { X, ArrowRight } from "lucide-react"

const heroImages = [
  'https://storage.googleapis.com/meisa-imagenes/site/hero/centro-comercial.webp',
  'https://storage.googleapis.com/meisa-imagenes/site/hero/puente-metalico.jpg',
  'https://storage.googleapis.com/meisa-imagenes/site/hero/edificios.jpg',
]

const specialties = [
  'DISEÑO\nESTRUCTURAL',
  'FABRICACIÓN\nMETÁLICA',
  'MONTAJE\nESPECIALIZADO',
  'GESTIÓN DE\nPROYECTOS'
]

const menuItems = [
  { name: "Proyectos", href: "/proyectos" },
  { name: "Servicios", href: "/servicios" },
  { name: "Nosotros", href: "/nosotros" },
  { name: "Contacto", href: "/contacto" },
]

// DEMO 1 - Logo Gigante Izquierda + Info Derecha (Estilo DHK)
function Demo1() {
  const [menuOpen, setMenuOpen] = useState(false)
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
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImages[currentImage]}
          alt="MEISA Proyecto"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      </div>

      {/* Navbar */}
      <nav className="fixed bottom-8 left-8 z-30">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white text-sm hover:opacity-70 tracking-wider"
        >
          menu
        </button>
      </nav>

      {/* Content */}
      <div className="relative z-10 h-screen flex">
        {/* Izquierda - Logo Gigante */}
        <div className="w-2/5 flex items-center justify-center pl-12">
          <h1 className="text-white text-[11rem] font-bold leading-none tracking-tighter">
            MEISA
          </h1>
        </div>

        {/* Derecha - Info */}
        <div className="w-3/5 flex items-center pr-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              LÍDER EN COLOMBIA • DESDE 1996
            </div>

            {/* Título Animado */}
            <div className="mb-8">
              <div className="h-32 relative overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentSpecialty}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute text-6xl font-bold text-white whitespace-pre-line leading-tight"
                  >
                    {specialties[currentSpecialty]}
                  </motion.h2>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-16 bg-blue-500"></div>
                <span className="text-blue-400 text-xl tracking-widest">MEISA</span>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-3xl font-bold text-white mb-4">
              Construimos el futuro de Colombia
            </p>
            <p className="text-lg text-gray-300 mb-8">
              Desde <span className="text-blue-400 font-semibold">1996</span> desarrollando soluciones integrales con
              <span className="text-blue-400 font-semibold"> 320 profesionales</span> especializados.
            </p>

            {/* CTAs */}
            <div className="flex gap-4">
              <Link
                href="/proyectos"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver proyectos
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                Solicitar cotización
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menú */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-1/2 flex items-center justify-center">
              <h1 className="text-white text-[11rem] font-bold leading-none tracking-tighter">
                MEISA
              </h1>
            </div>

            <div className="w-1/2 flex items-center justify-center">
              <div className="space-y-8">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a href={item.href} className="block text-white text-6xl font-bold hover:text-blue-400 transition-colors">
                      {item.name}
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// DEMO 2 - Arqui9 Style con Contenido Real
function Demo2() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSpecialty, setCurrentSpecialty] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen bg-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 p-6 flex justify-between">
        <div className="text-white text-sm tracking-widest">MEISA</div>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white text-sm tracking-widest hover:opacity-70"
        >
          MENU
        </button>
      </nav>

      {/* Hero */}
      <div className="h-screen flex items-center justify-center px-16">
        <div className="text-center max-w-4xl">
          <Image
            src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png"
            alt="MEISA"
            width={600}
            height={180}
            unoptimized
            className="mx-auto mb-8"
          />

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            LÍDER EN COLOMBIA • DESDE 1996
          </div>

          <div className="h-28 mb-6 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentSpecialty}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white whitespace-pre-line"
              >
                {specialties[currentSpecialty]}
              </motion.h2>
            </AnimatePresence>
          </div>

          <p className="text-3xl font-bold text-white mb-4">
            Construimos el futuro de Colombia
          </p>

          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Desde <span className="text-blue-400">1996</span> con <span className="text-blue-400">320 profesionales</span> especializados en múltiples disciplinas.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/proyectos"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver proyectos
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              Solicitar cotización
            </Link>
          </div>
        </div>
      </div>

      {/* Menú Fullscreen */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <div className="absolute top-6 left-6 right-6 flex justify-between">
              <div className="text-white text-sm tracking-widest">MEISA</div>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white text-sm tracking-widest"
              >
                CLOSE
              </button>
            </div>

            <div className="h-full flex">
              <div className="w-1/2 relative p-16">
                <div className="absolute inset-0 m-12 border border-white/20 overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700"></div>
              </div>

              <div className="w-1/2 flex flex-col justify-center pr-24">
                <div className="space-y-8">
                  {menuItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <a href={item.href} className="block text-white text-7xl font-light hover:opacity-70 transition-opacity">
                        {item.name}
                      </a>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-16 text-white/60 text-sm">
                  <p>CONTACTO@MEISA.COM.CO</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// DEMO 3 - Ultra Clean White
function Demo3() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-white">
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-8 right-8 z-30 text-xs tracking-[0.3em] font-bold hover:text-blue-700"
      >
        MENU
      </button>

      <div className="h-screen flex items-center justify-center px-8">
        <div className="text-center max-w-4xl">
          <Image
            src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
            alt="MEISA"
            width={700}
            height={210}
            unoptimized
            className="mx-auto mb-8"
          />

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm mb-8">
            LÍDER EN COLOMBIA • DESDE 1996
          </div>

          <p className="text-4xl font-bold text-gray-900 mb-4">
            Construimos el futuro de Colombia
          </p>

          <p className="text-xl text-gray-600 mb-12">
            <span className="text-blue-600 font-semibold">28 años de experiencia</span> • <span className="text-blue-600 font-semibold">320 profesionales</span> • <span className="text-blue-600 font-semibold">600 ton/mes</span>
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/proyectos"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Ver proyectos
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:border-blue-700 hover:text-blue-700 transition-colors"
            >
              Solicitar cotización
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white flex items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-xs tracking-[0.3em] font-bold"
            >
              CLOSE
            </button>

            <div className="space-y-10">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <a href={item.href} className="block text-8xl font-light hover:text-blue-700 transition-colors">
                    {item.name}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// DEMO 4 - Split Screen Moderno
function Demo4() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen">
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-8 right-8 z-30 text-xs tracking-[0.3em] font-bold hover:text-blue-700"
      >
        MENU
      </button>

      <div className="h-screen flex">
        {/* Izquierda - Info */}
        <div className="w-1/2 bg-white flex items-center justify-center p-16">
          <div className="max-w-lg">
            <Image
              src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
              alt="MEISA"
              width={400}
              height={120}
              unoptimized
              className="mb-8"
            />

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm mb-8">
              DESDE 1996
            </div>

            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Construimos el futuro de Colombia
            </h2>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-4xl font-bold text-blue-700">28</div>
                <div className="text-sm text-gray-600">Años</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-700">320</div>
                <div className="text-sm text-gray-600">Personas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-700">600</div>
                <div className="text-sm text-gray-600">Ton/Mes</div>
              </div>
            </div>

            <Link
              href="/proyectos"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Ver proyectos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Derecha - Imagen */}
        <div className="w-1/2 relative">
          <Image
            src={heroImages[currentImage]}
            alt="MEISA Proyecto"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-white text-xs tracking-[0.3em]"
            >
              CLOSE
            </button>

            <div className="grid grid-cols-2 gap-16 max-w-5xl px-8">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <a href={item.href} className="block">
                    <h3 className="text-white text-6xl font-bold mb-4 hover:text-blue-400 transition-colors">
                      {item.name}
                    </h3>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// DEMO 5 - Minimalista Negro Editorial
function Demo5() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSpecialty, setCurrentSpecialty] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-8 right-8 z-30 text-white text-xs tracking-[0.3em] hover:opacity-70"
      >
        MENU
      </button>

      <div className="h-screen flex flex-col items-center justify-center px-8">
        <Image
          src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png"
          alt="MEISA"
          width={800}
          height={240}
          unoptimized
          className="mb-6"
        />

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-xs mb-12">
          LÍDER EN COLOMBIA • DESDE 1996
        </div>

        <div className="h-32 mb-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentSpecialty}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white/90 whitespace-pre-line text-center"
            >
              {specialties[currentSpecialty]}
            </motion.h2>
          </AnimatePresence>
        </div>

        <p className="text-4xl font-light text-white mb-4 text-center">
          Construimos el futuro de Colombia
        </p>

        <div className="flex gap-8 text-center mb-12">
          <div>
            <div className="text-3xl font-bold text-blue-400">28+</div>
            <div className="text-sm text-white/60">años</div>
          </div>
          <div className="w-px bg-white/20"></div>
          <div>
            <div className="text-3xl font-bold text-blue-400">320</div>
            <div className="text-sm text-white/60">profesionales</div>
          </div>
          <div className="w-px bg-white/20"></div>
          <div>
            <div className="text-3xl font-bold text-blue-400">600</div>
            <div className="text-sm text-white/60">ton/mes</div>
          </div>
        </div>

        <Link
          href="/proyectos"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Ver proyectos
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-white text-xs tracking-[0.3em]"
            >
              CLOSE
            </button>

            <div className="space-y-12">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                >
                  <a href={item.href} className="block text-white text-8xl font-light hover:text-gray-400 transition-colors">
                    {item.name}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// DEMO 6 - DHK Grid Style con Scroll Revelador
function Demo6() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSpecialty, setCurrentSpecialty] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Transformaciones para las columnas de imágenes - efecto escalonado DHK
  // Columna central: empieza a revelarse desde el inicio (0-60% del scroll)
  const centerClipPath = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["polygon(-5% 100%, 105% 100%, 105% 100%, -5% 100%)", "polygon(-5% 0%, 105% 0%, 105% 100%, -5% 100%)"]
  )

  // Columna derecha: empieza a revelarse más tarde (30-100% del scroll)
  const rightClipPath = useTransform(
    scrollYProgress,
    [0.3, 1],
    ["polygon(-5% 100%, 105% 100%, 105% 100%, -5% 100%)", "polygon(-5% 0%, 105% 0%, 105% 100%, -5% 100%)"]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-[200vh] bg-black">
      {/* Navbar minimal - solo MENU */}
      <nav className="fixed bottom-8 left-8 z-30">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white text-sm hover:opacity-70 tracking-wider uppercase"
        >
          menu
        </button>
      </nav>

      {/* Grid de 3 columnas */}
      <div className="sticky top-0 h-screen flex">
        {/* Columna Izquierda - Logo + Contenido */}
        <div className="w-1/3 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col justify-center p-12 border-r border-white/10">
          <div className="space-y-8">
            {/* Logo */}
            <div>
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png"
                alt="MEISA"
                width={300}
                height={85}
                unoptimized
              />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              LÍDER EN COLOMBIA • DESDE 1996
            </div>

            {/* Título Animado */}
            <div className="h-24 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentSpecialty}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute text-4xl font-bold text-white whitespace-pre-line leading-tight"
                >
                  {specialties[currentSpecialty]}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Descripción */}
            <div>
              <p className="text-2xl font-bold text-white mb-3">
                Construimos el futuro de Colombia
              </p>
              <p className="text-sm text-gray-400">
                Desde <span className="text-blue-400 font-semibold">1996</span> con{" "}
                <span className="text-blue-400 font-semibold">320 profesionales</span> especializados.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Ver proyectos
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition-colors text-sm"
              >
                Solicitar cotización
              </Link>
            </div>
          </div>
        </div>

        {/* Columna Central - Imágenes con Scroll Reveal */}
        <div className="w-1/3 relative border-r border-white/10">
          {/* Imagen Top */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80"
              alt="MEISA Proyecto"
              fill
              className="object-cover"
            />
          </div>

          {/* Imagen Bottom - Se revela al hacer scroll */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: centerClipPath }}
          >
            <Image
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80"
              alt="MEISA Proyecto"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Columna Derecha - Imágenes con Scroll Reveal */}
        <div className="w-1/3 relative">
          {/* Imagen Top */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
              alt="MEISA Proyecto"
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
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"
              alt="MEISA Proyecto"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Menú Fullscreen */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-white text-sm tracking-wider uppercase"
            >
              close
            </button>

            <div className="w-1/2 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png"
                alt="MEISA"
                width={600}
                height={180}
                unoptimized
              />
            </div>

            <div className="w-1/2 flex items-center justify-center">
              <div className="space-y-8">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a href={item.href} className="block text-white text-6xl font-bold hover:text-blue-400 transition-colors">
                      {item.name}
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de Scroll */}
      <div className="fixed bottom-8 right-8 z-20 text-white/40 text-xs">
        Scroll para ver más
      </div>
    </div>
  )
}

// Página principal
export default function HeroRealDemosPage() {
  const demos = [
    {
      title: "Logo Gigante Izquierda (DHK Style)",
      component: Demo1,
      description: "Logo MEISA enorme lado izquierdo + todo tu contenido actual a la derecha. Navbar abajo. Super bold.",
      recommended: true
    },
    {
      title: "Arqui9 Style Centrado",
      component: Demo2,
      description: "Logo + contenido centrado. Menú fullscreen con imagen. Muy sofisticado y editorial.",
      recommended: true
    },
    {
      title: "Ultra Clean White",
      component: Demo3,
      description: "Fondo blanco minimalista, solo MENU flotante. Contenido optimizado y limpio. Muy moderno.",
      recommended: false
    },
    {
      title: "Split Screen Números",
      component: Demo4,
      description: "Logo + números izquierda, imagen derecha. Muy visual e impactante. Datos destacados.",
      recommended: false
    },
    {
      title: "Editorial Negro Elegante",
      component: Demo5,
      description: "Logo enorme, especialidades animadas, números abajo. Fondo negro premium. Muy elegante.",
      recommended: true
    },
    {
      title: "DHK Grid con Scroll Revelador",
      component: Demo6,
      description: "3 columnas: Logo + contenido izquierda, 2 columnas de imágenes que se revelan al hacer scroll. Efecto cinematográfico DHK.",
      recommended: true
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Hero Real - Con Tu Contenido Actual</h1>
          <p className="text-xl text-gray-600 mb-2">6 opciones usando tu contenido real: badge, títulos animados, "Construimos el futuro", 320 profesionales, etc.</p>
          <p className="text-sm text-gray-500">Haz click en MENU para ver el menú completo de cada opción. DEMO 6 requiere scroll para ver el efecto!</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {demos.map((demo, index) => {
            const DemoComponent = demo.component
            return (
              <div key={index} className={`bg-white rounded-xl shadow-xl overflow-hidden ${demo.recommended ? 'ring-4 ring-blue-500' : ''}`}>
                <div className={`p-6 border-b ${demo.recommended ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gray-800'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">OPCIÓN {index + 1}</h2>
                      <h3 className="text-xl font-semibold text-white/90 mt-1">{demo.title}</h3>
                      <p className="text-white/80 mt-2 text-sm">{demo.description}</p>
                    </div>
                    {demo.recommended && (
                      <div className="px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-full text-sm">
                        RECOMENDADA
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-[700px] relative overflow-hidden bg-gray-100">
                  <div className="scale-[0.35] origin-top-left w-[285%] h-[285%]">
                    <DemoComponent />
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t">
                  <div className="flex gap-3">
                    {index === 5 ? (
                      <Link
                        href="/hero-dhk-final"
                        className="flex-1 px-6 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors text-center"
                      >
                        🎯 Ver Demo Completo
                      </Link>
                    ) : (
                      <button className="flex-1 px-6 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors">
                        🎯 Usar esta opción
                      </button>
                    )}
                    <button className="px-6 py-3 border-2 border-gray-300 font-bold rounded-lg hover:border-blue-700 hover:text-blue-700 transition-colors">
                      Vista Completa
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center space-y-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-3">💡 Recomendaciones</h3>
            <p className="text-gray-700">
              Las opciones 1, 2, 5 y 6 son las más recomendadas porque combinan perfectamente el estilo minimalista moderno
              con todo tu contenido actual sin perder información importante. La opción 6 tiene el efecto de scroll revelador estilo DHK.
            </p>
          </div>

          <a href="/" className="inline-block px-8 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors">
            Volver al Home
          </a>
        </div>
      </div>
    </div>
  )
}

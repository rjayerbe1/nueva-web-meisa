"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { X, ArrowRight, ChevronDown } from "lucide-react"

const specialties = [
  'DISEÑO\nESTRUCTURAL',
  'FABRICACIÓN\nMETÁLICA',
  'MONTAJE\nESPECIALIZADO',
  'GESTIÓN DE\nPROYECTOS'
]

const menuItems = [
  { name: "Inicio", href: "/" },
  { name: "Proyectos", href: "/proyectos" },
  { name: "Servicios", href: "/servicios" },
  { name: "Nosotros", href: "/nosotros" },
  { name: "Contacto", href: "/contacto" },
]

export default function HeroDHKFinalPage() {
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
          className="text-white text-sm hover:opacity-70 tracking-wider uppercase font-lato font-bold"
        >
          menu
        </button>
      </nav>

      {/* Grid de 3 columnas */}
      <div className="sticky top-0 h-screen flex">
        {/* Columna Izquierda - Logo + Contenido (FONDO BLANCO) */}
        <div className="w-1/3 bg-white flex flex-col justify-center items-center p-12 border-r border-gray-200">
          <div className="max-w-md w-full space-y-6">
            {/* Logo Centrado */}
            <div className="flex justify-center">
              <Image
                src="/images/logo/logo-meisa.png"
                alt="MEISA"
                width={280}
                height={79}
                unoptimized
                priority
              />
            </div>

            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-lato font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                LÍDER EN COLOMBIA • DESDE 1996
              </div>
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
                  className="absolute inset-0 flex items-center justify-center text-center text-3xl font-bold text-gray-900 whitespace-pre-line leading-tight font-lato"
                >
                  {specialties[currentSpecialty]}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Descripción */}
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 mb-3 font-lato">
                Construimos el futuro de Colombia
              </p>
              <p className="text-sm text-gray-600 font-lato">
                Desde <span className="text-blue-700 font-semibold">1996</span> con{" "}
                <span className="text-blue-700 font-semibold">320 profesionales</span> especializados.
              </p>
            </div>

            {/* CTAs Mejorados */}
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/proyectos"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:bg-blue-800 hover:shadow-xl font-lato"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Ver proyectos
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <Link
                href="/contacto"
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-900 font-bold rounded-lg transition-all duration-300 hover:border-blue-700 hover:text-blue-700 hover:bg-blue-50 font-lato"
              >
                Solicitar cotización
              </Link>
            </div>

            {/* Indicador de scroll */}
            <div className="flex justify-center pt-6">
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
        </div>

        {/* Columna Central - Imágenes con Scroll Reveal */}
        <div className="w-1/3 relative border-r border-white/10">
          {/* Imagen Top */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80"
              alt="MEISA Proyecto - Construcción"
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
              alt="MEISA Proyecto - Estructura"
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
              alt="MEISA Proyecto - Edificio"
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
              alt="MEISA Proyecto - Arquitectura"
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
            className="fixed inset-0 bg-white z-50"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-gray-900 hover:text-blue-700 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="h-full flex items-center justify-center">
              <div className="max-w-6xl w-full px-12 grid grid-cols-2 gap-24">
                {/* Izquierda - Logo */}
                <div className="flex items-center justify-center">
                  <Image
                    src="/images/logo/logo-meisa.png"
                    alt="MEISA"
                    width={500}
                    height={142}
                    unoptimized
                  />
                </div>

                {/* Derecha - Menú */}
                <div className="flex flex-col justify-center space-y-6">
                  {menuItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                    >
                      <a
                        href={item.href}
                        className="group block text-gray-900 text-5xl font-bold hover:text-blue-700 transition-colors font-lato"
                      >
                        <span className="relative inline-block">
                          {item.name}
                          <motion.span
                            className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-700"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ originX: 0 }}
                          />
                        </span>
                      </a>
                    </motion.div>
                  ))}

                  {/* Info de contacto */}
                  <div className="pt-8 border-t border-gray-200 mt-8">
                    <p className="text-gray-600 text-sm font-lato">
                      <span className="font-bold">Email:</span> contacto@meisa.com.co
                    </p>
                    <p className="text-gray-600 text-sm font-lato mt-1">
                      <span className="font-bold">Tel:</span> +57 (2) 312 0050
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón para volver a demos */}
      <Link
        href="/hero-real-demos"
        className="fixed top-8 right-8 z-20 px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg font-lato"
      >
        ← Ver todos los demos
      </Link>
    </div>
  )
}

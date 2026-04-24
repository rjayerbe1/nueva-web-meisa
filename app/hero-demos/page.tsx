"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const menuItems = [
  { name: "Proyectos", href: "#proyectos" },
  { name: "Servicios", href: "#servicios" },
  { name: "Nosotros", href: "#nosotros" },
  { name: "Contacto", href: "#contacto" },
]

// DEMO 1 - Estilo Arqui9 Exacto
function HeroDemo1() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-black">
      {/* Navbar minimalista */}
      <nav className="fixed top-0 left-0 right-0 z-30 p-6">
        <div className="flex justify-between items-center">
          <div className="text-white text-sm tracking-[0.2em]">MEISA</div>
          <button
            onClick={() => setMenuOpen(true)}
            className="text-white text-sm tracking-[0.3em] hover:opacity-70 transition-opacity"
          >
            MENU
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
        </div>

        {/* Logo Central Grande */}
        <div className="relative z-10 text-center">
          <Image
            src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png"
            alt="MEISA"
            width={700}
            height={210}
            unoptimized
            className="mx-auto mb-8"
          />
          <p className="text-white text-xl tracking-[0.3em] opacity-70">METÁLICAS E INGENIERÍA</p>
        </div>
      </div>

      {/* Menú Fullscreen Estilo Arqui9 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Header del menú */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
              <div className="text-white text-sm tracking-[0.2em]">MEISA</div>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white text-sm tracking-[0.3em] hover:opacity-70 transition-opacity"
              >
                CLOSE
              </button>
            </div>

            {/* Contenido del menú */}
            <div className="h-full flex">
              {/* Lado izquierdo - Imagen */}
              <div className="w-1/2 relative">
                <div className="absolute inset-0 m-12 border border-white/20 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700"></div>
                </div>
              </div>

              {/* Lado derecho - Menú */}
              <div className="w-1/2 flex flex-col justify-center pr-24">
                <div className="space-y-8">
                  {menuItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                    >
                      <a
                        href={item.href}
                        className="block text-white text-7xl font-light hover:opacity-70 transition-opacity leading-tight"
                      >
                        {item.name}
                      </a>
                    </motion.div>
                  ))}
                </div>

                {/* Info de contacto */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-16 text-white/60 text-sm"
                >
                  <p>CONTACTO@MEISA.COM.CO</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// DEMO 2 - Estilo DHK
function HeroDemo2() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-black">
      {/* Navbar minimalista */}
      <nav className="fixed bottom-8 left-8 z-30 flex gap-8 items-center">
        <a href="#" className="text-white text-sm hover:opacity-70">home</a>
        <a href="#" className="text-white text-sm hover:opacity-70">projects</a>
        <a href="#" className="text-white text-sm hover:opacity-70">studio</a>
        <a href="#" className="text-white text-sm hover:opacity-70">contact</a>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white text-sm hover:opacity-70"
        >
          menu
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex">
        {/* Logo lado izquierdo ENORME */}
        <div className="w-1/2 flex items-center justify-center bg-black">
          <h1 className="text-white text-[12rem] font-bold leading-none tracking-tighter">
            MEISA
          </h1>
        </div>

        {/* Imagen lado derecho */}
        <div className="w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"></div>
        </div>
      </div>

      {/* Menú Split Screen */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-white text-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Logo lado izquierdo */}
            <div className="w-1/2 flex items-center justify-center">
              <h1 className="text-white text-[12rem] font-bold leading-none tracking-tighter">
                MEISA
              </h1>
            </div>

            {/* Menú lado derecho */}
            <div className="w-1/2 flex items-center justify-center">
              <div className="space-y-12">
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

// DEMO 3 - Minimalista Ultra Clean
function HeroDemo3() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-white">
      {/* Solo botón MENU flotante */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-8 right-8 z-30 text-xs tracking-[0.3em] font-bold hover:text-blue-700 transition-colors"
      >
        MENU
      </button>

      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <Image
            src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
            alt="MEISA"
            width={800}
            height={240}
            unoptimized
            className="mx-auto mb-12"
          />
          <p className="text-2xl text-gray-600 tracking-wide mb-8">
            Más de 28 años construyendo el futuro de Colombia
          </p>
          <div className="flex gap-4 justify-center text-sm text-gray-500">
            <span>600 Ton/Mes</span>
            <span>•</span>
            <span>3 Plantas</span>
            <span>•</span>
            <span>320+ Colaboradores</span>
          </div>
        </div>
      </div>

      {/* Menú Overlay Blanco */}
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
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <a href={item.href} className="block text-8xl font-light hover:text-blue-700 transition-colors tracking-tight">
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

// DEMO 4 - Editorial Negro con Imagen
function HeroDemo4() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="relative min-h-screen bg-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 p-8 flex justify-between items-center">
        <div className="text-white/40 text-xs tracking-[0.3em]">EST. 1996</div>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white text-xs tracking-[0.3em] hover:opacity-70"
        >
          MENU
        </button>
      </nav>

      {/* Hero */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Image
            src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png"
            alt="MEISA"
            width={900}
            height={270}
            unoptimized
            className="mx-auto mb-8"
          />
          <p className="text-white/60 tracking-[0.4em] text-sm">METÁLICAS E INGENIERÍA S.A.S.</p>
        </div>
      </div>

      {/* Menú con Preview de Imagen */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <div className="absolute top-8 left-8 right-8 flex justify-between">
              <div className="text-white/40 text-xs tracking-[0.3em]">NAVEGACIÓN</div>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white text-xs tracking-[0.3em]"
              >
                CLOSE
              </button>
            </div>

            <div className="h-full flex">
              {/* Menú lado izquierdo */}
              <div className="w-1/2 flex items-center justify-center">
                <div className="space-y-8">
                  {menuItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <a
                        href={item.href}
                        className="block text-white text-7xl font-light hover:opacity-50 transition-all tracking-tight"
                      >
                        {item.name}
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Imagen lado derecho */}
              <div className="w-1/2 flex items-center justify-center p-16">
                <AnimatePresence mode="wait">
                  {hoveredItem && (
                    <motion.div
                      key={hoveredItem}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="w-full h-96 bg-gradient-to-br from-blue-600 to-blue-800 rounded"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// DEMO 5 - Minimal con Hora y Ubicación
function HeroDemo5() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [time] = useState("17:24:34")

  return (
    <div className="relative min-h-screen bg-gray-950">
      {/* Navbar con hora */}
      <nav className="fixed top-0 left-0 right-0 z-30 p-6 flex justify-between items-center">
        <div className="text-white/40 text-xs tracking-wider">
          POPAYÁN {time} GMT -5
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white text-xs tracking-[0.3em] hover:opacity-70"
        >
          MENU
        </button>
      </nav>

      {/* Hero */}
      <div className="h-screen flex items-center justify-center">
        <Image
          src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png"
          alt="MEISA"
          width={750}
          height={225}
          unoptimized
        />
      </div>

      {/* Menú Panel Lateral */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-[500px] bg-gray-950 z-50 p-16 flex flex-col justify-between"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="self-end text-white text-xs tracking-[0.3em] mb-16"
              >
                CLOSE
              </button>

              <div className="space-y-8 flex-1 flex flex-col justify-center">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a href={item.href} className="block text-white text-5xl font-light hover:text-blue-400 transition-colors mb-2">
                      {item.name}
                    </a>
                    <p className="text-white/40 text-sm">Explorar más →</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-white/60 text-sm space-y-2">
                <p className="text-white">CONTACTO@MEISA.COM.CO</p>
                <p>+57 (2) 312 0050</p>
                <p>Popayán, Colombia</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// DEMO 6 - Split Vertical con Logo Grande
function HeroDemo6() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen">
      {/* Botón MENU flotante */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-8 right-8 z-30 text-xs tracking-[0.3em] font-bold hover:text-blue-700"
      >
        MENU
      </button>

      {/* Hero Split */}
      <div className="h-screen flex flex-col">
        {/* Parte superior - Logo */}
        <div className="h-1/2 bg-white flex items-center justify-center">
          <Image
            src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
            alt="MEISA"
            width={600}
            height={180}
            unoptimized
          />
        </div>

        {/* Parte inferior - Imagen */}
        <div className="h-1/2 bg-gradient-to-br from-gray-800 to-gray-600"></div>
      </div>

      {/* Menú Fullscreen Grid */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-white text-xs tracking-[0.3em]"
            >
              CLOSE
            </button>

            <div className="h-full flex items-center justify-center">
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
                      <p className="text-white/50 text-sm tracking-wider">VER MÁS</p>
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

// Página principal
export default function HeroDemosPage() {
  const demos = [
    {
      title: "Arqui9 Style - Exacto",
      component: HeroDemo1,
      description: "Logo arriba, menú fullscreen con imagen izquierda, texto derecha. Estilo editorial sofisticado.",
      color: "black"
    },
    {
      title: "DHK Style - Logo Gigante",
      component: HeroDemo2,
      description: "Logo ENORME lado izquierdo, imagen derecha. Navbar abajo. Super bold y moderno.",
      color: "black"
    },
    {
      title: "Ultra Clean White",
      component: HeroDemo3,
      description: "Fondo blanco, solo botón MENU, logo central grande. Minimalismo máximo.",
      color: "white"
    },
    {
      title: "Editorial con Hover Preview",
      component: HeroDemo4,
      description: "Menú negro con preview de imagen al hover. Muy interactivo y elegante.",
      color: "black"
    },
    {
      title: "Minimal con Info Extra",
      component: HeroDemo5,
      description: "Hora en navbar, panel lateral con contacto. Inspirado en Arqui9 + DHK.",
      color: "black"
    },
    {
      title: "Split Vertical Grid",
      component: HeroDemo6,
      description: "Hero dividido verticalmente, menú en grid. Muy visual y moderno.",
      color: "white"
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Hero + Navbar Completo - Demos Reales</h1>
          <p className="text-xl text-gray-600 mb-2">Inspiradas exactamente en Arqui9 y DHK</p>
          <p className="text-sm text-gray-500">Haz click en MENU en cada demo para ver el efecto completo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {demos.map((demo, index) => {
            const DemoComponent = demo.component
            return (
              <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
                  <h2 className="text-2xl font-bold text-white">DEMO {index + 1}</h2>
                  <h3 className="text-xl font-semibold text-white/90 mt-1">{demo.title}</h3>
                  <p className="text-white/80 mt-2 text-sm">{demo.description}</p>
                </div>

                <div className="h-[600px] relative overflow-hidden bg-gray-100">
                  <div className="scale-[0.4] origin-top-left w-[250%] h-[250%]">
                    <DemoComponent />
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t">
                  <div className="flex gap-3">
                    <button className="flex-1 px-6 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors">
                      Usar esta opción
                    </button>
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
          <a href="/navbar-demos" className="inline-block px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors mr-4">
            Ver Demos Anteriores
          </a>
          <a href="/" className="inline-block px-8 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors">
            Volver al Home
          </a>
        </div>
      </div>
    </div>
  )
}

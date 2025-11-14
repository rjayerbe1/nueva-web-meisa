"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Menu as MenuIcon, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"

const menuItems = ["Inicio", "Servicios", "Proyectos", "Nosotros", "Contacto"]

// OPCIÓN 1 - Ultra Minimalista
function Demo1() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-transparent">
        <div className="container mx-auto px-6 py-4 flex justify-end">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-sm font-bold tracking-widest hover:text-blue-700 transition-colors"
          >
            MENU
          </button>
        </div>
      </nav>

      {/* Hero con logo grande */}
      <div className="h-screen flex items-center justify-center">
        <Image src="/images/logo/logo-meisa.png" alt="MEISA" width={400} height={120} unoptimized />
      </div>

      {/* Menú Overlay Fullscreen */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-white"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="space-y-6">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <a href="#" className="block text-white text-6xl font-bold hover:text-blue-400 transition-colors">
                    {item}
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

// OPCIÓN 2 - Arqui9 Style
function Demo2() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Image src="/images/logo/logo-meisa.png" alt="MEISA" width={120} height={35} unoptimized />
          <button
            onClick={() => setMenuOpen(true)}
            className="text-sm font-bold tracking-widest"
          >
            MENU
          </button>
        </div>
      </nav>

      {/* Panel lateral derecho */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 w-96 bg-white z-50 p-12"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-8 right-8"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mt-16 space-y-8">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a href="#" className="block text-4xl font-bold hover:text-blue-700 transition-colors">
                      {item}
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// OPCIÓN 3 - Minimalista con Línea
function Demo3() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b-2 border-blue-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Image src="/images/logo/logo-meisa.png" alt="MEISA" width={100} height={30} unoptimized />
          <button
            onClick={() => setMenuOpen(true)}
            className="text-sm font-bold tracking-widest hover:text-blue-700 transition-colors"
          >
            MENU
          </button>
        </div>
      </nav>

      {/* Dropdown desde arriba */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="fixed top-16 left-0 right-0 bg-white z-40 overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-6 py-12">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-6 right-8"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-2 gap-8">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a href="#" className="block text-5xl font-bold hover:text-blue-700 transition-colors">
                      {item}
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

// OPCIÓN 4 - Split Screen
function Demo4() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen bg-gray-100">
      {/* Navbar minimal */}
      <nav className="fixed top-0 right-0 z-40 p-8">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-sm font-bold tracking-widest"
        >
          MENU
        </button>
      </nav>

      {/* Hero con logo */}
      <div className="h-screen flex items-center justify-center">
        <Image src="/images/logo/logo-meisa.png" alt="MEISA" width={500} height={150} unoptimized />
      </div>

      {/* Split Screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed inset-0 z-50 flex"
          >
            {/* Lado izquierdo - Menú */}
            <div className="w-1/2 bg-blue-900 p-16 flex flex-col justify-center">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-8 left-8 text-white"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="space-y-8">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a href="#" className="block text-white text-6xl font-bold hover:text-blue-300 transition-colors">
                      {item}
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Lado derecho - Imagen */}
            <div className="w-1/2 bg-gray-800"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// OPCIÓN 5 - Contacto Rápido
function Demo5() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-sm font-bold tracking-widest"
          >
            MENU
          </button>
          <a href="#contacto" className="text-sm font-bold tracking-widest hover:text-blue-700">
            CONTACTO
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="h-screen flex items-center justify-center">
        <Image src="/images/logo/logo-meisa.png" alt="MEISA" width={450} height={135} unoptimized />
      </div>

      {/* Overlay con info de contacto */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-900 to-blue-700 z-50 flex items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-white"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="text-center space-y-12">
              <div className="space-y-6">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a href="#" className="block text-white text-6xl font-bold hover:text-blue-200 transition-colors">
                      {item}
                    </a>
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 text-white">
                <p className="text-3xl font-bold mb-4">+57 (2) 312 0050</p>
                <p className="text-xl">contacto@meisa.com.co</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// OPCIÓN 6 - Hamburguesa Clásica
function Demo6() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <Image src="/images/logo/logo-meisa.png" alt="MEISA" width={120} height={35} unoptimized />
          <div className="w-10"></div>
        </div>
      </nav>

      {/* Panel lateral izquierdo */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 p-8"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="mb-12"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a href="#" className="block text-3xl font-bold hover:text-blue-700 transition-colors py-2">
                      {item}
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// OPCIÓN 7 - Transparente Elegante
function Demo7() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen bg-gradient-to-br from-gray-900 to-gray-700">
      {/* Navbar transparente */}
      <nav className="fixed top-0 right-0 z-40 p-8">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white text-sm font-bold tracking-widest hover:text-blue-300 transition-colors"
        >
          MENU
        </button>
      </nav>

      {/* Hero */}
      <div className="h-screen flex items-center justify-center">
        <Image src="/images/logo/logo-meisa-white.png" alt="MEISA" width={500} height={150} unoptimized />
      </div>

      {/* Overlay con blur */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/10 backdrop-blur-2xl z-50 flex items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-white"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="space-y-8">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <a href="#" className="block text-white text-7xl font-bold hover:text-blue-300 transition-all hover:scale-105">
                    {item}
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

// OPCIÓN 8 - Dos Botones
function Demo8() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-sm font-bold tracking-widest hover:text-blue-700"
          >
            MENU
          </button>
          <a href="#contacto" className="px-6 py-2 bg-blue-700 text-white text-sm font-bold tracking-widest hover:bg-blue-800 transition-colors">
            CONTACTO
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="h-screen flex items-center justify-center">
        <Image src="/images/logo/logo-meisa.png" alt="MEISA" width={500} height={150} unoptimized />
      </div>

      {/* Grid fullscreen */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 p-16"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="h-full flex items-center justify-center">
              <div className="grid grid-cols-2 gap-12 max-w-4xl">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <a href="#" className="block">
                      <h3 className="text-5xl font-bold hover:text-blue-700 transition-colors mb-2">
                        {item}
                      </h3>
                      <p className="text-gray-500 text-sm">Explora más</p>
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

// OPCIÓN 9 - Minimal con Redes
function Demo9() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-sm font-bold tracking-widest"
          >
            MENU
          </button>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-700 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-blue-700 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-blue-700 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="h-screen flex items-center justify-center">
        <Image src="/images/logo/logo-meisa.png" alt="MEISA" width={450} height={135} unoptimized />
      </div>

      {/* Panel desde arriba */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 bg-white z-50 shadow-2xl"
          >
            <div className="container mx-auto px-6 py-16">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-6 right-8"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-3 gap-8">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a href="#" className="block text-4xl font-bold hover:text-blue-700 transition-colors">
                      {item}
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

// OPCIÓN 10 - Editorial Style
function Demo10() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen bg-white">
      {/* Navbar flotante */}
      <nav className="fixed top-8 right-8 z-40">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-xs font-bold tracking-[0.3em] hover:text-blue-700 transition-colors"
        >
          MENU
        </button>
      </nav>

      {/* Hero - Logo como título editorial */}
      <div className="h-screen flex items-center justify-center px-16">
        <div className="text-center">
          <Image src="/images/logo/logo-meisa.png" alt="MEISA" width={600} height={180} unoptimized className="mb-8" />
          <p className="text-xl text-gray-600 tracking-wide">METÁLICAS E INGENIERÍA S.A.S.</p>
        </div>
      </div>

      {/* Overlay negro editorial */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-white"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="space-y-12">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                >
                  <a href="#" className="block text-white text-8xl font-light hover:text-gray-400 transition-all tracking-tight leading-none">
                    {item}
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

// Página principal de demos
export default function NavbarDemosPage() {
  const demos = [
    { title: "Ultra Minimalista", component: Demo1, description: "Logo en hero, overlay fullscreen negro, letras gigantes" },
    { title: "Arqui9 Style", component: Demo2, description: "Panel lateral derecho, logo en navbar, elegante" },
    { title: "Minimalista con Línea", component: Demo3, description: "Línea azul distintiva, dropdown desde arriba" },
    { title: "Split Screen", component: Demo4, description: "Menú divide pantalla, impacto visual fuerte" },
    { title: "Contacto Rápido", component: Demo5, description: "Dos botones en navbar, info contacto en menú" },
    { title: "Hamburguesa Clásica", component: Demo6, description: "Icono hamburguesa, panel lateral izquierdo" },
    { title: "Transparente Elegante", component: Demo7, description: "Navbar transparente, blur effect, muy moderno" },
    { title: "Dos Botones", component: Demo8, description: "Menu + Contacto, grid layout en fullscreen" },
    { title: "Minimal con Redes", component: Demo9, description: "Redes sociales visibles, panel desde arriba" },
    { title: "Editorial Style", component: Demo10, description: "Estilo revista, overlay negro, letras ultra grandes" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Navbar Minimalista - Demos Interactivas</h1>
          <p className="text-xl text-gray-600">Elige tu opción favorita. Cada demo es completamente funcional.</p>
          <p className="text-sm text-gray-500 mt-2">Haz click en "MENU" en cada demo para ver cómo funciona</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {demos.map((demo, index) => {
            const DemoComponent = demo.component
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b bg-gray-50">
                  <h2 className="text-2xl font-bold text-blue-700">OPCIÓN {index + 1}</h2>
                  <h3 className="text-xl font-semibold mt-1">{demo.title}</h3>
                  <p className="text-gray-600 mt-2">{demo.description}</p>
                </div>

                <div className="h-96 relative overflow-hidden bg-gray-100">
                  <div className="scale-50 origin-top-left w-[200%] h-[200%]">
                    <DemoComponent />
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t">
                  <button className="w-full px-6 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors">
                    Elegir esta opción
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="inline-block px-8 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors">
            Volver al Home
          </a>
        </div>
      </div>
    </div>
  )
}

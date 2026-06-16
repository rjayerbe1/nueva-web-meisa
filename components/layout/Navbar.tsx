'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export interface NavbarMenuItem {
  name: string
  href: string
  image: string
  target?: string
}

const DEFAULT_MENU_ITEMS: NavbarMenuItem[] = [
  { name: 'Inicio', href: '/', image: 'https://storage.googleapis.com/meisa-imagenes/site/proyectos/puente-destacado.jpg' },
  { name: 'Empresa', href: '/empresa', image: 'https://storage.googleapis.com/meisa-imagenes/site/about/meisa-planta-aerea.jpg' },
  { name: 'Servicios', href: '/servicios', image: 'https://storage.googleapis.com/meisa-imagenes/site/hero/estructura-perspectiva.jpg' },
  { name: 'Proyectos', href: '/proyectos', image: 'https://storage.googleapis.com/meisa-imagenes/site/hero/ciclopuente-atardecer.jpg' },
  { name: 'Trayectoria', href: '/trayectoria', image: 'https://storage.googleapis.com/meisa-imagenes/site/hero/coliseo-estructuras-rojas.jpg' },
  { name: 'Procesos & Tecnologías', href: '/procesos-tecnologias', image: 'https://storage.googleapis.com/meisa-imagenes/site/hero/montaje-grua.jpg' },
  { name: 'Calidad', href: '/calidad', image: 'https://storage.googleapis.com/meisa-imagenes/site/hero/techo-metalico.jpg' },
  { name: 'Contacto', href: '/contacto', image: 'https://storage.googleapis.com/meisa-imagenes/site/hero/hero-construccion-industrial.jpg' },
]

interface NavbarProps {
  items?: NavbarMenuItem[]
}

export function Navbar({ items }: NavbarProps = {}) {
  const menuItems = items && items.length > 0 ? items : DEFAULT_MENU_ITEMS
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const pathname = usePathname()

  const activeIndex = hoveredIndex ?? 0
  const activeImage = menuItems[activeIndex]?.image ?? menuItems[0]?.image

  // Cerrar el menú con Escape (accesibilidad por teclado)
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <>
      {/* Menu trigger */}
      <nav className="fixed top-6 right-6 md:top-8 md:right-8 z-50">
        <button
          onClick={() => setMenuOpen(true)}
          className="group flex items-center gap-3 bg-slate-950 text-white px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-lato font-bold border border-white/20 hover:bg-white hover:text-slate-950 hover:border-white transition-colors duration-300"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
        >
          <span className="flex flex-col gap-[5px] w-4">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
            <span className="h-px w-2/3 bg-current" />
          </span>
          Menu
        </button>
      </nav>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 bg-slate-950 text-white z-50 overflow-hidden"
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex items-center justify-between z-20">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png"
                alt="MEISA"
                width={120}
                height={34}
                unoptimized
                className="md:hidden w-[80px] sm:w-[90px] h-auto"
              />
              <span className="hidden md:block" aria-hidden="true" />
              <button
                onClick={() => setMenuOpen(false)}
                className="group flex items-center gap-3 px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-lato font-bold border border-white/20 hover:bg-white hover:text-slate-950 hover:border-white transition-colors duration-300"
                aria-label="Cerrar menú"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="3" y1="3" x2="13" y2="13" />
                  <line x1="13" y1="3" x2="3" y2="13" />
                </svg>
                Close
              </button>
            </div>

            <div className="h-full flex flex-col md:flex-row">
              {/* Left: rotating image based on hover */}
              <div className="hidden md:block w-1/2 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeImage}
                      alt=""
                      fill
                      sizes="50vw"
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-slate-950/10 to-slate-950/50" />
                    <div className="absolute inset-0 bg-slate-950/20" />
                  </motion.div>
                </AnimatePresence>

                {/* Current section label (bottom of image) */}
                <div className="absolute bottom-8 left-8 md:left-10 z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-white/60 font-lato text-[11px] uppercase tracking-[0.22em]">
                        {String(activeIndex + 1).padStart(2, '0')} — {menuItems[activeIndex].name}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right: menu items */}
              <div className="w-full md:w-1/2 flex flex-col px-8 md:px-14 lg:px-20 pt-24 pb-32 md:pt-10 md:pb-28 relative">
                {/* Logo en esquina superior-izquierda de la columna oscura (solo desktop) */}
                <Image
                  src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png"
                  alt="MEISA"
                  width={140}
                  height={40}
                  unoptimized
                  className="hidden md:block w-[80px] lg:w-[100px] xl:w-[120px] 2xl:w-[140px] h-auto opacity-90 mb-6 lg:mb-10"
                />
                <ul className="space-y-1 md:space-y-1.5 lg:space-y-2 flex-1 flex flex-col justify-center">
                  {menuItems.map((item, i) => {
                    const isActive = pathname === item.href
                    return (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onFocus={() => setHoveredIndex(i)}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`group relative flex items-baseline gap-3 md:gap-4 lg:gap-6 font-bebas uppercase leading-[0.95] tracking-tight transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          <span className="font-lato font-bold text-[10px] md:text-[11px] lg:text-xs tracking-[0.22em] text-white/30 group-hover:text-white/70 transition-colors duration-300">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
                            {item.name}
                          </span>
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>

                {/* Bottom info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-8 md:bottom-10 left-8 md:left-14 lg:left-20 right-8 md:right-14 lg:right-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
                >
                  <div>
                    <p className="text-white/30 font-lato text-[10px] uppercase tracking-[0.22em] mb-2">
                      Contacto
                    </p>
                    <a
                      href="mailto:contacto@meisa.com.co"
                      className="text-white font-lato font-bold text-sm md:text-base hover:text-white/70 transition-colors duration-300"
                    >
                      contacto@meisa.com.co
                    </a>
                  </div>
                  <div className="flex gap-5 text-white/40">
                    <a
                      href="https://www.facebook.com/Metalicaseingenieria"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/meisa.sas"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.849.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/meisa-sas"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

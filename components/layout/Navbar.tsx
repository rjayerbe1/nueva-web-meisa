'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Facebook, Instagram, Linkedin, Youtube, Globe } from 'lucide-react'

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

export interface NavbarSocialItem {
  red: string
  url: string
  label?: string | null
  icono?: string | null
}

const DEFAULT_SOCIAL: NavbarSocialItem[] = [
  { red: 'facebook', url: 'https://www.facebook.com/Metalicaseingenieria', icono: 'Facebook' },
  { red: 'instagram', url: 'https://www.instagram.com/meisa.sas', icono: 'Instagram' },
  { red: 'linkedin', url: 'https://www.linkedin.com/company/meisa-sas', icono: 'Linkedin' },
  { red: 'twitter', url: 'https://x.com/meisa_sas', icono: 'Twitter' },
  { red: 'youtube', url: 'https://www.youtube.com/@MEISA_SAS', icono: 'Youtube' },
]

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

function resolveSocialIcon(s: NavbarSocialItem): React.ComponentType<{ className?: string }> {
  const key = `${s.red} ${s.icono ?? ''} ${s.url}`.toLowerCase()
  if (key.includes('facebook')) return Facebook
  if (key.includes('instagram')) return Instagram
  if (key.includes('linkedin')) return Linkedin
  if (key.includes('youtube')) return Youtube
  if (key.includes('twitter') || key.includes('x.com')) return XIcon
  return Globe
}

interface NavbarProps {
  items?: NavbarMenuItem[]
  social?: NavbarSocialItem[]
}

export function Navbar({ items, social }: NavbarProps = {}) {
  const menuItems = items && items.length > 0 ? items : DEFAULT_MENU_ITEMS
  const socialLinks = social && social.length > 0 ? social : DEFAULT_SOCIAL
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
                    {socialLinks.map((s) => {
                      const Icon = resolveSocialIcon(s)
                      return (
                        <a
                          key={s.red || s.url}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label || s.red}
                          className="hover:text-white transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      )
                    })}
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

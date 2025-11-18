"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const menuItems = [
  { name: "Inicio", href: "/" },
  { name: "Proyectos", href: "/proyectos" },
  { name: "Servicios", href: "/servicios" },
  { name: "Empresa", href: "/empresa" },
  { name: "Trayectoria", href: "/trayectoria" },
  { name: "Procesos & Tecnologías", href: "/tecnologia" },
  { name: "Políticas", href: "/calidad" },
  { name: "Contacto", href: "/contacto" },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Navbar minimal - botón MENU mejorado con hamburguesa */}
      <nav className="fixed top-8 right-8 z-50">
        <button
          onClick={() => setMenuOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group flex items-center gap-2 bg-white px-3 py-2.5 text-xs hover:bg-gray-900 transition-all duration-300 tracking-wider uppercase font-lato font-bold shadow-lg border border-gray-200 hover:border-gray-900"
        >
          {/* Icono hamburguesa animado */}
          <div className="flex flex-col gap-1 w-4">
            <motion.span
              animate={{
                rotate: isHovered ? 45 : 0,
                y: isHovered ? 4 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="h-0.5 w-full bg-gray-900 group-hover:bg-white transition-colors duration-300"
            />
            <motion.span
              animate={{
                opacity: isHovered ? 0 : 1,
                scaleX: isHovered ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="h-0.5 w-full bg-gray-900 group-hover:bg-white transition-colors duration-300"
            />
            <motion.span
              animate={{
                rotate: isHovered ? -45 : 0,
                y: isHovered ? -4 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="h-0.5 w-full bg-gray-900 group-hover:bg-white transition-colors duration-300"
            />
          </div>

          <span className="text-gray-900 group-hover:text-white transition-colors duration-300">
            menu
          </span>
        </button>
      </nav>

      {/* Menú Fullscreen - Estilo Arqui9 con imagen decorativa */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 overflow-hidden"
          >
            {/* Logo centrado arriba - SOLO DESKTOP */}
            <div className="hidden md:block absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
              <Image
                src="/images/logo/logo-meisa.png"
                alt="MEISA"
                width={180}
                height={51}
                unoptimized
              />
            </div>

            {/* Botón Close - Mismo estilo y posición que el botón MENU */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 z-50 group flex items-center gap-2 bg-white px-3 py-2.5 text-xs hover:bg-gray-900 transition-all duration-300 tracking-wider uppercase font-lato font-bold shadow-lg border border-gray-200 hover:border-gray-900"
            >
              {/* Icono X animado */}
              <div className="flex items-center justify-center w-4 h-4">
                <svg className="w-full h-full" viewBox="0 0 16 16" fill="none">
                  <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="2" className="text-gray-900 group-hover:text-white transition-colors duration-300"/>
                  <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="2" className="text-gray-900 group-hover:text-white transition-colors duration-300"/>
                </svg>
              </div>
              <span className="text-gray-900 group-hover:text-white transition-colors duration-300">
                close
              </span>
            </button>

            <div className="h-full flex flex-col md:flex-row">
              {/* Izquierda - Contenedor Visual con formas decorativas - SOLO DESKTOP */}
              <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white p-12">
                {/* Contenedor principal - Tamaño reducido */}
                <div className="relative w-full h-full max-w-[500px] max-h-[600px]">
                  {/* Marco cuadrado decorativo exterior - con rotación sutil */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0 border border-gray-200"
                  />

                  {/* Línea diagonal 1 - con animación de dibujo */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                      <motion.line
                        x1="0" y1="100" x2="100" y2="0"
                        stroke="currentColor"
                        strokeWidth="0.2"
                        className="text-gray-300"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                      />
                    </svg>
                  </motion.div>

                  {/* Línea diagonal 2 - con animación de dibujo inversa */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                      <motion.line
                        x1="0" y1="0" x2="100" y2="100"
                        stroke="currentColor"
                        strokeWidth="0.2"
                        className="text-gray-300"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.6, duration: 1, ease: "easeInOut" }}
                      />
                    </svg>
                  </motion.div>

                  {/* Imagen de fondo dentro del contenedor - Más pequeña con inset-16 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                    whileHover={{ scale: 1.02 }}
                    className="absolute inset-16 overflow-hidden cursor-pointer"
                  >
                    <Image
                      src="/images/hero/centro-comercial.webp"
                      alt="MEISA Proyectos"
                      fill
                      className="object-cover transition-transform duration-700"
                    />
                    {/* Overlay sutil con animación de hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-900/10"
                      whileHover={{ opacity: 0.7 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  {/* Pequeño marco decorativo en esquina superior - animado desde fuera */}
                  <motion.div
                    initial={{ opacity: 0, x: -30, y: -30 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-blue-700"
                  />

                  {/* Pequeño marco decorativo en esquina inferior - animado desde fuera */}
                  <motion.div
                    initial={{ opacity: 0, x: 30, y: 30 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-blue-700"
                  />

                  {/* Punto decorativo animado en esquina superior derecha */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.4 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-blue-700 rounded-full"
                  />

                  {/* Punto decorativo animado en esquina inferior izquierda */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                    className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-700 rounded-full"
                  />
                </div>
              </div>

              {/* Derecha - Menú */}
              <div className="w-full md:w-1/2 flex flex-col justify-between md:justify-center px-8 md:px-20 py-20 md:py-0 relative z-10">
                {/* Logo en móvil - arriba */}
                <div className="md:hidden flex justify-center mb-8">
                  <Image
                    src="/images/logo/logo-meisa.png"
                    alt="MEISA"
                    width={160}
                    height={46}
                    unoptimized
                  />
                </div>

                {/* Items del menú */}
                <div className="space-y-4 md:space-y-4 flex-1 md:flex-initial flex flex-col justify-center">
                  {menuItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`group flex items-center gap-3 md:gap-4 text-gray-900 text-3xl md:text-6xl font-bold hover:text-blue-700 transition-all duration-300 font-lato ${
                          pathname === item.href ? 'text-blue-700' : ''
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {/* Icono decorativo pequeño */}
                        <span className="w-5 h-6 md:w-8 md:h-10 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg viewBox="0 0 32 40" fill="none" className="w-full h-full">
                            <path d="M16 0L32 10V30L16 40L0 30V10L16 0Z" fill="currentColor" fillOpacity="0.1" />
                            <path d="M16 0L32 10M16 0L0 10M16 0V40M32 10V30M32 10L0 10M0 10V30M32 30L16 40M32 30L0 30M0 30L16 40" stroke="currentColor" strokeWidth="1" />
                          </svg>
                        </span>
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Info de contacto abajo - SOLO DESKTOP */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="hidden md:block absolute bottom-12 right-20"
                >
                  <a
                    href="mailto:contacto@meisa.com.co"
                    className="text-gray-500 hover:text-blue-700 text-sm font-lato uppercase tracking-wide transition-colors duration-300"
                  >
                    contacto@meisa.com.co
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Forma decorativa de fondo para desktop - Diseño estructural */}
            <div className="hidden md:block absolute bottom-0 right-0 w-1/2 h-64 pointer-events-none overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute inset-0"
              >
                <svg
                  className="w-full h-full"
                  viewBox="0 0 600 256"
                  fill="none"
                  preserveAspectRatio="xMaxYMax meet"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Cuadrícula de fondo */}
                  <defs>
                    <pattern id="grid-desktop" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e40af" strokeWidth="0.5" opacity="0.08"/>
                    </pattern>
                  </defs>

                  {/* Aplicar cuadrícula */}
                  <rect width="600" height="256" fill="url(#grid-desktop)" />

                  {/* Líneas estructurales horizontales */}
                  <line x1="0" y1="200" x2="600" y2="200" stroke="#1e40af" strokeWidth="1" opacity="0.12"/>
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#1e40af" strokeWidth="0.5" opacity="0.08"/>
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#1e40af" strokeWidth="0.5" opacity="0.06"/>

                  {/* Líneas verticales principales */}
                  <line x1="100" y1="120" x2="100" y2="256" stroke="#1e40af" strokeWidth="1" opacity="0.1"/>
                  <line x1="250" y1="80" x2="250" y2="256" stroke="#1e40af" strokeWidth="1.5" opacity="0.15"/>
                  <line x1="400" y1="100" x2="400" y2="256" stroke="#1e40af" strokeWidth="1" opacity="0.1"/>
                  <line x1="550" y1="120" x2="550" y2="256" stroke="#1e40af" strokeWidth="1" opacity="0.1"/>

                  {/* Rectángulos estructurales grandes */}
                  <rect x="60" y="170" width="80" height="80" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.1"/>
                  <rect x="210" y="130" width="80" height="80" fill="none" stroke="#1e40af" strokeWidth="1.5" opacity="0.12"/>
                  <rect x="360" y="170" width="80" height="80" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.1"/>
                  <rect x="510" y="190" width="60" height="60" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.08"/>

                  {/* Pequeños cuadrados de detalle */}
                  <rect x="150" y="210" width="30" height="30" fill="#1e40af" opacity="0.06"/>
                  <rect x="320" y="210" width="30" height="30" fill="#1e40af" opacity="0.06"/>
                  <rect x="480" y="220" width="25" height="25" fill="#1e40af" opacity="0.05"/>

                  {/* Líneas diagonales de soporte */}
                  <line x1="140" y1="200" x2="180" y2="150" stroke="#1e40af" strokeWidth="0.5" opacity="0.08"/>
                  <line x1="290" y1="200" x2="330" y2="130" stroke="#1e40af" strokeWidth="0.5" opacity="0.1"/>
                  <line x1="440" y1="200" x2="480" y2="150" stroke="#1e40af" strokeWidth="0.5" opacity="0.08"/>

                  {/* Marco decorativo grande en esquina */}
                  <rect x="450" y="40" width="120" height="120" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.08"/>

                  {/* Círculos técnicos pequeños */}
                  <circle cx="250" cy="80" r="4" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.1"/>
                  <circle cx="540" cy="100" r="3" fill="#1e40af" opacity="0.06"/>

                  {/* Gradiente de fondo para fade out */}
                  <rect width="600" height="256" fill="url(#structural_gradient_desktop)" />

                  <defs>
                    <linearGradient
                      id="structural_gradient_desktop"
                      x1="300"
                      y1="0"
                      x2="300"
                      y2="256"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0.95"/>
                      <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.3"/>
                      <stop offset="1" stopColor="#ffffff" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </div>

            {/* Forma decorativa de fondo para móvil - Diseño estructural */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 h-56 pointer-events-none overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute inset-0"
              >
                <svg
                  className="w-full h-full"
                  viewBox="0 0 375 224"
                  fill="none"
                  preserveAspectRatio="xMidYMax meet"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Cuadrícula de fondo */}
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e40af" strokeWidth="0.5" opacity="0.1"/>
                    </pattern>
                  </defs>

                  {/* Aplicar cuadrícula */}
                  <rect width="375" height="224" fill="url(#grid)" />

                  {/* Líneas estructurales horizontales */}
                  <line x1="0" y1="180" x2="375" y2="180" stroke="#1e40af" strokeWidth="1" opacity="0.15"/>
                  <line x1="0" y1="140" x2="375" y2="140" stroke="#1e40af" strokeWidth="0.5" opacity="0.1"/>

                  {/* Líneas verticales principales */}
                  <line x1="50" y1="100" x2="50" y2="224" stroke="#1e40af" strokeWidth="1" opacity="0.15"/>
                  <line x1="187.5" y1="80" x2="187.5" y2="224" stroke="#1e40af" strokeWidth="1.5" opacity="0.2"/>
                  <line x1="325" y1="100" x2="325" y2="224" stroke="#1e40af" strokeWidth="1" opacity="0.15"/>

                  {/* Rectángulos estructurales */}
                  <rect x="30" y="160" width="60" height="60" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.12"/>
                  <rect x="157.5" y="120" width="60" height="60" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.15"/>
                  <rect x="285" y="160" width="60" height="60" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.12"/>

                  {/* Pequeños cuadrados de detalle */}
                  <rect x="100" y="190" width="20" height="20" fill="#1e40af" opacity="0.08"/>
                  <rect x="255" y="190" width="20" height="20" fill="#1e40af" opacity="0.08"/>

                  {/* Líneas diagonales de soporte */}
                  <line x1="90" y1="180" x2="120" y2="140" stroke="#1e40af" strokeWidth="0.5" opacity="0.1"/>
                  <line x1="255" y1="180" x2="285" y2="140" stroke="#1e40af" strokeWidth="0.5" opacity="0.1"/>

                  {/* Gradiente de fondo */}
                  <rect width="375" height="224" fill="url(#structural_gradient)" />

                  <defs>
                    <linearGradient
                      id="structural_gradient"
                      x1="187.5"
                      y1="0"
                      x2="187.5"
                      y2="224"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0.9"/>
                      <stop offset="1" stopColor="#ffffff" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
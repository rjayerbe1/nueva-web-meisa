"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Building2, Cpu, Award, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Servicios", href: "/servicios" },
  { name: "Proyectos", href: "/proyectos" },
  {
    name: "Nosotros",
    href: "#",
    children: [
      {
        name: "Nuestra Empresa",
        href: "/empresa",
        description: "Desde 1996 en Popayán, 320 colaboradores",
        icon: "Building2"
      },
      {
        name: "Trayectoria",
        href: "/trayectoria",
        description: "Nuestra historia y proyectos ejecutados",
        icon: "History"
      },
      {
        name: "Tecnología e Infraestructura",
        href: "/tecnologia",
        description: "10,400 m² de capacidad productiva",
        icon: "Cpu"
      },
      {
        name: "Políticas",
        href: "/calidad",
        description: "SIG - Calidad, seguridad y cumplimiento",
        icon: "Award"
      },
    ]
  },
  { name: "Contacto", href: "/contacto" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Main Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-lg"
          : "bg-white shadow-md"
      )}>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-start h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group py-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Image
                  src="/images/logo/logo-meisa.png"
                  alt="MEISA - Metálicas e Ingeniería"
                  width={135}
                  height={38}
                  priority
                  unoptimized
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 ml-8">
              {navigation.map((item, index) => (
                <motion.div 
                  key={item.name} 
                  className="relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.children ? (
                    <motion.div
                      className="relative"
                      whileHover="hover"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <button className={cn(
                        "text-gray-700 hover:text-blue-700 transition-all duration-300 font-lato font-bold uppercase text-base py-2 px-4 rounded-lg relative",
                        item.children.some(child => pathname.startsWith(child.href)) && "text-blue-700"
                      )}>
                        {item.name}
                      </button>
                      
                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            style={{ originY: 0 }}
                            className="absolute top-full left-4 w-64 bg-white rounded-b-xl shadow-lg border-x border-b border-gray-200 overflow-visible -mt-2"
                          >
                            {/* Borde superior animado */}
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              exit={{ scaleX: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              style={{ originX: 0 }}
                              className="absolute top-0 left-0 right-0 h-1 bg-blue-700"
                            />
                            <div className="px-4 py-3 border-b border-gray-100 mt-2">
                              <h3 className="text-gray-700 font-lato font-bold text-sm uppercase tracking-wide">Conócenos</h3>
                            </div>
                            
                            <div className="p-2">
                              {item.children.map((child, childIndex) => {
                                const IconComponent = child.icon === 'Building2' ? Building2 :
                                                     child.icon === 'Cpu' ? Cpu :
                                                     child.icon === 'Award' ? Award :
                                                     child.icon === 'History' ? History : Building2;

                                return (
                                  <motion.div
                                    key={child.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: childIndex * 0.05 }}
                                  >
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        "relative flex items-center gap-3 px-3 py-3 text-gray-700 rounded-lg transition-all duration-300 group overflow-visible",
                                        "hover:text-blue-700 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/60 hover:shadow-md",
                                        pathname.startsWith(child.href) && "bg-gradient-to-r from-blue-50 to-blue-100/60 text-blue-700 shadow-md"
                                      )}
                                      onClick={() => setDropdownOpen(false)}
                                    >
                                      {/* Efecto ping/radar en hover */}
                                      <div className="absolute inset-0 bg-blue-500 rounded-lg animate-ping opacity-0 group-hover:opacity-20 -z-10"></div>

                                      <IconComponent className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all duration-300 flex-shrink-0" />
                                      <div className="font-lato font-semibold text-sm transition-all duration-300">
                                        {child.name}
                                      </div>
                                    </Link>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div whileHover="hover" className="inline-block">
                      <Link
                        href={item.href}
                        className={cn(
                          "text-gray-700 hover:text-blue-700 transition-all duration-300 font-lato font-bold uppercase text-base py-2 px-4 rounded-lg relative block",
                          (pathname === item.href ||
                           (item.href === "/proyectos" && pathname.startsWith("/proyectos"))) && "text-blue-700"
                        )}
                      >
                        <span className="relative inline-block">
                          {item.name}
                          {/* Underline hover effect - grows from left to right */}
                          {!(pathname === item.href || (item.href === "/proyectos" && pathname.startsWith("/proyectos"))) && (
                            <motion.span
                              className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-700"
                              initial={{ scaleX: 0 }}
                              variants={{
                                hover: { scaleX: 1 }
                              }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              style={{ originX: 0 }}
                            />
                          )}
                          {/* Active state underline */}
                          {(pathname === item.href ||
                            (item.href === "/proyectos" && pathname.startsWith("/proyectos"))) && (
                            <motion.span
                              className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-700"
                              layoutId="activeNavTab"
                            />
                          )}
                        </span>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Mobile menu button */}
            <motion.button
              className="lg:hidden ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm border border-gray-200 bg-white/90"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-6 space-y-4">

                {navigation.map((item, index) => (
                  <motion.div 
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.children ? (
                      <div className="space-y-2">
                        <div className="font-lato font-bold uppercase text-gray-900 text-lg border-b border-gray-200 pb-2">
                          {item.name}
                        </div>
                        <div className="grid grid-cols-1 gap-2 pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200",
                                pathname.startsWith(child.href) && "bg-blue-50 text-blue-600"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className="font-lato font-bold uppercase text-base">{child.name}</div>
                              <div className="text-xs text-gray-500 mt-1 font-lato">{child.description}</div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-lato font-bold uppercase text-base",
                          (pathname === item.href ||
                           (item.href === "/proyectos" && pathname.startsWith("/proyectos"))) && "bg-blue-50 text-blue-600"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Phone, Mail, MapPin, Clock, Building2, Cpu, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
        name: "Tecnología e Infraestructura", 
        href: "/tecnologia", 
        description: "10,400 m² de capacidad productiva",
        icon: "Cpu"
      },
      { 
        name: "Sistema Integrado de Gestión", 
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
      {/* Top Info Bar - Visible on all devices when not scrolled */}
      <div className={cn(
        "bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm transition-all duration-300 fixed top-0 left-0 right-0 z-40",
        scrolled ? "transform -translate-y-full opacity-0" : "transform translate-y-0 opacity-100"
      )}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+57 (2) 312 0050</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>contacto@meisa.com.co</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Lun-Vie: 7AM-5PM</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4 text-xs">
              <span className="text-blue-400 font-semibold">600 TON/MES</span>
              <span className="text-gray-400">|</span>
              <span className="text-blue-400 font-semibold">29+ AÑOS</span>
              <span className="text-gray-400">|</span>
              <span className="text-blue-400 font-semibold">3 PLANTAS</span>
            </div>
            
            {/* Mobile Layout */}
            <div className="lg:hidden flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-blue-400" />
                  <span>+57 (2) 312 0050</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-blue-400 font-semibold">600 TON/MES</span>
                <span className="text-gray-400">|</span>
                <span className="text-blue-400 font-semibold">29+ AÑOS</span>
                <span className="text-gray-400">|</span>
                <span className="text-blue-400 font-semibold">3 PLANTAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "top-0 bg-white/95 backdrop-blur-lg shadow-lg" 
          : "top-8 lg:top-10 bg-white/90 backdrop-blur-md shadow-md"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                className="relative h-14 w-48"
              >
                <Image
                  src="/images/logo/logo-meisa.png"
                  alt="MEISA - Metálicas e Ingeniería"
                  fill
                  sizes="192px"
                  className="object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item, index) => (
                <motion.div 
                  key={item.name} 
                  className="relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.children ? (
                    <div
                      className="relative group"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 px-3 rounded-lg hover:bg-blue-50">
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      </button>
                      
                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                          >
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6">
                              <h3 className="text-white font-bold text-xl mb-1">Conócenos</h3>
                              <p className="text-blue-100 text-sm">29+ años construyendo el futuro de Colombia</p>
                            </div>
                            
                            <div className="p-3">
                              {item.children.map((child, childIndex) => {
                                const IconComponent = child.icon === 'Building2' ? Building2 : 
                                                     child.icon === 'Cpu' ? Cpu : 
                                                     child.icon === 'Award' ? Award : Building2;
                                
                                return (
                                  <motion.div
                                    key={child.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: childIndex * 0.05 }}
                                  >
                                    <Link
                                      href={child.href}
                                      className="flex items-start gap-4 px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 hover:text-blue-700 rounded-xl transition-all duration-200 group"
                                      onClick={() => setDropdownOpen(false)}
                                    >
                                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                                        <IconComponent className="w-5 h-5 text-blue-600" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-semibold group-hover:translate-x-1 transition-transform">
                                          {child.name}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-0.5">
                                          {child.description}
                                        </div>
                                      </div>
                                    </Link>
                                  </motion.div>
                                );
                              })}
                            </div>
                            
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t">
                              <div className="flex items-center justify-center gap-6 text-sm">
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-blue-600">600</p>
                                  <p className="text-xs text-gray-600">ton/mes</p>
                                </div>
                                <div className="w-px h-10 bg-gray-300"></div>
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-blue-600">29+</p>
                                  <p className="text-xs text-gray-600">años</p>
                                </div>
                                <div className="w-px h-10 bg-gray-300"></div>
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-blue-600">3</p>
                                  <p className="text-xs text-gray-600">plantas</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 relative",
                        (pathname === item.href || (item.href === "/proyectos" && pathname.startsWith("/proyectos"))) && "text-blue-600 bg-blue-50"
                      )}
                    >
                      {item.name}
                      {(pathname === item.href || (item.href === "/proyectos" && pathname.startsWith("/proyectos"))) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                        />
                      )}
                    </Link>
                  )}
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/contacto">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Cotizar Proyecto
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <motion.button
              className="lg:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors shadow-sm border border-gray-200 bg-white/90"
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
              className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200"
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
                        <div className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
                          {item.name}
                        </div>
                        <div className="grid grid-cols-1 gap-2 pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className="font-medium">{child.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{child.description}</div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium",
                          (pathname === item.href || (item.href === "/proyectos" && pathname.startsWith("/proyectos"))) && "bg-blue-50 text-blue-600"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 border-t border-gray-200"
                >
                  <Link href="/contacto" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl">
                      Cotizar Proyecto
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
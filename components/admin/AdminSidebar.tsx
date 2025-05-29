"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Settings,
  FileText,
  BarChart3,
  Mail,
  Image,
  Menu,
  X,
  Building2,
  Briefcase
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Proyectos", href: "/admin/proyectos", icon: FolderOpen },
  { name: "Servicios", href: "/admin/servicios", icon: Briefcase },
  { name: "Equipo", href: "/admin/equipo", icon: Users },
  { name: "Contactos", href: "/admin/contactos", icon: Mail },
  { name: "Media", href: "/admin/media", icon: Image },
  { name: "Reportes", href: "/admin/reportes", icon: BarChart3 },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
]

export function AdminSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="bg-white p-2 rounded-md shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: mobileMenuOpen ? 0 : "-100%"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 z-40 w-72 h-full bg-white shadow-xl",
          "lg:translate-x-0 lg:static lg:inset-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-meisa-blue" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">MEISA</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/admin" && pathname.startsWith(item.href))

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-meisa-blue text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100 hover:text-meisa-blue"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t">
            <div className="bg-gradient-to-r from-meisa-blue to-meisa-orange p-4 rounded-lg text-white text-center">
              <h3 className="font-semibold text-sm">¿Necesitas ayuda?</h3>
              <p className="text-xs opacity-90 mt-1">
                Consulta la documentación
              </p>
              <button className="mt-2 text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">
                Ver Guía
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
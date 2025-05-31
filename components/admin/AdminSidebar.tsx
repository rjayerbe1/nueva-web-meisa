"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Proyectos", href: "/admin/projects" },
  { name: "Categorías", href: "/admin/categories" },
  { name: "Clientes", href: "/admin/clientes" },
  { name: "Servicios", href: "/admin/services" },
  { name: "Equipo", href: "/admin/team" },
  { name: "Contactos", href: "/admin/messages" },
  { name: "Media", href: "/admin/media" },
  { name: "Backups", href: "/admin/backup" },
  { name: "Reportes", href: "/admin/reports" },
  { name: "Configuración", href: "/admin/configuracion" },
]

interface AdminSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 w-64 h-full bg-gray-900 shadow-xl transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-white">MEISA</h1>
                <p className="text-sm text-gray-400">Panel Admin</p>
              </div>
            </div>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <span className="text-gray-600 text-2xl">×</span>
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
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      {item.name}
                      
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-sm text-white">Panel v2.0</h3>
              <p className="text-xs text-gray-400 mt-1">
                © 2025 MEISA
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
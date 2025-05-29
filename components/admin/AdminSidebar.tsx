"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
// import { motion } from "framer-motion"
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
  { name: "Proyectos", href: "/admin/projects", icon: FolderOpen },
  { name: "Servicios", href: "/admin/services", icon: Briefcase },
  { name: "Equipo", href: "/admin/team", icon: Users },
  { name: "Contactos", href: "/admin/messages", icon: Mail },
  { name: "Media", href: "/admin/media", icon: Image },
  { name: "Reportes", href: "/admin/reports", icon: BarChart3 },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
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
              <div className="h-10 w-10 bg-meisa-blue rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
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
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-meisa-blue text-white shadow-lg"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
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
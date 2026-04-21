"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type SubItem = { name: string; href: string }

type NavItem =
  | { kind: "section"; label: string }
  | {
      kind: "item"
      name: string
      href: string
      subItems?: SubItem[]
      stub?: boolean
    }

const navigation: NavItem[] = [
  { kind: "item", name: "Dashboard", href: "/admin" },

  { kind: "section", label: "Contenido del sitio" },
  { kind: "item", name: "Inicio", href: "/admin/home" },
  { kind: "item", name: "Empresa", href: "/admin/empresa" },
  { kind: "item", name: "Procesos y Tecnologías", href: "/admin/procesos-tecnologias" },
  { kind: "item", name: "Políticas", href: "/admin/politicas", stub: true },
  {
    kind: "item",
    name: "Servicios",
    href: "/admin/services",
    subItems: [
      { name: "Lista de servicios", href: "/admin/services" },
      { name: "Aspectos visuales", href: "/admin/services/visual" },
      { name: "Contenido detallado", href: "/admin/services/content" },
      { name: "Proceso Integral", href: "/admin/services/proceso-integral" },
    ],
  },
  { kind: "item", name: "Contacto", href: "/admin/contacto" },
  { kind: "item", name: "Navegación", href: "/admin/navegacion", stub: true },

  { kind: "section", label: "Operaciones" },
  {
    kind: "item",
    name: "Proyectos",
    href: "/admin/projects",
    subItems: [
      { name: "Todos los proyectos", href: "/admin/projects" },
      { name: "Historias", href: "/admin/historias" },
      { name: "Categorías", href: "/admin/categories" },
    ],
  },
  {
    kind: "item",
    name: "Trayectoria",
    href: "/admin/trayectoria",
    subItems: [
      { name: "Proyectos", href: "/admin/trayectoria" },
      { name: "Agregar proyecto", href: "/admin/trayectoria/nuevo" },
      { name: "Resúmenes por año", href: "/admin/trayectoria/resumenes" },
      { name: "Configuración", href: "/admin/trayectoria/configuracion" },
    ],
  },
  { kind: "item", name: "Clientes", href: "/admin/clientes" },
  {
    kind: "item",
    name: "Brochures digitales",
    href: "/admin/brochures",
    subItems: [
      { name: "Todos los brochures", href: "/admin/brochures" },
      { name: "Plantillas de páginas", href: "/admin/brochures/page-templates" },
    ],
  },
  { kind: "item", name: "Mensajes", href: "/admin/messages" },
  { kind: "item", name: "Contactos WhatsApp", href: "/admin/contactos-whatsapp" },

  { kind: "section", label: "Sistema" },
  { kind: "item", name: "Media", href: "/admin/media" },
  { kind: "item", name: "Imágenes hero", href: "/admin/hero-images" },
  { kind: "item", name: "Usuarios", href: "/admin/users" },
  { kind: "item", name: "Backups", href: "/admin/backup" },
  { kind: "item", name: "Reportes", href: "/admin/reports" },
  { kind: "item", name: "Configuración", href: "/admin/configuracion" },
]

interface AdminSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpansion = (itemName: string) => {
    setExpandedItems((prev) => (prev.includes(itemName) ? [] : [itemName]))
  }

  return (
    <>
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed top-0 left-0 z-50 w-64 h-full bg-gray-900 shadow-xl transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <Link href="/admin" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="relative h-16 w-40 flex items-center justify-center">
                <Image
                  src="/images/logo/logo-meisa.png"
                  alt="MEISA - Metálicas e Ingeniería S.A.S."
                  width={140}
                  height={40}
                  className="object-contain brightness-0 invert"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <span className="text-gray-600 text-2xl">×</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-0.5">
              {navigation.map((entry, idx) => {
                if (entry.kind === "section") {
                  return (
                    <li
                      key={`section-${entry.label}-${idx}`}
                      className="px-3 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {entry.label}
                    </li>
                  )
                }

                const item = entry
                const hasSubItems = Boolean(item.subItems && item.subItems.length > 0)
                const isExpanded = expandedItems.includes(item.name)

                let isActive = pathname === item.href
                if (hasSubItems) {
                  isActive =
                    isActive || (item.subItems?.some((sub) => pathname === sub.href) ?? false)
                } else if (item.href !== "/admin") {
                  isActive = isActive || pathname.startsWith(item.href + "/")
                }

                return (
                  <li key={item.name}>
                    {hasSubItems ? (
                      <div>
                        <button
                          onClick={() => toggleExpansion(item.name)}
                          className={cn(
                            "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-left",
                            isActive
                              ? "bg-blue-600 text-white shadow-lg"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white",
                          )}
                        >
                          <span className="flex-1">{item.name}</span>
                          <div className="flex items-center">
                            {isActive && <div className="w-2 h-2 bg-white rounded-full mr-2" />}
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <ul className="mt-1 ml-3 space-y-0.5 border-l border-gray-800 pl-3">
                            {item.subItems!.map((subItem) => {
                              const isSubActive = pathname === subItem.href
                              return (
                                <li key={subItem.name}>
                                  <Link
                                    href={subItem.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                      "flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200",
                                      isSubActive
                                        ? "bg-blue-500 text-white shadow"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200",
                                    )}
                                  >
                                    <div className="w-1.5 h-1.5 bg-current rounded-full mr-3 opacity-60" />
                                    <span className="flex-1">{subItem.name}</span>
                                    {isSubActive && (
                                      <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                                    )}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white",
                        )}
                      >
                        <span className="flex-1">{item.name}</span>
                        {item.stub && (
                          <span
                            className={cn(
                              "ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-gray-800 text-gray-500 border border-gray-700",
                            )}
                          >
                            Pronto
                          </span>
                        )}
                        {isActive && !item.stub && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                        )}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <h3 className="font-semibold text-sm text-white">Panel v2.0</h3>
              <p className="text-xs text-gray-400 mt-0.5">© 2025 MEISA</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

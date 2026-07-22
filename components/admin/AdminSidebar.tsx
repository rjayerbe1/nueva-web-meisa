"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Home as HomeIcon,
  Building2,
  Wrench,
  Scroll,
  Briefcase,
  Phone,
  Navigation as NavIcon,
  FolderKanban,
  BookOpen,
  Users,
  FileText,
  Inbox,
  Megaphone,
  MessageSquare,
  Bot,
  UserPlus,
  ImageIcon,
  UserCog,
  Database,
  BarChart3,
  TrendingUp,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type SubItem = { name: string; href: string }

type NavItem =
  | { kind: "section"; label: string; color: "red" | "blue" | "slate" }
  | {
      kind: "item"
      name: string
      href: string
      icon: LucideIcon
      subItems?: SubItem[]
      stub?: boolean
    }

const navigation: NavItem[] = [
  { kind: "item", name: "Dashboard", href: "/admin", icon: LayoutDashboard },

  { kind: "section", label: "Contenido del sitio", color: "red" },
  { kind: "item", name: "Inicio", href: "/admin/home", icon: HomeIcon },
  { kind: "item", name: "Empresa", href: "/admin/empresa", icon: Building2 },
  {
    kind: "item",
    name: "Procesos y Tecnologías",
    href: "/admin/procesos-tecnologias",
    icon: Wrench,
  },
  { kind: "item", name: "Calidad", href: "/admin/calidad", icon: Scroll },
  { kind: "item", name: "Servicios", href: "/admin/services", icon: Briefcase },
  { kind: "item", name: "Contacto", href: "/admin/contacto", icon: Phone },
  { kind: "item", name: "Navegación", href: "/admin/navegacion", icon: NavIcon },
  { kind: "item", name: "Landings SEO", href: "/admin/landings", icon: Megaphone },
  {
    kind: "item",
    name: "Documentos institucionales",
    href: "/admin/documentos-institucionales",
    icon: FileText,
  },

  { kind: "section", label: "Operaciones", color: "blue" },
  { kind: "item", name: "Proyectos", href: "/admin/projects", icon: FolderKanban },
  { kind: "item", name: "Obras", href: "/admin/obras", icon: BookOpen },
  { kind: "item", name: "Trayectoria", href: "/admin/trayectoria", icon: BookOpen },
  { kind: "item", name: "Clientes", href: "/admin/clientes", icon: Users },
  {
    kind: "item",
    name: "Brochures digitales",
    href: "/admin/brochures",
    icon: FileText,
  },
  { kind: "item", name: "Mensajes", href: "/admin/messages", icon: Inbox },
  {
    kind: "item",
    name: "Contactos WhatsApp",
    href: "/admin/contactos-whatsapp",
    icon: MessageSquare,
  },
  { kind: "item", name: "Chatbot IA", href: "/admin/chat", icon: Bot },
  { kind: "item", name: "Talento Humano", href: "/admin/talento", icon: UserPlus },

  { kind: "section", label: "Sistema", color: "slate" },
  {
    kind: "item",
    name: "Biblioteca de medios",
    href: "/admin/media-library",
    icon: ImageIcon,
  },
  { kind: "item", name: "Media (legacy)", href: "/admin/media", icon: ImageIcon },
  { kind: "item", name: "Usuarios", href: "/admin/users", icon: UserCog },
  { kind: "item", name: "Backups", href: "/admin/backup", icon: Database },
  { kind: "item", name: "Analítica", href: "/admin/analytics", icon: TrendingUp },
  { kind: "item", name: "Reportes", href: "/admin/reports", icon: BarChart3 },
  { kind: "item", name: "Configuración", href: "/admin/configuracion", icon: Settings },
]

const SECTION_ACCENT: Record<"red" | "blue" | "slate", string> = {
  red: "border-red-600",
  blue: "border-blue-500",
  slate: "border-slate-500",
}

interface AdminSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  restrictedToTalento?: boolean
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen, restrictedToTalento }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpansion = (itemName: string) => {
    setExpandedItems((prev) => (prev.includes(itemName) ? [] : [itemName]))
  }

  const visibleNavigation = restrictedToTalento
    ? navigation.filter((entry) => entry.kind === "item" && entry.href === "/admin/talento")
    : navigation

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-slate-950 text-white shadow-xl transition-transform duration-300 font-lato",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <Link href="/admin" className="flex items-center transition-opacity hover:opacity-80">
            <Image
              src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
              alt="MEISA"
              width={120}
              height={34}
              className="object-contain invert"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {visibleNavigation.map((entry, idx) => {
              if (entry.kind === "section") {
                return (
                  <li
                    key={`section-${entry.label}-${idx}`}
                    className={cn(
                      "mt-5 mb-1 pl-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-l-2",
                      SECTION_ACCENT[entry.color],
                    )}
                  >
                    {entry.label}
                  </li>
                )
              }

              const item = entry
              const Icon = item.icon
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
                          "group flex w-full items-center gap-2.5 rounded px-3 py-2 text-left text-sm font-medium transition-all",
                          isActive
                            ? "bg-red-600 text-white shadow-sm"
                            : "text-slate-300 hover:bg-slate-900 hover:text-white",
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="flex-1">{item.name}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <ul className="ml-4 mt-1 space-y-0.5 border-l border-slate-800 pl-3">
                          {item.subItems!.map((subItem) => {
                            const isSubActive = pathname === subItem.href
                            return (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  onClick={() => setSidebarOpen(false)}
                                  className={cn(
                                    "flex items-center rounded px-3 py-1.5 text-[13px] transition-colors",
                                    isSubActive
                                      ? "bg-red-600/20 text-red-400 font-semibold"
                                      : "text-slate-400 hover:bg-slate-900 hover:text-white",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "mr-2 h-1 w-1 rounded-full bg-current",
                                      isSubActive ? "opacity-100" : "opacity-40",
                                    )}
                                  />
                                  {subItem.name}
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
                        "group flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-red-600 text-white shadow-sm"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      {item.stub && (
                        <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                          Pronto
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Panel v2
          </p>
          <p className="mt-0.5 text-[11px] text-slate-600">© 2025 MEISA</p>
        </div>
      </aside>
    </>
  )
}

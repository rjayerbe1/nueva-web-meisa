"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

const ROUTE_LABELS: Record<string, string> = {
  admin: "Admin",
  home: "Inicio",
  empresa: "Empresa",
  "procesos-tecnologias": "Procesos y Tecnologías",
  calidad: "Calidad",
  services: "Servicios",
  "proceso-integral": "Proceso Integral",
  contacto: "Contacto",
  navegacion: "Navegación",
  "media-library": "Biblioteca de medios",
  media: "Media (legacy)",
  "hero-images": "Imágenes hero",
  projects: "Proyectos",
  trayectoria: "Trayectoria",
  clientes: "Clientes",
  historias: "Historias",
  brochures: "Brochures",
  categories: "Categorías",
  messages: "Mensajes",
  "contactos-whatsapp": "Contactos WhatsApp",
  users: "Usuarios",
  backup: "Backups",
  reports: "Reportes",
  configuracion: "Configuración",
  new: "Nuevo",
  edit: "Editar",
  nuevo: "Nuevo",
  nueva: "Nueva",
  resumenes: "Resúmenes",
  visual: "Aspectos visuales",
  content: "Contenido",
  "page-templates": "Plantillas de página",
  templates: "Plantillas",
  builder: "Constructor",
}

function labelFor(segment: string): string {
  if (ROUTE_LABELS[segment]) return ROUTE_LABELS[segment]
  if (/^[a-z0-9]{8,}$/i.test(segment)) return "Detalle"
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function AdminBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/")
    return { label: labelFor(seg), href, last: idx === segments.length - 1 }
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-lato">
      {crumbs.map((c, i) => (
        <div key={c.href} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
          {c.last ? (
            <span className="font-semibold text-slate-900">{c.label}</span>
          ) : (
            <Link
              href={c.href}
              className="text-slate-500 transition-colors hover:text-red-600"
            >
              {c.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

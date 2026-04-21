"use client"

import Link from "next/link"
import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import type { Servicio, ProcesoFase } from "@prisma/client"
import { ExternalLink, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  servicios: Servicio[]
  procesoFases: ProcesoFase[]
}

const COLOR_OPTIONS = [
  { value: "blue", label: "Azul" },
  { value: "red", label: "Rojo" },
  { value: "amber", label: "Amber" },
  { value: "green", label: "Verde" },
  { value: "purple", label: "Violeta" },
  { value: "slate", label: "Slate" },
]

const servicioFields: FieldDef[] = [
  { name: "slug", label: "Slug (único)", kind: "text", required: true, placeholder: "diseno-estructural" },
  { name: "nombre", label: "Nombre corto", kind: "text", required: true },
  { name: "titulo", label: "Título mostrado", kind: "text", gridSpan: 2 },
  { name: "subtitulo", label: "Subtítulo", kind: "text", gridSpan: 2 },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 4, required: true, gridSpan: 2 },
  { name: "imagen", label: "Imagen principal", kind: "image", gridSpan: 2 },
  { name: "icono", label: "Icono (nombre Lucide)", kind: "text", placeholder: "Calculator" },
  { name: "color", label: "Color", kind: "select", options: COLOR_OPTIONS },
  {
    name: "bgGradient",
    label: "Gradiente (Tailwind classes)",
    kind: "color",
    placeholder: "from-blue-600 to-blue-700",
    gridSpan: 2,
  },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "destacado", label: "Destacado", kind: "boolean" },
  { name: "activo", label: "Activo", kind: "boolean" },
  { name: "metaTitle", label: "SEO — título", kind: "text", gridSpan: 2 },
  { name: "metaDescription", label: "SEO — descripción", kind: "textarea", rows: 2, gridSpan: 2 },
]

const procesoFaseFields: FieldDef[] = [
  { name: "numero", label: "Número de fase", kind: "number", required: true, min: 1, placeholder: "1" },
  { name: "titulo", label: "Título", kind: "text", required: true, placeholder: "Consultoría BIM" },
  {
    name: "descripcion",
    label: "Descripción",
    kind: "textarea",
    rows: 3,
    required: true,
    gridSpan: 2,
  },
  {
    name: "fortalezas",
    label: "Fortalezas",
    kind: "stringArray",
    multiline: true,
    rows: 2,
    gridSpan: 2,
    hint: "Viñetas de fortalezas de la fase.",
  },
  {
    name: "icono",
    label: "Icono (nombre Lucide)",
    kind: "text",
    placeholder: "Calculator | Cog | HardHat | Award",
  },
  { name: "imagen", label: "Imagen", kind: "image" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

export function ServicesAdminTabs({ servicios, procesoFases }: Props) {
  return (
    <AdminTabsLayout
      eyebrow="Contenido del sitio"
      title="Servicios"
      description="Catálogo de servicios (se muestra en /servicios y /servicios/[slug]) y las 4 fases del Proceso Integral."
      tabs={[
        {
          id: "catalogo",
          label: "Catálogo",
          count: servicios.length,
          content: (
            <ListCrudEditor<Servicio>
              items={servicios}
              fields={servicioFields}
              endpoint="/api/admin/services"
              emptyTemplate={{
                slug: "",
                nombre: "",
                titulo: null,
                subtitulo: null,
                descripcion: "",
                caracteristicas: [],
                icono: null,
                imagen: null,
                color: "blue",
                bgGradient: null,
                orden: servicios.length,
                destacado: false,
                activo: true,
                metaTitle: null,
                metaDescription: null,
                expertiseTitulo: null,
                expertiseDescripcion: null,
              }}
              addLabel="Agregar servicio"
              tableColumns={[
                { key: "nombre", label: "Nombre" },
                { key: "slug", label: "Slug", className: "font-mono" },
                { key: "color", label: "Color", className: "w-20" },
                { key: "orden", label: "Orden", className: "w-20 text-center" },
              ]}
              renderPreview={(s) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-base uppercase tracking-wide text-slate-950">
                      {s.titulo || s.nombre}
                    </span>
                    {s.destacado && (
                      <span className="rounded-none bg-red-600 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-white">
                        Destacado
                      </span>
                    )}
                    {!s.activo && (
                      <span className="rounded-none border border-slate-300 bg-stone-100 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Oculto
                      </span>
                    )}
                  </div>
                  {s.subtitulo && (
                    <p className="mt-0.5 font-lato text-xs text-slate-500">{s.subtitulo}</p>
                  )}
                  <p className="mt-0.5 line-clamp-1 font-lato text-xs text-slate-500">
                    {s.descripcion}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Link
                      href={`/admin/services/${s.id}/editar`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-lato text-[11px] font-semibold uppercase tracking-wider text-red-600 hover:underline"
                    >
                      <Pencil className="h-3 w-3" />
                      Editar detalle completo
                    </Link>
                    <Link
                      href={`/servicios/${s.slug}`}
                      target="_blank"
                      rel="noopener"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-lato text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900"
                    >
                      Ver pública
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            />
          ),
        },
        {
          id: "proceso-integral",
          label: "Proceso Integral",
          count: procesoFases.length,
          content: (
            <ListCrudEditor<ProcesoFase>
              items={procesoFases}
              fields={procesoFaseFields}
              endpoint="/api/admin/proceso-fases"
              emptyTemplate={{
                numero: procesoFases.length + 1,
                titulo: "",
                descripcion: "",
                fortalezas: [],
                icono: null,
                imagen: null,
                orden: procesoFases.length,
                activo: true,
              }}
              addLabel="Agregar fase"
              renderPreview={(f) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 font-mono text-sm font-bold text-white">
                      {f.numero}
                    </span>
                    <span className="font-bebas text-base uppercase tracking-wide text-slate-950">
                      {f.titulo}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 font-lato text-xs text-slate-500">
                    {f.descripcion}
                  </p>
                </div>
              )}
            />
          ),
        },
      ]}
    />
  )
}

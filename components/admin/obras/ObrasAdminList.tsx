"use client"

import Link from "next/link"
import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { ExternalLink, Pencil } from "lucide-react"

export interface ObraConConteo {
  id: string
  slug: string
  titulo: string
  resumenCorto: string | null
  imagenDestacada: string | null
  activa: boolean
  destacada: boolean
  orden: number
  categoria: string
  _count: { proyectos: number }
}

const fields: FieldDef[] = [
  { name: "slug", label: "Slug (URL /obras/{slug})", kind: "text", required: true, gridSpan: 2 },
  { name: "titulo", label: "Título", kind: "text", required: true, gridSpan: 2 },
  {
    name: "categoria",
    label: "Categoría",
    kind: "select",
    options: [
      { value: "COMERCIAL", label: "Comercial" },
      { value: "INDUSTRIAL", label: "Industrial" },
      { value: "PUENTES", label: "Puentes" },
      { value: "INFRAESTRUCTURA_URBANA", label: "Infraestructura urbana" },
      { value: "EDIFICACIONES", label: "Edificaciones" },
      { value: "DEPORTES_EDUCACION", label: "Deportes y educación" },
      { value: "OTRO", label: "Otro" },
    ],
  },
  { name: "resumenCorto", label: "Resumen corto", kind: "textarea", rows: 2, gridSpan: 2 },
  { name: "imagenDestacada", label: "Imagen destacada", kind: "image", gridSpan: 2 },
  { name: "activa", label: "Activa (visible)", kind: "boolean" },
  { name: "destacada", label: "Destacada", kind: "boolean" },
]

export function ObrasAdminList({ items }: { items: ObraConConteo[] }) {
  return (
    <AdminTabsLayout
      eyebrow="Operaciones"
      title="Obras"
      description="Una obra agrupa uno o varios proyectos bajo la misma narrativa (ej. CC Campanario con original + ampliación, o Dollar City con sus locales)."
      tabs={[
        {
          id: "obras",
          label: "Obras",
          count: items.length,
          content: (
            <ListCrudEditor<ObraConConteo>
              items={items}
              fields={fields}
              endpoint="/api/admin/obras"
              emptyTemplate={{
                slug: "",
                titulo: "",
                resumenCorto: null,
                imagenDestacada: null,
                activa: true,
                destacada: false,
                orden: 0,
                categoria: "COMERCIAL",
              }}
              addLabel="Agregar obra"
              thumbnailField="imagenDestacada"
              canReorder={false}
              renderPreview={(o) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-base uppercase tracking-wide text-slate-950">
                      {o.titulo}
                    </span>
                    {o.activa ? (
                      <span className="rounded-none bg-green-600 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-white">
                        Publicada
                      </span>
                    ) : (
                      <span className="rounded-none border border-slate-300 bg-stone-100 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Borrador
                      </span>
                    )}
                    {o.destacada && (
                      <span className="rounded-none bg-red-600 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-white">
                        Destacada
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-lato text-xs text-slate-500">
                    {o.categoria.replace(/_/g, " ")} ·{" "}
                    {o._count.proyectos}{" "}
                    {o._count.proyectos === 1 ? "proyecto" : "proyectos"} agrupado
                    {o._count.proyectos === 1 ? "" : "s"}
                  </p>
                  {o.resumenCorto && (
                    <p className="mt-0.5 line-clamp-1 font-lato text-xs text-slate-500">
                      {o.resumenCorto}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-3">
                    <Link
                      href={`/admin/obras/${o.id}/editar`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-lato text-[11px] font-semibold uppercase tracking-wider text-red-600 hover:underline"
                    >
                      <Pencil className="h-3 w-3" />
                      Editar contenido completo
                    </Link>
                    <Link
                      href={`/obras/${o.slug}`}
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
      ]}
    />
  )
}

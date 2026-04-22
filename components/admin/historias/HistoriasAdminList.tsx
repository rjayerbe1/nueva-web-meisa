"use client"

import Link from "next/link"
import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { ExternalLink, Pencil } from "lucide-react"

export interface HistoriaConProyecto {
  id: string
  proyectoId: string
  activo: boolean
  tituloAlternativo: string | null
  resumenCorto: string | null
  imagenDestacada: string | null
  videoUrl: string | null
  dificultadTecnica: number | null
  innovacionNivel: number | null
  proyecto: {
    titulo: string
    slug: string
    cliente: string
  } | null
}

const fields: FieldDef[] = [
  { name: "proyectoId", label: "ID del proyecto", kind: "text", required: true, gridSpan: 2 },
  { name: "tituloAlternativo", label: "Título alternativo", kind: "text", gridSpan: 2 },
  {
    name: "resumenCorto",
    label: "Resumen corto",
    kind: "textarea",
    rows: 3,
    gridSpan: 2,
  },
  { name: "imagenDestacada", label: "Imagen destacada", kind: "image", gridSpan: 2 },
  { name: "videoUrl", label: "Video", kind: "video", gridSpan: 2 },
  { name: "dificultadTecnica", label: "Dificultad técnica (1-10)", kind: "number", min: 1, max: 10 },
  { name: "innovacionNivel", label: "Innovación (1-10)", kind: "number", min: 1, max: 10 },
  { name: "activo", label: "Activa (publicada)", kind: "boolean" },
]

export function HistoriasAdminList({ items }: { items: HistoriaConProyecto[] }) {
  return (
    <AdminTabsLayout
      eyebrow="Operaciones"
      title="Historias de proyecto"
      description="Casos de éxito editoriales. Cada historia enlaza con un proyecto del catálogo."
      tabs={[
        {
          id: "historias",
          label: "Historias",
          count: items.length,
          content: (
            <ListCrudEditor<HistoriaConProyecto>
              items={items}
              fields={fields}
              endpoint="/api/admin/historias-v2"
              emptyTemplate={{
                proyectoId: "",
                activo: false,
                tituloAlternativo: null,
                resumenCorto: null,
                imagenDestacada: null,
                videoUrl: null,
                dificultadTecnica: null,
                innovacionNivel: null,
                proyecto: null,
              }}
              addLabel="Agregar historia"
              thumbnailField="imagenDestacada"
              canReorder={false}
              renderPreview={(h) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-base uppercase tracking-wide text-slate-950">
                      {h.tituloAlternativo || h.proyecto?.titulo || "Historia sin título"}
                    </span>
                    {h.activo ? (
                      <span className="rounded-none bg-green-600 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-white">
                        Publicada
                      </span>
                    ) : (
                      <span className="rounded-none border border-slate-300 bg-stone-100 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Borrador
                      </span>
                    )}
                  </div>
                  {h.proyecto && (
                    <p className="mt-0.5 font-lato text-xs text-slate-500">
                      Proyecto: {h.proyecto.titulo} · {h.proyecto.cliente}
                    </p>
                  )}
                  {h.resumenCorto && (
                    <p className="mt-0.5 line-clamp-1 font-lato text-xs text-slate-500">
                      {h.resumenCorto}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-3">
                    <Link
                      href={`/admin/historias/${h.id}/editar`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-lato text-[11px] font-semibold uppercase tracking-wider text-red-600 hover:underline"
                    >
                      <Pencil className="h-3 w-3" />
                      Editar contenido completo
                    </Link>
                    {h.proyecto && (
                      <Link
                        href={`/proyectos/detalle/${h.proyecto.slug}`}
                        target="_blank"
                        rel="noopener"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 font-lato text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900"
                      >
                        Ver proyecto público
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
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

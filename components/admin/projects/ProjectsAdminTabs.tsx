"use client"

import Link from "next/link"
import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { CategoriaEnum, EstadoProyecto, PrioridadEnum } from "@prisma/client"
import type { CategoriaProyecto } from "@prisma/client"
import { ExternalLink, Pencil } from "lucide-react"

export interface ProyectoSerializado {
  id: string
  titulo: string
  slug: string
  descripcion: string
  cliente: string
  ubicacion: string
  categoria: CategoriaEnum
  estado: EstadoProyecto
  prioridad: PrioridadEnum
  fechaInicio: string
  fechaFin: string | null
  fechaEstimada: string | null
  presupuesto: number | null
  costoReal: number | null
  moneda: string
  areaTotal: number | null
  toneladas: number | null
  codigoInterno: string | null
  destacado: boolean
  destacadoEnCategoria: boolean
  visible: boolean
  ordenFrontend: number | null
  tags: string[]
  portada: string | null
}

interface Props {
  proyectos: ProyectoSerializado[]
  categorias: CategoriaProyecto[]
}

const CATEGORIA_OPTIONS = [
  { value: "COMERCIAL", label: "Comercial" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "PUENTES", label: "Puentes" },
  { value: "INFRAESTRUCTURA_URBANA", label: "Infraestructura urbana" },
  { value: "EDIFICACIONES", label: "Edificaciones" },
  { value: "DEPORTES_EDUCACION", label: "Deportes y educación" },
  { value: "OTRO", label: "Otro" },
]

const ESTADO_OPTIONS = [
  { value: "PLANIFICACION", label: "Planificación" },
  { value: "EN_PROGRESO", label: "En progreso" },
  { value: "PAUSADO", label: "Pausado" },
  { value: "COMPLETADO", label: "Completado" },
  { value: "CANCELADO", label: "Cancelado" },
]

const PRIORIDAD_OPTIONS = [
  { value: "BAJA", label: "Baja" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
  { value: "URGENTE", label: "Urgente" },
]

const proyectoFields: FieldDef[] = [
  { name: "titulo", label: "Título", kind: "text", required: true, gridSpan: 2 },
  { name: "slug", label: "Slug (único)", kind: "text", required: true },
  { name: "codigoInterno", label: "Código interno", kind: "text" },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 3, required: true, gridSpan: 2 },
  { name: "categoria", label: "Categoría", kind: "select", required: true, options: CATEGORIA_OPTIONS },
  { name: "estado", label: "Estado", kind: "select", options: ESTADO_OPTIONS },
  { name: "prioridad", label: "Prioridad", kind: "select", options: PRIORIDAD_OPTIONS },
  { name: "cliente", label: "Cliente", kind: "text", required: true },
  { name: "contactoCliente", label: "Contacto", kind: "text" },
  { name: "telefono", label: "Teléfono", kind: "text" },
  { name: "email", label: "Email", kind: "text" },
  { name: "ubicacion", label: "Ubicación", kind: "text", required: true },
  { name: "coordenadas", label: "Coordenadas (lat,lng)", kind: "text" },
  { name: "fechaInicio", label: "Fecha inicio", kind: "date", required: true },
  { name: "fechaFin", label: "Fecha fin", kind: "date" },
  { name: "fechaEstimada", label: "Fecha estimada", kind: "date" },
  { name: "presupuesto", label: "Presupuesto", kind: "number", min: 0 },
  { name: "costoReal", label: "Costo real", kind: "number", min: 0 },
  { name: "moneda", label: "Moneda", kind: "text", placeholder: "COP" },
  { name: "areaTotal", label: "Área total (m²)", kind: "number", min: 0, step: 0.01 },
  { name: "toneladas", label: "Toneladas", kind: "number", min: 0, step: 0.01 },
  { name: "tags", label: "Tags", kind: "stringArray", gridSpan: 2 },
  { name: "destacado", label: "Destacado", kind: "boolean" },
  { name: "destacadoEnCategoria", label: "Destacado en categoría", kind: "boolean" },
  { name: "visible", label: "Visible", kind: "boolean" },
  { name: "ordenFrontend", label: "Orden frontend", kind: "number" },
  { name: "metaTitle", label: "SEO — título", kind: "text", gridSpan: 2 },
  { name: "metaDescription", label: "SEO — descripción", kind: "textarea", rows: 2, gridSpan: 2 },
]

const categoriaFields: FieldDef[] = [
  {
    name: "key",
    label: "Key",
    kind: "select",
    required: true,
    options: CATEGORIA_OPTIONS,
  },
  { name: "nombre", label: "Nombre", kind: "text", required: true },
  { name: "slug", label: "Slug (único)", kind: "text", required: true },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 2, gridSpan: 2 },
  { name: "icono", label: "Icono (Lucide)", kind: "text" },
  { name: "color", label: "Color primario (hex)", kind: "text", placeholder: "#1e40af" },
  { name: "imagenCover", label: "Imagen cover", kind: "image", gridSpan: 2 },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "visible", label: "Visible", kind: "boolean" },
  { name: "destacada", label: "Destacada", kind: "boolean" },
]

export function ProjectsAdminTabs({ proyectos, categorias }: Props) {
  return (
    <AdminTabsLayout
      eyebrow="Operaciones"
      title="Proyectos"
      description="Catálogo de proyectos (se muestran en /proyectos) + categorías del menú."
      tabs={[
        {
          id: "catalogo",
          label: "Catálogo",
          count: proyectos.length,
          content: (
            <ListCrudEditor<ProyectoSerializado>
              items={proyectos}
              fields={proyectoFields}
              endpoint="/api/admin/proyectos-v2"
              emptyTemplate={{
                titulo: "",
                slug: "",
                descripcion: "",
                cliente: "",
                ubicacion: "",
                categoria: CategoriaEnum.COMERCIAL,
                estado: EstadoProyecto.PLANIFICACION,
                prioridad: PrioridadEnum.MEDIA,
                fechaInicio: "",
                fechaFin: null,
                fechaEstimada: null,
                presupuesto: null,
                costoReal: null,
                moneda: "COP",
                areaTotal: null,
                toneladas: null,
                codigoInterno: null,
                destacado: false,
                destacadoEnCategoria: false,
                visible: true,
                ordenFrontend: proyectos.length,
                tags: [],
                portada: null,
              }}
              addLabel="Agregar proyecto"
              thumbnailField="portada"
              defaultView="table"
              detailHref={(p) => `/admin/projects/${p.id}/edit`}
              detailLabel="Editar fotos y detalle"
              searchPlaceholder="Buscar por título, cliente, ubicación, slug, código…"
              searchableFields={[
                "titulo",
                "slug",
                "cliente",
                "ubicacion",
                "codigoInterno",
                "tags",
                "descripcion",
              ]}
              filters={[
                { key: "categoria", label: "Categoría", options: CATEGORIA_OPTIONS },
                { key: "estado", label: "Estado", options: ESTADO_OPTIONS },
                {
                  key: "visible",
                  label: "Visibilidad",
                  options: [
                    { value: "true", label: "Visibles" },
                    { value: "false", label: "Ocultos" },
                  ],
                },
                {
                  key: "destacado",
                  label: "Destacado",
                  options: [
                    { value: "true", label: "Destacados" },
                    { value: "false", label: "No destacados" },
                  ],
                },
              ]}
              tableColumns={[
                { key: "titulo", label: "Título" },
                { key: "cliente", label: "Cliente" },
                { key: "categoria", label: "Categoría" },
                { key: "estado", label: "Estado", className: "w-28" },
              ]}
              renderPreview={(p) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-base uppercase tracking-wide text-slate-950">
                      {p.titulo}
                    </span>
                    {p.destacado && (
                      <span className="rounded-none bg-red-600 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-white">
                        Destacado
                      </span>
                    )}
                    {!p.visible && (
                      <span className="rounded-none border border-slate-300 bg-stone-100 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Oculto
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-lato text-xs text-slate-500">
                    {p.cliente} · {p.ubicacion} · {p.categoria.replace(/_/g, " ")}
                  </p>
                  <div className="mt-1 flex items-center gap-3">
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-lato text-[11px] font-semibold uppercase tracking-wider text-red-600 hover:underline"
                    >
                      <Pencil className="h-3 w-3" />
                      Editar detalle completo
                    </Link>
                    <Link
                      href={`/proyectos/detalle/${p.slug}`}
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
          id: "categorias",
          label: "Categorías",
          count: categorias.length,
          content: (
            <ListCrudEditor<CategoriaProyecto>
              items={categorias}
              fields={categoriaFields}
              endpoint="/api/admin/categories"
              emptyTemplate={{
                key: CategoriaEnum.COMERCIAL,
                nombre: "",
                slug: "",
                descripcion: null,
                icono: null,
                color: null,
                imagenCover: null,
                orden: categorias.length,
                visible: true,
                destacada: false,
              }}
              addLabel="Agregar categoría"
              thumbnailField="imagenCover"
              detailHref={(c) => `/admin/categories/${c.id}/editar`}
              detailLabel="Editar detalle (visuales, overlay, SEO…)"
              renderPreview={(c) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-base uppercase tracking-wide text-slate-950">
                      {c.nombre}
                    </span>
                    {c.destacada && (
                      <span className="rounded-none bg-red-600 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-white">
                        Destacada
                      </span>
                    )}
                    {!c.visible && (
                      <span className="rounded-none border border-slate-300 bg-stone-100 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Oculta
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-lato text-xs text-slate-500">
                    {c.totalProyectos} proyectos · key <code className="font-mono">{c.key}</code>
                  </p>
                  <div className="mt-1">
                    <Link
                      href={`/admin/categories/${c.id}/editar`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-lato text-[11px] font-semibold uppercase tracking-wider text-red-600 hover:underline"
                    >
                      <Pencil className="h-3 w-3" />
                      Editar detalle (visuales, overlay, SEO…)
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

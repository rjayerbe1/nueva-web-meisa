"use client"

import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import type { Politica, PilarSIG, Norma, GrupoSeccion } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

interface Props {
  politicas: Politica[]
  pilares: PilarSIG[]
  normas: Norma[]
  gruposCalidad: GrupoSeccion[]
}

const politicaFields: FieldDef[] = [
  { name: "slug", label: "Slug (único)", kind: "text", required: true },
  { name: "titulo", label: "Título", kind: "text", required: true, gridSpan: 2 },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 3, gridSpan: 2 },
  {
    name: "compromisos",
    label: "Compromisos",
    kind: "stringArray",
    gridSpan: 2,
    hint: "Lista de compromisos asociados a la política.",
  },
  { name: "imagen", label: "URL imagen", kind: "url", gridSpan: 2 },
  { name: "documentoUrl", label: "URL del documento", kind: "url", gridSpan: 2 },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const pilarFields: FieldDef[] = [
  { name: "slug", label: "Slug (único)", kind: "text", required: true },
  { name: "titulo", label: "Título", kind: "text", required: true, gridSpan: 2 },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 3, gridSpan: 2 },
  { name: "icono", label: "Icono (Lucide)", kind: "text" },
  { name: "colorGradient", label: "Gradiente", kind: "color" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const normaFields: FieldDef[] = [
  { name: "codigo", label: "Código", kind: "text", required: true, placeholder: "NSR-10" },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 2, required: true, gridSpan: 2 },
  { name: "categoria", label: "Categoría", kind: "text" },
  { name: "logo", label: "URL logo", kind: "url" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const grupoCalidadFields: FieldDef[] = [
  { name: "clave", label: "Clave técnica", kind: "text", required: true, placeholder: "sig" },
  { name: "titulo", label: "Título", kind: "text", required: true },
  { name: "subtitulo", label: "Subtítulo", kind: "text", gridSpan: 2 },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 2, gridSpan: 2 },
  { name: "icono", label: "Icono", kind: "text" },
  { name: "colorGradient", label: "Gradiente", kind: "color" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

export function PoliticasAdminTabs({ politicas, pilares, normas, gruposCalidad }: Props) {
  return (
    <AdminTabsLayout
      title="Políticas"
      description="Contenido de /politicas: políticas corporativas, pilares del SIG y normas aplicables."
      tabs={[
        {
          id: "politicas",
          label: "Políticas",
          count: politicas.length,
          content: (
            <ListCrudEditor<Politica>
              items={politicas}
              fields={politicaFields}
              endpoint="/api/admin/politicas"
              emptyTemplate={{
                slug: "",
                titulo: "",
                descripcion: null,
                compromisos: [],
                imagen: null,
                documentoUrl: null,
                orden: politicas.length,
                activo: true,
              }}
              addLabel="Agregar política"
            />
          ),
        },
        {
          id: "pilares",
          label: "Pilares SIG",
          count: pilares.length,
          content: (
            <ListCrudEditor<PilarSIG>
              items={pilares}
              fields={pilarFields}
              endpoint="/api/admin/pilares-sig"
              emptyTemplate={{
                slug: "",
                titulo: "",
                descripcion: null,
                icono: null,
                colorGradient: null,
                orden: pilares.length,
                activo: true,
              }}
              addLabel="Agregar pilar"
            />
          ),
        },
        {
          id: "normas",
          label: "Normas",
          count: normas.length,
          content: (
            <ListCrudEditor<Norma>
              items={normas}
              fields={normaFields}
              endpoint="/api/admin/normas"
              emptyTemplate={{
                codigo: "",
                descripcion: "",
                categoria: null,
                logo: null,
                orden: normas.length,
                activo: true,
              }}
              addLabel="Agregar norma"
              renderPreview={(n) => (
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {n.codigo}
                    </Badge>
                    {n.categoria && <span className="text-xs text-gray-500">{n.categoria}</span>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{n.descripcion}</p>
                </div>
              )}
            />
          ),
        },
        {
          id: "grupos-calidad",
          label: "Grupos (sub-secciones)",
          count: gruposCalidad.length,
          content: (
            <ListCrudEditor<GrupoSeccion>
              items={gruposCalidad}
              fields={grupoCalidadFields}
              endpoint="/api/admin/grupos-seccion"
              emptyTemplate={{
                pagina: "calidad",
                clave: "",
                titulo: "",
                subtitulo: null,
                descripcion: null,
                icono: null,
                colorGradient: null,
                orden: gruposCalidad.length,
                activo: true,
              }}
              addLabel="Agregar grupo"
            />
          ),
        },
      ]}
    />
  )
}

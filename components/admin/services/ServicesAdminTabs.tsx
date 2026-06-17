"use client"

import Link from "next/link"
import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import { SingletonEditor, type SingletonSection } from "@/components/admin/shared/SingletonEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import type { Servicio, ProcesoFase, ServiciosPagina } from "@prisma/client"
import { ExternalLink, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  servicios: Servicio[]
  procesoFases: ProcesoFase[]
  paginaConfig: ServiciosPagina | null
}

// Tab "Página": contenido editable de /servicios (hero, cifras, intro proceso, sectores, CTA)
const paginaSections: SingletonSection[] = [
  {
    id: "hero",
    title: "Hero",
    description: "Encabezado superior de la página. Usa {anios} para insertar los años de experiencia automáticamente.",
    fields: [
      { name: "heroEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2, placeholder: "Servicios integrales — {anios}+ años de experiencia" },
      { name: "heroTitulo1", label: "Título línea 1", kind: "text" },
      { name: "heroTitulo2", label: "Título línea 2 (gris)", kind: "text" },
      { name: "heroParrafo", label: "Párrafo", kind: "textarea", rows: 3, gridSpan: 2 },
    ],
  },
  {
    id: "cifras",
    title: "Franja de cifras",
    description: 'Valor "AUTO" se calcula solo desde los proyectos (clave: anios/proyectos/toneladas/m2). O escribe un número fijo y deja la clave vacía.',
    fields: [
      {
        name: "stats",
        label: "Cifras",
        kind: "objectArray",
        gridSpan: 2,
        itemTemplate: { clave: "", valor: "AUTO", sufijo: "+", label: "" },
        itemFields: [
          {
            name: "clave",
            label: "Origen automático",
            kind: "select",
            options: [
              { value: "", label: "Literal (manual)" },
              { value: "anios", label: "Años (auto)" },
              { value: "proyectos", label: "Proyectos (auto)" },
              { value: "toneladas", label: "Toneladas (auto)" },
              { value: "m2", label: "m² (auto)" },
            ],
          },
          { name: "valor", label: "Valor", kind: "text", placeholder: 'AUTO o "30"' },
          { name: "sufijo", label: "Sufijo", kind: "text", placeholder: "+" },
          { name: "label", label: "Etiqueta", kind: "text", required: true, gridSpan: 2 },
        ],
        itemLabel: (item, i) =>
          typeof item.label === "string" && item.label ? String(item.label) : `Cifra ${String(i + 1).padStart(2, "0")}`,
      },
    ],
  },
  {
    id: "proceso",
    title: "Intro del Proceso Integral",
    description: 'Los textos de las 4 fases se editan en la pestaña "Proceso Integral".',
    fields: [
      { name: "procesoEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "procesoTitulo1", label: "Título línea 1", kind: "text" },
      { name: "procesoTitulo2", label: "Título línea 2 (gris)", kind: "text" },
      { name: "procesoParrafo", label: "Párrafo", kind: "textarea", rows: 3, gridSpan: 2 },
    ],
  },
  {
    id: "sectores",
    title: "Sectores que atendemos",
    description: 'Cada tarjeta enlaza a /soluciones/[slug]. El "slug" debe coincidir con una landing existente.',
    fields: [
      { name: "sectoresEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "sectoresTitulo1", label: "Título línea 1", kind: "text" },
      { name: "sectoresTitulo2", label: "Título línea 2 (gris)", kind: "text" },
      { name: "sectoresParrafo", label: "Párrafo", kind: "textarea", rows: 3, gridSpan: 2 },
      {
        name: "sectores",
        label: "Tarjetas de sector",
        kind: "objectArray",
        gridSpan: 2,
        itemTemplate: { label: "", desc: "", slug: "" },
        itemFields: [
          { name: "label", label: "Nombre", kind: "text", required: true, gridSpan: 2 },
          { name: "desc", label: "Descripción", kind: "textarea", rows: 2, gridSpan: 2 },
          { name: "slug", label: "Slug de /soluciones", kind: "text", required: true, gridSpan: 2, placeholder: "puentes-metalicos" },
        ],
        itemLabel: (item, i) =>
          typeof item.label === "string" && item.label ? String(item.label) : `Sector ${String(i + 1).padStart(2, "0")}`,
      },
    ],
  },
  {
    id: "cta",
    title: "CTA final",
    fields: [
      { name: "ctaEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "ctaTitulo1", label: "Título línea 1", kind: "text" },
      { name: "ctaTitulo2", label: "Título línea 2 (gris)", kind: "text" },
      { name: "ctaParrafo", label: "Párrafo", kind: "textarea", rows: 3, gridSpan: 2 },
      { name: "ctaPrimarioTexto", label: "Botón primario — texto", kind: "text" },
      { name: "ctaPrimarioHref", label: "Botón primario — enlace", kind: "text", placeholder: "/contacto" },
      { name: "ctaSecundarioTexto", label: "Botón secundario — texto", kind: "text" },
      { name: "ctaSecundarioHref", label: "Botón secundario — enlace", kind: "text", placeholder: "/proyectos" },
    ],
  },
]

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

export function ServicesAdminTabs({ servicios, procesoFases, paginaConfig }: Props) {
  return (
    <AdminTabsLayout
      eyebrow="Contenido del sitio"
      title="Servicios"
      description="Página /servicios (textos, cifras, sectores, CTA), catálogo de servicios y las 4 fases del Proceso Integral."
      tabs={[
        {
          id: "pagina",
          label: "Página",
          content: (
            <SingletonEditor
              data={paginaConfig}
              sections={paginaSections}
              endpoint="/api/admin/services/pagina"
              sectionTitle="Contenido de la página /servicios"
              description="Hero, franja de cifras, intro del proceso, sección de sectores y CTA. El catálogo y las fases se editan en las otras pestañas."
            />
          ),
        },
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

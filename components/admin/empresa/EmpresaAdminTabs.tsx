"use client"

import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import { SingletonEditor, type SingletonSection } from "@/components/admin/shared/SingletonEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { PLANT_FIELDS, plantTemplate, PlantPreview } from "./PlantFields"
import type {
  ConfiguracionEmpresa,
  CompanyValue,
  TimelineHito,
  Certificacion,
  Norma,
  Plant,
} from "@prisma/client"

interface Props {
  config: ConfiguracionEmpresa | null
  valores: CompanyValue[]
  hitos: TimelineHito[]
  certificaciones: Certificacion[]
  normas: Norma[]
  plantas: Plant[]
}

const configSections: SingletonSection[] = [
  {
    id: "identidad",
    title: "Identidad",
    description: "Datos generales y propuesta de valor de la empresa.",
    fields: [
      { name: "nombre", label: "Nombre corto", kind: "text", required: true },
      { name: "nombreCompleto", label: "Nombre completo", kind: "text", required: true },
      { name: "fundacion", label: "Año fundación", kind: "number", min: 1900, max: 2100, required: true },
      { name: "mision", label: "Misión", kind: "textarea", rows: 3, required: true, gridSpan: 2 },
      { name: "vision", label: "Visión", kind: "textarea", rows: 3, required: true, gridSpan: 2 },
      { name: "descripcion", label: "Descripción general", kind: "textarea", rows: 3, required: true, gridSpan: 2 },
    ],
  },
  {
    id: "lider",
    title: "Cita del líder",
    description: "Texto destacado en la sección 'Creemos'. Autor, cargo e imagen.",
    fields: [
      { name: "liderQuoteTexto", label: "Texto de la cita", kind: "textarea", rows: 3, gridSpan: 2 },
      { name: "liderQuoteAutor", label: "Autor", kind: "text" },
      { name: "liderQuoteCargo", label: "Cargo", kind: "text" },
      { name: "liderQuoteImagen", label: "Imagen del autor", kind: "image", gridSpan: 2 },
    ],
  },
  {
    id: "historia",
    title: "Historia",
    description: "Párrafos introductorios y frases de la sección 'Creemos en…'.",
    fields: [
      {
        name: "historiaIntro",
        label: "Párrafos introductorios",
        kind: "stringArray",
        gridSpan: 2,
        hint: "Cada item es un párrafo. El orden en que los pongas es el orden en que se muestran.",
      },
      {
        name: "frasesCreemos",
        label: "Frases 'Creemos en…'",
        kind: "stringArray",
        gridSpan: 2,
        hint: "Frases cortas editoriales.",
      },
    ],
  },
  {
    id: "seguridad",
    title: "Seguridad laboral",
    description: "Mensaje de compromiso con seguridad en la sección Compromiso.",
    fields: [
      { name: "seguridadTitulo", label: "Título", kind: "text" },
      { name: "seguridadSubtitulo", label: "Subtítulo", kind: "text" },
      { name: "seguridadItems", label: "Items (bullets)", kind: "stringArray", gridSpan: 2 },
      { name: "seguridadMeta", label: "Meta destacada", kind: "text", gridSpan: 2 },
    ],
  },
  {
    id: "sostenibilidad",
    title: "Sostenibilidad",
    description: "Mensaje de compromiso ambiental en la sección Compromiso.",
    fields: [
      { name: "sostenibilidadTitulo", label: "Título", kind: "text" },
      { name: "sostenibilidadSubtitulo", label: "Subtítulo", kind: "text" },
      { name: "sostenibilidadItems", label: "Items (bullets)", kind: "stringArray", gridSpan: 2 },
      {
        name: "sostenibilidadCompromiso",
        label: "Compromiso (cierre)",
        kind: "textarea",
        rows: 2,
        gridSpan: 2,
      },
    ],
  },
]

const valorFields: FieldDef[] = [
  { name: "slug", label: "Slug", kind: "text", required: true, placeholder: "efectividad" },
  { name: "nombre", label: "Nombre", kind: "text", required: true },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 2, required: true, gridSpan: 2 },
  { name: "icono", label: "Icono (nombre Lucide)", kind: "text", placeholder: "Target" },
  { name: "imagen", label: "Imagen", kind: "image" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const hitoFields: FieldDef[] = [
  { name: "periodo", label: "Periodo", kind: "text", required: true, placeholder: "2006-2010" },
  { name: "titulo", label: "Título", kind: "text", required: true },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 2, required: true, gridSpan: 2 },
  { name: "destacado", label: "Destacado (ej. 'Inicio de operaciones')", kind: "text", gridSpan: 2 },
  { name: "icono", label: "Icono", kind: "text" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const certFields: FieldDef[] = [
  { name: "slug", label: "Slug", kind: "text", required: true },
  { name: "nombre", label: "Nombre corto", kind: "text", required: true },
  { name: "nombreCompleto", label: "Nombre completo", kind: "text", gridSpan: 2 },
  { name: "emisor", label: "Emisor", kind: "text" },
  { name: "importancia", label: "Importancia (texto)", kind: "text" },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 2, gridSpan: 2 },
  { name: "beneficios", label: "Beneficios", kind: "stringArray", gridSpan: 2 },
  { name: "logo", label: "Logo", kind: "image" },
  { name: "documentoUrl", label: "URL documento", kind: "url" },
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

export function EmpresaAdminTabs(props: Props) {
  return (
    <AdminTabsLayout
      title="Empresa"
      description="Contenido de la página /empresa: identidad, historia, valores, certificaciones, normas y plantas."
      tabs={[
        {
          id: "identidad",
          label: "Identidad",
          content: (
            <SingletonEditor<ConfiguracionEmpresa>
              data={props.config}
              sections={configSections}
              endpoint="/api/admin/empresa/config"
              sectionTitle="Identidad corporativa"
              description="Datos generales, misión, visión, historia, citas y compromisos."
              emptyDefaults={{
                nombre: "MEISA",
                nombreCompleto: "Metálicas e Ingeniería S.A.S.",
                fundacion: 1996,
                mision: "",
                vision: "",
                descripcion: "",
                historiaIntro: [],
                frasesCreemos: [],
                seguridadItems: [],
                sostenibilidadItems: [],
              }}
            />
          ),
        },
        {
          id: "valores",
          label: "Valores",
          count: props.valores.length,
          content: (
            <ListCrudEditor<CompanyValue>
              items={props.valores}
              fields={valorFields}
              endpoint="/api/admin/empresa/valores"
              emptyTemplate={{
                slug: "",
                nombre: "",
                descripcion: "",
                icono: null,
                imagen: null,
                orden: props.valores.length,
                activo: true,
              }}
              addLabel="Agregar valor"
            />
          ),
        },
        {
          id: "historia",
          label: "Historia (timeline)",
          count: props.hitos.length,
          content: (
            <ListCrudEditor<TimelineHito>
              items={props.hitos}
              fields={hitoFields}
              endpoint="/api/admin/empresa/hitos"
              emptyTemplate={{
                periodo: "",
                titulo: "",
                descripcion: "",
                destacado: null,
                icono: null,
                orden: props.hitos.length,
                activo: true,
              }}
              addLabel="Agregar hito"
              renderPreview={(h) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-mono text-blue-700">
                      {h.periodo}
                    </span>
                    <span className="font-medium text-gray-900">{h.titulo}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{h.descripcion}</p>
                </div>
              )}
            />
          ),
        },
        {
          id: "certificaciones",
          label: "Certificaciones",
          count: props.certificaciones.length,
          content: (
            <ListCrudEditor<Certificacion>
              items={props.certificaciones}
              fields={certFields}
              endpoint="/api/admin/empresa/certificaciones"
              emptyTemplate={{
                slug: "",
                nombre: "",
                nombreCompleto: null,
                descripcion: null,
                emisor: null,
                importancia: null,
                beneficios: [],
                logo: null,
                documentoUrl: null,
                orden: props.certificaciones.length,
                activo: true,
              }}
              addLabel="Agregar certificación"
            />
          ),
        },
        {
          id: "normas",
          label: "Normas",
          count: props.normas.length,
          content: (
            <ListCrudEditor<Norma>
              items={props.normas}
              fields={normaFields}
              endpoint="/api/admin/normas"
              emptyTemplate={{
                codigo: "",
                descripcion: "",
                categoria: null,
                logo: null,
                orden: props.normas.length,
                activo: true,
              }}
              addLabel="Agregar norma"
            />
          ),
        },
        {
          id: "plantas",
          label: "Plantas",
          count: props.plantas.length,
          content: (
            <ListCrudEditor<Plant>
              items={props.plantas}
              fields={PLANT_FIELDS}
              endpoint="/api/admin/plantas"
              emptyTemplate={plantTemplate(props.plantas.length)}
              addLabel="Agregar planta"
              renderPreview={(p) => <PlantPreview plant={p} />}
            />
          ),
        },
      ]}
    />
  )
}

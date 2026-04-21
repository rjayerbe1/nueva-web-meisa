"use client"

import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import {
  SingletonEditor,
  type SingletonSection,
} from "@/components/admin/shared/SingletonEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { CategoriaEnum } from "@prisma/client"
import type { ResumenAnio, ConfiguracionTrayectoria } from "@prisma/client"

export interface ProyectoHojaVidaSerializado {
  id: string
  entidadContratante: string
  objetoContrato: string
  tituloDisplay: string | null
  descripcionSecundaria: string | null
  fechaInicio: string
  fechaFin: string
  pesoKg: number | null
  areaM2: number | null
  ubicacion: string
  departamento: string | null
  valorContrato: number
  moneda: string
  categoria: CategoriaEnum
  imagenes: string[]
  destacado: boolean
  visible: boolean
  orden: number
}

interface Props {
  proyectos: ProyectoHojaVidaSerializado[]
  resumenes: ResumenAnio[]
  config: ConfiguracionTrayectoria | null
}

/* ─── Proyectos hoja de vida ──────────────────────────────────────────── */

const categoriaOptions = [
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "COMERCIAL", label: "Comercial" },
  { value: "PUENTES", label: "Puentes" },
  { value: "INFRAESTRUCTURA_URBANA", label: "Infraestructura urbana" },
  { value: "EDIFICACIONES", label: "Edificaciones" },
  { value: "DEPORTES_EDUCACION", label: "Deportes y educación" },
  { value: "OTRO", label: "Otro" },
]

const monedaOptions = [
  { value: "COP", label: "COP" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
]

const proyectoFields: FieldDef[] = [
  {
    name: "entidadContratante",
    label: "Entidad contratante",
    kind: "text",
    required: true,
    gridSpan: 2,
    placeholder: "Alcaldía de Cali",
  },
  {
    name: "objetoContrato",
    label: "Objeto del contrato",
    kind: "textarea",
    rows: 2,
    required: true,
    gridSpan: 2,
  },
  { name: "tituloDisplay", label: "Título alternativo (opcional)", kind: "text", gridSpan: 2 },
  {
    name: "descripcionSecundaria",
    label: "Descripción secundaria",
    kind: "textarea",
    rows: 2,
    gridSpan: 2,
  },
  { name: "categoria", label: "Categoría", kind: "select", required: true, options: categoriaOptions },
  { name: "ubicacion", label: "Ubicación", kind: "text", required: true, placeholder: "Cali, Valle del Cauca" },
  { name: "departamento", label: "Departamento", kind: "text" },
  { name: "fechaInicio", label: "Fecha inicio", kind: "date", required: true },
  { name: "fechaFin", label: "Fecha fin", kind: "date", required: true },
  { name: "pesoKg", label: "Peso (kg)", kind: "number", step: 0.01, min: 0 },
  { name: "areaM2", label: "Área (m²)", kind: "number", step: 0.01, min: 0 },
  { name: "valorContrato", label: "Valor del contrato", kind: "number", required: true, min: 0 },
  { name: "moneda", label: "Moneda", kind: "select", options: monedaOptions },
  {
    name: "imagenes",
    label: "Imágenes del proyecto",
    kind: "imageArray",
    gridSpan: 2,
    hint: "Cada imagen se selecciona desde la biblioteca o se sube directamente.",
  },
  { name: "destacado", label: "Destacado", kind: "boolean" },
  { name: "visible", label: "Visible en el sitio", kind: "boolean" },
  { name: "orden", label: "Orden", kind: "number" },
]

/* ─── Resúmenes de año ────────────────────────────────────────────────── */

const resumenFields: FieldDef[] = [
  { name: "anio", label: "Año", kind: "number", required: true, min: 1900, max: 2100 },
  { name: "titulo", label: "Título", kind: "text", required: true, gridSpan: 2 },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 4, required: true, gridSpan: 2 },
  {
    name: "imagenesFeatured",
    label: "Imágenes destacadas",
    kind: "imageArray",
    gridSpan: 2,
    hint: "La primera aparece como miniatura en la lista del admin.",
  },
  { name: "visible", label: "Visible", kind: "boolean" },
]

/* ─── Configuración corporativa ───────────────────────────────────────── */

const configSections: SingletonSection[] = [
  {
    id: "resena",
    title: "Reseña histórica",
    description: "Aparece al final de la página de trayectoria.",
    fields: [
      {
        name: "resenaHistorica",
        label: "Historia de la empresa",
        kind: "textarea",
        rows: 8,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "mision-vision",
    title: "Misión y visión",
    description: "Bloques de misión/visión mostrados en /trayectoria.",
    fields: [
      { name: "mision", label: "Misión", kind: "textarea", rows: 5, gridSpan: 2 },
      { name: "vision", label: "Visión", kind: "textarea", rows: 5, gridSpan: 2 },
    ],
  },
]

export function TrayectoriaAdminTabs({ proyectos, resumenes, config }: Props) {
  return (
    <AdminTabsLayout
      eyebrow="Contenido del sitio"
      title="Trayectoria"
      description="Proyectos de la hoja de vida corporativa, resúmenes por año y configuración editorial de /trayectoria."
      tabs={[
        {
          id: "proyectos",
          label: "Proyectos hoja de vida",
          count: proyectos.length,
          content: (
            <ListCrudEditor<ProyectoHojaVidaSerializado>
              items={proyectos}
              fields={proyectoFields}
              endpoint="/api/admin/trayectoria/proyectos"
              emptyTemplate={{
                entidadContratante: "",
                objetoContrato: "",
                tituloDisplay: null,
                descripcionSecundaria: null,
                fechaInicio: "",
                fechaFin: "",
                pesoKg: null,
                areaM2: null,
                ubicacion: "",
                departamento: null,
                valorContrato: 0,
                moneda: "COP",
                categoria: CategoriaEnum.INDUSTRIAL,
                imagenes: [],
                destacado: false,
                visible: true,
                orden: proyectos.length,
              }}
              addLabel="Agregar proyecto"
              tableColumns={[
                { key: "entidadContratante", label: "Entidad" },
                { key: "categoria", label: "Categoría" },
                { key: "ubicacion", label: "Ubicación" },
                { key: "valorContrato", label: "Valor", className: "text-right" },
              ]}
              renderPreview={(p) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-base uppercase tracking-wide text-slate-950">
                      {p.tituloDisplay || p.entidadContratante}
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
                  <p className="mt-0.5 line-clamp-1 font-lato text-xs text-slate-500">
                    {p.objetoContrato}
                  </p>
                  <p className="mt-0.5 font-lato text-[11px] text-slate-400">
                    {p.ubicacion}
                    {p.departamento ? ` · ${p.departamento}` : ""} · {p.categoria} ·{" "}
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: p.moneda,
                      maximumFractionDigits: 0,
                    }).format(p.valorContrato)}
                  </p>
                </div>
              )}
            />
          ),
        },
        {
          id: "resumenes",
          label: "Resúmenes por año",
          count: resumenes.length,
          content: (
            <ListCrudEditor<ResumenAnio>
              items={resumenes}
              fields={resumenFields}
              endpoint="/api/admin/trayectoria/resumenes"
              emptyTemplate={{
                anio: new Date().getFullYear(),
                titulo: "",
                descripcion: "",
                imagenesFeatured: [],
                visible: true,
              }}
              addLabel="Agregar resumen"
              canReorder={false}
              renderPreview={(r) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-xl uppercase tracking-wide text-red-600">
                      {r.anio}
                    </span>
                    <span className="font-lato text-sm font-semibold text-slate-900">
                      {r.titulo}
                    </span>
                    {!r.visible && (
                      <span className="rounded-none border border-slate-300 bg-stone-100 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Oculto
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 font-lato text-xs text-slate-500">
                    {r.descripcion}
                  </p>
                </div>
              )}
            />
          ),
        },
        {
          id: "configuracion",
          label: "Configuración",
          content: (
            <SingletonEditor<ConfiguracionTrayectoria>
              data={config}
              sections={configSections}
              endpoint="/api/admin/trayectoria/config"
              sectionTitle="Configuración corporativa"
              description="Reseña histórica, misión y visión. Los valores corporativos se gestionan desde /admin/empresa."
            />
          ),
        },
      ]}
    />
  )
}

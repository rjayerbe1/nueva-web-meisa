"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"
import { ArrowLeft, ExternalLink, Save, Loader2, Check } from "lucide-react"
import type { Servicio } from "@prisma/client"

interface Props {
  servicio: Servicio
}

const COLOR_OPTIONS = [
  { value: "blue", label: "Azul" },
  { value: "red", label: "Rojo" },
  { value: "amber", label: "Amber" },
  { value: "green", label: "Verde" },
  { value: "purple", label: "Violeta" },
  { value: "slate", label: "Slate" },
]

/* ─── Field groups por tab ─── */

const identidadFields: FieldDef[] = [
  { name: "slug", label: "Slug (único)", kind: "text", required: true },
  { name: "nombre", label: "Nombre corto", kind: "text", required: true },
  { name: "titulo", label: "Título mostrado", kind: "text", gridSpan: 2 },
  { name: "subtitulo", label: "Subtítulo", kind: "text", gridSpan: 2 },
  {
    name: "descripcion",
    label: "Descripción",
    kind: "textarea",
    rows: 4,
    required: true,
    gridSpan: 2,
  },
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
]

const seoFields: FieldDef[] = [
  { name: "metaTitle", label: "SEO — título", kind: "text", gridSpan: 2 },
  { name: "metaDescription", label: "SEO — descripción", kind: "textarea", rows: 3, gridSpan: 2 },
  {
    name: "expertiseTitulo",
    label: "Expertise — título",
    kind: "text",
    gridSpan: 2,
    hint: "Aparece como headline de la sección 'Nuestra experiencia'.",
  },
  {
    name: "expertiseDescripcion",
    label: "Expertise — descripción",
    kind: "textarea",
    rows: 4,
    gridSpan: 2,
  },
  {
    name: "caracteristicas",
    label: "Características clave",
    kind: "stringArray",
    multiline: true,
    rows: 2,
    gridSpan: 2,
    hint: "Bullets cortos que describen el servicio.",
  },
]

const especificacionesFields: FieldDef[] = [
  {
    name: "tecnologias",
    label: "Tecnologías",
    kind: "objectArray",
    gridSpan: 2,
    hint: "Software y herramientas. El detalle muestra cada una como tarjeta (nombre + descripción).",
    itemTemplate: { nombre: "", descripcion: "" },
    itemFields: [
      { name: "nombre", label: "Nombre", kind: "text", required: true, gridSpan: 2, placeholder: "Tekla Structures" },
      { name: "descripcion", label: "Descripción", kind: "textarea", rows: 2, gridSpan: 2 },
    ],
    itemLabel: (item, i) =>
      typeof item.nombre === "string" && item.nombre
        ? String(item.nombre)
        : `Tecnología ${String(i + 1).padStart(2, "0")}`,
  },
  {
    name: "normativas",
    label: "Normativas aplicables",
    kind: "json",
    rows: 10,
    gridSpan: 2,
    hint: 'Forma: { "titulo": "Normativas aplicables", "items": ["NSR-10 — …", "AWS D1.1 — …"] }. Se muestra en el listado y en el detalle.',
  },
  {
    name: "equipamiento",
    label: "Equipamiento",
    kind: "objectArray",
    gridSpan: 2,
    hint: "Maquinaria y equipos. El detalle muestra nombre, capacidad y cantidad.",
    itemTemplate: { nombre: "", capacidad: "", cantidad: undefined },
    itemFields: [
      { name: "nombre", label: "Nombre", kind: "text", required: true, gridSpan: 2, placeholder: "Puentes grúa" },
      { name: "capacidad", label: "Capacidad", kind: "text", gridSpan: 2, placeholder: "De 5 a 20 toneladas" },
      { name: "cantidad", label: "Cantidad", kind: "number" },
    ],
    itemLabel: (item, i) =>
      typeof item.nombre === "string" && item.nombre
        ? String(item.nombre)
        : `Equipo ${String(i + 1).padStart(2, "0")}`,
  },
  {
    name: "equipos",
    label: "Equipos humanos / especializados",
    kind: "stringArray",
    multiline: true,
    rows: 2,
    gridSpan: 2,
    hint: "Roles o áreas que participan en el servicio (no se muestra en el detalle actual).",
  },
]

const galeriaFields: FieldDef[] = [
  {
    name: "imagenesGaleria",
    label: "Galería de imágenes",
    kind: "imageArray",
    gridSpan: 2,
    hint: "Imágenes que aparecen en la sección 'Galería' del detalle.",
  },
  {
    name: "videoDemostrativo",
    label: "Video demostrativo",
    kind: "video",
    gridSpan: 2,
  },
]

const estadisticasFields: FieldDef[] = [
  {
    name: "estadisticas",
    label: "Estadísticas",
    kind: "objectArray",
    gridSpan: 2,
    hint: "Números destacados del servicio (ej: '150+ proyectos', '20 años experiencia').",
    itemTemplate: { value: "", label: "", icon: "" },
    itemFields: [
      { name: "value", label: "Valor", kind: "text", required: true, placeholder: "150+" },
      { name: "label", label: "Etiqueta", kind: "text", required: true, gridSpan: 2 },
      { name: "icon", label: "Icono (nombre Lucide)", kind: "text", placeholder: "Award" },
    ],
    itemLabel: (item, i) =>
      typeof item.value === "string" && item.value
        ? `${String(item.value)} — ${String(item.label ?? "")}`
        : `Estadística ${String(i + 1).padStart(2, "0")}`,
  },
]

const procesoFields: FieldDef[] = [
  {
    name: "procesoPasos",
    label: "Pasos del proceso",
    kind: "objectArray",
    gridSpan: 2,
    hint: "Pasos específicos que describen cómo se ejecuta este servicio.",
    itemTemplate: { title: "", description: "", icon: "" },
    itemFields: [
      { name: "title", label: "Título del paso", kind: "text", required: true, gridSpan: 2 },
      {
        name: "description",
        label: "Descripción",
        kind: "textarea",
        rows: 3,
        required: true,
        gridSpan: 2,
      },
      { name: "icon", label: "Icono (Lucide)", kind: "text", placeholder: "Settings" },
    ],
    itemLabel: (item, i) =>
      typeof item.title === "string" && item.title
        ? String(item.title)
        : `Paso ${String(i + 1).padStart(2, "0")}`,
  },
]

const faqFields: FieldDef[] = [
  {
    name: "preguntasFrecuentes",
    label: "Preguntas frecuentes",
    kind: "objectArray",
    gridSpan: 2,
    itemTemplate: { pregunta: "", respuesta: "" },
    itemFields: [
      { name: "pregunta", label: "Pregunta", kind: "text", required: true, gridSpan: 2 },
      {
        name: "respuesta",
        label: "Respuesta",
        kind: "textarea",
        rows: 4,
        required: true,
        gridSpan: 2,
      },
    ],
    itemLabel: (item, i) =>
      typeof item.pregunta === "string" && item.pregunta
        ? String(item.pregunta)
        : `Pregunta ${String(i + 1).padStart(2, "0")}`,
  },
  {
    name: "recursosDescargables",
    label: "Recursos descargables",
    kind: "objectArray",
    gridSpan: 2,
    hint: "PDFs, brochures, documentos técnicos.",
    itemTemplate: { nombre: "", url: "", tipo: "PDF" },
    itemFields: [
      { name: "nombre", label: "Nombre", kind: "text", required: true, gridSpan: 2 },
      { name: "url", label: "URL", kind: "url", required: true, gridSpan: 2 },
      { name: "tipo", label: "Tipo", kind: "text", placeholder: "PDF | DOC | ZIP" },
    ],
    itemLabel: (item, i) =>
      typeof item.nombre === "string" && item.nombre
        ? String(item.nombre)
        : `Recurso ${String(i + 1).padStart(2, "0")}`,
  },
  {
    name: "tablaComparativa",
    label: "Tabla comparativa (JSON libre)",
    kind: "json",
    rows: 12,
    gridSpan: 2,
    hint: "Estructura personalizada. Si no sabés qué poner, déjalo vacío.",
  },
]

/* ─── Editor component ─── */

export function ServicioDetailEditor({ servicio }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<Record<string, unknown>>({ ...(servicio as any) })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const setField = (name: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const { id, createdAt, updatedAt, ...body } = form as any
      const res = await fetch(`/api/admin/services/${servicio.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error")
      }
      const saved = await res.json()
      setForm(saved)
      setSavedAt(Date.now())
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!confirm(`¿Eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`))
      return
    const res = await fetch(`/api/admin/services/${servicio.id}`, { method: "DELETE" })
    if (res.ok) {
      router.push("/admin/services")
      router.refresh()
    } else {
      alert("Error eliminando")
    }
  }

  const justSaved = savedAt !== null && Date.now() - savedAt < 3000

  const renderFields = (fields: FieldDef[]) => (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
        {fields.map((f) => (
          <FormField
            key={f.name}
            field={f}
            value={form[f.name]}
            onChange={(v) => setField(f.name, v)}
            disabled={saving}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Back + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-red-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al catálogo
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/servicios/${servicio.slug}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-3 py-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600"
          >
            Ver pública
            <ExternalLink className="h-3 w-3" />
          </Link>
          <button
            onClick={remove}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-3 py-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors hover:border-red-600 hover:text-red-600 disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>
      </div>

      <AdminTabsLayout
        eyebrow="Servicio"
        title={(form.titulo as string) || (form.nombre as string) || "Servicio"}
        description={(form.subtitulo as string) ?? undefined}
        tabs={[
          { id: "identidad", label: "Identidad", content: renderFields(identidadFields) },
          { id: "seo", label: "SEO & Expertise", content: renderFields(seoFields) },
          {
            id: "especificaciones",
            label: "Especificaciones",
            content: renderFields(especificacionesFields),
          },
          { id: "galeria", label: "Galería & Media", content: renderFields(galeriaFields) },
          { id: "estadisticas", label: "Estadísticas", content: renderFields(estadisticasFields) },
          { id: "proceso", label: "Proceso", content: renderFields(procesoFields) },
          { id: "faq-recursos", label: "FAQ & Recursos", content: renderFields(faqFields) },
        ]}
      />

      {error && (
        <div className="rounded-none border border-red-200 bg-red-50 px-4 py-3 font-lato text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Sticky footer */}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-10 lg:px-10">
        {justSaved && (
          <span className="flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wide text-green-700">
            <Check className="h-3.5 w-3.5" />
            Guardado
          </span>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-none bg-red-600 px-5 py-2.5 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Guardar cambios
        </button>
      </div>
    </div>
  )
}

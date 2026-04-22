"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"
import { ArrowLeft, ExternalLink, Save, Loader2, Check } from "lucide-react"
import type { CategoriaProyecto } from "@prisma/client"

const identidadFields: FieldDef[] = [
  { name: "nombre", label: "Nombre", kind: "text", required: true },
  { name: "slug", label: "Slug (único)", kind: "text", required: true },
  {
    name: "key",
    label: "Key (enum)",
    kind: "select",
    required: true,
    options: [
      { value: "COMERCIAL", label: "COMERCIAL" },
      { value: "INDUSTRIAL", label: "INDUSTRIAL" },
      { value: "PUENTES", label: "PUENTES" },
      { value: "INFRAESTRUCTURA_URBANA", label: "INFRAESTRUCTURA_URBANA" },
      { value: "EDIFICACIONES", label: "EDIFICACIONES" },
      { value: "DEPORTES_EDUCACION", label: "DEPORTES_EDUCACION" },
      { value: "OTRO", label: "OTRO" },
    ],
    hint: "Identificador técnico interno. No cambiarlo a menos que sepas qué haces.",
  },
  { name: "icono", label: "Icono (Lucide)", kind: "text", placeholder: "Building2" },
  { name: "descripcion", label: "Descripción corta", kind: "textarea", rows: 2, gridSpan: 2 },
  {
    name: "descripcionAmpliada",
    label: "Descripción ampliada",
    kind: "textarea",
    rows: 5,
    gridSpan: 2,
    hint: "Texto editorial largo que aparece en /proyectos/categoria/[slug].",
  },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "visible", label: "Visible", kind: "boolean" },
  { name: "destacada", label: "Destacada", kind: "boolean" },
]

const visualFields: FieldDef[] = [
  { name: "imagenCover", label: "Imagen cover", kind: "image", gridSpan: 2 },
  { name: "imagenBanner", label: "Imagen banner", kind: "image", gridSpan: 2 },
  { name: "videoCover", label: "Video cover", kind: "video", gridSpan: 2 },
  {
    name: "usarVideoCover",
    label: "Usar video cover (en vez de imagen)",
    kind: "boolean",
  },
  {
    name: "videoCoverScale",
    label: "Escala video cover",
    kind: "number",
    step: 0.05,
    min: 0.5,
    max: 3,
  },
  {
    name: "videoCoverPosition",
    label: "Posición video cover",
    kind: "text",
    placeholder: "center center",
    gridSpan: 2,
  },
  { name: "videoBanner", label: "Video banner", kind: "video", gridSpan: 2 },
  { name: "usarVideoBanner", label: "Usar video banner", kind: "boolean" },
  {
    name: "videoBannerScale",
    label: "Escala video banner",
    kind: "number",
    step: 0.05,
    min: 0.5,
    max: 3,
  },
  {
    name: "videoBannerPosition",
    label: "Posición video banner",
    kind: "text",
    placeholder: "center center",
    gridSpan: 2,
  },
  { name: "color", label: "Color primario (hex)", kind: "text", placeholder: "#1e40af" },
  { name: "colorSecundario", label: "Color secundario", kind: "text", placeholder: "#dc2626" },
]

const overlayFields: FieldDef[] = [
  { name: "overlayColor", label: "Overlay color (hex)", kind: "text", placeholder: "#000000" },
  {
    name: "overlayOpacity",
    label: "Overlay opacity",
    kind: "number",
    step: 0.05,
    min: 0,
    max: 1,
  },
  {
    name: "hoverOverlayColor",
    label: "Hover overlay color",
    kind: "text",
    placeholder: "#1e40af",
  },
  {
    name: "hoverOverlayOpacity",
    label: "Hover overlay opacity",
    kind: "number",
    step: 0.05,
    min: 0,
    max: 1,
  },
  { name: "enableHoverOverlay", label: "Activar hover overlay", kind: "boolean", gridSpan: 2 },
]

const contenidoFields: FieldDef[] = [
  {
    name: "especialidades",
    label: "Especialidades (JSON libre)",
    kind: "json",
    rows: 8,
    gridSpan: 2,
    hint: "Estructura flexible. Ejemplo: array de {titulo, descripcion}.",
  },
  {
    name: "estadisticas",
    label: "Estadísticas (JSON libre)",
    kind: "json",
    rows: 8,
    gridSpan: 2,
  },
  {
    name: "procesoTrabajo",
    label: "Proceso de trabajo (JSON libre)",
    kind: "json",
    rows: 8,
    gridSpan: 2,
  },
  {
    name: "casosExitoIds",
    label: "IDs de casos de éxito (JSON array)",
    kind: "json",
    rows: 4,
    gridSpan: 2,
    hint: 'Ejemplo: ["proyecto-id-1", "proyecto-id-2"]',
  },
]

const seoFields: FieldDef[] = [
  { name: "metaTitle", label: "SEO — título", kind: "text", gridSpan: 2 },
  { name: "metaDescription", label: "SEO — descripción", kind: "textarea", rows: 3, gridSpan: 2 },
]

export function CategoriaDetailEditor({ categoria }: { categoria: CategoriaProyecto }) {
  const router = useRouter()
  const [form, setForm] = useState<Record<string, unknown>>({ ...(categoria as any) })
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
      const { id, createdAt, updatedAt, totalProyectos, ...body } = form as any
      const res = await fetch(`/api/admin/categories/${categoria.id}`, {
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
    if (
      !confirm(
        `¿Eliminar la categoría "${categoria.nombre}"? Esta acción no se puede deshacer.`,
      )
    )
      return
    const res = await fetch(`/api/admin/categories/${categoria.id}`, { method: "DELETE" })
    if (res.ok) {
      router.push("/admin/projects")
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/projects?tab=categorias"
          className="inline-flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-red-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a categorías
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/proyectos/categoria/${categoria.slug}`}
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
        eyebrow="Categoría"
        title={(form.nombre as string) || "Categoría"}
        description={(form.descripcion as string) ?? undefined}
        tabs={[
          { id: "identidad", label: "Identidad", content: renderFields(identidadFields) },
          { id: "visuales", label: "Visuales", content: renderFields(visualFields) },
          { id: "overlay", label: "Overlay & Hover", content: renderFields(overlayFields) },
          { id: "contenido", label: "Contenido ampliado", content: renderFields(contenidoFields) },
          { id: "seo", label: "SEO", content: renderFields(seoFields) },
        ]}
      />

      {error && (
        <div className="rounded-none border border-red-200 bg-red-50 px-4 py-3 font-lato text-sm text-red-700">
          {error}
        </div>
      )}

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
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Guardar cambios
        </button>
      </div>
    </div>
  )
}

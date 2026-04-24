"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"
import { ArrowLeft, ExternalLink, Save, Loader2, Check } from "lucide-react"
import type { Obra, CategoriaEnum } from "@prisma/client"
import { ProyectosPicker } from "./ProyectosPicker"

interface Props {
  obra: Obra
}

const identidadFields: FieldDef[] = [
  { name: "titulo", label: "Título", kind: "text", required: true, gridSpan: 2 },
  { name: "slug", label: "Slug (único, URL /obras/{slug})", kind: "text", required: true },
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
  {
    name: "resumenCorto",
    label: "Resumen corto",
    kind: "textarea",
    rows: 2,
    gridSpan: 2,
    hint: "Frase corta que aparece bajo el título en la página de la obra.",
  },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activa", label: "Activa (visible)", kind: "boolean" },
  { name: "destacada", label: "Destacada", kind: "boolean" },
  {
    name: "esCadena",
    label: "Es cadena/independientes",
    kind: "boolean",
    gridSpan: 2,
    hint: "Activar si los proyectos son independientes (ej: locales de Dollar City, CCs en varias ciudades). Desactivar si son fases del mismo edificio (ej: Campanario original + ampliación).",
  },
]

const narrativaFields: FieldDef[] = [
  {
    name: "contexto",
    label: "Contexto — la obra",
    kind: "textarea",
    rows: 5,
    gridSpan: 2,
    hint: "Qué es la obra y por qué se hizo. Se muestra en la sección 'La obra'.",
  },
  {
    name: "problemasIniciales",
    label: "Problemas iniciales",
    kind: "textarea",
    rows: 4,
    gridSpan: 2,
    hint: "Encabezado de la sección 'Retos técnicos'.",
  },
  {
    name: "desafios",
    label: "Desafíos (máx 4 visibles)",
    kind: "stringArray",
    gridSpan: 2,
    multiline: true,
    rows: 2,
    hint: "Una línea por desafío. Se muestran como grid numerado.",
    placeholder: "Ej: Construcción sin interrumpir operación del CC",
  },
  {
    name: "solucionTecnica",
    label: "Solución técnica — cómo se construyó",
    kind: "textarea",
    rows: 5,
    gridSpan: 2,
  },
  {
    name: "innovaciones",
    label: "Innovaciones aplicadas",
    kind: "stringArray",
    gridSpan: 2,
    multiline: true,
    rows: 2,
    hint: "Una línea por innovación. Se muestran como bullets con acento rojo.",
  },
  {
    name: "resultados",
    label: "Resultados entregados (máx 4 visibles)",
    kind: "stringArray",
    gridSpan: 2,
    multiline: true,
    rows: 2,
    hint: "Una línea por resultado.",
  },
  {
    name: "impactoCliente",
    label: "Impacto para el cliente",
    kind: "textarea",
    rows: 4,
    gridSpan: 2,
  },
  {
    name: "testimonioCliente",
    label: "Testimonio del cliente (opcional)",
    kind: "textarea",
    rows: 4,
    gridSpan: 2,
    hint: "Dejar vacío para ocultar la sección de testimonio.",
  },
  {
    name: "tagsTecnicos",
    label: "Especialidades técnicas",
    kind: "stringArray",
    gridSpan: 2,
    placeholder: "Ej: BIM 4D · NSR-10 · soldadura robotizada",
  },
  {
    name: "leccionesAprendidas",
    label: "Notas técnicas",
    kind: "textarea",
    rows: 3,
    gridSpan: 2,
  },
]

const multimediaFields: FieldDef[] = [
  {
    name: "imagenDestacada",
    label: "Imagen destacada (hero de /obras/{slug})",
    kind: "image",
    gridSpan: 2,
  },
  { name: "videoUrl", label: "Video destacado (URL)", kind: "video", gridSpan: 2 },
]

const seoFields: FieldDef[] = [
  { name: "metaTitle", label: "Meta título", kind: "text", gridSpan: 2 },
  { name: "metaDescription", label: "Meta descripción", kind: "textarea", rows: 3, gridSpan: 2 },
]

export function ObraDetailEditor({ obra }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<Record<string, unknown>>({ ...(obra as any) })
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
      const res = await fetch(`/api/admin/obras/${obra.id}`, {
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
    if (!confirm(`¿Eliminar la obra "${obra.titulo}"? Los proyectos vinculados se desvinculan (no se borran).`))
      return
    const res = await fetch(`/api/admin/obras/${obra.id}`, { method: "DELETE" })
    if (res.ok) {
      router.push("/admin/obras")
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

  const proyectosPanel = (
    <div className="rounded-md border border-slate-200 bg-white px-6 py-6">
      <ProyectosPicker obraId={obra.id} disabled={saving} />
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/obras"
          className="inline-flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-red-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a obras
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/obras/${obra.slug}`}
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
        eyebrow="Obra"
        title={(form.titulo as string) || "Obra"}
        description={(form.resumenCorto as string) ?? undefined}
        tabs={[
          { id: "identidad", label: "Identidad", content: renderFields(identidadFields) },
          { id: "narrativa", label: "Narrativa", content: renderFields(narrativaFields) },
          { id: "proyectos", label: "Proyectos", content: proyectosPanel },
          { id: "multimedia", label: "Multimedia", content: renderFields(multimediaFields) },
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

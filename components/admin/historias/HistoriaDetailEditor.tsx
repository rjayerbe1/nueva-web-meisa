"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"
import { ArrowLeft, ExternalLink, Save, Loader2, Check } from "lucide-react"
import type { HistoriaProyecto } from "@prisma/client"

interface ProyectoInfo {
  id: string
  titulo: string
  slug: string
  cliente: string
}

interface Props {
  historia: HistoriaProyecto
  proyecto: ProyectoInfo | null
}

/* ─── Tab field groups ─── */

const basicaFields: FieldDef[] = [
  { name: "tituloAlternativo", label: "Título alternativo", kind: "text", gridSpan: 2 },
  { name: "resumenCorto", label: "Resumen corto", kind: "textarea", rows: 3, gridSpan: 2 },
  { name: "activo", label: "Activa (publicada)", kind: "boolean" },
]

const contextoFields: FieldDef[] = [
  {
    name: "contexto",
    label: "Contexto del proyecto",
    kind: "textarea",
    rows: 6,
    gridSpan: 2,
  },
  {
    name: "problemasIniciales",
    label: "Problemas iniciales",
    kind: "textarea",
    rows: 5,
    gridSpan: 2,
  },
  {
    name: "desafios",
    label: "Desafíos (máx 4 visibles)",
    kind: "stringArray",
    gridSpan: 2,
    multiline: true,
    rows: 2,
    hint: "Una línea por desafío. En la página pública se muestran solo los primeros 4 en un grid numerado 01/02/03/04. Más de 4 saturan visualmente.",
    placeholder: "Ej: Estructura en zona sísmica de alta magnitud",
  },
]

const solucionFields: FieldDef[] = [
  { name: "enfoque", label: "Enfoque", kind: "textarea", rows: 5, gridSpan: 2 },
  {
    name: "solucionTecnica",
    label: "Solución técnica",
    kind: "textarea",
    rows: 6,
    gridSpan: 2,
  },
  { name: "metodologia", label: "Metodología", kind: "textarea", rows: 4, gridSpan: 2 },
  { name: "tiempoTotal", label: "Tiempo total", kind: "text", placeholder: "18 meses" },
  {
    name: "innovaciones",
    label: "Innovaciones aplicadas",
    kind: "stringArray",
    gridSpan: 2,
    multiline: true,
    rows: 2,
    hint: "Una línea por innovación. Se muestran como bullets con acento rojo en la página pública.",
    placeholder: "Ej: Soldadura robotizada de precisión",
  },
]

const procesoFields: FieldDef[] = [
  {
    name: "equipoEspecialista",
    label: "Equipo especialista (JSON)",
    kind: "json",
    rows: 8,
    gridSpan: 2,
    hint: 'Array de objetos o strings. Ej: [{"nombre":"Juan","cargo":"Ing. Estructural"}]',
  },
  {
    name: "fasesEjecucion",
    label: "Fases de ejecución (JSON)",
    kind: "json",
    rows: 8,
    gridSpan: 2,
  },
  {
    name: "recursos",
    label: "Recursos (JSON)",
    kind: "json",
    rows: 5,
    gridSpan: 2,
  },
]

const resultadosFields: FieldDef[] = [
  {
    name: "impactoCliente",
    label: "Impacto al cliente",
    kind: "textarea",
    rows: 5,
    gridSpan: 2,
  },
  { name: "valorAgregado", label: "Valor agregado", kind: "textarea", rows: 4, gridSpan: 2 },
  {
    name: "resultados",
    label: "Resultados entregados (máx 4 visibles)",
    kind: "stringArray",
    gridSpan: 2,
    multiline: true,
    rows: 2,
    hint: "Una línea por resultado. En la página pública se muestran solo los primeros 4 en un grid numerado. Más de 4 saturan visualmente.",
    placeholder: "Ej: Reducción del 30% en tiempo de ejecución",
  },
  {
    name: "reconocimientos",
    label: "Reconocimientos (JSON)",
    kind: "json",
    rows: 5,
    gridSpan: 2,
  },
  {
    name: "leccionesAprendidas",
    label: "Lecciones aprendidas",
    kind: "textarea",
    rows: 4,
    gridSpan: 2,
  },
]

const multimediaFields: FieldDef[] = [
  { name: "imagenDestacada", label: "Imagen destacada", kind: "image", gridSpan: 2 },
  { name: "videoUrl", label: "Video URL", kind: "video", gridSpan: 2 },
  {
    name: "imagenesDesafio",
    label: "Imágenes del desafío",
    kind: "imageArray",
    gridSpan: 2,
    hint: "Fotos que ilustran el estado inicial o los retos a resolver.",
  },
  {
    name: "imagenesSolucion",
    label: "Imágenes de la solución",
    kind: "imageArray",
    gridSpan: 2,
    hint: "Fotos del proceso técnico o constructivo.",
  },
  {
    name: "imagenesResultado",
    label: "Imágenes del resultado",
    kind: "imageArray",
    gridSpan: 2,
    hint: "Fotos finales de la obra entregada.",
  },
  {
    name: "infografias",
    label: "Infografías (JSON)",
    kind: "json",
    rows: 5,
    gridSpan: 2,
  },
]

const metricasFields: FieldDef[] = [
  {
    name: "dificultadTecnica",
    label: "Dificultad técnica (1-10)",
    kind: "number",
    min: 1,
    max: 10,
  },
  {
    name: "innovacionNivel",
    label: "Nivel de innovación (1-10)",
    kind: "number",
    min: 1,
    max: 10,
  },
  {
    name: "tagsTecnicos",
    label: "Tags técnicos",
    kind: "stringArray",
    gridSpan: 2,
    hint: "Palabras clave de ingeniería aplicada. Aparecen como chips en la página pública.",
    placeholder: "Ej: BIM 4D · NSR-10 · AWS D1.1",
  },
  {
    name: "datosInteres",
    label: "Datos de interés (JSON libre)",
    kind: "json",
    rows: 8,
    gridSpan: 2,
    hint: 'Estructura flexible. Ej: {"metrosCuadrados": 2500, "pisos": 12}',
  },
]

const testimoniosFields: FieldDef[] = [
  {
    name: "testimonioCliente",
    label: "Testimonio del cliente",
    kind: "textarea",
    rows: 6,
    gridSpan: 2,
  },
  {
    name: "testimonioEquipo",
    label: "Testimonio del equipo",
    kind: "textarea",
    rows: 6,
    gridSpan: 2,
  },
]

export function HistoriaDetailEditor({ historia, proyecto }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<Record<string, unknown>>({ ...(historia as any) })
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
      const { id, fechaCreacion, fechaActualizacion, creadoPor, proyectoId, ...body } =
        form as any
      const res = await fetch(`/api/admin/historias-v2/${historia.id}`, {
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
    if (!confirm(`¿Eliminar esta historia? Esta acción no se puede deshacer.`)) return
    const res = await fetch(`/api/admin/historias-v2/${historia.id}`, { method: "DELETE" })
    if (res.ok) {
      router.push("/admin/historias")
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

  const title = (form.tituloAlternativo as string) || proyecto?.titulo || "Historia"

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/historias"
          className="inline-flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-red-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a historias
        </Link>
        <div className="flex items-center gap-2">
          {proyecto && (
            <Link
              href={`/proyectos/detalle/${proyecto.slug}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-3 py-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600"
            >
              Ver proyecto público
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
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
        eyebrow={proyecto ? `Historia · ${proyecto.cliente}` : "Historia"}
        title={title}
        description={(form.resumenCorto as string) ?? undefined}
        tabs={[
          { id: "basica", label: "Básica", content: renderFields(basicaFields) },
          { id: "contexto", label: "Contexto & Desafío", content: renderFields(contextoFields) },
          { id: "solucion", label: "Solución", content: renderFields(solucionFields) },
          { id: "proceso", label: "Proceso", content: renderFields(procesoFields) },
          { id: "resultados", label: "Resultados", content: renderFields(resultadosFields) },
          { id: "multimedia", label: "Multimedia", content: renderFields(multimediaFields) },
          { id: "metricas", label: "Métricas & Datos", content: renderFields(metricasFields) },
          { id: "testimonios", label: "Testimonios", content: renderFields(testimoniosFields) },
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

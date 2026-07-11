"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ExternalLink,
  Loader2,
  Save,
  X,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"
import {
  buildLandingSections,
  type LandingFieldDef,
} from "./landing-fields"
import { landingPublicPath, type LandingTipoStr } from "@/lib/landings-schema"
import { cn } from "@/lib/utils"

const INPUT_CLS =
  "w-full rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-950 shadow-none transition-colors placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:cursor-not-allowed disabled:opacity-60"

const LABEL_CLS =
  "mb-1.5 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600"

export const TIPO_BADGE: Record<LandingTipoStr, { label: string; cls: string }> = {
  SOLUCION: { label: "Solución", cls: "bg-red-600 text-white" },
  GUIA: { label: "Guía", cls: "bg-blue-700 text-white" },
  CIUDAD: { label: "Ciudad", cls: "bg-slate-700 text-white" },
  PILAR: { label: "Pilar", cls: "bg-slate-950 text-white" },
}

interface LandingData {
  id: string
  slug: string
  tipo: LandingTipoStr
  titulo: string
  metaTitle: string
  metaDescription: string
  contenido: Record<string, unknown>
  activa: boolean
  orden: number
}

/* ─── Campo de texto con contador de caracteres ───────────────────────── */

function CharCountField({
  label,
  value,
  onChange,
  max,
  rows,
  hint,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  max: number
  rows?: number
  hint?: string
  disabled?: boolean
}) {
  const len = value.length
  const over = len > max
  return (
    <div className="md:col-span-2">
      <div className="flex items-baseline justify-between">
        <label className={LABEL_CLS}>{label}</label>
        <span
          className={cn(
            "font-mono text-[11px]",
            over ? "font-bold text-red-600" : "text-slate-400",
          )}
        >
          {len}/{max}
        </span>
      </div>
      {rows && rows > 1 ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          disabled={disabled}
          className={cn(INPUT_CLS, "resize-y leading-relaxed")}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={INPUT_CLS}
        />
      )}
      {hint && (
        <p className="mt-1.5 font-lato text-xs italic text-slate-500">{hint}</p>
      )}
    </div>
  )
}

/* ─── Tags editables (terminosUbicacion, proyectosSlugs) ──────────────── */

function TagsField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  disabled,
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
  hint?: string
  placeholder?: string
  disabled?: boolean
}) {
  const [draft, setDraft] = useState("")

  const addDraft = () => {
    const tag = draft.trim()
    if (!tag) return
    if (!value.includes(tag)) onChange([...value, tag])
    setDraft("")
  }

  return (
    <div className="md:col-span-2">
      <label className={LABEL_CLS}>{label}</label>
      <div className="flex flex-wrap items-center gap-2 rounded-none border border-slate-300 bg-white px-2.5 py-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-none bg-slate-950 px-2 py-1 font-mono text-xs text-white"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              disabled={disabled}
              className="text-slate-400 transition-colors hover:text-red-400"
              aria-label={`Quitar ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault()
              addDraft()
            }
            if (e.key === "Backspace" && draft === "" && value.length > 0) {
              onChange(value.slice(0, -1))
            }
          }}
          onBlur={addDraft}
          placeholder={placeholder ?? "Agregar y Enter…"}
          disabled={disabled}
          className="min-w-[160px] flex-1 border-0 bg-transparent px-1 py-0.5 font-lato text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      {hint && (
        <p className="mt-1.5 font-lato text-xs italic text-slate-500">{hint}</p>
      )}
    </div>
  )
}

/* ─── Editor principal ────────────────────────────────────────────────── */

export function LandingEditor({ landing }: { landing: LandingData }) {
  const [meta, setMeta] = useState({
    titulo: landing.titulo,
    metaTitle: landing.metaTitle,
    metaDescription: landing.metaDescription,
    activa: landing.activa,
    orden: landing.orden,
  })
  const [contenido, setContenido] = useState<Record<string, unknown>>(
    landing.contenido ?? {},
  )
  const [openSections, setOpenSections] = useState<string[]>(["seo"])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const variante =
    typeof contenido.variante === "string" ? contenido.variante : undefined
  const sections = useMemo(
    () => buildLandingSections(landing.tipo, variante),
    [landing.tipo, variante],
  )

  const publicPath = landingPublicPath(landing.tipo, landing.slug)
  const badge = TIPO_BADGE[landing.tipo]

  const toggleSection = (id: string) => {
    setOpenSections((cur) =>
      cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id],
    )
  }

  const setContenidoField = (name: string, value: unknown) => {
    setContenido((cur) => ({ ...cur, [name]: value }))
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/landings/${landing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...meta, contenido }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const issues = Array.isArray(data.issues)
          ? data.issues
              .slice(0, 3)
              .map((i: any) => `${(i.path ?? []).join(".")}: ${i.message}`)
              .join(" · ")
          : null
        throw new Error(issues ?? data.error ?? `HTTP ${res.status}`)
      }
      const saved = await res.json()
      setMeta({
        titulo: saved.titulo,
        metaTitle: saved.metaTitle,
        metaDescription: saved.metaDescription,
        activa: saved.activa,
        orden: saved.orden,
      })
      setContenido(saved.contenido ?? {})
      setSavedAt(Date.now())
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  const justSaved = savedAt !== null && Date.now() - savedAt < 4000

  const renderField = (field: LandingFieldDef) => {
    if (field.widget === "tags") {
      return (
        <TagsField
          key={field.name}
          label={field.label}
          value={(contenido[field.name] as string[]) ?? []}
          onChange={(v) => setContenidoField(field.name, v)}
          hint={field.hint}
          placeholder={field.placeholder}
          disabled={saving}
        />
      )
    }
    const def = field as FieldDef
    return (
      <FormField
        key={def.name}
        field={def}
        value={contenido[def.name]}
        onChange={(v) => setContenidoField(def.name, v)}
        disabled={saving}
      />
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/landings"
          className="inline-flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Landings SEO
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-none px-2 py-0.5 font-lato text-[10px] font-bold uppercase tracking-[0.15em]",
                  badge.cls,
                )}
              >
                {badge.label}
              </span>
              <span
                className={cn(
                  "rounded-none px-2 py-0.5 font-lato text-[10px] font-bold uppercase tracking-[0.15em]",
                  meta.activa
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-200 text-slate-600",
                )}
              >
                {meta.activa ? "Activa" : "Inactiva"}
              </span>
            </div>
            <h1 className="mt-2 font-bebas text-3xl uppercase leading-[0.95] text-slate-950 md:text-4xl">
              {meta.titulo}
            </h1>
            <p className="mt-1 font-mono text-xs text-slate-500">{publicPath}</p>
          </div>
          <a
            href={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-none border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900"
          >
            Ver página
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* SEO + estado (siempre visible primero) */}
      <SectionShell
        idx={0}
        title="SEO y estado"
        description="Meta tags del <head> y visibilidad de la landing."
        open={openSections.includes("seo")}
        onToggle={() => toggleSection("seo")}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={LABEL_CLS}>Nombre en el admin</label>
            <input
              value={meta.titulo}
              onChange={(e) => setMeta((m) => ({ ...m, titulo: e.target.value }))}
              disabled={saving}
              className={INPUT_CLS}
            />
          </div>
          <CharCountField
            label="Meta title"
            value={meta.metaTitle}
            onChange={(v) => setMeta((m) => ({ ...m, metaTitle: v }))}
            max={70}
            hint="Recomendado ≤ 60–70 caracteres. Se usa como <title> absoluto."
            disabled={saving}
          />
          <CharCountField
            label="Meta description"
            value={meta.metaDescription}
            onChange={(v) => setMeta((m) => ({ ...m, metaDescription: v }))}
            max={160}
            rows={3}
            hint="Máximo 160 caracteres recomendado para no truncarse en Google."
            disabled={saving}
          />
          <div className="flex items-center gap-3 py-1">
            <Switch
              checked={meta.activa}
              onCheckedChange={(checked) =>
                setMeta((m) => ({ ...m, activa: checked }))
              }
              disabled={saving}
              className="data-[state=checked]:bg-red-600"
            />
            <div>
              <span className="font-lato text-sm font-medium text-slate-900">
                Landing activa
              </span>
              <p className="font-lato text-xs text-slate-500">
                Si se desactiva, la página pública vuelve al contenido de
                respaldo en código.
              </p>
            </div>
          </div>
          <div>
            <label className={LABEL_CLS}>Orden</label>
            <input
              type="number"
              min={0}
              value={meta.orden}
              onChange={(e) =>
                setMeta((m) => ({ ...m, orden: Number(e.target.value) || 0 }))
              }
              disabled={saving}
              className={INPUT_CLS}
            />
          </div>
        </div>
      </SectionShell>

      {/* Secciones de contenido */}
      {sections.map((section, idx) => (
        <SectionShell
          key={section.id}
          idx={idx + 1}
          title={section.title}
          description={section.description}
          open={openSections.includes(section.id)}
          onToggle={() => toggleSection(section.id)}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {section.fields.map(renderField)}
          </div>
        </SectionShell>
      ))}

      {error && (
        <div className="mt-5 rounded-none border border-red-200 bg-red-50 px-4 py-3 font-lato text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Barra de guardado sticky */}
      <div className="sticky bottom-0 z-10 mt-6 flex items-center justify-between gap-3 border-t border-slate-200 bg-stone-50/95 px-1 py-3 backdrop-blur">
        <p className="font-lato text-xs text-slate-500">
          Los cambios publicados quedan en vivo en ~1 minuto (ISR).
        </p>
        <div className="flex items-center gap-3">
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
    </div>
  )
}

/* ─── Shell de sección colapsable ─────────────────────────────────────── */

function SectionShell({
  idx,
  title,
  description,
  open,
  onToggle,
  children,
}: {
  idx: number
  title: string
  description?: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="mb-4 rounded-md border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Sección {String(idx + 1).padStart(2, "0")}
          </p>
          <h3 className="font-bebas text-xl uppercase leading-tight text-slate-950">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 max-w-2xl font-lato text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200",
            open ? "" : "-rotate-90",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-6 py-6">{children}</div>
      )}
    </div>
  )
}

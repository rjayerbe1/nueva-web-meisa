"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X, Plus, ChevronDown } from "lucide-react"
import { MediaPicker, MediaPickerModal } from "@/components/admin/media/MediaPicker"
import { useState } from "react"
import { ImagePlus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "stringArray"
  | "select"
  | "url"
  | "color"
  | "image"
  | "video"
  | "document"
  | "imageArray"
  | "date"
  | "objectArray"
  | "json"

export interface FieldDef {
  name: string
  label: string
  kind: FieldKind
  placeholder?: string
  hint?: string
  required?: boolean
  options?: { value: string; label: string }[]
  rows?: number
  min?: number
  max?: number
  step?: number
  gridSpan?: 1 | 2
  /** Para stringArray: renderiza cada item como <textarea> en vez de <input>. */
  multiline?: boolean
  /** Para objectArray: schema de los campos de cada item. */
  itemFields?: FieldDef[]
  /** Para objectArray: template del objeto vacío al agregar un ítem. */
  itemTemplate?: Record<string, unknown>
  /** Para objectArray: label corto del ítem en el header colapsable. */
  itemLabel?: (item: Record<string, unknown>, index: number) => string
  /** Para objectArray: si true, cada ítem arranca colapsado y click en el header expande. */
  collapsible?: boolean
}

interface FormFieldProps {
  field: FieldDef
  value: unknown
  onChange: (value: unknown) => void
  disabled?: boolean
}

/* ─── Shared primitives ───────────────────────────────────────────────── */

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="mb-1.5 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
      {children}
      {required && <span className="ml-1 text-red-600">*</span>}
    </label>
  )
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 font-lato text-xs italic text-slate-500">{children}</p>
}

const INPUT_CLS =
  "w-full rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-950 shadow-none transition-colors placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:cursor-not-allowed disabled:opacity-60"

/* ─── Main component ──────────────────────────────────────────────────── */

export function FormField({ field, value, onChange, disabled }: FormFieldProps) {
  const spanClass = field.gridSpan === 2 ? "md:col-span-2" : ""

  switch (field.kind) {
    case "text":
    case "url":
      return (
        <div className={spanClass}>
          <FieldLabel required={field.required}>{field.label}</FieldLabel>
          <input
            type={field.kind === "url" ? "url" : "text"}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className={INPUT_CLS}
          />
          {field.hint && <FieldHint>{field.hint}</FieldHint>}
        </div>
      )

    case "textarea":
      return (
        <div className={spanClass}>
          <FieldLabel required={field.required}>{field.label}</FieldLabel>
          <textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            rows={field.rows ?? 3}
            className={cn(INPUT_CLS, "resize-y leading-relaxed")}
          />
          {field.hint && <FieldHint>{field.hint}</FieldHint>}
        </div>
      )

    case "number":
      return (
        <div className={spanClass}>
          <FieldLabel required={field.required}>{field.label}</FieldLabel>
          <input
            type="number"
            value={value === null || value === undefined ? "" : String(value)}
            onChange={(e) => {
              const v = e.target.value
              onChange(v === "" ? null : Number(v))
            }}
            min={field.min}
            max={field.max}
            step={field.step}
            placeholder={field.placeholder}
            disabled={disabled}
            className={INPUT_CLS}
          />
          {field.hint && <FieldHint>{field.hint}</FieldHint>}
        </div>
      )

    case "boolean":
      return (
        <div className={cn("flex items-center gap-3 py-1", spanClass)}>
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(checked)}
            disabled={disabled}
            className="data-[state=checked]:bg-red-600"
          />
          <div>
            <span className="font-lato text-sm font-medium text-slate-900">
              {field.label}
            </span>
            {field.hint && (
              <p className="font-lato text-xs text-slate-500">{field.hint}</p>
            )}
          </div>
        </div>
      )

    case "select":
      return (
        <div className={spanClass}>
          <FieldLabel required={field.required}>{field.label}</FieldLabel>
          <Select
            value={(value as string) ?? ""}
            onValueChange={(v) => onChange(v)}
            disabled={disabled}
          >
            <SelectTrigger className="h-auto rounded-none border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-950 shadow-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20">
              <SelectValue placeholder={field.placeholder ?? "Seleccionar…"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.hint && <FieldHint>{field.hint}</FieldHint>}
        </div>
      )

    case "stringArray":
      return (
        <StringArrayField
          field={field}
          value={(value as string[]) ?? []}
          onChange={onChange}
          disabled={disabled}
        />
      )

    case "color":
      return (
        <div className={spanClass}>
          <FieldLabel required={field.required}>{field.label}</FieldLabel>
          <input
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "from-blue-600 to-blue-700"}
            disabled={disabled}
            className={cn(INPUT_CLS, "font-mono")}
          />
          {field.hint && <FieldHint>{field.hint}</FieldHint>}
        </div>
      )

    case "image":
    case "video":
    case "document":
      return (
        <div className={spanClass}>
          <MediaPicker
            value={(value as string) ?? null}
            onChange={(v) => onChange(v)}
            kind={
              field.kind === "video" ? "video" : field.kind === "document" ? "doc" : "image"
            }
            folder={field.kind === "document" ? "brochures" : "general"}
            label={field.label}
            hint={field.hint}
          />
        </div>
      )

    case "date":
      return (
        <div className={spanClass}>
          <FieldLabel required={field.required}>{field.label}</FieldLabel>
          <input
            type="date"
            value={normalizeDateInputValue(value)}
            onChange={(e) => onChange(e.target.value || null)}
            disabled={disabled}
            className={INPUT_CLS}
          />
          {field.hint && <FieldHint>{field.hint}</FieldHint>}
        </div>
      )

    case "imageArray":
      return (
        <ImageArrayField
          field={field}
          value={(value as string[]) ?? []}
          onChange={onChange}
          disabled={disabled}
        />
      )

    case "objectArray":
      return (
        <ObjectArrayField
          field={field}
          value={(value as Record<string, unknown>[]) ?? []}
          onChange={onChange}
          disabled={disabled}
        />
      )

    case "json":
      return (
        <JsonField
          field={field}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )

    default:
      return null
  }
}

/* ─── Object array (lista de sub-formularios con fields) ──────────────── */

function ObjectArrayField({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldDef
  value: Record<string, unknown>[]
  onChange: (v: unknown) => void
  disabled?: boolean
}) {
  const spanClass = field.gridSpan === 2 ? "md:col-span-2" : ""
  const itemFields = field.itemFields ?? []
  const itemTemplate = field.itemTemplate ?? {}
  const collapsible = field.collapsible === true

  // Índice del ítem expandido. null = todos colapsados (solo si collapsible).
  // Con collapsible=true, por defecto TODOS colapsados.
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  const isExpanded = (idx: number) => !collapsible || expandedIdx === idx

  const updateItem = (idx: number, next: Record<string, unknown>) => {
    const copy = [...value]
    copy[idx] = next
    onChange(copy)
  }

  const removeItem = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
    if (collapsible && expandedIdx === idx) setExpandedIdx(null)
    else if (collapsible && expandedIdx !== null && expandedIdx > idx) {
      setExpandedIdx(expandedIdx - 1)
    }
  }

  const addItem = () => {
    const nextIdx = value.length
    onChange([...value, { ...itemTemplate }])
    if (collapsible) setExpandedIdx(nextIdx) // auto-expand nuevo ítem
  }

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= value.length) return
    const copy = [...value]
    ;[copy[idx], copy[target]] = [copy[target], copy[idx]]
    onChange(copy)
    if (collapsible && expandedIdx === idx) setExpandedIdx(target)
    else if (collapsible && expandedIdx === target) setExpandedIdx(idx)
  }

  const toggleExpand = (idx: number) => {
    setExpandedIdx((cur) => (cur === idx ? null : idx))
  }

  return (
    <div className={spanClass}>
      <FieldLabel required={field.required}>{field.label}</FieldLabel>
      {field.hint && <FieldHint>{field.hint}</FieldHint>}

      <div className="mt-2 space-y-3">
        {value.length === 0 && (
          <p className="rounded-none border border-dashed border-slate-300 bg-white px-4 py-6 text-center font-lato text-xs text-slate-500">
            Aún no hay ítems. Usa el botón para agregar el primero.
          </p>
        )}

        {value.map((item, idx) => {
          const label = field.itemLabel
            ? field.itemLabel(item, idx)
            : `Ítem ${String(idx + 1).padStart(2, "0")}`
          const expanded = isExpanded(idx)
          return (
            <div
              key={idx}
              className="rounded-none border border-slate-200 bg-white"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-stone-50 px-3 py-2">
                {collapsible ? (
                  <button
                    type="button"
                    onClick={() => toggleExpand(idx)}
                    disabled={disabled}
                    className="group flex min-w-0 flex-1 items-center gap-2 text-left transition-colors hover:text-slate-900"
                    aria-expanded={expanded}
                  >
                    <ChevronDown
                      className={`h-3.5 w-3.5 flex-shrink-0 text-slate-400 transition-transform duration-200 group-hover:text-slate-700 ${
                        expanded ? "" : "-rotate-90"
                      }`}
                    />
                    <span className="truncate font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 group-hover:text-slate-900">
                      {label}
                    </span>
                  </button>
                ) : (
                  <span className="font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
                    {label}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, -1)}
                    disabled={disabled || idx === 0}
                    className="flex h-6 w-6 items-center justify-center text-[10px] text-slate-400 transition-colors hover:text-slate-900 disabled:opacity-30"
                    aria-label="Subir"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 1)}
                    disabled={disabled || idx === value.length - 1}
                    className="flex h-6 w-6 items-center justify-center text-[10px] text-slate-400 transition-colors hover:text-slate-900 disabled:opacity-30"
                    aria-label="Bajar"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={disabled}
                    className="flex h-6 w-6 items-center justify-center text-slate-400 transition-colors hover:text-red-600 disabled:opacity-30"
                    aria-label="Eliminar"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {expanded && (
                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                  {itemFields.map((f) => (
                    <FormField
                      key={f.name}
                      field={f}
                      value={item[f.name]}
                      onChange={(v) =>
                        updateItem(idx, { ...item, [f.name]: v })
                      }
                      disabled={disabled}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={disabled}
          className="rounded-none border-slate-300 font-lato text-xs font-semibold uppercase tracking-wide hover:border-red-600 hover:bg-red-50 hover:text-red-600"
        >
          <Plus className="mr-1 h-3 w-3" /> Agregar ítem
        </Button>
      </div>
    </div>
  )
}

/* ─── JSON textarea con validación ────────────────────────────────────── */

function JsonField({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldDef
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
}) {
  const spanClass = field.gridSpan === 2 ? "md:col-span-2" : ""
  const initialText =
    value === null || value === undefined ? "" : JSON.stringify(value, null, 2)
  const [text, setText] = useState(initialText)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (next: string) => {
    setText(next)
    if (!next.trim()) {
      setError(null)
      onChange(null)
      return
    }
    try {
      const parsed = JSON.parse(next)
      setError(null)
      onChange(parsed)
    } catch (e: any) {
      setError(e?.message ?? "JSON inválido")
    }
  }

  return (
    <div className={spanClass}>
      <FieldLabel required={field.required}>{field.label}</FieldLabel>
      {field.hint && <FieldHint>{field.hint}</FieldHint>}
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        rows={field.rows ?? 10}
        placeholder='{ "ejemplo": "JSON válido" }'
        className={cn(INPUT_CLS, "resize-y font-mono text-xs leading-relaxed")}
      />
      {error && (
        <p className="mt-1.5 rounded-none border border-red-200 bg-red-50 px-2 py-1 font-lato text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

/* ─── Image array (multi-imagen con MediaPicker por item) ─────────────── */

function ImageArrayField({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldDef
  value: string[]
  onChange: (v: unknown) => void
  disabled?: boolean
}) {
  const spanClass = field.gridSpan === 2 ? "md:col-span-2" : ""
  const [editingIdx, setEditingIdx] = useState<number | null>(null)

  // Solo renderizamos posiciones con valor real. El botón "+" abre el picker
  // y al elegir una URL la añade al final (setAt(value.length, url)).
  const filled = value.filter((u) => typeof u === "string" && u.length > 0)

  const setAt = (idx: number, url: string | null) => {
    if (!url) {
      onChange(filled.filter((_, i) => i !== idx))
      return
    }
    const next = [...filled]
    if (idx >= next.length) next.push(url)
    else next[idx] = url
    onChange(next)
  }

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= filled.length) return
    const next = [...filled]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange(next)
  }

  const handlePick = (url: string) => {
    if (editingIdx === null) return
    setAt(editingIdx, url)
    setEditingIdx(null)
  }

  return (
    <div className={spanClass}>
      <FieldLabel required={field.required}>{field.label}</FieldLabel>
      {field.hint && <FieldHint>{field.hint}</FieldHint>}

      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filled.map((url, idx) => (
          <ImageArrayTile
            key={`${url}-${idx}`}
            url={url}
            index={idx}
            total={filled.length}
            disabled={disabled}
            onChange={() => setEditingIdx(idx)}
            onRemove={() => setAt(idx, null)}
            onMove={(dir) => move(idx, dir)}
          />
        ))}

        {/* Add tile */}
        <button
          type="button"
          onClick={() => setEditingIdx(filled.length)}
          disabled={disabled}
          className="group flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-none border-2 border-dashed border-slate-300 bg-white font-lato text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <ImagePlus className="h-6 w-6" />
          Agregar
        </button>
      </div>

      {filled.length === 0 && (
        <p className="mt-2 font-lato text-xs italic text-slate-500">
          Aún no hay imágenes — usa el botón &quot;Agregar&quot; para seleccionar la primera.
        </p>
      )}

      <MediaPickerModal
        open={editingIdx !== null}
        onOpenChange={(v) => !v && setEditingIdx(null)}
        kind="image"
        folder="general"
        allowUrl={true}
        onPick={handlePick}
      />
    </div>
  )
}

function ImageArrayTile({
  url,
  index,
  total,
  disabled,
  onChange,
  onRemove,
  onMove,
}: {
  url: string
  index: number
  total: number
  disabled?: boolean
  onChange: () => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
}) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-none border border-slate-200 bg-slate-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />

      {/* Index badge */}
      <span className="absolute left-2 top-2 rounded-none bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onChange()
          }}
          disabled={disabled}
          className="inline-flex items-center gap-1 rounded-none bg-white px-2 py-1 font-lato text-[10px] font-bold uppercase tracking-wider text-slate-900 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
        >
          Cambiar
        </button>
        <div className="mt-1 flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onMove(-1)
            }}
            disabled={disabled || index === 0}
            className="flex h-7 w-7 items-center justify-center rounded-none bg-white/95 text-slate-700 transition-colors hover:bg-slate-950 hover:text-white disabled:opacity-30"
            aria-label="Mover izquierda"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onMove(1)
            }}
            disabled={disabled || index === total - 1}
            className="flex h-7 w-7 items-center justify-center rounded-none bg-white/95 text-slate-700 transition-colors hover:bg-slate-950 hover:text-white disabled:opacity-30"
            aria-label="Mover derecha"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            disabled={disabled}
            className="flex h-7 w-7 items-center justify-center rounded-none bg-white/95 text-slate-700 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
            aria-label="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function normalizeDateInputValue(value: unknown): string {
  if (!value) return ""
  if (typeof value === "string") {
    // Si ya es YYYY-MM-DD, devolver tal cual. Si es ISO, recortar al prefix.
    const match = value.match(/^\d{4}-\d{2}-\d{2}/)
    return match ? match[0] : ""
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }
  return ""
}

/* ─── String array (list of text inputs) ──────────────────────────────── */

function StringArrayField({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldDef
  value: string[]
  onChange: (v: string[]) => void
  disabled?: boolean
}) {
  const spanClass = field.gridSpan === 2 ? "md:col-span-2" : ""
  return (
    <div className={spanClass}>
      <FieldLabel required={field.required}>{field.label}</FieldLabel>
      {field.hint && <FieldHint>{field.hint}</FieldHint>}
      <div className="mt-2 space-y-2">
        {value.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {field.multiline ? (
              <textarea
                value={item}
                onChange={(e) => {
                  const next = [...value]
                  next[idx] = e.target.value
                  onChange(next)
                }}
                disabled={disabled}
                placeholder={field.placeholder}
                rows={field.rows ?? 3}
                className={cn(INPUT_CLS, "resize-y leading-relaxed")}
              />
            ) : (
              <input
                value={item}
                onChange={(e) => {
                  const next = [...value]
                  next[idx] = e.target.value
                  onChange(next)
                }}
                disabled={disabled}
                placeholder={field.placeholder}
                className={INPUT_CLS}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              disabled={disabled}
              className={cn(
                "flex w-10 flex-shrink-0 items-center justify-center rounded-none border border-slate-200 text-slate-400 transition-colors hover:border-red-600 hover:text-red-600 disabled:opacity-50",
                field.multiline ? "h-10 self-start" : "h-10",
              )}
              aria-label="Eliminar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, ""])}
          disabled={disabled}
          className="rounded-none border-slate-300 font-lato text-xs font-semibold uppercase tracking-wide hover:border-red-600 hover:bg-red-50 hover:text-red-600"
        >
          <Plus className="mr-1 h-3 w-3" /> Agregar
        </Button>
      </div>
    </div>
  )
}

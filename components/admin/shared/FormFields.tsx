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
import { X, Plus } from "lucide-react"
import { MediaPicker } from "@/components/admin/media/MediaPicker"
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
      return (
        <div className={spanClass}>
          <MediaPicker
            value={(value as string) ?? null}
            onChange={(v) => onChange(v)}
            kind={field.kind === "video" ? "video" : "image"}
            label={field.label}
            hint={field.hint}
          />
        </div>
      )

    default:
      return null
  }
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
          <div key={idx} className="flex gap-2">
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
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              disabled={disabled}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-none border border-slate-200 text-slate-400 transition-colors hover:border-red-600 hover:text-red-600 disabled:opacity-50"
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

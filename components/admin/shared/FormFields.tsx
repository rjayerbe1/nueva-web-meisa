"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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

export function FormField({ field, value, onChange, disabled }: FormFieldProps) {
  switch (field.kind) {
    case "text":
    case "url":
      return (
        <div className={field.gridSpan === 2 ? "col-span-2" : ""}>
          <Label className="text-sm">
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </Label>
          <Input
            type={field.kind === "url" ? "url" : "text"}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className="mt-1"
          />
          {field.hint && <p className="mt-1 text-xs text-gray-500">{field.hint}</p>}
        </div>
      )

    case "textarea":
      return (
        <div className={field.gridSpan === 2 ? "col-span-2" : ""}>
          <Label className="text-sm">
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </Label>
          <Textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            rows={field.rows ?? 3}
            className="mt-1"
          />
          {field.hint && <p className="mt-1 text-xs text-gray-500">{field.hint}</p>}
        </div>
      )

    case "number":
      return (
        <div className={field.gridSpan === 2 ? "col-span-2" : ""}>
          <Label className="text-sm">
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </Label>
          <Input
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
            className="mt-1"
          />
          {field.hint && <p className="mt-1 text-xs text-gray-500">{field.hint}</p>}
        </div>
      )

    case "boolean":
      return (
        <div className={`flex items-center gap-3 ${field.gridSpan === 2 ? "col-span-2" : ""}`}>
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(checked)}
            disabled={disabled}
          />
          <div>
            <Label className="text-sm">{field.label}</Label>
            {field.hint && <p className="text-xs text-gray-500">{field.hint}</p>}
          </div>
        </div>
      )

    case "select":
      return (
        <div className={field.gridSpan === 2 ? "col-span-2" : ""}>
          <Label className="text-sm">
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </Label>
          <Select
            value={(value as string) ?? ""}
            onValueChange={(v) => onChange(v)}
            disabled={disabled}
          >
            <SelectTrigger className="mt-1">
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
          {field.hint && <p className="mt-1 text-xs text-gray-500">{field.hint}</p>}
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
        <div className={field.gridSpan === 2 ? "col-span-2" : ""}>
          <Label className="text-sm">
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </Label>
          <Input
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "from-blue-600 to-blue-700"}
            disabled={disabled}
            className="mt-1 font-mono text-sm"
          />
          {field.hint && <p className="mt-1 text-xs text-gray-500">{field.hint}</p>}
        </div>
      )

    case "image":
    case "video":
      return (
        <div className={field.gridSpan === 2 ? "col-span-2" : ""}>
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
  return (
    <div className={field.gridSpan === 2 ? "col-span-2" : ""}>
      <Label className="text-sm">{field.label}</Label>
      {field.hint && <p className="mb-2 mt-1 text-xs text-gray-500">{field.hint}</p>}
      <div className="space-y-2">
        {value.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const next = [...value]
                next[idx] = e.target.value
                onChange(next)
              }}
              disabled={disabled}
              placeholder={field.placeholder}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, ""])}
          disabled={disabled}
        >
          <Plus className="mr-1 h-3 w-3" /> Agregar
        </Button>
      </div>
    </div>
  )
}

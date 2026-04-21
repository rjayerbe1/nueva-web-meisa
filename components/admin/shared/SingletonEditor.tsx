"use client"

import { useState } from "react"
import { Save, Loader2, Check } from "lucide-react"
import { FormField, type FieldDef } from "./FormFields"
import { cn } from "@/lib/utils"

export interface SingletonSection {
  id: string
  title: string
  description?: string
  fields: FieldDef[]
}

interface SingletonEditorProps<T extends object> {
  data: T | null
  /** Single flat list of fields (back-compat). */
  fields?: FieldDef[]
  /** Grouped sections — preferred for modelos con muchos campos. */
  sections?: SingletonSection[]
  endpoint: string
  emptyDefaults?: Partial<T>
  onSaved?: (data: T) => void
  sectionTitle?: string
  description?: string
}

export function SingletonEditor<T extends object>({
  data,
  fields,
  sections,
  endpoint,
  emptyDefaults,
  onSaved,
  sectionTitle,
  description,
}: SingletonEditorProps<T>) {
  const [form, setForm] = useState<Record<string, unknown>>(
    (data as Record<string, unknown>) ?? (emptyDefaults as Record<string, unknown>) ?? {},
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const { id, createdAt, updatedAt, ...body } = form as any
      const res = await fetch(endpoint, {
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
      onSaved?.(saved)
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  const hasSections = Array.isArray(sections) && sections.length > 0
  const justSaved = savedAt !== null && Date.now() - savedAt < 3000

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      {/* Optional top header */}
      {(sectionTitle || description) && (
        <div className="border-b border-slate-200 px-6 py-5">
          {sectionTitle && (
            <h2 className="font-bebas text-2xl uppercase leading-tight text-slate-950">
              {sectionTitle}
            </h2>
          )}
          {description && (
            <p className="mt-1.5 max-w-2xl font-lato text-sm text-slate-600">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Body */}
      <div className="px-6 py-6">
        {hasSections ? (
          <div className="space-y-10">
            {sections!.map((sec, idx) => (
              <section
                key={sec.id}
                className={cn(idx > 0 && "border-t border-slate-200 pt-10")}
              >
                <div className="mb-5">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Sección {String(idx + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-bebas text-xl uppercase leading-tight text-slate-950">
                    {sec.title}
                  </h3>
                  {sec.description && (
                    <p className="mt-1 max-w-2xl font-lato text-sm text-slate-600">
                      {sec.description}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {sec.fields.map((f) => (
                    <FormField
                      key={f.name}
                      field={f}
                      value={(form as any)[f.name]}
                      onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}
                      disabled={saving}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {(fields ?? []).map((f) => (
              <FormField
                key={f.name}
                field={f}
                value={(form as any)[f.name]}
                onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}
                disabled={saving}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-none border border-red-200 bg-red-50 px-4 py-3 font-lato text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
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

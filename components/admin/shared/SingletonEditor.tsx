"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Save, Loader2, Check } from "lucide-react"
import { FormField, type FieldDef } from "./FormFields"

interface SingletonEditorProps<T extends object> {
  data: T | null
  fields: FieldDef[]
  endpoint: string
  emptyDefaults?: Partial<T>
  onSaved?: (data: T) => void
  sectionTitle?: string
  description?: string
}

export function SingletonEditor<T extends object>({
  data,
  fields,
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
      // Strip system fields before sending
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

  return (
    <Card className="p-6">
      {(sectionTitle || description) && (
        <div className="mb-5">
          {sectionTitle && <h3 className="text-base font-semibold text-gray-900">{sectionTitle}</h3>}
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <FormField
            key={f.name}
            field={f}
            value={(form as any)[f.name]}
            onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}
            disabled={saving}
          />
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-3">
        {savedAt && Date.now() - savedAt < 3000 && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <Check className="h-4 w-4" /> Guardado
          </span>
        )}
        <Button onClick={save} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Guardar cambios
        </Button>
      </div>
    </Card>
  )
}

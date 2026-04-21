"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"
import { FormField, type FieldDef } from "./FormFields"
import { cn } from "@/lib/utils"

type BaseItem = {
  id: string
  orden?: number | null
  activo?: boolean | null
}

interface ListCrudEditorProps<T extends BaseItem> {
  items: T[]
  fields: FieldDef[]
  endpoint: string
  emptyTemplate: Omit<Partial<T>, "id">
  renderPreview?: (item: T) => React.ReactNode
  title?: string
  addLabel?: string
  emptyMessage?: string
  canReorder?: boolean
}

export function ListCrudEditor<T extends BaseItem>({
  items: initialItems,
  fields,
  endpoint,
  emptyTemplate,
  renderPreview,
  addLabel = "Agregar",
  emptyMessage = "No hay elementos todavía. Usa el botón para agregar el primero.",
  canReorder = true,
}: ListCrudEditorProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isNew = editingId === "__new__"

  const beginNew = () => {
    setEditingId("__new__")
    setDraft({ ...emptyTemplate })
    setError(null)
  }
  const beginEdit = (item: T) => {
    setEditingId(item.id)
    setDraft({ ...item })
    setError(null)
  }
  const cancel = () => {
    setEditingId(null)
    setDraft({})
    setError(null)
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(isNew ? endpoint : `${endpoint}/${editingId}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error")
      }
      const saved: T = await res.json()
      setItems((prev) =>
        isNew ? [...prev, saved] : prev.map((it) => (it.id === saved.id ? saved : it)),
      )
      cancel()
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  const del = async (id: string) => {
    if (!confirm("¿Eliminar este elemento?")) return
    const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" })
    if (!res.ok) {
      alert("Error eliminando")
      return
    }
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const patch = async (id: string, data: Partial<T>) => {
    const res = await fetch(`${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) return
    const updated: T = await res.json()
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
  }

  const toggleActivo = (item: T) => patch(item.id, { activo: !item.activo } as Partial<T>)

  const move = async (idx: number, dir: -1 | 1) => {
    const other = items[idx + dir]
    if (!other) return
    const cur = items[idx]
    const curOrden = cur.orden ?? idx
    const otherOrden = other.orden ?? idx + dir
    await Promise.all([
      patch(cur.id, { orden: otherOrden } as Partial<T>),
      patch(other.id, { orden: curOrden } as Partial<T>),
    ])
    setItems((prev) => {
      const next = [...prev]
      next[idx] = { ...cur, orden: otherOrden }
      next[idx + dir] = { ...other, orden: curOrden }
      return next.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    })
  }

  const renderForm = () => (
    <Card className="border-blue-200 bg-blue-50/40 p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <FormField
            key={f.name}
            field={f}
            value={draft[f.name]}
            onChange={(v) => setDraft((d) => ({ ...d, [f.name]: v }))}
            disabled={saving}
          />
        ))}
      </div>
      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={cancel} disabled={saving}>
          <X className="mr-1 h-4 w-4" /> Cancelar
        </Button>
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-1 h-4 w-4" />
          )}
          Guardar
        </Button>
      </div>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={beginNew} disabled={editingId !== null}>
          <Plus className="mr-1 h-4 w-4" /> {addLabel}
        </Button>
      </div>

      {isNew && renderForm()}

      {items.length === 0 && !isNew && (
        <Card className="p-8 text-center text-sm text-gray-500">{emptyMessage}</Card>
      )}

      <div className="space-y-3">
        {items.map((item, idx) => {
          const editing = editingId === item.id
          if (editing) return <div key={item.id}>{renderForm()}</div>
          return (
            <Card key={item.id} className={cn("p-4", !item.activo && "opacity-60")}>
              <div className="flex items-start gap-3">
                {canReorder && (
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0 || editingId !== null}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => move(idx, 1)}
                      disabled={idx === items.length - 1 || editingId !== null}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex-1">
                  {renderPreview ? (
                    renderPreview(item)
                  ) : (
                    <DefaultPreview item={item} fields={fields} />
                  )}
                </div>

                <div className="flex flex-shrink-0 items-center gap-1">
                  {"activo" in item && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActivo(item)}
                      title={item.activo ? "Ocultar" : "Mostrar"}
                      disabled={editingId !== null}
                    >
                      {item.activo ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => beginEdit(item)}
                    disabled={editingId !== null}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => del(item.id)}
                    disabled={editingId !== null}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function DefaultPreview<T extends BaseItem>({
  item,
  fields,
}: {
  item: T
  fields: FieldDef[]
}) {
  const primary = fields.find((f) =>
    ["nombre", "titulo", "label", "clave", "codigo", "red", "valor"].includes(f.name),
  )
  const secondary = fields.find((f) => f.name === "descripcion" || f.name === "subtitulo")
  const value = primary ? (item as any)[primary.name] : item.id
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900">{String(value ?? "(sin título)")}</span>
        {"activo" in item && !item.activo && (
          <Badge variant="outline" className="text-xs">
            Inactivo
          </Badge>
        )}
      </div>
      {secondary && (item as any)[secondary.name] && (
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {String((item as any)[secondary.name])}
        </p>
      )}
    </div>
  )
}

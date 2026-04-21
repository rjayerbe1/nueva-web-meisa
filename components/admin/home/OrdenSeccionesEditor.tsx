"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ChevronUp, ChevronDown, Save, Loader2, Check } from "lucide-react"

export type SeccionItem = { clave: string; activo: boolean; label: string }

interface Props {
  initial: SeccionItem[]
  endpoint?: string
}

const FALLBACK: SeccionItem[] = [
  { clave: "hero", activo: true, label: "Hero" },
  { clave: "stats", activo: true, label: "Estadísticas" },
  { clave: "featured-project", activo: true, label: "Proyecto destacado" },
  { clave: "servicios", activo: true, label: "Servicios destacados" },
  { clave: "proyectos", activo: true, label: "Proyectos" },
  { clave: "clientes", activo: true, label: "Clientes" },
  { clave: "contacto", activo: true, label: "Contacto" },
]

export function OrdenSeccionesEditor({
  initial,
  endpoint = "/api/admin/home/orden",
}: Props) {
  const [items, setItems] = useState<SeccionItem[]>(
    initial && initial.length > 0 ? initial : FALLBACK,
  )
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const move = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir >= items.length) return
    const next = [...items]
    ;[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]
    setItems(next)
  }

  const toggle = (idx: number) => {
    const next = [...items]
    next[idx] = { ...next[idx], activo: !next[idx].activo }
    setItems(next)
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orden: items }),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error")
      }
      setSavedAt(Date.now())
    } catch (e: any) {
      setError(e.message ?? "Error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="mb-1 text-base font-semibold text-gray-900">Orden y visibilidad</h3>
      <p className="mb-5 text-sm text-gray-600">
        Arrastra (con las flechas) para cambiar el orden en que aparecen las secciones del home.
        Desactiva el interruptor para ocultar una sección sin borrarla.
      </p>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={item.clave}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
          >
            <div className="flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => move(idx, -1)}
                disabled={idx === 0 || saving}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => move(idx, 1)}
                disabled={idx === items.length - 1 || saving}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <span className="w-8 text-center text-sm font-mono text-gray-500">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{item.label}</div>
              <div className="text-xs font-mono text-gray-500">{item.clave}</div>
            </div>
            <Switch checked={item.activo} onCheckedChange={() => toggle(idx)} disabled={saving} />
          </div>
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
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar orden
        </Button>
      </div>
    </Card>
  )
}

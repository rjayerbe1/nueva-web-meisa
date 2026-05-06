"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, Save, Trash2 } from "lucide-react"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"

interface BrochureData {
  id?: string
  titulo: string
  descripcion: string | null
  urlAmigable: string
  pdfUrl: string | null
  categoriaId: string | null
  publicado: boolean
  activo: boolean
}

interface CategoriaOption {
  id: string
  nombre: string
}

interface BrochureFormProps {
  initial?: BrochureData
  categorias: CategoriaOption[]
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

const emptyDefaults: BrochureData = {
  titulo: "",
  descripcion: null,
  urlAmigable: "",
  pdfUrl: null,
  categoriaId: null,
  publicado: false,
  activo: true,
}

export function BrochureForm({ initial, categorias }: BrochureFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initial?.id)
  const [form, setForm] = useState<BrochureData>(initial ?? emptyDefaults)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fields: FieldDef[] = [
    {
      name: "titulo",
      label: "Título",
      kind: "text",
      required: true,
      placeholder: "Portafolio Puentes 2026",
      gridSpan: 2,
    },
    {
      name: "urlAmigable",
      label: "URL amigable (slug)",
      kind: "text",
      required: true,
      placeholder: "portafolio-puentes-2026",
      hint: "Se genera automáticamente desde el título si lo dejas vacío. Forma parte de la URL pública /brochure/<slug>.",
    },
    {
      name: "categoriaId",
      label: "Categoría",
      kind: "select",
      placeholder: "Sin categoría",
      options: categorias.map((c) => ({ value: c.id, label: c.nombre })),
      hint: "Solo una categoría puede tener un brochure. Si eliges una ya tomada, dará error al guardar.",
    },
    {
      name: "descripcion",
      label: "Descripción",
      kind: "textarea",
      rows: 3,
      gridSpan: 2,
    },
    {
      name: "pdfUrl",
      label: "PDF del brochure",
      kind: "document",
      required: true,
      gridSpan: 2,
      hint: "Sube el PDF a la biblioteca o pega una URL. Se mostrará como flipbook en /brochure/<slug>.",
    },
    {
      name: "publicado",
      label: "Publicado",
      kind: "boolean",
      hint: "Si está apagado, la página pública devuelve 404.",
    },
    {
      name: "activo",
      label: "Activo",
      kind: "boolean",
      hint: "Apaga para esconder sin borrar.",
    },
  ]

  const handleChange = (name: string, value: unknown) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value } as BrochureData
      if (name === "titulo" && !isEdit && !prev.urlAmigable) {
        next.urlAmigable = slugify(String(value ?? ""))
      }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion?.trim() || null,
      urlAmigable: (form.urlAmigable || slugify(form.titulo)).trim(),
      pdfUrl: form.pdfUrl,
      categoriaId: form.categoriaId || null,
      publicado: form.publicado,
      activo: form.activo,
    }

    if (!payload.titulo) {
      setError("El título es obligatorio")
      setSaving(false)
      return
    }
    if (!payload.urlAmigable) {
      setError("La URL amigable es obligatoria")
      setSaving(false)
      return
    }
    if (!payload.pdfUrl) {
      setError("Debes subir o seleccionar un PDF")
      setSaving(false)
      return
    }

    try {
      const endpoint = isEdit ? `/api/admin/brochures/${initial!.id}` : "/api/admin/brochures"
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error guardando")
      }
      const saved = await res.json()
      if (!isEdit) {
        router.push(`/admin/brochures/${saved.id}`)
      } else {
        router.refresh()
      }
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!isEdit || !initial?.id) return
    if (!confirm("¿Eliminar este brochure? Esta acción no se puede deshacer.")) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/brochures/${initial.id}`, { method: "DELETE" })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error eliminando")
      }
      router.push("/admin/brochures")
      router.refresh()
    } catch (e: any) {
      setError(e.message ?? "Error eliminando")
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {fields.map((f) => (
          <FormField
            key={f.name}
            field={f}
            value={(form as unknown as Record<string, unknown>)[f.name]}
            onChange={(v) => handleChange(f.name, v)}
            disabled={saving || deleting}
          />
        ))}
      </div>

      {form.publicado && form.pdfUrl && form.urlAmigable && (
        <div className="border border-slate-200 bg-white px-4 py-3">
          <p className="font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            URL pública
          </p>
          <a
            href={`/brochure/${form.urlAmigable}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-red-600 hover:underline"
          >
            /brochure/{form.urlAmigable}
          </a>
        </div>
      )}

      {error && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 font-lato text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-5">
        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="inline-flex items-center gap-1.5 border border-red-300 bg-white px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Eliminar
          </button>
        ) : (
          <span />
        )}

        <button
          type="submit"
          disabled={saving || deleting}
          className="inline-flex items-center gap-1.5 bg-red-600 px-5 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {isEdit ? "Guardar cambios" : "Crear brochure"}
        </button>
      </div>
    </form>
  )
}

"use client"

import { useMemo, useRef, useState } from "react"
import {
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"
import { cn } from "@/lib/utils"
import { ETAPA_LABEL, ORIGENES_CANDIDATO } from "./constants"
import type { CandidatoSer, VacanteSer } from "./types"

const MAX_CV_MB = 10

export function CandidatosTab({
  candidatos: initial,
  vacantes,
}: {
  candidatos: CandidatoSer[]
  vacantes: VacanteSer[]
}) {
  const [items, setItems] = useState<CandidatoSer[]>(initial)
  const [editingId, setEditingId] = useState<string | null>(null) // "__new__" | id
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const isNew = editingId === "__new__"

  const fields: FieldDef[] = useMemo(
    () => [
      { name: "nombre", label: "Nombre completo", kind: "text", required: true },
      {
        name: "origen",
        label: "Origen del CV",
        kind: "select",
        required: true,
        options: ORIGENES_CANDIDATO,
        hint: "Por dónde llegó la hoja de vida — trazabilidad de habeas data.",
      },
      { name: "email", label: "Email", kind: "text" },
      { name: "telefono", label: "Teléfono", kind: "text" },
      { name: "ciudad", label: "Ciudad", kind: "text" },
      {
        name: "origenDetalle",
        label: "Detalle del origen",
        kind: "text",
        placeholder: "Ej: convocatoria soldadores jul-2026, referido por…",
      },
      ...(isNew
        ? ([
            {
              name: "vacanteId",
              label: "Postular a vacante",
              kind: "select",
              options: [
                { value: "", label: "Espontánea / banco de talento" },
                ...vacantes.map((v) => ({ value: v.id, label: v.titulo })),
              ],
            },
          ] as FieldDef[])
        : []),
      {
        name: "consentimientoBanco",
        label: "Autorizó conservar el CV para vacantes futuras",
        kind: "boolean",
        hint: "Sin esta autorización, el CV se purga al cumplir el plazo de retención.",
      },
      {
        name: "notas",
        label: "Notas",
        kind: "textarea",
        gridSpan: 2,
        rows: 2,
      },
    ],
    [isNew, vacantes],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((c) =>
      [c.nombre, c.email, c.telefono, c.ciudad, c.origen]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [items, query])

  const beginNew = () => {
    setEditingId("__new__")
    setDraft({ consentimientoBanco: false, origen: null, vacanteId: "" })
    setCvFile(null)
    setError(null)
  }

  const beginEdit = (c: CandidatoSer) => {
    setEditingId(c.id)
    setDraft({ ...c })
    setCvFile(null)
    setError(null)
  }

  const cancel = () => {
    setEditingId(null)
    setDraft({})
    setCvFile(null)
    setError(null)
  }

  const onPickFile = (f: File | null) => {
    if (f && f.size > MAX_CV_MB * 1024 * 1024) {
      setError(`El archivo supera ${MAX_CV_MB} MB`)
      return
    }
    setError(null)
    setCvFile(f)
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      let cvData: Record<string, unknown> = {}
      if (cvFile) {
        const fd = new FormData()
        fd.append("file", cvFile)
        const up = await fetch("/api/admin/talento/cv-upload", { method: "POST", body: fd })
        if (!up.ok) {
          const msg = await up.json().catch(() => ({ error: `HTTP ${up.status}` }))
          throw new Error(msg.error ?? "Error subiendo el CV")
        }
        const r = await up.json()
        cvData = {
          cvPathGcs: r.pathGcs,
          cvFileName: r.fileName,
          cvContentType: r.contentType,
          cvSize: r.size,
        }
      }

      const { postulaciones, createdAt, id, cvPathGcs, cvFileName, ...body } = draft as any
      const res = await fetch(
        isNew ? "/api/admin/talento/candidatos" : `/api/admin/talento/candidatos/${editingId}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, ...cvData }),
        },
      )
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error guardando")
      }
      const saved: CandidatoSer = await res.json()
      setItems((prev) =>
        isNew ? [saved, ...prev] : prev.map((c) => (c.id === saved.id ? saved : c)),
      )
      cancel()
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  const del = async (c: CandidatoSer) => {
    if (
      !confirm(
        `¿Eliminar a ${c.nombre}? Se borra el CV del almacenamiento y sus postulaciones. Esta acción no se puede deshacer (supresión habeas data).`,
      )
    )
      return
    const res = await fetch(`/api/admin/talento/candidatos/${c.id}`, { method: "DELETE" })
    if (!res.ok) {
      alert("Error eliminando")
      return
    }
    setItems((prev) => prev.filter((x) => x.id !== c.id))
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-lato text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          {filtered.length} {filtered.length === 1 ? "candidato" : "candidatos"}
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar candidato…"
              className="w-56 rounded-none border border-slate-300 bg-white py-2 pl-9 pr-3 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            />
          </div>
          <button
            onClick={beginNew}
            disabled={editingId !== null}
            className="inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar candidato
          </button>
        </div>
      </div>

      {/* Form */}
      {editingId !== null && (
        <div className="rounded-md border border-red-200 bg-red-50/30 px-5 py-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fields.map((f) => (
              <FormField
                key={f.name}
                field={f}
                value={draft[f.name]}
                onChange={(v) => setDraft((d) => ({ ...d, [f.name]: v }))}
                disabled={saving}
              />
            ))}

            {/* CV file input */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
                Hoja de vida (PDF, Word o imagen — máx. {MAX_CV_MB} MB)
              </label>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900 disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {cvFile ? "Cambiar archivo" : "Seleccionar archivo"}
                </button>
                {cvFile ? (
                  <span className="font-lato text-sm text-slate-700">
                    {cvFile.name}{" "}
                    <span className="text-slate-400">
                      ({(cvFile.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </span>
                ) : !isNew && (draft as any).cvFileName ? (
                  <span className="font-lato text-sm text-slate-500">
                    Actual: {(draft as any).cvFileName} (se conserva si no eliges otro)
                  </span>
                ) : (
                  <span className="font-lato text-sm italic text-slate-400">
                    Sin archivo seleccionado
                  </span>
                )}
              </div>
              <p className="mt-1.5 font-lato text-xs italic text-slate-500">
                El archivo se guarda en un bucket privado; solo es visible desde este admin.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-none border border-red-300 bg-red-100 px-3 py-2 font-lato text-sm text-red-800">
              {error}
            </div>
          )}
          <div className="mt-5 flex justify-end gap-2 border-t border-red-200 pt-4">
            <button
              onClick={cancel}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              Cancelar
            </button>
            <button
              onClick={save}
              disabled={saving || !String(draft.nombre ?? "").trim()}
              className="inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 && editingId === null ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <FileText className="mb-3 h-10 w-10 text-slate-300" />
          <p className="mb-1 font-bebas text-lg uppercase tracking-wide text-slate-700">
            {items.length === 0 ? "Sin candidatos" : "Sin resultados"}
          </p>
          <p className="max-w-sm font-lato text-sm text-slate-500">
            {items.length === 0
              ? "Carga aquí las hojas de vida que lleguen por Computrabajo, correo, WhatsApp o referidos."
              : "Ningún candidato coincide con la búsqueda."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-200 bg-stone-50">
                {["Candidato", "Contacto", "Origen", "CV", "Postulaciones", "Banco", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="px-3 py-2.5 text-left font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="group border-b border-slate-100 transition-colors last:border-0 hover:bg-stone-50"
                >
                  <td className="px-3 py-2.5">
                    <p className="font-lato text-sm font-semibold text-slate-900">{c.nombre}</p>
                    <p className="font-lato text-xs text-slate-500">{c.ciudad ?? "—"}</p>
                  </td>
                  <td className="px-3 py-2.5 font-lato text-xs text-slate-600">
                    <p>{c.email ?? "—"}</p>
                    <p>{c.telefono ?? ""}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="rounded-none border border-slate-200 bg-stone-50 px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      {ORIGENES_CANDIDATO.find((o) => o.value === c.origen)?.label ??
                        c.origen ??
                        "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {c.cvPathGcs ? (
                      <button
                        type="button"
                        onClick={() => window.open(`/api/admin/talento/cv/${c.id}`, "_blank")}
                        className="inline-flex items-center gap-1 font-lato text-xs font-semibold text-blue-700 hover:underline"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Ver CV
                      </button>
                    ) : (
                      <span className="font-lato text-xs text-slate-400">Sin CV</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {c.postulaciones.length === 0 && (
                        <span className="font-lato text-xs text-slate-400">—</span>
                      )}
                      {c.postulaciones.map((p) => (
                        <span
                          key={p.id}
                          className="rounded-none bg-slate-100 px-1.5 py-0.5 font-lato text-[10px] font-semibold text-slate-700"
                          title={ETAPA_LABEL[p.etapa] ?? p.etapa}
                        >
                          {(p.vacante?.titulo ?? "Espontánea") + " · " + (ETAPA_LABEL[p.etapa] ?? p.etapa)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-lato text-xs text-slate-600">
                    {c.consentimientoBanco ? "Sí" : "No"}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                      <button
                        onClick={() => beginEdit(c)}
                        disabled={editingId !== null}
                        title="Editar"
                        className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-stone-100 hover:text-slate-900 disabled:opacity-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => del(c)}
                        disabled={editingId !== null}
                        title="Eliminar (supresión habeas data)"
                        className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"
import { cn } from "@/lib/utils"
import { ETAPA_LABEL, ORIGENES_CANDIDATO } from "./constants"
import type { CandidatoSer, VacanteSer } from "./types"

const MAX_CV_MB = 10

type DatosIA = {
  oficios?: string[]
  certificaciones?: string[]
  anosExperiencia?: number
  alertas?: string[]
  resumen?: string
}

type ResultadoIA = { candidatoId: string; relevancia: number; razon: string }

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
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [iaBusyId, setIaBusyId] = useState<string | null>(null)
  const [iaError, setIaError] = useState<string | null>(null)
  // Búsqueda semántica
  const [iaQuery, setIaQuery] = useState("")
  const [iaResultados, setIaResultados] = useState<ResultadoIA[] | null>(null)
  const [iaBuscando, setIaBuscando] = useState(false)
  // Purga por retención
  const [purga, setPurga] = useState<{ count: number; retencionMeses: number } | null>(null)
  const [purgando, setPurgando] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const isNew = editingId === "__new__"

  useEffect(() => {
    fetch("/api/admin/talento/purga")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.count === "number") {
          setPurga({ count: d.count, retencionMeses: d.retencionMeses })
        }
      })
      .catch(() => {})
  }, [])

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
      {
        name: "areaInteres",
        label: "Área de interés",
        kind: "text",
        placeholder: "SST, Producción, Ingeniería, Administrativa…",
        hint: "Organiza el banco por área aunque no haya vacante activa.",
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

  /**
   * Normaliza para buscar: quita tildes y trata "_", "-", "." como espacios,
   * así "David Castillo" encuentra "David_Castillo.pdf" y "Jiménez" encuentra
   * "Jimenez". El resto del admin ya lo hacía; esta pestaña se había quedado
   * comparando con un toLowerCase() pelado.
   */
  const normalizarBusqueda = (v: string) =>
    v
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()

  const filtered = useMemo(() => {
    let list = items
    // Resultados de la búsqueda IA: filtra y ordena por relevancia
    if (iaResultados) {
      const orden = new Map(iaResultados.map((r, i) => [r.candidatoId, i]))
      list = list
        .filter((c) => orden.has(c.id))
        .sort((a, b) => (orden.get(a.id) ?? 99) - (orden.get(b.id) ?? 99))
    }
    const q = normalizarBusqueda(query)
    if (!q) return list
    return list.filter((c) =>
      [
        c.nombre,
        c.email,
        c.telefono,
        c.ciudad,
        c.origen,
        c.areaInteres,
        // El NOMBRE DEL ARCHIVO importa: Talento Humano conoce a la persona por
        // cómo se llama el CV en Drive ("David_Castillo.pdf"), pero el sistema
        // muestra el nombre real que la IA extrajo del documento ("Henner David
        // Torres Castillo"). Sin esto, buscar por el nombre del archivo no
        // encuentra nada y parece que el candidato no está cargado.
        c.cvFileName,
        c.origenDetalle,
      ]
        .filter(Boolean)
        .some((v) => normalizarBusqueda(String(v)).includes(q)),
    )
  }, [items, query, iaResultados])

  const razonIA = useMemo(() => {
    if (!iaResultados) return new Map<string, ResultadoIA>()
    return new Map(iaResultados.map((r) => [r.candidatoId, r]))
  }, [iaResultados])

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

      const { postulaciones, createdAt, id, cvPathGcs, cvFileName, resumenIA, datosIA, ...body } =
        draft as any
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

  const analizarCv = async (c: CandidatoSer) => {
    setIaBusyId(c.id)
    setIaError(null)
    try {
      const res = await fetch("/api/admin/talento/ia/analizar-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidatoId: c.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error analizando el CV")
      setItems((prev) =>
        prev.map((x) =>
          x.id === c.id
            ? { ...x, resumenIA: data.datos?.resumen ?? null, datosIA: data.datos }
            : x,
        ),
      )
      setExpandedId(c.id)
    } catch (e: any) {
      setIaError(e.message ?? "Error analizando el CV")
    } finally {
      setIaBusyId(null)
    }
  }

  const buscarIA = async () => {
    if (iaQuery.trim().length < 3) return
    setIaBuscando(true)
    setIaError(null)
    try {
      const res = await fetch("/api/admin/talento/ia/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consulta: iaQuery.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error en la búsqueda")
      setIaResultados(data.resultados ?? [])
    } catch (e: any) {
      setIaError(e.message ?? "Error en la búsqueda")
      setIaResultados(null)
    } finally {
      setIaBuscando(false)
    }
  }

  const ejecutarPurga = async () => {
    if (!purga || purga.count === 0) return
    if (
      !confirm(
        `Se van a SUPRIMIR definitivamente ${purga.count} candidato(s) con más de ${purga.retencionMeses} meses, sin autorización de banco y sin contratación (CV incluido). ¿Confirmas la purga habeas data?`,
      )
    )
      return
    setPurgando(true)
    try {
      const res = await fetch("/api/admin/talento/purga", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error ejecutando la purga")
      setPurga({ ...purga, count: 0 })
      // Refresca la lista completa
      const list = await fetch("/api/admin/talento/candidatos").then((r) => r.json())
      if (Array.isArray(list)) setItems(list)
      alert(`Purga completada: ${data.purgados} candidato(s) suprimidos.`)
    } catch (e: any) {
      alert(e.message ?? "Error ejecutando la purga")
    } finally {
      setPurgando(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Banner de purga por retención */}
      {purga !== null && purga.count > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="font-lato text-sm text-amber-900">
              <strong>{purga.count}</strong> candidato(s) superaron la retención de{" "}
              {purga.retencionMeses} meses sin autorización de banco de talento — la Ley
              1581/2012 exige suprimirlos.
            </p>
          </div>
          <button
            onClick={ejecutarPurga}
            disabled={purgando}
            className="inline-flex items-center gap-1.5 rounded-none bg-amber-600 px-3 py-1.5 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            {purgando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Ejecutar purga
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-lato text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          {filtered.length} {filtered.length === 1 ? "candidato" : "candidatos"}
          {iaResultados ? " (resultado búsqueda IA)" : ""}
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrar…"
              className="w-40 rounded-none border border-slate-300 bg-white py-2 pl-9 pr-3 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
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

      {/* Búsqueda semántica IA */}
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2.5">
        <Sparkles className="h-4 w-4 flex-shrink-0 text-blue-700" />
        <input
          type="text"
          value={iaQuery}
          onChange={(e) => setIaQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscarIA()}
          placeholder='Búsqueda IA del banco — ej: "soldadores 3G en Cali con experiencia en puentes"'
          className="min-w-[240px] flex-1 rounded-none border border-slate-300 bg-white px-3 py-1.5 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
        />
        <button
          onClick={buscarIA}
          disabled={iaBuscando || iaQuery.trim().length < 3}
          className="inline-flex items-center gap-1.5 rounded-none border border-blue-700 bg-white px-3 py-1.5 font-lato text-xs font-bold uppercase tracking-wider text-blue-700 transition-colors hover:bg-blue-700 hover:text-white disabled:opacity-50"
        >
          {iaBuscando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Buscar con IA
        </button>
        {iaResultados && (
          <button
            onClick={() => {
              setIaResultados(null)
              setIaQuery("")
            }}
            className="inline-flex items-center gap-1 rounded-none border border-slate-300 px-2.5 py-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-600 hover:border-slate-900"
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {iaError && (
        <div className="rounded-none border border-red-300 bg-red-100 px-3 py-2 font-lato text-sm text-red-800">
          {iaError}
        </div>
      )}

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
          <table className="w-full min-w-[900px]">
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
              {filtered.map((c) => {
                const datos = (c.datosIA ?? null) as DatosIA | null
                const busquedaHit = razonIA.get(c.id)
                const isExpanded = expandedId === c.id
                return (
                  <FragmentRow key={c.id}>
                    <tr className="group border-b border-slate-100 transition-colors last:border-0 hover:bg-stone-50">
                      <td className="px-3 py-2.5">
                        <p className="font-lato text-sm font-semibold text-slate-900">
                          {c.nombre}
                        </p>
                        <p className="font-lato text-xs text-slate-500">{c.ciudad ?? "—"}</p>
                        {busquedaHit && (
                          <p className="mt-0.5 font-lato text-[11px] text-blue-700">
                            IA {busquedaHit.relevancia}: {busquedaHit.razon}
                          </p>
                        )}
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
                        {c.areaInteres && (
                          <span className="ml-1 rounded-none border border-blue-200 bg-blue-50 px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider text-blue-800">
                            {c.areaInteres}
                          </span>
                        )}
                        {c.codigoReferido && (
                          <span
                            title={`Código ${c.codigoReferido.codigo}`}
                            className="ml-1 rounded-none border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider text-amber-800"
                          >
                            Refirió: {c.codigoReferido.nombreEmpleado}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {c.cvPathGcs ? (
                          <button
                            type="button"
                            onClick={() =>
                              window.open(`/api/admin/talento/cv/${c.id}`, "_blank")
                            }
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
                              {(p.vacante?.titulo ?? "Espontánea") +
                                " · " +
                                (ETAPA_LABEL[p.etapa] ?? p.etapa)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-lato text-xs text-slate-600">
                        {c.consentimientoBanco ? "Sí" : "No"}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          {c.cvPathGcs && (
                            <button
                              onClick={() => analizarCv(c)}
                              disabled={iaBusyId !== null}
                              title={
                                c.resumenIA
                                  ? "Re-analizar CV con IA"
                                  : "Analizar CV con IA (extrae perfil y resumen)"
                              }
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-none transition-colors disabled:opacity-50",
                                c.resumenIA
                                  ? "text-blue-700 hover:bg-blue-50"
                                  : "text-slate-400 hover:bg-blue-50 hover:text-blue-700",
                              )}
                            >
                              {iaBusyId === c.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                          {c.resumenIA && (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : c.id)}
                              title="Ver perfil IA"
                              className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-stone-100 hover:text-slate-900"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => beginEdit(c)}
                            disabled={editingId !== null}
                            title="Editar"
                            className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-stone-100 hover:text-slate-900 disabled:opacity-50 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => del(c)}
                            disabled={editingId !== null}
                            title="Eliminar (supresión habeas data)"
                            className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && c.resumenIA && (
                      <tr className="border-b border-slate-100 bg-blue-50/40">
                        <td colSpan={7} className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-700" />
                            <div className="min-w-0 space-y-2">
                              <p className="font-lato text-sm text-slate-800">{c.resumenIA}</p>
                              {datos && (
                                <div className="flex flex-wrap gap-1.5">
                                  {typeof datos.anosExperiencia === "number" && (
                                    <span className="rounded-none bg-slate-950 px-2 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider text-white">
                                      {datos.anosExperiencia} años exp.
                                    </span>
                                  )}
                                  {(datos.oficios ?? []).map((o) => (
                                    <span
                                      key={o}
                                      className="rounded-none border border-blue-200 bg-white px-2 py-0.5 font-lato text-[10px] font-semibold uppercase tracking-wider text-blue-800"
                                    >
                                      {o}
                                    </span>
                                  ))}
                                  {(datos.certificaciones ?? []).map((cert) => (
                                    <span
                                      key={cert}
                                      className="rounded-none border border-green-200 bg-white px-2 py-0.5 font-lato text-[10px] font-semibold uppercase tracking-wider text-green-700"
                                    >
                                      {cert}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {datos && (datos.alertas ?? []).length > 0 && (
                                <p className="font-lato text-xs text-amber-700">
                                  ⚠ {(datos.alertas ?? []).join(" · ")}
                                </p>
                              )}
                              <p className="font-lato text-[10px] uppercase tracking-wide text-slate-400">
                                Sugerencia generada por IA — la decisión es del reclutador
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </FragmentRow>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// React.Fragment con key para agrupar la fila principal + la fila expandida.
function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

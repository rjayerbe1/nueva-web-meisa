"use client"

import { useMemo, useRef, useState } from "react"
import { Loader2, Save, Upload, X } from "lucide-react"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"
import { ORIGENES_CANDIDATO } from "./constants"
import { useTalento } from "./TalentoStore"
import type { CandidatoSer, PostulacionSer } from "./types"

const MAX_CV_MB = 10

/**
 * Alta y edición de una persona del banco. Se usa en la pestaña Hojas de vida
 * (alta) y dentro del panel de la persona (edición).
 */
export function CandidatoForm({
  candidato,
  vacanteInicial = "",
  onListo,
  onCancelar,
}: {
  /** null = alta nueva */
  candidato: CandidatoSer | null
  vacanteInicial?: string
  onListo: (c: CandidatoSer) => void
  onCancelar: () => void
}) {
  const { vacantes, setCandidatos, setPostulaciones } = useTalento()
  const isNew = candidato === null
  const [draft, setDraft] = useState<Record<string, unknown>>(
    candidato
      ? { ...candidato }
      : { consentimientoBanco: false, origen: null, vacanteId: vacanteInicial },
  )
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fields: FieldDef[] = useMemo(
    () => [
      { name: "nombre", label: "Nombre completo", kind: "text", required: true },
      {
        name: "origen",
        label: "¿Por dónde llegó?",
        kind: "select",
        required: true,
        options: ORIGENES_CANDIDATO,
        hint: "Trazabilidad de habeas data.",
      },
      { name: "email", label: "Correo", kind: "text" },
      { name: "telefono", label: "Teléfono", kind: "text" },
      { name: "ciudad", label: "Ciudad donde vive", kind: "text" },
      {
        name: "areaInteres",
        label: "Área / oficio",
        kind: "text",
        placeholder: "Soldador, SST, Proyectista, Administrativa…",
        hint: "Ordena el banco aunque no haya vacante abierta.",
      },
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
                { value: "", label: "Ninguna (solo al banco)" },
                ...vacantes
                  .filter((v) => v.estado === "ABIERTA" || v.estado === "PAUSADA")
                  .map((v) => ({ value: v.id, label: v.titulo })),
              ],
            },
          ] as FieldDef[])
        : []),
      {
        name: "consentimientoBanco",
        label: "Autorizó conservar la hoja de vida para vacantes futuras",
        kind: "boolean",
        hint: "Sin esta autorización se purga al cumplir el plazo de retención.",
      },
      { name: "notas", label: "Notas", kind: "textarea", gridSpan: 2, rows: 2 },
    ],
    [isNew, vacantes],
  )

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
          throw new Error(msg.error ?? "Error subiendo la hoja de vida")
        }
        const r = await up.json()
        cvData = {
          cvPathGcs: r.pathGcs,
          cvFileName: r.fileName,
          cvContentType: r.contentType,
          cvSize: r.size,
        }
      }

      const {
        postulaciones: _p,
        createdAt: _c,
        id: _i,
        cvPathGcs: _g,
        cvFileName: _f,
        resumenIA: _r,
        datosIA: _d,
        codigoReferido: _cr,
        ...body
      } = draft as any
      const res = await fetch(
        isNew ? "/api/admin/talento/candidatos" : `/api/admin/talento/candidatos/${candidato!.id}`,
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
      const raw = await res.json()
      // La respuesta no siempre trae las relaciones: conservar las que ya había.
      const saved: CandidatoSer = {
        ...(candidato ?? {}),
        ...raw,
        createdAt: raw.createdAt ?? candidato?.createdAt ?? new Date().toISOString(),
        postulaciones: Array.isArray(raw.postulaciones)
          ? raw.postulaciones.map((p: PostulacionSer & { vacante: any }) => ({
              id: p.id,
              etapa: p.etapa,
              vacante: p.vacante ?? null,
            }))
          : (candidato?.postulaciones ?? []),
        codigoReferido: raw.codigoReferido ?? candidato?.codigoReferido ?? null,
      }
      setCandidatos((prev) =>
        isNew ? [saved, ...prev] : prev.map((c) => (c.id === saved.id ? saved : c)),
      )
      // El alta crea su postulación en el servidor: sumarla al tablero ya.
      if (isNew && Array.isArray(raw.postulaciones)) {
        const nuevas: PostulacionSer[] = raw.postulaciones.map((p: any) => ({
          id: p.id,
          candidatoId: saved.id,
          vacanteId: p.vacanteId ?? null,
          etapa: p.etapa,
          notasInternas: p.notasInternas ?? null,
          scoreIA: p.scoreIA ?? null,
          matchIA: p.matchIA ?? null,
          historial: p.historial,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          candidato: {
            id: saved.id,
            nombre: saved.nombre,
            email: saved.email,
            telefono: saved.telefono,
            ciudad: saved.ciudad,
            origen: saved.origen,
            cvPathGcs: saved.cvPathGcs,
          },
          vacante: p.vacante ?? null,
        }))
        setPostulaciones((prev) => [...nuevas, ...prev])
      } else if (!isNew) {
        setPostulaciones((prev) =>
          prev.map((p) =>
            p.candidatoId === saved.id
              ? {
                  ...p,
                  candidato: {
                    ...p.candidato,
                    nombre: saved.nombre,
                    email: saved.email,
                    telefono: saved.telefono,
                    ciudad: saved.ciudad,
                    origen: saved.origen,
                    cvPathGcs: saved.cvPathGcs,
                  },
                }
              : p,
          ),
        )
      }
      onListo(saved)
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border border-slate-200 bg-white px-5 py-5">
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
              className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900 disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {cvFile ? "Cambiar archivo" : "Seleccionar archivo"}
            </button>
            {cvFile ? (
              <span className="font-lato text-sm text-slate-700">
                {cvFile.name}{" "}
                <span className="text-slate-400">({(cvFile.size / 1024 / 1024).toFixed(1)} MB)</span>
              </span>
            ) : candidato?.cvFileName ? (
              <span className="font-lato text-sm text-slate-500">
                Actual: {candidato.cvFileName} (se conserva si no eliges otro)
              </span>
            ) : (
              <span className="font-lato text-sm italic text-slate-400">Sin archivo</span>
            )}
          </div>
          <p className="mt-1.5 font-lato text-xs italic text-slate-500">
            Se guarda en un almacenamiento privado; solo se ve desde este panel.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 border border-red-300 bg-red-100 px-3 py-2 font-lato text-sm text-red-800">
          {error}
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2 border-t border-slate-200 pt-4">
        <button
          onClick={onCancelar}
          disabled={saving}
          className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          Cancelar
        </button>
        <button
          onClick={save}
          disabled={saving || !String(draft.nombre ?? "").trim()}
          className="inline-flex items-center gap-1.5 bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Guardar
        </button>
      </div>
    </div>
  )
}

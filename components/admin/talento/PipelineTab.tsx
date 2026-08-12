"use client"

import { useMemo, useState } from "react"
import { FileDown, FileText, Loader2, Sparkles, StickyNote } from "lucide-react"
import { cn } from "@/lib/utils"
import { ETAPAS, ETAPA_LABEL } from "./constants"
import type { PostulacionSer, VacanteSer } from "./types"

const ETAPA_ACCENT: Record<string, string> = {
  RECIBIDA: "border-t-slate-400",
  PRESELECCION: "border-t-blue-500",
  ENTREVISTA: "border-t-amber-500",
  OFERTA: "border-t-blue-700",
  CONTRATADA: "border-t-green-600",
  DESCARTADA: "border-t-slate-300",
}

function diasDesde(iso: string): string {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (dias <= 0) return "hoy"
  if (dias === 1) return "hace 1 día"
  return `hace ${dias} días`
}

export function PipelineTab({
  postulaciones: initial,
  vacantes,
}: {
  postulaciones: PostulacionSer[]
  vacantes: VacanteSer[]
}) {
  const [items, setItems] = useState<PostulacionSer[]>(initial)
  const [filtroVacante, setFiltroVacante] = useState<string>("")
  const [savingId, setSavingId] = useState<string | null>(null)
  const [notasOpenId, setNotasOpenId] = useState<string | null>(null)
  const [notasDraft, setNotasDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [matchBusyId, setMatchBusyId] = useState<string | null>(null)
  const [matchOpenId, setMatchOpenId] = useState<string | null>(null)

  // Solo tiene sentido con UNA vacante elegida: el informe es por cargo.
  const vacanteSeleccionada = useMemo(
    () => (filtroVacante && filtroVacante !== "__espontanea__"
      ? vacantes.find((v) => v.id === filtroVacante) ?? null
      : null),
    [filtroVacante, vacantes],
  )

  const filtered = useMemo(() => {
    if (!filtroVacante) return items
    if (filtroVacante === "__espontanea__") return items.filter((p) => !p.vacanteId)
    return items.filter((p) => p.vacanteId === filtroVacante)
  }, [items, filtroVacante])

  const update = async (id: string, data: Record<string, unknown>) => {
    setSavingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/talento/postulaciones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error")
      }
      const updated: PostulacionSer = await res.json()
      setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSavingId(null)
    }
  }

  const guardarNotas = async (id: string) => {
    await update(id, { notasInternas: notasDraft })
    setNotasOpenId(null)
  }

  const evaluarMatch = async (p: PostulacionSer) => {
    setMatchBusyId(p.id)
    setError(null)
    try {
      const res = await fetch("/api/admin/talento/ia/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postulacionId: p.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error evaluando el match")
      setItems((prev) =>
        prev.map((x) =>
          x.id === p.id ? { ...x, scoreIA: data.match.score, matchIA: data.match } : x,
        ),
      )
      setMatchOpenId(p.id)
    } catch (e: any) {
      setError(e.message ?? "Error evaluando el match")
    } finally {
      setMatchBusyId(null)
    }
  }

  const scoreColor = (score: number) =>
    score >= 70
      ? "bg-green-600 text-white"
      : score >= 45
        ? "bg-amber-500 text-white"
        : "bg-slate-300 text-slate-800"

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-lato text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          {filtered.length} {filtered.length === 1 ? "postulación" : "postulaciones"}
        </p>
        <select
          value={filtroVacante}
          onChange={(e) => setFiltroVacante(e.target.value)}
          className="rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-xs font-semibold uppercase tracking-wide text-slate-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
          aria-label="Filtrar por vacante"
        >
          <option value="">Todas las vacantes</option>
          <option value="__espontanea__">Espontáneas / banco</option>
          {vacantes.map((v) => (
            <option key={v.id} value={v.id}>
              {v.titulo}
            </option>
          ))}
        </select>

        {/* Informe de la vacante seleccionada. Abre en pestaña nueva y lanza el
            diálogo de impresión del navegador → "Guardar como PDF". No se genera
            en el servidor porque la imagen de Cloud Run no trae Chrome. */}
        {vacanteSeleccionada && (
          <a
            href={`/api/admin/talento/informe/${vacanteSeleccionada.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-none border border-slate-900 bg-slate-900 px-3 py-2 font-lato text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-slate-700"
            title={`Informe de evaluación de ${vacanteSeleccionada.titulo} para guardar como PDF`}
          >
            <FileDown className="h-3.5 w-3.5" />
            Informe PDF
          </a>
        )}
      </div>

      {error && (
        <div className="rounded-none border border-red-300 bg-red-100 px-3 py-2 font-lato text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-3">
        {ETAPAS.map((etapa) => {
          const columna = filtered.filter((p) => p.etapa === etapa.value)
          return (
            <div
              key={etapa.value}
              className={cn(
                "flex w-72 flex-shrink-0 flex-col rounded-md border border-t-4 border-slate-200 bg-stone-50",
                ETAPA_ACCENT[etapa.value],
                etapa.value === "DESCARTADA" && "opacity-75",
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5">
                <span className="font-bebas text-base uppercase tracking-wide text-slate-950">
                  {etapa.label}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-lato text-[11px] font-semibold text-slate-600">
                  {columna.length}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-2">
                {columna.length === 0 && (
                  <p className="px-2 py-6 text-center font-lato text-xs text-slate-400">
                    Sin candidatos
                  </p>
                )}
                {columna.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-lato text-sm font-semibold text-slate-900">
                          {p.candidato.nombre}
                        </p>
                        <p className="mt-0.5 truncate font-lato text-xs text-slate-500">
                          {p.vacante?.titulo ?? "Espontánea"}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1">
                        {typeof p.scoreIA === "number" && (
                          <button
                            type="button"
                            onClick={() => setMatchOpenId(matchOpenId === p.id ? null : p.id)}
                            title="Match IA (sugerencia — clic para detalle)"
                            className={cn(
                              "rounded-none px-1.5 py-0.5 font-lato text-[10px] font-bold",
                              scoreColor(p.scoreIA),
                            )}
                          >
                            {p.scoreIA}
                          </button>
                        )}
                        {p.candidato.cvPathGcs && (
                          <button
                            type="button"
                            onClick={() =>
                              window.open(`/api/admin/talento/cv/${p.candidato.id}`, "_blank")
                            }
                            title="Ver hoja de vida"
                            className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-stone-100 hover:text-slate-900"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {matchOpenId === p.id && p.matchIA != null && (
                      <div className="mt-2 space-y-1 border border-blue-100 bg-blue-50/50 px-2 py-1.5">
                        {(() => {
                          const m = p.matchIA as {
                            fortalezas?: string[]
                            brechas?: string[]
                            porValidar?: string[]
                            recomendacion?: string
                            conMatriz?: boolean
                            criterios?: Array<{
                              nombre: string
                              peso: number
                              puntaje: number
                              valoracion: string
                              justificacion: string
                            }>
                          }
                          return (
                            <>
                              {/* Desglose por criterio: el score deja de ser un
                                  número suelto y se puede discutir línea a línea
                                  con el jefe del área. */}
                              {(m.criterios ?? []).length > 0 && (
                                <table className="w-full border-collapse font-lato text-[10px]">
                                  <tbody>
                                    {(m.criterios ?? []).map((c) => (
                                      <tr key={c.nombre} className="align-top">
                                        <td className="py-0.5 pr-2 text-slate-600">
                                          {c.nombre}
                                          <span className="text-slate-400"> · {c.peso}%</span>
                                          {c.justificacion && (
                                            <span className="block text-[9px] leading-snug text-slate-400">
                                              {c.justificacion}
                                            </span>
                                          )}
                                        </td>
                                        <td className="whitespace-nowrap py-0.5 text-right font-semibold text-slate-700">
                                          {c.puntaje}
                                          <span className="ml-1 font-normal text-slate-400">
                                            {c.valoracion}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                              {(m.fortalezas ?? []).length > 0 && (
                                <p className="font-lato text-[11px] text-green-700">
                                  ✓ {(m.fortalezas ?? []).join(" · ")}
                                </p>
                              )}
                              {(m.brechas ?? []).length > 0 && (
                                <p className="font-lato text-[11px] text-amber-700">
                                  ✗ {(m.brechas ?? []).join(" · ")}
                                </p>
                              )}
                              {(m.porValidar ?? []).length > 0 && (
                                <p className="font-lato text-[11px] text-blue-700">
                                  ? Validar en entrevista: {(m.porValidar ?? []).join(" · ")}
                                </p>
                              )}
                              {m.recomendacion && (
                                <p className="font-lato text-[11px] text-slate-700">
                                  {m.recomendacion}
                                </p>
                              )}
                              <p className="font-lato text-[9px] uppercase tracking-wide text-slate-400">
                                {m.conMatriz
                                  ? "Ponderado con la matriz del cargo — decide el reclutador"
                                  : "Sin matriz definida: la IA estimó los pesos — decide el reclutador"}
                              </p>
                            </>
                          )
                        })()}
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-1.5">
                      <select
                        value={p.etapa}
                        disabled={savingId === p.id}
                        onChange={(e) => update(p.id, { etapa: e.target.value })}
                        className="min-w-0 flex-1 rounded-none border border-slate-200 bg-white px-1.5 py-1 font-lato text-[11px] font-semibold uppercase tracking-wide text-slate-700 focus:border-red-600 focus:outline-none"
                        aria-label="Cambiar etapa"
                      >
                        {ETAPAS.map((e) => (
                          <option key={e.value} value={e.value}>
                            {ETAPA_LABEL[e.value]}
                          </option>
                        ))}
                      </select>
                      {p.vacanteId && (
                        <button
                          type="button"
                          onClick={() => evaluarMatch(p)}
                          disabled={matchBusyId !== null}
                          title="Evaluar match con IA (requiere CV analizado)"
                          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-none text-slate-300 transition-colors hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                        >
                          {matchBusyId === p.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (notasOpenId === p.id) {
                            setNotasOpenId(null)
                          } else {
                            setNotasOpenId(p.id)
                            setNotasDraft(p.notasInternas ?? "")
                          }
                        }}
                        title="Notas internas"
                        className={cn(
                          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-none transition-colors",
                          p.notasInternas
                            ? "text-amber-600 hover:bg-amber-50"
                            : "text-slate-300 hover:bg-stone-100 hover:text-slate-600",
                        )}
                      >
                        {savingId === p.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <StickyNote className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {notasOpenId === p.id && (
                      <div className="mt-2 space-y-1.5">
                        <textarea
                          value={notasDraft}
                          onChange={(e) => setNotasDraft(e.target.value)}
                          rows={3}
                          placeholder="Notas internas del proceso…"
                          className="w-full rounded-none border border-slate-300 bg-white px-2 py-1.5 font-lato text-xs text-slate-900 focus:border-red-600 focus:outline-none"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setNotasOpenId(null)}
                            className="rounded-none border border-slate-200 px-2 py-1 font-lato text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:border-slate-900"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => guardarNotas(p.id)}
                            disabled={savingId === p.id}
                            className="rounded-none bg-red-600 px-2 py-1 font-lato text-[10px] font-bold uppercase tracking-wider text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="mt-1.5 font-lato text-[10px] uppercase tracking-wide text-slate-400">
                      {diasDesde(p.updatedAt)}
                      {p.candidato.origen ? ` · ${p.candidato.origen}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="font-lato text-xs italic text-slate-500">
        Los candidatos se agregan desde la pestaña «Candidatos». Cada cambio de etapa queda
        registrado con fecha y usuario en el historial de la postulación.
      </p>
    </div>
  )
}

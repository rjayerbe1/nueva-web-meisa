"use client"

import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp, Loader2, Sparkles, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CandidatoSer, ComparativoSer, VacanteSer } from "./types"

function scoreColor(score: number) {
  return score >= 70
    ? "bg-green-600 text-white"
    : score >= 45
      ? "bg-amber-500 text-white"
      : "bg-slate-300 text-slate-800"
}

function MatrizComparativo({ comp }: { comp: ComparativoSer["resultados"] }) {
  return (
    <div className="space-y-4">
      {comp.conclusion && (
        <div className="border border-blue-200 bg-blue-50/60 px-4 py-3">
          <p className="mb-1 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-blue-800">
            Conclusión — terna sugerida
          </p>
          <p className="font-lato text-sm leading-relaxed text-slate-800">{comp.conclusion}</p>
        </div>
      )}
      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="border-b border-slate-200 bg-stone-50">
              {["#", "Candidato", "Score", "Fortalezas", "Brechas", "Recomendación"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comp.evaluaciones.map((e, i) => (
              <tr key={e.candidatoId} className="border-b border-slate-100 align-top last:border-0">
                <td className="px-3 py-3 font-bebas text-xl text-slate-300">{i + 1}</td>
                <td className="px-3 py-3">
                  <p className="font-lato text-sm font-semibold text-slate-900">{e.nombre}</p>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "inline-block rounded-none px-2 py-0.5 font-lato text-sm font-bold",
                      scoreColor(e.score),
                    )}
                  >
                    {e.score}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <ul className="space-y-1">
                    {e.fortalezas.map((f, j) => (
                      <li key={j} className="font-lato text-xs leading-relaxed text-green-800">
                        ✓ {f}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-3">
                  <ul className="space-y-1">
                    {e.brechas.map((b, j) => (
                      <li key={j} className="font-lato text-xs leading-relaxed text-amber-800">
                        ✗ {b}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-3 font-lato text-xs leading-relaxed text-slate-700">
                  {e.recomendacion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(comp.sinPerfil?.length ?? 0) > 0 && (
        <p className="font-lato text-xs text-amber-700">
          Excluidos por no tener CV analizado con IA: {comp.sinPerfil!.join(", ")} — analízalos
          en la pestaña Candidatos y vuelve a comparar.
        </p>
      )}
      <p className="font-lato text-[10px] uppercase tracking-wide text-slate-400">
        Matriz generada por IA — sugerencia para el comité; la decisión es del reclutador
      </p>
    </div>
  )
}

export function ComparativosTab({
  vacantes,
  candidatos,
  comparativos: initial,
}: {
  vacantes: VacanteSer[]
  candidatos: CandidatoSer[]
  comparativos: ComparativoSer[]
}) {
  const [comparativos, setComparativos] = useState<ComparativoSer[]>(initial)
  const [vacanteId, setVacanteId] = useState("")
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [abiertoId, setAbiertoId] = useState<string | null>(initial[0]?.id ?? null)

  const analizables = useMemo(
    () => candidatos.filter((c) => c.resumenIA || c.datosIA),
    [candidatos],
  )
  const sinAnalizar = candidatos.length - analizables.length

  const toggle = (id: string) => {
    setSeleccion((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const comparar = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/talento/ia/comparar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vacanteId, candidatoIds: Array.from(seleccion) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error generando el comparativo")
      const vacante = vacantes.find((v) => v.id === vacanteId)
      const nuevo: ComparativoSer = {
        id: data.comparativoId,
        vacanteId,
        vacanteTitulo: vacante?.titulo ?? "",
        resultados: data.resultado,
        creadoPor: null,
        createdAt: new Date().toISOString(),
      }
      setComparativos((prev) => [nuevo, ...prev])
      setAbiertoId(nuevo.id)
    } catch (e: any) {
      setError(e.message ?? "Error generando el comparativo")
    } finally {
      setBusy(false)
    }
  }

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este comparativo del historial?")) return
    const res = await fetch(`/api/admin/talento/ia/comparar?id=${id}`, { method: "DELETE" })
    if (res.ok) setComparativos((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Constructor del comparativo */}
      <div className="rounded-md border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-4">
          <Sparkles className="h-4 w-4 flex-shrink-0 text-blue-700" />
          <div className="min-w-0 flex-1">
            <h3 className="font-bebas text-xl uppercase leading-tight text-slate-950">
              Nuevo comparativo
            </h3>
            <p className="font-lato text-xs text-slate-500">
              Elige un perfil de cargo y los candidatos del banco: la IA los evalúa a todos
              contra el perfil y arma la matriz con terna sugerida.
            </p>
          </div>
          <select
            value={vacanteId}
            onChange={(e) => setVacanteId(e.target.value)}
            className="rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            aria-label="Perfil de cargo"
          >
            <option value="">Elegir perfil de cargo…</option>
            {vacantes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.titulo}
                {v.estado === "BORRADOR" ? " (perfil)" : ""}
              </option>
            ))}
          </select>
          <button
            onClick={comparar}
            disabled={busy || !vacanteId || seleccion.size < 2}
            className="inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Comparar ({seleccion.size})
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <p className="font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
              Candidatos ({analizables.length} con perfil IA)
            </p>
            <button
              type="button"
              onClick={() => setSeleccion(new Set(analizables.map((c) => c.id)))}
              className="font-lato text-[11px] font-bold uppercase tracking-wider text-blue-700 hover:underline"
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setSeleccion(new Set())}
              className="font-lato text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:underline"
            >
              Ninguno
            </button>
            {sinAnalizar > 0 && (
              <span className="font-lato text-xs italic text-slate-400">
                ({sinAnalizar} sin analizar con IA — no comparables)
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {analizables.map((c) => (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 border px-3 py-2 transition-colors",
                  seleccion.has(c.id)
                    ? "border-slate-950 bg-stone-50"
                    : "border-slate-200 bg-white hover:border-slate-400",
                )}
              >
                <input
                  type="checkbox"
                  checked={seleccion.has(c.id)}
                  onChange={() => toggle(c.id)}
                  className="h-4 w-4 flex-shrink-0 accent-red-600"
                />
                <span className="min-w-0 flex-1 truncate font-lato text-sm text-slate-900">
                  {c.nombre}
                </span>
                {c.areaInteres && (
                  <span className="flex-shrink-0 rounded-none border border-blue-200 bg-blue-50 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-blue-800">
                    {c.areaInteres}
                  </span>
                )}
              </label>
            ))}
          </div>
          {error && (
            <div className="mt-4 rounded-none border border-red-300 bg-red-100 px-3 py-2 font-lato text-sm text-red-800">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Historial */}
      <div className="space-y-3">
        <p className="font-lato text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          {comparativos.length}{" "}
          {comparativos.length === 1 ? "comparativo guardado" : "comparativos guardados"}
        </p>
        {comparativos.length === 0 && (
          <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="font-lato text-sm text-slate-500">
              Aún no hay comparativos. Elige un perfil y al menos 2 candidatos arriba.
            </p>
          </div>
        )}
        {comparativos.map((comp) => {
          const abierto = abiertoId === comp.id
          return (
            <div key={comp.id} className="rounded-md border border-slate-200 bg-white">
              <div className="flex w-full items-center gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setAbiertoId(abierto ? null : comp.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  {abierto ? (
                    <ChevronUp className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  )}
                  <span className="truncate font-bebas text-lg uppercase tracking-wide text-slate-950">
                    {comp.vacanteTitulo}
                  </span>
                  <span className="flex-shrink-0 font-lato text-xs text-slate-400">
                    {comp.resultados.evaluaciones.length} candidatos ·{" "}
                    {new Date(comp.createdAt).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {comp.creadoPor ? ` · ${comp.creadoPor}` : ""}
                  </span>
                </button>
                <button
                  onClick={() => eliminar(comp.id)}
                  title="Eliminar comparativo"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-none text-slate-300 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {abierto && (
                <div className="border-t border-slate-200 px-4 py-4">
                  <MatrizComparativo comp={comp.resultados} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

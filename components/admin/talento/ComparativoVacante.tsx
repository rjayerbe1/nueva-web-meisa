"use client"

import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp, Loader2, Search, Sparkles, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTalento } from "./TalentoStore"
import type { ComparativoSer } from "./types"

function scoreColor(score: number) {
  return score >= 70
    ? "bg-green-600 text-white"
    : score >= 45
      ? "bg-amber-500 text-white"
      : "bg-slate-300 text-slate-800"
}

function MatrizComparativo({ comp }: { comp: ComparativoSer["resultados"] }) {
  const { abrirCandidato } = useTalento()
  const ids = comp.evaluaciones.map((e) => e.candidatoId)
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
                  <button
                    type="button"
                    onClick={() => abrirCandidato(e.candidatoId, ids)}
                    className="text-left font-lato text-sm font-semibold text-slate-900 hover:text-red-600"
                  >
                    {e.nombre}
                  </button>
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
          desde su ficha y vuelve a comparar.
        </p>
      )}
      <p className="font-lato text-[10px] uppercase tracking-wide text-slate-400">
        Matriz generada por IA — sugerencia para el comité; la decisión es del reclutador
      </p>
    </div>
  )
}

/**
 * Comparativo IA de UNA vacante: arranca con sus postulados en curso ya
 * marcados y deja sumar gente del banco. Antes era una pestaña aparte donde
 * había que elegir el cargo y buscar a mano a cada persona entre 200.
 */
export function ComparativoVacante({ vacanteId }: { vacanteId: string }) {
  const { candidatos, postulaciones, comparativos, setComparativos, vacantePorId, avisar } = useTalento()
  const vacante = vacantePorId.get(vacanteId)
  const postulados = useMemo(
    () =>
      new Set(
        postulaciones
          .filter((p) => p.vacanteId === vacanteId && p.etapa !== "DESCARTADA")
          .map((p) => p.candidatoId),
      ),
    [postulaciones, vacanteId],
  )
  const analizables = useMemo(() => candidatos.filter((c) => c.resumenIA || c.datosIA), [candidatos])
  const [seleccion, setSeleccion] = useState<Set<string>>(
    () => new Set(analizables.filter((c) => postulados.has(c.id)).map((c) => c.id)),
  )
  const [verBanco, setVerBanco] = useState(false)
  const [busy, setBusy] = useState(false)
  const historial = comparativos.filter((c) => c.vacanteId === vacanteId)
  const [abiertoId, setAbiertoId] = useState<string | null>(historial[0]?.id ?? null)
  const [busqueda, setBusqueda] = useState("")

  const sinAnalizar = candidatos.filter((c) => postulados.has(c.id) && !(c.resumenIA || c.datosIA))
  const deLaVacante = analizables.filter((c) => postulados.has(c.id))
  const delBanco = useMemo(() => {
    const term = busqueda.trim().toLocaleLowerCase("es")
    return analizables
      .filter((c) => !postulados.has(c.id))
      .filter(
        (c) =>
          !term ||
          [c.nombre, c.ciudad, c.areaInteres]
            .filter(Boolean)
            .some((v) => String(v).toLocaleLowerCase("es").includes(term)),
      )
      .slice(0, 60)
  }, [analizables, postulados, busqueda])

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
    try {
      const res = await fetch("/api/admin/talento/ia/comparar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vacanteId, candidatoIds: Array.from(seleccion) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error generando el comparativo")
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
      avisar("error", e.message ?? "Error generando el comparativo")
    } finally {
      setBusy(false)
    }
  }

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este comparativo del historial?")) return
    const res = await fetch(`/api/admin/talento/ia/comparar?id=${id}`, { method: "DELETE" })
    if (res.ok) setComparativos((prev) => prev.filter((c) => c.id !== id))
  }

  const Casilla = ({ id, nombre, area }: { id: string; nombre: string; area: string | null }) => (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 border px-3 py-2 transition-colors",
        seleccion.has(id) ? "border-slate-950 bg-stone-50" : "border-slate-200 bg-white hover:border-slate-400",
      )}
    >
      <input
        type="checkbox"
        checked={seleccion.has(id)}
        onChange={() => toggle(id)}
        className="h-4 w-4 flex-shrink-0 accent-red-600"
      />
      <span className="min-w-0 flex-1 truncate font-lato text-sm text-slate-900">{nombre}</span>
      {area && (
        <span className="flex-shrink-0 border border-blue-200 bg-blue-50 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-blue-800">
          {area}
        </span>
      )}
    </label>
  )

  return (
    <div className="space-y-6">
      <div className="border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-4">
          <Sparkles className="h-4 w-4 flex-shrink-0 text-blue-700" />
          <div className="min-w-0 flex-1">
            <h3 className="font-bebas text-xl uppercase leading-tight text-slate-950">Nuevo comparativo</h3>
            <p className="font-lato text-xs text-slate-500">
              La IA evalúa a las personas marcadas contra el perfil del cargo y sugiere una terna. La decisión es
              del comité.
            </p>
          </div>
          <button
            onClick={comparar}
            disabled={busy || seleccion.size < 2}
            className="inline-flex items-center gap-1.5 bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Comparar {seleccion.size} personas
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <p className="mb-2 font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
              Postulados en curso ({deLaVacante.length})
            </p>
            {deLaVacante.length === 0 ? (
              <p className="font-lato text-sm text-slate-500">Nadie con hoja de vida analizada todavía.</p>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {deLaVacante.map((c) => (
                  <Casilla key={c.id} id={c.id} nombre={c.nombre} area={c.areaInteres} />
                ))}
              </div>
            )}
            {sinAnalizar.length > 0 && (
              <p className="mt-2 font-lato text-xs text-amber-700">
                {sinAnalizar.length} postulado(s) sin analizar no se pueden comparar todavía:{" "}
                {sinAnalizar.map((c) => c.nombre).join(", ")}.
              </p>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setVerBanco((x) => !x)}
              className="inline-flex items-center gap-1 font-lato text-xs font-bold uppercase tracking-wider text-blue-700 hover:underline"
            >
              {verBanco ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              Sumar personas del banco que no se postularon
            </button>
            {verBanco && (
              <div className="mt-2 space-y-2">
                <label className="relative block max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre, ciudad u oficio"
                    className="h-9 w-full border border-slate-300 bg-white pl-9 pr-9 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none"
                  />
                  {busqueda && (
                    <button
                      type="button"
                      onClick={() => setBusqueda("")}
                      className="absolute right-1 top-0.5 flex h-8 w-8 items-center justify-center text-slate-400 hover:text-slate-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </label>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {delBanco.map((c) => (
                    <Casilla key={c.id} id={c.id} nombre={c.nombre} area={c.areaInteres} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-lato text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          {historial.length} {historial.length === 1 ? "comparativo guardado" : "comparativos guardados"}
        </p>
        {historial.map((comp) => {
          const abierto = abiertoId === comp.id
          return (
            <div key={comp.id} className="border border-slate-200 bg-white">
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
                  <span className="font-lato text-sm font-semibold text-slate-900">
                    {new Date(comp.createdAt).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex-shrink-0 font-lato text-xs text-slate-400">
                    {comp.resultados.evaluaciones.length} personas
                    {comp.creadoPor ? ` · ${comp.creadoPor}` : ""}
                  </span>
                </button>
                <button
                  onClick={() => eliminar(comp.id)}
                  title="Eliminar comparativo"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center text-slate-300 transition-colors hover:bg-red-50 hover:text-red-600"
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

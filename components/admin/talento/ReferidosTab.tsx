"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, Copy, Loader2, Plus, Power, Search, Trash2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CodigoReferidoSer } from "./types"

type Colaborador = {
  id: string
  cedula: string | null
  nombre: string
  cargo: string | null
  area: string | null
}

const normalizar = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim()

/**
 * Programa de Referidos ("Referidos que Construyen"). Un código por
 * colaborador para compartir con quien quiera referir — el candidato lo
 * ingresa al aplicar (nunca el empleado entregando datos de un tercero, lo
 * que evitaría un problema de habeas data). Sirve solo para trazabilidad del
 * incentivo (Art. 128 CST: bonificación ocasional, no constitutiva de
 * salario) — nunca para saltarse la evaluación por mérito (Ley 931/2004).
 */
export function ReferidosTab({ codigos: initial }: { codigos: CodigoReferidoSer[] }) {
  const [items, setItems] = useState<CodigoReferidoSer[]>(initial)
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [cargandoColaboradores, setCargandoColaboradores] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [colaboradorId, setColaboradorId] = useState("")
  const [selectorAbierto, setSelectorAbierto] = useState(false)
  const [creando, setCreando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const selectorRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    fetch("/api/admin/talento/colaboradores", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "No fue posible cargar los colaboradores")
        if (active) setColaboradores(data)
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setCargandoColaboradores(false))
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!selectorAbierto) return
    const cerrar = (event: MouseEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) setSelectorAbierto(false)
    }
    document.addEventListener("mousedown", cerrar)
    requestAnimationFrame(() => searchRef.current?.focus())
    return () => document.removeEventListener("mousedown", cerrar)
  }, [selectorAbierto])

  const codigosPorColaborador = useMemo(() => {
    const map = new Map<string, CodigoReferidoSer>()
    for (const item of items) {
      if (item.colaboradorId) map.set(item.colaboradorId, item)
      map.set(`nombre:${normalizar(item.nombreEmpleado)}`, item)
    }
    return map
  }, [items])

  const filtrados = useMemo(() => {
    const term = normalizar(busqueda)
    if (!term) return colaboradores
    return colaboradores.filter((c) =>
      [c.nombre, c.cedula, c.cargo, c.area]
        .filter(Boolean)
        .some((value) => normalizar(String(value)).includes(term)),
    )
  }, [busqueda, colaboradores])

  const seleccionado = colaboradores.find((c) => c.id === colaboradorId) || null
  const codigoSeleccionado = seleccionado
    ? codigosPorColaborador.get(seleccionado.id) || codigosPorColaborador.get(`nombre:${normalizar(seleccionado.nombre)}`)
    : null

  const crear = async () => {
    if (!seleccionado || codigoSeleccionado) return
    setCreando(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/talento/referidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colaboradorId: seleccionado.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error creando el código")
      setItems((prev) => [
        { ...data, totalReferidos: 0, totalContratados: 0 },
        ...prev,
      ])
      setColaboradorId("")
      setBusqueda("")
    } catch (e: any) {
      setError(e.message ?? "Error creando el código")
    } finally {
      setCreando(false)
    }
  }

  const toggleActivo = async (item: CodigoReferidoSer) => {
    const res = await fetch(`/api/admin/talento/referidos/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !item.activo }),
    })
    if (!res.ok) return
    setItems((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, activo: !c.activo } : c)),
    )
  }

  const eliminar = async (item: CodigoReferidoSer) => {
    if (!confirm(`¿Eliminar el código de ${item.nombreEmpleado}? Los candidatos que ya referenció quedan sin código asociado, pero no se borran.`))
      return
    const res = await fetch(`/api/admin/talento/referidos/${item.id}`, { method: "DELETE" })
    if (!res.ok) return
    setItems((prev) => prev.filter((c) => c.id !== item.id))
  }

  const copiar = async (item: CodigoReferidoSer) => {
    await navigator.clipboard.writeText(item.codigo)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white px-5 py-4">
        <h3 className="font-bebas text-xl uppercase leading-tight text-slate-950">
          Programa de Referidos
        </h3>
        <p className="mt-1 font-lato text-xs leading-relaxed text-slate-500">
          Selecciona un colaborador activo de la base de Talento Humano y genera su código.
          El candidato lo ingresa él mismo al aplicar en la web — el código solo sirve para
          rastrear el incentivo (bonificación ocasional, no afecta la evaluación por mérito
          del candidato).
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
          <div ref={selectorRef} className="relative min-w-0">
            <button
              type="button"
              onClick={() => setSelectorAbierto((value) => !value)}
              disabled={cargandoColaboradores}
              aria-haspopup="listbox"
              aria-expanded={selectorAbierto}
              className={cn(
                "flex min-h-11 w-full items-center gap-3 border bg-white px-3 py-2 text-left transition-colors disabled:bg-stone-50",
                selectorAbierto
                  ? "border-red-600 ring-2 ring-red-600/15"
                  : "border-slate-300 hover:border-slate-500",
              )}
            >
              {cargandoColaboradores ? (
                <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-slate-400" />
              ) : (
                <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
              )}
              <span className="min-w-0 flex-1">
                {seleccionado ? (
                  <>
                    <span className="block truncate font-lato text-sm font-semibold text-slate-900">
                      {seleccionado.nombre}
                    </span>
                    <span className="block truncate font-lato text-xs text-slate-500">
                      {[seleccionado.cargo, seleccionado.area].filter(Boolean).join(" · ") || "Sin cargo registrado"}
                    </span>
                  </>
                ) : (
                  <span className="font-lato text-sm text-slate-500">
                    {cargandoColaboradores
                      ? "Cargando colaboradores..."
                      : `Buscar y elegir colaborador · ${colaboradores.length} disponibles`}
                  </span>
                )}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 flex-shrink-0 text-slate-400 transition-transform",
                  selectorAbierto && "rotate-180",
                )}
              />
            </button>

            {selectorAbierto && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 border border-slate-300 bg-white shadow-xl">
                <div className="border-b border-slate-200 p-3">
                  <label className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      ref={searchRef}
                      value={busqueda}
                      onChange={(event) => setBusqueda(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") setSelectorAbierto(false)
                      }}
                      placeholder="Nombre, cédula, cargo o área"
                      aria-label="Buscar colaborador"
                      className="h-10 w-full border border-slate-300 bg-white pl-9 pr-3 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/15"
                    />
                  </label>
                  <p className="mt-2 font-lato text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {filtrados.length} resultado{filtrados.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div role="listbox" aria-label="Colaboradores" className="max-h-72 overflow-y-auto p-1.5">
                  {filtrados.length === 0 ? (
                    <p className="px-3 py-8 text-center font-lato text-sm text-slate-500">
                      No hay colaboradores que coincidan con la búsqueda.
                    </p>
                  ) : (
                    filtrados.map((colaborador) => {
                      const existente =
                        codigosPorColaborador.get(colaborador.id) ||
                        codigosPorColaborador.get(`nombre:${normalizar(colaborador.nombre)}`)
                      const activo = colaborador.id === colaboradorId
                      return (
                        <button
                          key={colaborador.id}
                          type="button"
                          role="option"
                          aria-selected={activo}
                          onClick={() => {
                            setColaboradorId(colaborador.id)
                            setBusqueda("")
                            setSelectorAbierto(false)
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 border-b border-slate-100 px-3 py-2.5 text-left last:border-0 hover:bg-stone-50",
                            activo && "bg-red-50",
                          )}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-lato text-sm font-semibold text-slate-900">
                              {colaborador.nombre}
                            </span>
                            <span className="mt-0.5 block truncate font-lato text-xs text-slate-500">
                              {[colaborador.cargo, colaborador.area, colaborador.cedula && `CC ${colaborador.cedula}`]
                                .filter(Boolean).join(" · ")}
                            </span>
                          </span>
                          {existente ? (
                            <span className="flex-shrink-0 border border-blue-200 bg-blue-50 px-2 py-1 font-mono text-[10px] font-bold text-blue-800">
                              {existente.codigo}
                            </span>
                          ) : activo ? (
                            <Check className="h-4 w-4 flex-shrink-0 text-red-600" />
                          ) : null}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={crear}
            disabled={creando || !seleccionado || !!codigoSeleccionado}
            className="inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {creando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            {codigoSeleccionado ? "Ya tiene código" : "Generar código"}
          </button>
        </div>
        {seleccionado && (
          <p className="mt-2 font-lato text-xs text-slate-500">
            {[seleccionado.cargo, seleccionado.area, seleccionado.cedula && `CC ${seleccionado.cedula}`]
              .filter(Boolean).join(" · ")}
            {codigoSeleccionado ? ` · Código asignado: ${codigoSeleccionado.codigo}` : ""}
          </p>
        )}
        {error && (
          <div className="mt-3 rounded-none border border-red-300 bg-red-100 px-3 py-2 font-lato text-sm text-red-800">
            {error}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <Users className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          <p className="font-lato text-sm text-slate-500">
            Aún no hay códigos. Selecciona un colaborador arriba para generar el primero.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-200 bg-stone-50">
                {["Colaborador", "Código", "Referidos", "Contratados", "Estado", ""].map((h) => (
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
              {items.map((c) => (
                <tr
                  key={c.id}
                  className={cn(
                    "group border-b border-slate-100 transition-colors last:border-0 hover:bg-stone-50",
                    !c.activo && "opacity-50",
                  )}
                >
                  <td className="px-3 py-2.5 font-lato text-sm text-slate-900">
                    <p className="font-semibold">{c.nombreEmpleado}</p>
                    {(c.cargoEmpleado || c.areaEmpleado) && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {[c.cargoEmpleado, c.areaEmpleado].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => copiar(c)}
                      className="inline-flex items-center gap-1.5 rounded-none border border-slate-200 bg-stone-50 px-2 py-1 font-mono text-xs font-bold text-slate-800 transition-colors hover:border-slate-900"
                    >
                      {c.codigo}
                      {copiedId === c.id ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-2.5 font-lato text-sm text-slate-700">
                    {c.totalReferidos}
                  </td>
                  <td className="px-3 py-2.5">
                    {c.totalContratados > 0 ? (
                      <span className="rounded-none bg-green-100 px-1.5 py-0.5 font-lato text-xs font-bold text-green-800">
                        {c.totalContratados} contratado{c.totalContratados > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="font-lato text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "rounded-none border px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider",
                        c.activo
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-slate-200 bg-stone-50 text-slate-500",
                      )}
                    >
                      {c.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => toggleActivo(c)}
                        title={c.activo ? "Desactivar código" : "Activar código"}
                        className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-stone-100 hover:text-slate-900"
                      >
                        <Power className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => eliminar(c)}
                        title="Eliminar código"
                        className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
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

      <p className="font-lato text-[10px] uppercase tracking-wide text-slate-400">
        El pago del incentivo se define en el Programa de Referidos (nómina, tras superar el
        periodo de prueba) — esta tabla solo ayuda a identificar quién referenció a quién.
      </p>
    </div>
  )
}

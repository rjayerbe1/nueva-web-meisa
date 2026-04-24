"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Plus, X } from "lucide-react"

interface ProyectoItem {
  id: string
  slug: string
  titulo: string
  cliente: string
  ubicacion: string
  fechaFin: string | null
  toneladas: string | number | null
  imagenes: { url: string; urlOptimized: string | null; alt: string }[]
}

interface Props {
  obraId: string
  disabled?: boolean
  onChange?: () => void
}

export function ProyectosPicker({ obraId, disabled, onChange }: Props) {
  const [asignados, setAsignados] = useState<ProyectoItem[]>([])
  const [disponibles, setDisponibles] = useState<ProyectoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/obras/${obraId}/proyectos`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setAsignados(data.asignados ?? [])
      setDisponibles(data.disponibles ?? [])
    } catch (e: any) {
      setError(e.message ?? "Error cargando")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [obraId])

  const patch = async (body: { add?: string[]; remove?: string[] }) => {
    setSaving(true)
    try {
      await fetch(`/api/admin/obras/${obraId}/proyectos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      await fetchData()
      onChange?.()
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  const visibles = disponibles.filter((p) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      p.titulo.toLowerCase().includes(q) ||
      p.cliente.toLowerCase().includes(q) ||
      p.ubicacion.toLowerCase().includes(q)
    )
  })

  return (
    <div className="md:col-span-2">
      <label className="mb-1 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
        Proyectos agrupados en esta obra
      </label>
      <p className="mb-3 font-lato text-xs text-slate-500">
        Puedes agregar varios proyectos bajo la misma obra (ej: fases, contratos
        separados, locales de una cadena). Solo se muestran proyectos de la
        misma categoría que aún no están en otra obra.
      </p>

      {loading && (
        <p className="rounded-none border border-slate-200 bg-white px-4 py-6 text-center font-lato text-xs text-slate-500">
          Cargando…
        </p>
      )}

      {error && (
        <p className="rounded-none border border-red-200 bg-red-50 px-4 py-3 font-lato text-xs text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* Proyectos asignados */}
          {asignados.length > 0 ? (
            <div className="mb-5">
              <p className="mb-2 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Asignados ({asignados.length})
              </p>
              <ol className="space-y-1.5">
                {asignados.map((p, i) => {
                  const thumb = p.imagenes[0]?.urlOptimized || p.imagenes[0]?.url
                  return (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 rounded-none border border-slate-200 bg-white px-3 py-2"
                    >
                      <span className="font-bebas text-lg leading-none text-red-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {thumb ? (
                        <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden border border-slate-200 bg-slate-100">
                          <Image
                            src={thumb}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-14 flex-shrink-0 border border-dashed border-slate-300 bg-slate-50" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-lato text-sm font-semibold text-slate-900">
                          {p.titulo}
                        </p>
                        <p className="truncate font-lato text-[11px] text-slate-500">
                          {p.ubicacion}
                          {p.fechaFin && (
                            <span className="ml-2">
                              · {p.fechaFin.slice(0, 4)}
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => patch({ remove: [p.id] })}
                        disabled={disabled || saving}
                        className="flex h-6 w-6 items-center justify-center text-slate-400 transition-colors hover:text-red-600 disabled:opacity-30"
                        aria-label="Quitar de la obra"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>
          ) : (
            <p className="mb-5 rounded-none border border-dashed border-slate-300 bg-white px-4 py-4 font-lato text-xs text-slate-500">
              Aún no hay proyectos asignados a esta obra.
            </p>
          )}

          {/* Proyectos disponibles */}
          <p className="mb-2 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Disponibles ({disponibles.length})
          </p>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, cliente o ubicación…"
            className="mb-2 w-full rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            disabled={disabled || saving}
          />
          <div className="max-h-80 overflow-y-auto rounded-none border border-slate-200 bg-white">
            <ul className="divide-y divide-slate-100">
              {visibles.length === 0 ? (
                <li className="px-3 py-4 text-center font-lato text-xs text-slate-500">
                  {query
                    ? `Sin resultados para "${query}".`
                    : "No hay proyectos disponibles en esta categoría."}
                </li>
              ) : (
                visibles.map((p) => {
                  const thumb =
                    p.imagenes[0]?.urlOptimized || p.imagenes[0]?.url
                  return (
                    <li key={p.id} className="flex items-center gap-3 px-3 py-2">
                      {thumb ? (
                        <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden border border-slate-200 bg-slate-100">
                          <Image
                            src={thumb}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-14 flex-shrink-0 border border-dashed border-slate-300 bg-slate-50" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-lato text-sm font-semibold text-slate-900">
                          {p.titulo}
                        </p>
                        <p className="truncate font-lato text-[11px] text-slate-500">
                          {p.ubicacion}
                          {p.fechaFin && (
                            <span className="ml-2">
                              · {p.fechaFin.slice(0, 4)}
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => patch({ add: [p.id] })}
                        disabled={disabled || saving}
                        className="flex items-center gap-1 rounded-none border border-slate-300 bg-white px-2.5 py-1 font-lato text-[10px] font-bold uppercase tracking-wider text-slate-700 transition-colors hover:border-red-600 hover:text-red-600 disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                        Agregar
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

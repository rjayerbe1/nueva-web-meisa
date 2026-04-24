'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star, X } from 'lucide-react'

interface ProyectoItem {
  id: string
  titulo: string
  slug: string
  ubicacion: string
  visible: boolean
  destacado: boolean
  toneladas: number | null
  imagenes: { url: string; urlOptimized: string | null; alt: string }[]
}

interface Props {
  categoriaId: string
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function CasosExitoPicker({
  categoriaId,
  value,
  onChange,
  disabled,
}: Props) {
  const [proyectos, setProyectos] = useState<ProyectoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancel = false
    setLoading(true)
    setError(null)
    fetch(`/api/admin/categories/${categoriaId}/projects`)
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.json().catch(() => ({}))
          throw new Error(msg.error ?? `HTTP ${res.status}`)
        }
        const data = await res.json()
        if (!cancel) setProyectos(data)
      })
      .catch((e) => {
        if (!cancel) setError(e.message ?? 'Error cargando proyectos')
      })
      .finally(() => {
        if (!cancel) setLoading(false)
      })
    return () => {
      cancel = true
    }
  }, [categoriaId])

  const selected = value ?? []
  const selectedSet = new Set(selected)

  const toggle = (id: string) => {
    if (disabled) return
    if (selectedSet.has(id)) {
      onChange(selected.filter((x) => x !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const move = (id: string, dir: -1 | 1) => {
    if (disabled) return
    const idx = selected.indexOf(id)
    if (idx < 0) return
    const target = idx + dir
    if (target < 0 || target >= selected.length) return
    const copy = [...selected]
    ;[copy[idx], copy[target]] = [copy[target], copy[idx]]
    onChange(copy)
  }

  const visibles = proyectos.filter((p) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      p.titulo.toLowerCase().includes(q) ||
      p.ubicacion.toLowerCase().includes(q)
    )
  })

  const seleccionadosOrdenados = selected
    .map((id) => proyectos.find((p) => p.id === id))
    .filter(Boolean) as ProyectoItem[]

  return (
    <div className="md:col-span-2">
      <label className="mb-1 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
        Selección
      </label>
      <p className="mb-3 font-lato text-xs text-slate-500">
        Marca los proyectos que quieres resaltar. Se guardan en el campo{" "}
        <code className="font-mono text-[11px] text-slate-600">casosExitoIds</code>.
      </p>

      {loading && (
        <p className="rounded-none border border-slate-200 bg-white px-4 py-6 text-center font-lato text-xs text-slate-500">
          Cargando proyectos…
        </p>
      )}

      {error && (
        <p className="rounded-none border border-red-200 bg-red-50 px-4 py-3 font-lato text-xs text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* Seleccionados (ordenables) */}
          {seleccionadosOrdenados.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Seleccionados ({seleccionadosOrdenados.length}) · orden visible
                en la página
              </p>
              <ol className="space-y-2">
                {seleccionadosOrdenados.map((p, idx) => {
                  const thumb = p.imagenes[0]?.urlOptimized || p.imagenes[0]?.url
                  return (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 rounded-none border border-slate-200 bg-white px-3 py-2"
                    >
                      <span className="font-bebas text-lg leading-none text-red-600">
                        {String(idx + 1).padStart(2, '0')}
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
                          {!p.visible && (
                            <span className="ml-2 text-amber-600">
                              · oculto
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => move(p.id, -1)}
                          disabled={disabled || idx === 0}
                          className="flex h-6 w-6 items-center justify-center text-[10px] text-slate-400 transition-colors hover:text-slate-900 disabled:opacity-30"
                          aria-label="Subir"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => move(p.id, 1)}
                          disabled={
                            disabled ||
                            idx === seleccionadosOrdenados.length - 1
                          }
                          className="flex h-6 w-6 items-center justify-center text-[10px] text-slate-400 transition-colors hover:text-slate-900 disabled:opacity-30"
                          aria-label="Bajar"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => toggle(p.id)}
                          disabled={disabled}
                          className="flex h-6 w-6 items-center justify-center text-slate-400 transition-colors hover:text-red-600 disabled:opacity-30"
                          aria-label="Quitar"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}

          {/* Lista completa con checkbox */}
          {proyectos.length === 0 ? (
            <p className="rounded-none border border-dashed border-slate-300 bg-white px-4 py-6 text-center font-lato text-xs text-slate-500">
              No hay proyectos en esta categoría.
            </p>
          ) : (
            <>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título o ubicación…"
                className="mb-2 w-full rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                disabled={disabled}
              />
              <div className="max-h-80 overflow-y-auto rounded-none border border-slate-200 bg-white">
                <ul className="divide-y divide-slate-100">
                  {visibles.map((p) => {
                    const isSelected = selectedSet.has(p.id)
                    const thumb =
                      p.imagenes[0]?.urlOptimized || p.imagenes[0]?.url
                    return (
                      <li key={p.id}>
                        <label
                          className={`flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors ${
                            isSelected
                              ? 'bg-red-50'
                              : 'hover:bg-stone-50'
                          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggle(p.id)}
                            disabled={disabled}
                            className="h-4 w-4 rounded-none border-slate-300 text-red-600 focus:ring-red-600"
                          />
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
                              {isSelected && (
                                <Star
                                  className="ml-2 inline h-3 w-3 fill-red-600 text-red-600"
                                  aria-label="destacado"
                                />
                              )}
                            </p>
                            <p className="truncate font-lato text-[11px] text-slate-500">
                              {p.ubicacion}
                              {!p.visible && (
                                <span className="ml-2 text-amber-600">
                                  · oculto
                                </span>
                              )}
                              {p.toneladas && (
                                <span className="ml-2">
                                  ·{' '}
                                  {Math.round(p.toneladas).toLocaleString(
                                    'es-CO',
                                  )}{' '}
                                  ton
                                </span>
                              )}
                            </p>
                          </div>
                        </label>
                      </li>
                    )
                  })}
                  {visibles.length === 0 && (
                    <li className="px-3 py-4 text-center font-lato text-xs text-slate-500">
                      No hay resultados para "{query}".
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

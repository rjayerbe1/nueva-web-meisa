'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star, X } from 'lucide-react'

interface ObraItem {
  id: string
  slug: string
  titulo: string
  resumenCorto: string | null
  activa: boolean
  destacada: boolean
  imagenDestacada: string | null
  _count: { proyectos: number }
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
  const [obras, setObras] = useState<ObraItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancel = false
    setLoading(true)
    setError(null)
    fetch(`/api/admin/categories/${categoriaId}/obras`)
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.json().catch(() => ({}))
          throw new Error(msg.error ?? `HTTP ${res.status}`)
        }
        const data = await res.json()
        if (!cancel) setObras(data)
      })
      .catch((e) => {
        if (!cancel) setError(e.message ?? 'Error cargando obras')
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

  const visibles = obras.filter((o) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      o.titulo.toLowerCase().includes(q) ||
      (o.resumenCorto ?? '').toLowerCase().includes(q)
    )
  })

  const seleccionadasOrdenadas = selected
    .map((id) => obras.find((o) => o.id === id))
    .filter(Boolean) as ObraItem[]

  return (
    <div className="md:col-span-2">
      <label className="mb-1 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
        Selección
      </label>
      <p className="mb-3 font-lato text-xs text-slate-500">
        Marca las obras que quieres resaltar en esta categoría. Se guardan en el
        campo <code className="font-mono text-[11px] text-slate-600">casosExitoIds</code>. Los proyectos de esas obras aparecen primero en el grid con el eyebrow rojo <strong>"Destacado"</strong>.
      </p>

      {loading && (
        <p className="rounded-none border border-slate-200 bg-white px-4 py-6 text-center font-lato text-xs text-slate-500">
          Cargando obras…
        </p>
      )}

      {error && (
        <p className="rounded-none border border-red-200 bg-red-50 px-4 py-3 font-lato text-xs text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {seleccionadasOrdenadas.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Seleccionadas ({seleccionadasOrdenadas.length}) · orden visible
                en la página
              </p>
              <ol className="space-y-2">
                {seleccionadasOrdenadas.map((o, idx) => (
                  <li
                    key={o.id}
                    className="flex items-center gap-3 rounded-none border border-slate-200 bg-white px-3 py-2"
                  >
                    <span className="font-bebas text-lg leading-none text-red-600">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {o.imagenDestacada ? (
                      <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden border border-slate-200 bg-slate-100">
                        <Image
                          src={o.imagenDestacada}
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
                        {o.titulo}
                      </p>
                      <p className="truncate font-lato text-[11px] text-slate-500">
                        {o._count.proyectos}{' '}
                        {o._count.proyectos === 1 ? 'proyecto' : 'proyectos'}
                        {!o.activa && (
                          <span className="ml-2 text-amber-600">
                            · inactiva
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(o.id, -1)}
                        disabled={disabled || idx === 0}
                        className="flex h-6 w-6 items-center justify-center text-[10px] text-slate-400 transition-colors hover:text-slate-900 disabled:opacity-30"
                        aria-label="Subir"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => move(o.id, 1)}
                        disabled={
                          disabled ||
                          idx === seleccionadasOrdenadas.length - 1
                        }
                        className="flex h-6 w-6 items-center justify-center text-[10px] text-slate-400 transition-colors hover:text-slate-900 disabled:opacity-30"
                        aria-label="Bajar"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => toggle(o.id)}
                        disabled={disabled}
                        className="flex h-6 w-6 items-center justify-center text-slate-400 transition-colors hover:text-red-600 disabled:opacity-30"
                        aria-label="Quitar"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {obras.length === 0 ? (
            <p className="rounded-none border border-dashed border-slate-300 bg-white px-4 py-6 text-center font-lato text-xs text-slate-500">
              No hay obras en esta categoría. Crea una en{' '}
              <a
                href="/admin/obras"
                className="font-semibold text-red-600 hover:underline"
              >
                /admin/obras
              </a>
              .
            </p>
          ) : (
            <>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar obra por título o resumen…"
                className="mb-2 w-full rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                disabled={disabled}
              />
              <div className="max-h-80 overflow-y-auto rounded-none border border-slate-200 bg-white">
                <ul className="divide-y divide-slate-100">
                  {visibles.map((o) => {
                    const isSelected = selectedSet.has(o.id)
                    return (
                      <li key={o.id}>
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
                            onChange={() => toggle(o.id)}
                            disabled={disabled}
                            className="h-4 w-4 rounded-none border-slate-300 text-red-600 focus:ring-red-600"
                          />
                          {o.imagenDestacada ? (
                            <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden border border-slate-200 bg-slate-100">
                              <Image
                                src={o.imagenDestacada}
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
                              {o.titulo}
                              {isSelected && (
                                <Star
                                  className="ml-2 inline h-3 w-3 fill-red-600 text-red-600"
                                  aria-label="destacada"
                                />
                              )}
                            </p>
                            <p className="truncate font-lato text-[11px] text-slate-500">
                              {o._count.proyectos}{' '}
                              {o._count.proyectos === 1 ? 'proyecto' : 'proyectos'} agrupado
                              {o._count.proyectos === 1 ? '' : 's'}
                              {!o.activa && (
                                <span className="ml-2 text-amber-600">
                                  · inactiva
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

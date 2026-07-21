"use client"

import { useState } from "react"
import { Check, Copy, Loader2, Plus, Power, Trash2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CodigoReferidoSer } from "./types"

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
  const [nombreNuevo, setNombreNuevo] = useState("")
  const [creando, setCreando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const crear = async () => {
    if (!nombreNuevo.trim()) return
    setCreando(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/talento/referidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreEmpleado: nombreNuevo.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error creando el código")
      setItems((prev) => [
        { ...data, totalReferidos: 0, totalContratados: 0 },
        ...prev,
      ])
      setNombreNuevo("")
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
          Crea un código por colaborador y compártelo para que lo pase a quien quiera referir.
          El candidato lo ingresa él mismo al aplicar en la web — el código solo sirve para
          rastrear el incentivo (bonificación ocasional, no afecta la evaluación por mérito
          del candidato).
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            value={nombreNuevo}
            onChange={(e) => setNombreNuevo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && crear()}
            placeholder="Nombre del colaborador (ej: Juan Pérez)"
            className="min-w-[220px] flex-1 rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
          />
          <button
            onClick={crear}
            disabled={creando || !nombreNuevo.trim()}
            className="inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {creando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Generar código
          </button>
        </div>
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
            Aún no hay códigos. Escribe el nombre de un colaborador arriba para generar el primero.
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
                  <td className="px-3 py-2.5 font-lato text-sm font-semibold text-slate-900">
                    {c.nombreEmpleado}
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

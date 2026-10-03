"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { CANALES_PUBLICACION } from "./constants"
import { useTalento } from "./TalentoStore"
import { VacanteIAPanel } from "./VacanteIAPanel"
import { fechaCorta, tieneSpe } from "./utils"
import type { PublicacionSer } from "./types"

const INPUT =
  "h-9 w-full border border-slate-300 bg-white px-2.5 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"

/**
 * Dónde se publicó la vacante. La fila del SPE es la constancia del registro
 * obligatorio (Ley 1636/2013 art. 31, 10 días hábiles); por eso se avisa arriba
 * en rojo mientras no exista.
 */
export function PublicacionVacante({ vacanteId }: { vacanteId: string }) {
  const { publicaciones, setPublicaciones, vacantes, vacantePorId, avisar } = useTalento()
  const vacante = vacantePorId.get(vacanteId)
  const lista = publicaciones.filter((p) => p.vacanteId === vacanteId)
  const spe = tieneSpe(vacanteId, publicaciones)
  const [form, setForm] = useState({ canal: "", url: "", referencia: "", fechaPublicacion: "", notas: "" })
  const [abierto, setAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const guardar = async () => {
    setGuardando(true)
    try {
      const res = await fetch("/api/admin/talento/publicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, vacanteId }),
      })
      const raw = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(raw.error ?? "No se pudo registrar")
      const nueva: PublicacionSer = {
        id: raw.id,
        vacanteId,
        vacanteTitulo: vacante?.titulo,
        canal: raw.canal,
        url: raw.url,
        referencia: raw.referencia,
        fechaPublicacion: raw.fechaPublicacion ? String(raw.fechaPublicacion).slice(0, 10) : null,
        fechaCierre: raw.fechaCierre ? String(raw.fechaCierre).slice(0, 10) : null,
        notas: raw.notas,
      }
      setPublicaciones((prev) => [nueva, ...prev])
      setForm({ canal: "", url: "", referencia: "", fechaPublicacion: "", notas: "" })
      setAbierto(false)
      avisar("ok", `Publicación en ${nueva.canal} registrada`)
    } catch (e) {
      avisar("error", (e as Error).message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (p: PublicacionSer) => {
    if (!confirm(`¿Quitar el registro de la publicación en ${p.canal}?`)) return
    const res = await fetch(`/api/admin/talento/publicaciones/${p.id}`, { method: "DELETE" })
    if (!res.ok) return avisar("error", "No se pudo quitar")
    setPublicaciones((prev) => prev.filter((x) => x.id !== p.id))
  }

  return (
    <div className="space-y-5">
      <div
        className={cn(
          "flex items-start gap-3 border px-4 py-3",
          spe ? "border-green-200 bg-green-50" : "border-red-300 bg-red-50",
        )}
      >
        {spe ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
        )}
        <div className="font-lato text-sm">
          {spe ? (
            <p className="text-green-800">
              <strong>Registrada en el Servicio Público de Empleo.</strong> Queda la constancia legal.
            </p>
          ) : (
            <>
              <p className="font-semibold text-red-800">Falta registrarla en el Servicio Público de Empleo (SPE).</p>
              <p className="mt-0.5 text-red-700">
                Es obligatorio dentro de los 10 días hábiles (Ley 1636/2013). Publicar solo en la web no cumple. Lo
                más fácil: SENA APE o Comfandi, ambos gratis. Al hacerlo, regístralo aquí con el canal «SPE».
              </p>
            </>
          )}
        </div>
      </div>

      <div className="border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
          <h3 className="font-bebas text-xl uppercase text-slate-950">Canales donde está publicada ({lista.length})</h3>
          <button
            type="button"
            onClick={() => setAbierto((x) => !x)}
            className="inline-flex items-center gap-1.5 bg-red-600 px-3 py-1.5 font-lato text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Registrar publicación
          </button>
        </div>

        {abierto && (
          <div className="grid gap-3 border-b border-slate-100 bg-stone-50 px-4 py-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="font-lato text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Canal *</span>
              <select
                value={form.canal}
                onChange={(e) => setForm((f) => ({ ...f, canal: e.target.value }))}
                className={INPUT}
              >
                <option value="">Elegir…</option>
                {CANALES_PUBLICACION.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-lato text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Fecha de publicación
              </span>
              <input
                type="date"
                value={form.fechaPublicacion}
                onChange={(e) => setForm((f) => ({ ...f, fechaPublicacion: e.target.value }))}
                className={INPUT}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-lato text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Enlace de la publicación
              </span>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://…"
                className={INPUT}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-lato text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Referencia / código del prestador
              </span>
              <input
                value={form.referencia}
                onChange={(e) => setForm((f) => ({ ...f, referencia: e.target.value }))}
                className={INPUT}
              />
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="font-lato text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Notas</span>
              <input
                value={form.notas}
                onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
                className={INPUT}
              />
            </label>
            <div className="flex justify-end gap-2 md:col-span-2">
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="border border-slate-300 bg-white px-3 py-1.5 font-lato text-xs font-bold uppercase tracking-wider text-slate-700 hover:border-slate-900"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!form.canal || guardando}
                onClick={guardar}
                className="inline-flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 font-lato text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {guardando && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Guardar
              </button>
            </div>
          </div>
        )}

        {lista.length === 0 ? (
          <p className="px-4 py-6 font-lato text-sm text-slate-500">
            Aún no hay publicaciones registradas. Las postulaciones de hoy llegan solo por la página web.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {lista.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span
                  className={cn(
                    "border px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider",
                    p.canal.startsWith("SPE")
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-slate-200 bg-stone-50 text-slate-600",
                  )}
                >
                  {CANALES_PUBLICACION.find((c) => c.value === p.canal)?.label ?? p.canal}
                </span>
                <span className="font-lato text-sm text-slate-600">{fechaCorta(p.fechaPublicacion)}</span>
                {p.referencia && <span className="font-lato text-xs text-slate-500">Ref. {p.referencia}</span>}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-lato text-xs font-semibold text-blue-700 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver
                  </a>
                )}
                {p.notas && <span className="font-lato text-xs italic text-slate-400">{p.notas}</span>}
                <button
                  type="button"
                  onClick={() => eliminar(p)}
                  title="Quitar"
                  className="ml-auto flex h-7 w-7 items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <VacanteIAPanel vacantes={vacantes} vacanteFija={vacanteId} />
    </div>
  )
}

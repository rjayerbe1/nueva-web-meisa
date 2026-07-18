"use client"

import { useState } from "react"
import { Check, Copy, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VacanteSer } from "./types"

type Herramientas = {
  lint: Array<{ gravedad: "error" | "aviso"; texto: string }>
  textos: Record<string, string>
}

const CANAL_LABEL: Record<string, string> = {
  spe: "SPE (SENA / Caja de Compensación)",
  magneto: "Magneto",
  computrabajo: "Computrabajo",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
}

/**
 * Generador IA de textos de publicación por canal + lint legal de la oferta.
 * Los textos se copian y pegan en cada bolsa (no hay APIs públicas gratuitas
 * de publicación); el lint avisa si el texto viola Ley 931/2004, 2114/2021,
 * 1861/2017 o Decreto 1543/1997 ANTES de publicar.
 */
export function VacanteIAPanel({ vacantes }: { vacantes: VacanteSer[] }) {
  const [vacanteId, setVacanteId] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Herramientas | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const generar = async () => {
    if (!vacanteId) return
    setBusy(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/admin/talento/ia/vacante-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vacanteId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error generando textos")
      setResult(data)
    } catch (e: any) {
      setError(e.message ?? "Error generando textos")
    } finally {
      setBusy(false)
    }
  }

  const copiar = async (key: string, texto: string) => {
    await navigator.clipboard.writeText(texto)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-4">
        <Sparkles className="h-4 w-4 flex-shrink-0 text-blue-700" />
        <div className="min-w-0 flex-1">
          <h3 className="font-bebas text-xl uppercase leading-tight text-slate-950">
            Asistente de publicación
          </h3>
          <p className="font-lato text-xs text-slate-500">
            Genera el texto de la oferta para cada canal y revisa que cumpla la ley (edad,
            género, libreta militar, embarazo…) antes de publicar.
          </p>
        </div>
        <select
          value={vacanteId}
          onChange={(e) => setVacanteId(e.target.value)}
          className="rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
          aria-label="Vacante"
        >
          <option value="">Elegir vacante…</option>
          {vacantes.map((v) => (
            <option key={v.id} value={v.id}>
              {v.titulo}
            </option>
          ))}
        </select>
        <button
          onClick={generar}
          disabled={busy || !vacanteId}
          className="inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          Generar textos + lint
        </button>
      </div>

      {error && (
        <div className="mx-5 mt-4 rounded-none border border-red-300 bg-red-100 px-3 py-2 font-lato text-sm text-red-800">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-5 px-5 py-5">
          {/* Lint legal */}
          <div>
            <p className="mb-2 font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
              Revisión legal de la oferta
            </p>
            {result.lint.length === 0 ? (
              <p className="inline-flex items-center gap-1.5 rounded-none border border-green-200 bg-green-50 px-3 py-1.5 font-lato text-sm text-green-700">
                <Check className="h-4 w-4" />
                Sin alertas: la oferta no exige edad, sexo, libreta militar ni otros
                requisitos prohibidos.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {result.lint.map((l, i) => (
                  <li
                    key={i}
                    className={cn(
                      "rounded-none border px-3 py-2 font-lato text-sm",
                      l.gravedad === "error"
                        ? "border-red-300 bg-red-50 text-red-800"
                        : "border-amber-300 bg-amber-50 text-amber-800",
                    )}
                  >
                    <strong className="uppercase">
                      {l.gravedad === "error" ? "Ilegal" : "Aviso"}:
                    </strong>{" "}
                    {l.texto}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Textos por canal */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Object.entries(result.textos).map(([key, texto]) => (
              <div key={key} className="flex flex-col rounded-md border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 bg-stone-50 px-3 py-2">
                  <span className="font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
                    {CANAL_LABEL[key] ?? key}
                  </span>
                  <button
                    onClick={() => copiar(key, texto)}
                    className="inline-flex items-center gap-1 rounded-none border border-slate-300 bg-white px-2 py-1 font-lato text-[10px] font-bold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900"
                  >
                    {copiedKey === key ? (
                      <>
                        <Check className="h-3 w-3 text-green-600" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={texto}
                  rows={key === "whatsapp" ? 5 : 10}
                  className="w-full resize-y bg-white px-3 py-2 font-lato text-xs leading-relaxed text-slate-800 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <p className="font-lato text-[10px] uppercase tracking-wide text-slate-400">
            Textos generados por IA — revisa antes de publicar. Registra cada publicación
            abajo (la fila del canal SPE es tu constancia legal).
          </p>
        </div>
      )}
    </div>
  )
}

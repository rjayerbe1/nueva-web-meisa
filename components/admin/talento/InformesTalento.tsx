"use client"

import { useState } from "react"
import { ChevronDown, FileDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { PERIODOS_INFORME, tieneMatriz } from "./constants"
import type { VacanteSer } from "./types"

/*
 * Los informes se abren en una pestaña nueva y el navegador los guarda como PDF
 * (Cloud Run no trae Chrome para generarlos en el servidor). Hasta sep-2026 el
 * único acceso era un botón que solo aparecía al filtrar el Pipeline por una
 * vacante, y Talento Humano no lo encontraba. Ahora hay tres puertas, todas con
 * este mismo componente: la cabecera de la página, cada fila de Vacantes y el
 * filtro del Pipeline.
 */

const AYUDA_PDF = "Se abre en una pestaña nueva: en Destino elige «Guardar como PDF»."

const urlVacante = (id: string) => `/api/admin/talento/informe/${id}`

/** Por qué no se puede sacar el informe de una vacante, o null si sí se puede. */
export function motivoSinInforme(v: Pick<VacanteSer, "criteriosEvaluacion" | "postulacionesCount">) {
  if (!tieneMatriz(v.criteriosEvaluacion))
    return "Falta la matriz de evaluación: defínela editando la vacante"
  // === 0 y no falsy: la respuesta del PUT de la vacante no trae el conteo, y
  // tras editar la matriz el botón no debe apagarse por un dato que no llegó.
  if (v.postulacionesCount === 0) return "Todavía no tiene postulaciones"
  return null
}

const BTN =
  "inline-flex items-center gap-2 rounded-none border px-3 py-2 font-lato text-xs font-bold uppercase tracking-wide transition-colors"

/** Botón de informe de UNA vacante. Deshabilitado con el motivo cuando no aplica. */
export function InformeVacanteBoton({
  vacante,
  compacto = false,
}: {
  vacante: Pick<VacanteSer, "id" | "titulo" | "criteriosEvaluacion" | "postulacionesCount">
  compacto?: boolean
}) {
  const motivo = motivoSinInforme(vacante)
  const clase = cn(
    BTN,
    compacto && "px-2 py-1 text-[10px]",
    motivo
      ? "cursor-not-allowed border-slate-200 bg-white text-slate-400"
      : "border-slate-900 bg-slate-900 text-white hover:bg-slate-700",
  )
  const icono = <FileDown className={compacto ? "h-3 w-3" : "h-3.5 w-3.5"} />
  if (motivo) {
    return (
      <span className={clase} title={motivo} aria-disabled="true">
        {icono}
        Informe PDF
      </span>
    )
  }
  return (
    <a
      href={urlVacante(vacante.id)}
      target="_blank"
      rel="noopener noreferrer"
      className={clase}
      title={`Informe de evaluación de ${vacante.titulo}. ${AYUDA_PDF}`}
    >
      {icono}
      Informe PDF
    </a>
  )
}

/** Barra de informes de la cabecera de Talento Humano: general + por vacante. */
export function InformesTalento({ vacantes }: { vacantes: VacanteSer[] }) {
  const [dias, setDias] = useState(30)
  const vigentes = vacantes.filter((v) => v.estado === "ABIERTA" || v.estado === "PAUSADA")

  return (
    <div className="flex flex-col items-start gap-1.5 md:items-end">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-stretch">
          <select
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
            aria-label="Periodo del informe general"
            className="rounded-none border border-r-0 border-slate-300 bg-white px-2 py-2 font-lato text-xs font-semibold text-slate-700 focus:border-red-600 focus:outline-none"
          >
            {PERIODOS_INFORME.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <a
            href={`/api/admin/talento/informe/general?dias=${dias}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Todas las vacantes y las hojas de vida recibidas. ${AYUDA_PDF}`}
            className={cn(BTN, "border-red-600 bg-red-600 text-white hover:bg-red-700")}
          >
            <FileDown className="h-3.5 w-3.5" />
            Informe general
          </a>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(BTN, "border-slate-900 bg-white text-slate-900 hover:bg-stone-100")}
          >
            <FileDown className="h-3.5 w-3.5" />
            Informe por vacante
            <ChevronDown className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-none">
            <DropdownMenuLabel className="font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Evaluación de candidatos por cargo
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {vigentes.length === 0 && (
              <p className="px-2 py-3 font-lato text-xs text-slate-500">
                No hay vacantes abiertas ni pausadas.
              </p>
            )}
            {vigentes.map((v) => {
              const motivo = motivoSinInforme(v)
              return motivo ? (
                <DropdownMenuItem key={v.id} disabled className="flex-col items-start gap-0">
                  <span className="font-lato text-sm font-semibold">{v.titulo}</span>
                  <span className="font-lato text-[11px]">{motivo}</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem key={v.id} asChild className="cursor-pointer">
                  <a
                    href={urlVacante(v.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="font-lato text-sm font-semibold text-slate-900">
                      {v.titulo}
                      {v.estado === "PAUSADA" && (
                        <span className="ml-1.5 font-normal text-slate-400">(pausada)</span>
                      )}
                    </span>
                    <span className="font-lato text-[11px] text-slate-500">
                      {v.postulacionesCount} postulaciones
                    </span>
                  </a>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="font-lato text-[11px] text-slate-500">{AYUDA_PDF}</p>
    </div>
  )
}

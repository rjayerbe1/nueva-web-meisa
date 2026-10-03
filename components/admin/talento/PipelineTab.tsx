"use client"

import { useMemo, useState } from "react"
import { ArrowRight, ChevronDown, Clock, Loader2, StickyNote, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ETAPAS, ETAPAS_ACTIVAS, ETAPA_ESTILO, ETAPA_LABEL, etapaSiguiente } from "./constants"
import { InformeVacanteBoton } from "./InformesTalento"
import { useTalento } from "./TalentoStore"
import { diasDesde, haceDias, scoreColor, type CambioEtapa } from "./utils"
import type { PostulacionSer } from "./types"

const TODAS = "__todas__"
const ESPONTANEAS = "__espontanea__"

/** Días desde que entró a la etapa actual (último cambio del historial). */
function diasEnEtapa(p: PostulacionSer): number {
  const h = (Array.isArray(p.historial) ? p.historial : []) as CambioEtapa[]
  const ultimo = [...h].reverse().find((x) => x.a === p.etapa)
  return diasDesde(ultimo?.fecha ?? p.createdAt)
}

/**
 * Tablero de selección. Siempre arranca con UNA vacante: con todas mezcladas
 * eran 76 tarjetas en Recibida de cargos distintos y no se podía trabajar.
 * Contratadas y descartadas van plegadas abajo, porque ya no piden trabajo.
 */
export function PipelineTab({ vacanteFija }: { vacanteFija?: string }) {
  const { postulaciones, vacantes, param, navegar } = useTalento()

  const vigentes = useMemo(
    () =>
      vacantes
        .filter((v) => v.estado === "ABIERTA" || v.estado === "PAUSADA")
        .map((v) => ({
          v,
          activas: postulaciones.filter((p) => p.vacanteId === v.id && ETAPAS_ACTIVAS.includes(p.etapa)).length,
        }))
        .sort((a, b) => b.activas - a.activas),
    [vacantes, postulaciones],
  )
  const espontaneasActivas = postulaciones.filter(
    (p) => !p.vacanteId && ETAPAS_ACTIVAS.includes(p.etapa),
  ).length

  // ?vacante= se comparte con el filtro de Hojas de vida (así el contexto se
  // mantiene al cambiar de pestaña); un valor que acá no aplica cae al default.
  const pedido = param("vacante")
  const valido = pedido === TODAS || pedido === ESPONTANEAS || vacantes.some((v) => v.id === pedido)
  const elegido = vacanteFija ?? (valido ? pedido : vigentes[0]?.v.id || TODAS)
  const vacante = vacantes.find((v) => v.id === elegido) ?? null

  const filtradas = useMemo(() => {
    if (elegido === TODAS) return postulaciones
    if (elegido === ESPONTANEAS) return postulaciones.filter((p) => !p.vacanteId)
    return postulaciones.filter((p) => p.vacanteId === elegido)
  }, [postulaciones, elegido])

  const ordenar = (l: PostulacionSer[]) =>
    [...l].sort((a, b) => (b.scoreIA ?? -1) - (a.scoreIA ?? -1) || b.createdAt.localeCompare(a.createdAt))

  const listaPanel = useMemo(
    () => ETAPAS.flatMap((e) => ordenar(filtradas.filter((p) => p.etapa === e.value))).map((p) => p.candidatoId),
    [filtradas],
  )

  return (
    <div className="space-y-4">
      {!vacanteFija && (
        <div className="space-y-2">
          <p className="font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Elige la vacante
          </p>
          <div className="flex flex-wrap gap-1.5">
            {vigentes.map(({ v, activas }) => (
              <BotonVacante
                key={v.id}
                activo={elegido === v.id}
                onClick={() => navegar({ vacante: v.id })}
                titulo={v.titulo}
                n={activas}
                pausada={v.estado === "PAUSADA"}
              />
            ))}
            {espontaneasActivas > 0 && (
              <BotonVacante
                activo={elegido === ESPONTANEAS}
                onClick={() => navegar({ vacante: ESPONTANEAS })}
                titulo="Espontáneas"
                n={espontaneasActivas}
              />
            )}
            <BotonVacante
              activo={elegido === TODAS}
              onClick={() => navegar({ vacante: TODAS })}
              titulo="Todas juntas"
            />
          </div>
        </div>
      )}

      {vacante && !vacanteFija && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <p className="font-lato text-sm text-slate-600">
            <strong className="text-slate-950">{filtradas.length}</strong> postulaciones a{" "}
            <button
              type="button"
              onClick={() => navegar({ tab: "vacantes", ver: vacante.id }, { historial: true })}
              className="font-semibold text-slate-950 underline decoration-slate-300 hover:decoration-slate-900"
            >
              {vacante.titulo}
            </button>
          </p>
          <InformeVacanteBoton vacante={{ ...vacante, postulacionesCount: filtradas.length }} />
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2 xl:grid xl:grid-cols-4 xl:overflow-visible">
        {ETAPAS.filter((e) => ETAPAS_ACTIVAS.includes(e.value)).map((etapa) => {
          const columna = ordenar(filtradas.filter((p) => p.etapa === etapa.value))
          return (
            <div
              key={etapa.value}
              className={cn(
                "flex w-72 flex-shrink-0 flex-col border border-t-4 border-slate-200 bg-stone-100/70 xl:w-auto",
                ETAPA_ESTILO[etapa.value]?.borde,
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5">
                <span className="font-bebas text-lg uppercase tracking-wide text-slate-950">{etapa.label}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-lato text-[11px] font-semibold text-slate-600">
                  {columna.length}
                </span>
              </div>
              <div className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto p-2">
                {columna.length === 0 && (
                  <p className="px-2 py-6 text-center font-lato text-xs text-slate-400">Nadie en esta etapa</p>
                )}
                {columna.map((p) => (
                  <Tarjeta key={p.id} p={p} mostrarVacante={elegido === TODAS} lista={listaPanel} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Cerradas: plegadas */}
      <div className="grid gap-3 md:grid-cols-2">
        {["CONTRATADA", "DESCARTADA"].map((et) => (
          <Plegada
            key={et}
            etapa={et}
            items={ordenar(filtradas.filter((p) => p.etapa === et))}
            mostrarVacante={elegido === TODAS}
            lista={listaPanel}
          />
        ))}
      </div>

      <p className="font-lato text-xs text-slate-500">
        Clic en una persona para ver su hoja de vida y la evaluación. Cada cambio de etapa queda en el historial con
        fecha y usuario.
      </p>
    </div>
  )
}

function BotonVacante({
  activo,
  onClick,
  titulo,
  n,
  pausada,
}: {
  activo: boolean
  onClick: () => void
  titulo: string
  n?: number
  pausada?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 border px-3 py-1.5 font-lato text-sm transition-colors",
        activo
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-500",
      )}
    >
      <span className="font-semibold">{titulo}</span>
      {pausada && <span className={activo ? "text-white/60" : "text-slate-400"}>(pausada)</span>}
      {typeof n === "number" && (
        <span
          className={cn(
            "rounded-full px-1.5 text-[11px] font-bold",
            activo ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600",
          )}
        >
          {n}
        </span>
      )}
    </button>
  )
}

function Tarjeta({
  p,
  mostrarVacante,
  lista,
}: {
  p: PostulacionSer
  mostrarVacante: boolean
  lista: string[]
}) {
  const { abrirCandidato, actualizarPostulacion, ocupado } = useTalento()
  const sig = etapaSiguiente(p.etapa)
  const dias = diasEnEtapa(p)
  const quieta = p.etapa === "RECIBIDA" ? dias > 15 : dias > 21
  const guardando = ocupado(`post:${p.id}`)

  return (
    <div className="border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow">
      <button
        type="button"
        onClick={() => abrirCandidato(p.candidatoId, lista)}
        className="block w-full px-3 pb-2 pt-2.5 text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 font-lato text-sm font-semibold leading-snug text-slate-900 hover:text-red-600">
            {p.candidato.nombre}
          </p>
          {typeof p.scoreIA === "number" ? (
            <span
              className={cn("flex-shrink-0 px-1.5 py-0.5 font-lato text-xs font-bold", scoreColor(p.scoreIA))}
              title="Puntaje contra la matriz del cargo"
            >
              {p.scoreIA}
            </span>
          ) : (
            <span className="flex-shrink-0 font-lato text-[10px] text-slate-400" title="Aún sin evaluar">
              —
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate font-lato text-xs text-slate-500">
          {mostrarVacante ? (p.vacante?.titulo ?? "Espontánea") : (p.candidato.ciudad ?? "Ciudad sin dato")}
        </p>
        <p
          className={cn(
            "mt-1 inline-flex items-center gap-1 font-lato text-[10px] uppercase tracking-wide",
            quieta ? "font-bold text-amber-700" : "text-slate-400",
          )}
          title={quieta ? "Lleva mucho tiempo sin moverse" : undefined}
        >
          <Clock className="h-3 w-3" />
          {dias === 0 ? "hoy" : `${dias} ${dias === 1 ? "día" : "días"}`} en {ETAPA_LABEL[p.etapa]?.toLowerCase()}
          {p.notasInternas && <StickyNote className="ml-1 h-3 w-3 text-amber-600" />}
        </p>
      </button>
      <div className="flex border-t border-slate-100">
        {sig && (
          <button
            type="button"
            disabled={guardando}
            onClick={() => actualizarPostulacion(p.id, { etapa: sig })}
            className="flex flex-1 items-center justify-center gap-1 px-2 py-1.5 font-lato text-[10px] font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-900 hover:text-white disabled:opacity-50"
          >
            {guardando ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
            {ETAPA_LABEL[sig]}
          </button>
        )}
        <button
          type="button"
          disabled={guardando}
          onClick={() => actualizarPostulacion(p.id, { etapa: "DESCARTADA" })}
          title="Descartar"
          className="flex items-center justify-center border-l border-slate-100 px-2.5 py-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function Plegada({
  etapa,
  items,
  mostrarVacante,
  lista,
}: {
  etapa: string
  items: PostulacionSer[]
  mostrarVacante: boolean
  lista: string[]
}) {
  const { abrirCandidato } = useTalento()
  const [abierta, setAbierta] = useState(false)
  return (
    <div className={cn("border border-t-4 border-slate-200 bg-white", ETAPA_ESTILO[etapa]?.borde)}>
      <button
        type="button"
        onClick={() => setAbierta((x) => !x)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
      >
        <span className="font-bebas text-lg uppercase tracking-wide text-slate-950">
          {etapa === "CONTRATADA" ? "Contratadas" : "Descartadas"}{" "}
          <span className="font-lato text-sm text-slate-400">({items.length})</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", abierta && "rotate-180")} />
      </button>
      {abierta && (
        <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto border-t border-slate-100">
          {items.length === 0 && <li className="px-3 py-3 font-lato text-xs text-slate-400">Ninguna</li>}
          {items.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => abrirCandidato(p.candidatoId, lista)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-stone-50"
              >
                <span className="min-w-0 truncate font-lato text-sm text-slate-800">
                  {p.candidato.nombre}
                  {mostrarVacante && (
                    <span className="text-slate-400"> · {p.vacante?.titulo ?? "Espontánea"}</span>
                  )}
                </span>
                <span className="flex-shrink-0 font-lato text-[11px] text-slate-400">{haceDias(p.updatedAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

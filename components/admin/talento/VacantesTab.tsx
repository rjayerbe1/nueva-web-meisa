"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Inbox,
  Loader2,
  Pencil,
  Search,
  Send,
  UserPlus,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ComparativoVacante } from "./ComparativoVacante"
import { EtapaChip } from "./CandidatosTab"
import {
  ESTADO_VACANTE_ESTILO,
  ESTADOS_VACANTE,
  ETAPAS,
  ETAPAS_ACTIVAS,
  ETAPA_ESTILO,
  ETAPA_LABEL,
  etapaSiguiente,
  tieneMatriz,
} from "./constants"
import { InformeVacanteBoton } from "./InformesTalento"
import { PipelineTab } from "./PipelineTab"
import { PublicacionVacante } from "./PublicacionVacante"
import { useTalento } from "./TalentoStore"
import { diasDesde, fechaCorta, haceDias, normalizarBusqueda, scoreColor, tieneSpe, type CambioEtapa } from "./utils"
import type { PostulacionSer, VacanteSer } from "./types"

const estadoLabel = (e: string) => ESTADOS_VACANTE.find((x) => x.value === e)?.label ?? e

function diasEnEtapa(p: PostulacionSer): number {
  const h = (Array.isArray(p.historial) ? p.historial : []) as CambioEtapa[]
  const ultimo = [...h].reverse().find((x) => x.a === p.etapa)
  return diasDesde(ultimo?.fecha ?? p.createdAt)
}

/** Pestaña Vacantes: el tablero de inicio, o la ficha de una vacante con ?ver=<id>. */
export function VacantesTab() {
  const { param, vacantePorId } = useTalento()
  const ver = param("ver")
  const v = ver ? vacantePorId.get(ver) : undefined
  return v ? <VacanteDetalle vacante={v} /> : <TableroVacantes />
}

/* ───────────────────────── Tablero ───────────────────────── */

function TableroVacantes() {
  const { vacantes, postulaciones, publicaciones, candidatos, duplicados, navegar, postulacionesDe } = useTalento()
  const [verBorradores, setVerBorradores] = useState(false)
  const [verCerradas, setVerCerradas] = useState(false)

  const vigentes = vacantes.filter((v) => v.estado === "ABIERTA" || v.estado === "PAUSADA")
  const idsVigentes = new Set(vigentes.map((v) => v.id))
  const borradores = vacantes.filter((v) => v.estado === "BORRADOR")
  const cerradas = vacantes.filter((v) => v.estado === "CERRADA")

  const nuevasSemana = candidatos.filter((c) => diasDesde(c.createdAt) <= 7).length
  const sinRevisar = postulaciones.filter((p) => p.etapa === "RECIBIDA" && p.vacanteId && idsVigentes.has(p.vacanteId))
  const quietas = sinRevisar.filter((p) => diasEnEtapa(p) > 15).length
  const sinSpe = vigentes.filter((v) => v.estado === "ABIERTA" && !tieneSpe(v.id, publicaciones)).length
  const soloBanco = candidatos.filter((c) => !postulacionesDe(c.id).some((p) => p.vacanteId)).length

  const ordenadas = [...vigentes].sort((a, b) => {
    if (a.estado !== b.estado) return a.estado === "ABIERTA" ? -1 : 1
    const na = postulaciones.filter((p) => p.vacanteId === a.id && p.etapa === "RECIBIDA").length
    const nb = postulaciones.filter((p) => p.vacanteId === b.id && p.etapa === "RECIBIDA").length
    return nb - na
  })

  return (
    <div className="space-y-8">
      {/* Lo urgente */}
      <div className="grid grid-cols-2 gap-px border border-slate-200 bg-slate-200 md:grid-cols-5">
        <Indicador
          valor={nuevasSemana}
          titulo="Hojas de vida nuevas"
          detalle="en los últimos 7 días"
          onClick={() => navegar({ tab: "candidatos", dias: "7", vacante: null }, { historial: true })}
        />
        <Indicador
          valor={sinRevisar.length}
          titulo="Sin revisar"
          detalle="en Recibida, vacantes vigentes"
          tono={sinRevisar.length > 0 ? "atencion" : undefined}
          onClick={() => navegar({ tab: "pipeline", vacante: "__todas__" }, { historial: true })}
        />
        <Indicador
          valor={quietas}
          titulo="Quietas"
          detalle="más de 15 días en Recibida"
          tono={quietas > 0 ? "alerta" : undefined}
          onClick={() => navegar({ tab: "pipeline", vacante: "__todas__" }, { historial: true })}
        />
        <Indicador
          valor={sinSpe}
          titulo="Abiertas sin SPE"
          detalle="registro legal pendiente"
          tono={sinSpe > 0 ? "alerta" : undefined}
        />
        <Indicador
          valor={duplicados.size}
          titulo="Posibles duplicados"
          detalle="mismo correo, teléfono o nombre"
          onClick={() => navegar({ tab: "candidatos", revisar: "duplicados", vacante: null }, { historial: true })}
        />
      </div>

      {/* Vacantes vigentes */}
      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-bebas text-3xl uppercase leading-none text-slate-950">
            Vacantes abiertas <span className="text-slate-300">{vigentes.length}</span>
          </h2>
          <button
            type="button"
            onClick={() => navegar({ tab: "perfiles", editar: null }, { historial: true })}
            className="inline-flex items-center gap-1 font-lato text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900"
          >
            Crear o editar vacantes
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {ordenadas.length === 0 ? (
          <div className="border border-dashed border-slate-300 bg-white px-6 py-10 text-center font-lato text-sm text-slate-500">
            No hay vacantes abiertas. Abre una desde «Crear o editar vacantes» cambiando su estado a Abierta.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ordenadas.map((v) => (
              <TarjetaVacante key={v.id} v={v} />
            ))}
            <button
              type="button"
              onClick={() => navegar({ tab: "candidatos", vacante: "__ninguna__" }, { historial: true })}
              className="group flex flex-col justify-between border border-dashed border-slate-300 bg-white px-5 py-5 text-left transition-colors hover:border-slate-900"
            >
              <div>
                <Inbox className="mb-2 h-6 w-6 text-slate-300 group-hover:text-slate-500" />
                <p className="font-bebas text-2xl uppercase leading-tight text-slate-950">Banco sin vacante</p>
                <p className="mt-1 font-lato text-sm text-slate-500">
                  Hojas de vida espontáneas o de Drive que no están en ningún proceso. Revísalas antes de publicar:
                  puede que el candidato ya esté aquí.
                </p>
              </div>
              <p className="mt-4 font-lato text-sm text-slate-700">
                <strong className="text-2xl text-slate-950">{soloBanco}</strong> personas{" "}
                <ArrowRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </p>
            </button>
          </div>
        )}
      </section>

      {/* Borradores y cerradas */}
      <section className="space-y-3">
        <Plegable
          titulo="Perfiles de cargo internos (borradores)"
          n={borradores.length}
          ayuda="Cargos definidos que no se están buscando. Sirven para comparar el banco contra el perfil."
          abierto={verBorradores}
          onToggle={() => setVerBorradores((x) => !x)}
        >
          <ListaCompacta vacantes={borradores} />
        </Plegable>
        <Plegable
          titulo="Cerradas"
          n={cerradas.length}
          abierto={verCerradas}
          onToggle={() => setVerCerradas((x) => !x)}
        >
          <ListaCompacta vacantes={cerradas} />
        </Plegable>
      </section>
    </div>
  )
}

function Indicador({
  valor,
  titulo,
  detalle,
  tono,
  onClick,
}: {
  valor: number
  titulo: string
  detalle: string
  tono?: "atencion" | "alerta"
  onClick?: () => void
}) {
  const Comp = onClick ? "button" : "div"
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "bg-white px-4 py-4 text-left",
        onClick && "transition-colors hover:bg-stone-50",
      )}
    >
      <p
        className={cn(
          "font-bebas text-4xl leading-none",
          tono === "alerta" ? "text-red-600" : tono === "atencion" ? "text-amber-600" : "text-slate-950",
        )}
      >
        {valor}
      </p>
      <p className="mt-1 font-lato text-xs font-bold uppercase tracking-wider text-slate-700">{titulo}</p>
      <p className="font-lato text-[11px] text-slate-400">{detalle}</p>
    </Comp>
  )
}

function TarjetaVacante({ v }: { v: VacanteSer }) {
  const { postulaciones, publicaciones, navegar } = useTalento()
  const posts = postulaciones.filter((p) => p.vacanteId === v.id)
  const porEtapa = Object.fromEntries(ETAPAS.map((e) => [e.value, posts.filter((p) => p.etapa === e.value).length]))
  const enCurso = ETAPAS_ACTIVAS.reduce((s, e) => s + (porEtapa[e] ?? 0), 0)
  const nuevas = porEtapa.RECIBIDA ?? 0
  const mejor = [...posts]
    .filter((p) => p.etapa !== "DESCARTADA" && typeof p.scoreIA === "number")
    .sort((a, b) => (b.scoreIA ?? 0) - (a.scoreIA ?? 0))[0]
  const ultima = posts.reduce<string | null>((m, p) => (!m || p.createdAt > m ? p.createdAt : m), null)
  const spe = tieneSpe(v.id, publicaciones)
  const matriz = tieneMatriz(v.criteriosEvaluacion)
  const totalBarra = ["RECIBIDA", "PRESELECCION", "ENTREVISTA", "OFERTA", "CONTRATADA"].reduce(
    (s, e) => s + (porEtapa[e] ?? 0),
    0,
  )
  const abrir = () => navegar({ ver: v.id, sec: null, etapa: null }, { historial: true })

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={abrir}
      onKeyDown={(e) => e.key === "Enter" && abrir()}
      className="group flex cursor-pointer flex-col border border-slate-200 bg-white transition-all hover:border-slate-900 hover:shadow-md"
    >
      <div className="px-5 pt-5">
        <div className="mb-2 flex items-center gap-2">
          <span className={cn("border px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider", ESTADO_VACANTE_ESTILO[v.estado])}>
            {estadoLabel(v.estado)}
          </span>
          <span className="truncate font-lato text-xs text-slate-500">
            {[v.ciudad, v.area].filter(Boolean).join(" · ")}
          </span>
        </div>
        <h3 className="font-bebas text-[1.65rem] uppercase leading-[1.05] text-slate-950 group-hover:text-red-600">
          {v.titulo}
        </h3>

        <div className="mt-4 flex items-end gap-6">
          <div>
            <p className="font-bebas text-4xl leading-none text-slate-950">{enCurso}</p>
            <p className="font-lato text-[11px] uppercase tracking-wider text-slate-500">en proceso</p>
          </div>
          <div>
            <p className={cn("font-bebas text-4xl leading-none", nuevas > 0 ? "text-amber-600" : "text-slate-300")}>
              {nuevas}
            </p>
            <p className="font-lato text-[11px] uppercase tracking-wider text-slate-500">sin revisar</p>
          </div>
          {mejor && (
            <div className="min-w-0">
              <p className="flex items-center gap-1.5">
                <span className={cn("px-1.5 py-0.5 font-lato text-base font-bold leading-none", scoreColor(mejor.scoreIA!))}>
                  {mejor.scoreIA}
                </span>
              </p>
              <p className="mt-1 truncate font-lato text-[11px] uppercase tracking-wider text-slate-500" title={mejor.candidato.nombre}>
                mejor: {mejor.candidato.nombre.split(" ")[0]}
              </p>
            </div>
          )}
        </div>

        {/* Barra por etapa */}
        <div className="mt-4">
          <div className="flex h-2 w-full overflow-hidden bg-slate-100">
            {totalBarra > 0 &&
              ["RECIBIDA", "PRESELECCION", "ENTREVISTA", "OFERTA", "CONTRATADA"].map((e) =>
                porEtapa[e] ? (
                  <div
                    key={e}
                    className={ETAPA_ESTILO[e].barra}
                    style={{ width: `${(porEtapa[e] / totalBarra) * 100}%` }}
                    title={`${ETAPA_LABEL[e]}: ${porEtapa[e]}`}
                  />
                ) : null,
              )}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
            {["RECIBIDA", "PRESELECCION", "ENTREVISTA", "OFERTA", "CONTRATADA"].map((e) => (
              <span key={e} className="inline-flex items-center gap-1 font-lato text-[11px] text-slate-500">
                <span className={cn("h-1.5 w-1.5 rounded-full", ETAPA_ESTILO[e].punto)} />
                {ETAPA_LABEL[e]} {porEtapa[e] ?? 0}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 pb-4 pt-4">
        {(!spe || !matriz) && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {!spe && v.estado === "ABIERTA" && (
              <span className="inline-flex items-center gap-1 border border-red-200 bg-red-50 px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider text-red-700">
                <AlertTriangle className="h-3 w-3" />
                Sin registro SPE
              </span>
            )}
            {!matriz && (
              <span className="inline-flex items-center gap-1 border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Sin matriz de evaluación
              </span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="inline-flex items-center gap-1 font-lato text-[11px] text-slate-400">
            <Clock className="h-3 w-3" />
            {ultima ? `última postulación ${haceDias(ultima)}` : "sin postulaciones"}
          </span>
          <span className="inline-flex items-center gap-1 font-lato text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-red-600">
            Abrir <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  )
}

function Plegable({
  titulo,
  n,
  ayuda,
  abierto,
  onToggle,
  children,
}: {
  titulo: string
  n: number
  ayuda?: string
  abierto: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border border-slate-200 bg-white">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
        <div>
          <span className="font-bebas text-xl uppercase text-slate-950">
            {titulo} <span className="text-slate-300">{n}</span>
          </span>
          {ayuda && <p className="font-lato text-xs text-slate-500">{ayuda}</p>}
        </div>
        <ChevronDown className={cn("h-4 w-4 flex-shrink-0 text-slate-400 transition-transform", abierto && "rotate-180")} />
      </button>
      {abierto && <div className="border-t border-slate-100">{children}</div>}
    </div>
  )
}

function ListaCompacta({ vacantes }: { vacantes: VacanteSer[] }) {
  const { navegar, postulaciones } = useTalento()
  if (vacantes.length === 0) return <p className="px-4 py-3 font-lato text-sm text-slate-400">Ninguna</p>
  return (
    <ul className="divide-y divide-slate-100">
      {vacantes.map((v) => {
        const n = postulaciones.filter((p) => p.vacanteId === v.id).length
        return (
          <li key={v.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
            <button
              type="button"
              onClick={() => navegar({ ver: v.id, sec: null }, { historial: true })}
              className="min-w-0 flex-1 truncate text-left font-lato text-sm font-semibold text-slate-900 hover:text-red-600"
            >
              {v.titulo}
            </button>
            <span className="font-lato text-xs text-slate-500">{[v.area, v.ciudad].filter(Boolean).join(" · ")}</span>
            <span className="w-24 text-right font-lato text-xs text-slate-400">{n} postulaciones</span>
            {!tieneMatriz(v.criteriosEvaluacion) && (
              <span className="font-lato text-[10px] font-bold uppercase tracking-wider text-amber-700">sin matriz</span>
            )}
            <button
              type="button"
              onClick={() => navegar({ tab: "perfiles", editar: v.id }, { historial: true })}
              className="inline-flex items-center gap-1 font-lato text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              <Pencil className="h-3 w-3" />
              Editar
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/* ───────────────────────── Ficha de una vacante ───────────────────────── */

const SECCIONES = [
  { id: "postulados", label: "Postulados" },
  { id: "tablero", label: "Tablero" },
  { id: "comparativo", label: "Comparativo IA" },
  { id: "publicacion", label: "Publicación y SPE" },
  { id: "perfil", label: "Perfil del cargo" },
]

function VacanteDetalle({ vacante: v }: { vacante: VacanteSer }) {
  const { postulaciones, publicaciones, param, navegar, avisar } = useTalento()
  const sec = SECCIONES.some((s) => s.id === param("sec")) ? param("sec") : "postulados"
  const posts = postulaciones.filter((p) => p.vacanteId === v.id)
  const porEtapa = Object.fromEntries(ETAPAS.map((e) => [e.value, posts.filter((p) => p.etapa === e.value).length]))
  const spe = tieneSpe(v.id, publicaciones)
  const matriz = tieneMatriz(v.criteriosEvaluacion)
  const salario =
    v.salarioMin || v.salarioMax
      ? [v.salarioMin, v.salarioMax]
          .filter(Boolean)
          .map((n) => `$${(n as number).toLocaleString("es-CO")}`)
          .join(" – ")
      : null
  const urlPublica = `/trabaja-con-nosotros/${v.slug}`

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navegar({ ver: null, sec: null, etapa: null }, { historial: true })}
        className="inline-flex items-center gap-1.5 font-lato text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Todas las vacantes
      </button>

      {/* Cabecera */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={cn("border px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider", ESTADO_VACANTE_ESTILO[v.estado])}>
              {estadoLabel(v.estado)}
            </span>
            <span className="font-lato text-xs text-slate-500">
              {[v.ciudad, v.area, v.modalidad, v.tipoContrato].filter(Boolean).join(" · ")}
            </span>
          </div>
          <h2 className="font-bebas text-4xl uppercase leading-none text-slate-950 md:text-5xl">{v.titulo}</h2>
          <p className="mt-2 font-lato text-sm text-slate-500">
            {v.fechaPublicacion ? `Abierta desde ${fechaCorta(v.fechaPublicacion)}` : "Sin fecha de apertura"}
            {v.fechaCierre ? ` · cierra ${fechaCorta(v.fechaCierre)}` : ""}
            {salario ? ` · ${salario}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <InformeVacanteBoton vacante={{ ...v, postulacionesCount: posts.length }} />
          <button
            type="button"
            onClick={() => navegar({ tab: "perfiles", editar: v.id, ver: null, sec: null }, { historial: true })}
            className="inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 font-lato text-xs font-bold uppercase tracking-wide text-slate-700 hover:border-slate-900"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar vacante
          </button>
          {v.estado === "ABIERTA" && (
            <>
              <a
                href={urlPublica}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 font-lato text-xs font-bold uppercase tracking-wide text-slate-700 hover:border-slate-900"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ver en la web
              </a>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(`${window.location.origin}${urlPublica}`)
                  avisar("ok", "Enlace de la oferta copiado")
                }}
                title="Copiar el enlace público para mandarlo por WhatsApp"
                className="inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 font-lato text-xs font-bold uppercase tracking-wide text-slate-700 hover:border-slate-900"
              >
                <Copy className="h-3.5 w-3.5" />
                Copiar enlace
              </button>
            </>
          )}
        </div>
      </div>

      {(!spe && v.estado === "ABIERTA") || !matriz ? (
        <div className="flex flex-wrap gap-2">
          {!spe && v.estado === "ABIERTA" && (
            <button
              type="button"
              onClick={() => navegar({ sec: "publicacion" })}
              className="inline-flex items-center gap-1.5 border border-red-300 bg-red-50 px-3 py-1.5 font-lato text-xs font-semibold text-red-800 hover:border-red-600"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Falta el registro en el SPE (obligatorio) — registrarlo
            </button>
          )}
          {!matriz && (
            <button
              type="button"
              onClick={() => navegar({ tab: "perfiles", editar: v.id, ver: null, sec: null }, { historial: true })}
              className="inline-flex items-center gap-1.5 border border-amber-300 bg-amber-50 px-3 py-1.5 font-lato text-xs font-semibold text-amber-900 hover:border-amber-600"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Sin matriz de evaluación: la IA improvisa los pesos — definirla
            </button>
          )}
        </div>
      ) : null}

      {/* Contadores por etapa */}
      <div className="grid grid-cols-3 gap-px border border-slate-200 bg-slate-200 sm:grid-cols-6">
        {ETAPAS.map((e) => (
          <button
            key={e.value}
            type="button"
            onClick={() => navegar({ sec: "postulados", etapa: e.value })}
            className={cn(
              "border-t-4 bg-white px-3 py-3 text-left transition-colors hover:bg-stone-50",
              ETAPA_ESTILO[e.value].borde,
              sec === "postulados" && param("etapa") === e.value && "bg-stone-50",
            )}
          >
            <p className="font-bebas text-3xl leading-none text-slate-950">{porEtapa[e.value] ?? 0}</p>
            <p className="mt-0.5 font-lato text-[11px] font-bold uppercase tracking-wider text-slate-500">{e.label}</p>
          </button>
        ))}
      </div>

      {/* Secciones */}
      <div className="flex flex-wrap gap-0 border-b border-slate-200">
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => navegar({ sec: s.id === "postulados" ? null : s.id, etapa: null })}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 font-lato text-sm transition-colors",
              sec === s.id
                ? "border-slate-950 font-semibold text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900",
            )}
          >
            {s.label}
            {s.id === "publicacion" && !spe && v.estado === "ABIERTA" && (
              <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-red-600 align-middle" />
            )}
          </button>
        ))}
      </div>

      {sec === "postulados" && <Postulados vacante={v} posts={posts} />}
      {sec === "tablero" && <PipelineTab vacanteFija={v.id} />}
      {sec === "comparativo" && <ComparativoVacante vacanteId={v.id} />}
      {sec === "publicacion" && <PublicacionVacante vacanteId={v.id} />}
      {sec === "perfil" && <PerfilCargo vacante={v} />}
    </div>
  )
}

function Postulados({ vacante, posts }: { vacante: VacanteSer; posts: PostulacionSer[] }) {
  const { param, navegar, abrirCandidato, actualizarPostulacion, ocupado } = useTalento()
  const etapa = param("etapa")
  const [agregando, setAgregando] = useState(false)

  const filtrados = useMemo(() => {
    const base =
      etapa === "__todas__"
        ? posts
        : etapa
          ? posts.filter((p) => p.etapa === etapa)
          : posts.filter((p) => ETAPAS_ACTIVAS.includes(p.etapa))
    return [...base].sort((a, b) => (b.scoreIA ?? -1) - (a.scoreIA ?? -1) || b.createdAt.localeCompare(a.createdAt))
  }, [posts, etapa])
  const lista = filtrados.map((p) => p.candidatoId)

  const opciones = [
    { v: "", l: "En curso", n: posts.filter((p) => ETAPAS_ACTIVAS.includes(p.etapa)).length },
    ...ETAPAS.map((e) => ({ v: e.value, l: e.label, n: posts.filter((p) => p.etapa === e.value).length })),
    { v: "__todas__", l: "Todas", n: posts.length },
  ]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {opciones.map((o) => (
            <button
              key={o.v || "curso"}
              type="button"
              onClick={() => navegar({ etapa: o.v || null })}
              className={cn(
                "inline-flex items-center gap-1.5 border px-2.5 py-1 font-lato text-xs font-semibold transition-colors",
                etapa === o.v ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400",
              )}
            >
              {o.v && o.v !== "__todas__" && <span className={cn("h-2 w-2 rounded-full", ETAPA_ESTILO[o.v]?.punto)} />}
              {o.l} <span className={etapa === o.v ? "text-white/70" : "text-slate-400"}>{o.n}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setAgregando((x) => !x)}
          className="inline-flex items-center gap-1.5 border border-slate-900 bg-white px-3 py-1.5 font-lato text-xs font-bold uppercase tracking-wider text-slate-900 hover:bg-slate-900 hover:text-white"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Traer del banco
        </button>
      </div>

      {agregando && <TraerDelBanco vacante={vacante} onCerrar={() => setAgregando(false)} />}

      {filtrados.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <Users className="mx-auto mb-2 h-8 w-8 text-slate-300" />
          <p className="font-lato text-sm text-slate-500">
            {posts.length === 0
              ? "Todavía nadie se ha postulado. Comparte el enlace de la oferta o trae personas del banco."
              : "Nadie en este grupo."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 bg-stone-50">
                {["Puntaje", "Persona", "Etapa", "Se postuló", ""].map((h, i) => (
                  <th
                    key={i}
                    className="px-3 py-2.5 text-left font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => {
                const sig = etapaSiguiente(p.etapa)
                const dias = diasEnEtapa(p)
                return (
                  <tr
                    key={p.id}
                    onClick={() => abrirCandidato(p.candidatoId, lista)}
                    className="group cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-stone-50"
                  >
                    <td className="w-20 px-3 py-3">
                      {typeof p.scoreIA === "number" ? (
                        <span className={cn("inline-block min-w-[2.25rem] px-1.5 py-1 text-center font-lato text-sm font-bold", scoreColor(p.scoreIA))}>
                          {p.scoreIA}
                        </span>
                      ) : (
                        <span className="font-lato text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-lato text-sm font-semibold text-slate-900 group-hover:text-red-600">
                        {p.candidato.nombre}
                      </p>
                      <p className="font-lato text-xs text-slate-500">
                        {p.candidato.ciudad ?? "—"}
                        {p.candidato.telefono ? ` · ${p.candidato.telefono}` : ""}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <EtapaChip etapa={p.etapa} />
                      {ETAPAS_ACTIVAS.includes(p.etapa) && (
                        <p className={cn("mt-0.5 font-lato text-[11px]", dias > 15 ? "font-semibold text-amber-700" : "text-slate-400")}>
                          {dias === 0 ? "desde hoy" : `hace ${dias} días`}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-lato text-xs text-slate-500">{haceDias(p.createdAt)}</td>
                    <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {sig && (
                          <button
                            type="button"
                            disabled={ocupado(`post:${p.id}`)}
                            onClick={() => actualizarPostulacion(p.id, { etapa: sig })}
                            className="inline-flex items-center gap-1 border border-slate-200 bg-white px-2 py-1 font-lato text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-50"
                          >
                            {ocupado(`post:${p.id}`) ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
                            {ETAPA_LABEL[sig]}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => abrirCandidato(p.candidatoId, lista)}
                          className="inline-flex items-center gap-0.5 px-1 font-lato text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-red-600"
                        >
                          Abrir
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function TraerDelBanco({ vacante, onCerrar }: { vacante: VacanteSer; onCerrar: () => void }) {
  const { candidatos, postulacionesDe, postular, ocupado, abrirCandidato } = useTalento()
  const [q, setQ] = useState(vacante.titulo.split(" ")[0] ?? "")
  const resultados = useMemo(() => {
    const qn = normalizarBusqueda(q)
    return candidatos
      .filter((c) => !postulacionesDe(c.id).some((p) => p.vacanteId === vacante.id))
      .filter(
        (c) =>
          !qn ||
          [c.nombre, c.ciudad, c.areaInteres, c.resumenIA, c.cvFileName]
            .filter(Boolean)
            .some((v) => normalizarBusqueda(String(v)).includes(qn)),
      )
      .slice(0, 25)
  }, [candidatos, postulacionesDe, vacante.id, q])

  return (
    <div className="border border-slate-900 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="font-bebas text-xl uppercase text-slate-950">Traer personas del banco</p>
          <p className="font-lato text-xs text-slate-500">
            Busca por oficio, ciudad o nombre. Al enviarla entra en Recibida y se evalúa contra la matriz del cargo.
          </p>
        </div>
        <button type="button" onClick={onCerrar} className="font-lato text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900">
          Cerrar
        </button>
      </div>
      <div className="px-4 py-3">
        <label className="relative block max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
            placeholder="soldador, Jamundí, Tekla…"
            className="h-9 w-full border border-slate-300 bg-white pl-9 pr-3 font-lato text-sm text-slate-900 focus:border-red-600 focus:outline-none"
          />
        </label>
        <ul className="mt-3 max-h-80 divide-y divide-slate-100 overflow-y-auto border border-slate-100">
          {resultados.length === 0 && <li className="px-3 py-4 font-lato text-sm text-slate-400">Nadie coincide.</li>}
          {resultados.map((c) => (
            <li key={c.id} className="flex items-center gap-3 px-3 py-2">
              <button
                type="button"
                onClick={() => abrirCandidato(c.id, resultados.map((x) => x.id))}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate font-lato text-sm font-semibold text-slate-900 hover:text-red-600">{c.nombre}</p>
                <p className="truncate font-lato text-xs text-slate-500">
                  {[c.areaInteres, c.ciudad, haceDias(c.createdAt)].filter(Boolean).join(" · ")}
                </p>
              </button>
              <button
                type="button"
                disabled={ocupado(`postular:${c.id}`)}
                onClick={() => postular(c.id, vacante.id)}
                className="inline-flex flex-shrink-0 items-center gap-1 bg-slate-900 px-2.5 py-1.5 font-lato text-[10px] font-bold uppercase tracking-wider text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {ocupado(`postular:${c.id}`) ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                Enviar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PerfilCargo({ vacante: v }: { vacante: VacanteSer }) {
  const { navegar } = useTalento()
  const criterios = (Array.isArray(v.criteriosEvaluacion) ? v.criteriosEvaluacion : []) as Array<{
    nombre?: string
    peso?: number
    guia?: string
  }>
  const suma = criterios.reduce((s, c) => s + (Number(c.peso) || 0), 0)
  const Bloque = ({ titulo, items }: { titulo: string; items: string[] }) =>
    items.length ? (
      <div>
        <h4 className="mb-1.5 font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{titulo}</h4>
        <ul className="list-disc space-y-1 pl-5 font-lato text-sm text-slate-800">
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    ) : null

  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-5 border border-slate-200 bg-white px-5 py-5">
        {v.descripcion ? (
          <p className="whitespace-pre-line font-lato text-sm leading-relaxed text-slate-800">{v.descripcion}</p>
        ) : (
          <p className="font-lato text-sm italic text-slate-400">Sin descripción.</p>
        )}
        <Bloque titulo="Requisitos" items={v.requisitos} />
        <Bloque titulo="Responsabilidades" items={v.responsabilidades} />
        <Bloque titulo="Beneficios" items={v.beneficios} />
      </div>
      <div className="space-y-3">
        <div className="border border-slate-200 bg-white px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-bebas text-xl uppercase text-slate-950">Matriz de evaluación</h4>
            {criterios.length > 0 && (
              <span className={cn("font-lato text-xs", suma === 100 ? "text-slate-400" : "font-semibold text-amber-700")}>
                suma {suma}%
              </span>
            )}
          </div>
          {criterios.length === 0 ? (
            <p className="font-lato text-sm text-slate-500">
              No tiene. Sin matriz, la IA decide en cada corrida qué pesa más y el criterio del jefe del área no queda
              registrado.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {criterios.map((c, i) => (
                <li key={i}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-lato text-sm font-semibold text-slate-900">{c.nombre}</span>
                    <span className="font-lato text-sm font-bold text-slate-950">{c.peso}%</span>
                  </div>
                  <div className="mt-1 h-1.5 bg-slate-100">
                    <div className="h-full bg-blue-700" style={{ width: `${Math.min(100, Number(c.peso) || 0)}%` }} />
                  </div>
                  {c.guia && <p className="mt-1 font-lato text-xs text-slate-500">{c.guia}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={() => navegar({ tab: "perfiles", editar: v.id, ver: null, sec: null }, { historial: true })}
          className="inline-flex w-full items-center justify-center gap-2 border border-slate-900 bg-white px-3 py-2 font-lato text-xs font-bold uppercase tracking-wide text-slate-900 hover:bg-slate-900 hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar perfil y matriz
        </button>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  History,
  Loader2,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { resideFueraDeColombia } from "@/lib/talento/pais"
import { CandidatoForm } from "./CandidatoForm"
import {
  ETAPAS,
  ETAPA_ESTILO,
  ETAPA_LABEL,
  ORIGENES_CANDIDATO,
  etapaSiguiente,
} from "./constants"
import { useTalento } from "./TalentoStore"
import {
  cvSeVeEnNavegador,
  enlaceWhatsApp,
  fechaCorta,
  haceDias,
  scoreColor,
  type CambioEtapa,
  type DatosIA,
  type MatchIA,
} from "./utils"
import type { CandidatoSer, PostulacionSer } from "./types"

const BTN =
  "inline-flex items-center justify-center gap-1.5 border px-3 py-1.5 font-lato text-[11px] font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-50"
const BTN_SEC = cn(BTN, "border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900")
const BTN_PRI = cn(BTN, "border-slate-900 bg-slate-900 text-white hover:bg-slate-700")

const etiquetaOrigen = (o: string | null) =>
  ORIGENES_CANDIDATO.find((x) => x.value === o)?.label ??
  (o === "web" ? "Página web" : o === "drive" ? "Drive de TH" : (o ?? "—"))

/**
 * Panel de UNA persona: la hoja de vida a la izquierda y todo lo demás a la
 * derecha (postulaciones con su etapa y puntaje, perfil IA, datos). Se abre
 * desde cualquier lista del módulo con ?persona=<id> y se recorre con las
 * flechas del teclado, así Talento Humano revisa una tras otra sin abrir
 * pestañas nuevas.
 */
export function CandidatoPanel() {
  const { param, navegar, candidatoPorId, listaPanel } = useTalento()
  const id = param("persona")
  const c = id ? candidatoPorId.get(id) : undefined

  const pos = c ? listaPanel.indexOf(c.id) : -1
  const anterior = pos > 0 ? listaPanel[pos - 1] : null
  const siguiente = pos >= 0 && pos < listaPanel.length - 1 ? listaPanel[pos + 1] : null

  const cerrar = () => navegar({ persona: null })

  useEffect(() => {
    if (!c) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const tag = t?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || tag === "select" || t?.isContentEditable) return
      if (e.key === "Escape") cerrar()
      if ((e.key === "ArrowRight" || e.key === "j") && siguiente) navegar({ persona: siguiente })
      if ((e.key === "ArrowLeft" || e.key === "k") && anterior) navegar({ persona: anterior })
    }
    window.addEventListener("keydown", onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c?.id, anterior, siguiente])

  if (!c) return null

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={cerrar}
        className="absolute inset-0 bg-slate-950/40"
      />
      <div className="relative flex h-full w-full flex-col bg-stone-50 shadow-2xl lg:w-[min(1320px,96vw)]">
        {/* Barra superior */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
          <button
            type="button"
            onClick={() => anterior && navegar({ persona: anterior })}
            disabled={!anterior}
            title="Anterior (←)"
            className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-stone-100 hover:text-slate-900 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => siguiente && navegar({ persona: siguiente })}
            disabled={!siguiente}
            title="Siguiente (→)"
            className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-stone-100 hover:text-slate-900 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {pos >= 0 && (
            <span className="font-lato text-xs text-slate-400">
              {pos + 1} de {listaPanel.length}
            </span>
          )}
          <span className="mx-2 hidden h-4 w-px bg-slate-200 sm:block" />
          <p className="min-w-0 flex-1 truncate font-lato text-sm font-semibold text-slate-900">
            {c.nombre}
          </p>
          <span className="hidden font-lato text-[11px] text-slate-400 md:inline">
            ← → para recorrer · Esc para cerrar
          </span>
          <button
            type="button"
            onClick={cerrar}
            title="Cerrar (Esc)"
            className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-stone-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(400px,0.9fr)]">
          <VisorCv c={c} />
          {/* key: al pasar a otra persona se reinician borradores y formularios */}
          <DetallePersona key={c.id} c={c} onCerrar={cerrar} />
        </div>
      </div>
    </div>
  )
}

function VisorCv({ c }: { c: CandidatoSer }) {
  const url = `/api/admin/talento/cv/${c.id}`
  if (!c.cvPathGcs) {
    return (
      <div className="hidden items-center justify-center border-r border-slate-200 bg-slate-100 lg:flex">
        <div className="text-center">
          <FileText className="mx-auto mb-2 h-10 w-10 text-slate-300" />
          <p className="font-lato text-sm text-slate-500">Esta persona no tiene hoja de vida cargada</p>
        </div>
      </div>
    )
  }
  if (!cvSeVeEnNavegador(c)) {
    return (
      <div className="hidden items-center justify-center border-r border-slate-200 bg-slate-100 lg:flex">
        <div className="max-w-xs text-center">
          <FileText className="mx-auto mb-2 h-10 w-10 text-slate-300" />
          <p className="mb-3 font-lato text-sm text-slate-600">
            La hoja de vida es un archivo de Word ({c.cvFileName}); el navegador no lo muestra aquí.
          </p>
          <a href={url} className={BTN_PRI}>
            <Download className="h-3.5 w-3.5" />
            Descargar
          </a>
        </div>
      </div>
    )
  }
  return (
    <div className="hidden min-h-0 flex-col border-r border-slate-200 bg-slate-200 lg:flex">
      <div className="flex items-center justify-between gap-2 border-b border-slate-300 bg-slate-100 px-3 py-1.5">
        <span className="truncate font-lato text-[11px] text-slate-500">{c.cvFileName ?? "Hoja de vida"}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-shrink-0 items-center gap-1 font-lato text-[11px] font-semibold text-blue-700 hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Abrir aparte
        </a>
      </div>
      <iframe key={c.id} src={`${url}#view=FitH&navpanes=0`} title={`Hoja de vida de ${c.nombre}`} className="min-h-0 w-full flex-1 bg-white" />
    </div>
  )
}

function DetallePersona({ c, onCerrar }: { c: CandidatoSer; onCerrar: () => void }) {
  const {
    postulacionesDe,
    vacantes,
    duplicados,
    candidatoPorId,
    navegar,
    postular,
    ocupado,
    analizarCv,
    eliminarCandidato,
  } = useTalento()
  const [editando, setEditando] = useState(false)
  const [vacanteNueva, setVacanteNueva] = useState("")
  const datos = (c.datosIA ?? null) as DatosIA | null
  const posts = useMemo(
    () =>
      [...postulacionesDe(c.id)].sort((a, b) => {
        // Las que siguen en curso primero; las descartadas al final.
        const da = a.etapa === "DESCARTADA" ? 1 : 0
        const db = b.etapa === "DESCARTADA" ? 1 : 0
        return da - db || b.updatedAt.localeCompare(a.updatedAt)
      }),
    [postulacionesDe, c.id],
  )
  const yaEn = new Set(posts.map((p) => p.vacanteId))
  const abiertas = vacantes.filter(
    (v) => (v.estado === "ABIERTA" || v.estado === "PAUSADA") && !yaEn.has(v.id),
  )
  const dups = (duplicados.get(c.id) ?? [])
    .map((id) => candidatoPorId.get(id))
    .filter(Boolean) as CandidatoSer[]
  const wa = enlaceWhatsApp(c.telefono)
  const url = `/api/admin/talento/cv/${c.id}`

  if (editando) {
    return (
      <div className="min-h-0 overflow-y-auto p-4">
        <h3 className="mb-3 font-bebas text-2xl uppercase text-slate-950">Editar datos</h3>
        <CandidatoForm
          candidato={c}
          onListo={() => setEditando(false)}
          onCancelar={() => setEditando(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-0 space-y-4 overflow-y-auto p-4">
      {/* Identidad */}
      <section className="border border-slate-200 bg-white px-4 py-4">
        <h2 className="font-bebas text-3xl uppercase leading-none text-slate-950">{c.nombre}</h2>
        <p className="mt-1 font-lato text-sm text-slate-500">
          {c.ciudad ?? "Ciudad sin dato"} · llegó {haceDias(c.createdAt)} ({fechaCorta(c.createdAt)})
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {c.areaInteres && <Chip className="border-blue-200 bg-blue-50 text-blue-800">{c.areaInteres}</Chip>}
          <Chip className="border-slate-200 bg-stone-50 text-slate-600">{etiquetaOrigen(c.origen)}</Chip>
          {c.codigoReferido && (
            <Chip className="border-amber-200 bg-amber-50 text-amber-800">
              Lo refirió {c.codigoReferido.nombreEmpleado}
            </Chip>
          )}
          {resideFueraDeColombia(datos?.paisResidencia) && (
            <Chip className="border-red-200 bg-red-50 text-red-700">
              Vive fuera de Colombia · {datos?.paisResidencia}
            </Chip>
          )}
          <Chip
            className={
              c.consentimientoBanco
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-slate-200 bg-white text-slate-500"
            }
          >
            {c.consentimientoBanco ? "Autorizó banco de talento" : "Sin autorización de banco"}
          </Chip>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {c.email && (
            <a href={`mailto:${c.email}`} className={BTN_SEC} title={c.email}>
              <Mail className="h-3.5 w-3.5" />
              Correo
            </a>
          )}
          {c.telefono && (
            <a href={`tel:${c.telefono.replace(/\s/g, "")}`} className={BTN_SEC} title={c.telefono}>
              <Phone className="h-3.5 w-3.5" />
              {c.telefono}
            </a>
          )}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className={BTN_SEC}>
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          )}
          {c.cvPathGcs && (
            <a href={url} target="_blank" rel="noopener noreferrer" className={cn(BTN_SEC, "lg:hidden")}>
              <FileText className="h-3.5 w-3.5" />
              Hoja de vida
            </a>
          )}
        </div>

        {dups.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border border-amber-200 bg-amber-50 px-3 py-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <span className="font-lato text-xs text-amber-900">Posible duplicado de:</span>
            {dups.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => navegar({ persona: d.id })}
                className="font-lato text-xs font-semibold text-amber-900 underline hover:no-underline"
              >
                {d.nombre} ({fechaCorta(d.createdAt)})
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Postulaciones */}
      <section>
        <h3 className="mb-2 font-lato text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
          Vacantes a las que está postulado ({posts.length})
        </h3>
        {posts.length === 0 && (
          <p className="border border-dashed border-slate-300 bg-white px-4 py-4 font-lato text-sm text-slate-500">
            Está en el banco sin vacante. Envíalo a una abajo para que entre al proceso.
          </p>
        )}
        <div className="space-y-3">
          {posts.map((p) => (
            <PostulacionCard key={p.id} p={p} />
          ))}
        </div>

        {abiertas.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border border-slate-200 bg-white px-3 py-2.5">
            <Send className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <select
              value={vacanteNueva}
              onChange={(e) => setVacanteNueva(e.target.value)}
              aria-label="Enviar a otra vacante"
              className="min-w-0 flex-1 border border-slate-300 bg-white px-2 py-1.5 font-lato text-sm text-slate-900 focus:border-red-600 focus:outline-none"
            >
              <option value="">Enviar a {posts.length ? "otra " : "una "}vacante…</option>
              {abiertas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.titulo}
                  {v.estado === "PAUSADA" ? " (pausada)" : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!vacanteNueva || ocupado(`postular:${c.id}`)}
              onClick={async () => {
                const ok = await postular(c.id, vacanteNueva)
                if (ok) setVacanteNueva("")
              }}
              className={BTN_PRI}
            >
              {ocupado(`postular:${c.id}`) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Enviar
            </button>
          </div>
        )}
      </section>

      {/* Perfil IA */}
      <section className="border border-slate-200 bg-white px-4 py-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-1.5 font-lato text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-blue-700" />
            Perfil extraído por la IA
          </h3>
          {c.cvPathGcs && (
            <button
              type="button"
              onClick={() => analizarCv(c.id)}
              disabled={ocupado(`cv:${c.id}`)}
              className={BTN_SEC}
            >
              {ocupado(`cv:${c.id}`) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {c.resumenIA ? "Volver a analizar" : "Analizar hoja de vida"}
            </button>
          )}
        </div>
        {c.resumenIA ? (
          <div className="space-y-2">
            <p className="font-lato text-sm leading-relaxed text-slate-800">{c.resumenIA}</p>
            {datos && (
              <div className="flex flex-wrap gap-1.5">
                {typeof datos.anosExperiencia === "number" && (
                  <Chip className="border-slate-950 bg-slate-950 text-white">
                    {datos.anosExperiencia} años de experiencia
                  </Chip>
                )}
                {(datos.oficios ?? []).map((o) => (
                  <Chip key={o} className="border-blue-200 bg-white text-blue-800">
                    {o}
                  </Chip>
                ))}
                {(datos.certificaciones ?? []).map((cert) => (
                  <Chip key={cert} className="border-green-200 bg-white text-green-700">
                    {cert}
                  </Chip>
                ))}
              </div>
            )}
            {datos && (datos.alertas ?? []).length > 0 && (
              <p className="font-lato text-xs text-amber-700">⚠ {(datos.alertas ?? []).join(" · ")}</p>
            )}
            <p className="font-lato text-[10px] uppercase tracking-wide text-slate-400">
              Sugerencia generada por IA — la decisión es del reclutador
            </p>
          </div>
        ) : (
          <p className="font-lato text-sm text-slate-500">
            {c.cvPathGcs
              ? "Todavía no se ha analizado. El ciclo automático lo hace cada hora; puedes adelantarlo con el botón."
              : "Sin hoja de vida no hay perfil que extraer."}
          </p>
        )}
      </section>

      {/* Datos */}
      <section className="border border-slate-200 bg-white px-4 py-3">
        <h3 className="mb-2 font-lato text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
          Datos
        </h3>
        <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 font-lato text-sm">
          <Dato k="Correo" v={c.email} />
          <Dato k="Teléfono" v={c.telefono} />
          <Dato k="Ciudad" v={c.ciudad} />
          <Dato k="Archivo" v={c.cvFileName} />
          <Dato k="Origen" v={c.origenDetalle?.replace(/\s*drive:[\w-]+/g, "").trim() || etiquetaOrigen(c.origen)} />
          {c.notas && <Dato k="Notas" v={c.notas} />}
        </dl>
        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          <button type="button" onClick={() => setEditando(true)} className={BTN_SEC}>
            <Pencil className="h-3.5 w-3.5" />
            Editar datos
          </button>
          <button
            type="button"
            onClick={async () => {
              if (await eliminarCandidato(c)) onCerrar()
            }}
            className={cn(BTN, "border-slate-200 bg-white text-slate-500 hover:border-red-600 hover:text-red-600")}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar (habeas data)
          </button>
        </div>
      </section>
    </div>
  )
}

function PostulacionCard({ p }: { p: PostulacionSer }) {
  const { actualizarPostulacion, evaluarMatch, ocupado, navegar, vacantePorId } = useTalento()
  const [notas, setNotas] = useState(p.notasInternas ?? "")
  const [verMatch, setVerMatch] = useState(true)
  const [verHistorial, setVerHistorial] = useState(false)
  const m = (p.matchIA ?? null) as MatchIA | null
  const sig = etapaSiguiente(p.etapa)
  const guardando = ocupado(`post:${p.id}`)
  const evaluando = ocupado(`match:${p.id}`)
  const historial = (Array.isArray(p.historial) ? p.historial : []) as CambioEtapa[]
  const vacante = p.vacanteId ? vacantePorId.get(p.vacanteId) : undefined

  useEffect(() => setNotas(p.notasInternas ?? ""), [p.notasInternas])

  return (
    <div
      className={cn(
        "border border-t-4 border-slate-200 bg-white",
        ETAPA_ESTILO[p.etapa]?.borde,
        p.etapa === "DESCARTADA" && "opacity-80",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-3">
        <div className="min-w-0">
          {p.vacanteId ? (
            <button
              type="button"
              onClick={() => navegar({ tab: "vacantes", ver: p.vacanteId, persona: null }, { historial: true })}
              className="text-left font-bebas text-xl uppercase leading-tight text-slate-950 hover:text-red-600"
              title="Abrir la vacante"
            >
              {p.vacante?.titulo ?? vacante?.titulo ?? "Vacante"}
            </button>
          ) : (
            <p className="font-bebas text-xl uppercase leading-tight text-slate-950">Postulación espontánea</p>
          )}
          <p className="font-lato text-xs text-slate-500">
            Se postuló {haceDias(p.createdAt)} · último cambio {haceDias(p.updatedAt)}
          </p>
        </div>
        {typeof p.scoreIA === "number" && (
          <span
            className={cn("flex-shrink-0 px-2 py-1 font-lato text-lg font-bold leading-none", scoreColor(p.scoreIA))}
            title="Puntaje contra la matriz del cargo (sugerencia IA)"
          >
            {p.scoreIA}
          </span>
        )}
      </div>

      {/* Etapa */}
      <div className="px-4 pt-3">
        <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Etapa">
          {ETAPAS.map((e) => {
            const activa = p.etapa === e.value
            return (
              <button
                key={e.value}
                type="button"
                role="radio"
                aria-checked={activa}
                disabled={guardando}
                onClick={() => !activa && actualizarPostulacion(p.id, { etapa: e.value })}
                className={cn(
                  "border px-2 py-1 font-lato text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-60",
                  activa
                    ? cn(ETAPA_ESTILO[e.value]?.chip, "no-underline ring-2 ring-slate-900/10")
                    : "border-slate-200 bg-white text-slate-400 hover:border-slate-400 hover:text-slate-700",
                )}
                style={activa ? { textDecoration: "none" } : undefined}
              >
                {e.label}
              </button>
            )
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {sig && (
            <button
              type="button"
              disabled={guardando}
              onClick={() => actualizarPostulacion(p.id, { etapa: sig })}
              className={BTN_PRI}
            >
              {guardando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
              Pasar a {ETAPA_LABEL[sig]}
            </button>
          )}
          {p.etapa !== "DESCARTADA" && p.etapa !== "CONTRATADA" && (
            <button
              type="button"
              disabled={guardando}
              onClick={() => actualizarPostulacion(p.id, { etapa: "DESCARTADA" })}
              className={cn(BTN, "border-slate-200 bg-white text-slate-500 hover:border-red-600 hover:text-red-600")}
            >
              Descartar
            </button>
          )}
          {p.vacanteId && (
            <button
              type="button"
              disabled={evaluando}
              onClick={() => evaluarMatch(p.id)}
              className={BTN_SEC}
              title="Requiere la hoja de vida analizada"
            >
              {evaluando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {typeof p.scoreIA === "number" ? "Re-evaluar" : "Evaluar con IA"}
            </button>
          )}
        </div>
      </div>

      {/* Evaluación */}
      {m && (
        <div className="mx-4 mt-3 border border-blue-100 bg-blue-50/40">
          <button
            type="button"
            onClick={() => setVerMatch((x) => !x)}
            className="flex w-full items-center justify-between px-3 py-2 text-left font-lato text-[11px] font-bold uppercase tracking-wider text-blue-800"
          >
            Evaluación contra la matriz del cargo
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", verMatch && "rotate-180")} />
          </button>
          {verMatch && (
            <div className="space-y-2 px-3 pb-3">
              {(m.criterios ?? []).length > 0 && (
                <table className="w-full border-collapse font-lato text-xs">
                  <tbody>
                    {(m.criterios ?? []).map((cr) => (
                      <tr key={cr.nombre} className="border-t border-blue-100 align-top">
                        <td className="py-1.5 pr-2 text-slate-700">
                          <span className="font-semibold">{cr.nombre}</span>
                          <span className="text-slate-400"> · {cr.peso}%</span>
                          {cr.justificacion && (
                            <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
                              {cr.justificacion}
                            </span>
                          )}
                        </td>
                        <td className="w-16 whitespace-nowrap py-1.5 text-right">
                          <span className="font-bold text-slate-900">{cr.puntaje}</span>
                          <span className="block text-[10px] text-slate-400">{cr.valoracion}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {(m.fortalezas ?? []).length > 0 && (
                <Lista titulo="Fortalezas" color="text-green-800" items={m.fortalezas!} marca="✓" />
              )}
              {(m.brechas ?? []).length > 0 && (
                <Lista titulo="Brechas" color="text-amber-800" items={m.brechas!} marca="✗" />
              )}
              {(m.porValidar ?? []).length > 0 && (
                <Lista titulo="Validar en entrevista" color="text-blue-800" items={m.porValidar!} marca="?" />
              )}
              {m.recomendacion && (
                <p className="font-lato text-xs leading-relaxed text-slate-800">{m.recomendacion}</p>
              )}
              <p className="font-lato text-[10px] uppercase tracking-wide text-slate-400">
                {m.conMatriz
                  ? "Ponderado con la matriz del cargo — decide el reclutador"
                  : "Sin matriz definida: la IA estimó los pesos — decide el reclutador"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Notas */}
      <div className="px-4 pt-3">
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={2}
          placeholder="Notas internas del proceso (entrevista, prueba, referencias…)"
          className="w-full border border-slate-200 bg-white px-2.5 py-1.5 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none"
        />
        {notas !== (p.notasInternas ?? "") && (
          <div className="mt-1 flex justify-end gap-1.5">
            <button type="button" onClick={() => setNotas(p.notasInternas ?? "")} className={BTN_SEC}>
              Descartar cambios
            </button>
            <button
              type="button"
              disabled={guardando}
              onClick={() => actualizarPostulacion(p.id, { notasInternas: notas })}
              className={cn(BTN, "border-red-600 bg-red-600 text-white hover:bg-red-700")}
            >
              Guardar nota
            </button>
          </div>
        )}
      </div>

      {/* Historial */}
      <div className="px-4 pb-3 pt-1">
        {historial.length > 0 && (
          <button
            type="button"
            onClick={() => setVerHistorial((x) => !x)}
            className="inline-flex items-center gap-1 font-lato text-[11px] font-semibold text-slate-500 hover:text-slate-900"
          >
            <History className="h-3 w-3" />
            {verHistorial ? "Ocultar historial" : `Historial (${historial.length})`}
          </button>
        )}
        {verHistorial && (
          <ol className="mt-1.5 space-y-1 border-l border-slate-200 pl-3">
            {[...historial].reverse().map((h, i) => (
              <li key={i} className="font-lato text-[11px] text-slate-600">
                <span className="text-slate-400">{fechaCorta(h.fecha)}</span> ·{" "}
                {h.de ? `${ETAPA_LABEL[h.de] ?? h.de} → ` : ""}
                <strong>{ETAPA_LABEL[h.a] ?? h.a}</strong>
                {h.usuario ? <span className="text-slate-400"> · {h.usuario}</span> : null}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block border px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </span>
  )
}

function Dato({ k, v }: { k: string; v: string | null | undefined }) {
  return (
    <>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{k}</dt>
      <dd className="min-w-0 break-words text-slate-800">{v || "—"}</dd>
    </>
  )
}

function Lista({
  titulo,
  color,
  items,
  marca,
}: {
  titulo: string
  color: string
  items: string[]
  marca: string
}) {
  return (
    <div>
      <p className="font-lato text-[10px] font-bold uppercase tracking-wider text-slate-500">{titulo}</p>
      <ul className="mt-0.5 space-y-0.5">
        {items.map((t, i) => (
          <li key={i} className={cn("font-lato text-xs leading-relaxed", color)}>
            {marca} {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

export { Chip }

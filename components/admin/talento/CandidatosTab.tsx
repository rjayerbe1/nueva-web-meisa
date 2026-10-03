"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ChevronRight,
  FileText,
  Loader2,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { resideFueraDeColombia } from "@/lib/talento/pais"
import { CandidatoForm } from "./CandidatoForm"
import { ETAPAS, ETAPA_ESTILO, ETAPA_LABEL, ORIGENES_CANDIDATO } from "./constants"
import { useTalento } from "./TalentoStore"
import { diasDesde, haceDias, normalizarBusqueda, scoreColor, type DatosIA } from "./utils"
import type { CandidatoSer, PostulacionSer } from "./types"

type ResultadoIA = { candidatoId: string; relevancia: number; razon: string }

const POR_PAGINA = 50

const SELECT =
  "h-9 min-w-0 border border-slate-300 bg-white px-2 font-lato text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"

const etiquetaOrigen = (o: string | null) =>
  ORIGENES_CANDIDATO.find((x) => x.value === o)?.label ??
  (o === "web" ? "Página web" : o === "drive" ? "Drive de TH" : (o ?? "Sin dato"))

/**
 * Banco de hojas de vida. Los filtros viven en la URL (?vacante=…&etapa=…),
 * así un enlace como «los de Proyectista que siguen en Recibida» se puede
 * mandar por WhatsApp y el botón Atrás del navegador funciona.
 */
export function CandidatosTab() {
  const { candidatos, vacantes, postulacionesDe, duplicados, param, navegar, abrirCandidato, setCandidatos, avisar } =
    useTalento()

  const q = param("q")
  // ?vacante= se comparte con el Pipeline, que usa sus propios valores especiales.
  const rawVacante = param("vacante")
  const fVacante =
    rawVacante === "__espontanea__"
      ? "__ninguna__"
      : rawVacante === "__ninguna__" || vacantes.some((v) => v.id === rawVacante)
        ? rawVacante
        : ""
  const fEtapa = param("etapa")
  const fArea = param("area")
  const fOrigen = param("origen")
  const fDias = param("dias")
  const fRevisar = param("revisar")
  const orden = param("orden") || (fVacante && fVacante !== "__ninguna__" ? "puntaje" : "recientes")

  const [qLocal, setQLocal] = useState(q)
  const [nuevo, setNuevo] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [iaAbierta, setIaAbierta] = useState(false)
  const [iaQuery, setIaQuery] = useState("")
  const [iaResultados, setIaResultados] = useState<ResultadoIA[] | null>(null)
  const [iaBuscando, setIaBuscando] = useState(false)
  const [purga, setPurga] = useState<{ count: number; retencionMeses: number } | null>(null)
  const [purgando, setPurgando] = useState(false)

  useEffect(() => setQLocal(q), [q])
  useEffect(() => setPagina(1), [q, fVacante, fEtapa, fArea, fOrigen, fDias, fRevisar, orden, iaResultados])

  useEffect(() => {
    fetch("/api/admin/talento/purga")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.count === "number") setPurga({ count: d.count, retencionMeses: d.retencionMeses })
      })
      .catch(() => {})
  }, [])

  const set = (k: string, v: string) => navegar({ [k]: v || null })

  /* ── Opciones de filtro sacadas de los datos ── */
  const areas = useMemo(
    () =>
      Array.from(new Set(candidatos.map((c) => c.areaInteres).filter(Boolean) as string[])).sort((a, b) =>
        a.localeCompare(b, "es", { sensitivity: "base" }),
      ),
    [candidatos],
  )
  const origenes = useMemo(
    () => Array.from(new Set(candidatos.map((c) => c.origen ?? ""))).filter(Boolean),
    [candidatos],
  )
  const grupoVacantes = useMemo(() => {
    const con = new Set(candidatos.flatMap((c) => c.postulaciones.map((p) => p.vacante?.id)))
    return {
      abiertas: vacantes.filter((v) => v.estado === "ABIERTA"),
      pausadas: vacantes.filter((v) => v.estado === "PAUSADA"),
      otras: vacantes.filter((v) => v.estado !== "ABIERTA" && v.estado !== "PAUSADA" && con.has(v.id)),
    }
  }, [vacantes, candidatos])

  /** Postulación de la persona que aplica al filtro de vacante (si hay uno). */
  const postulacionEnFoco = (c: CandidatoSer): PostulacionSer | undefined => {
    const posts = postulacionesDe(c.id)
    if (fVacante && fVacante !== "__ninguna__") return posts.find((p) => p.vacanteId === fVacante)
    return undefined
  }

  const filtrados = useMemo(() => {
    let list = candidatos
    if (iaResultados) {
      const ordenIA = new Map(iaResultados.map((r, i) => [r.candidatoId, i]))
      list = list.filter((c) => ordenIA.has(c.id))
    }
    const qn = normalizarBusqueda(q)
    const corte = fDias ? Number(fDias) : 0

    list = list.filter((c) => {
      const posts = postulacionesDe(c.id)
      if (fVacante === "__ninguna__") {
        if (posts.some((p) => p.vacanteId)) return false
      } else if (fVacante) {
        const p = posts.find((x) => x.vacanteId === fVacante)
        if (!p) return false
        if (fEtapa && p.etapa !== fEtapa) return false
      }
      if (fEtapa && !fVacante && !posts.some((p) => p.etapa === fEtapa)) return false
      if (fEtapa && fVacante === "__ninguna__" && !posts.some((p) => p.etapa === fEtapa)) return false
      if (fArea === "__sin__" ? !!c.areaInteres : fArea && c.areaInteres !== fArea) return false
      if (fOrigen && c.origen !== fOrigen) return false
      if (corte && diasDesde(c.createdAt) > corte) return false
      if (fRevisar) {
        const datos = c.datosIA as DatosIA | null
        if (fRevisar === "duplicados" && !duplicados.has(c.id)) return false
        if (fRevisar === "sin-analizar" && (!c.cvPathGcs || c.resumenIA)) return false
        if (fRevisar === "sin-cv" && c.cvPathGcs) return false
        if (fRevisar === "fuera" && !resideFueraDeColombia(datos?.paisResidencia)) return false
      }
      if (qn) {
        const hay = [
          c.nombre,
          c.email,
          c.telefono,
          c.ciudad,
          c.areaInteres,
          // El nombre del ARCHIVO importa: TH conoce a la persona por cómo se
          // llama el CV en Drive ("David_Castillo.pdf") y el sistema muestra el
          // nombre real que la IA sacó del documento.
          c.cvFileName,
          c.origenDetalle,
          ...posts.map((p) => p.vacante?.titulo),
        ]
          .filter(Boolean)
          .some((v) => normalizarBusqueda(String(v)).includes(qn))
        if (!hay) return false
      }
      return true
    })

    const scoreDe = (c: CandidatoSer) => {
      const posts = postulacionesDe(c.id)
      const enFoco = fVacante && fVacante !== "__ninguna__" ? posts.filter((p) => p.vacanteId === fVacante) : posts
      return Math.max(-1, ...enFoco.map((p) => p.scoreIA ?? -1))
    }

    if (iaResultados) {
      const ordenIA = new Map(iaResultados.map((r, i) => [r.candidatoId, i]))
      return [...list].sort((a, b) => (ordenIA.get(a.id) ?? 999) - (ordenIA.get(b.id) ?? 999))
    }
    if (orden === "puntaje") {
      return [...list].sort((a, b) => scoreDe(b) - scoreDe(a) || b.createdAt.localeCompare(a.createdAt))
    }
    if (orden === "nombre") {
      return [...list].sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }))
    }
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [candidatos, postulacionesDe, duplicados, iaResultados, q, fVacante, fEtapa, fArea, fOrigen, fDias, fRevisar, orden])

  const razonIA = useMemo(
    () => new Map((iaResultados ?? []).map((r) => [r.candidatoId, r])),
    [iaResultados],
  )

  const visibles = filtrados.slice(0, pagina * POR_PAGINA)
  const hayFiltros = !!(q || fVacante || fEtapa || fArea || fOrigen || fDias || fRevisar || iaResultados)

  const limpiar = () => {
    navegar({ q: null, vacante: null, etapa: null, area: null, origen: null, dias: null, revisar: null, orden: null })
    setIaResultados(null)
    setIaQuery("")
  }

  const buscarIA = async () => {
    if (iaQuery.trim().length < 3) return
    setIaBuscando(true)
    try {
      const res = await fetch("/api/admin/talento/ia/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consulta: iaQuery.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error en la búsqueda")
      setIaResultados(data.resultados ?? [])
    } catch (e: any) {
      avisar("error", e.message ?? "Error en la búsqueda")
      setIaResultados(null)
    } finally {
      setIaBuscando(false)
    }
  }

  const ejecutarPurga = async () => {
    if (!purga || purga.count === 0) return
    if (
      !confirm(
        `Se van a SUPRIMIR definitivamente ${purga.count} candidato(s) con más de ${purga.retencionMeses} meses, sin autorización de banco y sin contratación (hoja de vida incluida). ¿Confirmas la purga habeas data?`,
      )
    )
      return
    setPurgando(true)
    try {
      const res = await fetch("/api/admin/talento/purga", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error ejecutando la purga")
      setPurga({ ...purga, count: 0 })
      const list = await fetch("/api/admin/talento/candidatos").then((r) => r.json())
      if (Array.isArray(list)) {
        const vivos = new Set(list.map((c: CandidatoSer) => c.id))
        setCandidatos((prev) => prev.filter((c) => vivos.has(c.id)))
      }
      avisar("ok", `Purga completada: ${data.purgados} candidato(s) suprimidos.`)
    } catch (e: any) {
      avisar("error", e.message ?? "Error ejecutando la purga")
    } finally {
      setPurgando(false)
    }
  }

  const vacanteFiltro = fVacante && fVacante !== "__ninguna__" ? vacantes.find((v) => v.id === fVacante) : null
  const nDuplicados = duplicados.size

  return (
    <div className="space-y-4">
      {purga !== null && purga.count > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-amber-300 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="font-lato text-sm text-amber-900">
              <strong>{purga.count}</strong> candidato(s) superaron la retención de {purga.retencionMeses} meses
              sin autorización de banco de talento — la Ley 1581/2012 exige suprimirlos.
            </p>
          </div>
          <button
            onClick={ejecutarPurga}
            disabled={purgando}
            className="inline-flex items-center gap-1.5 bg-amber-600 px-3 py-1.5 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            {purgando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Ejecutar purga
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-3 py-3">
          <label className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={qLocal}
              onChange={(e) => {
                setQLocal(e.target.value)
                set("q", e.target.value)
              }}
              placeholder="Buscar por nombre, correo, teléfono, ciudad o archivo"
              className="h-9 w-full border border-slate-300 bg-white pl-9 pr-3 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            />
          </label>
          <button
            type="button"
            onClick={() => setIaAbierta((x) => !x)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 border px-3 font-lato text-xs font-bold uppercase tracking-wider transition-colors",
              iaAbierta || iaResultados
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-blue-700 bg-white text-blue-700 hover:bg-blue-50",
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Buscar con IA
          </button>
          <button
            onClick={() => setNuevo(true)}
            disabled={nuevo}
            className="inline-flex h-9 items-center gap-1.5 bg-red-600 px-4 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar hoja de vida
          </button>
        </div>

        {iaAbierta && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-blue-50/40 px-3 py-2.5">
            <input
              type="text"
              value={iaQuery}
              onChange={(e) => setIaQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarIA()}
              autoFocus
              placeholder='Describe a quién buscas — ej: "soldadores 3G en Cali con experiencia en puentes"'
              className="h-9 min-w-[240px] flex-1 border border-slate-300 bg-white px-3 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
            />
            <button
              onClick={buscarIA}
              disabled={iaBuscando || iaQuery.trim().length < 3}
              className="inline-flex h-9 items-center gap-1.5 bg-blue-700 px-3 font-lato text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {iaBuscando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Buscar
            </button>
            {iaResultados && (
              <span className="font-lato text-xs text-blue-800">
                {iaResultados.length} resultados ordenados por relevancia
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 px-3 py-3 md:grid-cols-4 xl:grid-cols-7">
          <Filtro label="Vacante" className="col-span-2">
            <select value={fVacante} onChange={(e) => set("vacante", e.target.value)} className={SELECT}>
              <option value="">Todas</option>
              <option value="__ninguna__">Sin vacante (solo banco)</option>
              {grupoVacantes.abiertas.length > 0 && (
                <optgroup label="Abiertas">
                  {grupoVacantes.abiertas.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.titulo}
                    </option>
                  ))}
                </optgroup>
              )}
              {grupoVacantes.pausadas.length > 0 && (
                <optgroup label="Pausadas">
                  {grupoVacantes.pausadas.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.titulo}
                    </option>
                  ))}
                </optgroup>
              )}
              {grupoVacantes.otras.length > 0 && (
                <optgroup label="Cerradas y borradores">
                  {grupoVacantes.otras.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.titulo}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </Filtro>
          <Filtro label="Etapa">
            <select value={fEtapa} onChange={(e) => set("etapa", e.target.value)} className={SELECT}>
              <option value="">Todas</option>
              {ETAPAS.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </Filtro>
          <Filtro label="Área / oficio">
            <select value={fArea} onChange={(e) => set("area", e.target.value)} className={SELECT}>
              <option value="">Todas</option>
              <option value="__sin__">Sin clasificar</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Filtro>
          <Filtro label="Llegó por">
            <select value={fOrigen} onChange={(e) => set("origen", e.target.value)} className={SELECT}>
              <option value="">Todos</option>
              {origenes.map((o) => (
                <option key={o} value={o}>
                  {etiquetaOrigen(o)}
                </option>
              ))}
            </select>
          </Filtro>
          <Filtro label="Llegó">
            <select value={fDias} onChange={(e) => set("dias", e.target.value)} className={SELECT}>
              <option value="">Cuando sea</option>
              <option value="1">Hoy o ayer</option>
              <option value="7">Última semana</option>
              <option value="30">Último mes</option>
              <option value="90">Últimos 3 meses</option>
            </select>
          </Filtro>
          <Filtro label="Ordenar">
            <select value={orden} onChange={(e) => set("orden", e.target.value)} className={SELECT}>
              <option value="recientes">Más recientes</option>
              <option value="puntaje">Mejor puntaje</option>
              <option value="nombre">Nombre</option>
            </select>
          </Filtro>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 px-3 py-2">
          <span className="font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Por revisar:
          </span>
          {[
            { v: "duplicados", l: `Posibles duplicados (${nDuplicados})` },
            { v: "sin-analizar", l: "Sin analizar con IA" },
            { v: "sin-cv", l: "Sin hoja de vida" },
            { v: "fuera", l: "Viven fuera de Colombia" },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => set("revisar", fRevisar === o.v ? "" : o.v)}
              className={cn(
                "font-lato text-xs font-semibold transition-colors",
                fRevisar === o.v ? "text-red-600 underline" : "text-slate-500 hover:text-slate-900",
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {nuevo && (
        <div>
          <h3 className="mb-2 font-bebas text-2xl uppercase text-slate-950">Nueva hoja de vida</h3>
          <CandidatoForm
            candidato={null}
            vacanteInicial={vacanteFiltro?.id ?? ""}
            onListo={(c) => {
              setNuevo(false)
              abrirCandidato(c.id, [c.id])
            }}
            onCancelar={() => setNuevo(false)}
          />
        </div>
      )}

      {/* Resumen */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-lato text-sm text-slate-600">
          <strong className="text-slate-950">{filtrados.length}</strong>{" "}
          {filtrados.length === 1 ? "persona" : "personas"}
          {hayFiltros ? ` de ${candidatos.length}` : " en el banco"}
          {vacanteFiltro && (
            <>
              {" "}
              postuladas a <strong className="text-slate-950">{vacanteFiltro.titulo}</strong>
            </>
          )}
          {fEtapa && <> · etapa {ETAPA_LABEL[fEtapa]}</>}
        </p>
        {hayFiltros && (
          <button
            type="button"
            onClick={limpiar}
            className="inline-flex items-center gap-1 font-lato text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900"
          >
            <X className="h-3.5 w-3.5" />
            Quitar filtros
          </button>
        )}
      </div>

      {/* Etapas de la vacante filtrada: atajo para ver cada grupo */}
      {vacanteFiltro && (
        <div className="flex flex-wrap gap-1.5">
          {ETAPAS.map((e) => {
            const n = candidatos.filter((c) =>
              postulacionesDe(c.id).some((p) => p.vacanteId === vacanteFiltro.id && p.etapa === e.value),
            ).length
            const activa = fEtapa === e.value
            return (
              <button
                key={e.value}
                type="button"
                onClick={() => set("etapa", activa ? "" : e.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 border px-2.5 py-1 font-lato text-xs font-semibold transition-colors",
                  activa ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400",
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", ETAPA_ESTILO[e.value]?.punto)} />
                {e.label} <span className={activa ? "text-white/70" : "text-slate-400"}>{n}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <FileText className="mb-3 h-10 w-10 text-slate-300" />
          <p className="mb-1 font-bebas text-lg uppercase tracking-wide text-slate-700">
            {candidatos.length === 0 ? "Sin hojas de vida" : "Nadie coincide"}
          </p>
          <p className="max-w-sm font-lato text-sm text-slate-500">
            {candidatos.length === 0
              ? "Llegan solas por la página web y por la carpeta de Drive de Talento Humano."
              : "Prueba quitando algún filtro."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-200 bg-stone-50">
                {["Persona", "Contacto", vacanteFiltro ? "En esta vacante" : "Postulaciones", "Llegó", ""].map((h, i) => (
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
              {visibles.map((c) => {
                const datos = (c.datosIA ?? null) as DatosIA | null
                const hit = razonIA.get(c.id)
                const foco = postulacionEnFoco(c)
                const posts = postulacionesDe(c.id)
                return (
                  <tr
                    key={c.id}
                    onClick={() => abrirCandidato(c.id, filtrados.map((x) => x.id))}
                    className="group cursor-pointer border-b border-slate-100 align-top transition-colors last:border-0 hover:bg-stone-50"
                  >
                    <td className="px-3 py-3">
                      <p className="font-lato text-sm font-semibold text-slate-900 group-hover:text-red-600">
                        {c.nombre}
                      </p>
                      <p className="font-lato text-xs text-slate-500">
                        {c.ciudad ?? "—"}
                        {c.areaInteres ? ` · ${c.areaInteres}` : ""}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {duplicados.has(c.id) && (
                          <Etiqueta className="border-amber-300 bg-amber-50 text-amber-800">Posible duplicado</Etiqueta>
                        )}
                        {resideFueraDeColombia(datos?.paisResidencia) && (
                          <Etiqueta className="border-red-200 bg-red-50 text-red-700">
                            Fuera de Colombia · {datos?.paisResidencia}
                          </Etiqueta>
                        )}
                        {c.codigoReferido && (
                          <Etiqueta className="border-amber-200 bg-amber-50 text-amber-800">
                            Referido por {c.codigoReferido.nombreEmpleado}
                          </Etiqueta>
                        )}
                        {!c.cvPathGcs && <Etiqueta className="border-slate-200 bg-white text-slate-400">Sin hoja de vida</Etiqueta>}
                        {c.cvPathGcs && !c.resumenIA && (
                          <Etiqueta className="border-slate-200 bg-white text-slate-400">Sin analizar</Etiqueta>
                        )}
                      </div>
                      {hit && (
                        <p className="mt-1 max-w-md font-lato text-[11px] text-blue-700">
                          IA {hit.relevancia}: {hit.razon}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3 font-lato text-xs text-slate-600">
                      <p className="max-w-[220px] truncate">{c.email ?? "—"}</p>
                      <p>{c.telefono ?? ""}</p>
                    </td>
                    <td className="px-3 py-3">
                      {vacanteFiltro && foco ? (
                        <div className="flex items-center gap-2">
                          <EtapaChip etapa={foco.etapa} />
                          {typeof foco.scoreIA === "number" ? (
                            <span className={cn("px-1.5 py-0.5 font-lato text-xs font-bold", scoreColor(foco.scoreIA))}>
                              {foco.scoreIA}
                            </span>
                          ) : (
                            <span className="font-lato text-[11px] text-slate-400">sin puntaje</span>
                          )}
                        </div>
                      ) : posts.length === 0 ? (
                        <span className="font-lato text-xs text-slate-400">Solo en el banco</span>
                      ) : (
                        <div className="flex max-w-[360px] flex-wrap gap-1">
                          {posts.map((p) => (
                            <span
                              key={p.id}
                              className={cn(
                                "inline-flex items-center gap-1 border px-1.5 py-0.5 font-lato text-[10px] font-semibold",
                                ETAPA_ESTILO[p.etapa]?.chip,
                              )}
                              title={ETAPA_LABEL[p.etapa]}
                            >
                              {p.vacante?.titulo ?? "Espontánea"} · {ETAPA_LABEL[p.etapa] ?? p.etapa}
                              {typeof p.scoreIA === "number" && <strong className="ml-0.5">{p.scoreIA}</strong>}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-lato text-xs text-slate-500">
                      {haceDias(c.createdAt)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="inline-flex items-center gap-0.5 font-lato text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-red-600">
                        Abrir
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtrados.length > visibles.length && (
            <div className="border-t border-slate-100 px-3 py-3 text-center">
              <button
                type="button"
                onClick={() => setPagina((p) => p + 1)}
                className="border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-slate-700 hover:border-slate-900"
              >
                Mostrar {Math.min(POR_PAGINA, filtrados.length - visibles.length)} más (van {visibles.length} de{" "}
                {filtrados.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Filtro({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1", className)}>
      <span className="font-lato text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{label}</span>
      {children}
    </label>
  )
}

function Etiqueta({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-block border px-1.5 py-px font-lato text-[10px] font-bold uppercase tracking-wider", className)}>
      {children}
    </span>
  )
}

export function EtapaChip({ etapa }: { etapa: string }) {
  return (
    <span
      className={cn(
        "inline-block border px-1.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider",
        ETAPA_ESTILO[etapa]?.chip,
      )}
    >
      {ETAPA_LABEL[etapa] ?? etapa}
    </span>
  )
}

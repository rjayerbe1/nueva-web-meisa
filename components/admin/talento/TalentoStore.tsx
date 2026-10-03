"use client"

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { detectarDuplicados } from "./utils"
import type {
  CandidatoSer,
  ComparativoSer,
  PostulacionSer,
  PublicacionSer,
  VacanteSer,
} from "./types"

/*
 * Estado único del módulo de Talento Humano.
 *
 * Antes cada pestaña copiaba los datos del servidor a su propio estado: mover a
 * alguien de etapa en el Pipeline no se veía en Candidatos hasta recargar, y
 * mandar a alguien del banco a una vacante no aparecía en el Pipeline. Ahora
 * todas leen y escriben acá, y el panel de la persona (CandidatoPanel) es uno
 * solo para todo el módulo.
 *
 * La navegación (pestaña, vacante abierta, filtros, persona abierta) vive en la
 * URL con history.replaceState / pushState: Next 14.2 lo sincroniza con
 * useSearchParams SIN pedir otra vez la página al servidor. Con router.replace
 * cada clic volvía a correr las 7 consultas de la página contra Neon.
 */

type Aviso = { tipo: "ok" | "error"; texto: string } | null

type Store = {
  vacantes: VacanteSer[]
  candidatos: CandidatoSer[]
  postulaciones: PostulacionSer[]
  publicaciones: PublicacionSer[]
  comparativos: ComparativoSer[]
  vacantePorId: Map<string, VacanteSer>
  candidatoPorId: Map<string, CandidatoSer>
  postulacionesDe: (candidatoId: string) => PostulacionSer[]
  duplicados: Map<string, string[]>

  setVacantes: (fn: (prev: VacanteSer[]) => VacanteSer[]) => void
  setCandidatos: (fn: (prev: CandidatoSer[]) => CandidatoSer[]) => void
  setPublicaciones: (fn: (prev: PublicacionSer[]) => PublicacionSer[]) => void
  setComparativos: (fn: (prev: ComparativoSer[]) => ComparativoSer[]) => void
  setPostulaciones: (fn: (prev: PostulacionSer[]) => PostulacionSer[]) => void

  ocupado: (clave: string) => boolean
  actualizarPostulacion: (
    id: string,
    data: Record<string, unknown>,
  ) => Promise<PostulacionSer | null>
  postular: (candidatoId: string, vacanteId: string) => Promise<PostulacionSer | null>
  evaluarMatch: (postulacionId: string) => Promise<boolean>
  analizarCv: (candidatoId: string) => Promise<boolean>
  eliminarCandidato: (c: CandidatoSer) => Promise<boolean>
  quitarPostulacionesDe: (candidatoId: string) => void

  aviso: Aviso
  avisar: (tipo: "ok" | "error", texto: string) => void

  /** Lee un parámetro de la URL. */
  param: (k: string) => string
  /** Cambia parámetros de la URL sin recargar. null borra el parámetro. */
  navegar: (cambios: Record<string, string | null>, opts?: { historial?: boolean }) => void

  /** Abre el panel de una persona. `lista` permite pasar a la anterior/siguiente. */
  abrirCandidato: (id: string, lista?: string[]) => void
  listaPanel: string[]
}

const Ctx = createContext<Store | null>(null)

export function useTalento(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error("useTalento fuera de TalentoProvider")
  return s
}

async function leerError(res: Response): Promise<string> {
  const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
  return msg.error ?? `HTTP ${res.status}`
}

export function TalentoProvider({
  vacantes: v0,
  candidatos: c0,
  postulaciones: p0,
  publicaciones: pub0,
  comparativos: comp0,
  children,
}: {
  vacantes: VacanteSer[]
  candidatos: CandidatoSer[]
  postulaciones: PostulacionSer[]
  publicaciones: PublicacionSer[]
  comparativos: ComparativoSer[]
  children: React.ReactNode
}) {
  const [vacantes, setVacantesRaw] = useState(v0)
  const [candidatos, setCandidatosRaw] = useState(c0)
  const [postulaciones, setPostulaciones] = useState(p0)
  const [publicaciones, setPublicacionesRaw] = useState(pub0)
  const [comparativos, setComparativosRaw] = useState(comp0)
  const [ocupados, setOcupados] = useState<Set<string>>(new Set())
  const [aviso, setAviso] = useState<Aviso>(null)
  const [listaPanel, setListaPanel] = useState<string[]>([])
  const avisoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchParams = useSearchParams()
  const postRef = useRef(postulaciones)
  postRef.current = postulaciones

  const setVacantes = useCallback((fn: (p: VacanteSer[]) => VacanteSer[]) => setVacantesRaw(fn), [])
  const setCandidatos = useCallback(
    (fn: (p: CandidatoSer[]) => CandidatoSer[]) => setCandidatosRaw(fn),
    [],
  )
  const setPublicaciones = useCallback(
    (fn: (p: PublicacionSer[]) => PublicacionSer[]) => setPublicacionesRaw(fn),
    [],
  )
  const setComparativos = useCallback(
    (fn: (p: ComparativoSer[]) => ComparativoSer[]) => setComparativosRaw(fn),
    [],
  )

  const avisar = useCallback((tipo: "ok" | "error", texto: string) => {
    setAviso({ tipo, texto })
    if (avisoTimer.current) clearTimeout(avisoTimer.current)
    avisoTimer.current = setTimeout(() => setAviso(null), tipo === "error" ? 7000 : 3500)
  }, [])

  const marcar = useCallback((clave: string, on: boolean) => {
    setOcupados((prev) => {
      const next = new Set(prev)
      if (on) next.add(clave)
      else next.delete(clave)
      return next
    })
  }, [])

  const vacantePorId = useMemo(() => new Map(vacantes.map((v) => [v.id, v])), [vacantes])
  const candidatoPorId = useMemo(() => new Map(candidatos.map((c) => [c.id, c])), [candidatos])
  const porCandidato = useMemo(() => {
    const m = new Map<string, PostulacionSer[]>()
    for (const p of postulaciones) {
      const l = m.get(p.candidatoId)
      if (l) l.push(p)
      else m.set(p.candidatoId, [p])
    }
    return m
  }, [postulaciones])
  const postulacionesDe = useCallback((id: string) => porCandidato.get(id) ?? [], [porCandidato])
  const duplicados = useMemo(() => detectarDuplicados(candidatos), [candidatos])

  /** Mantiene en sincronía el resumen de postulaciones que trae cada candidato. */
  const reflejarEnCandidato = useCallback((p: PostulacionSer, borrar = false) => {
    setCandidatosRaw((prev) =>
      prev.map((c) => {
        if (c.id !== p.candidatoId) return c
        const resto = c.postulaciones.filter((x) => x.id !== p.id)
        return {
          ...c,
          postulaciones: borrar
            ? resto
            : [...resto, { id: p.id, etapa: p.etapa, vacante: p.vacante }],
        }
      }),
    )
  }, [])

  const actualizarPostulacion = useCallback(
    async (id: string, data: Record<string, unknown>) => {
      marcar(`post:${id}`, true)
      try {
        const res = await fetch(`/api/admin/talento/postulaciones/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(await leerError(res))
        const raw = await res.json()
        const previo = postRef.current.find((p) => p.id === id)
        if (!previo) return null
        const actualizado: PostulacionSer = {
          ...previo,
          etapa: raw.etapa,
          vacanteId: raw.vacanteId,
          vacante: raw.vacante,
          notasInternas: raw.notasInternas,
          scoreIA: raw.scoreIA,
          historial: raw.historial,
          updatedAt: raw.updatedAt,
        }
        setPostulaciones((prev) => prev.map((p) => (p.id === id ? { ...p, ...actualizado, matchIA: p.matchIA } : p)))
        reflejarEnCandidato(actualizado)
        return actualizado
      } catch (e) {
        avisar("error", (e as Error).message)
        return null
      } finally {
        marcar(`post:${id}`, false)
      }
    },
    [marcar, avisar, reflejarEnCandidato],
  )

  const evaluarMatch = useCallback(
    async (postulacionId: string) => {
      marcar(`match:${postulacionId}`, true)
      try {
        const res = await fetch("/api/admin/talento/ia/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postulacionId }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error ?? "No se pudo evaluar con la IA")
        setPostulaciones((prev) =>
          prev.map((p) =>
            p.id === postulacionId ? { ...p, scoreIA: data.match.score, matchIA: data.match } : p,
          ),
        )
        return true
      } catch (e) {
        avisar("error", (e as Error).message)
        return false
      } finally {
        marcar(`match:${postulacionId}`, false)
      }
    },
    [marcar, avisar],
  )

  const postular = useCallback(
    async (candidatoId: string, vacanteId: string) => {
      marcar(`postular:${candidatoId}`, true)
      try {
        const res = await fetch("/api/admin/talento/postulaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidatoId, vacanteId, etapa: "RECIBIDA" }),
        })
        if (!res.ok) throw new Error(await leerError(res))
        const raw = await res.json()
        const nueva: PostulacionSer = {
          id: raw.id,
          candidatoId: raw.candidatoId,
          vacanteId: raw.vacanteId,
          etapa: raw.etapa,
          notasInternas: raw.notasInternas,
          scoreIA: raw.scoreIA,
          matchIA: raw.matchIA,
          historial: raw.historial,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
          candidato: raw.candidato,
          vacante: raw.vacante,
        }
        setPostulaciones((prev) =>
          prev.some((p) => p.id === nueva.id) ? prev : [nueva, ...prev],
        )
        reflejarEnCandidato(nueva)
        const titulo = vacantePorId.get(vacanteId)?.titulo ?? "la vacante"
        avisar("ok", `Quedó en ${titulo}. Evaluando contra la matriz del cargo…`)
        // El puntaje se pide acá: si falla (CV sin analizar, tope de IA) la
        // postulación ya quedó creada igual.
        if (nueva.scoreIA == null) void evaluarMatch(nueva.id)
        return nueva
      } catch (e) {
        avisar("error", (e as Error).message)
        return null
      } finally {
        marcar(`postular:${candidatoId}`, false)
      }
    },
    [marcar, avisar, reflejarEnCandidato, vacantePorId, evaluarMatch],
  )

  const analizarCv = useCallback(
    async (candidatoId: string) => {
      marcar(`cv:${candidatoId}`, true)
      try {
        const res = await fetch("/api/admin/talento/ia/analizar-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidatoId }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error ?? "Error analizando la hoja de vida")
        setCandidatosRaw((prev) =>
          prev.map((x) =>
            x.id === candidatoId
              ? { ...x, resumenIA: data.datos?.resumen ?? null, datosIA: data.datos }
              : x,
          ),
        )
        avisar("ok", "Hoja de vida analizada")
        return true
      } catch (e) {
        avisar("error", (e as Error).message)
        return false
      } finally {
        marcar(`cv:${candidatoId}`, false)
      }
    },
    [marcar, avisar],
  )

  const quitarPostulacionesDe = useCallback((candidatoId: string) => {
    setPostulaciones((prev) => prev.filter((p) => p.candidatoId !== candidatoId))
  }, [])

  const eliminarCandidato = useCallback(
    async (c: CandidatoSer) => {
      if (
        !confirm(
          `¿Eliminar a ${c.nombre}? Se borra la hoja de vida del almacenamiento y sus postulaciones. No se puede deshacer (supresión habeas data).`,
        )
      )
        return false
      const res = await fetch(`/api/admin/talento/candidatos/${c.id}`, { method: "DELETE" })
      if (!res.ok) {
        avisar("error", "No se pudo eliminar")
        return false
      }
      setCandidatosRaw((prev) => prev.filter((x) => x.id !== c.id))
      setPostulaciones((prev) => prev.filter((p) => p.candidatoId !== c.id))
      avisar("ok", `${c.nombre} eliminado`)
      return true
    },
    [avisar],
  )

  const param = useCallback((k: string) => searchParams.get(k) ?? "", [searchParams])

  const navegar = useCallback(
    (cambios: Record<string, string | null>, opts?: { historial?: boolean }) => {
      const params = new URLSearchParams(window.location.search)
      for (const [k, v] of Object.entries(cambios)) {
        if (v === null || v === "") params.delete(k)
        else params.set(k, v)
      }
      const qs = params.toString()
      const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`
      if (opts?.historial) window.history.pushState(null, "", url)
      else window.history.replaceState(null, "", url)
    },
    [],
  )

  const abrirCandidato = useCallback(
    (id: string, lista?: string[]) => {
      if (lista) setListaPanel(lista)
      navegar({ persona: id })
    },
    [navegar],
  )

  const ocupado = useCallback((clave: string) => ocupados.has(clave), [ocupados])

  const value: Store = {
    vacantes,
    candidatos,
    postulaciones,
    publicaciones,
    comparativos,
    vacantePorId,
    candidatoPorId,
    postulacionesDe,
    duplicados,
    setVacantes,
    setCandidatos,
    setPublicaciones,
    setComparativos,
    setPostulaciones,
    ocupado,
    actualizarPostulacion,
    postular,
    evaluarMatch,
    analizarCv,
    eliminarCandidato,
    quitarPostulacionesDe,
    aviso,
    avisar,
    param,
    navegar,
    abrirCandidato,
    listaPanel,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/** Aviso flotante (reemplaza los alert() que bloqueaban la pantalla). */
export function AvisoFlotante() {
  const { aviso } = useTalento()
  if (!aviso) return null
  return (
    <div
      role="status"
      className={
        "fixed bottom-5 left-1/2 z-[70] max-w-md -translate-x-1/2 border px-4 py-2.5 font-lato text-sm shadow-lg " +
        (aviso.tipo === "ok"
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-red-300 bg-red-50 text-red-800")
      }
    >
      {aviso.texto}
    </div>
  )
}

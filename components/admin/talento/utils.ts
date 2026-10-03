import type { CandidatoSer, PublicacionSer } from "./types"

/**
 * Normaliza para buscar: quita tildes y trata "_", "-", "." como espacios,
 * así "David Castillo" encuentra "David_Castillo.pdf" y "Jiménez" encuentra
 * "Jimenez".
 */
export const normalizarBusqueda = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

export function diasDesde(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000))
}

export function haceDias(iso: string): string {
  const dias = diasDesde(iso)
  if (dias === 0) return "hoy"
  if (dias === 1) return "ayer"
  if (dias < 30) return `hace ${dias} días`
  const meses = Math.floor(dias / 30)
  return meses === 1 ? "hace 1 mes" : `hace ${meses} meses`
}

export function fechaCorta(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function scoreColor(score: number) {
  return score >= 70
    ? "bg-green-600 text-white"
    : score >= 45
      ? "bg-amber-500 text-white"
      : "bg-slate-300 text-slate-800"
}

/** Enlace de WhatsApp para un teléfono colombiano escrito como venga. */
export function enlaceWhatsApp(tel: string | null | undefined): string | null {
  if (!tel) return null
  let d = tel.replace(/\D/g, "")
  if (d.length === 10 && d.startsWith("3")) d = `57${d}`
  if (d.length < 11) return null
  return `https://wa.me/${d}`
}

/** El visor embebido sirve para PDF e imágenes; un Word el navegador lo descarga. */
export function cvSeVeEnNavegador(c: Pick<CandidatoSer, "cvFileName">): boolean {
  const nombre = (c.cvFileName ?? "").toLowerCase()
  if (!nombre) return true
  return !/\.(docx?|odt|rtf)$/.test(nombre)
}

/**
 * Posibles duplicados por persona: mismo correo (sin contar los @meisa.com.co,
 * que TH usa para registrar a varios), mismo teléfono (últimos 10 dígitos) o
 * mismo nombre normalizado. Es un aviso para revisar, no una fusión.
 */
export function detectarDuplicados(candidatos: CandidatoSer[]): Map<string, string[]> {
  const grupos = new Map<string, string[]>()
  const agregar = (clave: string, id: string) => {
    const g = grupos.get(clave)
    if (g) g.push(id)
    else grupos.set(clave, [id])
  }
  for (const c of candidatos) {
    const email = c.email?.trim().toLowerCase()
    if (email && !email.endsWith("@meisa.com.co")) agregar(`e:${email}`, c.id)
    const tel = c.telefono?.replace(/\D/g, "").slice(-10)
    if (tel && tel.length === 10) agregar(`t:${tel}`, c.id)
    const nombre = normalizarBusqueda(c.nombre)
    if (nombre.split(" ").length >= 2) agregar(`n:${nombre}`, c.id)
  }
  const res = new Map<string, string[]>()
  grupos.forEach((ids) => {
    if (ids.length < 2) return
    for (const id of ids) {
      const otros = ids.filter((x) => x !== id)
      const prev = res.get(id) ?? []
      res.set(id, Array.from(new Set([...prev, ...otros])))
    }
  })
  return res
}

/** ¿La vacante tiene registro en el SPE (obligación legal, Ley 1636/2013)? */
export function tieneSpe(vacanteId: string, publicaciones: PublicacionSer[]): boolean {
  return publicaciones.some((p) => p.vacanteId === vacanteId && p.canal.startsWith("SPE"))
}

export type DatosIA = {
  oficios?: string[]
  certificaciones?: string[]
  anosExperiencia?: number
  alertas?: string[]
  resumen?: string
  paisResidencia?: string | null
  evidenciaResidencia?: string | null
}

export type MatchIA = {
  fortalezas?: string[]
  brechas?: string[]
  porValidar?: string[]
  recomendacion?: string
  conMatriz?: boolean
  criterios?: Array<{
    nombre: string
    peso: number
    puntaje: number
    valoracion: string
    justificacion: string
  }>
}

export type CambioEtapa = { de: string | null; a: string; fecha: string; usuario?: string }

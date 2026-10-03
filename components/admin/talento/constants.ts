export const ETAPAS = [
  { value: "RECIBIDA", label: "Recibida" },
  { value: "PRESELECCION", label: "Preselección" },
  { value: "ENTREVISTA", label: "Entrevista" },
  { value: "OFERTA", label: "Oferta" },
  { value: "CONTRATADA", label: "Contratada" },
  { value: "DESCARTADA", label: "Descartada" },
] as const

export const ETAPA_LABEL: Record<string, string> = Object.fromEntries(
  ETAPAS.map((e) => [e.value, e.label]),
)

/**
 * Un solo juego de colores por etapa para todo el módulo (chips, columnas del
 * tablero, barras de las tarjetas de vacante). Antes cada pestaña pintaba las
 * etapas a su manera y no se aprendía a leerlas de un vistazo.
 */
export const ETAPA_ESTILO: Record<
  string,
  { chip: string; barra: string; borde: string; punto: string }
> = {
  RECIBIDA: {
    chip: "border-slate-300 bg-white text-slate-700",
    barra: "bg-slate-400",
    borde: "border-t-slate-400",
    punto: "bg-slate-400",
  },
  PRESELECCION: {
    chip: "border-blue-200 bg-blue-50 text-blue-800",
    barra: "bg-blue-500",
    borde: "border-t-blue-500",
    punto: "bg-blue-500",
  },
  ENTREVISTA: {
    chip: "border-amber-200 bg-amber-50 text-amber-800",
    barra: "bg-amber-500",
    borde: "border-t-amber-500",
    punto: "bg-amber-500",
  },
  OFERTA: {
    chip: "border-blue-800 bg-blue-800 text-white",
    barra: "bg-blue-800",
    borde: "border-t-blue-800",
    punto: "bg-blue-800",
  },
  CONTRATADA: {
    chip: "border-green-600 bg-green-600 text-white",
    barra: "bg-green-600",
    borde: "border-t-green-600",
    punto: "bg-green-600",
  },
  DESCARTADA: {
    chip: "border-slate-200 bg-slate-100 text-slate-400 line-through",
    barra: "bg-slate-200",
    borde: "border-t-slate-300",
    punto: "bg-slate-300",
  },
}

/** Etapas en curso: lo que todavía pide trabajo de Talento Humano. */
export const ETAPAS_ACTIVAS = ["RECIBIDA", "PRESELECCION", "ENTREVISTA", "OFERTA"]

/** La etapa que sigue en el proceso normal (para el botón «Pasar a…»). */
export function etapaSiguiente(etapa: string): string | null {
  const orden = ["RECIBIDA", "PRESELECCION", "ENTREVISTA", "OFERTA", "CONTRATADA"]
  const i = orden.indexOf(etapa)
  return i >= 0 && i < orden.length - 1 ? orden[i + 1] : null
}

export const ESTADO_VACANTE_ESTILO: Record<string, string> = {
  ABIERTA: "border-green-600 bg-green-50 text-green-700",
  PAUSADA: "border-amber-300 bg-amber-50 text-amber-800",
  BORRADOR: "border-slate-200 bg-slate-50 text-slate-500",
  CERRADA: "border-slate-200 bg-white text-slate-400",
}

export const ESTADOS_VACANTE = [
  { value: "BORRADOR", label: "Borrador" },
  { value: "ABIERTA", label: "Abierta" },
  { value: "PAUSADA", label: "Pausada" },
  { value: "CERRADA", label: "Cerrada" },
]

export const ORIGENES_CANDIDATO = [
  { value: "computrabajo", label: "Computrabajo" },
  { value: "magneto", label: "Magneto" },
  { value: "elempleo", label: "elempleo" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "spe", label: "SPE (SENA / Caja)" },
  { value: "referido", label: "Referido" },
  { value: "email", label: "Correo" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "fisico", label: "Entrega física" },
  { value: "otro", label: "Otro" },
]

// El registro en un prestador autorizado del SPE es obligación legal
// (Ley 1636/2013 art. 31 — 10 días hábiles desde que existe la vacante).
export const CANALES_PUBLICACION = [
  { value: "SPE-SENA", label: "SPE — SENA (APE)" },
  { value: "SPE-Comfandi", label: "SPE — Comfandi" },
  { value: "SPE-Comfenalco", label: "SPE — Comfenalco Valle" },
  { value: "Magneto", label: "Magneto (gratis)" },
  { value: "Computrabajo", label: "Computrabajo" },
  { value: "elempleo", label: "elempleo" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Otro", label: "Otro" },
]

// Periodos del informe general. Deben coincidir con PERIODOS de
// lib/talento/informe-general.ts (ese módulo no se puede importar desde el
// cliente porque arrastra Prisma). 0 = todo el histórico.
export const PERIODOS_INFORME = [
  { value: 7, label: "Últimos 7 días" },
  { value: 30, label: "Últimos 30 días" },
  { value: 90, label: "Últimos 90 días" },
  { value: 0, label: "Todo el histórico" },
]

/** ¿La vacante tiene al menos un criterio válido? Misma regla que `leerCriterios`. */
export function tieneMatriz(raw: unknown): boolean {
  return (
    Array.isArray(raw) &&
    raw.some(
      (c) =>
        typeof c?.nombre === "string" && c.nombre.trim().length > 0 && Number(c?.peso) > 0,
    )
  )
}

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

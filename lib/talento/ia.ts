import { GoogleAuth } from "google-auth-library"
import { chatConfig } from "@/lib/chat/config"
import { presupuestoDisponible, registrarUso } from "@/lib/chat/budget"
import { prisma } from "@/lib/prisma"
import { downloadCv } from "./gcs-hv"

/**
 * IA del módulo de Talento Humano (Vertex AI / Gemini multimodal).
 *
 * - Reutiliza credenciales, modelo y región del chatbot (chatConfig) y el
 *   MISMO circuit breaker de gasto (ChatUso) — un solo techo de gasto IA.
 * - Todo output es SUGERENCIA con decisión humana obligatoria
 *   (Circular Externa 002/2024 de la SIC: nada de decisiones de selección
 *   plenamente automatizadas).
 */

let cachedAuth: GoogleAuth | null = null

function getAuth(): GoogleAuth {
  if (cachedAuth) return cachedAuth
  const email = process.env.VERTEX_SA_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey =
    process.env.VERTEX_SA_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !rawKey) {
    throw new Error("Faltan credenciales de service account para Vertex AI")
  }
  cachedAuth = new GoogleAuth({
    credentials: { client_email: email, private_key: rawKey.replace(/\\n/g, "\n") },
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  })
  return cachedAuth
}

export class PresupuestoAgotadoError extends Error {
  constructor() {
    super("Tope de gasto de IA alcanzado (compartido con el chatbot). Intenta mañana.")
    this.name = "PresupuestoAgotadoError"
  }
}

async function llamarIA(opts: {
  system: string
  user: string
  archivo?: { base64: string; mimeType: string }
  maxOutputTokens?: number
}): Promise<string> {
  const budget = await presupuestoDisponible()
  if (!budget.ok) throw new PresupuestoAgotadoError()

  const { gcpProject, vertexLocation, vertexModel } = chatConfig
  if (!gcpProject) throw new Error("GCP_PROJECT_ID no configurado")

  const client = await getAuth().getClient()
  const tokenResp = await client.getAccessToken()
  const accessToken = typeof tokenResp === "string" ? tokenResp : tokenResp?.token
  if (!accessToken) throw new Error("No se pudo obtener access token de Vertex AI")

  const host =
    vertexLocation === "global"
      ? "aiplatform.googleapis.com"
      : `${vertexLocation}-aiplatform.googleapis.com`
  const url = `https://${host}/v1/projects/${gcpProject}/locations/${vertexLocation}/publishers/google/models/${vertexModel}:generateContent`

  const parts: Array<Record<string, unknown>> = []
  if (opts.archivo) {
    parts.push({
      inlineData: { mimeType: opts.archivo.mimeType, data: opts.archivo.base64 },
    })
  }
  parts.push({ text: opts.user })

  const body = {
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: [{ role: "user", parts }],
    generationConfig: {
      maxOutputTokens: opts.maxOutputTokens ?? 2048,
      temperature: 0.2,
      topP: 0.95,
      responseMimeType: "application/json",
    },
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  if (!resp.ok) {
    const errText = await resp.text().catch(() => "")
    throw new Error(`Vertex AI ${resp.status}: ${errText.slice(0, 400)}`)
  }

  const data = (await resp.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number }
  }
  const usage = data.usageMetadata || {}
  await registrarUso(usage.promptTokenCount ?? 0, usage.candidatesTokenCount ?? 0)

  return (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p?.text || "")
    .join("")
    .trim()
}

function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/^```(?:json)?/m, "").replace(/```\s*$/m, "").trim()
  try {
    return JSON.parse(cleaned) as T
  } catch {
    // El modelo a veces agrega texto tras el JSON — recorta al objeto exterior
    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}")
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T
    }
    throw new Error("La IA no devolvió JSON válido")
  }
}

/* ── 1. Análisis de CV ─────────────────────────────────────────────────── */

export interface DatosCv {
  nombre?: string
  email?: string
  telefono?: string
  ciudad?: string
  anosExperiencia?: number
  oficios?: string[]
  certificaciones?: string[]
  educacion?: string[]
  experiencia?: Array<{ empresa?: string; cargo?: string; periodo?: string }>
  resumen?: string
  alertas?: string[]
}

export async function analizarCvCandidato(candidatoId: string): Promise<DatosCv> {
  const candidato = await prisma.candidato.findUnique({ where: { id: candidatoId } })
  if (!candidato?.cvPathGcs) throw new Error("El candidato no tiene CV cargado")

  const buffer = await downloadCv(candidato.cvPathGcs)
  const raw = await llamarIA({
    system: `Eres un analista de selección de una empresa metalmecánica colombiana (estructuras metálicas: soldadura, armado, pintura industrial, montaje, ingeniería). Extraes datos de hojas de vida. Respondes SOLO JSON válido. No inventes datos que no estén en el documento.`,
    user: `Analiza esta hoja de vida y devuelve JSON con este shape exacto:
{
  "nombre": string|null, "email": string|null, "telefono": string|null, "ciudad": string|null,
  "anosExperiencia": number|null,
  "oficios": string[],            // ej: "soldador MIG", "armador", "ingeniero civil"
  "certificaciones": string[],    // ej: "calificación 3G", "trabajo en alturas", "SENA"
  "educacion": string[],
  "experiencia": [{"empresa": string, "cargo": string, "periodo": string}],
  "resumen": string,              // 2-3 frases, en español, perfil + experiencia clave
  "alertas": string[]             // vacíos de información, inconsistencias de fechas (NO juicios sobre edad/género/estado civil)
}`,
    archivo: {
      base64: buffer.toString("base64"),
      mimeType: candidato.cvContentType ?? "application/pdf",
    },
    maxOutputTokens: 2048,
  })

  const datos = parseJson<DatosCv>(raw)
  await prisma.candidato.update({
    where: { id: candidatoId },
    data: { datosIA: datos as object, resumenIA: datos.resumen ?? null },
  })
  return datos
}

/* ── 2. Match postulación × vacante ────────────────────────────────────── */

export interface CriterioEvaluado {
  nombre: string
  peso: number
  /** 0-100 sobre ESE criterio. */
  puntaje: number
  /** Etiqueta legible derivada del puntaje (Excelente, Muy bueno…). */
  valoracion: string
  justificacion: string
}

export interface MatchResult {
  score: number
  fortalezas: string[]
  brechas: string[]
  /** Lo que el CV no puede resolver y hay que confirmar en entrevista/prueba. */
  porValidar?: string[]
  recomendacion: string
  /** Desglose por criterio cuando la vacante tiene matriz definida. */
  criterios?: CriterioEvaluado[]
  /** true si el score salió de la matriz del área; false si la IA lo estimó libre. */
  conMatriz?: boolean
}

export interface CriterioVacante {
  nombre: string
  peso: number
  guia?: string
}

/** Lee y sanea la matriz del cargo. Descarta filas sin nombre o sin peso válido. */
export function leerCriterios(raw: unknown): CriterioVacante[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((c) => c as Record<string, unknown>)
    .filter((c) => typeof c?.nombre === "string" && c.nombre.trim().length > 0)
    .map((c) => ({
      nombre: String(c.nombre).trim(),
      peso: Math.max(0, Number(c.peso) || 0),
      guia: typeof c.guia === "string" && c.guia.trim() ? String(c.guia).trim() : undefined,
    }))
    .filter((c) => c.peso > 0)
}

function etiquetaValoracion(p: number): string {
  if (p >= 90) return "Excelente"
  if (p >= 75) return "Muy bueno"
  if (p >= 60) return "Bueno"
  if (p >= 40) return "Regular"
  return "Insuficiente"
}

export async function evaluarMatch(postulacionId: string): Promise<MatchResult> {
  const p = await prisma.postulacion.findUnique({
    where: { id: postulacionId },
    include: { candidato: true, vacante: true },
  })
  if (!p) throw new Error("Postulación no encontrada")
  if (!p.vacante) throw new Error("La postulación es espontánea (sin vacante para comparar)")
  if (!p.candidato.datosIA && !p.candidato.resumenIA) {
    throw new Error("Primero analiza el CV del candidato con IA (pestaña Candidatos)")
  }

  const criterios = leerCriterios(p.vacante.criteriosEvaluacion)
  const conMatriz = criterios.length > 0

  // Con matriz, la IA califica CADA criterio por separado y el total lo
  // calculamos nosotros: pedirle el promedio ponderado al modelo es pedirle
  // aritmética, que es justo lo que peor hace y lo que nadie podría auditar.
  const instruccionSalida = conMatriz
    ? `MATRIZ DE EVALUACIÓN DEL CARGO (la definió el jefe del área — es obligatoria):
${criterios
        .map((c) => `- ${c.nombre} (peso ${c.peso}%)${c.guia ? ` → qué mirar: ${c.guia}` : ""}`)
        .join("\n")}

Califica CADA criterio de 0 a 100 según la evidencia del CV, con una justificación
de una frase que cite evidencia concreta (herramienta, obra, años, certificación).
Si el CV no da evidencia de un criterio, punteo bajo y dilo en la justificación —
no lo asumas por el cargo que tuvo.

Devuelve JSON:
{
  "criterios": [{"nombre": string (EXACTO como arriba), "puntaje": number 0-100, "justificacion": string}],
  "fortalezas": string[],
  "brechas": string[],
  "porValidar": string[] (lo que el CV NO puede demostrar y hay que confirmar en entrevista o prueba práctica),
  "recomendacion": string (1-2 frases)
}`
    : `Devuelve JSON: {"score": number 0-100, "fortalezas": string[], "brechas": string[], "porValidar": string[], "recomendacion": string (1-2 frases)}`

  const raw = await llamarIA({
    system: `Eres un asistente de selección de MEISA (estructuras metálicas, Colombia). Comparas el perfil de un candidato contra una vacante. Tu salida es una SUGERENCIA para el reclutador humano — sé honesto con las brechas. PROHIBIDO considerar edad, sexo, estado civil, origen, religión o cualquier criterio no meritocrático (Ley 931/2004). Respondes SOLO JSON.`,
    user: `VACANTE:
${JSON.stringify({
      titulo: p.vacante.titulo,
      area: p.vacante.area,
      ciudad: p.vacante.ciudad,
      descripcion: p.vacante.descripcion,
      requisitos: p.vacante.requisitos,
      responsabilidades: p.vacante.responsabilidades,
    })}

CANDIDATO (extraído de su CV):
${JSON.stringify(p.candidato.datosIA ?? { resumen: p.candidato.resumenIA })}

${instruccionSalida}`,
    maxOutputTokens: 2048,
  })

  const bruto = parseJson<
    MatchResult & { criterios?: Array<{ nombre: string; puntaje: number; justificacion: string }> }
  >(raw)

  let score: number
  let evaluados: CriterioEvaluado[] | undefined

  if (conMatriz) {
    const porNombre = new Map(
      (bruto.criterios ?? []).map((c) => [c.nombre.trim().toLowerCase(), c]),
    )
    evaluados = criterios.map((c) => {
      const hit = porNombre.get(c.nombre.trim().toLowerCase())
      const puntaje = Math.max(0, Math.min(100, Math.round(Number(hit?.puntaje) || 0)))
      return {
        nombre: c.nombre,
        peso: c.peso,
        puntaje,
        valoracion: etiquetaValoracion(puntaje),
        justificacion: hit?.justificacion?.trim() || "Sin evidencia en la hoja de vida.",
      }
    })
    // Ponderado sobre la suma REAL de pesos: si el área los dejó sumando 90 o
    // 110, el score sigue siendo 0-100 y comparable entre candidatos.
    const pesoTotal = evaluados.reduce((a, c) => a + c.peso, 0)
    score = pesoTotal
      ? Math.round(evaluados.reduce((a, c) => a + c.puntaje * c.peso, 0) / pesoTotal)
      : 0
  } else {
    score = Math.max(0, Math.min(100, Math.round(Number(bruto.score) || 0)))
  }

  const match: MatchResult = {
    score,
    fortalezas: bruto.fortalezas ?? [],
    brechas: bruto.brechas ?? [],
    porValidar: bruto.porValidar ?? [],
    recomendacion: bruto.recomendacion ?? "",
    criterios: evaluados,
    conMatriz,
  }

  await prisma.postulacion.update({
    where: { id: postulacionId },
    data: { scoreIA: score, matchIA: match as object },
  })
  return match
}

/* ── 3. Herramientas de vacante: lint legal + textos por canal ─────────── */

export interface HerramientasVacante {
  lint: Array<{ gravedad: "error" | "aviso"; texto: string }>
  textos: {
    spe: string
    magneto: string
    computrabajo: string
    linkedin: string
    whatsapp: string
  }
}

export async function herramientasVacante(vacanteId: string): Promise<HerramientasVacante> {
  const v = await prisma.vacante.findUnique({ where: { id: vacanteId } })
  if (!v) throw new Error("Vacante no encontrada")

  const raw = await llamarIA({
    system: `Eres el asistente de Talento Humano de MEISA (Metálicas e Ingeniería S.A.S., estructuras metálicas, planta en Jamundí, Valle del Cauca, Colombia). Haces dos cosas: (1) revisar ofertas de empleo contra la ley colombiana, (2) redactar el texto de la oferta para distintos canales. Respondes SOLO JSON.`,
    user: `VACANTE:
${JSON.stringify({
      titulo: v.titulo,
      area: v.area,
      ciudad: v.ciudad,
      modalidad: v.modalidad,
      descripcion: v.descripcion,
      requisitos: v.requisitos,
      responsabilidades: v.responsabilidades,
      beneficios: v.beneficios,
      tipoContrato: v.tipoContrato,
      salarioMin: v.salarioMin,
      salarioMax: v.salarioMax,
    })}

TAREA 1 — LINT LEGAL: detecta en el texto de la vacante cualquier violación u olor a violación de:
- Ley 931/2004 (límites/rangos de edad, sexo, raza, estado civil)
- Ley 2114/2021 (embarazo/planes reproductivos)
- Decreto 1543/1997 (VIH)
- Ley 1861/2017 (libreta militar como requisito)
- lenguaje discriminatorio o requisitos no meritocráticos
Marca gravedad "error" (ilegal) o "aviso" (riesgoso/mejorable). Si está limpia, lint = [].

TAREA 2 — TEXTOS: redacta la oferta para cada canal, en español colombiano profesional:
- "spe": formato formal completo para el Servicio Público de Empleo (incluye salario si existe — es campo obligatorio del SPE)
- "magneto" y "computrabajo": título + descripción atractiva con viñetas, sin salario si salarioVisible es falso
- "linkedin": post breve para la página de empresa (2-3 párrafos, tono profesional cercano, con llamado a la acción)
- "whatsapp": mensaje corto para difundir en grupos/estados (máx 500 caracteres, con emojis sobrios)

Devuelve JSON: {"lint": [{"gravedad": "error"|"aviso", "texto": string}], "textos": {"spe": string, "magneto": string, "computrabajo": string, "linkedin": string, "whatsapp": string}}`,
    maxOutputTokens: 4096,
  })

  return parseJson<HerramientasVacante>(raw)
}

/* ── 3b. Comparativo de candidatos contra un perfil de cargo ───────────── */

export interface EvaluacionComparativo {
  candidatoId: string
  nombre: string
  score: number
  fortalezas: string[]
  brechas: string[]
  recomendacion: string
}

export interface ResultadoComparativo {
  evaluaciones: EvaluacionComparativo[]
  conclusion: string
  sinPerfil: string[] // nombres de candidatos sin CV analizado (excluidos)
}

export async function compararCandidatos(
  vacanteId: string,
  candidatoIds: string[],
  usuario?: string | null,
): Promise<{ comparativoId: string; resultado: ResultadoComparativo }> {
  const vacante = await prisma.vacante.findUnique({ where: { id: vacanteId } })
  if (!vacante) throw new Error("Vacante no encontrada")

  const candidatos = await prisma.candidato.findMany({
    where: { id: { in: candidatoIds } },
    select: { id: true, nombre: true, ciudad: true, datosIA: true, resumenIA: true },
  })
  const conPerfil = candidatos.filter((c) => c.datosIA || c.resumenIA)
  const sinPerfil = candidatos.filter((c) => !c.datosIA && !c.resumenIA).map((c) => c.nombre)
  if (conPerfil.length < 2) {
    throw new Error("Se necesitan al menos 2 candidatos con CV analizado para comparar")
  }

  const raw = await llamarIA({
    system: `Eres el comité técnico de selección de MEISA (estructuras metálicas: fabricación en planta con soldadura/trabajo en caliente/puentes grúa, y montaje en obra con trabajo en alturas). Comparas VARIOS candidatos contra UN perfil de cargo y produces una matriz de evaluación honesta. Tu salida es una SUGERENCIA para el reclutador humano. PROHIBIDO valorar edad, sexo, estado civil, origen o cualquier criterio no meritocrático (Ley 931/2004) — solo experiencia, formación, licencias y certificaciones. Respondes SOLO JSON.`,
    user: `PERFIL DE CARGO:
${JSON.stringify({
      titulo: vacante.titulo,
      area: vacante.area,
      ciudad: vacante.ciudad,
      descripcion: vacante.descripcion,
      requisitos: vacante.requisitos,
      responsabilidades: vacante.responsabilidades,
    })}

CANDIDATOS (perfiles extraídos de sus hojas de vida):
${JSON.stringify(
      conPerfil.map((c) => ({
        candidatoId: c.id,
        nombre: c.nombre,
        ciudad: c.ciudad,
        perfil: c.datosIA ?? c.resumenIA,
      })),
    )}

Evalúa a CADA candidato contra el perfil. Sé comparativo: los scores deben diferenciar
claramente (usa todo el rango 0-100). Considera cercanía geográfica a la sede como
factor logístico menor (nunca eliminatorio).

Devuelve JSON:
{
  "evaluaciones": [{
    "candidatoId": string,
    "nombre": string,
    "score": number,           // 0-100
    "fortalezas": string[],    // 2-4, concretas
    "brechas": string[],       // 1-3, concretas
    "recomendacion": string    // 1 frase
  }],
  "conclusion": string  // 2-3 frases: terna sugerida (los 2-3 mejores) y por qué
}`,
    maxOutputTokens: 6144,
  })

  const parsed = parseJson<{ evaluaciones: EvaluacionComparativo[]; conclusion: string }>(raw)
  const evaluaciones = (parsed.evaluaciones ?? [])
    .map((e) => ({ ...e, score: Math.max(0, Math.min(100, Math.round(e.score))) }))
    .sort((a, b) => b.score - a.score)

  const resultado: ResultadoComparativo = {
    evaluaciones,
    conclusion: parsed.conclusion ?? "",
    sinPerfil,
  }

  const guardado = await prisma.comparativoVacante.create({
    data: { vacanteId, resultados: resultado as unknown as object, creadoPor: usuario ?? null },
  })
  return { comparativoId: guardado.id, resultado }
}

/* ── 4. Búsqueda semántica del banco de candidatos ─────────────────────── */

export interface ResultadoBusqueda {
  candidatoId: string
  relevancia: number
  razon: string
}

export async function buscarCandidatos(consulta: string): Promise<ResultadoBusqueda[]> {
  const candidatos = await prisma.candidato.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    select: { id: true, nombre: true, ciudad: true, resumenIA: true, datosIA: true },
  })
  const conPerfil = candidatos.filter((c) => c.resumenIA || c.datosIA)
  if (conPerfil.length === 0) {
    throw new Error("Ningún candidato tiene CV analizado con IA todavía")
  }

  const raw = await llamarIA({
    system: `Eres un buscador semántico del banco de hojas de vida de MEISA (estructuras metálicas). Recibes una consulta del reclutador y una lista de candidatos con su perfil extraído. Devuelves los que realmente encajan, ordenados por relevancia. Solo criterios meritocráticos. Respondes SOLO JSON.`,
    user: `CONSULTA: ${consulta}

CANDIDATOS:
${JSON.stringify(
      conPerfil.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        ciudad: c.ciudad,
        perfil: c.datosIA ?? c.resumenIA,
      })),
    )}

Devuelve JSON: {"resultados": [{"candidatoId": string, "relevancia": number 0-100, "razon": string corta}]} — máximo 10, solo los que de verdad encajan (relevancia >= 40).`,
    maxOutputTokens: 2048,
  })

  const parsed = parseJson<{ resultados: ResultadoBusqueda[] }>(raw)
  return parsed.resultados ?? []
}

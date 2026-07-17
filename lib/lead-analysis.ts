/**
 * Análisis IA de la propuesta de un lead.
 *
 * Cuando un cliente adjunta renders/planos/PDF en /contacto, este módulo los
 * pasa a Gemini (Vertex AI, multimodal) para producir un "briefing" técnico-
 * comercial que se incrusta en el correo interno: así el comercial entiende de
 * qué se trata sin abrir cada archivo.
 *
 * Diseño:
 *  - Reutiliza los buffers ya descargados para los adjuntos del correo (0 descargas extra).
 *  - Solo analiza tipos que Gemini entiende: imágenes y PDF (DWG/DXF/ZIP se ignoran).
 *  - Respeta el circuit breaker de gasto del chat (mismo proyecto GCP / misma tabla).
 *  - Tolerante a fallos: cualquier error → devuelve null y el correo se envía igual.
 */

import { GoogleAuth } from 'google-auth-library'
import { chatConfig } from './chat/config'
import {
  presupuestoDisponible,
  registrarUso,
} from './chat/budget'

// Tipos MIME que el modelo puede leer directamente.
const ANALYZABLE_MIME = /^(image\/(png|jpe?g|webp|gif)|application\/pdf)$/i

// Topes para acotar costo/latencia del análisis (los leads son de bajo volumen,
// pero esto blinda contra un adjunto abusivo).
const MAX_ANALYSIS_FILES = 8
const MAX_ANALYSIS_BYTES = 15 * 1024 * 1024

export interface AnalyzableFile {
  filename: string
  mimeType: string
  content: Buffer
}

export interface LeadAnalysisReport {
  resumenEjecutivo: string
  tipoEstructura: string
  alcanceAparente: string
  sistemaEstructural?: string
  puntosRelevantes: string[]
  riesgosODudas: string[]
  preguntasParaCliente: string[]
  analisisPorArchivo: Array<{ archivo: string; observacion: string }>
  /** Archivos que llegaron pero el modelo no puede leer (DWG/DXF/ZIP/Office). */
  archivosNoAnalizados: string[]
}

let cachedAuth: GoogleAuth | null = null
function getAuth(): GoogleAuth {
  if (cachedAuth) return cachedAuth
  const email =
    process.env.VERTEX_SA_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey =
    process.env.VERTEX_SA_PRIVATE_KEY ||
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !rawKey) {
    throw new Error('Faltan credenciales de service account para Vertex AI')
  }
  cachedAuth = new GoogleAuth({
    credentials: {
      client_email: email,
      private_key: rawKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  })
  return cachedAuth
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    resumenEjecutivo: { type: 'STRING' },
    tipoEstructura: { type: 'STRING' },
    alcanceAparente: { type: 'STRING' },
    sistemaEstructural: { type: 'STRING' },
    puntosRelevantes: { type: 'ARRAY', items: { type: 'STRING' } },
    riesgosODudas: { type: 'ARRAY', items: { type: 'STRING' } },
    preguntasParaCliente: { type: 'ARRAY', items: { type: 'STRING' } },
    analisisPorArchivo: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          archivo: { type: 'STRING' },
          observacion: { type: 'STRING' },
        },
        required: ['archivo', 'observacion'],
      },
    },
  },
  required: [
    'resumenEjecutivo',
    'tipoEstructura',
    'alcanceAparente',
    'puntosRelevantes',
    'analisisPorArchivo',
  ],
}

const SYSTEM_PROMPT = `Eres un analista técnico-comercial senior de MEISA (Metálicas e Ingeniería S.A.), fabricante y montador colombiano de estructuras metálicas: puentes, edificaciones, naves industriales, centros comerciales, cubiertas, escenarios deportivos e infraestructura urbana.

Un cliente potencial dejó una solicitud en la web con archivos adjuntos (renders, planos, fotos o documentos). Tu trabajo es analizar esos archivos y producir un BRIEFING claro para el comercial que va a llamar al cliente, para que llegue preparado sin tener que abrir cada archivo.

Instrucciones:
- Analiza TODO lo que veas en los adjuntos: tipo de obra, geometría, magnitud aparente, sistema estructural (pórticos, cerchas, arcos, entrepisos), materiales, número de niveles, luces, cubiertas, fachadas, etc.
- Sé concreto y técnico pero conciso. No inventes cifras exactas si no se ven; usa lenguaje de estimación ("aparenta", "del orden de").
- Enfócate en lo útil para cotizar en acero estructural y para calificar el lead.
- Si un archivo no aporta info técnica (ej. una foto genérica), dilo.
- Escribe en español de Colombia, tono profesional directo.
- Responde EXCLUSIVAMENTE con el JSON del esquema. Sin texto adicional.`

function buildContextText(lead: {
  nombre: string
  empresa?: string | null
  tipoProyecto?: string | null
  etapa?: string | null
  ciudad?: string | null
  escala?: string | null
  mensaje: string
}): string {
  const lines = [
    'Datos de la solicitud (contexto declarado por el cliente):',
    `- Nombre: ${lead.nombre}${lead.empresa ? ` (${lead.empresa})` : ''}`,
    lead.tipoProyecto ? `- Tipo de proyecto declarado: ${lead.tipoProyecto}` : '',
    lead.etapa ? `- Etapa: ${lead.etapa}` : '',
    lead.ciudad ? `- Ciudad: ${lead.ciudad}` : '',
    lead.escala ? `- Escala estimada declarada: ${lead.escala}` : '',
    '',
    'Mensaje del cliente:',
    lead.mensaje || '(sin mensaje)',
    '',
    'A continuación van los archivos adjuntos. Analízalos y devuelve el briefing en JSON.',
  ]
  return lines.filter(Boolean).join('\n')
}

/**
 * Analiza los adjuntos de un lead con Gemini y devuelve el briefing.
 * Devuelve null si: está deshabilitado, no hay archivos analizables, el circuit
 * breaker de gasto está agotado, o cualquier error/respuesta bloqueada.
 */
export async function analizarPropuestaLead(opts: {
  lead: {
    nombre: string
    empresa?: string | null
    tipoProyecto?: string | null
    etapa?: string | null
    ciudad?: string | null
    escala?: string | null
    mensaje: string
  }
  archivos: AnalyzableFile[]
}): Promise<LeadAnalysisReport | null> {
  if (process.env.LEAD_ANALYSIS_ENABLED === 'false') return null

  const noAnalizados = opts.archivos
    .filter((f) => !ANALYZABLE_MIME.test(f.mimeType))
    .map((f) => f.filename)

  // Selección de analizables respetando topes de cantidad y tamaño total.
  const analizables: AnalyzableFile[] = []
  let total = 0
  for (const f of opts.archivos) {
    if (!ANALYZABLE_MIME.test(f.mimeType)) continue
    if (analizables.length >= MAX_ANALYSIS_FILES) break
    if (total + f.content.length > MAX_ANALYSIS_BYTES) continue
    total += f.content.length
    analizables.push(f)
  }

  if (analizables.length === 0) return null

  const { gcpProject, vertexLocation } = chatConfig
  if (!gcpProject) return null

  // Circuit breaker de gasto (compartido con el chat).
  try {
    const presupuesto = await presupuestoDisponible()
    if (!presupuesto.ok) {
      console.warn(`[lead-analysis] omitido por tope de gasto (${presupuesto.motivo})`)
      return null
    }
  } catch (err) {
    console.warn('[lead-analysis] no se pudo verificar presupuesto:', err)
    // Si no podemos verificar el presupuesto, no arriesgamos gasto no acotado.
    return null
  }

  const model = process.env.LEAD_ANALYSIS_MODEL || 'gemini-2.5-flash'

  try {
    const client = await getAuth().getClient()
    const tokenResp = await client.getAccessToken()
    const accessToken =
      typeof tokenResp === 'string' ? tokenResp : tokenResp?.token
    if (!accessToken) throw new Error('sin access token de Vertex')

    const host =
      vertexLocation === 'global'
        ? 'aiplatform.googleapis.com'
        : `${vertexLocation}-aiplatform.googleapis.com`
    const url = `https://${host}/v1/projects/${gcpProject}/locations/${vertexLocation}/publishers/google/models/${model}:generateContent`

    const parts: Array<
      { text: string } | { inlineData: { mimeType: string; data: string } }
    > = [{ text: buildContextText(opts.lead) }]
    for (const f of analizables) {
      parts.push({ text: `--- Archivo adjunto: "${f.filename}" (${f.mimeType}) ---` })
      parts.push({
        inlineData: { mimeType: f.mimeType, data: f.content.toString('base64') },
      })
    }

    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts }],
      generationConfig: {
        // Sin "thinking": los modelos 2.5-flash lo activan por defecto y se
        // comen el presupuesto de salida, truncando el JSON. Todo el budget va
        // al reporte estructurado.
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 2048,
        temperature: 0.4,
        topP: 0.95,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '')
      console.warn(`[lead-analysis] Vertex ${resp.status}: ${errText.slice(0, 300)}`)
      return null
    }

    const data = (await resp.json()) as {
      candidates?: Array<{
        finishReason?: string
        content?: { parts?: Array<{ text?: string }> }
      }>
      usageMetadata?: {
        promptTokenCount?: number
        candidatesTokenCount?: number
      }
    }

    // Registrar gasto (no bloquear el flujo si falla).
    const usage = data.usageMetadata || {}
    registrarUso(
      usage.promptTokenCount ?? 0,
      usage.candidatesTokenCount ?? 0,
    ).catch((e) => console.warn('[lead-analysis] registrarUso falló:', e))

    const rawText = (data.candidates?.[0]?.content?.parts || [])
      .map((p) => p?.text || '')
      .join('')
      .trim()
    if (!rawText) return null

    const parsed = JSON.parse(rawText) as Partial<LeadAnalysisReport>
    if (!parsed || typeof parsed.resumenEjecutivo !== 'string') return null

    return {
      resumenEjecutivo: parsed.resumenEjecutivo,
      tipoEstructura: parsed.tipoEstructura || '—',
      alcanceAparente: parsed.alcanceAparente || '—',
      sistemaEstructural: parsed.sistemaEstructural || undefined,
      puntosRelevantes: Array.isArray(parsed.puntosRelevantes)
        ? parsed.puntosRelevantes
        : [],
      riesgosODudas: Array.isArray(parsed.riesgosODudas)
        ? parsed.riesgosODudas
        : [],
      preguntasParaCliente: Array.isArray(parsed.preguntasParaCliente)
        ? parsed.preguntasParaCliente
        : [],
      analisisPorArchivo: Array.isArray(parsed.analisisPorArchivo)
        ? parsed.analisisPorArchivo.filter(
            (a) => a && typeof a.archivo === 'string',
          )
        : [],
      archivosNoAnalizados: noAnalizados,
    }
  } catch (err) {
    console.warn('[lead-analysis] error analizando adjuntos:', err)
    return null
  }
}

import { GoogleAuth } from 'google-auth-library'
import { chatConfig } from './config'

/**
 * Cliente de Gemini vía Vertex AI (REST). Auth con service account usando
 * google-auth-library (mismo patrón que el cliente de Gmail DWD).
 *
 * El modelo es intercambiable por env (VERTEX_MODEL): toda la app habla con
 * esta función, así cambiar de Gemini 3.1 Flash-Lite a 2.5 o a otro es 1 línea.
 *
 * Credenciales (en este orden): VERTEX_SA_* o, si no existen, las de Gmail
 * (GOOGLE_SERVICE_ACCOUNT_*). La SA debe tener el rol roles/aiplatform.user.
 */

let cachedAuth: GoogleAuth | null = null

function getAuth(): GoogleAuth {
  if (cachedAuth) return cachedAuth
  const email =
    process.env.VERTEX_SA_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey =
    process.env.VERTEX_SA_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !rawKey) {
    throw new Error(
      'Faltan credenciales de service account para Vertex AI (VERTEX_SA_* o GOOGLE_SERVICE_ACCOUNT_*)',
    )
  }
  cachedAuth = new GoogleAuth({
    credentials: { client_email: email, private_key: rawKey.replace(/\\n/g, '\n') },
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  })
  return cachedAuth
}

export interface ChatTurn {
  rol: 'user' | 'assistant'
  contenido: string
}

export interface GeminiResult {
  texto: string
  tokensInput: number
  tokensOutput: number
  bloqueado: boolean
}

export async function generarRespuesta(opts: {
  system: string
  historial: ChatTurn[]
  mensajeUsuario: string
}): Promise<GeminiResult> {
  const { gcpProject, vertexLocation, vertexModel, maxOutputTokens } = chatConfig
  if (!gcpProject) throw new Error('GCP_PROJECT_ID no configurado')

  const client = await getAuth().getClient()
  const tokenResp = await client.getAccessToken()
  const accessToken = typeof tokenResp === 'string' ? tokenResp : tokenResp?.token
  if (!accessToken) throw new Error('No se pudo obtener access token de Vertex AI')

  const host =
    vertexLocation === 'global'
      ? 'aiplatform.googleapis.com'
      : `${vertexLocation}-aiplatform.googleapis.com`
  const url = `https://${host}/v1/projects/${gcpProject}/locations/${vertexLocation}/publishers/google/models/${vertexModel}:generateContent`

  const contents = [
    ...opts.historial.map((t) => ({
      role: t.rol === 'assistant' ? 'model' : 'user',
      parts: [{ text: t.contenido }],
    })),
    { role: 'user', parts: [{ text: opts.mensajeUsuario }] },
  ]

  const body = {
    systemInstruction: { parts: [{ text: opts.system }] },
    contents,
    generationConfig: {
      maxOutputTokens,
      temperature: 0.3,
      topP: 0.95,
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
    throw new Error(`Vertex AI ${resp.status}: ${errText.slice(0, 500)}`)
  }

  const data = (await resp.json()) as {
    candidates?: Array<{
      finishReason?: string
      content?: { parts?: Array<{ text?: string }> }
    }>
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number }
    promptFeedback?: { blockReason?: string }
  }

  const usage = data.usageMetadata || {}
  const tokensInput = usage.promptTokenCount ?? 0
  const tokensOutput = usage.candidatesTokenCount ?? 0

  const cand = data.candidates?.[0]
  const finish = cand?.finishReason
  const texto = (cand?.content?.parts || [])
    .map((p) => p?.text || '')
    .join('')
    .trim()

  const bloqueado =
    !texto &&
    (finish === 'SAFETY' ||
      finish === 'BLOCKLIST' ||
      finish === 'PROHIBITED_CONTENT' ||
      !!data.promptFeedback?.blockReason)

  return { texto, tokensInput, tokensOutput, bloqueado }
}

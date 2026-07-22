import { GoogleAuth } from "google-auth-library"

export type ColaboradorFirestore = {
  id: string
  cedula: string | null
  nombre: string
  cargo: string | null
  area: string | null
}

type FirestoreValue = {
  stringValue?: string
  booleanValue?: boolean
  integerValue?: string
}

type FirestoreDocument = {
  name?: string
  fields?: Record<string, FirestoreValue>
}

let cachedAuth: GoogleAuth | null = null
let cache: { expiresAt: number; items: ColaboradorFirestore[] } | null = null

function getAuth() {
  if (cachedAuth) return cachedAuth
  const rawJson = process.env.FIRESTORE_SA_KEY_JSON
  const firestoreEmail = process.env.FIRESTORE_SA_EMAIL
  const firestoreRawKey = process.env.FIRESTORE_SA_PRIVATE_KEY

  const scopes = ["https://www.googleapis.com/auth/datastore"]

  if (rawJson) {
    const credentials = JSON.parse(rawJson) as { client_email?: string; private_key?: string }
    if (!credentials.client_email || !credentials.private_key) {
      throw new Error("FIRESTORE_SA_KEY_JSON no contiene client_email/private_key")
    }
    cachedAuth = new GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key.replace(/\\n/g, "\n"),
      },
      scopes,
    })
    return cachedAuth
  }

  if (firestoreEmail && firestoreRawKey) {
    cachedAuth = new GoogleAuth({
      credentials: {
        client_email: firestoreEmail,
        private_key: firestoreRawKey.replace(/\\n/g, "\n"),
      },
      scopes,
    })
    return cachedAuth
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    cachedAuth = new GoogleAuth({ scopes })
    return cachedAuth
  }

  const email = process.env.VERTEX_SA_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey =
    process.env.VERTEX_SA_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  cachedAuth = email && rawKey
    ? new GoogleAuth({
        credentials: { client_email: email, private_key: rawKey.replace(/\\n/g, "\n") },
        scopes,
      })
    : new GoogleAuth({ scopes })
  return cachedAuth
}

function stringField(fields: Record<string, FirestoreValue>, ...names: string[]) {
  for (const name of names) {
    const value = fields[name]?.stringValue?.trim()
    if (value) return value
  }
  return null
}

function booleanField(fields: Record<string, FirestoreValue>, name: string) {
  return fields[name]?.booleanValue
}

function isActive(fields: Record<string, FirestoreValue>) {
  const estado = (stringField(fields, "estado", "status") || "").toLowerCase()
  const activo = booleanField(fields, "activo")
  if (["inactivo", "inactive", "retirado"].includes(estado) || activo === false) return false
  if (["activo", "active"].includes(estado) || activo === true) return true
  return !estado && activo === undefined
}

function mapDocument(doc: FirestoreDocument): ColaboradorFirestore | null {
  const fields = doc.fields || {}
  if (!isActive(fields)) return null

  const nombreCompleto = stringField(fields, "nombreCompleto")
  const nombres = stringField(fields, "nombre", "nombres")
  const apellidos = [
    stringField(fields, "apellido", "apellidos", "primerApellido"),
    stringField(fields, "segundoApellido"),
  ].filter(Boolean)
  const nombre = nombreCompleto || [nombres, ...apellidos].filter(Boolean).join(" ").trim()
  if (!nombre) return null

  const id = doc.name?.split("/").pop()
  if (!id) return null

  return {
    id,
    cedula: stringField(fields, "cedula") || (/^\d+$/.test(id) ? id : null),
    nombre,
    cargo: stringField(fields, "cargo"),
    area: stringField(fields, "area", "departamento", "ubicacion", "planta", "sede"),
  }
}

export async function listarColaboradoresActivos(): Promise<ColaboradorFirestore[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.items

  const projectId =
    process.env.FIRESTORE_COLABORADORES_PROJECT_ID ||
    process.env.GCP_PROJECT_ID ||
    "produccion-reportes"
  const client = await getAuth().getClient()
  const tokenResponse = await client.getAccessToken()
  const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token
  if (!token) throw new Error("No se pudo autenticar la consulta de colaboradores")

  const fieldPaths = [
    "nombreCompleto", "nombre", "nombres", "apellido", "apellidos", "primerApellido",
    "segundoApellido", "cedula", "cargo", "area", "departamento", "ubicacion", "planta",
    "sede", "estado", "status", "activo",
  ]
  const items: ColaboradorFirestore[] = []
  let pageToken = ""

  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/colaboradores`,
    )
    url.searchParams.set("pageSize", "1000")
    if (pageToken) url.searchParams.set("pageToken", pageToken)
    for (const path of fieldPaths) url.searchParams.append("mask.fieldPaths", path)

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      throw new Error(`Firestore colaboradores ${response.status}: ${detail.slice(0, 300)}`)
    }
    const data = (await response.json()) as {
      documents?: FirestoreDocument[]
      nextPageToken?: string
    }
    for (const document of data.documents || []) {
      const item = mapDocument(document)
      if (item) items.push(item)
    }
    pageToken = data.nextPageToken || ""
  } while (pageToken)

  items.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }))
  cache = { expiresAt: Date.now() + 5 * 60_000, items }
  return items
}

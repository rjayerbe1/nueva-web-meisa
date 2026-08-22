import { JWT } from "google-auth-library"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { normalizarNombre } from "@/lib/talento/nombres"

/**
 * Sincronización entre la carpeta de hojas de vida de Talento Humano en Google
 * Drive y el banco de candidatos de /admin/talento. Dos direcciones:
 *
 *   Drive → plataforma : lo que TH deja en la carpeta entra al banco.
 *   plataforma → Drive : los CV que llegan por la web se copian a la carpeta,
 *                        para que TH deje de bajarlos y re-subirlos a mano.
 *
 * DEDUPLICACIÓN: la clave es que NO alcanza con el fileId de Drive. La misma
 * persona puede llegar por la web y además tener su CV subido a mano a Drive
 * (pasó con 5 proyectistas y 2 soldadores); si solo miramos el fileId, se crea
 * un candidato duplicado. Por eso se resuelve la PERSONA (correo → teléfono →
 * nombre normalizado) antes de decidir si crear o vincular.
 *
 * HABEAS DATA: cada copia en Drive queda registrada en `driveFileId` del
 * candidato para que la purga por retención pueda borrarla también. Sin ese
 * registro la supresión quedaría a medias (Ley 1581/2012).
 */

const CV_MIMES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

export const DRIVE_ROOT_TALENTO =
  process.env.TALENTO_DRIVE_FOLDER_ID || "17NzVpxzQwgyqdRJed6IVQCGkY1q4ATSc"

/** Subcarpeta donde caen las postulaciones que entran por la web. */
export const DRIVE_SUBCARPETA_WEB =
  process.env.TALENTO_DRIVE_WEB_FOLDER || "POSTULACIONES WEB"

/**
 * Nombre de subcarpeta de Drive → `areaInteres` del banco. Se compara en
 * MAYÚSCULAS y sin tildes contra cada tramo de la ruta, del más profundo al
 * más superficial (así "/SSTA/JUNIO 2026/CALI" resuelve a SST por el tramo
 * SSTA). Lo que no calce queda en null y se reporta, en vez de inventar un
 * área nueva y ensuciar los pools.
 */
const MAPA_AREAS: Record<string, string> = {
  ARMADOR: "Armador",
  ARQUITECTO: "Arquitecto",
  AYUDANTE: "Ayudante",
  DIBUJANTE: "Dibujante",
  INGENIEROS: "Ingeniería",
  INGENIERIA: "Ingeniería",
  MECANICO: "Mecánico",
  "OFICIOS VARIOS": "Oficios Varios",
  PROYECTISTAS: "Diseño",
  PROYECTISTA: "Diseño",
  // Decisión del dueño (31-jul-2026): Sistemas no es un pool propio.
  SISTEMAS: "Oficios Varios",
  SOLDADOR: "Soldador",
  SSTA: "SST",
  SST: "SST",
  ADMINISTRATIVA: "Administrativa",
  FABRICACION: "Fabricación",
}

function sinTildes(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function areaDesdeRuta(ruta: string): string | null {
  const tramos = ruta.split("/").filter(Boolean).reverse()
  for (const tramo of tramos) {
    const clave = sinTildes(tramo).trim().toUpperCase()
    if (MAPA_AREAS[clave]) return MAPA_AREAS[clave]
  }
  return null
}

/** Área → subcarpeta de Drive (dirección inversa, para el espejo). */
export function carpetaDesdeArea(area: string | null): string | null {
  if (!area) return null
  const objetivo = sinTildes(area).toUpperCase()
  for (const [carpeta, mapeada] of Object.entries(MAPA_AREAS)) {
    if (sinTildes(mapeada).toUpperCase() === objetivo) return carpeta
  }
  return null
}

// --------------------------------------------------------------------------
// Drive API (DWD). El scope completo `drive` ya está autorizado para la SA:
// hace falta escritura para el espejo, `drive.file` NO está habilitado.
// --------------------------------------------------------------------------

let cachedToken: { token: string; expira: number } | null = null

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expira > Date.now()) return cachedToken.token
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n")
  if (!email || !key) throw new Error("Faltan GOOGLE_SERVICE_ACCOUNT_* para el sync de Drive")
  const jwt = new JWT({
    email,
    key,
    subject: process.env.TALENTO_DRIVE_SUBJECT || "rjayerbe@meisa.com.co",
    scopes: ["https://www.googleapis.com/auth/drive"],
  })
  const { token } = await jwt.getAccessToken()
  if (!token) throw new Error("No se pudo obtener token de Drive (DWD)")
  // Margen de 5 min sobre la vida típica del token (1 h).
  cachedToken = { token, expira: Date.now() + 55 * 60 * 1000 }
  return token
}

async function driveFetch(url: string, init?: RequestInit): Promise<Response> {
  const token = await getToken()
  return fetch(url, {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
  })
}

export interface ArchivoDrive {
  id: string
  name: string
  mimeType: string
  size?: string
  modifiedTime?: string
  /** Ruta de carpetas relativa a la raíz, ej. "/SSTA/JUNIO 2026/CALI". */
  ruta: string
}

async function listarHijos(folderId: string) {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`)
  const url =
    `https://www.googleapis.com/drive/v3/files?q=${q}` +
    `&fields=files(id,name,mimeType,size,modifiedTime)&pageSize=1000` +
    `&supportsAllDrives=true&includeItemsFromAllDrives=true`
  const r = await driveFetch(url)
  if (!r.ok) throw new Error(`Drive list ${r.status}: ${(await r.text()).slice(0, 300)}`)
  return (await r.json()).files as Array<Omit<ArchivoDrive, "ruta">>
}

/** Recorre la carpeta COMPLETA (recursivo) y devuelve solo los CV. */
export async function listarCvsRecursivo(
  folderId = DRIVE_ROOT_TALENTO,
  ruta = "",
): Promise<ArchivoDrive[]> {
  const out: ArchivoDrive[] = []
  for (const f of await listarHijos(folderId)) {
    if (f.mimeType === "application/vnd.google-apps.folder") {
      out.push(...(await listarCvsRecursivo(f.id, `${ruta}/${f.name.trim()}`)))
    } else if (CV_MIMES.has(f.mimeType)) {
      out.push({ ...f, ruta })
    }
  }
  return out
}

export async function descargarArchivo(fileId: string): Promise<Buffer> {
  const r = await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
  )
  if (!r.ok) throw new Error(`Drive download ${r.status}`)
  return Buffer.from(await r.arrayBuffer())
}

/** Devuelve el id de la subcarpeta, creándola si no existe. */
export async function asegurarCarpeta(nombre: string, padreId = DRIVE_ROOT_TALENTO): Promise<string> {
  const q = encodeURIComponent(
    `'${padreId}' in parents and name='${nombre.replace(/'/g, "\\'")}' ` +
      `and mimeType='application/vnd.google-apps.folder' and trashed=false`,
  )
  const r = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id)&supportsAllDrives=true&includeItemsFromAllDrives=true`,
  )
  if (r.ok) {
    const { files } = await r.json()
    if (files?.length) return files[0].id
  }
  const cr = await driveFetch(
    "https://www.googleapis.com/drive/v3/files?supportsAllDrives=true&fields=id",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nombre,
        mimeType: "application/vnd.google-apps.folder",
        parents: [padreId],
      }),
    },
  )
  if (!cr.ok) throw new Error(`Drive mkdir ${cr.status}: ${(await cr.text()).slice(0, 200)}`)
  return (await cr.json()).id as string
}

/** Sube un archivo a Drive (multipart) y devuelve su fileId. */
export async function subirArchivo(
  contenido: Buffer,
  nombre: string,
  mimeType: string,
  carpetaId: string,
): Promise<string> {
  const boundary = `=_drv_${Date.now().toString(36)}`
  const meta = JSON.stringify({ name: nombre, parents: [carpetaId] })
  const cuerpo = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n` +
        `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`,
      "utf8",
    ),
    contenido,
    Buffer.from(`\r\n--${boundary}--\r\n`, "utf8"),
  ])
  const r = await driveFetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id",
    {
      method: "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body: cuerpo,
    },
  )
  if (!r.ok) throw new Error(`Drive upload ${r.status}: ${(await r.text()).slice(0, 200)}`)
  return (await r.json()).id as string
}

/** Borra un archivo de Drive. `true` si quedó borrado o ya no existía. */
export async function borrarArchivo(fileId: string): Promise<boolean> {
  const r = await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true`,
    { method: "DELETE" },
  )
  return r.ok || r.status === 404
}

// --------------------------------------------------------------------------
// Resolución de persona (el corazón del dedup)
// --------------------------------------------------------------------------

export type Coincidencia = {
  candidatoId: string
  nombre: string
  /** Por qué se consideró la misma persona — se registra para auditoría. */
  criterio: "fileId" | "email" | "telefono" | "nombre"
  /** true si el criterio es débil y conviene que lo confirme un humano. */
  dudoso: boolean
}

/** Correos del propio dominio: no identifican a un candidato. */
export function esCorreoInterno(email: string | null | undefined): boolean {
  const dominio = (process.env.MEISA_DOMINIO_INTERNO || "meisa.com.co").toLowerCase()
  return (email ?? "").toLowerCase().trim().endsWith(`@${dominio}`)
}

function soloDigitos(t: string | null | undefined): string {
  return (t ?? "").replace(/\D/g, "").slice(-10)
}

/**
 * Busca si un CV ya corresponde a alguien del banco.
 * Orden de confianza: fileId ya importado > correo > teléfono > nombre exacto.
 * El match SOLO por nombre se marca `dudoso`: homónimos existen y fusionar dos
 * personas distintas es peor que dejar un duplicado para revisión.
 */
export async function resolverCandidato(datos: {
  fileId?: string
  email?: string | null
  telefono?: string | null
  nombre?: string | null
}): Promise<Coincidencia | null> {
  if (datos.fileId) {
    const porFile = await prisma.candidato.findFirst({
      where: { origenDetalle: { contains: datos.fileId } },
      select: { id: true, nombre: true },
    })
    if (porFile) {
      return { candidatoId: porFile.id, nombre: porFile.nombre, criterio: "fileId", dudoso: false }
    }
  }

  // El correo de la EMPRESA no identifica a nadie: Talento Humano registra
  // candidatos a mano poniendo su propio buzón (nomina@meisa.com.co aparece en
  // dos personas distintas). Usarlo para deduplicar fusionaría desconocidos.
  if (datos.email && !esCorreoInterno(datos.email)) {
    const porEmail = await prisma.candidato.findFirst({
      where: { email: { equals: datos.email.trim(), mode: "insensitive" } },
      select: { id: true, nombre: true },
    })
    if (porEmail) {
      return { candidatoId: porEmail.id, nombre: porEmail.nombre, criterio: "email", dudoso: false }
    }
  }

  const tel = soloDigitos(datos.telefono)
  if (tel.length >= 7) {
    // Prisma no normaliza teléfonos; se comparan los últimos 10 dígitos en memoria
    // sobre el subconjunto que tiene teléfono (el banco es de cientos, no millones).
    const conTel = await prisma.candidato.findMany({
      where: { telefono: { not: null } },
      select: { id: true, nombre: true, telefono: true },
    })
    const hit = conTel.find((c) => soloDigitos(c.telefono) === tel)
    if (hit) {
      return { candidatoId: hit.id, nombre: hit.nombre, criterio: "telefono", dudoso: false }
    }
  }

  if (datos.nombre) {
    const tokens = tokensNombre(datos.nombre)
    if (tokens.length >= 2) {
      const todos = await prisma.candidato.findMany({ select: { id: true, nombre: true } })
      const hit = todos.find((c) => mismoNombre(tokens, tokensNombre(c.nombre)))
      if (hit) {
        return { candidatoId: hit.id, nombre: hit.nombre, criterio: "nombre", dudoso: true }
      }
    }
  }

  return null
}

/** Tokens comparables de un nombre: sin tildes, mayúsculas, sin iniciales sueltas. */
function tokensNombre(nombre: string): string[] {
  return sinTildes(nombre)
    .toUpperCase()
    .replace(/[^A-Z\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2)
}

/**
 * ¿Son la misma persona? Los nombres de archivo de TH y los que escribe el
 * candidato en la web casi nunca coinciden exacto: "ISABEL TRUJILLO SAMBONI"
 * vs "Isabella Trujillo Samboni", "DIEGO VARGAS" vs "Diego Fernando Vargas
 * Gandelman", "CASTAÑEDA" vs "Castaneda". Se considera match cuando TODOS los
 * tokens del nombre más corto aparecen en el más largo (con tolerancia de
 * prefijo para diminutivos/variantes), exigiendo al menos 2 tokens.
 *
 * Es deliberadamente permisivo porque todo match por nombre se marca `dudoso`
 * y va a revisión humana: el costo de un falso positivo aquí es una línea de
 * más en un reporte, no una fusión de dos personas distintas.
 */
function mismoNombre(a: string[], b: string[]): boolean {
  const [corto, largo] = a.length <= b.length ? [a, b] : [b, a]
  if (corto.length < 2) return false
  return corto.every((t) =>
    largo.some((u) => t === u || (t.length >= 4 && u.length >= 4 && (u.startsWith(t) || t.startsWith(u)))),
  )
}

/** Anota en el candidato que este archivo de Drive le corresponde. */
export async function vincularArchivo(candidatoId: string, fileId: string, ruta: string) {
  const c = await prisma.candidato.findUnique({
    where: { id: candidatoId },
    select: { origenDetalle: true },
  })
  const marca = `drive:${fileId}`
  if (c?.origenDetalle?.includes(marca)) return
  const previo = c?.origenDetalle ? `${c.origenDetalle} · ` : ""
  await prisma.candidato.update({
    where: { id: candidatoId },
    data: { origenDetalle: `${previo}${marca}${ruta ? ` (${ruta})` : ""}` },
  })
}

// --------------------------------------------------------------------------
// Dirección Drive → plataforma
// --------------------------------------------------------------------------

export type AccionImport =
  | { tipo: "vincular"; archivo: ArchivoDrive; area: string | null; match: Coincidencia }
  | { tipo: "crear"; archivo: ArchivoDrive; area: string | null }
  | { tipo: "revisar"; archivo: ArchivoDrive; area: string | null; match: Coincidencia }
  | { tipo: "sin-area"; archivo: ArchivoDrive; area: null }

export interface PlanImport {
  total: number
  yaImportados: number
  acciones: AccionImport[]
}

/**
 * Calcula qué haría el sync SIN escribir nada. Es la base del `--dry-run` y
 * también lo que ejecuta el job: primero se decide, después se aplica.
 *
 * OJO: en esta fase solo se puede deduplicar por lo que se sabe SIN abrir el
 * PDF (nombre de archivo y ruta). El correo/teléfono reales salen del análisis
 * IA, que ocurre después de crear el candidato — por eso el dedup fuerte
 * (email/teléfono) protege sobre todo a los que YA están en el banco con datos
 * completos, que es exactamente el caso de las postulaciones web.
 */
export async function planificarImport(
  archivos?: ArchivoDrive[],
): Promise<PlanImport> {
  const cvs = archivos ?? (await listarCvsRecursivo())
  const acciones: AccionImport[] = []
  let yaImportados = 0

  for (const archivo of cvs) {
    const area = areaDesdeRuta(archivo.ruta)
    const nombreProbable = limpiarNombreArchivo(archivo.name)
    const match = await resolverCandidato({
      fileId: archivo.id,
      nombre: nombreProbable,
    })

    if (match?.criterio === "fileId") {
      yaImportados++
      continue
    }
    if (match && !match.dudoso) {
      acciones.push({ tipo: "vincular", archivo, area, match })
    } else if (match) {
      acciones.push({ tipo: "revisar", archivo, area, match })
    } else if (!area) {
      acciones.push({ tipo: "sin-area", archivo, area: null })
    } else {
      acciones.push({ tipo: "crear", archivo, area })
    }
  }

  return { total: cvs.length, yaImportados, acciones }
}

/** Deriva un nombre de persona legible desde el nombre del archivo. */
export function limpiarNombreArchivo(fileName: string): string {
  return fileName
    .replace(/\.(pdf|docx?)$/i, "")
    .replace(/\bH\.?\s*de\s*vida\b/gi, "")
    .replace(/\bhoja de vida\b/gi, "")
    .replace(/\bHV\.?\b/gi, "")
    .replace(/\bCV\b/gi, "")
    .replace(/\bING\.?\b/gi, "")
    .replace(/\bPROFESIONAL\b/gi, "")
    .replace(/\bTECNOLOG[OA]\b/gi, "")
    .replace(/\(\d+\)/g, "")
    .replace(/\b20\d{2}\b/g, "")
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Sube a las columnas del candidato lo que la IA extrajo del PDF.
 *
 * `analizarCvCandidato` solo guarda `datosIA`; sin este paso el registro queda
 * con el nombre derivado del archivo ("1000622496", "H Devidajhonnym") y sin
 * correo. Además de verse mal, rompe la deduplicación futura: si esa persona
 * aplica después por la web, sin el correo cargado no hay con qué cruzarla y
 * se crea un duplicado.
 *
 * El nombre de la IA gana sobre el del archivo (viene del contenido del CV).
 * Correo/teléfono/ciudad solo se llenan si están vacíos: nunca se pisa un dato
 * que escribió la propia persona.
 */
export async function promoverDatosIA(candidatoId: string): Promise<boolean> {
  const c = await prisma.candidato.findUnique({
    where: { id: candidatoId },
    select: { datosIA: true, nombre: true, email: true, telefono: true, ciudad: true },
  })
  const d = (c?.datosIA ?? null) as {
    nombre?: string
    email?: string
    telefono?: string
    ciudad?: string
  } | null
  if (!d) return false

  const data: Record<string, string> = {}
  if (d.nombre?.trim()) data.nombre = normalizarNombre(d.nombre.trim())
  if (!c?.email && d.email?.trim()) data.email = d.email.trim().toLowerCase()
  if (!c?.telefono && d.telefono?.trim()) data.telefono = d.telefono.trim()
  if (!c?.ciudad && d.ciudad?.trim()) data.ciudad = normalizarNombre(d.ciudad.trim())

  if (Object.keys(data).length === 0) return false
  await prisma.candidato.update({ where: { id: candidatoId }, data })
  return true
}

/**
 * Área del pool a partir de una vacante.
 *
 * Las vacantes guardan `area` a nivel DEPARTAMENTO ("Producción", "Calidad"),
 * pero el banco y las subcarpetas de Drive están organizados por OFICIO
 * ("Soldador", "Ayudante", "Armador"). Si copiáramos el área de la vacante tal
 * cual, un soldador y un pintor caerían en el mismo saco y el espejo a Drive
 * no sabría a qué subcarpeta mandarlos. Por eso se intenta primero deducir el
 * oficio del TÍTULO, y solo si no se reconoce se cae al área de la vacante.
 */
export function areaDesdeVacante(
  titulo: string | null | undefined,
  areaVacante?: string | null,
): string | null {
  if (titulo) {
    const t = sinTildes(titulo).toUpperCase()
    // Claves más largas primero: "OFICIOS VARIOS" antes que sus palabras sueltas.
    const claves = Object.keys(MAPA_AREAS).sort((a, b) => b.length - a.length)
    for (const clave of claves) {
      if (t.includes(clave)) return MAPA_AREAS[clave]
    }
  }
  return areaVacante ?? null
}

// --------------------------------------------------------------------------
// Dirección plataforma → Drive (el espejo)
// --------------------------------------------------------------------------

export interface ResultadoEspejo {
  candidatoId: string
  nombre: string
  carpeta: string
  driveFileId: string
}

/**
 * Copia a Drive los CV que entraron por la web y todavía no están espejados.
 *
 * Va en el job periódico y NO en la ruta de postulación a propósito: subir a
 * Drive dentro del request le sumaría segundos al candidato que está enviando
 * el formulario, y Cloud Run no permite terminarlo en background. Como efecto
 * secundario queda reintentable solo — si una subida falla, el candidato sigue
 * sin `driveFileId` y el siguiente ciclo lo toma.
 *
 * El archivo espejado se marca además con `drive:<fileId>` en origenDetalle,
 * que es la misma marca que usa la importación: así el recorrido de vuelta lo
 * reconoce como ya conocido y no se genera un ciclo Drive→plataforma→Drive.
 */
export async function espejarPendientes(limite = 20): Promise<ResultadoEspejo[]> {
  const { downloadCv } = await import("@/lib/talento/gcs-hv")

  const pendientes = await prisma.candidato.findMany({
    where: { origen: "web", cvPathGcs: { not: null }, driveFileId: null },
    select: {
      id: true,
      nombre: true,
      areaInteres: true,
      cvPathGcs: true,
      cvFileName: true,
      cvContentType: true,
      origenDetalle: true,
    },
    orderBy: { createdAt: "asc" },
    take: limite,
  })

  const hechos: ResultadoEspejo[] = []
  for (const c of pendientes) {
    try {
      // Si esta persona YA tiene un archivo en Drive (porque TH lo subió a mano
      // antes de que existiera el espejo, y la importación lo vinculó), se
      // ADOPTA ese archivo en vez de subir otro. Sin esto quedan dos copias del
      // mismo CV en la misma subcarpeta — pasó con 3 proyectistas en la primera
      // corrida. Adoptarlo además deja la copia vieja cubierta por la purga.
      const yaEnDrive = c.origenDetalle?.match(/drive:([A-Za-z0-9_-]+)/)
      if (yaEnDrive) {
        await prisma.candidato.update({
          where: { id: c.id },
          data: { driveFileId: yaEnDrive[1], driveSyncedAt: new Date() },
        })
        continue
      }

      // Sin área (espontáneas) van a una subcarpeta propia en vez de quedar
      // sueltas en la raíz, que es donde TH pierde las cosas.
      const carpeta = carpetaDesdeArea(c.areaInteres) ?? DRIVE_SUBCARPETA_WEB
      const carpetaId = await asegurarCarpeta(carpeta)
      const ext = (c.cvFileName?.match(/\.[a-z0-9]+$/i)?.[0] ?? ".pdf").toLowerCase()
      const nombreArchivo = `${c.nombre}${ext}`

      const buf = await downloadCv(c.cvPathGcs!)
      const fileId = await subirArchivo(
        buf,
        nombreArchivo,
        c.cvContentType || "application/pdf",
        carpetaId,
      )

      const marca = `drive:${fileId} (/${carpeta})`
      await prisma.candidato.update({
        where: { id: c.id },
        data: {
          driveFileId: fileId,
          driveSyncedAt: new Date(),
          origenDetalle: c.origenDetalle ? `${c.origenDetalle} · ${marca}` : marca,
        },
      })
      hechos.push({ candidatoId: c.id, nombre: c.nombre, carpeta, driveFileId: fileId })
    } catch (e) {
      console.error(`[drive-sync] espejo falló para ${c.nombre}:`, (e as Error).message)
    }
  }
  return hechos
}

/**
 * Segunda pasada de deduplicación, DESPUÉS de que la IA leyó el PDF.
 *
 * Al importar desde Drive solo se conoce el nombre del ARCHIVO, que a veces no
 * dice nada ("H.devidajhonnyM.pdf", "1000622496.pdf"). Recién cuando la IA
 * extrae el correo real se puede saber si esa persona ya estaba en el banco —
 * y para entonces el candidato ya fue creado. Sin esta pasada quedan
 * duplicados invisibles: pasó exactamente con ese archivo, que resultó ser
 * alguien registrado diez días antes.
 *
 * Si detecta que el recién creado es un duplicado, conserva el registro VIEJO
 * (tiene la historia: postulaciones, etapas, notas), le traslada la referencia
 * al archivo de Drive y borra el nuevo junto con su copia del CV en el bucket.
 * Devuelve el id del candidato que sobrevive.
 */
export async function fusionarSiDuplicado(candidatoNuevoId: string): Promise<{
  fusionado: boolean
  conservadoId: string
  nombre?: string
}> {
  const { deleteCv } = await import("@/lib/talento/gcs-hv")

  const nuevo = await prisma.candidato.findUnique({
    where: { id: candidatoNuevoId },
    select: {
      id: true,
      nombre: true,
      email: true,
      telefono: true,
      origenDetalle: true,
      cvPathGcs: true,
      areaInteres: true,
      createdAt: true,
    },
  })
  if (!nuevo?.email || esCorreoInterno(nuevo.email)) {
    return { fusionado: false, conservadoId: candidatoNuevoId }
  }

  const previo = await prisma.candidato.findFirst({
    where: {
      id: { not: nuevo.id },
      email: { equals: nuevo.email, mode: "insensitive" },
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, nombre: true, origenDetalle: true, areaInteres: true },
  })
  if (!previo) return { fusionado: false, conservadoId: candidatoNuevoId }

  // El archivo de Drive que traía el nuevo pasa a colgar del registro viejo,
  // para que siga siendo rastreable (y purgable).
  const marca = nuevo.origenDetalle?.match(/drive:[A-Za-z0-9_-]+(\s\([^)]*\))?/)?.[0]
  await prisma.candidato.update({
    where: { id: previo.id },
    data: {
      origenDetalle:
        marca && !previo.origenDetalle?.includes(marca)
          ? `${previo.origenDetalle ? `${previo.origenDetalle} · ` : ""}${marca}`
          : previo.origenDetalle,
      areaInteres: previo.areaInteres ?? nuevo.areaInteres,
    },
  })

  if (nuevo.cvPathGcs) await deleteCv(nuevo.cvPathGcs)
  await prisma.candidato.delete({ where: { id: nuevo.id } })

  console.log(
    `[drive-sync] duplicado fusionado: "${nuevo.nombre}" (nuevo) → "${previo.nombre}" (${nuevo.email})`,
  )
  return { fusionado: true, conservadoId: previo.id, nombre: previo.nombre }
}

/**
 * Analiza con IA los CV que todavía no tienen `datosIA`.
 *
 * Los que entran por Drive se analizan al importarlos, pero los que llegan por
 * la web NO: la ruta de postulación no puede hacerlo (Cloud Run estrangula la
 * CPU y le sumaría segundos al candidato que está enviando el formulario).
 * Resultado: de 9 postulantes a Proyectista, 8 estaban sin analizar y por lo
 * tanto no se les podía correr el match contra la vacante.
 *
 * Va en el mismo ciclo del sync, acotado, y es idempotente.
 */
export async function analizarPendientes(limite = 8): Promise<string[]> {
  const { analizarCvCandidato } = await import("@/lib/talento/ia")

  const pendientes = await prisma.candidato.findMany({
    where: { datosIA: { equals: Prisma.DbNull }, cvPathGcs: { not: null } },
    select: { id: true, nombre: true },
    orderBy: { createdAt: "desc" },
    take: limite,
  })

  const hechos: string[] = []
  for (const c of pendientes) {
    try {
      await analizarCvCandidato(c.id)
      await promoverDatosIA(c.id)
      hechos.push(c.nombre)
    } catch (e) {
      // Un PDF ilegible o el tope de gasto de IA no deben tumbar el ciclo.
      console.error(`[drive-sync] análisis falló para ${c.nombre}:`, (e as Error).message)
    }
  }
  return hechos
}

/**
 * Evalúa contra la matriz del cargo las postulaciones que aún no tienen puntaje.
 *
 * El ciclo ya analizaba los CV, pero el MATCH contra la vacante solo ocurría si
 * alguien apretaba el botón en el admin o se corría el script. Resultado: los
 * candidatos nuevos le aparecían a Talento Humano sin calificación y sin forma
 * de saber si servían — pasó con 7 seguidos.
 *
 * Solo toma postulaciones con vacante (las espontáneas no tienen contra qué
 * compararse), con el CV ya analizado y que no estén descartadas.
 *
 * Si se agota el presupuesto de IA (tope compartido con el chatbot) corta el
 * lote en seco en vez de seguir intentando: cada intento fallido igual gasta
 * una llamada, y el siguiente ciclo lo retoma cuando el tope se renueve.
 */
export async function evaluarPendientes(limite = 8): Promise<{
  evaluadas: string[]
  sinPresupuesto: boolean
}> {
  const { evaluarMatch, PresupuestoAgotadoError } = await import("@/lib/talento/ia")

  const pendientes = await prisma.postulacion.findMany({
    where: {
      scoreIA: null,
      vacanteId: { not: null },
      etapa: { not: "DESCARTADA" },
      candidato: { datosIA: { not: Prisma.DbNull } },
    },
    select: { id: true, candidato: { select: { nombre: true } }, vacante: { select: { titulo: true } } },
    orderBy: { createdAt: "desc" },
    take: limite,
  })

  const evaluadas: string[] = []
  for (const p of pendientes) {
    try {
      const m = await evaluarMatch(p.id)
      evaluadas.push(`${p.candidato.nombre} → ${p.vacante?.titulo} (${m.score})`)
    } catch (e) {
      if (e instanceof PresupuestoAgotadoError) {
        console.warn("[drive-sync] tope de gasto de IA alcanzado — se corta el lote de evaluación")
        return { evaluadas, sinPresupuesto: true }
      }
      // Vacante sin matriz, CV ilegible, etc.: no debe tumbar el ciclo.
      console.error(`[drive-sync] match falló para ${p.candidato.nombre}:`, (e as Error).message.slice(0, 120))
    }
  }
  return { evaluadas, sinPresupuesto: false }
}

/**
 * ⚠️ OBSOLETO — usar `scripts/sync-drive-talento.ts`.
 *
 * Este importador procesa UNA carpeta (sin recursión), exige el área a mano y
 * deduplica solo por fileId de Drive, así que vuelve a crear a quien ya está
 * en el banco por otra vía (pasó con 7 personas que habían entrado por la web
 * y por correo). Se conserva solo como referencia histórica.
 *
 * Importa hojas de vida desde una carpeta de Google Drive al banco de
 * candidatos de /admin/talento:
 *   1. Lista los PDFs de la carpeta (Drive API, DWD impersonando al usuario)
 *   2. Sube cada CV al bucket PRIVADO meisa-hojas-de-vida
 *   3. Crea el Candidato (sin postulación — es pool, no proceso activo)
 *   4. Lo analiza con IA: extrae nombre/contacto/certificaciones + resumen
 *
 * Idempotente: si ya existe un candidato con el mismo fileId de Drive en
 * origenDetalle, lo salta.
 *
 * Uso:
 *   npx tsx scripts/importar-cvs-drive.ts \
 *     --folder=1BD0iAE9JykETIT2VxNjoAnOCHvV4gxBI \
 *     --area=SST \
 *     --detalle="Carpeta Drive TH SSTA jul-2026" \
 *     [--subject=rjayerbe@meisa.com.co] [--sin-ia]
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env.local" })

function arg(name: string, def?: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split("=").slice(1).join("=") : def
}

function limpiarNombre(fileName: string): string {
  return fileName
    .replace(/\.pdf$/i, "")
    .replace(/\bHV\.?\b/gi, "")
    .replace(/\bPROFESIONAL\b/gi, "")
    .replace(/\bTECNOLOG[OA]\b/gi, "")
    .replace(/hoja de vida/gi, "")
    .replace(/docx?/gi, "")
    .replace(/\(\d+\)/g, "")
    .replace(/\b20\d{2}\b/g, "")
    .replace(/[._]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase())
}

function nivelDesdeNombre(fileName: string): string | null {
  if (/PROFESIONAL/i.test(fileName)) return "Profesional"
  if (/TECNOLOG/i.test(fileName)) return "Tecnólogo/a"
  return null
}

async function main() {
  const folderId = arg("folder")
  const area = arg("area", null as unknown as string)
  const detalle = arg("detalle", "Carpeta Drive TH")
  const subject = arg("subject", "rjayerbe@meisa.com.co")!
  const sinIA = process.argv.includes("--sin-ia")
  if (!folderId) {
    console.error("Falta --folder=<id de la carpeta de Drive>")
    process.exit(1)
  }

  const { prisma } = await import("../lib/prisma")
  const { uploadCv } = await import("../lib/talento/gcs-hv")
  const { analizarCvCandidato } = await import("../lib/talento/ia")
  const { normalizarNombre } = await import("../lib/talento/nombres")
  const { JWT } = await import("google-auth-library")

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n")
  if (!email || !key) throw new Error("Faltan GOOGLE_SERVICE_ACCOUNT_* en .env.local")

  const jwt = new JWT({
    email,
    key,
    subject,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  })
  const token = (await jwt.getAccessToken()).token
  if (!token) throw new Error("No se pudo obtener token de Drive (DWD)")
  const authHeaders = { Authorization: `Bearer ${token}` }

  // 1. Listar PDFs de la carpeta
  const listUrl =
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(`'${folderId}' in parents and trashed=false`)}` +
    `&fields=files(id,name,mimeType,size)&pageSize=200&supportsAllDrives=true&includeItemsFromAllDrives=true`
  const listResp = await fetch(listUrl, { headers: authHeaders })
  if (!listResp.ok) throw new Error(`Drive list ${listResp.status}: ${await listResp.text()}`)
  const { files } = (await listResp.json()) as {
    files: Array<{ id: string; name: string; mimeType: string; size?: string }>
  }
  const ALLOWED_MIMES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ])
  const pdfs = files.filter((f) => ALLOWED_MIMES.has(f.mimeType))
  console.log(`Carpeta ${folderId}: ${files.length} archivos, ${pdfs.length} CVs (pdf/doc)\n`)

  let creados = 0
  let saltados = 0
  let analizados = 0

  for (const f of pdfs) {
    const yaExiste = await prisma.candidato.findFirst({
      where: { origenDetalle: { contains: f.id } },
      select: { id: true, nombre: true },
    })
    if (yaExiste) {
      console.log(`↷ ya importado: ${f.name} (${yaExiste.nombre})`)
      saltados++
      continue
    }

    // 2. Descargar
    const dl = await fetch(
      `https://www.googleapis.com/drive/v3/files/${f.id}?alt=media&supportsAllDrives=true`,
      { headers: authHeaders },
    )
    if (!dl.ok) {
      console.error(`✗ error descargando ${f.name}: HTTP ${dl.status}`)
      continue
    }
    const buffer = Buffer.from(await dl.arrayBuffer())

    // 3. Subir al bucket privado + crear candidato (pool: SIN postulación)
    const up = await uploadCv(buffer, f.name, f.mimeType)
    const nivel = nivelDesdeNombre(f.name)
    const candidato = await prisma.candidato.create({
      data: {
        nombre: limpiarNombre(f.name) || f.name,
        cvPathGcs: up.pathGcs,
        cvFileName: up.fileName,
        cvContentType: up.contentType,
        cvSize: up.size,
        origen: "otro",
        origenDetalle: `${detalle} · drive:${f.id}`,
        areaInteres: area || null,
        consentimientoVia: "entregado-a-th",
        notas: nivel ? `Nivel: ${nivel} (según carpeta TH)` : null,
      },
    })
    creados++
    console.log(`✓ importado: ${f.name} → ${candidato.nombre}`)

    // 4. Análisis IA + completar contacto desde el CV
    if (!sinIA) {
      try {
        const datos = await analizarCvCandidato(candidato.id)
        await prisma.candidato.update({
          where: { id: candidato.id },
          data: {
            ...(datos.nombre ? { nombre: normalizarNombre(datos.nombre) } : {}),
            ...(datos.email ? { email: datos.email } : {}),
            ...(datos.telefono ? { telefono: datos.telefono } : {}),
            ...(datos.ciudad ? { ciudad: normalizarNombre(datos.ciudad) } : {}),
          },
        })
        analizados++
        console.log(`  ⚡ IA: ${datos.nombre ?? "(sin nombre)"} · ${datos.oficios?.join(", ") ?? "—"}`)
      } catch (e: any) {
        console.error(`  ⚠ IA falló para ${f.name}: ${e.message}`)
      }
    }
  }

  console.log(`\nResumen: ${creados} creados · ${saltados} saltados · ${analizados} analizados con IA`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

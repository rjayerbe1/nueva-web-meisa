/**
 * Escanea toda la DB en busca de campos con paths "/images/*" o "/videos/*" rotos
 * tras la migración a GCS (commit 7f8a0a7), recupera los archivos de git history
 * y los sube a GCS, luego actualiza las URLs en la DB.
 *
 * Uso:
 *   npx tsx scripts/recover-broken-image-refs.ts            # dry-run
 *   npx tsx scripts/recover-broken-image-refs.ts --commit
 */
import { execFileSync } from "node:child_process"
import { prisma } from "../lib/prisma"
import { uploadToGcs } from "../lib/media/gcs"
import { ensureFolderPath } from "../lib/media/folder-repo"

const SOURCE_COMMIT = "7f8a0a7^"
const REPO_DIR = "/Users/rjayerbe/Web Development Local/meisa.com.co/nueva-web-meisa"
const COMMIT = process.argv.includes("--commit")

function readFromGit(commitPath: string): Buffer | null {
  try {
    return execFileSync("git", ["show", commitPath], {
      cwd: REPO_DIR,
      maxBuffer: 100 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    })
  } catch {
    return null
  }
}

function contentTypeFromExt(p: string): string {
  const ext = p.toLowerCase().split(".").pop() ?? ""
  const map: Record<string, string> = {
    webp: "image/webp",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    mp4: "video/mp4",
    mov: "video/quicktime",
    webm: "video/webm",
  }
  return map[ext] ?? "application/octet-stream"
}

function gcsFolderForPath(path: string): string {
  // /images/clients/x.webp → "clientes"
  // /images/iconos-animados/x.gif → "iconos-animados"
  // /images/projects/x.jpg → "projects"
  // /images/heroes/x.webp → "heroes"
  // /videos/intro.mp4 → "videos"
  if (path.startsWith("/videos/")) return "videos"
  const parts = path.split("/").filter(Boolean) // ["images", "clients", "x.webp"]
  if (parts.length >= 3 && parts[0] === "images") {
    if (parts[1] === "clients") return "clientes"
    return parts[1] // iconos-animados, heroes, etc.
  }
  return "general"
}

interface FieldDef {
  modelKey: string
  delegate: any
  fields: string[]
}

const SCAN: FieldDef[] = [
  { modelKey: "TimelineHito", delegate: prisma.timelineHito, fields: ["icono"] },
  { modelKey: "Certificacion", delegate: prisma.certificacion, fields: ["icono", "imagen"] },
  { modelKey: "Norma", delegate: prisma.norma, fields: ["icono"] },
  { modelKey: "CompanyValue", delegate: prisma.companyValue, fields: ["icono", "imagen"] },
  { modelKey: "Plant", delegate: prisma.plant, fields: ["imagen"] },
  { modelKey: "Servicio", delegate: prisma.servicio, fields: ["icono", "imagen"] },
  { modelKey: "ProcesoFase", delegate: prisma.procesoFase, fields: ["icono", "imagen"] },
  { modelKey: "Tecnologia", delegate: prisma.tecnologia, fields: ["icono", "imagen"] },
  { modelKey: "Equipo", delegate: prisma.equipo, fields: ["imagen"] },
  { modelKey: "ProcesoDigital", delegate: prisma.procesoDigital, fields: ["icono", "imagen"] },
  { modelKey: "Politica", delegate: prisma.politica, fields: ["icono", "imagen"] },
  { modelKey: "PilarSIG", delegate: prisma.pilarSIG, fields: ["icono", "imagen"] },
  { modelKey: "GrupoSeccion", delegate: prisma.grupoSeccion, fields: ["icono"] },
  { modelKey: "ConfiguracionEmpresa", delegate: prisma.configuracionEmpresa, fields: ["misionIcono", "visionIcono"] },
  { modelKey: "HomeHeroEspecialidad", delegate: prisma.homeHeroEspecialidad, fields: ["imagen", "imagenMobile", "video", "videoMobile"] },
  { modelKey: "HomeStat", delegate: prisma.homeStat, fields: ["icono"] },
  { modelKey: "HomeFeaturedProject", delegate: prisma.homeFeaturedProject, fields: ["imagen"] },
  { modelKey: "HomeServicioDestacado", delegate: prisma.homeServicioDestacado, fields: ["icono", "imagen"] },
  { modelKey: "MenuItem", delegate: prisma.menuItem, fields: ["icono"] },
  { modelKey: "FooterLink", delegate: prisma.footerLink, fields: ["icono"] },
  { modelKey: "SocialLink", delegate: prisma.socialLink, fields: ["icono"] },
  { modelKey: "Brochure", delegate: prisma.brochure, fields: ["thumbnail", "pdfUrl"] },
  { modelKey: "ImagenProyecto", delegate: prisma.imagenProyecto, fields: ["url", "urlOptimized"] },
  { modelKey: "DocumentoProyecto", delegate: prisma.documentoProyecto, fields: ["url"] },
]

interface BrokenRef {
  modelKey: string
  id: string
  field: string
  oldPath: string
}

async function main() {
  console.log(`Mode: ${COMMIT ? "COMMIT" : "DRY-RUN"}\n`)

  const broken: BrokenRef[] = []

  for (const def of SCAN) {
    let rows: any[] = []
    try {
      rows = await def.delegate.findMany({})
    } catch (e) {
      console.warn(`⚠️  No pude leer ${def.modelKey}: ${(e as Error).message}`)
      continue
    }
    for (const r of rows) {
      for (const f of def.fields) {
        const v = r[f]
        if (typeof v !== "string") continue
        if (!v) continue
        if (v.startsWith("/images/") || v.startsWith("/videos/")) {
          broken.push({ modelKey: def.modelKey, id: r.id, field: f, oldPath: v })
        }
      }
    }
  }

  // Group by model+field for printing
  console.log(`Referencias rotas encontradas: ${broken.length}\n`)
  const grouped = new Map<string, BrokenRef[]>()
  for (const b of broken) {
    const k = `${b.modelKey}.${b.field}`
    if (!grouped.has(k)) grouped.set(k, [])
    grouped.get(k)!.push(b)
  }
  for (const [k, arr] of [...grouped.entries()].sort()) {
    console.log(`  ${k.padEnd(40)} ${arr.length} ref${arr.length > 1 ? "s" : ""}`)
  }

  // Dedupe by oldPath (same file referenced multiple times)
  const uniquePaths = [...new Set(broken.map((b) => b.oldPath))].sort()
  console.log(`\nArchivos únicos a recuperar: ${uniquePaths.length}\n`)

  // Check git for each unique path
  const gcsByOldPath = new Map<string, string>() // oldPath → new GCS URL
  let inGit = 0
  let notInGit: string[] = []

  for (const oldPath of uniquePaths) {
    const gitPath = `${SOURCE_COMMIT}:public${oldPath}`
    const buf = readFromGit(gitPath)
    if (!buf) {
      notInGit.push(oldPath)
      continue
    }
    inGit++

    if (!COMMIT) {
      gcsByOldPath.set(oldPath, "<would-upload>")
      console.log(`  · ${oldPath} — ${(buf.byteLength / 1024).toFixed(1)}KB → ${gcsFolderForPath(oldPath)}/`)
      continue
    }

    const folder = gcsFolderForPath(oldPath)
    await ensureFolderPath(folder)
    const fileName = oldPath.split("/").pop()!
    const ct = contentTypeFromExt(fileName)
    const up = await uploadToGcs(buf, fileName, ct, folder)
    gcsByOldPath.set(oldPath, up.url)
    console.log(`  ✅ ${oldPath} → ${up.url}`)

    // Best-effort register in Media pool
    try {
      const kind = ct.startsWith("video/") ? "VIDEO" : ct.startsWith("image/") ? "IMAGE" : "DOC"
      await prisma.media.create({
        data: {
          url: up.url,
          pathGcs: up.pathGcs,
          fileName: up.fileName,
          contentType: ct,
          kind,
          size: up.size,
          folder,
          title: fileName.replace(/\.[^.]+$/, ""),
          tags: ["recovered-from-git", folder],
        },
      })
    } catch {
      /* duplicate ok */
    }
  }

  if (notInGit.length) {
    console.log(`\n❌ No están en git history (${notInGit.length}):`)
    for (const p of notInGit) console.log(`  · ${p}`)
  }

  if (!COMMIT) {
    console.log(`\n(sin --commit no se modifica nada)`)
    await prisma.$disconnect()
    return
  }

  // Update DB references
  console.log(`\n━━━ Actualizando referencias en DB ━━━\n`)
  let updated = 0
  let skippedMissing = 0
  for (const b of broken) {
    const newUrl = gcsByOldPath.get(b.oldPath)
    if (!newUrl) {
      skippedMissing++
      continue
    }
    const def = SCAN.find((s) => s.modelKey === b.modelKey)!
    await def.delegate.update({
      where: { id: b.id },
      data: { [b.field]: newUrl },
    })
    updated++
  }

  console.log(`Filas actualizadas: ${updated}`)
  console.log(`Skipeadas (archivo no estaba en git): ${skippedMissing}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

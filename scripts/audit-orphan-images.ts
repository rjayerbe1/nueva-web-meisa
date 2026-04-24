/**
 * Auditoría profunda: cruza imágenes que existieron en git history
 * (/public/images/projects/**) contra los Proyecto en DB.
 *
 * Produce:
 *   - Proyectos EN DB sin imágenes pero con archivos en git history → recuperables
 *   - Imágenes en git history sin proyecto que las referencie → huérfanas
 *   - Proyectos con imágenes en DB pero que podrían tener MÁS en git
 *
 * Uso:
 *   npx tsx scripts/audit-orphan-images.ts
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })
import { execSync } from "node:child_process"
import { prisma } from "../lib/prisma"

interface GitImage {
  path: string
  filename: string
  projectFolder: string // carpeta directa padre
  projectFolderParent: string // carpeta 2-niveles arriba (categoria)
  baseName: string // nombre sin -NxN-dim
  isCanonical: boolean // sin sufijo NxN
}

function stripDim(s: string): string {
  return s.replace(/-\d{3,4}x\d{3,4}$/i, "")
}

function analyzeImage(fullPath: string): GitImage | null {
  // Ej: public/images/projects/puentes-vehiculares/puente-vehicular-saraconcho/puente-vehicular-saraconcho-01-...-400x400.webp
  const parts = fullPath.split("/")
  const filename = parts[parts.length - 1]
  if (!/\.(webp|jpg|jpeg|png)$/i.test(filename)) return null

  const projectFolder = parts[parts.length - 2] ?? ""
  const projectFolderParent = parts[parts.length - 3] ?? ""
  const nameNoExt = filename.replace(/\.(webp|jpg|jpeg|png)$/i, "")
  const baseName = stripDim(nameNoExt)
  const isCanonical = !/\d{3,4}x\d{3,4}$/i.test(nameNoExt)

  return {
    path: fullPath,
    filename,
    projectFolder,
    projectFolderParent,
    baseName,
    isCanonical,
  }
}

async function main() {
  console.log(`\n🔍 Auditoría de imágenes huérfanas en git history\n`)

  // 1) Obtener TODOS los archivos que alguna vez estuvieron en public/images/projects/**
  const rawFiles = execSync(
    `git log --all --full-history --diff-filter=AD --name-only --format= -- 'public/images/projects/**/*.webp' 'public/images/projects/**/*.jpg' 'public/images/projects/**/*.jpeg' 'public/images/projects/**/*.png'`,
    { cwd: process.cwd(), maxBuffer: 50 * 1024 * 1024 },
  )
    .toString()
    .split("\n")
    .filter((l) => l.trim().length > 0)

  // Deduplicar
  const uniquePaths = Array.from(new Set(rawFiles))

  console.log(`📦 Archivos únicos en git history: ${uniquePaths.length}`)

  const images = uniquePaths
    .map(analyzeImage)
    .filter((x): x is GitImage => x !== null)

  // 2) Agrupar por projectFolder (el nombre del slug típicamente)
  const byFolder = new Map<string, GitImage[]>()
  for (const img of images) {
    if (!byFolder.has(img.projectFolder)) byFolder.set(img.projectFolder, [])
    byFolder.get(img.projectFolder)!.push(img)
  }

  console.log(`📁 Carpetas de proyecto distintas: ${byFolder.size}\n`)

  // 3) Traer todos los proyectos + imágenes actuales
  const proyectos = await prisma.proyecto.findMany({
    select: { id: true, slug: true, titulo: true, categoria: true, _count: { select: { imagenes: true } } },
  })

  const bySlug = new Map(proyectos.map((p) => [p.slug, p]))

  // Set de nombres-base de archivos que SÍ están actualmente en DB
  const imagesInDb = await prisma.imagenProyecto.findMany({
    select: { url: true },
  })
  const dbBaseNames = new Set(
    imagesInDb.map((i) => {
      const filename = i.url.split("/").pop()?.split("?")[0] ?? ""
      return stripDim(filename.replace(/\.(webp|png|jpe?g)$/i, ""))
    }),
  )

  // 4) Categorizar carpetas git
  const matched: Array<{
    folderName: string
    proyecto: (typeof proyectos)[number]
    imagesInGit: number
    imagesInDb: number
    recoverable: GitImage[]
  }> = []
  const orphanFolders: Array<{ folderName: string; images: GitImage[] }> = []

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .split("-")
      .filter((t) => t.length > 4) // tokens significativos

  for (const [folder, imgs] of byFolder) {
    const exactMatch = bySlug.get(folder)
    let proyecto: (typeof proyectos)[number] | undefined = exactMatch

    if (!proyecto) {
      // Fase 1: slug contiene folder name o folder contiene slug name
      const containment = proyectos.filter(
        (p) =>
          p.slug.endsWith("-" + folder) ||
          p.slug.includes(folder) ||
          (folder.length > 5 && folder.includes(p.slug)),
      )
      if (containment.length === 1) proyecto = containment[0]
    }

    if (!proyecto) {
      // Fase 2: token matching (mínimo 1 token significativo común + mayor score único)
      const folderTokens = new Set(normalize(folder))
      if (folderTokens.size > 0) {
        const scored = proyectos
          .map((p) => {
            const tokens = new Set([...normalize(p.slug), ...normalize(p.titulo)])
            let score = 0
            for (const t of folderTokens) if (tokens.has(t)) score++
            return { p, score }
          })
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score)

        if (scored.length > 0 && (scored.length === 1 || scored[0].score > scored[1].score)) {
          proyecto = scored[0].p
        }
      }
    }

    if (proyecto) {
      // Filtrar canonical images (sin dim) y de las dim mayores por cada baseName
      const canonicalOnly = imgs.filter((i) => i.isCanonical)
      const missing = canonicalOnly.filter(
        (i) => !dbBaseNames.has(i.baseName),
      )
      matched.push({
        folderName: folder,
        proyecto,
        imagesInGit: canonicalOnly.length,
        imagesInDb: proyecto._count.imagenes,
        recoverable: missing,
      })
    } else {
      orphanFolders.push({ folderName: folder, images: imgs })
    }
  }

  // 5) Proyectos DB sin imágenes que tengan archivos recuperables
  const recoverable = matched
    .filter((m) => m.recoverable.length > 0)
    .sort((a, b) => b.recoverable.length - a.recoverable.length)

  console.log(`\n═══════════════════════════════════════════════════════`)
  console.log(`🎯 PROYECTOS CON IMÁGENES RECUPERABLES (${recoverable.length})`)
  console.log(`═══════════════════════════════════════════════════════\n`)
  for (const r of recoverable) {
    console.log(`📦 ${r.proyecto.titulo}`)
    console.log(`   slug: ${r.proyecto.slug} · cat: ${r.proyecto.categoria}`)
    console.log(`   DB: ${r.imagesInDb} imgs · Git: ${r.imagesInGit} canónicas · A recuperar: ${r.recoverable.length}`)
    for (const img of r.recoverable.slice(0, 5)) {
      console.log(`     · ${img.filename}`)
    }
    if (r.recoverable.length > 5) console.log(`     ...y ${r.recoverable.length - 5} más`)
    console.log()
  }

  // 6) Carpetas huérfanas (no matchean con ningún proyecto)
  console.log(`\n═══════════════════════════════════════════════════════`)
  console.log(`⚠️  CARPETAS GIT SIN MATCH CON PROYECTO (${orphanFolders.length})`)
  console.log(`═══════════════════════════════════════════════════════\n`)
  for (const o of orphanFolders.slice(0, 30)) {
    const canonicalCount = o.images.filter((i) => i.isCanonical).length
    console.log(`📂 ${o.folderName} (${canonicalCount} canónicas, ${o.images.length} total)`)
  }
  if (orphanFolders.length > 30) {
    console.log(`\n...y ${orphanFolders.length - 30} carpetas más`)
  }

  console.log(`\n📊 Resumen:`)
  console.log(`   Proyectos con recuperables: ${recoverable.length}`)
  console.log(`   Total imágenes recuperables: ${recoverable.reduce((s, r) => s + r.recoverable.length, 0)}`)
  console.log(`   Carpetas huérfanas: ${orphanFolders.length}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

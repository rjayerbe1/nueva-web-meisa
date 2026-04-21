/**
 * Script de reconciliación — importa URLs de imágenes/videos existentes en
 * los modelos del sitio al pool central `Media`. Es idempotente: si una URL
 * ya existe en Media (por su `url` único) la salta.
 *
 * Uso: npx tsx scripts/reconcile-media-pool.ts
 *
 * Prerrequisito: el modelo Media debe existir en la DB (correr `npm run db:push`
 * después de agregar Media a prisma/schema.prisma).
 */
import { prisma } from "../lib/prisma"
import { MediaKind, Prisma } from "@prisma/client"
import { pathFromPublicUrl } from "../lib/media/gcs"

type Source = {
  model: string
  folder: string
  urls: (string | null | undefined)[]
  kind?: MediaKind
}

function inferKind(url: string): MediaKind {
  const lower = url.toLowerCase()
  if (/\.(mp4|mov|webm|avi|m4v)(\?|$)/.test(lower)) return MediaKind.VIDEO
  if (/\.(pdf|doc|docx)(\?|$)/.test(lower)) return MediaKind.DOC
  return MediaKind.IMAGE
}

function guessContentType(url: string, kind: MediaKind): string {
  const lower = url.toLowerCase()
  if (kind === MediaKind.VIDEO) {
    if (lower.endsWith(".mp4")) return "video/mp4"
    if (lower.endsWith(".mov")) return "video/quicktime"
    if (lower.endsWith(".webm")) return "video/webm"
    return "video/mp4"
  }
  if (kind === MediaKind.DOC) return "application/pdf"
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg"
  if (lower.endsWith(".png")) return "image/png"
  if (lower.endsWith(".webp")) return "image/webp"
  if (lower.endsWith(".gif")) return "image/gif"
  return "image/jpeg"
}

async function collectSources(): Promise<Source[]> {
  const sources: Source[] = []

  const plants = await prisma.plant.findMany({ select: { imagen: true } })
  sources.push({ model: "Plant", folder: "empresa", urls: plants.map((p) => p.imagen) })

  const valores = await prisma.companyValue.findMany({ select: { imagen: true } })
  sources.push({ model: "CompanyValue", folder: "empresa", urls: valores.map((v) => v.imagen) })

  const certs = await prisma.certificacion.findMany({ select: { logo: true } })
  sources.push({ model: "Certificacion", folder: "empresa", urls: certs.map((c) => c.logo) })

  const normas = await prisma.norma.findMany({ select: { logo: true } })
  sources.push({ model: "Norma", folder: "empresa", urls: normas.map((n) => n.logo) })

  const tecnologias = await prisma.tecnologia.findMany({ select: { imagen: true } })
  sources.push({ model: "Tecnologia", folder: "procesos-tecnologias", urls: tecnologias.map((t) => t.imagen) })

  const equipos = await prisma.equipo.findMany({ select: { imagen: true } })
  sources.push({ model: "Equipo", folder: "procesos-tecnologias", urls: equipos.map((e) => e.imagen) })

  const procesos = await prisma.procesoDigital.findMany({ select: { imagen: true } })
  sources.push({ model: "ProcesoDigital", folder: "procesos-tecnologias", urls: procesos.map((p) => p.imagen) })

  const politicas = await prisma.politica.findMany({ select: { imagen: true, documentoUrl: true } })
  sources.push({ model: "Politica:imagen", folder: "politicas", urls: politicas.map((p) => p.imagen) })
  sources.push({
    model: "Politica:documento",
    folder: "politicas-docs",
    urls: politicas.map((p) => p.documentoUrl),
    kind: MediaKind.DOC,
  })

  const lideres = await prisma.configuracionEmpresa.findUnique({
    where: { id: "default" },
    select: { liderQuoteImagen: true },
  })
  if (lideres?.liderQuoteImagen) {
    sources.push({ model: "ConfiguracionEmpresa", folder: "empresa", urls: [lideres.liderQuoteImagen] })
  }

  const featured = await prisma.homeFeaturedProject.findUnique({
    where: { id: "default" },
    select: { imagen: true },
  })
  if (featured?.imagen) {
    sources.push({ model: "HomeFeaturedProject", folder: "home", urls: [featured.imagen] })
  }

  const servHome = await prisma.homeServicioDestacado.findMany({
    select: { imagen: true, video: true },
  })
  sources.push({ model: "HomeServicio:imagen", folder: "home", urls: servHome.map((s) => s.imagen) })
  sources.push({
    model: "HomeServicio:video",
    folder: "home",
    urls: servHome.map((s) => s.video),
    kind: MediaKind.VIDEO,
  })

  const menuItems = await prisma.menuItem.findMany({ select: { imagen: true } })
  sources.push({ model: "MenuItem", folder: "navegacion", urls: menuItems.map((m) => m.imagen) })

  const fases = await prisma.procesoFase.findMany({ select: { imagen: true } })
  sources.push({ model: "ProcesoFase", folder: "servicios", urls: fases.map((f) => f.imagen) })

  // PilarSIG no tiene campo imagen en el schema actual — skipeado.

  return sources
}

async function main() {
  console.log("🔍 Reconciliando pool Media con URLs existentes…\n")

  const sources = await collectSources()
  let imported = 0
  let skipped = 0
  let failed = 0

  for (const src of sources) {
    const unique = Array.from(new Set(src.urls.filter(Boolean))) as string[]
    for (const url of unique) {
      const existing = await prisma.media.findUnique({ where: { url } })
      if (existing) {
        skipped++
        continue
      }

      const kind = src.kind ?? inferKind(url)
      const contentType = guessContentType(url, kind)
      const pathGcs = pathFromPublicUrl(url)
      const fileName = url.split("/").pop()?.split("?")[0] ?? "unknown"

      try {
        await prisma.media.create({
          data: {
            url,
            pathGcs,
            fileName,
            contentType,
            kind,
            size: 0,
            folder: src.folder,
            altText: null,
            tags: [src.model],
          } satisfies Prisma.MediaCreateInput,
        })
        imported++
        console.log(`  ✅ [${src.model}] ${fileName}`)
      } catch (e) {
        failed++
        console.warn(`  ⚠️  [${src.model}] ${fileName}: ${(e as Error).message}`)
      }
    }
  }

  console.log("\n📊 Resumen:")
  console.log(`  Importadas: ${imported}`)
  console.log(`  Saltadas (ya existían): ${skipped}`)
  console.log(`  Fallidas: ${failed}`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

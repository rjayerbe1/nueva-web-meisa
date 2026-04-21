/**
 * Script de reconciliación — importa URLs de imágenes/videos/documentos
 * existentes en los modelos del sitio al pool central `Media`.
 *
 * Es idempotente: si una URL ya existe en Media (url @unique) la salta.
 *
 * Uso: npx tsx scripts/reconcile-media-pool.ts
 */
import { prisma } from "../lib/prisma"
import { MediaKind, Prisma } from "@prisma/client"
import { pathFromPublicUrl } from "../lib/media/gcs"
import fs from "node:fs"
import path from "node:path"

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

/** Extrae URLs strings de un valor Json arbitrario (array, objeto, string). */
function extractUrlsFromJson(value: unknown): string[] {
  const out: string[] = []
  const walk = (v: unknown) => {
    if (v == null) return
    if (typeof v === "string") {
      const trimmed = v.trim()
      if (trimmed && /^(https?:\/\/|\/)/.test(trimmed)) {
        // Heurística: parece URL o path absoluto. Evita strings de 1-2 caracteres.
        if (/\.(jpe?g|png|gif|webp|avif|svg|mp4|mov|webm|pdf)(\?|$)/i.test(trimmed)) {
          out.push(trimmed)
        }
      }
      return
    }
    if (Array.isArray(v)) {
      v.forEach(walk)
      return
    }
    if (typeof v === "object") {
      Object.values(v as Record<string, unknown>).forEach(walk)
    }
  }
  walk(value)
  return out
}

async function collectSources(): Promise<Source[]> {
  const sources: Source[] = []

  /* ── Empresa ── */
  sources.push({
    model: "Plant",
    folder: "empresa",
    urls: (await prisma.plant.findMany({ select: { imagen: true } })).map((p) => p.imagen),
  })
  sources.push({
    model: "CompanyValue",
    folder: "empresa",
    urls: (await prisma.companyValue.findMany({ select: { imagen: true } })).map(
      (v) => v.imagen,
    ),
  })
  sources.push({
    model: "Certificacion:logo",
    folder: "empresa",
    urls: (await prisma.certificacion.findMany({ select: { logo: true } })).map((c) => c.logo),
  })
  sources.push({
    model: "Certificacion:doc",
    folder: "empresa-docs",
    urls: (await prisma.certificacion.findMany({ select: { documentoUrl: true } })).map(
      (c) => c.documentoUrl,
    ),
    kind: MediaKind.DOC,
  })
  sources.push({
    model: "Norma:logo",
    folder: "empresa",
    urls: (await prisma.norma.findMany({ select: { logo: true } })).map((n) => n.logo),
  })
  const empresaConfig = await prisma.configuracionEmpresa.findUnique({
    where: { id: "default" },
    select: { liderQuoteImagen: true },
  })
  if (empresaConfig?.liderQuoteImagen) {
    sources.push({
      model: "ConfiguracionEmpresa:lider",
      folder: "empresa",
      urls: [empresaConfig.liderQuoteImagen],
    })
  }

  /* ── Procesos y Tecnologías ── */
  sources.push({
    model: "Tecnologia",
    folder: "procesos-tecnologias",
    urls: (await prisma.tecnologia.findMany({ select: { imagen: true } })).map((t) => t.imagen),
  })
  sources.push({
    model: "Equipo",
    folder: "procesos-tecnologias",
    urls: (await prisma.equipo.findMany({ select: { imagen: true } })).map((e) => e.imagen),
  })
  sources.push({
    model: "ProcesoDigital",
    folder: "procesos-tecnologias",
    urls: (await prisma.procesoDigital.findMany({ select: { imagen: true } })).map(
      (p) => p.imagen,
    ),
  })

  /* ── Políticas ── */
  const politicas = await prisma.politica.findMany({
    select: { imagen: true, documentoUrl: true },
  })
  sources.push({
    model: "Politica:imagen",
    folder: "politicas",
    urls: politicas.map((p) => p.imagen),
  })
  sources.push({
    model: "Politica:doc",
    folder: "politicas-docs",
    urls: politicas.map((p) => p.documentoUrl),
    kind: MediaKind.DOC,
  })

  /* ── Home ── */
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
  sources.push({
    model: "HomeServicio:imagen",
    folder: "home",
    urls: servHome.map((s) => s.imagen),
  })
  sources.push({
    model: "HomeServicio:video",
    folder: "home",
    urls: servHome.map((s) => s.video),
    kind: MediaKind.VIDEO,
  })

  /* ── Home hero (desde HomeSeccionConfig y ConfiguracionSitio) ── */
  const homeCopy = await prisma.homeSeccionConfig.findUnique({
    where: { id: "default" },
    select: { heroVideoDesktop: true, heroVideoMobile: true },
  })
  if (homeCopy?.heroVideoDesktop || homeCopy?.heroVideoMobile) {
    sources.push({
      model: "HomeSeccionConfig:hero-videos",
      folder: "home",
      urls: [homeCopy.heroVideoDesktop, homeCopy.heroVideoMobile],
      kind: MediaKind.VIDEO,
    })
  }

  // ConfiguracionSitio: clave='hero_images' guarda un JSON con 5+ URLs de imágenes del hero
  const heroConfig = await prisma.configuracionSitio.findUnique({
    where: { clave: "hero_images" },
  })
  if (heroConfig?.valor) {
    try {
      const parsed = JSON.parse(heroConfig.valor)
      sources.push({
        model: "ConfiguracionSitio:hero-images",
        folder: "home",
        urls: extractUrlsFromJson(parsed),
      })
    } catch {
      // ignore
    }
  }

  /* ── Servicios (catálogo completo) ── */
  const servicios = await prisma.servicio.findMany({
    select: {
      imagen: true,
      videoDemostrativo: true,
      imagenesGaleria: true,
    },
  })
  sources.push({
    model: "Servicio:imagen",
    folder: "servicios",
    urls: servicios.map((s) => s.imagen),
  })
  sources.push({
    model: "Servicio:video",
    folder: "servicios",
    urls: servicios.map((s) => s.videoDemostrativo),
    kind: MediaKind.VIDEO,
  })
  sources.push({
    model: "Servicio:galeria",
    folder: "servicios",
    urls: servicios.flatMap((s) => extractUrlsFromJson(s.imagenesGaleria)),
  })

  /* ── ProcesoFase ── */
  sources.push({
    model: "ProcesoFase",
    folder: "servicios",
    urls: (await prisma.procesoFase.findMany({ select: { imagen: true } })).map((f) => f.imagen),
  })

  /* ── Categorías de proyecto (hero de cada /proyectos?cat=...) ── */
  const cats = await prisma.categoriaProyecto.findMany({
    select: { imagenCover: true, imagenBanner: true, videoBanner: true, videoCover: true },
  })
  sources.push({
    model: "Categoria:cover",
    folder: "proyectos",
    urls: cats.map((c) => c.imagenCover),
  })
  sources.push({
    model: "Categoria:banner",
    folder: "proyectos",
    urls: cats.map((c) => c.imagenBanner),
  })
  sources.push({
    model: "Categoria:videoBanner",
    folder: "proyectos",
    urls: cats.map((c) => c.videoBanner),
    kind: MediaKind.VIDEO,
  })
  sources.push({
    model: "Categoria:videoCover",
    folder: "proyectos",
    urls: cats.map((c) => c.videoCover),
    kind: MediaKind.VIDEO,
  })

  /* ── Imágenes de proyectos (ImagenProyecto — el bulk de fotos del catálogo) ── */
  const imgsProyecto = await prisma.imagenProyecto.findMany({
    select: { url: true, urlOptimized: true },
  })
  sources.push({
    model: "ImagenProyecto:url",
    folder: "proyectos",
    urls: imgsProyecto.map((i) => i.url),
  })
  sources.push({
    model: "ImagenProyecto:optimized",
    folder: "proyectos",
    urls: imgsProyecto.map((i) => i.urlOptimized),
  })

  /* ── Documentos de proyecto ── */
  const docsProyecto = await prisma.documentoProyecto.findMany({ select: { url: true } })
  sources.push({
    model: "DocumentoProyecto",
    folder: "proyectos-docs",
    urls: docsProyecto.map((d) => d.url),
    kind: MediaKind.DOC,
  })

  /* ── HistoriaProyecto (imágenes de caso de éxito + video) ── */
  const historias = await prisma.historiaProyecto.findMany({
    select: {
      imagenDestacada: true,
      videoUrl: true,
      imagenesDesafio: true,
      imagenesSolucion: true,
      imagenesResultado: true,
      infografias: true,
    },
  })
  sources.push({
    model: "Historia:destacada",
    folder: "historias",
    urls: historias.map((h) => h.imagenDestacada),
  })
  sources.push({
    model: "Historia:video",
    folder: "historias",
    urls: historias.map((h) => h.videoUrl),
    kind: MediaKind.VIDEO,
  })
  sources.push({
    model: "Historia:json",
    folder: "historias",
    urls: historias.flatMap((h) => [
      ...extractUrlsFromJson(h.imagenesDesafio),
      ...extractUrlsFromJson(h.imagenesSolucion),
      ...extractUrlsFromJson(h.imagenesResultado),
      ...extractUrlsFromJson(h.infografias),
    ]),
  })

  /* ── ProyectoHojaVida (trayectoria) ── */
  const pHojaVida = await prisma.proyectoHojaVida.findMany({ select: { imagenes: true } })
  sources.push({
    model: "ProyectoHojaVida",
    folder: "trayectoria",
    urls: pHojaVida.flatMap((p) => extractUrlsFromJson(p.imagenes)),
  })

  /* ── Resúmenes de año (trayectoria) ── */
  const resumenes = await prisma.resumenAnio.findMany({
    select: { imagenesFeatured: true },
  })
  sources.push({
    model: "ResumenAnio",
    folder: "trayectoria",
    urls: resumenes.flatMap((r) => extractUrlsFromJson(r.imagenesFeatured)),
  })

  /* ── Clientes (logos) ── */
  const clientes = await prisma.cliente.findMany({
    select: { logo: true, logoBlanco: true },
  })
  sources.push({
    model: "Cliente:logo",
    folder: "clientes",
    urls: clientes.map((c) => c.logo),
  })
  sources.push({
    model: "Cliente:logoBlanco",
    folder: "clientes",
    urls: clientes.map((c) => c.logoBlanco),
  })

  /* ── Brochures ── */
  const brochures = await prisma.brochure.findMany({
    select: { thumbnail: true, pdfUrl: true },
  })
  sources.push({
    model: "Brochure:thumb",
    folder: "brochures",
    urls: brochures.map((b) => b.thumbnail),
  })
  sources.push({
    model: "Brochure:pdf",
    folder: "brochures",
    urls: brochures.map((b) => b.pdfUrl),
    kind: MediaKind.DOC,
  })

  /* ── BrochureTemplate thumbnail ── */
  const btemplates = await prisma.brochureTemplate.findMany({
    select: { thumbnail: true },
  })
  sources.push({
    model: "BrochureTemplate",
    folder: "brochures",
    urls: btemplates.map((b) => b.thumbnail),
  })

  /* ── Navegación (MenuItem) ── */
  sources.push({
    model: "MenuItem",
    folder: "navegacion",
    urls: (await prisma.menuItem.findMany({ select: { imagen: true } })).map((m) => m.imagen),
  })

  /* ── Archivos locales en /public/videos/ (recursivo) ── */
  sources.push(...scanLocalVideos())

  return sources
}

/**
 * Escanea /public/videos/ recursivamente y devuelve URLs relativas listas
 * para ir al pool. Los archivos se sirven como estáticos por Next.js en
 * la ruta /videos/... (sin /public prefix).
 */
function scanLocalVideos(): Source[] {
  const publicDir = path.join(process.cwd(), "public", "videos")
  if (!fs.existsSync(publicDir)) return []

  const urls: string[] = []
  const walk = (dir: string, prefix: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        walk(full, rel)
      } else if (/\.(mp4|mov|webm|avi|m4v)$/i.test(entry.name)) {
        urls.push(`/videos/${rel}`)
      }
    }
  }
  walk(publicDir, "")

  return [
    {
      model: "LocalFile:video",
      folder: "local-videos",
      urls,
      kind: MediaKind.VIDEO,
    },
  ]
}

async function main() {
  console.log("🔍 Reconciliando pool Media con URLs existentes…\n")

  const sources = await collectSources()
  let imported = 0
  let skipped = 0
  let failed = 0
  const importedByFolder: Record<string, number> = {}

  for (const src of sources) {
    const unique = Array.from(new Set(src.urls.filter(Boolean))) as string[]
    for (const url of unique) {
      // Skip data URLs (base64 inlined — no son URLs navegables; el índice
      // único de Media tiene límite ~2700 bytes por pg_btree).
      if (url.startsWith("data:")) {
        skipped++
        continue
      }
      // Skip URLs absurdas (posibles basura en DB).
      if (url.length > 2000) {
        skipped++
        continue
      }

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
        importedByFolder[src.folder] = (importedByFolder[src.folder] ?? 0) + 1
      } catch (e) {
        failed++
        console.warn(`  ⚠️  [${src.model}] ${fileName}: ${(e as Error).message}`)
      }
    }
  }

  const total = await prisma.media.count()
  const byKind = await prisma.media.groupBy({ by: ["kind"], _count: true })

  console.log("\n📊 Resumen:")
  console.log(`  Importadas en esta corrida: ${imported}`)
  console.log(`  Saltadas (ya existían):     ${skipped}`)
  console.log(`  Fallidas:                   ${failed}`)
  console.log(`\n📁 Por carpeta (esta corrida):`)
  for (const [folder, count] of Object.entries(importedByFolder).sort()) {
    console.log(`  ${folder.padEnd(25)} ${count}`)
  }
  console.log(`\n💾 Total en Media pool: ${total}`)
  for (const row of byKind) {
    console.log(`  ${row.kind.padEnd(6)} ${row._count}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

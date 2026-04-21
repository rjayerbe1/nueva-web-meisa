import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import sharp from "sharp"
import { MediaKind, Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { uploadToGcs } from "@/lib/media/gcs"

export const runtime = "nodejs"

const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"]
const DOC_TYPES = ["application/pdf"]

function kindFromMime(mime: string): MediaKind | null {
  if (IMAGE_TYPES.includes(mime)) return MediaKind.IMAGE
  if (VIDEO_TYPES.includes(mime)) return MediaKind.VIDEO
  if (DOC_TYPES.includes(mime)) return MediaKind.DOC
  return null
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_BYTES = 100 * 1024 * 1024
const MAX_DOC_BYTES = 20 * 1024 * 1024

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const kindParam = searchParams.get("kind")
    const folder = searchParams.get("folder")
    const q = searchParams.get("q")
    const limit = Math.min(Number(searchParams.get("limit")) || 60, 200)
    const cursor = searchParams.get("cursor")

    const where: Prisma.MediaWhereInput = {}
    if (kindParam && kindParam !== "any") {
      const kindValue = kindParam.toUpperCase() as keyof typeof MediaKind
      if (MediaKind[kindValue]) where.kind = MediaKind[kindValue]
    }
    if (folder) where.folder = folder
    if (q) {
      where.OR = [
        { fileName: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
        { altText: { contains: q, mode: "insensitive" } },
        { tags: { has: q } },
      ]
    }

    const items = await prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    })

    const hasMore = items.length > limit
    const slice = hasMore ? items.slice(0, limit) : items
    const nextCursor = hasMore ? slice[slice.length - 1]?.id ?? null : null

    return NextResponse.json({ items: slice, nextCursor })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

const uploadMetaSchema = z.object({
  folder: z.string().default("general"),
  altText: z.string().optional(),
  title: z.string().optional(),
  tags: z.string().optional(), // comma-separated
})

/** Schema para registrar una URL ya existente (sin re-upload) — p.ej. AI tools. */
const registerSchema = z.object({
  url: z.string().url(),
  folder: z.string().default("general"),
  altText: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  kind: z.nativeEnum(MediaKind).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const contentType = req.headers.get("content-type") ?? ""

    /* ── Variante JSON: registrar una URL existente sin re-upload ── */
    if (contentType.includes("application/json")) {
      const body = await req.json()
      const data = registerSchema.parse(body)

      const existing = await prisma.media.findUnique({ where: { url: data.url } })
      if (existing) return NextResponse.json(existing)

      const inferredKind =
        data.kind ??
        (/\.(mp4|mov|webm|avi)(\?|$)/i.test(data.url)
          ? MediaKind.VIDEO
          : /\.(pdf|doc|docx)(\?|$)/i.test(data.url)
            ? MediaKind.DOC
            : MediaKind.IMAGE)

      const fileName = data.url.split("/").pop()?.split("?")[0] ?? "registered"
      const pathGcs = data.url.startsWith("https://storage.googleapis.com/")
        ? data.url.replace(/^https:\/\/storage\.googleapis\.com\/[^/]+\//, "")
        : null

      const contentTypeGuess =
        inferredKind === MediaKind.VIDEO
          ? "video/mp4"
          : inferredKind === MediaKind.DOC
            ? "application/pdf"
            : "image/jpeg"

      const record = await prisma.media.create({
        data: {
          url: data.url,
          pathGcs,
          fileName,
          contentType: contentTypeGuess,
          kind: inferredKind,
          size: 0,
          folder: data.folder,
          altText: data.altText ?? null,
          title: data.title ?? null,
          tags: data.tags,
          uploadedById: session.user.id,
        },
      })
      return NextResponse.json(record, { status: 201 })
    }

    /* ── Variante multipart: subir archivo nuevo ── */
    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })
    }

    const kind = kindFromMime(file.type)
    if (!kind) {
      return NextResponse.json(
        { error: `Tipo de archivo no soportado: ${file.type}` },
        { status: 400 },
      )
    }

    const maxBytes =
      kind === MediaKind.IMAGE ? MAX_IMAGE_BYTES : kind === MediaKind.VIDEO ? MAX_VIDEO_BYTES : MAX_DOC_BYTES
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `Archivo demasiado grande (máx ${Math.round(maxBytes / 1024 / 1024)}MB).` },
        { status: 400 },
      )
    }

    const meta = uploadMetaSchema.parse({
      folder: form.get("folder") ?? "general",
      altText: form.get("altText") ?? undefined,
      title: form.get("title") ?? undefined,
      tags: form.get("tags") ?? undefined,
    })

    const buffer = Buffer.from(await file.arrayBuffer())

    // Extract image dimensions if applicable
    let width: number | undefined
    let height: number | undefined
    if (kind === MediaKind.IMAGE) {
      try {
        const info = await sharp(buffer).metadata()
        width = info.width
        height = info.height
      } catch (e) {
        console.warn("[media] sharp metadata failed:", e)
      }
    }

    const uploaded = await uploadToGcs(buffer, file.name, file.type, meta.folder)

    const tags = meta.tags
      ? meta.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : []

    const record = await prisma.media.create({
      data: {
        url: uploaded.url,
        pathGcs: uploaded.pathGcs,
        fileName: uploaded.fileName,
        contentType: uploaded.contentType,
        kind,
        size: uploaded.size,
        width,
        height,
        altText: meta.altText,
        title: meta.title,
        folder: meta.folder,
        tags,
        uploadedById: session.user.id,
      },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

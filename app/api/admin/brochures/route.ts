import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

export async function GET() {
  try {
    await requireAdmin()
    const brochures = await prisma.brochure.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        urlAmigable: true,
        pdfUrl: true,
        publicado: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
        categoria: { select: { id: true, nombre: true, slug: true } },
      },
    })
    return NextResponse.json(brochures)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()

    const titulo = String(body.titulo ?? "").trim()
    if (!titulo) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })
    }

    const pdfUrl = body.pdfUrl ? String(body.pdfUrl).trim() : null
    if (!pdfUrl) {
      return NextResponse.json({ error: "El PDF es obligatorio" }, { status: 400 })
    }

    const baseSlug = slugify(body.urlAmigable ? String(body.urlAmigable) : titulo)
    if (!baseSlug) {
      return NextResponse.json({ error: "URL amigable inválida" }, { status: 400 })
    }
    let urlAmigable = baseSlug
    let counter = 1
    while (await prisma.brochure.findUnique({ where: { urlAmigable } })) {
      urlAmigable = `${baseSlug}-${counter++}`
    }

    const categoriaId = body.categoriaId ? String(body.categoriaId) : null
    if (categoriaId) {
      const taken = await prisma.brochure.findUnique({ where: { categoriaId } })
      if (taken) {
        return NextResponse.json(
          { error: "Esa categoría ya tiene un brochure asignado." },
          { status: 400 },
        )
      }
    }

    const brochure = await prisma.brochure.create({
      data: {
        titulo,
        descripcion: body.descripcion ? String(body.descripcion).trim() || null : null,
        urlAmigable,
        pdfUrl,
        categoriaId,
        publicado: Boolean(body.publicado),
        activo: body.activo === undefined ? true : Boolean(body.activo),
      },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        urlAmigable: true,
        pdfUrl: true,
        publicado: true,
        activo: true,
        categoria: { select: { id: true, nombre: true } },
      },
    })

    return NextResponse.json(brochure, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

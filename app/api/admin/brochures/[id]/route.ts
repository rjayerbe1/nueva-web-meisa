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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const brochure = await prisma.brochure.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        urlAmigable: true,
        pdfUrl: true,
        categoriaId: true,
        publicado: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
        categoria: { select: { id: true, nombre: true, slug: true } },
      },
    })
    if (!brochure) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }
    return NextResponse.json(brochure)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const body = await req.json()

    const existing = await prisma.brochure.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }

    const titulo = body.titulo !== undefined ? String(body.titulo).trim() : existing.titulo
    if (!titulo) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })
    }

    const pdfUrl =
      body.pdfUrl !== undefined ? (body.pdfUrl ? String(body.pdfUrl).trim() : null) : existing.pdfUrl
    if (!pdfUrl) {
      return NextResponse.json({ error: "El PDF es obligatorio" }, { status: 400 })
    }

    let urlAmigable = existing.urlAmigable
    if (body.urlAmigable !== undefined) {
      const next = slugify(String(body.urlAmigable))
      if (!next) {
        return NextResponse.json({ error: "URL amigable inválida" }, { status: 400 })
      }
      if (next !== existing.urlAmigable) {
        const taken = await prisma.brochure.findUnique({ where: { urlAmigable: next } })
        if (taken && taken.id !== existing.id) {
          return NextResponse.json({ error: "Esa URL amigable ya está en uso" }, { status: 400 })
        }
        urlAmigable = next
      }
    }

    let categoriaId = existing.categoriaId
    if (body.categoriaId !== undefined) {
      const next = body.categoriaId ? String(body.categoriaId) : null
      if (next && next !== existing.categoriaId) {
        const taken = await prisma.brochure.findUnique({ where: { categoriaId: next } })
        if (taken && taken.id !== existing.id) {
          return NextResponse.json(
            { error: "Esa categoría ya tiene un brochure asignado." },
            { status: 400 },
          )
        }
      }
      categoriaId = next
    }

    const updated = await prisma.brochure.update({
      where: { id: existing.id },
      data: {
        titulo,
        descripcion:
          body.descripcion !== undefined
            ? body.descripcion
              ? String(body.descripcion).trim() || null
              : null
            : existing.descripcion,
        urlAmigable,
        pdfUrl,
        categoriaId,
        publicado: body.publicado !== undefined ? Boolean(body.publicado) : existing.publicado,
        activo: body.activo !== undefined ? Boolean(body.activo) : existing.activo,
      },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        urlAmigable: true,
        pdfUrl: true,
        categoriaId: true,
        publicado: true,
        activo: true,
        categoria: { select: { id: true, nombre: true } },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const existing = await prisma.brochure.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }
    await prisma.brochure.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

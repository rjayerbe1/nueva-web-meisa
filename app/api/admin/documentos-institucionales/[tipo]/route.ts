import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"

const DOCS = {
  politica: {
    slug: "politica-de-datos",
    defaultTitulo: "Política de Tratamiento de Datos",
  },
  sagrilaft: {
    slug: "sagrilaft",
    defaultTitulo: "Manual SAGRILAFT",
  },
} as const

type Tipo = keyof typeof DOCS

export async function PUT(req: NextRequest, { params }: { params: { tipo: string } }) {
  try {
    await requireAdmin()
    const tipo = params.tipo as Tipo
    if (!DOCS[tipo]) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
    }
    const config = DOCS[tipo]
    const body = await req.json()

    const titulo = String(body.titulo ?? "").trim() || config.defaultTitulo
    const pdfUrl = body.pdfUrl ? String(body.pdfUrl).trim() : null
    const descripcion = body.descripcion ? String(body.descripcion).trim() || null : null
    const publicado = Boolean(body.publicado)
    const activo = body.activo === undefined ? true : Boolean(body.activo)

    if (!pdfUrl) {
      return NextResponse.json({ error: "Debes subir un PDF" }, { status: 400 })
    }

    const row = await prisma.brochure.upsert({
      where: { urlAmigable: config.slug },
      update: { titulo, descripcion, pdfUrl, publicado, activo },
      create: {
        titulo,
        descripcion,
        pdfUrl,
        publicado,
        activo,
        urlAmigable: config.slug,
        categoriaId: null,
      },
      select: {
        urlAmigable: true,
        titulo: true,
        descripcion: true,
        pdfUrl: true,
        publicado: true,
        activo: true,
      },
    })

    return NextResponse.json(row)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

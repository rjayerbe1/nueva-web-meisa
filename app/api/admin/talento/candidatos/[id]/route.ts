import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { candidatoSchema } from "@/lib/talento/schemas"
import { deleteCv } from "@/lib/talento/gcs-hv"

const CANDIDATO_INCLUDE = {
  postulaciones: {
    include: { vacante: { select: { id: true, titulo: true } } },
  },
} as const

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const item = await prisma.candidato.findUnique({
      where: { id: params.id },
      include: CANDIDATO_INCLUDE,
    })
    if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    return NextResponse.json(item)
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const body = await req.json()
    const data = candidatoSchema.partial().parse(body)

    const existing = await prisma.candidato.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

    // Si reemplazan el CV, borrar el archivo anterior del bucket privado.
    if (
      data.cvPathGcs &&
      existing.cvPathGcs &&
      data.cvPathGcs !== existing.cvPathGcs
    ) {
      await deleteCv(existing.cvPathGcs)
    }

    // Estampar la fecha del consentimiento cuando se activa por primera vez.
    const consentimientoFecha =
      data.consentimientoBanco === true && !existing.consentimientoBanco
        ? new Date()
        : data.consentimientoBanco === false
          ? null
          : undefined

    const updated = await prisma.candidato.update({
      where: { id: params.id },
      data: { ...data, ...(consentimientoFecha !== undefined ? { consentimientoFecha } : {}) },
      include: CANDIDATO_INCLUDE,
    })
    return NextResponse.json(updated)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const existing = await prisma.candidato.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    // Supresión completa (habeas data): archivo + registros (postulaciones en cascada).
    if (existing.cvPathGcs) await deleteCv(existing.cvPathGcs)
    await prisma.candidato.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

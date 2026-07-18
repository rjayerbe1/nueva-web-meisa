import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { postulacionUpdateSchema } from "@/lib/talento/schemas"

const POSTULACION_INCLUDE = {
  candidato: {
    select: {
      id: true,
      nombre: true,
      email: true,
      telefono: true,
      ciudad: true,
      origen: true,
      cvPathGcs: true,
    },
  },
  vacante: { select: { id: true, titulo: true } },
} as const

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin()
    const body = await req.json()
    const data = postulacionUpdateSchema.parse(body)

    const existing = await prisma.postulacion.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

    // Cambio de etapa → registrar en el historial quién y cuándo (trazabilidad
    // del proceso de selección).
    let historial = existing.historial
    if (data.etapa && data.etapa !== existing.etapa) {
      const prev = Array.isArray(existing.historial) ? existing.historial : []
      historial = [
        ...prev,
        {
          de: existing.etapa,
          a: data.etapa,
          fecha: new Date().toISOString(),
          usuario: session.user?.email ?? session.user?.name ?? "admin",
        },
      ] as any
    }

    const updated = await prisma.postulacion.update({
      where: { id: params.id },
      data: {
        ...(data.etapa ? { etapa: data.etapa } : {}),
        ...(data.vacanteId !== undefined ? { vacanteId: data.vacanteId || null } : {}),
        ...(data.notasInternas !== undefined ? { notasInternas: data.notasInternas } : {}),
        ...(data.scoreIA !== undefined ? { scoreIA: data.scoreIA } : {}),
        ...(historial !== existing.historial ? { historial: historial as any } : {}),
      },
      include: POSTULACION_INCLUDE,
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
    await prisma.postulacion.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { postulacionCreateSchema } from "@/lib/talento/schemas"

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

export async function GET() {
  try {
    await requireAdmin()
    const items = await prisma.postulacion.findMany({
      orderBy: { updatedAt: "desc" },
      include: POSTULACION_INCLUDE,
    })
    return NextResponse.json(items)
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const data = postulacionCreateSchema.parse(body)
    const created = await prisma.postulacion.create({
      data: {
        candidatoId: data.candidatoId,
        vacanteId: data.vacanteId || null,
        etapa: data.etapa,
        notasInternas: data.notasInternas,
      },
      include: POSTULACION_INCLUDE,
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

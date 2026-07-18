import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { candidatoSchema } from "@/lib/talento/schemas"

const CANDIDATO_INCLUDE = {
  postulaciones: {
    include: { vacante: { select: { id: true, titulo: true } } },
  },
} as const

export async function GET() {
  try {
    await requireAdmin()
    const items = await prisma.candidato.findMany({
      orderBy: { createdAt: "desc" },
      include: CANDIDATO_INCLUDE,
    })
    return NextResponse.json(items)
  } catch (e) {
    return apiErrorResponse(e)
  }
}

// Crea el candidato y, si viene vacanteId, también su postulación — una sola
// llamada desde el admin cuando TH carga una hoja de vida.
const createSchema = candidatoSchema.extend({
  vacanteId: z.string().optional().nullable(),
})

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const { vacanteId, ...data } = createSchema.parse(body)

    const created = await prisma.candidato.create({
      data: {
        ...data,
        consentimientoFecha: data.consentimientoBanco ? new Date() : null,
        postulaciones: {
          create: [{ vacanteId: vacanteId || null }],
        },
      } as Prisma.CandidatoUncheckedCreateInput,
      include: CANDIDATO_INCLUDE,
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

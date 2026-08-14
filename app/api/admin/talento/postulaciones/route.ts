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

    // Evita duplicar: si ya está en el pipeline de esa vacante, se devuelve la
    // que existe en vez de crear una segunda (pasa al hacer doble clic o al
    // volver a mandar del banco a alguien que ya se mandó).
    if (data.vacanteId) {
      const ya = await prisma.postulacion.findFirst({
        where: { candidatoId: data.candidatoId, vacanteId: data.vacanteId },
        include: POSTULACION_INCLUDE,
      })
      if (ya) return NextResponse.json(ya, { status: 200 })
    }

    const created = await prisma.postulacion.create({
      data: {
        candidatoId: data.candidatoId,
        vacanteId: data.vacanteId || null,
        etapa: data.etapa,
        notasInternas: data.notasInternas,
        historial: [
          {
            de: null,
            a: data.etapa,
            fecha: new Date().toISOString(),
            usuario: "alta manual desde el banco",
          },
        ] as never,
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

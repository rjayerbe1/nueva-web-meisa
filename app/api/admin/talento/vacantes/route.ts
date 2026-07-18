import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { vacanteSchema, makeVacanteSlug } from "@/lib/talento/schemas"

export async function GET() {
  try {
    await requireAdmin()
    const items = await prisma.vacante.findMany({
      orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
      include: { _count: { select: { postulaciones: true } } },
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
    const data = vacanteSchema.parse(body)
    const created = await prisma.vacante.create({
      data: {
        ...data,
        slug: makeVacanteSlug(data.titulo),
      } as Prisma.VacanteUncheckedCreateInput,
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

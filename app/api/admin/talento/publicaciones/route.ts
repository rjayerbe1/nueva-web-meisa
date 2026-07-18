import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { publicacionSchema } from "@/lib/talento/schemas"

export async function GET() {
  try {
    await requireAdmin()
    const items = await prisma.publicacionVacante.findMany({
      orderBy: { createdAt: "desc" },
      include: { vacante: { select: { id: true, titulo: true } } },
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
    const data = publicacionSchema.parse(body)
    const created = await prisma.publicacionVacante.create({
      data: data as Prisma.PublicacionVacanteUncheckedCreateInput,
      include: { vacante: { select: { id: true, titulo: true } } },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

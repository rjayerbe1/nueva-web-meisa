import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { CategoriaEnum, Prisma } from "@prisma/client"

const createSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(1),
  resumenCorto: z.string().nullable().optional(),
  categoria: z.nativeEnum(CategoriaEnum).default("COMERCIAL"),
  activa: z.boolean().default(true),
  destacada: z.boolean().default(false),
  orden: z.number().int().default(0),
})

export async function GET() {
  try {
    await requireAdmin()
    const items = await prisma.obra.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { proyectos: true } },
      },
    })
    return NextResponse.json(items)
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const data = createSchema.parse(await req.json())
    const created = await prisma.obra.create({
      data: data as Prisma.ObraUncheckedCreateInput,
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

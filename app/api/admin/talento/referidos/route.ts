import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { generarCodigoUnico } from "@/lib/talento/codigos-referido"

const CODIGO_INCLUDE = {
  _count: { select: { candidatos: true } },
  candidatos: {
    include: { postulaciones: { select: { etapa: true } } },
  },
} as const

const createSchema = z.object({
  nombreEmpleado: z.string().min(1),
  codigo: z.string().min(1).optional(), // si no viene, se autogenera
  notas: z.string().optional().nullable(),
})

export async function GET() {
  try {
    await requireAdmin()
    const items = await prisma.codigoReferido.findMany({
      orderBy: { createdAt: "desc" },
      include: CODIGO_INCLUDE,
    })
    return NextResponse.json(items)
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = createSchema.parse(await req.json())
    const codigo = body.codigo?.trim().toUpperCase() || (await generarCodigoUnico(body.nombreEmpleado))
    const created = await prisma.codigoReferido.create({
      data: { nombreEmpleado: body.nombreEmpleado, codigo, notas: body.notas ?? null },
      include: CODIGO_INCLUDE,
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }
    if ((e as any)?.code === "P2002") {
      return NextResponse.json({ error: "Ese código ya existe" }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

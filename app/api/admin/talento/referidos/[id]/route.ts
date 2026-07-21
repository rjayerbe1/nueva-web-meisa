import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"

const updateSchema = z.object({
  nombreEmpleado: z.string().min(1).optional(),
  codigo: z.string().min(1).optional(),
  activo: z.boolean().optional(),
  notas: z.string().optional().nullable(),
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const body = updateSchema.parse(await req.json())
    const data = body.codigo ? { ...body, codigo: body.codigo.trim().toUpperCase() } : body
    const updated = await prisma.codigoReferido.update({ where: { id: params.id }, data })
    return NextResponse.json(updated)
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

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    // No borra a los candidatos referidos, solo desvincula el código (SetNull en la FK).
    await prisma.codigoReferido.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { CategoriaEnum } from "@prisma/client"

const updateSchema = z
  .object({
    entidadContratante: z.string().min(1),
    objetoContrato: z.string().min(1),
    tituloDisplay: z.string().nullable(),
    descripcionSecundaria: z.string().nullable(),
    fechaInicio: z.coerce.date(),
    fechaFin: z.coerce.date(),
    pesoKg: z.number().nullable(),
    areaM2: z.number().nullable(),
    ubicacion: z.string().min(1),
    departamento: z.string().nullable(),
    valorContrato: z.number(),
    moneda: z.string(),
    categoria: z.nativeEnum(CategoriaEnum),
    imagenes: z.array(z.string()),
    destacado: z.boolean(),
    visible: z.boolean(),
    orden: z.number().int(),
  })
  .partial()

function serialize(p: any) {
  return {
    ...p,
    fechaInicio: p.fechaInicio instanceof Date ? p.fechaInicio.toISOString() : p.fechaInicio,
    fechaFin: p.fechaFin instanceof Date ? p.fechaFin.toISOString() : p.fechaFin,
    pesoKg: p.pesoKg != null ? Number(p.pesoKg) : null,
    areaM2: p.areaM2 != null ? Number(p.areaM2) : null,
    valorContrato: Number(p.valorContrato),
    imagenes: Array.isArray(p.imagenes)
      ? p.imagenes.filter((x: unknown): x is string => typeof x === "string")
      : [],
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const item = await prisma.proyectoHojaVida.findUnique({ where: { id: params.id } })
    if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    return NextResponse.json(serialize(item))
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const data = updateSchema.parse(await req.json())
    const updated = await prisma.proyectoHojaVida.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(serialize(updated))
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
    await prisma.proyectoHojaVida.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

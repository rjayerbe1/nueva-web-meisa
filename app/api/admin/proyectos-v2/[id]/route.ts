import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { CategoriaEnum, EstadoProyecto, PrioridadEnum } from "@prisma/client"

const updateSchema = z
  .object({
    titulo: z.string().min(1),
    codigoInterno: z.string().nullable(),
    descripcion: z.string().min(1),
    estado: z.nativeEnum(EstadoProyecto),
    prioridad: z.nativeEnum(PrioridadEnum),
    fechaInicio: z.coerce.date(),
    fechaFin: z.coerce.date().nullable(),
    fechaEstimada: z.coerce.date().nullable(),
    presupuesto: z.number().nullable(),
    costoReal: z.number().nullable(),
    moneda: z.string(),
    cliente: z.string().min(1),
    clienteId: z.string().nullable(),
    contactoCliente: z.string().nullable(),
    telefono: z.string().nullable(),
    email: z.string().nullable(),
    ubicacion: z.string().min(1),
    coordenadas: z.string().nullable(),
    tags: z.array(z.string()),
    destacado: z.boolean(),
    destacadoEnCategoria: z.boolean(),
    visible: z.boolean(),
    ordenFrontend: z.number().int().nullable(),
    slug: z.string().min(1),
    metaTitle: z.string().nullable(),
    metaDescription: z.string().nullable(),
    areaTotal: z.number().nullable(),
    toneladas: z.number().nullable(),
    categoria: z.nativeEnum(CategoriaEnum),
  })
  .partial()

function serialize(p: any) {
  return {
    ...p,
    fechaInicio: p.fechaInicio instanceof Date ? p.fechaInicio.toISOString() : p.fechaInicio,
    fechaFin: p.fechaFin instanceof Date ? p.fechaFin.toISOString() : p.fechaFin,
    fechaEstimada: p.fechaEstimada instanceof Date ? p.fechaEstimada.toISOString() : p.fechaEstimada,
    presupuesto: p.presupuesto != null ? Number(p.presupuesto) : null,
    costoReal: p.costoReal != null ? Number(p.costoReal) : null,
    areaTotal: p.areaTotal != null ? Number(p.areaTotal) : null,
    toneladas: p.toneladas != null ? Number(p.toneladas) : null,
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const item = await prisma.proyecto.findUnique({ where: { id: params.id } })
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
    const updated = await prisma.proyecto.update({ where: { id: params.id }, data })
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
    await prisma.proyecto.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

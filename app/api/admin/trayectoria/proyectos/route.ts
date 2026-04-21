import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { CategoriaEnum, Prisma } from "@prisma/client"

const createSchema = z.object({
  entidadContratante: z.string().min(1),
  objetoContrato: z.string().min(1),
  tituloDisplay: z.string().nullable().optional(),
  descripcionSecundaria: z.string().nullable().optional(),
  fechaInicio: z.coerce.date(),
  fechaFin: z.coerce.date(),
  pesoKg: z.number().nullable().optional(),
  areaM2: z.number().nullable().optional(),
  ubicacion: z.string().min(1),
  departamento: z.string().nullable().optional(),
  valorContrato: z.number(),
  moneda: z.string().default("COP"),
  categoria: z.nativeEnum(CategoriaEnum).default(CategoriaEnum.INDUSTRIAL),
  imagenes: z.array(z.string()).default([]),
  destacado: z.boolean().default(false),
  visible: z.boolean().default(true),
  orden: z.number().int().default(0),
})

/** Serializa Decimals/Dates a tipos que el front puede consumir. */
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

export async function GET() {
  try {
    await requireAdmin()
    const items = await prisma.proyectoHojaVida.findMany({
      orderBy: [{ destacado: "desc" }, { fechaInicio: "desc" }, { orden: "asc" }],
    })
    return NextResponse.json(items.map(serialize))
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const data = createSchema.parse(await req.json())
    const created = await prisma.proyectoHojaVida.create({
      data: data as Prisma.ProyectoHojaVidaUncheckedCreateInput,
    })
    return NextResponse.json(serialize(created), { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

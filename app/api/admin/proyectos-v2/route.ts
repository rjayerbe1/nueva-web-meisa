import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { CategoriaEnum, EstadoProyecto, PrioridadEnum, Prisma } from "@prisma/client"

const createSchema = z.object({
  titulo: z.string().min(1),
  codigoInterno: z.string().nullable().optional(),
  descripcion: z.string().min(1),
  estado: z.nativeEnum(EstadoProyecto).default(EstadoProyecto.PLANIFICACION),
  prioridad: z.nativeEnum(PrioridadEnum).default(PrioridadEnum.MEDIA),
  fechaInicio: z.coerce.date(),
  fechaFin: z.coerce.date().nullable().optional(),
  fechaEstimada: z.coerce.date().nullable().optional(),
  presupuesto: z.number().nullable().optional(),
  costoReal: z.number().nullable().optional(),
  moneda: z.string().default("COP"),
  cliente: z.string().min(1),
  clienteId: z.string().nullable().optional(),
  contactoCliente: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  ubicacion: z.string().min(1),
  coordenadas: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  destacado: z.boolean().default(false),
  destacadoEnCategoria: z.boolean().default(false),
  visible: z.boolean().default(true),
  ordenFrontend: z.number().int().nullable().optional(),
  slug: z.string().min(1),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  areaTotal: z.number().nullable().optional(),
  toneladas: z.number().nullable().optional(),
  categoria: z.nativeEnum(CategoriaEnum).default(CategoriaEnum.COMERCIAL),
})

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

export async function GET() {
  try {
    await requireAdmin()
    const items = await prisma.proyecto.findMany({
      orderBy: [{ destacado: "desc" }, { ordenFrontend: "asc" }, { createdAt: "desc" }],
      include: {
        imagenes: { where: { tipo: "PORTADA" }, take: 1 },
      },
    })
    return NextResponse.json(
      items.map((p: any) => ({
        ...serialize(p),
        portada: p.imagenes?.[0]?.url ?? null,
      })),
    )
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await req.json()
    const data = createSchema.parse(body)
    // slug único
    let slug = data.slug
    let counter = 1
    while (await prisma.proyecto.findUnique({ where: { slug } })) {
      slug = `${data.slug}-${counter++}`
    }
    const created = await prisma.proyecto.create({
      data: {
        ...data,
        slug,
        createdBy: session.user.id,
      } as Prisma.ProyectoUncheckedCreateInput,
    })
    return NextResponse.json(serialize(created), { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

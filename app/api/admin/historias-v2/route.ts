import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { Prisma } from "@prisma/client"

const anyJson: z.ZodType<unknown> = z.any()

const createSchema = z.object({
  proyectoId: z.string().min(1),
  activo: z.boolean().default(false),
  tituloAlternativo: z.string().nullable().optional(),
  resumenCorto: z.string().nullable().optional(),
  contexto: z.string().nullable().optional(),
  problemasIniciales: z.string().nullable().optional(),
  enfoque: z.string().nullable().optional(),
  solucionTecnica: z.string().nullable().optional(),
  metodologia: z.string().nullable().optional(),
  tiempoTotal: z.string().nullable().optional(),
  impactoCliente: z.string().nullable().optional(),
  valorAgregado: z.string().nullable().optional(),
  leccionesAprendidas: z.string().nullable().optional(),
  testimonioCliente: z.string().nullable().optional(),
  testimonioEquipo: z.string().nullable().optional(),
  imagenDestacada: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  dificultadTecnica: z.number().int().min(1).max(10).nullable().optional(),
  innovacionNivel: z.number().int().min(1).max(10).nullable().optional(),
  desafios: anyJson.optional(),
  innovaciones: anyJson.optional(),
  equipoEspecialista: anyJson.optional(),
  fasesEjecucion: anyJson.optional(),
  recursos: anyJson.optional(),
  resultados: anyJson.optional(),
  reconocimientos: anyJson.optional(),
  datosInteres: anyJson.optional(),
  infografias: anyJson.optional(),
  tagsTecnicos: anyJson.optional(),
  imagenesDesafio: anyJson.optional(),
  imagenesSolucion: anyJson.optional(),
  imagenesResultado: anyJson.optional(),
})

export async function GET() {
  try {
    await requireAdmin()
    const items = await prisma.historiaProyecto.findMany({
      orderBy: { fechaActualizacion: "desc" },
      include: {
        proyecto: { select: { titulo: true, slug: true, cliente: true } },
      },
    })
    return NextResponse.json(items)
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const data = createSchema.parse(await req.json())
    const created = await prisma.historiaProyecto.create({
      data: { ...data, creadoPor: session.user.id } as Prisma.HistoriaProyectoUncheckedCreateInput,
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

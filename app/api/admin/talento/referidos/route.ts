import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { generarCodigoUnico } from "@/lib/talento/codigos-referido"
import { listarColaboradoresActivos } from "@/lib/talento/colaboradores-firestore"

const CODIGO_INCLUDE = {
  _count: { select: { candidatos: true } },
  candidatos: {
    include: { postulaciones: { select: { etapa: true } } },
  },
} as const

const createSchema = z.object({
  colaboradorId: z.string().min(1),
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
    const colaborador = (await listarColaboradoresActivos()).find(
      (item) => item.id === body.colaboradorId,
    )
    if (!colaborador) {
      return NextResponse.json(
        { error: "El colaborador no existe o ya no está activo" },
        { status: 400 },
      )
    }
    const existentePorId = await prisma.codigoReferido.findUnique({
      where: { colaboradorId: body.colaboradorId },
      include: CODIGO_INCLUDE,
    })
    if (existentePorId) {
      return NextResponse.json(
        { error: "Este colaborador ya tiene código", existente: existentePorId },
        { status: 409 },
      )
    }

    // Vincula códigos legacy creados con nombre libre cuando el nombre coincide.
    const normalizarNombre = (value: string) =>
      value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim()
    const nombreNormalizado = normalizarNombre(colaborador.nombre)
    const legacy = (await prisma.codigoReferido.findMany({
      where: { colaboradorId: null },
      include: CODIGO_INCLUDE,
    })).find((item) => normalizarNombre(item.nombreEmpleado) === nombreNormalizado)
    if (legacy) {
      const vinculado = await prisma.codigoReferido.update({
        where: { id: legacy.id },
        data: {
          colaboradorId: body.colaboradorId,
          cedulaEmpleado: colaborador.cedula,
          nombreEmpleado: colaborador.nombre,
          cargoEmpleado: colaborador.cargo,
          areaEmpleado: colaborador.area,
        },
        include: CODIGO_INCLUDE,
      })
      return NextResponse.json(vinculado)
    }

    const codigo = body.codigo?.trim().toUpperCase() || (await generarCodigoUnico(colaborador.nombre))
    const created = await prisma.codigoReferido.create({
      data: {
        colaboradorId: body.colaboradorId,
        cedulaEmpleado: colaborador.cedula,
        nombreEmpleado: colaborador.nombre,
        cargoEmpleado: colaborador.cargo,
        areaEmpleado: colaborador.area,
        codigo,
        notas: body.notas ?? null,
      },
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

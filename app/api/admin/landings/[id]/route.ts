import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import {
  contenidoSchemaForTipo,
  type LandingTipoStr,
} from "@/lib/landings-schema"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  titulo: z.string().min(1, "El título (label) es obligatorio"),
  metaTitle: z.string().min(1, "El meta title es obligatorio").max(200),
  metaDescription: z
    .string()
    .min(1, "La meta description es obligatoria")
    .max(200, "La meta description no debe superar 200 caracteres"),
  activa: z.boolean(),
  orden: z.number().int().min(0),
  contenido: z.unknown(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin()
    const landing = await prisma.landingSeo.findUnique({
      where: { id: params.id },
    })
    if (!landing) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 })
    }
    return NextResponse.json(landing)
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin()

    const existente = await prisma.landingSeo.findUnique({
      where: { id: params.id },
      select: { tipo: true },
    })
    if (!existente) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 })
    }

    const body = await req.json()
    const base = updateSchema.parse(body)

    // El Json `contenido` se valida contra el schema del tipo de landing.
    const contenidoSchema = contenidoSchemaForTipo(
      existente.tipo as LandingTipoStr,
    )
    const contenido = contenidoSchema.parse(base.contenido)

    const actualizada = await prisma.landingSeo.update({
      where: { id: params.id },
      data: {
        titulo: base.titulo,
        metaTitle: base.metaTitle,
        metaDescription: base.metaDescription,
        activa: base.activa,
        orden: base.orden,
        contenido: contenido as object,
      },
    })
    return NextResponse.json(actualizada)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: e.issues },
        { status: 400 },
      )
    }
    return apiErrorResponse(e)
  }
}

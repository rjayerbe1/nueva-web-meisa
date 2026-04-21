import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"

/**
 * ConfiguracionTrayectoria no tiene id="default" — usa un cuid aleatorio. Para
 * mantenerlo singleton, el GET devuelve el primero y el PUT actualiza el mismo
 * (o lo crea con una entrada inicial si no existe).
 */
const updateSchema = z
  .object({
    resenaHistorica: z.string(),
    mision: z.string(),
    vision: z.string(),
  })
  .partial()

export async function GET() {
  try {
    await requireAdmin()
    let config = await prisma.configuracionTrayectoria.findFirst()
    if (!config) {
      config = await prisma.configuracionTrayectoria.create({
        data: {
          resenaHistorica: "",
          mision: "",
          vision: "",
          valores: [],
        },
      })
    }
    return NextResponse.json(config)
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin()
    const data = updateSchema.parse(await req.json())
    const existing = await prisma.configuracionTrayectoria.findFirst()

    const updated = existing
      ? await prisma.configuracionTrayectoria.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.configuracionTrayectoria.create({
          data: {
            resenaHistorica: data.resenaHistorica ?? "",
            mision: data.mision ?? "",
            vision: data.vision ?? "",
            valores: [],
          },
        })
    return NextResponse.json(updated)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

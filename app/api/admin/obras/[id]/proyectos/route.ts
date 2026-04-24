import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"

// Lista los proyectos actualmente asignados a la obra + los disponibles
// (sin obra o en otra obra) para permitir asignar desde el admin.
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin()
    const obra = await prisma.obra.findUnique({
      where: { id: params.id },
      select: { id: true, slug: true, titulo: true, categoria: true },
    })
    if (!obra) {
      return NextResponse.json({ error: "Obra no encontrada" }, { status: 404 })
    }

    // Proyectos ya asignados a ESTA obra
    const asignados = await prisma.proyecto.findMany({
      where: { obraId: obra.id },
      select: {
        id: true,
        slug: true,
        titulo: true,
        cliente: true,
        ubicacion: true,
        fechaFin: true,
        toneladas: true,
        imagenes: {
          orderBy: { orden: "asc" },
          take: 1,
          select: { url: true, urlOptimized: true, alt: true },
        },
      },
      orderBy: { fechaFin: "asc" },
    })

    // Proyectos disponibles (sin obra asignada) de la misma categoría que la obra
    const disponibles = await prisma.proyecto.findMany({
      where: { obraId: null, categoria: obra.categoria, visible: true },
      select: {
        id: true,
        slug: true,
        titulo: true,
        cliente: true,
        ubicacion: true,
        fechaFin: true,
        toneladas: true,
        imagenes: {
          orderBy: { orden: "asc" },
          take: 1,
          select: { url: true, urlOptimized: true, alt: true },
        },
      },
      orderBy: [{ destacado: "desc" }, { fechaInicio: "desc" }],
      take: 100,
    })

    return NextResponse.json({ asignados, disponibles })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

// PATCH { add?: string[], remove?: string[] } — asigna/desasigna proyectos a la obra
const patchSchema = z.object({
  add: z.array(z.string()).optional(),
  remove: z.array(z.string()).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin()
    const obra = await prisma.obra.findUnique({ where: { id: params.id } })
    if (!obra) {
      return NextResponse.json({ error: "Obra no encontrada" }, { status: 404 })
    }

    const { add = [], remove = [] } = patchSchema.parse(await req.json())

    await prisma.$transaction(async (tx) => {
      if (add.length > 0) {
        await tx.proyecto.updateMany({
          where: { id: { in: add } },
          data: { obraId: obra.id },
        })
      }
      if (remove.length > 0) {
        await tx.proyecto.updateMany({
          where: { id: { in: remove }, obraId: obra.id },
          data: { obraId: null },
        })
      }
    })

    return NextResponse.json({ ok: true, added: add.length, removed: remove.length })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { compararCandidatos, PresupuestoAgotadoError } from "@/lib/talento/ia"
import { prisma } from "@/lib/prisma"

export const maxDuration = 120

const schema = z.object({
  vacanteId: z.string().min(1),
  candidatoIds: z.array(z.string().min(1)).min(2).max(30),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const { vacanteId, candidatoIds } = schema.parse(await req.json())
    const { comparativoId, resultado } = await compararCandidatos(
      vacanteId,
      candidatoIds,
      session.user?.email ?? session.user?.name,
    )
    return NextResponse.json({ comparativoId, resultado })
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Elige una vacante y al menos 2 candidatos" },
        { status: 400 },
      )
    }
    if (e instanceof PresupuestoAgotadoError) {
      return NextResponse.json({ error: e.message }, { status: 429 })
    }
    if (e?.message?.includes("al menos 2 candidatos")) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
    const id = req.nextUrl.searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })
    await prisma.comparativoVacante.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

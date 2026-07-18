import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { analizarCvCandidato, PresupuestoAgotadoError } from "@/lib/talento/ia"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const { candidatoId } = await req.json()
    if (!candidatoId) {
      return NextResponse.json({ error: "Falta candidatoId" }, { status: 400 })
    }
    const datos = await analizarCvCandidato(candidatoId)
    return NextResponse.json({ datos })
  } catch (e: any) {
    if (e instanceof PresupuestoAgotadoError) {
      return NextResponse.json({ error: e.message }, { status: 429 })
    }
    if (e?.message?.includes("no tiene CV")) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

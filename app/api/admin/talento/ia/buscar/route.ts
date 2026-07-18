import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { buscarCandidatos, PresupuestoAgotadoError } from "@/lib/talento/ia"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const { consulta } = await req.json()
    if (!consulta || typeof consulta !== "string" || consulta.trim().length < 3) {
      return NextResponse.json({ error: "Consulta demasiado corta" }, { status: 400 })
    }
    const resultados = await buscarCandidatos(consulta.trim())
    return NextResponse.json({ resultados })
  } catch (e: any) {
    if (e instanceof PresupuestoAgotadoError) {
      return NextResponse.json({ error: e.message }, { status: 429 })
    }
    if (e?.message?.includes("analizado con IA")) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

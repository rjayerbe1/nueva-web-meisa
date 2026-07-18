import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { herramientasVacante, PresupuestoAgotadoError } from "@/lib/talento/ia"

export const maxDuration = 90

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const { vacanteId } = await req.json()
    if (!vacanteId) {
      return NextResponse.json({ error: "Falta vacanteId" }, { status: 400 })
    }
    const result = await herramientasVacante(vacanteId)
    return NextResponse.json(result)
  } catch (e: any) {
    if (e instanceof PresupuestoAgotadoError) {
      return NextResponse.json({ error: e.message }, { status: 429 })
    }
    return apiErrorResponse(e)
  }
}

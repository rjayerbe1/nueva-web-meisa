import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { evaluarMatch, PresupuestoAgotadoError } from "@/lib/talento/ia"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const { postulacionId } = await req.json()
    if (!postulacionId) {
      return NextResponse.json({ error: "Falta postulacionId" }, { status: 400 })
    }
    const match = await evaluarMatch(postulacionId)
    return NextResponse.json({ match })
  } catch (e: any) {
    if (e instanceof PresupuestoAgotadoError) {
      return NextResponse.json({ error: e.message }, { status: 429 })
    }
    if (e?.message?.includes("analiza el CV") || e?.message?.includes("espontánea")) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

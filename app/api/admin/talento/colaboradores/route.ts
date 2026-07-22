import { NextResponse } from "next/server"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { listarColaboradoresActivos } from "@/lib/talento/colaboradores-firestore"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

export async function GET() {
  try {
    await requireAdmin()
    return NextResponse.json(await listarColaboradoresActivos())
  } catch (error) {
    return apiErrorResponse(error)
  }
}

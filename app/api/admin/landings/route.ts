import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"

export const dynamic = "force-dynamic"

/** Lista resumida de landings para /admin/landings (sin el Json completo). */
export async function GET() {
  try {
    await requireAdmin()
    const landings = await prisma.landingSeo.findMany({
      orderBy: [{ tipo: "asc" }, { orden: "asc" }],
      select: {
        id: true,
        slug: true,
        tipo: true,
        titulo: true,
        metaTitle: true,
        metaDescription: true,
        activa: true,
        orden: true,
        updatedAt: true,
      },
    })
    return NextResponse.json(landings)
  } catch (e) {
    return apiErrorResponse(e)
  }
}

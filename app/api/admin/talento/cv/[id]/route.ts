import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { downloadCv } from "@/lib/talento/gcs-hv"

// Proxy autenticado: los CVs viven en un bucket privado sin URLs públicas.
// Esta es la ÚNICA vía para verlos, y exige sesión de admin.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const candidato = await prisma.candidato.findUnique({
      where: { id: params.id },
      select: { cvPathGcs: true, cvFileName: true, cvContentType: true },
    })
    if (!candidato?.cvPathGcs) {
      return NextResponse.json({ error: "Este candidato no tiene CV" }, { status: 404 })
    }
    const buffer = await downloadCv(candidato.cvPathGcs)
    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": candidato.cvContentType ?? "application/pdf",
        "Content-Disposition": `inline; filename="${candidato.cvFileName ?? "cv.pdf"}"`,
        "Cache-Control": "private, no-store",
      },
    })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

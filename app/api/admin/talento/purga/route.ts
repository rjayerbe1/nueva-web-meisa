import { NextRequest, NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { deleteCv } from "@/lib/talento/gcs-hv"

/**
 * Purga por retención (Ley 1581/2012, principio de temporalidad).
 * Candidatos purgables: registrados hace más de `retencionMeses`, SIN
 * autorización de banco de talento y SIN ninguna postulación CONTRATADA.
 * La ejecuta un humano desde el admin (GET lista → POST ejecuta) — así la
 * supresión queda como decisión confirmada, no un proceso ciego.
 */

async function candidatosVencidos() {
  const config = await prisma.configuracionTalento.findUnique({ where: { id: "default" } })
  const meses = config?.retencionMeses ?? 12
  const limite = new Date()
  limite.setMonth(limite.getMonth() - meses)

  const vencidos = await prisma.candidato.findMany({
    where: {
      createdAt: { lt: limite },
      consentimientoBanco: false,
      postulaciones: { none: { etapa: "CONTRATADA" } },
    },
    select: { id: true, nombre: true, createdAt: true, cvPathGcs: true },
    orderBy: { createdAt: "asc" },
  })
  return { vencidos, meses }
}

export async function GET() {
  try {
    await requireAdmin()
    const { vencidos, meses } = await candidatosVencidos()
    return NextResponse.json({
      retencionMeses: meses,
      count: vencidos.length,
      candidatos: vencidos.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        registrado: c.createdAt.toISOString().slice(0, 10),
      })),
    })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function POST(_req: NextRequest) {
  try {
    const session = await requireAdmin(UserRole.ADMIN)
    const { vencidos } = await candidatosVencidos()
    for (const c of vencidos) {
      if (c.cvPathGcs) await deleteCv(c.cvPathGcs)
      await prisma.candidato.delete({ where: { id: c.id } })
    }
    console.log(
      `[talento] purga habeas data: ${vencidos.length} candidatos suprimidos por ${session.user?.email}`,
    )
    return NextResponse.json({ purgados: vencidos.length })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

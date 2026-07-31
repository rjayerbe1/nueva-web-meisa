import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { itemHandlers } from "@/lib/admin/crud"
import { prisma } from "@/lib/prisma"
import { vacanteSchema } from "@/lib/talento/schemas"

const h = itemHandlers({
  delegate: prisma.vacante,
  updateSchema: vacanteSchema.partial(),
})

export const GET = h.GET

// Revalida listado + detalle: abrir/cerrar una vacante no debe esperar a que
// expire el caché ISR (mismo problema que el switch de la página pública).
export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const res = await h.PUT(req, ctx)
  if (res.status < 300) {
    revalidatePath("/trabaja-con-nosotros")
    // /contacto lista las vacantes abiertas en la banda "03 — Talento".
    revalidatePath("/contacto")
    try {
      const body = await res.clone().json()
      if (body?.slug) revalidatePath(`/trabaja-con-nosotros/${body.slug}`)
    } catch {}
  }
  return res
}

export const DELETE = h.DELETE

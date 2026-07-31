import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { singletonHandlers } from "@/lib/admin/crud"
import { prisma } from "@/lib/prisma"
import { configTalentoSchema } from "@/lib/talento/schemas"

const h = singletonHandlers({
  delegate: prisma.configuracionTalento,
  updateSchema: configTalentoSchema,
})

export const GET = h.GET

// Envuelve el PUT genérico para forzar la revalidación de la página pública:
// sin esto, un toggle de paginaPublicaActiva puede quedar "atascado" en el
// caché ISR de Next (notFound() cacheado) y no reflejarse hasta que expire
// por sí solo, lo cual a veces no ocurre de forma confiable.
export async function PUT(req: NextRequest) {
  const res = await h.PUT(req)
  if (res.status < 300) {
    revalidatePath("/trabaja-con-nosotros")
    // El enlace del footer y la banda "03 — Talento" de /contacto dependen del
    // switch: se revalida el layout público entero para que prender/apagar la
    // página no deje enlaces colgando hacia un notFound() en el resto del sitio.
    revalidatePath("/contacto")
    revalidatePath("/", "layout")
  }
  return res
}

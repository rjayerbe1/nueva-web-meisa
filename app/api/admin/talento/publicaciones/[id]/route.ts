import { itemHandlers } from "@/lib/admin/crud"
import { prisma } from "@/lib/prisma"
import { publicacionSchema } from "@/lib/talento/schemas"

const h = itemHandlers({
  delegate: prisma.publicacionVacante,
  updateSchema: publicacionSchema.partial(),
})

export const GET = h.GET
export const PUT = h.PUT
export const DELETE = h.DELETE

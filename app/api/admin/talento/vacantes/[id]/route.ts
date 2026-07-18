import { itemHandlers } from "@/lib/admin/crud"
import { prisma } from "@/lib/prisma"
import { vacanteSchema } from "@/lib/talento/schemas"

const h = itemHandlers({
  delegate: prisma.vacante,
  updateSchema: vacanteSchema.partial(),
})

export const GET = h.GET
export const PUT = h.PUT
export const DELETE = h.DELETE

import { singletonHandlers } from "@/lib/admin/crud"
import { prisma } from "@/lib/prisma"
import { configTalentoSchema } from "@/lib/talento/schemas"

const h = singletonHandlers({
  delegate: prisma.configuracionTalento,
  updateSchema: configTalentoSchema,
})

export const GET = h.GET
export const PUT = h.PUT

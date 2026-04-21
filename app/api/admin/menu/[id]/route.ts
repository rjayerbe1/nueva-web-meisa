import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.menuItem,
  updateSchema: z
    .object({
      label: z.string().min(1),
      href: z.string().min(1),
      imagen: z.string().nullable(),
      target: z.string().nullable(),
      orden: z.number().int(),
      activo: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

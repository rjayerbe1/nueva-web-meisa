import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.socialLink,
  updateSchema: z
    .object({
      red: z.string().min(1),
      url: z.string().min(1),
      label: z.string().nullable(),
      icono: z.string().nullable(),
      orden: z.number().int(),
      activo: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.timelineHito,
  updateSchema: z
    .object({
      periodo: z.string().min(1),
      titulo: z.string().min(1),
      descripcion: z.string().min(1),
      destacado: z.string().nullable(),
      icono: z.string().nullable(),
      orden: z.number().int(),
      activo: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

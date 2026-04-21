import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.norma,
  updateSchema: z
    .object({
      codigo: z.string().min(1),
      descripcion: z.string().min(1),
      categoria: z.string().nullable(),
      logo: z.string().nullable(),
      orden: z.number().int(),
      activo: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

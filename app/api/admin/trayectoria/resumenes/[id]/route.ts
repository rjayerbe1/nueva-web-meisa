import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.resumenAnio,
  updateSchema: z
    .object({
      anio: z.number().int().min(1900).max(2100),
      titulo: z.string().min(1),
      descripcion: z.string().min(1),
      imagenesFeatured: z.array(z.string()),
      visible: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

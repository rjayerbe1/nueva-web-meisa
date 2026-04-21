import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.procesoDigital,
  updateSchema: z
    .object({
      slug: z.string().min(1),
      nombre: z.string().min(1),
      descripcion: z.string().nullable(),
      beneficios: z.array(z.string()),
      imagen: z.string().nullable(),
      orden: z.number().int(),
      activo: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

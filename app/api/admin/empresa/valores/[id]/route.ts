import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.companyValue,
  updateSchema: z
    .object({
      slug: z.string().min(1),
      nombre: z.string().min(1),
      descripcion: z.string().min(1),
      icono: z.string().nullable(),
      imagen: z.string().nullable(),
      orden: z.number().int(),
      activo: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

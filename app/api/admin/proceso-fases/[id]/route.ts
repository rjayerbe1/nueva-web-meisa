import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.procesoFase,
  updateSchema: z
    .object({
      numero: z.number().int().min(1),
      titulo: z.string().min(1),
      descripcion: z.string().min(1),
      fortalezas: z.array(z.string()),
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

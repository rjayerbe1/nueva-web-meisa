import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.formOption,
  updateSchema: z
    .object({
      grupo: z.enum(["TIPO_PROYECTO", "SERVICIO_CONTACTO"]),
      valor: z.string().min(1),
      label: z.string().min(1),
      orden: z.number().int(),
      activo: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

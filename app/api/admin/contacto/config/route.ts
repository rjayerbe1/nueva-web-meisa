import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { singletonHandlers } from "@/lib/admin/crud"

const handlers = singletonHandlers({
  delegate: prisma.configuracionContacto,
  updateSchema: z
    .object({
      pbx: z.string().nullable(),
      movil: z.string().nullable(),
      email: z.string().nullable(),
      horarioSemana: z.string().nullable(),
      horarioSabado: z.string().nullable(),
      whatsappNumero: z.string().nullable(),
      direccionLinea1: z.string().nullable(),
      direccionLinea2: z.string().nullable(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT

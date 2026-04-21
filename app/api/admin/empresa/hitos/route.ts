import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.timelineHito,
  createSchema: z.object({
    periodo: z.string().min(1),
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    destacado: z.string().nullable().optional(),
    icono: z.string().nullable().optional(),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

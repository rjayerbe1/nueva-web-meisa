import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.homeStat,
  createSchema: z.object({
    clave: z.string().min(1),
    valor: z.string().min(1),
    label: z.string().min(1),
    icono: z.string().nullable().optional(),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

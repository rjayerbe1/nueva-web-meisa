import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.norma,
  createSchema: z.object({
    codigo: z.string().min(1),
    descripcion: z.string().min(1),
    categoria: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

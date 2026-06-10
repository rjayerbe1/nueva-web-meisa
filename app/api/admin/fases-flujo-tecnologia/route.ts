import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.faseFlujoTecnologia,
  createSchema: z.object({
    slug: z.string().min(1),
    titulo: z.string().min(1),
    descripcion: z.string().nullable().optional(),
    herramientas: z.array(z.string()).default([]),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

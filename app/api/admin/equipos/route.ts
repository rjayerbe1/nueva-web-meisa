import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.equipo,
  createSchema: z.object({
    slug: z.string().min(1),
    categoria: z.string().min(1),
    nombre: z.string().min(1),
    descripcion: z.string().nullable().optional(),
    specs: z.array(z.string()).default([]),
    imagen: z.string().nullable().optional(),
    plantaId: z.string().nullable().optional(),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

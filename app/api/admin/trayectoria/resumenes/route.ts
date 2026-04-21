import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.resumenAnio,
  orderBy: { anio: "desc" },
  createSchema: z.object({
    anio: z.number().int().min(1900).max(2100),
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    imagenesFeatured: z.array(z.string()).default([]),
    visible: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

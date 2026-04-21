import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.socialLink,
  createSchema: z.object({
    red: z.string().min(1),
    url: z.string().min(1),
    label: z.string().nullable().optional(),
    icono: z.string().nullable().optional(),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

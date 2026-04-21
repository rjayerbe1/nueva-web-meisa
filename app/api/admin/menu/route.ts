import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.menuItem,
  createSchema: z.object({
    label: z.string().min(1),
    href: z.string().min(1),
    imagen: z.string().nullable().optional(),
    target: z.string().nullable().optional(),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

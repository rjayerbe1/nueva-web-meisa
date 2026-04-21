import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.footerLink,
  updateSchema: z
    .object({
      grupo: z.enum(["servicios", "empresa", "legal", "recursos"]),
      label: z.string().min(1),
      href: z.string().min(1),
      orden: z.number().int(),
      activo: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

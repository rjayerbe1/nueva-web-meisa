import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.homeServicioDestacado,
  updateSchema: z
    .object({
      slug: z.string().min(1),
      servicioSlug: z.string().nullable(),
      nombre: z.string().min(1),
      subtitulo: z.string().nullable(),
      descripcion: z.string().nullable(),
      video: z.string().nullable(),
      imagen: z.string().nullable(),
      color: z.string().nullable(),
      overlayColor: z.string().nullable(),
      overlayOpacity: z.number().min(0).max(1).nullable(),
      hrefAncla: z.string().nullable(),
      orden: z.number().int(),
      activo: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

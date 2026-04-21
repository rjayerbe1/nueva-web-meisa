import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.homeServicioDestacado,
  createSchema: z.object({
    slug: z.string().min(1),
    servicioSlug: z.string().nullable().optional(),
    nombre: z.string().min(1),
    subtitulo: z.string().nullable().optional(),
    descripcion: z.string().nullable().optional(),
    video: z.string().nullable().optional(),
    imagen: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
    overlayColor: z.string().nullable().optional(),
    overlayOpacity: z.number().min(0).max(1).nullable().optional(),
    hrefAncla: z.string().nullable().optional(),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

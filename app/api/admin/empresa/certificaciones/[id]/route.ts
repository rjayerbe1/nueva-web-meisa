import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.certificacion,
  updateSchema: z
    .object({
      slug: z.string().min(1),
      nombre: z.string().min(1),
      nombreCompleto: z.string().nullable(),
      descripcion: z.string().nullable(),
      emisor: z.string().nullable(),
      importancia: z.string().nullable(),
      beneficios: z.array(z.string()),
      logo: z.string().nullable(),
      documentoUrl: z.string().nullable(),
      vigenciaDesde: z
        .union([z.string().datetime(), z.null()])
        .transform((v) => (v ? new Date(v) : null)),
      vigenciaHasta: z
        .union([z.string().datetime(), z.null()])
        .transform((v) => (v ? new Date(v) : null)),
      orden: z.number().int(),
      activo: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

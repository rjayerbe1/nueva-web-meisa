import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.certificacion,
  createSchema: z.object({
    slug: z.string().min(1),
    nombre: z.string().min(1),
    nombreCompleto: z.string().nullable().optional(),
    descripcion: z.string().nullable().optional(),
    emisor: z.string().nullable().optional(),
    importancia: z.string().nullable().optional(),
    beneficios: z.array(z.string()).default([]),
    logo: z.string().nullable().optional(),
    documentoUrl: z.string().nullable().optional(),
    vigenciaDesde: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .transform((v) => (v ? new Date(v) : null)),
    vigenciaHasta: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .transform((v) => (v ? new Date(v) : null)),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

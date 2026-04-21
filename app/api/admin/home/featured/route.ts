import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { singletonHandlers } from "@/lib/admin/crud"

const handlers = singletonHandlers({
  delegate: prisma.homeFeaturedProject,
  updateSchema: z
    .object({
      proyectoSlug: z.string().nullable(),
      nombre: z.string().min(1),
      ubicacion: z.string().nullable(),
      anioEntregado: z.string().nullable(),
      imagen: z.string().nullable(),
      descripcion: z.string().nullable(),
      stats: z.array(z.object({ value: z.string(), label: z.string() })).nullable(),
      ctaTexto: z.string().nullable(),
      ctaUrl: z.string().nullable(),
      eyebrowTexto: z.string().nullable(),
    })
    .partial(),
  createDefaults: { nombre: "Proyecto destacado" },
})

export const GET = handlers.GET
export const PUT = handlers.PUT

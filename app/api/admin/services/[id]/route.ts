import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const anyJson: z.ZodType<unknown> = z.any()

const handlers = itemHandlers({
  delegate: prisma.servicio,
  updateSchema: z
    .object({
      slug: z.string().min(1),
      nombre: z.string().min(1),
      titulo: z.string().nullable(),
      subtitulo: z.string().nullable(),
      descripcion: z.string().min(1),
      caracteristicas: z.array(z.string()),
      icono: z.string().nullable(),
      imagen: z.string().nullable(),
      color: z.string(),
      bgGradient: z.string().nullable(),
      orden: z.number().int(),
      destacado: z.boolean(),
      activo: z.boolean(),
      metaTitle: z.string().nullable(),
      metaDescription: z.string().nullable(),
      expertiseTitulo: z.string().nullable(),
      expertiseDescripcion: z.string().nullable(),
      tecnologias: anyJson,
      normativas: anyJson,
      equipamiento: anyJson,
      equipos: anyJson,
      imagenesGaleria: anyJson,
      estadisticas: anyJson,
      procesoPasos: anyJson,
      tablaComparativa: anyJson,
      videoDemostrativo: z.string().nullable(),
      preguntasFrecuentes: anyJson,
      recursosDescargables: anyJson,
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

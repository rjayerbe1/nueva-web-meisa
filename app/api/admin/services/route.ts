import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

// Json fields pasan tal cual (JsonValue). Campos básicos con validación estricta.
const anyJson: z.ZodType<unknown> = z.any()

const handlers = listHandlers({
  delegate: prisma.servicio,
  createSchema: z.object({
    slug: z.string().min(1),
    nombre: z.string().min(1),
    titulo: z.string().nullable().optional(),
    subtitulo: z.string().nullable().optional(),
    descripcion: z.string().min(1),
    caracteristicas: z.array(z.string()).default([]),
    icono: z.string().nullable().optional(),
    imagen: z.string().nullable().optional(),
    color: z.string().default("blue"),
    bgGradient: z.string().nullable().optional(),
    orden: z.number().int().default(0),
    destacado: z.boolean().default(false),
    activo: z.boolean().default(true),
    metaTitle: z.string().nullable().optional(),
    metaDescription: z.string().nullable().optional(),
    expertiseTitulo: z.string().nullable().optional(),
    expertiseDescripcion: z.string().nullable().optional(),
    // Json pass-through
    tecnologias: anyJson.optional(),
    normativas: anyJson.optional(),
    equipamiento: anyJson.optional(),
    equipos: anyJson.optional(),
    imagenesGaleria: anyJson.optional(),
    estadisticas: anyJson.optional(),
    procesoPasos: anyJson.optional(),
    tablaComparativa: anyJson.optional(),
    videoDemostrativo: z.string().nullable().optional(),
    preguntasFrecuentes: anyJson.optional(),
    recursosDescargables: anyJson.optional(),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.plant,
  createSchema: z.object({
    slug: z.string().min(1),
    nombre: z.string().min(1),
    tipo: z.string().nullable().optional(),
    ubicacion: z.string().min(1),
    ciudad: z.string().nullable().optional(),
    departamento: z.string().nullable().optional(),
    areaM2: z.number().int().nullable().optional(),
    naves: z.number().int().nullable().optional(),
    capacidadGruaTon: z.number().int().nullable().optional(),
    mesasCnc: z.number().int().nullable().optional(),
    equipamientoAdicional: z.array(z.string()).default([]),
    telefono: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    horario: z.string().nullable().optional(),
    googleMapsUrl: z.string().nullable().optional(),
    mapEmbedUrl: z.string().nullable().optional(),
    lat: z.number().nullable().optional(),
    lng: z.number().nullable().optional(),
    imagen: z.string().nullable().optional(),
    descripcion: z.string().nullable().optional(),
    colorGradient: z.string().nullable().optional(),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
    esSedePrincipal: z.boolean().default(false),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const handlers = itemHandlers({
  delegate: prisma.plant,
  updateSchema: z
    .object({
      slug: z.string().min(1),
      nombre: z.string().min(1),
      tipo: z.string().nullable(),
      ubicacion: z.string().min(1),
      ciudad: z.string().nullable(),
      departamento: z.string().nullable(),
      areaM2: z.number().int().nullable(),
      naves: z.number().int().nullable(),
      capacidadGruaTon: z.number().int().nullable(),
      mesasCnc: z.number().int().nullable(),
      equipamientoAdicional: z.array(z.string()),
      telefono: z.string().nullable(),
      email: z.string().nullable(),
      horario: z.string().nullable(),
      googleMapsUrl: z.string().nullable(),
      mapEmbedUrl: z.string().nullable(),
      lat: z.number().nullable(),
      lng: z.number().nullable(),
      imagen: z.string().nullable(),
      descripcion: z.string().nullable(),
      colorGradient: z.string().nullable(),
      orden: z.number().int(),
      activo: z.boolean(),
      esSedePrincipal: z.boolean(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.grupoSeccion,
  orderBy: [{ pagina: "asc" }, { orden: "asc" }],
  createSchema: z.object({
    pagina: z.enum(["tecnologia", "calidad"]),
    clave: z.string().min(1),
    titulo: z.string().min(1),
    subtitulo: z.string().nullable().optional(),
    descripcion: z.string().nullable().optional(),
    icono: z.string().nullable().optional(),
    colorGradient: z.string().nullable().optional(),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { listHandlers } from "@/lib/admin/crud"

const handlers = listHandlers({
  delegate: prisma.formOption,
  orderBy: [{ grupo: "asc" }, { orden: "asc" }],
  createSchema: z.object({
    grupo: z.enum(["TIPO_PROYECTO", "SERVICIO_CONTACTO"]),
    valor: z.string().min(1),
    label: z.string().min(1),
    orden: z.number().int().default(0),
    activo: z.boolean().default(true),
  }),
})

export const GET = handlers.GET
export const POST = handlers.POST

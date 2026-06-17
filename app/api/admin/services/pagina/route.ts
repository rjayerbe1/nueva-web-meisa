import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { singletonHandlers } from "@/lib/admin/crud"

const handlers = singletonHandlers({
  delegate: prisma.serviciosPagina,
  updateSchema: z
    .object({
      heroEyebrow: z.string().nullable(),
      heroTitulo1: z.string().nullable(),
      heroTitulo2: z.string().nullable(),
      heroParrafo: z.string().nullable(),
      stats: z.any().nullable(),
      procesoEyebrow: z.string().nullable(),
      procesoTitulo1: z.string().nullable(),
      procesoTitulo2: z.string().nullable(),
      procesoParrafo: z.string().nullable(),
      sectoresEyebrow: z.string().nullable(),
      sectoresTitulo1: z.string().nullable(),
      sectoresTitulo2: z.string().nullable(),
      sectoresParrafo: z.string().nullable(),
      sectores: z.any().nullable(),
      ctaEyebrow: z.string().nullable(),
      ctaTitulo1: z.string().nullable(),
      ctaTitulo2: z.string().nullable(),
      ctaParrafo: z.string().nullable(),
      ctaPrimarioTexto: z.string().nullable(),
      ctaPrimarioHref: z.string().nullable(),
      ctaSecundarioTexto: z.string().nullable(),
      ctaSecundarioHref: z.string().nullable(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT

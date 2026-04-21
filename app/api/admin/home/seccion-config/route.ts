import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { singletonHandlers } from "@/lib/admin/crud"

const handlers = singletonHandlers({
  delegate: prisma.homeSeccionConfig,
  updateSchema: z
    .object({
      heroVideoDesktop: z.string().nullable(),
      heroVideoMobile: z.string().nullable(),
      clientesEyebrow: z.string().nullable(),
      clientesTitulo: z.string().nullable(),
      clientesDescripcion: z.string().nullable(),
      clientesCtaTexto: z.string().nullable(),
      clientesCtaUrl: z.string().nullable(),
      clientesProyectosTitulo: z.string().nullable(),
      contactoEyebrow: z.string().nullable(),
      contactoTitulo: z.string().nullable(),
      contactoDescripcion: z.string().nullable(),
      contactoCta1Texto: z.string().nullable(),
      contactoCta2Texto: z.string().nullable(),
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT

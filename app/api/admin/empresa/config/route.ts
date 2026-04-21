import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { singletonHandlers } from "@/lib/admin/crud"

const handlers = singletonHandlers({
  delegate: prisma.configuracionEmpresa,
  updateSchema: z
    .object({
      nombre: z.string().min(1),
      nombreCompleto: z.string().min(1),
      mision: z.string().min(1),
      vision: z.string().min(1),
      descripcion: z.string().min(1),
      fundacion: z.number().int().min(1900).max(2100),
      liderQuoteTexto: z.string().nullable(),
      liderQuoteAutor: z.string().nullable(),
      liderQuoteCargo: z.string().nullable(),
      liderQuoteImagen: z.string().nullable(),
      historiaIntro: z.array(z.string()),
      frasesCreemos: z.array(z.string()),
      seguridadTitulo: z.string().nullable(),
      seguridadSubtitulo: z.string().nullable(),
      seguridadItems: z.array(z.string()),
      seguridadMeta: z.string().nullable(),
      sostenibilidadTitulo: z.string().nullable(),
      sostenibilidadSubtitulo: z.string().nullable(),
      sostenibilidadItems: z.array(z.string()),
      sostenibilidadCompromiso: z.string().nullable(),
    })
    .partial(),
  createDefaults: {
    nombre: "MEISA",
    nombreCompleto: "Metálicas e Ingeniería S.A.S.",
    mision: "",
    vision: "",
    descripcion: "",
    fundacion: 1996,
  },
})

export const GET = handlers.GET
export const PUT = handlers.PUT

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"
import { CategoriaEnum } from "@prisma/client"

const anyJson: z.ZodType<unknown> = z.any()

const handlers = itemHandlers({
  delegate: prisma.obra,
  updateSchema: z
    .object({
      slug: z.string().min(1),
      titulo: z.string().min(1),
      resumenCorto: z.string().nullable(),
      contexto: z.string().nullable(),
      problemasIniciales: z.string().nullable(),
      solucionTecnica: z.string().nullable(),
      impactoCliente: z.string().nullable(),
      testimonioCliente: z.string().nullable(),
      leccionesAprendidas: z.string().nullable(),
      imagenDestacada: z.string().nullable(),
      videoUrl: z.string().nullable(),
      metaTitle: z.string().nullable(),
      metaDescription: z.string().nullable(),
      activa: z.boolean(),
      destacada: z.boolean(),
      esCadena: z.boolean(),
      orden: z.number().int(),
      categoria: z.nativeEnum(CategoriaEnum),
      desafios: anyJson,
      innovaciones: anyJson,
      resultados: anyJson,
      tagsTecnicos: anyJson,
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

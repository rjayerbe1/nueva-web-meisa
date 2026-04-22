import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { itemHandlers } from "@/lib/admin/crud"

const anyJson: z.ZodType<unknown> = z.any()

const handlers = itemHandlers({
  delegate: prisma.historiaProyecto,
  updateSchema: z
    .object({
      proyectoId: z.string().min(1),
      activo: z.boolean(),
      tituloAlternativo: z.string().nullable(),
      resumenCorto: z.string().nullable(),
      contexto: z.string().nullable(),
      problemasIniciales: z.string().nullable(),
      enfoque: z.string().nullable(),
      solucionTecnica: z.string().nullable(),
      metodologia: z.string().nullable(),
      tiempoTotal: z.string().nullable(),
      impactoCliente: z.string().nullable(),
      valorAgregado: z.string().nullable(),
      leccionesAprendidas: z.string().nullable(),
      testimonioCliente: z.string().nullable(),
      testimonioEquipo: z.string().nullable(),
      imagenDestacada: z.string().nullable(),
      videoUrl: z.string().nullable(),
      dificultadTecnica: z.number().int().min(1).max(10).nullable(),
      innovacionNivel: z.number().int().min(1).max(10).nullable(),
      desafios: anyJson,
      innovaciones: anyJson,
      equipoEspecialista: anyJson,
      fasesEjecucion: anyJson,
      recursos: anyJson,
      resultados: anyJson,
      reconocimientos: anyJson,
      datosInteres: anyJson,
      infografias: anyJson,
      tagsTecnicos: anyJson,
      imagenesDesafio: anyJson,
      imagenesSolucion: anyJson,
      imagenesResultado: anyJson,
    })
    .partial(),
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { singletonHandlers } from "@/lib/admin/crud"

const ordenSeccionSchema = z.object({
  clave: z.string(),
  activo: z.boolean(),
  label: z.string(),
})

const DEFAULT_ORDEN = [
  { clave: "hero", activo: true, label: "Hero" },
  { clave: "stats", activo: true, label: "Estadísticas" },
  { clave: "featured-project", activo: true, label: "Proyecto destacado" },
  { clave: "servicios", activo: true, label: "Servicios destacados" },
  { clave: "proyectos", activo: true, label: "Proyectos" },
  { clave: "clientes", activo: true, label: "Clientes" },
  { clave: "contacto", activo: true, label: "Contacto" },
]

const handlers = singletonHandlers({
  delegate: prisma.ordenSeccionesHome,
  updateSchema: z.object({
    orden: z.array(ordenSeccionSchema).min(1),
  }),
  createDefaults: { orden: DEFAULT_ORDEN },
})

export const GET = handlers.GET
export const PUT = handlers.PUT

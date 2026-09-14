import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { cachedContent } from "@/lib/cache/content-cache"
import { TAGS } from "@/lib/cache/tags"
import type { Plant } from "@prisma/client"

export type PlantaPublica = Plant

export const getPlantasPublicas = cache(
  cachedContent(["plantas-publicas"], [TAGS.plantas], async (): Promise<PlantaPublica[]> => {
    return prisma.plant.findMany({
      where: { activo: true },
      orderBy: [{ esSedePrincipal: "desc" }, { orden: "asc" }, { nombre: "asc" }],
    })
  }),
)

export const getPlantaBySlug = cache(
  cachedContent(["planta-by-slug"], [TAGS.plantas], async (slug: string): Promise<Plant | null> => {
    return prisma.plant.findUnique({ where: { slug } })
  }),
)

export async function getAllPlantas() {
  return prisma.plant.findMany({
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  })
}

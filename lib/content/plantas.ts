import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getSitio } from "@/lib/content/snapshot"
import type { Plant } from "@prisma/client"

export type PlantaPublica = Plant

export const getPlantasPublicas = cache(async (): Promise<PlantaPublica[]> => {
  // El snapshot ya viene ordenado [esSedePrincipal desc, orden asc, nombre asc].
  return (await getSitio()).plantas.filter((p) => p.activo)
})

export const getPlantaBySlug = cache(async (slug: string): Promise<Plant | null> => {
  return (await getSitio()).plantas.find((p) => p.slug === slug) ?? null
})

export async function getAllPlantas() {
  return prisma.plant.findMany({
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  })
}

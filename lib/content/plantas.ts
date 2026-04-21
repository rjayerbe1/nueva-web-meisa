import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type { Plant } from "@prisma/client"

export type PlantaPublica = Plant

export const getPlantasPublicas = cache(async (): Promise<PlantaPublica[]> => {
  return prisma.plant.findMany({
    where: { activo: true },
    orderBy: [{ esSedePrincipal: "desc" }, { orden: "asc" }, { nombre: "asc" }],
  })
})

export const getPlantaBySlug = cache(async (slug: string) => {
  return prisma.plant.findUnique({ where: { slug } })
})

export async function getAllPlantas() {
  return prisma.plant.findMany({
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  })
}

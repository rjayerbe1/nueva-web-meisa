import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type {
  HomeHeroEspecialidad,
  HomeStat,
  HomeFeaturedProject,
  HomeServicioDestacado,
  HomeSeccionConfig,
  OrdenSeccionesHome,
} from "@prisma/client"

export type EspecialidadItem = HomeHeroEspecialidad
export type StatItem = HomeStat
export type FeaturedProject = HomeFeaturedProject
export type ServicioHome = HomeServicioDestacado
export type SeccionConfig = HomeSeccionConfig
export type Orden = OrdenSeccionesHome

export type HomeData = {
  especialidades: EspecialidadItem[]
  stats: StatItem[]
  featured: FeaturedProject | null
  servicios: ServicioHome[]
  seccionConfig: SeccionConfig | null
  orden: Orden | null
}

/** Datos del home para consumidores públicos. */
export const getHomeData = cache(async (): Promise<HomeData> => {
  const [
    especialidades,
    stats,
    featured,
    servicios,
    seccionConfig,
    orden,
  ] = await Promise.all([
    prisma.homeHeroEspecialidad.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    }),
    prisma.homeStat.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    }),
    prisma.homeFeaturedProject.findUnique({ where: { id: "default" } }),
    prisma.homeServicioDestacado.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    }),
    prisma.homeSeccionConfig.findUnique({ where: { id: "default" } }),
    prisma.ordenSeccionesHome.findUnique({ where: { id: "default" } }),
  ])
  return { especialidades, stats, featured, servicios, seccionConfig, orden }
})

/** Evalúa un stat con valor "AUTO" como cálculo dinámico. */
export function resolveStatValue(stat: StatItem, foundingYear = 1996): string {
  if (stat.valor !== "AUTO") return stat.valor
  switch (stat.clave) {
    case "anios_experiencia":
      return String(new Date().getFullYear() - foundingYear)
    default:
      return stat.valor
  }
}

/** Todos los datos del home (incluye inactivos) — para admin. */
export async function getAllHomeData() {
  const [
    especialidades,
    stats,
    featured,
    servicios,
    seccionConfig,
    orden,
  ] = await Promise.all([
    prisma.homeHeroEspecialidad.findMany({ orderBy: { orden: "asc" } }),
    prisma.homeStat.findMany({ orderBy: { orden: "asc" } }),
    prisma.homeFeaturedProject.findUnique({ where: { id: "default" } }),
    prisma.homeServicioDestacado.findMany({ orderBy: { orden: "asc" } }),
    prisma.homeSeccionConfig.findUnique({ where: { id: "default" } }),
    prisma.ordenSeccionesHome.findUnique({ where: { id: "default" } }),
  ])
  return { especialidades, stats, featured, servicios, seccionConfig, orden }
}

import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { cachedContent } from "@/lib/cache/content-cache"
import { TAGS } from "@/lib/cache/tags"
import type {
  ConfiguracionEmpresa,
  CompanyValue,
  TimelineHito,
  Certificacion,
  Norma,
  GobiernoItem,
} from "@prisma/client"

export type EmpresaConfig = ConfiguracionEmpresa
export type Valor = CompanyValue
export type Hito = TimelineHito
export type CertificacionItem = Certificacion
export type NormaItem = Norma
export type GobiernoItemPublic = GobiernoItem

export const getConfiguracionEmpresa = cache(
  cachedContent(["configuracion-empresa"], [TAGS.configuracionEmpresa], async (): Promise<EmpresaConfig | null> => {
    return prisma.configuracionEmpresa.findUnique({ where: { id: "default" } })
  }),
)

export const getValoresActivos = cache(
  cachedContent(["empresa-valores"], [TAGS.empresa], async (): Promise<Valor[]> => {
    return prisma.companyValue.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    })
  }),
)

export const getHitosActivos = cache(
  cachedContent(["empresa-hitos"], [TAGS.empresa], async (): Promise<Hito[]> => {
    return prisma.timelineHito.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    })
  }),
)

export const getCertificacionesActivas = cache(
  cachedContent(["empresa-certificaciones"], [TAGS.empresa], async (): Promise<CertificacionItem[]> => {
    return prisma.certificacion.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    })
  }),
)

export const getNormasActivas = cache(
  cachedContent(["empresa-normas"], [TAGS.empresa], async (): Promise<NormaItem[]> => {
    return prisma.norma.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    })
  }),
)

export const getGobiernoItemsActivos = cache(
  cachedContent(["empresa-gobierno"], [TAGS.empresa], async (): Promise<GobiernoItemPublic[]> => {
    return prisma.gobiernoItem.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    })
  }),
)

export type EmpresaData = {
  config: EmpresaConfig | null
  valores: Valor[]
  hitos: Hito[]
  certificaciones: CertificacionItem[]
  normas: NormaItem[]
  gobierno: GobiernoItemPublic[]
}

export async function getEmpresaData(): Promise<EmpresaData> {
  const [config, valores, hitos, certificaciones, normas, gobierno] = await Promise.all([
    getConfiguracionEmpresa(),
    getValoresActivos(),
    getHitosActivos(),
    getCertificacionesActivas(),
    getNormasActivas(),
    getGobiernoItemsActivos(),
  ])
  return { config, valores, hitos, certificaciones, normas, gobierno }
}

// Versión "completa" para admin (incluye inactivos)
export async function getAllEmpresaData() {
  const [config, valores, hitos, certificaciones, normas] = await Promise.all([
    prisma.configuracionEmpresa.findUnique({ where: { id: "default" } }),
    prisma.companyValue.findMany({ orderBy: { orden: "asc" } }),
    prisma.timelineHito.findMany({ orderBy: { orden: "asc" } }),
    prisma.certificacion.findMany({ orderBy: { orden: "asc" } }),
    prisma.norma.findMany({ orderBy: { orden: "asc" } }),
  ])
  return { config, valores, hitos, certificaciones, normas }
}

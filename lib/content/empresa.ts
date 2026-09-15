import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getSitio } from "@/lib/content/snapshot"
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

export const getConfiguracionEmpresa = cache(async (): Promise<EmpresaConfig | null> => {
  return (await getSitio()).configuracionEmpresa
})

export const getValoresActivos = cache(async (): Promise<Valor[]> => {
  return (await getSitio()).empresa.valores
})

export const getHitosActivos = cache(async (): Promise<Hito[]> => {
  return (await getSitio()).empresa.hitos
})

export const getCertificacionesActivas = cache(async (): Promise<CertificacionItem[]> => {
  return (await getSitio()).empresa.certificaciones
})

export const getNormasActivas = cache(async (): Promise<NormaItem[]> => {
  return (await getSitio()).empresa.normas
})

export const getGobiernoItemsActivos = cache(async (): Promise<GobiernoItemPublic[]> => {
  return (await getSitio()).empresa.gobierno
})

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

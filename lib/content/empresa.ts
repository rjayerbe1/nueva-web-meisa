import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type {
  ConfiguracionEmpresa,
  CompanyValue,
  TimelineHito,
  Certificacion,
  Norma,
} from "@prisma/client"

export type EmpresaConfig = ConfiguracionEmpresa
export type Valor = CompanyValue
export type Hito = TimelineHito
export type CertificacionItem = Certificacion
export type NormaItem = Norma

export const getConfiguracionEmpresa = cache(async (): Promise<EmpresaConfig | null> => {
  return prisma.configuracionEmpresa.findUnique({ where: { id: "default" } })
})

export const getValoresActivos = cache(async (): Promise<Valor[]> => {
  return prisma.companyValue.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  })
})

export const getHitosActivos = cache(async (): Promise<Hito[]> => {
  return prisma.timelineHito.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  })
})

export const getCertificacionesActivas = cache(async (): Promise<CertificacionItem[]> => {
  return prisma.certificacion.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  })
})

export const getNormasActivas = cache(async (): Promise<NormaItem[]> => {
  return prisma.norma.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  })
})

export type EmpresaData = {
  config: EmpresaConfig | null
  valores: Valor[]
  hitos: Hito[]
  certificaciones: CertificacionItem[]
  normas: NormaItem[]
}

export async function getEmpresaData(): Promise<EmpresaData> {
  const [config, valores, hitos, certificaciones, normas] = await Promise.all([
    getConfiguracionEmpresa(),
    getValoresActivos(),
    getHitosActivos(),
    getCertificacionesActivas(),
    getNormasActivas(),
  ])
  return { config, valores, hitos, certificaciones, normas }
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

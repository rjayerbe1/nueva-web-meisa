import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getSitio } from "@/lib/content/snapshot"
import type {
  GrupoSeccion,
  Tecnologia,
  Equipo,
  ProcesoDigital,
  Politica,
  PilarSIG,
  EtapaControlCalidad,
  FaseFlujoTecnologia,
} from "@prisma/client"

export type GrupoSeccionItem = GrupoSeccion
export type TecnologiaItem = Tecnologia
export type EquipoItem = Equipo
export type ProcesoDigitalItem = ProcesoDigital
export type PoliticaItem = Politica
export type PilarSIGItem = PilarSIG
export type EtapaControlCalidadItem = EtapaControlCalidad
export type FaseFlujoTecnologiaItem = FaseFlujoTecnologia

/* ------------------------------------------------------------------ */
/*  Procesos & Tecnologías                                            */
/* ------------------------------------------------------------------ */

export type ProcesosTecnologiasData = {
  grupos: GrupoSeccion[]
  tecnologias: Tecnologia[]
  equipos: Equipo[]
  procesos: ProcesoDigital[]
  fasesFlujo: FaseFlujoTecnologia[]
}

export const getProcesosTecnologiasData = cache(async (): Promise<ProcesosTecnologiasData> => {
  return (await getSitio()).tecnologia
})

export async function getAllProcesosTecnologiasData() {
  const [grupos, tecnologias, equipos, procesos, fasesFlujo] = await Promise.all([
    prisma.grupoSeccion.findMany({
      where: { pagina: "tecnologia" },
      orderBy: { orden: "asc" },
    }),
    prisma.tecnologia.findMany({
      orderBy: [{ categoria: "asc" }, { orden: "asc" }],
    }),
    prisma.equipo.findMany({
      orderBy: [{ categoria: "asc" }, { orden: "asc" }],
    }),
    prisma.procesoDigital.findMany({ orderBy: { orden: "asc" } }),
    prisma.faseFlujoTecnologia.findMany({ orderBy: { orden: "asc" } }),
  ])
  return { grupos, tecnologias, equipos, procesos, fasesFlujo }
}

/* ------------------------------------------------------------------ */
/*  Políticas                                                         */
/* ------------------------------------------------------------------ */

export type PoliticasData = {
  grupos: GrupoSeccion[]
  pilares: PilarSIG[]
  politicas: Politica[]
  etapasControl: EtapaControlCalidad[]
  procesos: ProcesoDigital[]
}

export const getPoliticasData = cache(async (): Promise<PoliticasData> => {
  const { calidad, tecnologia } = await getSitio()
  // procesos digitales activos: la misma lista que usa /procesos-tecnologias.
  return { ...calidad, procesos: tecnologia.procesos }
})

export async function getAllPoliticasData() {
  const [grupos, pilares, politicas, etapasControl, procesos] = await Promise.all([
    prisma.grupoSeccion.findMany({
      where: { pagina: "calidad" },
      orderBy: { orden: "asc" },
    }),
    prisma.pilarSIG.findMany({ orderBy: { orden: "asc" } }),
    prisma.politica.findMany({ orderBy: { orden: "asc" } }),
    prisma.etapaControlCalidad.findMany({ orderBy: { orden: "asc" } }),
    prisma.procesoDigital.findMany({ orderBy: { orden: "asc" } }),
  ])
  return { grupos, pilares, politicas, etapasControl, procesos }
}

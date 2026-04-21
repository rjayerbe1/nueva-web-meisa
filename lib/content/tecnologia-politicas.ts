import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type {
  GrupoSeccion,
  Tecnologia,
  Equipo,
  ProcesoDigital,
  Politica,
  PilarSIG,
} from "@prisma/client"

export type GrupoSeccionItem = GrupoSeccion
export type TecnologiaItem = Tecnologia
export type EquipoItem = Equipo
export type ProcesoDigitalItem = ProcesoDigital
export type PoliticaItem = Politica
export type PilarSIGItem = PilarSIG

/* ------------------------------------------------------------------ */
/*  Procesos & Tecnologías                                            */
/* ------------------------------------------------------------------ */

export type ProcesosTecnologiasData = {
  grupos: GrupoSeccion[]
  tecnologias: Tecnologia[]
  equipos: Equipo[]
  procesos: ProcesoDigital[]
}

export const getProcesosTecnologiasData = cache(
  async (): Promise<ProcesosTecnologiasData> => {
    const [grupos, tecnologias, equipos, procesos] = await Promise.all([
      prisma.grupoSeccion.findMany({
        where: { pagina: "tecnologia", activo: true },
        orderBy: { orden: "asc" },
      }),
      prisma.tecnologia.findMany({
        where: { activo: true },
        orderBy: [{ categoria: "asc" }, { orden: "asc" }],
      }),
      prisma.equipo.findMany({
        where: { activo: true },
        orderBy: [{ categoria: "asc" }, { orden: "asc" }],
      }),
      prisma.procesoDigital.findMany({
        where: { activo: true },
        orderBy: { orden: "asc" },
      }),
    ])
    return { grupos, tecnologias, equipos, procesos }
  }
)

export async function getAllProcesosTecnologiasData() {
  const [grupos, tecnologias, equipos, procesos] = await Promise.all([
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
  ])
  return { grupos, tecnologias, equipos, procesos }
}

/* ------------------------------------------------------------------ */
/*  Políticas                                                         */
/* ------------------------------------------------------------------ */

export type PoliticasData = {
  grupos: GrupoSeccion[]
  pilares: PilarSIG[]
  politicas: Politica[]
}

export const getPoliticasData = cache(async (): Promise<PoliticasData> => {
  const [grupos, pilares, politicas] = await Promise.all([
    prisma.grupoSeccion.findMany({
      where: { pagina: "calidad", activo: true },
      orderBy: { orden: "asc" },
    }),
    prisma.pilarSIG.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    }),
    prisma.politica.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    }),
  ])
  return { grupos, pilares, politicas }
})

export async function getAllPoliticasData() {
  const [grupos, pilares, politicas] = await Promise.all([
    prisma.grupoSeccion.findMany({
      where: { pagina: "calidad" },
      orderBy: { orden: "asc" },
    }),
    prisma.pilarSIG.findMany({ orderBy: { orden: "asc" } }),
    prisma.politica.findMany({ orderBy: { orden: "asc" } }),
  ])
  return { grupos, pilares, politicas }
}

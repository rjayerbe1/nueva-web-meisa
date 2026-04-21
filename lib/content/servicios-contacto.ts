import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type {
  ProcesoFase,
  FormOption,
  ConfiguracionContacto,
} from "@prisma/client"

export type ProcesoFaseItem = ProcesoFase
export type FormOptionItem = FormOption
export type ContactoConfig = ConfiguracionContacto

export const getProcesoFases = cache(async () => {
  return prisma.procesoFase.findMany({
    where: { activo: true },
    orderBy: { numero: "asc" },
  })
})

export async function getAllProcesoFases() {
  return prisma.procesoFase.findMany({ orderBy: { numero: "asc" } })
}

export const getTiposProyecto = cache(async () => {
  return prisma.formOption.findMany({
    where: { grupo: "TIPO_PROYECTO", activo: true },
    orderBy: { orden: "asc" },
  })
})

export const getServiciosContacto = cache(async () => {
  return prisma.formOption.findMany({
    where: { grupo: "SERVICIO_CONTACTO", activo: true },
    orderBy: { orden: "asc" },
  })
})

export async function getAllFormOptions() {
  return prisma.formOption.findMany({
    orderBy: [{ grupo: "asc" }, { orden: "asc" }],
  })
}

export const getConfiguracionContacto = cache(async () => {
  return prisma.configuracionContacto.findUnique({ where: { id: "default" } })
})

export type ContactoData = {
  config: ContactoConfig | null
  tiposProyecto: FormOption[]
  serviciosContacto: FormOption[]
}

export async function getContactoData(): Promise<ContactoData> {
  const [config, tiposProyecto, serviciosContacto] = await Promise.all([
    getConfiguracionContacto(),
    getTiposProyecto(),
    getServiciosContacto(),
  ])
  return { config, tiposProyecto, serviciosContacto }
}

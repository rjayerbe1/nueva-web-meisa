import { cache } from "react"
import { prisma } from "@/lib/prisma"

export type VacanteResumen = {
  id: string
  slug: string
  titulo: string
  area: string | null
  ciudad: string | null
}

export type TalentoPublico = {
  activa: boolean
  vacantes: VacanteResumen[]
}

/**
 * Estado público del módulo de Talento: si la página de empleo está encendida
 * (ConfiguracionTalento.paginaPublicaActiva) y qué vacantes hay abiertas.
 *
 * Lo consumen el footer (layout público) y la banda de /contacto: ambos
 * enlazan a /trabaja-con-nosotros SOLO si el switch está prendido, para que
 * apagarla desde el admin retire los enlaces solo y nunca queden apuntando
 * a un notFound().
 */
export const getTalentoPublico = cache(async (): Promise<TalentoPublico> => {
  const config = await prisma.configuracionTalento.findUnique({
    where: { id: "default" },
    select: { paginaPublicaActiva: true },
  })
  if (!config?.paginaPublicaActiva) return { activa: false, vacantes: [] }

  const vacantes = await prisma.vacante.findMany({
    where: { estado: "ABIERTA" },
    orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
    select: { id: true, slug: true, titulo: true, area: true, ciudad: true },
  })
  return { activa: true, vacantes }
})

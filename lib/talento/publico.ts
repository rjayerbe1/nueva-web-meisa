import { cache } from "react"
import { getSitio } from "@/lib/content/snapshot"

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
  const { talento, vacantesAbiertas } = await getSitio()
  if (!talento?.paginaPublicaActiva) return { activa: false, vacantes: [] }
  return {
    activa: true,
    vacantes: vacantesAbiertas.map((v) => ({
      id: v.id,
      slug: v.slug,
      titulo: v.titulo,
      area: v.area,
      ciudad: v.ciudad,
    })),
  }
})

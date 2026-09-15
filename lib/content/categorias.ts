import { cache } from "react"
import { getCatalogo } from "@/lib/content/snapshot"

export type CategoriaPublica = {
  id: string
  key: string
  nombre: string
  descripcion: string | null
  slug: string
  imagenCover: string | null
  videoCover: string | null
  usarVideoCover: boolean
  videoCoverScale: number | null
  videoCoverPosition: string | null
  icono: string | null
  color: string | null
  colorSecundario: string | null
  overlayColor: string | null
  overlayOpacity: number | null
  hoverOverlayColor: string | null
  hoverOverlayOpacity: number | null
  enableHoverOverlay: boolean
  visible: boolean
  destacada: boolean
}

export const getCategoriasPublicas = cache(async (): Promise<CategoriaPublica[]> => {
  const { categorias } = await getCatalogo()
  return categorias
    .filter((c) => c.visible)
    .map((c) => ({
      id: c.id,
      key: c.key,
      nombre: c.nombre,
      descripcion: c.descripcion,
      slug: c.slug,
      imagenCover: c.imagenCover,
      videoCover: c.videoCover,
      usarVideoCover: c.usarVideoCover,
      videoCoverScale: c.videoCoverScale,
      videoCoverPosition: c.videoCoverPosition,
      icono: c.icono,
      color: c.color,
      colorSecundario: c.colorSecundario,
      overlayColor: c.overlayColor,
      overlayOpacity: c.overlayOpacity,
      hoverOverlayColor: c.hoverOverlayColor,
      hoverOverlayOpacity: c.hoverOverlayOpacity,
      enableHoverOverlay: c.enableHoverOverlay,
      visible: c.visible,
      destacada: c.destacada,
    }))
})

/**
 * Total de proyectos visibles. Lo usan ~20 landings (servicios, soluciones,
 * ciudades, pilar) para la cifra "N proyectos".
 */
export const getTotalProyectosVisibles = cache(async (): Promise<number> => {
  return (await getCatalogo()).proyectos.length
})

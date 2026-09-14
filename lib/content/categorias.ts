import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { cachedContent } from "@/lib/cache/content-cache"
import { TAGS } from "@/lib/cache/tags"

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

export const getCategoriasPublicas = cache(
  cachedContent(["categorias-publicas"], [TAGS.categoriasProyecto], async (): Promise<CategoriaPublica[]> => {
  return await prisma.categoriaProyecto.findMany({
    where: { visible: true },
    orderBy: { orden: 'asc' },
    select: {
      id: true,
      key: true,
      nombre: true,
      descripcion: true,
      slug: true,
      imagenCover: true,
      videoCover: true,
      usarVideoCover: true,
      videoCoverScale: true,
      videoCoverPosition: true,
      icono: true,
      color: true,
      colorSecundario: true,
      overlayColor: true,
      overlayOpacity: true,
      hoverOverlayColor: true,
      hoverOverlayOpacity: true,
      enableHoverOverlay: true,
      visible: true,
      destacada: true,
    },
  })
  }),
)

/**
 * Total de proyectos visibles. Lo usan ~20 landings (servicios, soluciones,
 * ciudades, pilar) para la cifra "N proyectos": una sola lectura por hora
 * en vez de una por ruta.
 */
export const getTotalProyectosVisibles = cache(
  cachedContent(["proyectos-visibles-count"], [TAGS.proyectos], async (): Promise<number> => {
    const agg = await prisma.proyecto.aggregate({ where: { visible: true }, _count: { _all: true } })
    return agg._count._all
  }),
)

import { cache } from "react"
import { prisma } from "@/lib/prisma"

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
})

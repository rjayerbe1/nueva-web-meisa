import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CategoriesPageClient from "@/components/admin/CategoriesPageClient"

async function getCategories() {
  const categorias = await prisma.categoriaProyecto.findMany({
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
      imagenBanner: true,
      videoBanner: true,
      usarVideoBanner: true,
      videoBannerScale: true,
      videoBannerPosition: true,
      icono: true,
      color: true,
      colorSecundario: true,
      overlayColor: true,
      overlayOpacity: true,
      hoverOverlayColor: true,
      hoverOverlayOpacity: true,
      enableHoverOverlay: true,
      metaTitle: true,
      metaDescription: true,
      orden: true,
      visible: true,
      destacada: true,
      totalProyectos: true,
      createdAt: true,
      updatedAt: true,
      descripcionAmpliada: true,
      procesoTrabajo: true,
      estadisticas: true,
      casosExitoIds: true,
      especialidades: true,
    }
  })

  return categorias
}

async function getCategoryStats() {
  const stats = await prisma.proyecto.groupBy({
    by: ['categoria'],
    _count: {
      categoria: true
    }
  })

  return stats.reduce((acc, stat) => {
    acc[stat.categoria] = stat._count.categoria
    return acc
  }, {} as Record<string, number>)
}

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const [categorias, categoryStats] = await Promise.all([
    getCategories(),
    getCategoryStats()
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
        <p className="text-gray-600 mt-2">
          Administra las categorías de proyectos, sus imágenes de portada, iconos y configuración visual.
        </p>
      </div>

      <CategoriesPageClient 
        categorias={categorias as any} 
        categoryStats={categoryStats}
        canEdit={session.user.role !== 'VIEWER'}
      />
    </div>
  )
}

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CategoriesPageClient from "@/components/admin/CategoriesPageClient"

async function getCategories() {
  return await prisma.categoriaProyecto.findMany({
    orderBy: { orden: 'asc' }
  })
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
        categorias={categorias} 
        categoryStats={categoryStats}
        canEdit={session.user.role !== 'VIEWER'}
      />
    </div>
  )
}
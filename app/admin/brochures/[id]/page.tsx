import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { BrochureForm } from "@/components/admin/BrochureForm"
import Link from "next/link"
import { FileText, ExternalLink } from "lucide-react"

async function getBrochureAndData(brochureId: string) {
  const [brochure, categories] = await Promise.all([
    prisma.brochure.findUnique({
      where: { id: brochureId },
      include: {
        template: {
          select: {
            id: true,
            nombre: true
          }
        },
        categoria: {
          select: {
            id: true,
            nombre: true,
            slug: true
          }
        },
        _count: {
          select: {
            pages: true
          }
        }
      }
    }),
    prisma.categoriaProyecto.findMany({
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        slug: true,
        key: true,
        brochure: {
          select: {
            id: true,
            titulo: true
          }
        }
      }
    })
  ])

  if (!brochure) {
    return null
  }

  // Filtrar categorías: incluir la actual o las que no tienen brochure
  const availableCategories = categories.filter(
    cat => !cat.brochure || cat.id === brochure.categoriaId
  )

  return { brochure, categories: availableCategories }
}

export default async function EditBrochurePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/admin")
  }

  const data = await getBrochureAndData(params.id)

  if (!data) {
    notFound()
  }

  const { brochure, categories } = data

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header con acciones rápidas */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Brochure</h1>
          <p className="mt-2 text-lg text-gray-600">
            {brochure.titulo}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/brochures/${brochure.id}/builder`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Abrir Builder
          </Link>
          {brochure.publicado && (
            <Link
              href={`/brochure/${brochure.urlAmigable}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Brochure
            </Link>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Template</p>
          <p className="text-lg font-semibold text-gray-900">{brochure.template.nombre}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Páginas</p>
          <p className="text-lg font-semibold text-gray-900">{brochure._count.pages}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Estado</p>
          <div className="flex items-center gap-2 mt-1">
            {brochure.publicado && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Publicado
              </span>
            )}
            {brochure.activo && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                Activo
              </span>
            )}
            {!brochure.activo && !brochure.publicado && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                Inactivo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <BrochureForm
        categories={categories}
        brochure={{
          id: brochure.id,
          titulo: brochure.titulo,
          descripcion: brochure.descripcion,
          templateId: brochure.templateId,
          categoriaId: brochure.categoriaId,
          urlAmigable: brochure.urlAmigable,
          activo: brochure.activo,
          publicado: brochure.publicado,
          thumbnail: brochure.thumbnail
        }}
      />
    </div>
  )
}

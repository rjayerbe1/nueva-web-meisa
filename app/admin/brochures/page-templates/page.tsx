import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { PageTemplatesTable } from "@/components/admin/PageTemplatesTable"
import Link from "next/link"
import { Plus, Layout } from "lucide-react"

async function getPageTemplates() {
  const templates = await prisma.pageTemplate.findMany({
    orderBy: [
      { usageCount: 'desc' },
      { createdAt: 'desc' }
    ],
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      thumbnail: true,
      categoria: true,
      usageCount: true,
      isPublic: true,
      createdAt: true
    }
  })

  return templates
}

export default async function PageTemplatesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/admin")
  }

  const templates = await getPageTemplates()

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Layout className="w-8 h-8 text-blue-600" />
            Plantillas de Páginas
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Gestiona las plantillas de páginas para tus brochures digitales
          </p>
        </div>

        <Link
          href="/admin/brochures/page-templates/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nueva Plantilla
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Total Plantillas</p>
          <p className="text-3xl font-bold text-gray-900">{templates.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Públicas</p>
          <p className="text-3xl font-bold text-green-600">
            {templates.filter(t => t.isPublic).length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Más Usada</p>
          <p className="text-lg font-bold text-blue-600 line-clamp-1">
            {templates.length > 0
              ? templates.sort((a, b) => b.usageCount - a.usageCount)[0]?.nombre || '-'
              : '-'}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Total de Usos</p>
          <p className="text-3xl font-bold text-purple-600">
            {templates.reduce((sum, t) => sum + t.usageCount, 0)}
          </p>
        </div>
      </div>

      {/* Tabla de plantillas */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <PageTemplatesTable templates={templates} />
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Consejos para Plantillas
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Las plantillas públicas están disponibles para todos los usuarios</li>
          <li>• Usa categorías para organizar tus plantillas fácilmente</li>
          <li>• Puedes guardar cualquier página del builder como plantilla</li>
          <li>• Los thumbnails se generan automáticamente al guardar</li>
          <li>• Duplica plantillas existentes para crear variaciones rápidamente</li>
        </ul>
      </div>
    </div>
  )
}

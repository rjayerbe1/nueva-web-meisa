import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { PageTemplateForm } from "@/components/admin/PageTemplateForm"

async function getPageTemplate(id: string) {
  const template = await prisma.pageTemplate.findUnique({
    where: { id }
  })

  return template
}

export default async function EditPageTemplatePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/admin")
  }

  const template = await getPageTemplate(params.id)

  if (!template) {
    notFound()
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Plantilla</h1>
        <p className="mt-2 text-lg text-gray-600">
          {template.nombre}
        </p>
      </div>

      {/* Stats de uso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Veces usada</p>
          <p className="text-3xl font-bold text-blue-600">{template.usageCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Categoría</p>
          <p className="text-lg font-semibold text-gray-900">{template.categoria || 'Sin categoría'}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Visibilidad</p>
          <p className="text-lg font-semibold text-gray-900">
            {template.isPublic ? 'Pública' : 'Privada'}
          </p>
        </div>
      </div>

      <PageTemplateForm
        template={{
          id: template.id,
          nombre: template.nombre,
          descripcion: template.descripcion,
          thumbnail: template.thumbnail,
          categoria: template.categoria,
          canvasData: template.canvasData,
          configuracion: template.configuracion as any,
          isPublic: template.isPublic
        }}
      />
    </div>
  )
}

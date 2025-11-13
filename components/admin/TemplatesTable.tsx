"use client"

import Link from "next/link"
import Image from "next/image"
import { FileText, Edit, Trash2, Star, Eye, Users } from "lucide-react"
import type { CategoriaEnum } from "@prisma/client"

interface Template {
  id: string
  nombre: string
  descripcion: string | null
  thumbnail: string | null
  tipoCategoria: CategoriaEnum | null
  isPublic: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
  _count: {
    brochures: number
    pages: number
  }
}

interface TemplatesTableProps {
  templates: Template[]
}

export function TemplatesTable({ templates }: TemplatesTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDelete = async (templateId: string, templateName: string, usageCount: number) => {
    if (usageCount > 0) {
      alert(`❌ No se puede eliminar: hay ${usageCount} brochure(s) usando este template`)
      return
    }

    const firstConfirm = confirm(
      `⚠️ ADVERTENCIA: Vas a eliminar el template "${templateName}"\n\n` +
      `Esta acción eliminará:\n` +
      `• El template completo\n` +
      `• Todas las páginas del template\n` +
      `• ESTA ACCIÓN NO SE PUEDE DESHACER\n\n` +
      `¿Estás completamente seguro?`
    )

    if (!firstConfirm) return

    const secondConfirm = confirm(
      `🔴 ÚLTIMA CONFIRMACIÓN\n\n` +
      `¿Proceder con la eliminación definitiva del template "${templateName}"?`
    )

    if (!secondConfirm) return

    try {
      const response = await fetch(`/api/admin/brochures/templates/${templateId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert(`✅ Template "${templateName}" eliminado exitosamente`)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`❌ Error al eliminar el template: ${error.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error al eliminar template:', error)
      alert('❌ Error al conectar con el servidor')
    }
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay templates</h3>
        <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo template</p>
        <div className="mt-6">
          <Link
            href="/admin/brochures/templates/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-meisa-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue"
          >
            <FileText className="h-5 w-5 mr-2" />
            Nuevo Template
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Template
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Páginas
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              En Uso
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {templates.map((template) => (
            <tr key={template.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    {template.thumbnail ? (
                      <Image
                        className="h-12 w-12 rounded-lg object-cover"
                        src={template.thumbnail}
                        alt={template.nombre}
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-meisa-blue bg-opacity-10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-meisa-blue" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      {template.nombre}
                      {template.isDefault && (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                    {template.descripcion && (
                      <div className="text-sm text-gray-500">{template.descripcion}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {template.tipoCategoria ? (
                  <span className="text-xs text-gray-600">
                    {template.tipoCategoria.replace(/_/g, ' ')}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">General</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {template._count.pages}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {template._count.brochures}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  {template.isDefault && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                      Por defecto
                    </span>
                  )}
                  {template.isPublic && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Público
                    </span>
                  )}
                  {!template.isPublic && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      Privado
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/brochures/templates/${template.id}`}
                    className="text-meisa-blue hover:text-blue-700 transition-colors p-1 rounded"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(template.id, template.nombre, template._count.brochures)}
                    className="text-red-600 hover:text-red-900 transition-colors p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title={template._count.brochures > 0 ? "No se puede eliminar (en uso)" : "Eliminar"}
                    disabled={template._count.brochures > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

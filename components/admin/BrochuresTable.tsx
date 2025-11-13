"use client"

import Link from "next/link"
import Image from "next/image"
import { BookOpen, Eye, Edit, Trash2, FileText, Globe, Calendar } from "lucide-react"
import type { CategoriaEnum } from "@prisma/client"

interface Brochure {
  id: string
  titulo: string
  descripcion: string | null
  activo: boolean
  publicado: boolean
  urlAmigable: string
  thumbnail: string | null
  versionNumero: number
  fechaPublicacion: string | null
  createdAt: string
  updatedAt: string
  template: {
    nombre: string
    thumbnail: string | null
  }
  categoria: {
    nombre: string
    slug: string
    key: CategoriaEnum
  } | null
  _count: {
    pages: number
    analytics: number
  }
}

interface BrochuresTableProps {
  brochures: Brochure[]
}

export function BrochuresTable({ brochures }: BrochuresTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (brochure: Brochure) => {
    if (brochure.publicado) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Publicado</span>
    }
    if (brochure.activo) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Activo</span>
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Inactivo</span>
  }

  const getCategoryColor = (key: CategoriaEnum) => {
    switch (key) {
      case 'CENTROS_COMERCIALES': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'EDIFICIOS': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PUENTES_VEHICULARES': return 'bg-green-100 text-green-800 border-green-200'
      case 'PUENTES_PEATONALES': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'INDUSTRIA': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'ESCENARIOS_DEPORTIVOS': return 'bg-red-100 text-red-800 border-red-200'
      case 'CUBIERTAS_Y_FACHADAS': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'ESTRUCTURAS_MODULARES': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'OIL_AND_GAS': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleDelete = async (brochureId: string, brochureTitle: string) => {
    const firstConfirm = confirm(
      `⚠️ ADVERTENCIA: Vas a eliminar el brochure "${brochureTitle}"\n\n` +
      `Esta acción eliminará:\n` +
      `• El brochure completo\n` +
      `• Todas las páginas asociadas\n` +
      `• Todos los datos analíticos\n` +
      `• ESTA ACCIÓN NO SE PUEDE DESHACER\n\n` +
      `¿Estás completamente seguro?`
    )

    if (!firstConfirm) return

    const secondConfirm = confirm(
      `🔴 ÚLTIMA CONFIRMACIÓN\n\n` +
      `Escribe mentalmente el nombre del brochure para confirmar:\n` +
      `"${brochureTitle}"\n\n` +
      `¿Proceder con la eliminación definitiva?`
    )

    if (!secondConfirm) return

    try {
      const response = await fetch(`/api/brochures/${brochureId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert(`✅ Brochure "${brochureTitle}" eliminado exitosamente`)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`❌ Error al eliminar el brochure: ${error.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error al eliminar brochure:', error)
      alert('❌ Error al conectar con el servidor')
    }
  }

  if (brochures.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay brochures</h3>
        <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo brochure digital</p>
        <div className="mt-6">
          <Link
            href="/admin/brochures/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-meisa-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Nuevo Brochure
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
              Brochure
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Template
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Páginas
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actualizado
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {brochures.map((brochure) => (
            <tr key={brochure.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    {brochure.thumbnail ? (
                      <Image
                        className="h-12 w-12 rounded-lg object-cover"
                        src={brochure.thumbnail}
                        alt={brochure.titulo}
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
                    <div className="text-sm font-medium text-gray-900">{brochure.titulo}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {brochure.urlAmigable}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {brochure.categoria ? (
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md border ${getCategoryColor(brochure.categoria.key)}`}>
                    {brochure.categoria.nombre}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Sin categoría</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{brochure.template.nombre}</div>
                <div className="text-xs text-gray-500">v{brochure.versionNumero}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(brochure)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {brochure._count.pages}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  {formatDate(brochure.updatedAt)}
                </div>
                {brochure.publicado && brochure.fechaPublicacion && (
                  <div className="text-xs text-gray-500">Pub: {formatDate(brochure.fechaPublicacion)}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/brochure/${brochure.urlAmigable}`}
                    target="_blank"
                    className="text-gray-600 hover:text-meisa-blue transition-colors p-1 rounded"
                    title="Ver brochure"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/brochures/${brochure.id}`}
                    className="text-meisa-blue hover:text-blue-700 transition-colors p-1 rounded"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/brochures/${brochure.id}/builder`}
                    className="text-indigo-600 hover:text-indigo-700 transition-colors p-1 rounded"
                    title="Abrir en Builder"
                  >
                    <FileText className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(brochure.id, brochure.titulo)}
                    className="text-red-600 hover:text-red-900 transition-colors p-1 rounded"
                    title="Eliminar"
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

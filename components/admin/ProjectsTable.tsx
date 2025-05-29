"use client"

import Link from "next/link"
import { Building2, Eye, Edit, Trash2, MapPin, Calendar, DollarSign } from "lucide-react"

interface Project {
  id: string
  titulo: string
  categoria: string
  estado: string
  cliente: string
  ubicacion: string
  fechaInicio: Date
  presupuesto: any
  destacado: boolean
  visible: boolean
  createdAt: Date
}

interface ProjectsTableProps {
  projects: Project[]
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const formatCurrency = (amount: any) => {
    if (!amount) return 'No definido'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount))
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO': return 'bg-green-100 text-green-800'
      case 'EN_PROGRESO': return 'bg-blue-100 text-blue-800'
      case 'PAUSADO': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELADO': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'CENTROS_COMERCIALES': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'EDIFICIOS': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PUENTES': return 'bg-green-100 text-green-800 border-green-200'
      case 'INDUSTRIAL': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'CENTROS_COMERCIALES': return '🏬'
      case 'EDIFICIOS': return '🏢'
      case 'PUENTES': return '🌉'
      case 'INDUSTRIAL': return '🏭'
      default: return '🏗️'
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Recargar la página para actualizar la lista
        window.location.reload()
      } else {
        alert('Error al eliminar el proyecto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el proyecto')
    }
  }

  if (projects.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
        <p className="text-gray-500 mb-4">Comienza creando tu primer proyecto</p>
        <Link
          href="/admin/projects/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
        >
          <Building2 className="h-4 w-4" />
          Crear Proyecto
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Proyecto
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Cliente / Ubicación
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Presupuesto
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Fecha Inicio
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ${
                      project.destacado ? 'bg-gradient-to-br from-yellow-100 to-amber-200' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}>
                      <Building2 className={`h-6 w-6 ${
                        project.destacado ? 'text-yellow-700' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {project.titulo}
                      </div>
                      {project.destacado && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Destacado
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">ID: {project.id.slice(0, 8)}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div>
                  <div className="text-sm font-medium text-gray-900">{project.cliente}</div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {project.ubicacion}
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border ${getCategoryColor(project.categoria)}`}>
                  <span className="mr-1.5">{getCategoryIcon(project.categoria)}</span>
                  {project.categoria.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mr-2 ${
                    project.estado === 'COMPLETADO' ? 'bg-green-500' :
                    project.estado === 'EN_PROGRESO' ? 'bg-blue-500' :
                    project.estado === 'PAUSADO' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md ${getStatusColor(project.estado)}`}>
                    {project.estado.replace('_', ' ')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                  {formatCurrency(project.presupuesto)}
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  {new Date(project.fechaInicio).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center justify-center space-x-1">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Eliminar"
                    onClick={() => handleDelete(project.id)}
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
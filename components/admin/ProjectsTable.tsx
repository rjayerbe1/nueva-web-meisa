"use client"

import Link from "next/link"
import Image from "next/image"
import { Building2, Eye, Edit, Trash2, MapPin, Calendar, DollarSign, Scale, Ruler } from "lucide-react"

interface Project {
  id: string
  titulo: string
  codigoInterno: string | null
  categoria: string
  estado: string
  cliente: string
  ubicacion: string
  fechaInicio: string
  fechaFin: string | null
  presupuesto: number | null
  toneladas: number | null
  areaTotal: number | null
  destacado: boolean
  visible: boolean
  createdAt: string
  imagenPortada: {
    url: string
    alt: string
  } | null
}

interface ProjectsTableProps {
  projects: Project[]
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const formatCurrency = (amount: any) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount))
  }

  const formatToneladas = (toneladas: any) => {
    if (!toneladas) return '-'
    return `${parseFloat(toneladas).toFixed(1)} ton`
  }

  const formatArea = (area: any) => {
    if (!area) return '-'
    const areaNum = parseFloat(area)
    if (areaNum >= 10000) {
      return `${(areaNum / 10000).toFixed(1)} ha`
    }
    return `${areaNum.toLocaleString('es-CO')} m²`
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

  const handleDelete = async (projectId: string, projectTitle: string) => {
    // Primera confirmación
    const firstConfirm = confirm(
      `⚠️ ADVERTENCIA: Vas a eliminar el proyecto "${projectTitle}"\n\n` +
      `Esta acción eliminará:\n` +
      `• El proyecto completo\n` +
      `• Todas las imágenes asociadas\n` +
      `• Todo el progreso y comentarios\n` +
      `• ESTA ACCIÓN NO SE PUEDE DESHACER\n\n` +
      `¿Estás completamente seguro?`
    )
    
    if (!firstConfirm) return

    // Segunda confirmación más estricta
    const confirmPhrase = prompt(
      `Para confirmar la eliminación del proyecto "${projectTitle}", escribe exactamente:\n\n` +
      `ELIMINAR PROYECTO\n\n` +
      `(Distingue mayúsculas y minúsculas)`
    )

    if (confirmPhrase !== 'ELIMINAR PROYECTO') {
      if (confirmPhrase !== null) {
        alert('Frase de confirmación incorrecta. Eliminación cancelada.')
      }
      return
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Proyecto eliminado exitosamente')
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al eliminar el proyecto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión al eliminar el proyecto')
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
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[200px]">
              Proyecto
            </th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]">
              Código
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[180px]">
              Cliente / Ubicación
            </th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
              Categoría
            </th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[90px]">
              Estado
            </th>
            <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[150px]">
              Especificaciones
            </th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
              Presupuesto
            </th>
            <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[70px]">
              Inicio
            </th>
            <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    {project.imagenPortada ? (
                      <div className="h-8 w-8 rounded-lg overflow-hidden shadow-sm">
                        <Image
                          src={project.imagenPortada.url}
                          alt={project.imagenPortada.alt}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shadow-sm ${
                        project.destacado ? 'bg-gradient-to-br from-yellow-100 to-amber-200' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                      }`}>
                        <Building2 className={`h-4 w-4 ${
                          project.destacado ? 'text-yellow-700' : 'text-gray-600'
                        }`} />
                      </div>
                    )}
                  </div>
                  <div className="ml-2">
                    <div className="flex items-center">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {project.titulo}
                      </div>
                      {project.destacado && (
                        <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">ID: {project.id.slice(0, 6)}</div>
                  </div>
                </div>
              </td>
              <td className="px-2 py-3">
                <div className="text-center">
                  {project.codigoInterno ? (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-md">
                      {project.codigoInterno}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Sin código</span>
                  )}
                </div>
              </td>
              <td className="px-3 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{project.cliente}</div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {project.ubicacion}
                  </div>
                </div>
              </td>
              <td className="px-2 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${getCategoryColor(project.categoria)}`}>
                  <span className="mr-1">{getCategoryIcon(project.categoria)}</span>
                  {project.categoria.replace('_', ' ')}
                </span>
              </td>
              <td className="px-2 py-3">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mr-2 ${
                    project.estado === 'COMPLETADO' ? 'bg-green-500' :
                    project.estado === 'EN_PROGRESO' ? 'bg-blue-500' :
                    project.estado === 'PAUSADO' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(project.estado)}`}>
                    {project.estado.replace('_', ' ')}
                  </span>
                </div>
              </td>
              <td className="px-2 py-3">
                <div className="space-y-1">
                  {project.toneladas && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Scale className="h-3 w-3 mr-1 text-blue-500" />
                      <span className="font-medium">{formatToneladas(project.toneladas)}</span>
                    </div>
                  )}
                  {project.areaTotal && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Ruler className="h-3 w-3 mr-1 text-green-500" />
                      <span className="font-medium">{formatArea(project.areaTotal)}</span>
                    </div>
                  )}
                  {!project.toneladas && !project.areaTotal && (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(project.presupuesto)}
                </div>
              </td>
              <td className="px-2 py-3">
                <div className="text-xs text-gray-500 text-center">
                  {new Date(project.fechaInicio).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })}
                </div>
              </td>
              <td className="px-2 py-3">
                <div className="flex items-center justify-center">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="p-1 text-gray-500 hover:text-blue-600 rounded transition-all"
                    title="Ver"
                  >
                    <Eye className="h-3 w-3" />
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-1 text-gray-500 hover:text-indigo-600 rounded transition-all"
                    title="Editar"
                  >
                    <Edit className="h-3 w-3" />
                  </Link>
                  <button
                    className="p-1 text-gray-500 hover:text-red-600 rounded transition-all"
                    title="Eliminar"
                    onClick={() => handleDelete(project.id, project.titulo)}
                  >
                    <Trash2 className="h-3 w-3" />
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
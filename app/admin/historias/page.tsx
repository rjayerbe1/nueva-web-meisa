'use client'

import { useState, useEffect } from 'react'
import { Plus, BookOpen, Eye, Edit, Trash2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface HistoriaProyecto {
  id: string
  activo: boolean
  proyectoId: string
  resumenCorto: string | null
  tituloAlternativo: string | null
  dificultadTecnica: number | null
  innovacionNivel: number | null
  fechaCreacion: string
  proyecto: {
    titulo: string
    cliente: string
    categoria: string
  }
}

export default function HistoriasAdminPage() {
  const [historias, setHistorias] = useState<HistoriaProyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [proyectosSinHistoria, setProyectosSinHistoria] = useState([])

  useEffect(() => {
    fetchHistorias()
    fetchProyectosSinHistoria()
  }, [])

  const fetchHistorias = async () => {
    try {
      const response = await fetch('/api/admin/historias')
      if (response.ok) {
        const data = await response.json()
        setHistorias(data)
      }
    } catch (error) {
      console.error('Error fetching historias:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProyectosSinHistoria = async () => {
    try {
      const response = await fetch('/api/admin/proyectos/sin-historia')
      if (response.ok) {
        const data = await response.json()
        setProyectosSinHistoria(data)
      }
    } catch (error) {
      console.error('Error fetching proyectos:', error)
    }
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      const response = await fetch(`/api/admin/historias/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !activo })
      })
      
      if (response.ok) {
        fetchHistorias()
      }
    } catch (error) {
      console.error('Error updating historia:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historias de Proyectos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona las historias completas de tus proyectos destacados
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link
            href="/admin/historias/nueva"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Historia
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Historias</p>
              <p className="text-2xl font-semibold text-gray-900">{historias.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Activas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {historias.filter(h => h.activo).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Edit className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Borradores</p>
              <p className="text-2xl font-semibold text-gray-900">
                {historias.filter(h => !h.activo).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Sin Historia</p>
              <p className="text-2xl font-semibold text-gray-900">{proyectosSinHistoria.length}</p>
            </div>
          </div>
          {proyectosSinHistoria.length > 0 && (
            <div className="mt-2">
              <Link
                href="/admin/historias/nueva"
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200 transition-colors"
              >
                Crear Historia
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Proyectos Sin Historia - Acceso Rápido */}
      {proyectosSinHistoria.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Proyectos Listos para Historia</h2>
                <p className="text-sm text-gray-600">Proyectos destacados que podrían beneficiarse de una historia completa</p>
              </div>
              <Link
                href="/admin/historias/nueva"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Historia
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proyectosSinHistoria.slice(0, 6).map((proyecto: any) => (
                <div 
                  key={proyecto.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {proyecto.titulo}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {proyecto.cliente} • {proyecto.categoria.replace(/_/g, ' ')}
                      </p>
                    </div>
                    {proyecto.destacado && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full ml-2">
                        Destacado
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/admin/historias/nueva?proyectoId=${proyecto.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-md text-center transition-colors"
                    >
                      Crear Historia
                    </Link>
                    <Link
                      href={`/proyectos/detalle/${proyecto.slug}`}
                      target="_blank"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-md flex items-center justify-center"
                    >
                      <Eye className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {proyectosSinHistoria.length > 6 && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Y {proyectosSinHistoria.length - 6} proyectos más sin historia
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de Historias - Responsive */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historias Existentes</h2>
        </div>
        
        {/* Vista Desktop - Tabla */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Métricas
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creada
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historias.map((historia) => (
                  <tr key={historia.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {historia.tituloAlternativo || historia.proyecto.titulo}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {historia.proyecto.cliente} • {historia.proyecto.categoria.replace(/_/g, ' ')}
                        </div>
                        {historia.resumenCorto && (
                          <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {historia.resumenCorto}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <button
                        onClick={() => toggleActivo(historia.id, historia.activo)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          historia.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {historia.activo ? 'Activa' : 'Borrador'}
                      </button>
                    </td>
                    <td className="px-3 py-4">
                      <div className="space-y-1">
                        {historia.dificultadTecnica ? (
                          <div className="flex items-center text-xs">
                            <span className="text-gray-500 w-8">Dif:</span>
                            <div className="w-12 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-red-500 h-1.5 rounded-full" 
                                style={{ width: `${(historia.dificultadTecnica / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-1 text-gray-600">{historia.dificultadTecnica}/10</span>
                          </div>
                        ) : null}
                        {historia.innovacionNivel ? (
                          <div className="flex items-center text-xs">
                            <span className="text-gray-500 w-8">Inn:</span>
                            <div className="w-12 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-green-500 h-1.5 rounded-full" 
                                style={{ width: `${(historia.innovacionNivel / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-1 text-gray-600">{historia.innovacionNivel}/10</span>
                          </div>
                        ) : null}
                        {!historia.dificultadTecnica && !historia.innovacionNivel && (
                          <span className="text-gray-400 text-xs">Sin métricas</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-500">
                      {new Date(historia.fechaCreacion).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit',
                        year: '2-digit'
                      })}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/historias/${historia.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/proyectos/${historia.proyectoId}`}
                          className="text-green-600 hover:text-green-900"
                          title="Ver proyecto"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vista Mobile/Tablet - Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {historias.map((historia) => (
            <div key={historia.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {historia.tituloAlternativo || historia.proyecto.titulo}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {historia.proyecto.cliente} • {historia.proyecto.categoria.replace(/_/g, ' ')}
                  </p>
                </div>
                <button
                  onClick={() => toggleActivo(historia.id, historia.activo)}
                  className={`ml-3 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    historia.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {historia.activo ? 'Activa' : 'Borrador'}
                </button>
              </div>

              {historia.resumenCorto && (
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                  {historia.resumenCorto}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-4 text-xs">
                  {historia.dificultadTecnica && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Dificultad:</span>
                      <span className="font-medium">{historia.dificultadTecnica}/10</span>
                    </div>
                  )}
                  {historia.innovacionNivel && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Innovación:</span>
                      <span className="font-medium">{historia.innovacionNivel}/10</span>
                    </div>
                  )}
                  <div className="text-gray-500">
                    {new Date(historia.fechaCreacion).toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: '2-digit'
                    })}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link
                    href={`/admin/historias/${historia.id}`}
                    className="text-blue-600 hover:text-blue-900"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/proyectos/${historia.proyectoId}`}
                    className="text-green-600 hover:text-green-900"
                    title="Ver proyecto"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {historias.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay historias de proyectos
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza creando la primera historia de proyecto
            </p>
            <Link
              href="/admin/historias/nueva"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear Historia
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
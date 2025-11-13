'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Eye,
  Edit,
  Copy,
  Trash2,
  Layout,
  Loader2,
  Search
} from 'lucide-react'

interface PageTemplate {
  id: string
  nombre: string
  descripcion: string | null
  thumbnail: string | null
  categoria: string | null
  usageCount: number
  isPublic: boolean
  createdAt: string
}

interface PageTemplatesTableProps {
  templates: PageTemplate[]
}

const CATEGORIAS = [
  { value: '', label: 'Todas las categorías' },
  { value: 'Portadas', label: 'Portadas' },
  { value: 'Proyectos', label: 'Proyectos' },
  { value: 'Galerías', label: 'Galerías' },
  { value: 'Contenido', label: 'Contenido' }
]

const CATEGORIA_COLORS: Record<string, string> = {
  'Portadas': 'bg-blue-100 text-blue-800',
  'Proyectos': 'bg-green-100 text-green-800',
  'Galerías': 'bg-purple-100 text-purple-800',
  'Contenido': 'bg-gray-100 text-gray-800'
}

export function PageTemplatesTable({ templates: initialTemplates }: PageTemplatesTableProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState(initialTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null)

  // Filtrar plantillas
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (template.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesCategory = !categoryFilter || template.categoria === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDuplicate = async (template: PageTemplate) => {
    try {
      const response = await fetch(`/api/admin/page-templates/${template.id}/duplicate`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Error al duplicar plantilla')
      }

      const duplicatedTemplate = await response.json()

      // Actualizar lista
      setTemplates([duplicatedTemplate, ...templates])

      // Opcional: Redirigir a editar la nueva plantilla
      router.push(`/admin/brochures/page-templates/${duplicatedTemplate.id}`)
    } catch (error) {
      console.error('Error duplicando plantilla:', error)
      alert('No se pudo duplicar la plantilla')
    }
  }

  const handleDelete = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId)

    if (!template) return

    if (template.usageCount > 0) {
      const confirmDelete = confirm(
        `Esta plantilla está siendo usada en ${template.usageCount} página(s). ¿Estás seguro de eliminarla?`
      )
      if (!confirmDelete) return
    } else {
      const confirmDelete = confirm('¿Eliminar esta plantilla?')
      if (!confirmDelete) return
    }

    setDeletingId(templateId)

    try {
      const response = await fetch(`/api/admin/page-templates/${templateId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar plantilla')
      }

      // Actualizar lista
      setTemplates(templates.filter(t => t.id !== templateId))

      alert('Plantilla eliminada exitosamente')
    } catch (error) {
      console.error('Error eliminando plantilla:', error)
      alert('No se pudo eliminar la plantilla')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Búsqueda */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar plantillas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtro por categoría */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {CATEGORIAS.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Grid de plantillas */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron plantillas
          </h3>
          <p className="text-gray-600">
            {searchQuery || categoryFilter
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Crea tu primera plantilla de página'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 relative">
                {template.thumbnail ? (
                  <Image
                    src={template.thumbnail}
                    alt={template.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Layout className="w-16 h-16 text-blue-300" />
                  </div>
                )}

                {/* Badges superpuestos */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {template.isPublic && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded">
                      Público
                    </span>
                  )}
                  {template.usageCount > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">
                      {template.usageCount} uso{template.usageCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                    {template.nombre}
                  </h3>
                  {template.categoria && (
                    <span className={`px-2 py-1 text-xs font-medium rounded ${CATEGORIA_COLORS[template.categoria] || 'bg-gray-100 text-gray-800'}`}>
                      {template.categoria}
                    </span>
                  )}
                </div>

                {template.descripcion && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.descripcion}
                  </p>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title="Vista previa"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>

                  <Link
                    href={`/admin/brochures/page-templates/${template.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Link>

                  <button
                    onClick={() => handleDuplicate(template)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(template.id)}
                    disabled={deletingId === template.id}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    {deletingId === template.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Preview */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {previewTemplate.nombre}
                </h2>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                >
                  ✕
                </button>
              </div>
              {previewTemplate.descripcion && (
                <p className="mt-2 text-gray-600">{previewTemplate.descripcion}</p>
              )}
            </div>

            <div className="p-6">
              {previewTemplate.thumbnail ? (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={previewTemplate.thumbnail}
                    alt={previewTemplate.nombre}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <Layout className="w-24 h-24 text-blue-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save,
  Plus,
  Trash2,
  Eye,
  ArrowLeft,
  GripVertical,
  FileText,
  ChevronDown,
  ChevronRight,
  Loader2,
  Code
} from 'lucide-react'
import Link from 'next/link'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { ComponentRenderer } from '@/components/brochure/ComponentRenderer'

interface Page {
  id: string
  nombre: string
  orden: number
  contenido: any
  componentesData: any
  visible: boolean
}

interface Brochure {
  id: string
  titulo: string
  urlAmigable: string
  pages: Page[]
  template: {
    nombre: string
    pages: any[]
  }
  categoria: {
    nombre: string
  } | null
}

interface Component {
  id: string
  nombre: string
  tipo: string
  descripcion: string | null
  thumbnail: string | null
  htmlTemplate: string
  cssEstilos: string
  propiedadesSchema: any
  valorDefecto: any
  categoria: string | null
}

interface BrochureBuilderProps {
  brochure: Brochure
  components: Component[]
  availableProjects: any[]
}

export function BrochureBuilder({ brochure, components, availableProjects }: BrochureBuilderProps) {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>(brochure.pages)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(
    pages.length > 0 ? pages[0].id : null
  )
  const [saving, setSaving] = useState(false)
  const [showComponentPanel, setShowComponentPanel] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [jsonMode, setJsonMode] = useState(false)

  const selectedPage = pages.find(p => p.id === selectedPageId)

  const handleAddPage = () => {
    const newPage: Page = {
      id: `temp-${Date.now()}`,
      nombre: `Nueva Página ${pages.length + 1}`,
      orden: pages.length,
      contenido: {},
      componentesData: {},
      visible: true
    }
    setPages([...pages, newPage])
    setSelectedPageId(newPage.id)
  }

  const handleDeletePage = (pageId: string) => {
    if (!confirm('¿Eliminar esta página?')) return

    const newPages = pages.filter(p => p.id !== pageId)
    setPages(newPages)

    if (selectedPageId === pageId && newPages.length > 0) {
      setSelectedPageId(newPages[0].id)
    }
  }

  const handleUpdatePage = (pageId: string, updates: Partial<Page>) => {
    setPages(pages.map(p => p.id === pageId ? { ...p, ...updates } : p))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(pages)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update orden
    const updatedPages = items.map((page, index) => ({
      ...page,
      orden: index
    }))

    setPages(updatedPages)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save each page
      for (const page of pages) {
        const isNewPage = page.id.startsWith('temp-')

        if (isNewPage) {
          // Create new page
          await fetch(`/api/admin/brochures/${brochure.id}/pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: page.nombre,
              orden: page.orden,
              contenido: page.contenido,
              componentesData: page.componentesData,
              visible: page.visible
            })
          })
        } else {
          // Update existing page
          await fetch(`/api/admin/brochures/${brochure.id}/pages/${page.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: page.nombre,
              orden: page.orden,
              contenido: page.contenido,
              componentesData: page.componentesData,
              visible: page.visible
            })
          })
        }
      }

      alert('✅ Brochure guardado exitosamente')
      router.refresh()
    } catch (error) {
      console.error('Error saving:', error)
      alert('❌ Error al guardar el brochure')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Pages List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link
              href={`/admin/brochures/${brochure.id}`}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-lg font-semibold text-gray-900 flex-1 ml-3">
              Builder
            </h2>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">{brochure.titulo}</p>
            {brochure.categoria && (
              <p className="text-xs">{brochure.categoria.nombre}</p>
            )}
          </div>
        </div>

        {/* Pages List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Páginas ({pages.length})
            </h3>
            <button
              onClick={handleAddPage}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              title="Agregar página"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pages">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {pages.map((page, index) => (
                    <Draggable key={page.id} draggableId={page.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group flex items-center gap-2 p-3 rounded-lg border transition-colors cursor-pointer ${
                            selectedPageId === page.id
                              ? 'bg-blue-50 border-blue-300'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPageId(page.id)}
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>
                          <FileText className="w-4 h-4 text-gray-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {page.nombre}
                            </p>
                            <p className="text-xs text-gray-500">Orden: {page.orden + 1}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeletePage(page.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setShowComponentPanel(!showComponentPanel)}
            className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
          >
            {showComponentPanel ? 'Ocultar' : 'Mostrar'} Componentes
          </button>
          <Link
            href={`/brochure/${brochure.urlAmigable}`}
            target="_blank"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            Vista Previa
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedPage && (
                <>
                  <input
                    type="text"
                    value={selectedPage.nombre}
                    onChange={(e) => handleUpdatePage(selectedPage.id, { nombre: e.target.value })}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedPage.visible}
                      onChange={(e) => handleUpdatePage(selectedPage.id, { visible: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Visible</span>
                  </label>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setJsonMode(!jsonMode)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                  jsonMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Code className="w-4 h-4" />
                {jsonMode ? 'Modo Visual' : 'Ver JSON'}
              </button>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                  previewMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Ocultar Preview' : 'Mostrar Preview'}
              </button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto p-6">
          {selectedPage ? (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {selectedPage.nombre}
                </h3>

                {/* Content Editor */}
                {jsonMode ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido JSON
                      </label>
                      <textarea
                        value={JSON.stringify(selectedPage.contenido, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value)
                            handleUpdatePage(selectedPage.id, { contenido: parsed })
                          } catch (err) {
                            // Invalid JSON, don't update
                          }
                        }}
                        rows={20}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-900 text-green-400"
                        placeholder='{"type": "COVER_PAGE", "title": "Mi Título", "subtitle": "Subtítulo..."}'
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Edita el contenido en formato JSON. El campo "type" determina el componente a renderizar.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-blue-800 font-medium mb-2">
                      Editor Visual
                    </p>
                    <p className="text-sm text-blue-700">
                      Usa "Ver JSON" para editar el contenido. El modo visual permite ver cómo se renderiza tu contenido en tiempo real.
                    </p>
                    <button
                      onClick={() => setJsonMode(true)}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Code className="w-4 h-4" />
                      Editar Contenido JSON
                    </button>
                  </div>
                )}

                {/* Live Preview Section */}
                {previewMode && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-700">Vista Previa en Tiempo Real</h4>
                      <span className="text-xs text-gray-500">Como se verá en el brochure público</span>
                    </div>
                    <div className="border-4 border-gray-300 rounded-lg overflow-hidden bg-white shadow-xl">
                      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1 text-center text-xs text-gray-400 font-mono">
                          {brochure.urlAmigable} - Página {selectedPage.orden + 1}
                        </div>
                      </div>
                      <div className="p-8 bg-white min-h-[400px]">
                        <ComponentRenderer
                          contenido={selectedPage.contenido}
                          componentesData={selectedPage.componentesData}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay páginas
                </h3>
                <p className="text-gray-600 mb-4">
                  Agrega tu primera página para comenzar
                </p>
                <button
                  onClick={handleAddPage}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Página
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Components Panel (collapsible) */}
      {showComponentPanel && (
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Componentes Disponibles
          </h3>
          <div className="space-y-3">
            {components.map((component) => (
              <div
                key={component.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  {component.thumbnail && (
                    <img
                      src={component.thumbnail}
                      alt={component.nombre}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {component.nombre}
                    </h4>
                    {component.descripcion && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {component.descripcion}
                      </p>
                    )}
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                      {component.tipo}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Save, Loader2, Bookmark, AlertCircle } from 'lucide-react'
import { generateAndUploadThumbnail } from '@/lib/canvasThumbnail'
import { fabric } from 'fabric'

interface SaveAsTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  currentCanvasData: any
  currentCanvas: fabric.Canvas | null
  pageName: string
  canvasConfig?: {
    width: number
    height: number
  }
}

const CATEGORIAS = [
  { value: '', label: 'Sin categoría' },
  { value: 'Portadas', label: 'Portadas' },
  { value: 'Proyectos', label: 'Proyectos' },
  { value: 'Galerías', label: 'Galerías' },
  { value: 'Contenido', label: 'Contenido' }
]

export function SaveAsTemplateModal({
  isOpen,
  onClose,
  currentCanvasData,
  currentCanvas,
  pageName,
  canvasConfig = { width: 1200, height: 800 }
}: SaveAsTemplateModalProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nombre: pageName || 'Nueva Plantilla',
    descripcion: '',
    categoria: '',
    isPublic: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        throw new Error('El nombre de la plantilla es requerido')
      }

      if (!currentCanvasData) {
        throw new Error('No hay datos del canvas para guardar')
      }

      // Generar thumbnail si tenemos el canvas
      let thumbnailUrl: string | null = null

      if (currentCanvas) {
        try {
          console.log('Generando thumbnail desde canvas...')
          thumbnailUrl = await generateAndUploadThumbnail(currentCanvas, true)
          console.log('Thumbnail generado:', thumbnailUrl)
        } catch (thumbnailError) {
          console.warn('Error generando thumbnail, continuando sin él:', thumbnailError)
        }
      }

      // Crear la plantilla
      const response = await fetch('/api/admin/page-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          categoria: formData.categoria || null,
          thumbnail: thumbnailUrl,
          canvasData: currentCanvasData,
          configuracion: canvasConfig,
          isPublic: formData.isPublic
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la plantilla')
      }

      const savedTemplate = await response.json()

      // Mostrar éxito
      alert(`Plantilla "${savedTemplate.nombre}" creada exitosamente`)

      // Cerrar modal
      onClose()

      // Opcional: Redirigir a la página de plantillas o a editar la nueva plantilla
      // router.push('/admin/brochures/page-templates')
      // router.push(`/admin/brochures/page-templates/${savedTemplate.id}`)

    } catch (err: any) {
      console.error('Error saving template:', err)
      setError(err.message || 'Error al guardar la plantilla')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) {
      setFormData({
        nombre: pageName || 'Nueva Plantilla',
        descripcion: '',
        categoria: '',
        isPublic: false
      })
      setError(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            Guardar como Plantilla
          </h2>
          <button
            onClick={handleClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="template-nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Plantilla *
              </label>
              <input
                type="text"
                id="template-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Portada Estándar"
                required
                disabled={saving}
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="template-descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="template-descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe brevemente esta plantilla..."
                disabled={saving}
              />
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="template-categoria" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                id="template-categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* IsPublic */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={saving}
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Pública</span>
                  <p className="text-sm text-gray-500">Disponible para todos los usuarios</p>
                </div>
              </label>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ℹ️ El thumbnail se generará automáticamente desde el canvas actual
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Plantilla
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

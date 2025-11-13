'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, Loader2, ArrowLeft, Layout, AlertCircle } from 'lucide-react'
import { FabricCanvasEditor } from '@/components/brochure/FabricCanvasEditor'
import { generateAndUploadThumbnail } from '@/lib/canvasThumbnail'
import { fabric } from 'fabric'

interface PageTemplateFormProps {
  template?: {
    id: string
    nombre: string
    descripcion: string | null
    thumbnail: string | null
    categoria: string | null
    canvasData: any
    configuracion: any
    isPublic: boolean
  }
}

const CATEGORIAS = [
  { value: '', label: 'Sin categoría' },
  { value: 'Portadas', label: 'Portadas' },
  { value: 'Proyectos', label: 'Proyectos' },
  { value: 'Galerías', label: 'Galerías' },
  { value: 'Contenido', label: 'Contenido' }
]

export function PageTemplateForm({ template }: PageTemplateFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canvasInstance, setCanvasInstance] = useState<fabric.Canvas | null>(null)

  const [formData, setFormData] = useState({
    nombre: template?.nombre || '',
    descripcion: template?.descripcion || '',
    categoria: template?.categoria || '',
    isPublic: template?.isPublic ?? false,
    canvasWidth: template?.configuracion?.width || 1200,
    canvasHeight: template?.configuracion?.height || 800
  })

  const [canvasData, setCanvasData] = useState<any>(template?.canvasData || null)

  const handleCanvasChange = useCallback((newCanvasData: any, canvas: fabric.Canvas) => {
    setCanvasData(newCanvasData)
    setCanvasInstance(canvas)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        throw new Error('El nombre de la plantilla es requerido')
      }

      // Generar thumbnail automáticamente si hay canvas disponible
      let thumbnailUrl: string | null = template?.thumbnail || null

      if (canvasInstance) {
        try {
          console.log('Generando thumbnail automático desde canvas...')
          thumbnailUrl = await generateAndUploadThumbnail(canvasInstance, true)
          console.log('Thumbnail generado:', thumbnailUrl)
        } catch (thumbnailError) {
          console.warn('Error generando thumbnail, usando existente:', thumbnailError)
          // Mantener el thumbnail existente si falla la generación
        }
      } else {
        console.warn('Canvas no disponible aún, usando thumbnail existente o dejando vacío')
        // Si no hay canvas instance, mantener el thumbnail existente o null
        // El thumbnail se puede generar en la próxima edición
      }

      const url = template
        ? `/api/admin/page-templates/${template.id}`
        : '/api/admin/page-templates'

      const method = template ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          categoria: formData.categoria || null,
          thumbnail: thumbnailUrl,
          canvasData: canvasData,
          configuracion: {
            width: formData.canvasWidth,
            height: formData.canvasHeight
          },
          isPublic: formData.isPublic
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar la plantilla')
      }

      const savedTemplate = await response.json()

      // Redirigir a la página de listado
      router.push('/admin/brochures/page-templates')
      router.refresh()

    } catch (err: any) {
      console.error('Error saving template:', err)
      setError(err.message || 'Error al guardar la plantilla')
    } finally {
      setSaving(false)
    }
  }

  const handleCanvasResize = () => {
    if (canvasInstance) {
      canvasInstance.setDimensions({
        width: formData.canvasWidth,
        height: formData.canvasHeight
      })
      canvasInstance.renderAll()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error al guardar</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Información Básica */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Información de la Plantilla
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="md:col-span-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Plantilla *
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Portada Estándar MEISA"
              required
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe brevemente esta plantilla..."
            />
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              id="categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Categoriza la plantilla para facilitar la búsqueda
            </p>
          </div>

          {/* IsPublic */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer pt-8">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Pública</span>
                <p className="text-sm text-gray-500">Disponible para todos los usuarios</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Configuración del Canvas */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Dimensiones del Canvas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="canvasWidth" className="block text-sm font-medium text-gray-700 mb-2">
              Ancho (px)
            </label>
            <input
              type="number"
              id="canvasWidth"
              value={formData.canvasWidth}
              onChange={(e) => setFormData({ ...formData, canvasWidth: parseInt(e.target.value) || 1200 })}
              min="400"
              max="3000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="canvasHeight" className="block text-sm font-medium text-gray-700 mb-2">
              Alto (px)
            </label>
            <input
              type="number"
              id="canvasHeight"
              value={formData.canvasHeight}
              onChange={(e) => setFormData({ ...formData, canvasHeight: parseInt(e.target.value) || 800 })}
              min="400"
              max="3000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleCanvasResize}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Aplicar Dimensiones
            </button>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          💡 Tip: Recomendamos 1200×800 para layouts horizontales y 800×1200 para verticales
        </p>
      </div>

      {/* Editor Visual */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Editor Visual
        </h2>

        <div className="bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
          <FabricCanvasEditor
            initialData={template?.canvasData}
            onSave={(canvasData, canvasInstance) => {
              handleCanvasChange(canvasData, canvasInstance as any)
            }}
            width={formData.canvasWidth}
            height={formData.canvasHeight}
            className="min-h-[600px]"
          />
        </div>

        <p className="mt-4 text-sm text-gray-500">
          ℹ️ Usa las herramientas del editor para diseñar tu plantilla. El thumbnail se generará automáticamente al guardar.
        </p>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Link
          href="/admin/brochures/page-templates"
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {template ? 'Actualizar Plantilla' : 'Crear Plantilla'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

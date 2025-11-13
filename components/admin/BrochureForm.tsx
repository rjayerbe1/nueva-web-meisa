'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FileText, Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Template {
  id: string
  nombre: string
  descripcion: string | null
  thumbnail: string | null
  tipoCategoria: string | null
  isDefault: boolean
}

interface Category {
  id: string
  nombre: string
  slug: string
  key: string
  brochure?: {
    id: string
    titulo: string
  } | null
}

interface BrochureFormProps {
  templates?: Template[] // Opcional - ya no se usa
  categories: Category[]
  brochure?: {
    id: string
    titulo: string
    descripcion: string | null
    templateId: string
    categoriaId: string | null
    urlAmigable: string
    activo: boolean
    publicado: boolean
    thumbnail: string | null
  }
}

export function BrochureForm({ templates, categories, brochure }: BrochureFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    titulo: brochure?.titulo || '',
    descripcion: brochure?.descripcion || '',
    templateId: brochure?.templateId || 'default-meisa-template-001', // Siempre usar template por defecto
    categoriaId: brochure?.categoriaId || '',
    urlAmigable: brochure?.urlAmigable || '',
    activo: brochure?.activo ?? true,
    publicado: brochure?.publicado ?? false,
    thumbnail: brochure?.thumbnail || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validaciones
      if (!formData.titulo.trim()) {
        throw new Error('El título es requerido')
      }
      if (!formData.urlAmigable.trim()) {
        throw new Error('La URL amigable es requerida')
      }

      const url = brochure
        ? `/api/admin/brochures/${brochure.id}`
        : '/api/admin/brochures'

      const method = brochure ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          categoriaId: formData.categoriaId || null
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar el brochure')
      }

      const savedBrochure = await response.json()

      // Redirigir a la página de edición o al listado
      router.push(`/admin/brochures/${savedBrochure.id}`)
      router.refresh()

    } catch (err: any) {
      console.error('Error saving brochure:', err)
      setError(err.message || 'Error al guardar el brochure')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    setFormData({ ...formData, urlAmigable: slug })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Información Básica */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>

        <div className="space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título del Brochure *
            </label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              onBlur={generateSlug}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Brochure de Centros Comerciales"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción breve del brochure..."
            />
          </div>

          {/* URL Amigable */}
          <div>
            <label htmlFor="urlAmigable" className="block text-sm font-medium text-gray-700 mb-2">
              URL Amigable *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">/brochure/</span>
              <input
                type="text"
                id="urlAmigable"
                value={formData.urlAmigable}
                onChange={(e) => setFormData({ ...formData, urlAmigable: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="brochure-centros-comerciales"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Se generará automáticamente del título. Solo letras minúsculas, números y guiones.
            </p>
          </div>
        </div>
      </div>

      {/* Template y Categoría */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Categoría</h2>

        <div className="space-y-6">
          {/* Categoría */}
          <div>
            <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría (opcional)
            </label>
            <select
              id="categoriaId"
              value={formData.categoriaId}
              onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sin categoría asignada</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Asigna este brochure a una categoría para mostrarlo en la página de esa categoría.
            </p>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail (URL)
            </label>
            <input
              type="url"
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://..."
            />
            {formData.thumbnail && (
              <div className="mt-2">
                <Image
                  src={formData.thumbnail}
                  alt="Preview"
                  width={200}
                  height={150}
                  className="rounded border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estado y Publicación */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Estado</h2>

        <div className="space-y-4">
          {/* Activo */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Activo</span>
              <p className="text-sm text-gray-500">El brochure estará disponible para edición y visualización</p>
            </div>
          </label>

          {/* Publicado */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.publicado}
              onChange={(e) => setFormData({ ...formData, publicado: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Publicado</span>
              <p className="text-sm text-gray-500">El brochure será visible públicamente</p>
            </div>
          </label>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Link
          href="/admin/brochures"
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {brochure ? 'Actualizar Brochure' : 'Crear Brochure'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

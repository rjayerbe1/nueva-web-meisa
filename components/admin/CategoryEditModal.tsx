"use client"

import { useState, useEffect } from "react"
import { X, Upload, Palette, Eye } from "lucide-react"
import { CategoriaEnum } from "@prisma/client"
import { 
  getAllAvailableIcons, 
  getAllCategoryCovers, 
  parseIconValue,
  getRecommendedIcon,
  getRecommendedCover
} from "@/lib/category-assets"
import ImageCropModal from "./ImageCropModal"

// Iconos disponibles de Lucide
import { 
  Building, Factory, Camera, Layers, Home, 
  Zap, MoreHorizontal, Globe, Wrench
} from "lucide-react"

const LUCIDE_COMPONENTS = {
  Building, Factory, Camera, Layers, Home, 
  Zap, MoreHorizontal, Globe, Wrench
}

// Colores predefinidos
const PRESET_COLORS = [
  { color: '#3B82F6', name: 'Azul' },
  { color: '#10B981', name: 'Verde' },
  { color: '#F59E0B', name: 'Amarillo' },
  { color: '#EF4444', name: 'Rojo' },
  { color: '#8B5CF6', name: 'Púrpura' },
  { color: '#F97316', name: 'Naranja' },
  { color: '#06B6D4', name: 'Cian' },
  { color: '#84CC16', name: 'Lima' },
  { color: '#EC4899', name: 'Rosa' },
  { color: '#6B7280', name: 'Gris' }
]

// Categorías disponibles
const CATEGORY_OPTIONS = [
  { key: 'CENTROS_COMERCIALES', name: 'Centros Comerciales' },
  { key: 'EDIFICIOS', name: 'Edificios' },
  { key: 'INDUSTRIA', name: 'Industria' },
  { key: 'PUENTES_VEHICULARES', name: 'Puentes Vehiculares' },
  { key: 'PUENTES_PEATONALES', name: 'Puentes Peatonales' },
  { key: 'ESCENARIOS_DEPORTIVOS', name: 'Escenarios Deportivos' },
  { key: 'CUBIERTAS_Y_FACHADAS', name: 'Cubiertas y Fachadas' },
  { key: 'ESTRUCTURAS_MODULARES', name: 'Estructuras Modulares' },
  { key: 'OIL_AND_GAS', name: 'Oil & Gas' },
  { key: 'OTRO', name: 'Otro' }
]

interface Categoria {
  id: string
  key: string
  nombre: string
  descripcion: string | null
  slug: string
  imagenCover: string | null
  icono: string | null
  color: string | null
  colorSecundario: string | null
  metaTitle: string | null
  metaDescription: string | null
  orden: number
  visible: boolean
  destacada: boolean
}

interface CategoryEditModalProps {
  categoria: Categoria | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function CategoryEditModal({ 
  categoria, 
  isOpen, 
  onClose, 
  onSave 
}: CategoryEditModalProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'visual' | 'seo'>('basic')
  const [activeIconTab, setActiveIconTab] = useState<'specialized' | 'generic'>('specialized')
  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    key: categoria?.key || 'CENTROS_COMERCIALES',
    nombre: categoria?.nombre || '',
    descripcion: categoria?.descripcion || '',
    slug: categoria?.slug || '',
    imagenCover: categoria?.imagenCover || '',
    icono: categoria?.icono || 'Building',
    color: categoria?.color || '#3B82F6',
    colorSecundario: categoria?.colorSecundario || '',
    metaTitle: categoria?.metaTitle || '',
    metaDescription: categoria?.metaDescription || '',
    orden: categoria?.orden || 0,
    visible: categoria?.visible !== undefined ? categoria.visible : true,
    destacada: categoria?.destacada !== undefined ? categoria.destacada : false,
  })

  useEffect(() => {
    if (categoria) {
      setFormData({
        key: categoria.key,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        slug: categoria.slug,
        imagenCover: categoria.imagenCover || '',
        icono: categoria.icono || 'Building',
        color: categoria.color || '#3B82F6',
        colorSecundario: categoria.colorSecundario || '',
        metaTitle: categoria.metaTitle || '',
        metaDescription: categoria.metaDescription || '',
        orden: categoria.orden,
        visible: categoria.visible,
        destacada: categoria.destacada,
      })
    }
  }, [categoria])

  // Auto-generar slug cuando cambia el nombre
  useEffect(() => {
    if (formData.nombre && !categoria) {
      const slug = formData.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.nombre, categoria])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    setSelectedImageFile(file)
    setShowCropModal(true)
  }

  const handleCropComplete = async (croppedImageUrl: string) => {
    setUploading(true)
    try {
      // Convertir la URL del blob a archivo
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })

      const formData = new FormData()
      formData.append('file', file)
      
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) {
        throw new Error('Error al subir imagen')
      }
      
      const { url } = await uploadResponse.json()
      setFormData(prev => ({ ...prev, imagenCover: url }))
      
      // Limpiar el blob URL
      URL.revokeObjectURL(croppedImageUrl)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
      setSelectedImageFile(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = categoria 
        ? `/api/admin/categories/${categoria.id}`
        : '/api/admin/categories'
      
      const method = categoria ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSave()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al guardar categoría')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar categoría')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Parsear el icono seleccionado
  const iconData = parseIconValue(formData.icono)
  const IconComponent = iconData?.type === 'lucide' && iconData.key in LUCIDE_COMPONENTS 
    ? LUCIDE_COMPONENTS[iconData.key as keyof typeof LUCIDE_COMPONENTS] 
    : Building

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'basic', name: 'Información Básica' },
              { id: 'visual', name: 'Aspecto Visual' },
              { id: 'seo', name: 'SEO y Metadatos' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 max-h-[calc(95vh-200px)]">
            {/* Tab: Información Básica */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Clave de categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Categoría *
                  </label>
                  <select
                    value={formData.key}
                    onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                    disabled={!!categoria} // No permitir cambiar la clave si es edición
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
                    required
                  >
                    {CATEGORY_OPTIONS.map(option => (
                      <option key={option.key} value={option.key}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Categoría *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ej: Centros Comerciales"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Descripción de la categoría..."
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="centros-comerciales"
                    required
                  />
                </div>

                {/* Configuración */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orden
                    </label>
                    <input
                      type="number"
                      value={formData.orden}
                      onChange={(e) => setFormData(prev => ({ ...prev, orden: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.visible}
                        onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Visible en frontend</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.destacada}
                        onChange={(e) => setFormData(prev => ({ ...prev, destacada: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Categoría destacada</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Aspecto Visual */}
            {activeTab === 'visual' && (
              <div className="space-y-4">
                {/* Imagen de Cover */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen de Portada
                  </label>
                  
                  <div className="flex justify-center">
                    {formData.imagenCover ? (
                      <div className="space-y-3">
                        <img
                          src={formData.imagenCover}
                          alt="Cover preview"
                          className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <div className="flex space-x-2 justify-center">
                          <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            {uploading ? 'Subiendo...' : 'Cambiar Imagen'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="sr-only"
                              disabled={uploading}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, imagenCover: '' }))}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-sm text-gray-600 font-medium">
                          {uploading ? 'Subiendo...' : 'Subir Imagen'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Se recortará automáticamente
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Selección de Icono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icono
                  </label>
                  
                  <div className="space-y-3">
                    {/* Tabs compactos */}
                    <div className="flex space-x-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveIconTab('specialized')}
                        className={`px-3 py-2 rounded transition-colors ${
                          activeIconTab === 'specialized'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        🎯 Iconos MEISA
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveIconTab('generic')}
                        className={`px-3 py-2 rounded transition-colors ${
                          activeIconTab === 'generic'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        🔷 Iconos SVG
                      </button>
                    </div>

                    {/* Iconos MEISA */}
                    {activeIconTab === 'specialized' && (
                      <div className="grid grid-cols-6 gap-2">
                        {Object.entries(getAllAvailableIcons().images).map(([key, { name, path }]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, icono: `image:${key}` }))}
                            className={`p-2 rounded border transition-all ${
                              formData.icono === `image:${key}`
                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            title={name}
                          >
                            <div className="bg-gray-800 rounded aspect-square p-1 mb-1">
                              <img 
                                src={path} 
                                alt={name}
                                className="w-full h-full object-contain filter brightness-0 invert"
                              />
                            </div>
                            <div className="text-xs text-gray-600 text-center truncate">
                              {name.split(' ')[0]}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Iconos SVG */}
                    {activeIconTab === 'generic' && (
                      <div className="grid grid-cols-6 gap-2">
                        {Object.entries(getAllAvailableIcons().lucide).map(([key, { name }]) => {
                          const Icon = LUCIDE_COMPONENTS[key as keyof typeof LUCIDE_COMPONENTS]
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, icono: key }))}
                              className={`p-2 rounded border transition-all ${
                                formData.icono === key
                                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-500'
                              }`}
                              title={name}
                            >
                              <div className="aspect-square flex items-center justify-center mb-1">
                                <Icon className="h-6 w-6" />
                              </div>
                              <div className="text-xs text-gray-600 text-center truncate">
                                {name}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Colores */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Principal
                    </label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-5 gap-1">
                        {PRESET_COLORS.map(({ color, name }) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                            className={`w-6 h-6 rounded border-2 transition-all ${
                              formData.color === color
                                ? 'border-gray-800 scale-110'
                                : 'border-gray-300 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            title={name}
                          />
                        ))}
                      </div>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full h-6 rounded border border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Secundario
                    </label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-5 gap-1">
                        {PRESET_COLORS.map(({ color, name }) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, colorSecundario: color }))}
                            className={`w-6 h-6 rounded border-2 transition-all ${
                              formData.colorSecundario === color
                                ? 'border-gray-800 scale-110'
                                : 'border-gray-300 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            title={name}
                          />
                        ))}
                      </div>
                      <input
                        type="color"
                        value={formData.colorSecundario}
                        onChange={(e) => setFormData(prev => ({ ...prev, colorSecundario: e.target.value }))}
                        className="w-full h-6 rounded border border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vista Previa
                  </label>
                  <div className="p-3 border border-gray-200 rounded bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="p-2 rounded"
                        style={{ 
                          backgroundColor: formData.color ? `${formData.color}20` : '#F3F4F6',
                          color: formData.color || '#6B7280'
                        }}
                      >
                        {iconData?.type === 'image' ? (
                          <div className="bg-gray-700 rounded p-1">
                            <img 
                              src={iconData.data?.path} 
                              alt="Icon preview"
                              className="h-4 w-4 object-contain filter brightness-0 invert"
                            />
                          </div>
                        ) : (
                          <IconComponent className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {formData.nombre || 'Nombre de Categoría'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formData.descripcion?.substring(0, 50) || 'Descripción...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: SEO */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Título
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Título SEO para esta categoría..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.metaTitle.length}/60 caracteres recomendados
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Descripción
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Descripción SEO para esta categoría..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.metaDescription.length}/160 caracteres recomendados
                  </p>
                </div>

                {/* Preview SEO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Vista Previa en Buscadores
                  </label>
                  <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {formData.metaTitle || formData.nombre || 'Título de la categoría'}
                    </div>
                    <div className="text-green-700 text-sm">
                      https://meisa.com.co/proyectos/{formData.slug}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {formData.metaDescription || formData.descripcion || 'Descripción de la categoría para mostrar en resultados de búsqueda.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer con botones */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (categoria ? 'Actualizar' : 'Crear')} Categoría
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Crop */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false)
          setSelectedImageFile(null)
        }}
        onCropComplete={handleCropComplete}
        imageFile={selectedImageFile}
      />
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { X, Upload, Palette, Eye, Star, EyeOff } from "lucide-react"
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
  imagenBanner: string | null
  icono: string | null
  color: string | null
  colorSecundario: string | null
  overlayColor: string | null
  overlayOpacity: number | null
  metaTitle: string | null
  metaDescription: string | null
  orden: number
  visible: boolean
  destacada: boolean
  // Nuevos campos para contenido ampliado
  descripcionAmpliada: string | null
  beneficios: any | null
  procesoTrabajo: any | null
  estadisticas: any | null
  casosExitoIds: any | null
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
  const [activeTab, setActiveTab] = useState<'basic' | 'visual' | 'seo' | 'content'>('basic')
  const [activeIconTab, setActiveIconTab] = useState<'specialized' | 'generic'>('specialized')
  const [showCropModal, setShowCropModal] = useState(false)
  const [showBannerCropModal, setShowBannerCropModal] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null)
  const [availableProjects, setAvailableProjects] = useState<{id: string, titulo: string}[]>([])
  
  // Form data
  const [formData, setFormData] = useState({
    key: categoria?.key || 'CENTROS_COMERCIALES',
    nombre: categoria?.nombre || '',
    descripcion: categoria?.descripcion || '',
    slug: categoria?.slug || '',
    imagenCover: categoria?.imagenCover || '',
    imagenBanner: categoria?.imagenBanner || '',
    icono: categoria?.icono || 'Building',
    color: categoria?.color || '#3B82F6',
    colorSecundario: categoria?.colorSecundario || '',
    overlayColor: categoria?.overlayColor || '#000000',
    overlayOpacity: categoria?.overlayOpacity || 0,
    metaTitle: categoria?.metaTitle || '',
    metaDescription: categoria?.metaDescription || '',
    orden: categoria?.orden || 0,
    visible: categoria?.visible !== undefined ? categoria.visible : true,
    destacada: categoria?.destacada !== undefined ? categoria.destacada : false,
    // Nuevos campos para contenido ampliado
    descripcionAmpliada: categoria?.descripcionAmpliada || '',
    beneficios: categoria?.beneficios || [],
    procesoTrabajo: categoria?.procesoTrabajo || [],
    estadisticas: categoria?.estadisticas || {},
    casosExitoIds: categoria?.casosExitoIds || []
  })

  useEffect(() => {
    if (categoria) {
      setFormData({
        key: categoria.key,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        slug: categoria.slug,
        imagenCover: categoria.imagenCover || '',
        imagenBanner: categoria.imagenBanner || '',
        icono: categoria.icono || 'Building',
        color: categoria.color || '#3B82F6',
        colorSecundario: categoria.colorSecundario || '',
        overlayColor: categoria.overlayColor || '#000000',
        overlayOpacity: categoria.overlayOpacity || 0,
        metaTitle: categoria.metaTitle || '',
        metaDescription: categoria.metaDescription || '',
        orden: categoria.orden,
        visible: categoria.visible,
        destacada: categoria.destacada,
        // Nuevos campos para contenido ampliado
        descripcionAmpliada: categoria.descripcionAmpliada || '',
        beneficios: categoria.beneficios || [],
        procesoTrabajo: categoria.procesoTrabajo || [],
        estadisticas: categoria.estadisticas || {},
        casosExitoIds: categoria.casosExitoIds || []
      })
    }
  }, [categoria])

  // Cargar proyectos disponibles para casos de éxito
  useEffect(() => {
    const fetchProjects = async () => {
      if (categoria?.key) {
        try {
          const response = await fetch(`/api/projects/by-category/${categoria.key}`)
          if (response.ok) {
            const projects = await response.json()
            setAvailableProjects(projects.map((p: any) => ({ id: p.id, titulo: p.titulo })))
          }
        } catch (error) {
          console.error('Error fetching projects:', error)
        }
      }
    }
    
    if (isOpen && categoria) {
      fetchProjects()
    }
  }, [categoria, isOpen])

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

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    setSelectedBannerFile(file)
    setShowBannerCropModal(true)
  }

  const handleBannerCropComplete = async (croppedImageUrl: string) => {
    setUploading(true)
    try {
      // Convertir la URL del blob a archivo
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'cropped-banner.jpg', { type: 'image/jpeg' })

      const formData = new FormData()
      formData.append('file', file)
      
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json()
        setFormData(prev => ({ ...prev, imagenBanner: uploadResult.url }))
        setShowBannerCropModal(false)
      } else {
        alert('Error al subir el banner')
      }
      
      // Limpiar el blob URL
      URL.revokeObjectURL(croppedImageUrl)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al subir el banner')
    } finally {
      setUploading(false)
      setSelectedBannerFile(null)
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
      
      // Limpiar datos antes de enviar
      const cleanFormData = {
        key: formData.key,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        slug: formData.slug,
        imagenCover: formData.imagenCover,
        imagenBanner: formData.imagenBanner,
        icono: formData.icono,
        color: formData.color,
        colorSecundario: formData.colorSecundario,
        overlayColor: formData.overlayColor,
        overlayOpacity: formData.overlayOpacity,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        orden: formData.orden,
        visible: formData.visible,
        destacada: formData.destacada,
        descripcionAmpliada: formData.descripcionAmpliada,
        beneficios: formData.beneficios,
        procesoTrabajo: formData.procesoTrabajo,
        estadisticas: formData.estadisticas,
        casosExitoIds: formData.casosExitoIds
      }
      
      console.log('Sending clean form data:', cleanFormData) // Debug log
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanFormData),
      })

      if (response.ok) {
        onSave()
      } else {
        console.error('Response status:', response.status)
        const responseText = await response.text()
        console.error('Response text:', responseText)
        
        try {
          const error = JSON.parse(responseText)
          alert(`Error al guardar categoría: ${error.error}\n${error.details ? 'Detalles: ' + error.details : ''}`)
        } catch {
          alert(`Error al guardar categoría (${response.status}): ${responseText}`)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`Error de conexión al guardar categoría: ${error.message}`)
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

  // Función para renderizar el icono en el preview
  const renderIconPreview = (size: string = "h-16 w-16") => {
    if (iconData?.type === 'svg') {
      return (
        <img 
          src={iconData.data?.path} 
          alt="Icon preview"
          className={`${size} object-contain`}
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      )
    }
    
    if (iconData?.type === 'image') {
      return (
        <img 
          src={iconData.data?.path} 
          alt="Icon preview"
          className={`${size} object-contain filter brightness-0 invert`}
        />
      )
    }
    
    return <IconComponent className={size} />
  }

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
              { id: 'content', name: 'Contenido de Página' },
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
                {/* Imagen de Cover y Preview - Más grande */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Imagen de Portada y Vista Previa
                  </label>
                  
                  <div className="grid grid-cols-2 gap-8">
                    {/* Upload de imagen */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Subir Imagen</h4>
                      <div className="flex justify-center">
                        {formData.imagenCover ? (
                          <div className="space-y-3">
                            <img
                              src={formData.imagenCover}
                              alt="Cover preview"
                              className="w-80 h-60 object-cover rounded-lg border border-gray-300"
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
                          <label className="flex flex-col items-center justify-center w-80 h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="text-base text-gray-600 font-medium">
                              {uploading ? 'Subiendo...' : 'Subir Imagen'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2 text-center px-4">
                              Se recortará automáticamente a formato cuadrado
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

                    {/* Preview completo MÁS GRANDE */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Vista Previa Final</h4>
                      <div className="flex justify-center mb-4">
                        <div className="w-80 h-60 relative rounded-xl overflow-hidden shadow-xl border border-gray-200 group">
                          {/* Imagen de fondo o placeholder */}
                        {formData.imagenCover ? (
                          <div className="relative w-full h-full">
                            <img
                              src={formData.imagenCover}
                              alt="Preview completo"
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Overlay personalizable */}
                            {formData.overlayOpacity > 0 && (
                              <div 
                                className="absolute inset-0"
                                style={{ 
                                  backgroundColor: formData.overlayColor,
                                  opacity: formData.overlayOpacity
                                }}
                              />
                            )}
                            
                            {/* Overlay oscuro para el texto */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            
                            {/* Ícono centrado MÁS GRANDE */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div 
                                className="text-5xl opacity-80"
                                style={{ color: formData.color || '#3b82f6' }}
                              >
                                {renderIconPreview("h-16 w-16")}
                              </div>
                            </div>

                            {/* Información en esquina superior derecha */}
                            <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
                              {/* Info técnica */}
                              <div className="text-xs text-white/80 bg-black/40 backdrop-blur-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div>Slug: {formData.slug || 'slug'}</div>
                              </div>
                              {/* Badges */}
                              <div className="flex flex-col space-y-1">
                                {formData.destacada && (
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                  </div>
                                )}
                                {!formData.visible && (
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                                    <EyeOff className="h-3 w-3 text-gray-600" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Texto en la parte inferior */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                              <h3 className="text-sm font-bold mb-1 drop-shadow-lg">
                                {formData.nombre || 'Nombre Categoría'}
                              </h3>
                              <p className="text-xs text-white/90 mb-2 drop-shadow">
                                X proyecto(s)
                              </p>
                              {formData.descripcion && (
                                <p className="text-xs text-white/80 line-clamp-2 drop-shadow">
                                  {formData.descripcion}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            {/* Ícono centrado en placeholder */}
                            <div 
                              className="text-5xl"
                              style={{ color: formData.color || '#3b82f6' }}
                            >
                              {renderIconPreview("h-16 w-16")}
                            </div>

                            {/* Badges en placeholder */}
                            <div className="absolute top-3 right-3 flex flex-col space-y-1">
                              {formData.destacada && (
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                </div>
                              )}
                              {!formData.visible && (
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                                  <EyeOff className="h-3 w-3 text-gray-600" />
                                </div>
                              )}
                            </div>

                            {/* Texto en placeholder */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                              <h3 className="text-sm font-bold mb-1">
                                {formData.nombre || 'Nombre Categoría'}
                              </h3>
                              <p className="text-xs text-white/90 mb-2">
                                X proyecto(s)
                              </p>
                              {formData.descripcion && (
                                <p className="text-xs text-white/80 line-clamp-2">
                                  {formData.descripcion}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                      
                      {/* Controles del overlay justo debajo del preview */}
                      <div className="space-y-3">
                        {/* Color del overlay */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Color del Overlay</label>
                          <input
                            type="color"
                            value={formData.overlayColor}
                            onChange={(e) => setFormData(prev => ({ ...prev, overlayColor: e.target.value }))}
                            className="w-full h-6 rounded border border-gray-300"
                          />
                        </div>
                        
                        {/* Opacidad del overlay */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Opacidad: {Math.round(formData.overlayOpacity * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={formData.overlayOpacity}
                            onChange={(e) => setFormData(prev => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Imagen de Banner para Hero */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Imagen de Banner (Hero de la página de categoría)
                  </label>
                  
                  <div className="grid grid-cols-2 gap-8">
                    {/* Upload de banner */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Subir Banner</h4>
                      <div className="flex justify-center">
                        {formData.imagenBanner ? (
                          <div className="space-y-3">
                            <img
                              src={formData.imagenBanner}
                              alt="Banner preview"
                              className="w-80 h-48 object-cover rounded-lg border border-gray-300"
                            />
                            <div className="flex space-x-2 justify-center">
                              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                {uploading ? 'Subiendo...' : 'Cambiar Banner'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleBannerUpload}
                                  className="sr-only"
                                  disabled={uploading}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, imagenBanner: '' }))}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-80 h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="text-base text-gray-600 font-medium">
                              {uploading ? 'Subiendo...' : 'Subir Banner'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2 text-center px-4">
                              Proporción 6:1 (muy horizontal) - Se ajustará al recortar
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBannerUpload}
                              className="sr-only"
                              disabled={uploading}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Preview del banner - Formato real del hero */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Vista Previa Hero Real</h4>
                      <div className="flex justify-center">
                        <div className="w-96 h-16 relative rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-gray-900">
                          {formData.imagenBanner ? (
                            <img
                              src={formData.imagenBanner}
                              alt="Banner preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                              <div className="text-center text-gray-400">
                                <div className="w-8 h-8 mx-auto mb-1 opacity-60" style={{ color: formData.color || '#3b82f6' }}>
                                  {renderIconPreview("w-8 h-8")}
                                </div>
                                <p className="text-xs">Sin banner - se usará fondo oscuro</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Overlay personalizable si está configurado */}
                          {formData.overlayOpacity > 0 && (
                            <div 
                              className="absolute inset-0"
                              style={{ 
                                backgroundColor: formData.overlayColor,
                                opacity: formData.overlayOpacity
                              }}
                            />
                          )}
                          
                          {/* Gradient overlay base para legibilidad */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
                          
                          {/* Contenido del hero exactamente como aparece en la página real */}
                          <div className="absolute inset-0 flex items-center px-3">
                            <div className="text-white flex items-center gap-3 w-full">
                              {/* Ícono de la categoría - más pequeño */}
                              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ color: formData.color || '#3b82f6' }}>
                                {renderIconPreview("w-8 h-8")}
                              </div>
                              
                              <div className="flex-1">
                                {/* Breadcrumb simulado - más compacto */}
                                <nav className="mb-1">
                                  <ol className="flex items-center gap-1 text-[10px] opacity-80">
                                    <li>Inicio</li>
                                    <li>/</li>
                                    <li>Proyectos</li>
                                    <li>/</li>
                                    <li className="text-white/80">{formData.nombre || 'Categoría'}</li>
                                  </ol>
                                </nav>
                                
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h1 className="text-sm font-bold mb-1">
                                      {formData.nombre || 'Nombre Categoría'}
                                    </h1>
                                    <div className="flex items-center gap-3 text-[10px] text-white/80">
                                      <span>X proyectos</span>
                                      <span className="truncate max-w-[120px]">
                                        {formData.descripcion ? `${formData.descripcion.substring(0, 30)}...` : 'Descripción'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Proporción 6:1 recomendada • Hero height: 320px (h-80) • Ancho completo responsivo
                      </p>
                    </div>
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

            {/* Tab: Contenido de Página */}
            {activeTab === 'content' && (
              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Contenido Ampliado</h3>
                  <p className="text-sm text-blue-700">
                    Configure el contenido adicional que aparecerá en la página dedicada de esta categoría.
                  </p>
                </div>

                {/* Descripción Ampliada */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Ampliada
                  </label>
                  <textarea
                    value={formData.descripcionAmpliada}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcionAmpliada: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Descripción detallada de esta especialidad que aparecerá en la sección 'Sobre esta especialidad'"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Esta descripción aparecerá en la sección principal de la página de categoría.
                  </p>
                </div>

                {/* Beneficios */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficios de elegir MEISA
                  </label>
                  <div className="space-y-3">
                    {(formData.beneficios as string[]).map((beneficio, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={beneficio}
                          onChange={(e) => {
                            const newBeneficios = [...(formData.beneficios as string[])]
                            newBeneficios[index] = e.target.value
                            setFormData(prev => ({ ...prev, beneficios: newBeneficios }))
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Ej: 27+ años de experiencia en estructuras metálicas"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newBeneficios = (formData.beneficios as string[]).filter((_, i) => i !== index)
                            setFormData(prev => ({ ...prev, beneficios: newBeneficios }))
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newBeneficios = [...(formData.beneficios as string[]), '']
                        setFormData(prev => ({ ...prev, beneficios: newBeneficios }))
                      }}
                      className="w-full px-3 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                    >
                      + Agregar Beneficio
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Lista de beneficios que aparecerá con checkmarks verdes.
                  </p>
                </div>

                {/* Proceso de Trabajo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nuestro Proceso de Trabajo
                  </label>
                  <div className="space-y-3">
                    {(formData.procesoTrabajo as string[]).map((paso, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={paso}
                          onChange={(e) => {
                            const newProceso = [...(formData.procesoTrabajo as string[])]
                            newProceso[index] = e.target.value
                            setFormData(prev => ({ ...prev, procesoTrabajo: newProceso }))
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Ej: Análisis de requerimientos y diseño inicial"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newProceso = (formData.procesoTrabajo as string[]).filter((_, i) => i !== index)
                            setFormData(prev => ({ ...prev, procesoTrabajo: newProceso }))
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newProceso = [...(formData.procesoTrabajo as string[]), '']
                        setFormData(prev => ({ ...prev, procesoTrabajo: newProceso }))
                      }}
                      className="w-full px-3 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                    >
                      + Agregar Paso del Proceso
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pasos numerados del proceso de trabajo que sigue MEISA.
                  </p>
                </div>

                {/* Estadísticas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Estadísticas de la Categoría
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Toneladas Total
                      </label>
                      <input
                        type="number"
                        value={(formData.estadisticas as any)?.toneladasTotal || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          estadisticas: { 
                            ...(prev.estadisticas as any), 
                            toneladasTotal: e.target.value ? parseInt(e.target.value) : undefined 
                          } 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="1500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Proyectos Completados
                      </label>
                      <input
                        type="number"
                        value={(formData.estadisticas as any)?.proyectosCompletados || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          estadisticas: { 
                            ...(prev.estadisticas as any), 
                            proyectosCompletados: e.target.value ? parseInt(e.target.value) : undefined 
                          } 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="25"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Años de Experiencia
                      </label>
                      <input
                        type="number"
                        value={(formData.estadisticas as any)?.anosExperiencia || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          estadisticas: { 
                            ...(prev.estadisticas as any), 
                            anosExperiencia: e.target.value ? parseInt(e.target.value) : undefined 
                          } 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="27"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Tiempo Promedio de Entrega
                      </label>
                      <input
                        type="text"
                        value={(formData.estadisticas as any)?.tiempoPromedioEntrega || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          estadisticas: { 
                            ...(prev.estadisticas as any), 
                            tiempoPromedioEntrega: e.target.value 
                          } 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="12 meses"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Estas estadísticas aparecerán como tarjetas destacadas en la página de categoría.
                  </p>
                </div>

                {/* Casos de Éxito */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Casos de Éxito Destacados
                  </label>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 mb-3">
                      Selecciona hasta 3 proyectos para mostrar como casos de éxito en la página de categoría:
                    </div>
                    
                    {availableProjects.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {availableProjects.map((project) => (
                          <label key={project.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={(formData.casosExitoIds as string[]).includes(project.id)}
                              onChange={(e) => {
                                const currentIds = formData.casosExitoIds as string[]
                                let newIds: string[]
                                
                                if (e.target.checked) {
                                  // Agregar solo si no está en la lista y no excede 3
                                  if (!currentIds.includes(project.id) && currentIds.length < 3) {
                                    newIds = [...currentIds, project.id]
                                  } else {
                                    newIds = currentIds
                                  }
                                } else {
                                  // Remover de la lista
                                  newIds = currentIds.filter(id => id !== project.id)
                                }
                                
                                setFormData(prev => ({ ...prev, casosExitoIds: newIds }))
                              }}
                              disabled={(formData.casosExitoIds as string[]).length >= 3 && !(formData.casosExitoIds as string[]).includes(project.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-900 flex-1">{project.titulo}</span>
                            {(formData.casosExitoIds as string[]).includes(project.id) && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                #{(formData.casosExitoIds as string[]).indexOf(project.id) + 1}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-md">
                        {categoria ? 'No hay proyectos disponibles en esta categoría' : 'Selecciona una categoría primero'}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Seleccionados: {(formData.casosExitoIds as string[]).length}/3</span>
                      <br />
                      Los proyectos aparecerán en el orden seleccionado en la sección "Casos de Éxito Destacados".
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

      {/* Modal de Crop Banner */}
      <ImageCropModal
        isOpen={showBannerCropModal}
        onClose={() => {
          setShowBannerCropModal(false)
          setSelectedBannerFile(null)
        }}
        onCropComplete={handleBannerCropComplete}
        imageFile={selectedBannerFile}
        aspectRatio={6}
      />
    </div>
  )
}
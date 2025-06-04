"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, Star, 
  Image as ImageIcon, Palette, Settings, 
  Building, Factory, Camera, Layers,
  Home, Zap, MoreHorizontal, Globe, Wrench
} from "lucide-react"
import CategoryEditModal from "./CategoryEditModal"
import { parseIconValue } from "@/lib/category-assets"

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
  totalProyectos: number
  createdAt: Date
  updatedAt: Date
  // Nuevos campos para contenido ampliado
  descripcionAmpliada: string | null
  beneficios: any[] | null
  procesoTrabajo: any[] | null
  estadisticas: any | null
  casosExitoIds: string[] | null
}

interface CategoriesPageClientProps {
  categorias: Categoria[]
  categoryStats: Record<string, number>
  canEdit: boolean
}

// Mapeo de iconos disponibles
const AVAILABLE_ICONS = {
  Building: Building,
  Factory: Factory,
  Camera: Camera,
  Layers: Layers,
  Home: Home,
  Zap: Zap,
  MoreHorizontal: MoreHorizontal,
  Globe: Globe,
  Wrench: Wrench
}

// Colores predefinidos
const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280'  // Gray
]

export default function CategoriesPageClient({ 
  categorias, 
  categoryStats, 
  canEdit 
}: CategoriesPageClientProps) {
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleNewCategory = () => {
    setEditingCategory(null)
    setShowEditModal(true)
  }

  const handleEditCategory = (categoria: Categoria) => {
    setEditingCategory(categoria)
    setShowEditModal(true)
  }

  const handleToggleVisibility = async (categoria: Categoria) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoria.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visible: !categoria.visible
        }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Error al actualizar visibilidad')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar visibilidad')
    }
  }

  const handleToggleFeatured = async (categoria: Categoria) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoria.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destacada: !categoria.destacada
        }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Error al actualizar estado destacado')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar estado destacado')
    }
  }

  const handleDeleteCategory = async (categoria: Categoria) => {
    const projectCount = categoryStats[categoria.key] || 0
    
    if (projectCount > 0) {
      alert(`No se puede eliminar la categoría porque tiene ${projectCount} proyecto(s) asociado(s)`)
      return
    }

    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      return
    }

    setDeletingId(categoria.id)
    try {
      const response = await fetch(`/api/admin/categories/${categoria.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al eliminar categoría')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar categoría')
    } finally {
      setDeletingId(null)
    }
  }

  const getIconComponent = (iconName: string | null, size: string = "h-8 w-8") => {
    const iconData = parseIconValue(iconName)
    
    // Nuevo formato: SVG organizado
    if (iconData?.type === 'svg') {
      return (
        <img 
          src={iconData.data?.path} 
          alt="Category icon"
          className={`${size} object-contain`}
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      )
    }
    
    // Formato legacy: imagen PNG
    if (iconData?.type === 'image') {
      return (
        <img 
          src={iconData.data?.path} 
          alt="Category icon"
          className={`${size} object-contain filter brightness-0 invert`}
        />
      )
    }
    
    // Formato Lucide
    if (iconData?.type === 'lucide' && iconData.key in AVAILABLE_ICONS) {
      const IconComponent = AVAILABLE_ICONS[iconData.key as keyof typeof AVAILABLE_ICONS]
      return <IconComponent className={size} />
    }
    
    return <Layers className={size} />
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header con botón de nueva categoría */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {categorias.length} categoría(s) configurada(s)
          </div>
          {canEdit && (
            <button
              onClick={handleNewCategory}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </button>
          )}
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria) => {
            const projectCount = categoryStats[categoria.key] || 0
            
            return (
              <div 
                key={categoria.id} 
                className={`group relative rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
                  categoria.visible ? 'opacity-100' : 'opacity-75'
                }`}
              >
                {/* Imagen como fondo de toda la tarjeta */}
                {categoria.imagenCover ? (
                  <div className="relative">
                    <img
                      src={categoria.imagenCover}
                      alt={`Cover de ${categoria.nombre}`}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    {/* Overlay personalizable para el ícono */}
                    {categoria.overlayOpacity && categoria.overlayOpacity > 0 && (
                      <div 
                        className="absolute inset-0"
                        style={{ 
                          backgroundColor: categoria.overlayColor || '#000000',
                          opacity: categoria.overlayOpacity
                        }}
                      />
                    )}
                    
                    {/* Overlay oscuro para legibilidad del texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Ícono centrado */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="w-32 h-32 flex items-center justify-center opacity-80"
                        style={{ color: categoria.color || '#3b82f6' }}
                      >
                        {getIconComponent(categoria.icono, "w-40 h-40")}
                      </div>
                    </div>

                    {/* Información y badges en esquina superior derecha */}
                    <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
                      {/* Información técnica */}
                      <div className="text-xs text-white/80 space-y-1 bg-black/40 backdrop-blur-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div>Slug: {categoria.slug}</div>
                        <div>Orden: {categoria.orden}</div>
                      </div>
                      
                      {/* Badges de estado */}
                      <div className="flex flex-col space-y-1">
                        {categoria.destacada && (
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                          </div>
                        )}
                        {!categoria.visible && (
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <EyeOff className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Texto superpuesto en la parte inferior */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1 drop-shadow-lg">
                        {categoria.nombre}
                      </h3>
                      <p className="text-sm text-white/90 mb-2 drop-shadow">
                        {projectCount} proyecto(s)
                      </p>
                      {categoria.descripcion && (
                        <p className="text-sm text-white/80 line-clamp-2 drop-shadow">
                          {categoria.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {/* Ícono centrado en placeholder */}
                    <div 
                      className="w-32 h-32 flex items-center justify-center"
                      style={{ color: categoria.color || '#3b82f6' }}
                    >
                      {getIconComponent(categoria.icono, "w-40 h-40")}
                    </div>

                    {/* Información y badges en placeholder */}
                    <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
                      {/* Información técnica */}
                      <div className="text-xs text-gray-600 space-y-1 bg-white/90 backdrop-blur-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div>Slug: {categoria.slug}</div>
                        <div>Orden: {categoria.orden}</div>
                      </div>
                      
                      {/* Badges de estado */}
                      <div className="flex flex-col space-y-1">
                        {categoria.destacada && (
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                          </div>
                        )}
                        {!categoria.visible && (
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <EyeOff className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Texto en placeholder */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                      <h3 className="text-xl font-bold mb-1">
                        {categoria.nombre}
                      </h3>
                      <p className="text-sm text-white/90 mb-2">
                        {projectCount} proyecto(s)
                      </p>
                      {categoria.descripcion && (
                        <p className="text-sm text-white/80 line-clamp-2">
                          {categoria.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Acciones como overlay en la parte superior izquierda */}
                {canEdit && (
                  <div className="absolute top-3 left-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleVisibility(categoria)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        categoria.visible 
                          ? 'bg-green-100/90 text-green-600 hover:bg-green-200/90' 
                          : 'bg-gray-100/90 text-gray-400 hover:bg-gray-200/90'
                      }`}
                      title={categoria.visible ? 'Ocultar' : 'Mostrar'}
                    >
                      {categoria.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={() => handleToggleFeatured(categoria)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        categoria.destacada 
                          ? 'bg-yellow-100/90 text-yellow-600 hover:bg-yellow-200/90' 
                          : 'bg-gray-100/90 text-gray-400 hover:bg-gray-200/90'
                      }`}
                      title={categoria.destacada ? 'Quitar destacado' : 'Destacar'}
                    >
                      <Star className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleEditCategory(categoria)}
                      className="p-2 rounded-full bg-blue-100/90 text-blue-600 hover:bg-blue-200/90 backdrop-blur-sm transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(categoria)}
                      disabled={deletingId === categoria.id || projectCount > 0}
                      className="p-2 rounded-full bg-red-100/90 text-red-600 hover:bg-red-200/90 backdrop-blur-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={projectCount > 0 ? `No se puede eliminar (tiene ${projectCount} proyectos)` : "Eliminar"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

              </div>
            )
          })}

          {/* Mensaje cuando no hay categorías */}
          {categorias.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Settings className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No hay categorías configuradas</p>
              {canEdit && (
                <button
                  onClick={handleNewCategory}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Categoría
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <CategoryEditModal
          categoria={editingCategory}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingCategory(null)
          }}
          onSave={() => {
            setShowEditModal(false)
            setEditingCategory(null)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
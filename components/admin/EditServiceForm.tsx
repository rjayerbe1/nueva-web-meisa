"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, X, Settings } from "lucide-react"
import Link from "next/link"
import ServiceDetailEditor from './ServiceDetailEditor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import * as Icons from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { COLOR_OPTIONS } from '@/lib/service-colors'
import toast from 'react-hot-toast'

interface Service {
  id: string
  nombre: string
  titulo?: string
  subtitulo?: string
  descripcion: string
  caracteristicas?: string[]
  capacidades?: string[]
  orden: number
  icono: string | null
  color?: string
  bgGradient?: string
  imagen?: string
  destacado?: boolean
  activo?: boolean
  slug?: string
  metaTitle?: string
  metaDescription?: string
  expertiseTitulo?: string
  expertiseDescripcion?: string
  tecnologias?: any
  equipamiento?: any
  certificaciones?: any
  normativas?: any
  metodologia?: any
  ventajas?: any
  equipos?: any
  seguridad?: any
  [key: string]: any
}

interface JsonSection {
  titulo: string
  items: string[]
}

const iconOptions = [
  'Calculator', 'Settings', 'Truck', 'Users', 
  'Building2', 'Cog', 'HardHat', 'Shield',
  'Zap', 'Award', 'FileText', 'Globe'
]

interface EditServiceFormProps {
  serviceId: string
}

export default function EditServiceForm({ serviceId }: EditServiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState<Service>({
    id: '',
    nombre: '',
    titulo: '',
    subtitulo: '',
    descripcion: '',
    caracteristicas: [''],
    capacidades: [],
    orden: 1,
    icono: 'Settings',
    color: 'blue',
    bgGradient: '',
    imagen: '',
    destacado: false,
    activo: true,
    slug: '',
    metaTitle: '',
    metaDescription: '',
    expertiseTitulo: '',
    expertiseDescripcion: '',
    tecnologias: null,
    equipamiento: null,
    certificaciones: null,
    normativas: null,
    metodologia: null,
    ventajas: null,
    equipos: null,
    seguridad: null
  })
  
  const [newCapacidad, setNewCapacidad] = useState('')
  const [activeSection, setActiveSection] = useState<string>('')
  const [newSectionItem, setNewSectionItem] = useState('')

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/admin/services/${serviceId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        
        if (response.ok) {
          const service: Service = await response.json()
          setFormData({
            ...service,
            caracteristicas: (service.caracteristicas && service.caracteristicas.length > 0) ? service.caracteristicas : [''],
            capacidades: service.capacidades || [],
            icono: service.icono || 'Settings',
            color: service.color || 'blue',
            bgGradient: service.bgGradient || '',
            imagen: service.imagen || '',
            destacado: service.destacado || false,
            activo: service.activo !== undefined ? service.activo : true,
            tecnologias: service.tecnologias || null,
            equipamiento: service.equipamiento || null,
            certificaciones: service.certificaciones || null,
            normativas: service.normativas || null,
            metodologia: service.metodologia || null,
            ventajas: service.ventajas || null,
            equipos: service.equipos || null,
            seguridad: service.seguridad || null
          })
        } else if (response.status === 401) {
          // Si no está autenticado, redirigir al login
          router.push('/auth/signin')
        } else {
          console.error('Error response:', response.status, response.statusText)
          const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
          alert(`Error al cargar el servicio: ${errorData.error || 'Error del servidor'}`)
          router.push('/admin/services')
        }
      } catch (error) {
        console.error('Error fetching service:', error)
        alert('Error de conexión al cargar el servicio')
        router.push('/admin/services')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchService()
  }, [serviceId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          caracteristicas: formData.caracteristicas.filter(c => c.trim() !== ''),
          bgGradient: formData.bgGradient || `from-${formData.color}-600 to-${formData.color}-800`
        }),
      })

      if (response.ok) {
        router.push('/admin/services')
        router.refresh()
      } else {
        alert('Error al actualizar el servicio')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el servicio')
    } finally {
      setLoading(false)
    }
  }

  // Helper functions
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug from titulo
    if (field === 'titulo' && !formData.id) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
  }

  const addCaracteristica = () => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: [...prev.caracteristicas, '']
    }))
  }

  const removeCaracteristica = (index: number) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index)
    }))
  }

  const updateCaracteristica = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.map((c, i) => i === index ? value : c)
    }))
  }

  // Handle capacidades
  const addCapacidad = () => {
    if (newCapacidad.trim()) {
      handleChange('capacidades', [...formData.capacidades, newCapacidad.trim()])
      setNewCapacidad('')
    }
  }

  const removeCapacidad = (index: number) => {
    handleChange('capacidades', formData.capacidades.filter((_, i) => i !== index))
  }

  // Handle JSON sections
  const initializeSection = (sectionKey: string, titulo: string) => {
    handleChange(sectionKey, { titulo: titulo || '', items: [] })
    setActiveSection(sectionKey)
  }

  const addSectionItem = (sectionKey: string) => {
    if (newSectionItem.trim()) {
      const section = formData[sectionKey as keyof typeof formData] as JsonSection
      if (section && section.items) {
        handleChange(sectionKey, {
          ...section,
          items: [...section.items, newSectionItem.trim()]
        })
        setNewSectionItem('')
      } else {
        handleChange(sectionKey, {
          titulo: section?.titulo || '',
          items: [newSectionItem.trim()]
        })
        setNewSectionItem('')
      }
    }
  }

  const removeSectionItem = (sectionKey: string, index: number) => {
    const section = formData[sectionKey as keyof typeof formData] as JsonSection
    if (section && section.items) {
      handleChange(sectionKey, {
        ...section,
        items: section.items.filter((_, i) => i !== index)
      })
    }
  }

  const removeSection = (sectionKey: string) => {
    handleChange(sectionKey, null)
    if (activeSection === sectionKey) {
      setActiveSection('')
    }
  }

  // Get icon component
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Settings
    return Icon
  }

  const SelectedIcon = getIcon(formData.icono)

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-meisa-blue"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/services"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Servicio</h1>
            <p className="text-gray-600">Modifica la información del servicio</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="advanced">Contenido Avanzado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Servicio *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
                placeholder="Ej: Diseño Estructural"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden de Aparición
              </label>
              <input
                type="number"
                min="1"
                value={formData.orden}
                onChange={(e) => setFormData(prev => ({ ...prev, orden: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              required
              rows={4}
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              placeholder="Describe el servicio en detalle..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Características
              </label>
              <button
                type="button"
                onClick={addCaracteristica}
                className="flex items-center text-sm text-meisa-blue hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Añadir característica
              </button>
            </div>
            <div className="space-y-3">
              {formData.caracteristicas.map((caracteristica, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={caracteristica}
                    onChange={(e) => updateCaracteristica(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
                    placeholder="Ej: Análisis de cargas y esfuerzos"
                  />
                  {formData.caracteristicas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCaracteristica(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icono (opcional)
            </label>
            <input
              type="text"
              value={formData.icono}
              onChange={(e) => setFormData(prev => ({ ...prev, icono: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              placeholder="Ej: 🏗️"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              href="/admin/services"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-meisa-blue border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </TabsContent>
    
    <TabsContent value="advanced">
      <ServiceDetailEditor 
        service={formData}
        onSave={async (data) => {
          setLoading(true)
          try {
            const response = await fetch(`/api/admin/services/${serviceId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify(data),
            })
            
            if (response.ok) {
              router.push('/admin/services')
              router.refresh()
            } else {
              alert('Error al actualizar el servicio')
            }
          } catch (error) {
            console.error('Error:', error)
            alert('Error al actualizar el servicio')
          } finally {
            setLoading(false)
          }
        }}
        loading={loading}
      />
    </TabsContent>
  </Tabs>
    </div>
  )
}
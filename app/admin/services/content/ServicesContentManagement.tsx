'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Image as ImageIcon, 
  BarChart3, 
  Target, 
  Award,
  HelpCircle,
  Settings,
  AlertCircle,
  Eye,
  Edit3
} from 'lucide-react'
import ServiceDetailEditor from '@/components/admin/ServiceDetailEditor'
import * as Icons from 'lucide-react'

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
  imagenesGaleria?: any
  estadisticas?: any
  procesoPasos?: any
  casosExito?: any
  testimonios?: any
  preguntasFrecuentes?: any
  recursosDescargables?: any
  competencias?: any
  tablaComparativa?: any
  videoDemostrativo?: string
  [key: string]: any
}

interface ServicesContentManagementProps {
  initialServices: Service[]
}

export default function ServicesContentManagement({ initialServices }: ServicesContentManagementProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [selectedService, setSelectedService] = useState<Service | null>(
    initialServices.length > 0 ? initialServices[0] : null
  )
  const [loading, setLoading] = useState(false)

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
  }

  const handleSave = async (data: any) => {
    if (!selectedService) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/services/${selectedService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (response.ok) {
        // Update local state
        setServices(prev => 
          prev.map(s => s.id === selectedService.id ? { ...s, ...data } : s)
        )
        setSelectedService({ ...selectedService, ...data })
      } else {
        alert('Error al actualizar el contenido del servicio')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el contenido del servicio')
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Settings
    return Icon
  }

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500',
      red: 'bg-red-500', 
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      indigo: 'bg-indigo-500',
      gray: 'bg-gray-500'
    }
    return colorMap[color] || 'bg-blue-500'
  }

  const getContentStats = (service: Service) => {
    const safeLength = (arr: any) => {
      if (Array.isArray(arr)) return arr.length
      if (arr && typeof arr === 'object' && arr.items && Array.isArray(arr.items)) return arr.items.length
      if (arr && typeof arr === 'object' && arr.length !== undefined) return arr.length
      return 0
    }

    return {
      galeria: safeLength(service.imagenesGaleria),
      estadisticas: safeLength(service.estadisticas),
      procesos: safeLength(service.procesoPasos),
      casos: safeLength(service.casosExito),
      testimonios: safeLength(service.testimonios),
      faqs: safeLength(service.preguntasFrecuentes),
      recursos: safeLength(service.recursosDescargables),
      competencias: safeLength(service.competencias)
    }
  }

  if (!selectedService) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay servicios disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Services List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Servicios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {services.map((service) => {
              const stats = getContentStats(service)
              const totalContent = Object.values(stats).reduce((a, b) => a + b, 0)
              
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    selectedService?.id === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClass(service.color || 'blue')}`}>
                        {(() => {
                          const Icon = getIcon(service.icono || 'Settings')
                          return <Icon className="h-4 w-4 text-white" />
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{service.nombre}</p>
                        <p className="text-xs text-gray-500 truncate">{service.titulo}</p>
                      </div>
                    </div>
                    
                    {/* Content indicators */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex space-x-1">
                        {stats.galeria > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            {stats.galeria}
                          </Badge>
                        )}
                        {stats.estadisticas > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {stats.estadisticas}
                          </Badge>
                        )}
                        {stats.casos > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {stats.casos}
                          </Badge>
                        )}
                      </div>
                      <span className="text-gray-400">
                        {totalContent} elementos
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Content Summary */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Contenido</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const stats = getContentStats(selectedService)
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Galería</span>
                    </div>
                    <Badge variant={stats.galeria > 0 ? "default" : "secondary"}>
                      {stats.galeria}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Estadísticas</span>
                    </div>
                    <Badge variant={stats.estadisticas > 0 ? "default" : "secondary"}>
                      {stats.estadisticas}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Procesos</span>
                    </div>
                    <Badge variant={stats.procesos > 0 ? "default" : "secondary"}>
                      {stats.procesos}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Casos de Éxito</span>
                    </div>
                    <Badge variant={stats.casos > 0 ? "default" : "secondary"}>
                      {stats.casos}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">FAQs</span>
                    </div>
                    <Badge variant={stats.faqs > 0 ? "default" : "secondary"}>
                      {stats.faqs}
                    </Badge>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Content Editor */}
      <div className="lg:col-span-3">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{selectedService.nombre}</h2>
              <p className="text-gray-600">Contenido detallado del servicio</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center">
                <Edit3 className="h-3 w-3 mr-1" />
                Editando
              </Badge>
            </div>
          </div>
        </div>

        {/* Service Detail Editor */}
        <ServiceDetailEditor 
          service={selectedService}
          onSave={handleSave}
          loading={loading}
        />
      </div>
    </div>
  )
}
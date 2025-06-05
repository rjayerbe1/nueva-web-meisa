'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Palette, 
  Eye, 
  Save, 
  RefreshCw,
  Image as ImageIcon,
  Settings,
  AlertCircle,
  Star,
  ToggleLeft,
  Hash
} from 'lucide-react'
import * as Icons from 'lucide-react'
import { COLOR_OPTIONS } from '@/lib/service-colors'
import { ImageUploader } from '@/components/admin/ImageUploader'
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

interface ServicesVisualManagementProps {
  initialServices: Service[]
}

const iconOptions = [
  'Calculator', 'Settings', 'Truck', 'Users', 
  'Building2', 'Cog', 'HardHat', 'Shield',
  'Zap', 'Award', 'FileText', 'Globe',
  'Wrench', 'Target', 'CheckCircle', 'Star',
  'BarChart3', 'Layers', 'Cpu', 'Database'
]

export default function ServicesVisualManagement({ initialServices }: ServicesVisualManagementProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [selectedService, setSelectedService] = useState<Service | null>(
    initialServices.length > 0 ? initialServices[0] : null
  )
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
  }

  const handleVisualUpdate = async (field: string, value: any) => {
    if (!selectedService) return

    const updatedService = { ...selectedService, [field]: value }
    setSelectedService(updatedService)

    // Update services list
    setServices(prev => 
      prev.map(s => s.id === selectedService.id ? updatedService : s)
    )
  }

  const handleSaveChanges = async () => {
    if (!selectedService) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/services/${selectedService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          icono: selectedService.icono,
          color: selectedService.color,
          bgGradient: selectedService.bgGradient || `from-${selectedService.color}-600 to-${selectedService.color}-800`,
          imagen: selectedService.imagen,
          destacado: selectedService.destacado,
          activo: selectedService.activo,
          orden: selectedService.orden
        }),
      })

      if (response.ok) {
        toast.success('Aspectos visuales actualizados correctamente')
      } else {
        toast.error('Error al actualizar los aspectos visuales')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar los aspectos visuales')
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

  const SelectedIcon = getIcon(selectedService.icono || 'Settings')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Services List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Lista de Servicios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`w-full p-3 text-left rounded-lg border transition-all ${
                  selectedService?.id === service.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClass(service.color || 'blue')}`}>
                      {(() => {
                        const Icon = getIcon(service.icono || 'Settings')
                        return <Icon className="h-4 w-4 text-white" />
                      })()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{service.nombre}</p>
                      <p className="text-xs text-gray-500">{service.titulo}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {service.imagen && (
                      <Badge variant="secondary" className="text-xs">IMG</Badge>
                    )}
                    {service.destacado && (
                      <Badge variant="default" className="text-xs">★</Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Visual Configuration */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{selectedService.nombre}</h2>
            <p className="text-gray-600">Configuración visual del servicio</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Editar' : 'Vista Previa'}
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={loading}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <Card className="p-6">
            <div className={`rounded-xl p-8 text-white bg-gradient-to-br ${selectedService.bgGradient || `from-${selectedService.color}-600 to-${selectedService.color}-800`}`}>
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <SelectedIcon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{selectedService.titulo || selectedService.nombre}</h3>
                  <p className="text-white/90">Vista previa del servicio con la configuración visual actual</p>
                </div>
              </div>
              {selectedService.imagen && (
                <div className="mt-6">
                  <img 
                    src={selectedService.imagen} 
                    alt="Imagen del servicio"
                    className="w-full h-32 object-cover rounded-lg opacity-90"
                  />
                </div>
              )}
            </div>
          </Card>
        ) : (
          /* Edit Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Icon Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <SelectedIcon className="h-5 w-5 mr-2" />
                  Configuración de Icono
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Icono Actual</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClass(selectedService.color || 'blue')}`}>
                      <SelectedIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-medium">{selectedService.icono}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Seleccionar Icono</Label>
                  <Select 
                    value={selectedService.icono || ''} 
                    onValueChange={(value) => handleVisualUpdate('icono', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un icono" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((iconName) => {
                        const Icon = getIcon(iconName)
                        return (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{iconName}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Color Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Palette className="h-5 w-5 mr-2" />
                  Configuración de Color
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Color Principal</Label>
                  <Select 
                    value={selectedService.color || ''} 
                    onValueChange={(value) => {
                      handleVisualUpdate('color', value)
                      handleVisualUpdate('bgGradient', `from-${value}-600 to-${value}-800`)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un color" />
                    </SelectTrigger>
                    <SelectContent className="w-80">
                      {COLOR_OPTIONS.map((color) => (
                        <SelectItem key={color.value} value={color.value} className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-5 h-5 rounded-full ${getColorClass(color.value)} border-2 border-white shadow-sm flex-shrink-0`} />
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{color.label}</span>
                              <span className="text-xs text-gray-500">{color.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Gradiente Personalizado (opcional)</Label>
                  <Input
                    value={selectedService.bgGradient || ''}
                    onChange={(e) => handleVisualUpdate('bgGradient', e.target.value)}
                    placeholder="from-blue-600 to-blue-800"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usa clases de Tailwind, ej: from-blue-600 to-purple-800
                  </p>
                </div>

                {/* Vista previa del color */}
                <div className="mt-3 p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Vista previa del color:</p>
                  <div className="flex items-center gap-4">
                    {/* Fondo normal */}
                    <div className={`w-8 h-8 ${getColorClass(selectedService.color || 'blue')} rounded-lg shadow-sm border border-white`}></div>
                    
                    {/* Versión más clara para fondos */}
                    <div className={`w-8 h-8 bg-${selectedService.color || 'blue'}-100 rounded-lg shadow-sm border border-gray-200`}></div>
                    
                    {/* Gradiente */}
                    <div className={`w-16 h-8 bg-gradient-to-r ${selectedService.bgGradient || `from-${selectedService.color || 'blue'}-600 to-${selectedService.color || 'blue'}-800`} rounded-lg shadow-sm`}></div>
                    
                    <div className="text-xs text-gray-500">
                      <div>Normal • Claro • Gradiente</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Settings className="h-5 w-5 mr-2" />
                  Configuración del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Orden de Visualización</Label>
                  <Input
                    type="number"
                    value={selectedService.orden}
                    onChange={(e) => handleVisualUpdate('orden', parseInt(e.target.value))}
                    min="0"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Orden en que aparece en la lista (menor número = primero)
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <Label>Servicio Destacado</Label>
                      <p className="text-xs text-gray-500">Aparece con mayor prominencia</p>
                    </div>
                  </div>
                  <Switch
                    checked={selectedService.destacado || false}
                    onCheckedChange={(checked) => handleVisualUpdate('destacado', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ToggleLeft className="h-5 w-5 text-green-500" />
                    <div>
                      <Label>Servicio Activo</Label>
                      <p className="text-xs text-gray-500">Visible en la página pública</p>
                    </div>
                  </div>
                  <Switch
                    checked={selectedService.activo !== false}
                    onCheckedChange={(checked) => handleVisualUpdate('activo', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Imagen Principal del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedService.imagen ? (
                    <div className="relative">
                      <img
                        src={selectedService.imagen}
                        alt="Imagen del servicio"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleVisualUpdate('imagen', '')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <span className="text-sm">Quitar</span>
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No hay imagen configurada</p>
                    </div>
                  )}
                  
                  <ImageUploader
                    images={selectedService.imagen ? [selectedService.imagen] : []}
                    onUpload={(urls) => handleVisualUpdate('imagen', urls[0] || '')}
                    maxFiles={1}
                    label="Subir Nueva Imagen"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
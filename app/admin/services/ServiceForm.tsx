'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Servicio } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import * as Icons from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { COLOR_OPTIONS } from '@/lib/service-colors'

interface ServiceFormProps {
  service?: Servicio
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


export default function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    nombre: service?.nombre || '',
    titulo: service?.titulo || '',
    subtitulo: service?.subtitulo || '',
    descripcion: service?.descripcion || '',
    capacidades: service?.capacidades || [],
    tecnologias: (service?.tecnologias as unknown as JsonSection) || null,
    equipamiento: (service?.equipamiento as unknown as JsonSection) || null,
    certificaciones: (service?.certificaciones as unknown as JsonSection) || null,
    normativas: (service?.normativas as unknown as JsonSection) || null,
    metodologia: (service?.metodologia as unknown as JsonSection) || null,
    ventajas: (service?.ventajas as unknown as JsonSection) || null,
    equipos: (service?.equipos as unknown as JsonSection) || null,
    seguridad: (service?.seguridad as unknown as JsonSection) || null,
    expertiseTitulo: service?.expertiseTitulo || '',
    expertiseDescripcion: service?.expertiseDescripcion || '',
    icono: service?.icono || 'Settings',
    imagen: service?.imagen || '',
    color: service?.color || 'blue',
    bgGradient: service?.bgGradient || '',
    orden: service?.orden || 0,
    destacado: service?.destacado || false,
    activo: service?.activo || true,
    slug: service?.slug || '',
    metaTitle: service?.metaTitle || '',
    metaDescription: service?.metaDescription || '',
  })

  const [newCapacidad, setNewCapacidad] = useState('')
  const [activeSection, setActiveSection] = useState<string>('')
  const [newSectionItem, setNewSectionItem] = useState('')

  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  // Handle form changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug from titulo
    if (field === 'titulo' && !service) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
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
    handleChange(sectionKey, { titulo, items: [] })
    setActiveSection(sectionKey)
  }

  const addSectionItem = (sectionKey: string) => {
    if (newSectionItem.trim()) {
      const section = formData[sectionKey as keyof typeof formData] as JsonSection
      if (section) {
        handleChange(sectionKey, {
          ...section,
          items: [...section.items, newSectionItem.trim()]
        })
        setNewSectionItem('')
      }
    }
  }

  const removeSectionItem = (sectionKey: string, index: number) => {
    const section = formData[sectionKey as keyof typeof formData] as JsonSection
    if (section) {
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const endpoint = service
        ? `/api/admin/services/${service.id}`
        : '/api/admin/services'
      
      const method = service ? 'PUT' : 'POST'

      // Auto-generate bgGradient if not set
      if (!formData.bgGradient) {
        formData.bgGradient = `from-${formData.color}-600 to-${formData.color}-800`
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar el servicio')
      }

      toast.success(service ? 'Servicio actualizado' : 'Servicio creado')
      router.push('/admin/services')
      router.refresh()
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Error al guardar el servicio')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get icon component
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Settings
    return Icon
  }

  const SelectedIcon = getIcon(formData.icono)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/services">
          <Button variant="outline" type="button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Guardando...' : 'Guardar Servicio'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contenido">Contenido</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Tab General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Servicio*</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    required
                    placeholder="Ej: Consultoría en Diseño Estructural"
                  />
                </div>
                <div>
                  <Label htmlFor="titulo">Título (Opcional)</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleChange('titulo', e.target.value)}
                    placeholder="Título alternativo para mostrar"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  value={formData.subtitulo}
                  onChange={(e) => handleChange('subtitulo', e.target.value)}
                  placeholder="Ej: Ingeniería de precisión con más de 27 años de experiencia"
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción*</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  required
                  rows={4}
                  placeholder="Descripción completa del servicio..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="orden">Orden de Visualización</Label>
                  <Input
                    id="orden"
                    type="number"
                    value={formData.orden}
                    onChange={(e) => handleChange('orden', parseInt(e.target.value))}
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="destacado"
                    checked={formData.destacado}
                    onCheckedChange={(checked) => handleChange('destacado', checked)}
                  />
                  <Label htmlFor="destacado">Servicio Destacado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) => handleChange('activo', checked)}
                  />
                  <Label htmlFor="activo">Servicio Activo</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Contenido */}
        <TabsContent value="contenido" className="space-y-6">
          {/* Capacidades */}
          <Card>
            <CardHeader>
              <CardTitle>Capacidades Principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCapacidad}
                  onChange={(e) => setNewCapacidad(e.target.value)}
                  placeholder="Agregar capacidad..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapacidad())}
                />
                <Button type="button" onClick={addCapacidad} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.capacidades.map((cap, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex-1 justify-between">
                      {cap}
                      <button
                        type="button"
                        onClick={() => removeCapacidad(index)}
                        className="ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expertise */}
          <Card>
            <CardHeader>
              <CardTitle>Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="expertiseTitulo">Título de Expertise</Label>
                <Input
                  id="expertiseTitulo"
                  value={formData.expertiseTitulo}
                  onChange={(e) => handleChange('expertiseTitulo', e.target.value)}
                  placeholder="Ej: Nuestra Experiencia"
                />
              </div>
              <div>
                <Label htmlFor="expertiseDescripcion">Descripción de Expertise</Label>
                <Textarea
                  id="expertiseDescripcion"
                  value={formData.expertiseDescripcion}
                  onChange={(e) => handleChange('expertiseDescripcion', e.target.value)}
                  rows={3}
                  placeholder="Descripción de la experiencia y capacidades..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Secciones adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Secciones Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'tecnologias', label: 'Tecnologías', defaultTitle: 'Tecnología de Vanguardia' },
                  { key: 'equipamiento', label: 'Equipamiento', defaultTitle: 'Equipamiento Especializado' },
                  { key: 'certificaciones', label: 'Certificaciones', defaultTitle: 'Certificaciones de Calidad' },
                  { key: 'normativas', label: 'Normativas', defaultTitle: 'Cumplimiento Normativo' },
                  { key: 'metodologia', label: 'Metodología', defaultTitle: 'Metodología de Trabajo' },
                  { key: 'ventajas', label: 'Ventajas', defaultTitle: 'Ventajas Competitivas' },
                  { key: 'equipos', label: 'Equipos', defaultTitle: 'Equipos Especializados' },
                  { key: 'seguridad', label: 'Seguridad', defaultTitle: 'Seguridad Industrial' },
                ].map(section => {
                  const sectionData = formData[section.key as keyof typeof formData] as JsonSection | null
                  
                  return (
                    <div key={section.key} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{section.label}</h4>
                        {!sectionData ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => initializeSection(section.key, section.defaultTitle)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(section.key)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      {sectionData && (
                        <div className="space-y-2">
                          <Input
                            value={sectionData.titulo}
                            onChange={(e) => handleChange(section.key, { ...sectionData, titulo: e.target.value })}
                            placeholder="Título de la sección"
                            className="mb-2"
                          />
                          
                          {activeSection === section.key && (
                            <div className="flex gap-2">
                              <Input
                                value={newSectionItem}
                                onChange={(e) => setNewSectionItem(e.target.value)}
                                placeholder="Agregar item..."
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addSectionItem(section.key)
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addSectionItem(section.key)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          
                          <div className="space-y-1">
                            {sectionData.items.map((item, index) => (
                              <Badge key={index} variant="outline" className="mr-2">
                                {item}
                                <button
                                  type="button"
                                  onClick={() => removeSectionItem(section.key, index)}
                                  className="ml-2"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          
                          {activeSection !== section.key && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveSection(section.key)}
                            >
                              Editar items
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Visual */}
        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Visual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icono">Icono</Label>
                  <Select value={formData.icono} onValueChange={(value) => handleChange('icono', value)}>
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <SelectedIcon className="w-4 h-4" />
                          {formData.icono}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(iconName => {
                        const Icon = getIcon(iconName)
                        return (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {iconName}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">Color Principal del Servicio</Label>
                  <Select value={formData.color} onValueChange={(value) => handleChange('color', value)}>
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full ${COLOR_OPTIONS.find(c => c.value === formData.color)?.class} border-2 border-white shadow-sm`} />
                          <span className="font-medium">{COLOR_OPTIONS.find(c => c.value === formData.color)?.label}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-80">
                      {COLOR_OPTIONS.map(color => (
                        <SelectItem key={color.value} value={color.value} className="py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full ${color.class} border-2 border-white shadow-sm flex-shrink-0`} />
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{color.label}</span>
                              <span className="text-xs text-gray-500">{color.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-2">
                    Selecciona un color que esté alineado con la identidad visual de MEISA
                  </p>
                  
                  {/* Vista previa del color */}
                  <div className="mt-3 p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Vista previa del color:</p>
                    <div className="flex items-center gap-4">
                      {/* Fondo normal */}
                      <div className={`w-8 h-8 ${COLOR_OPTIONS.find(c => c.value === formData.color)?.class.replace('bg-', 'bg-')} rounded-lg shadow-sm border border-white`}></div>
                      
                      {/* Versión más clara para fondos */}
                      <div className={`w-8 h-8 bg-${formData.color}-100 rounded-lg shadow-sm border border-gray-200`}></div>
                      
                      {/* Gradiente */}
                      <div className={`w-16 h-8 bg-gradient-to-r from-${formData.color}-600 to-${formData.color}-800 rounded-lg shadow-sm`}></div>
                      
                      <div className="text-xs text-gray-500">
                        <div>Normal • Claro • Gradiente</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bgGradient">Gradiente de Fondo (Opcional)</Label>
                <Input
                  id="bgGradient"
                  value={formData.bgGradient}
                  onChange={(e) => handleChange('bgGradient', e.target.value)}
                  placeholder="Se genera automáticamente si lo dejas vacío"
                />
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-1">💡 Recomendación:</p>
                  <p className="text-sm text-blue-700">
                    Deja este campo vacío para que se genere automáticamente un gradiente perfecto 
                    basado en el color principal seleccionado. Solo personaliza si necesitas un estilo específico.
                  </p>
                  {formData.color && (
                    <p className="text-xs text-blue-600 mt-2">
                      Gradiente automático para {COLOR_OPTIONS.find(c => c.value === formData.color)?.label}: 
                      <code className="ml-1 px-1 bg-white rounded">from-{formData.color}-600 to-{formData.color}-800</code>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Imagen Principal</Label>
                <ImageUploader
                  images={formData.imagen ? [formData.imagen] : []}
                  onUpload={(urls) => handleChange('imagen', urls[0] || '')}
                  maxFiles={1}
                  label="Subir imagen del servicio"
                />
                {formData.imagen && (
                  <div className="mt-2">
                    <Input
                      value={formData.imagen}
                      onChange={(e) => handleChange('imagen', e.target.value)}
                      placeholder="O ingresa URL de imagen"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab SEO */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>Optimización SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slug">Slug (URL)*</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  required
                  placeholder="consultoria-diseno-estructural"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL amigable: /servicios/{formData.slug}
                </p>
              </div>
              <div>
                <Label htmlFor="metaTitle">Meta Título</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  placeholder="Título para motores de búsqueda"
                  maxLength={60}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 caracteres
                </p>
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Descripción</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  rows={3}
                  placeholder="Descripción para motores de búsqueda"
                  maxLength={160}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.metaDescription.length}/160 caracteres
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Guardando...' : service ? 'Actualizar Servicio' : 'Crear Servicio'}
        </Button>
      </div>
    </form>
  )
}
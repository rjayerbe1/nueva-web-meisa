'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Eye, 
  RotateCcw, 
  ArrowLeft, 
  Plus, 
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Image,
  Globe,
  Settings,
  Monitor,
  Factory,
  Target,
  Building2,
  Users,
  History,
  Award,
  Shield
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import MediaManager from './MediaManager'
import ImageSelector from './ImageSelector'

interface EditPageFormImprovedProps {
  slug: string
}

export default function EditPageFormImproved({ slug }: EditPageFormImprovedProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [pagina, setPagina] = useState<any>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    metaTitle: '',
    metaDescription: '',
    contenido: {}
  })

  useEffect(() => {
    fetchPagina()
  }, [slug])

  const fetchPagina = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/paginas?slug=${slug}`)
      if (!response.ok) throw new Error('Error al cargar página')
      
      const data = await response.json()
      setPagina(data)
      setFormData({
        titulo: data.titulo || '',
        subtitulo: data.subtitulo || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        contenido: data.contenido || {}
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar la página',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateContent = (path: string, value: string) => {
    const newContent = { ...formData.contenido }
    const keys = path.split('.')
    let current = newContent

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    setFormData({ ...formData, contenido: newContent })
  }

  const getContent = (path: string, defaultValue: string = ''): string => {
    const keys = path.split('.')
    let current = formData.contenido

    for (const key of keys) {
      current = current?.[key]
      if (current === undefined) return defaultValue
    }

    return typeof current === 'string' ? current : defaultValue
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/paginas/${pagina.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la página')
      }

      toast({
        title: '¡Éxito!',
        description: 'La página se ha actualizado correctamente',
      })
      
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Hubo un problema al guardar los cambios',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetToDefault = () => {
    if (pagina) {
      setFormData({
        titulo: pagina.titulo,
        subtitulo: pagina.subtitulo || '',
        metaTitle: pagina.metaTitle || '',
        metaDescription: pagina.metaDescription || '',
        contenido: pagina.contenido || {}
      })
      toast({
        title: 'Restaurado',
        description: 'Se han restaurado los valores originales'
      })
    }
  }

  // Función para agregar elementos a arrays dinámicos
  const addArrayItem = (arrayPath: string, defaultItem: any) => {
    const currentArray = getArrayContent(arrayPath)
    const newIndex = Object.keys(currentArray).length
    updateContent(`${arrayPath}.${newIndex}`, defaultItem)
  }

  // Función para eliminar elementos de arrays dinámicos
  const removeArrayItem = (arrayPath: string, index: number) => {
    const newContent = { ...formData.contenido }
    const keys = arrayPath.split('.')
    let current = newContent

    for (const key of keys) {
      current = current[key]
    }

    delete current[index]
    setFormData({ ...formData, contenido: newContent })
  }

  const getArrayContent = (arrayPath: string) => {
    const keys = arrayPath.split('.')
    let current = formData.contenido

    for (const key of keys) {
      current = current?.[key]
      if (current === undefined) return {}
    }

    return current || {}
  }

  if (isLoading && !pagina) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando página...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!pagina) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h2>
          <p className="text-gray-600 mb-6">La página que buscas no existe o no se pudo cargar.</p>
          <Button onClick={() => router.push('/admin/paginas')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a páginas
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mejorado */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin/paginas')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Páginas
              </Button>
              <div className="border-l border-gray-300 h-6 ml-2 mr-4"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Editar {pagina.titulo}</h1>
                <p className="text-sm text-gray-500">/{pagina.slug}</p>
              </div>
              <Badge variant="secondary" className="ml-2">
                <Globe className="w-3 h-3 mr-1" />
                {slug}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(`/${pagina.slug}`, '_blank')}
                className="text-gray-700 border-gray-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vista Previa
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetToDefault}
                className="text-gray-700 border-gray-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white p-1 border border-gray-200">
              <TabsTrigger 
                value="content" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <FileText className="w-4 h-4" />
                Contenido
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Image className="w-4 h-4" />
                Medios
              </TabsTrigger>
              <TabsTrigger 
                value="seo" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {/* Información básica */}
              <Card className="shadow-sm">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Información Básica
                  </CardTitle>
                  <CardDescription>
                    Título y descripción principal de la página
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="titulo" className="text-sm font-medium text-gray-700">
                        Título Principal
                      </Label>
                      <Input
                        id="titulo"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        placeholder="Título de la página"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subtitulo" className="text-sm font-medium text-gray-700">
                        Subtítulo
                      </Label>
                      <Input
                        id="subtitulo"
                        value={formData.subtitulo}
                        onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                        placeholder="Subtítulo de la página"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sección Hero */}
              <Card className="shadow-sm">
                <CardHeader className="bg-blue-50 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Image className="w-5 h-5 text-blue-600" />
                    Sección Hero
                  </CardTitle>
                  <CardDescription>
                    Contenido principal que aparece en la parte superior de la página
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Tag del Hero</Label>
                      <Input
                        value={getContent('heroTag')}
                        onChange={(e) => updateContent('heroTag', e.target.value)}
                        placeholder="Ej: CALIDAD Y CERTIFICACIONES"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Highlight del Título</Label>
                      <Input
                        value={getContent('heroTitleHighlight')}
                        onChange={(e) => updateContent('heroTitleHighlight', e.target.value)}
                        placeholder="Palabra destacada del título"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Título del Hero</Label>
                    <Input
                      value={getContent('heroTitle')}
                      onChange={(e) => updateContent('heroTitle', e.target.value)}
                      placeholder="Título principal del hero"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Subtítulo del Hero</Label>
                    <Textarea
                      value={getContent('heroSubtitle')}
                      onChange={(e) => updateContent('heroSubtitle', e.target.value)}
                      placeholder="Descripción principal del hero"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Botón CTA 1</Label>
                      <Input
                        value={getContent('heroCta1')}
                        onChange={(e) => updateContent('heroCta1', e.target.value)}
                        placeholder="Texto del primer botón"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Botón CTA 2</Label>
                      <Input
                        value={getContent('heroCta2')}
                        onChange={(e) => updateContent('heroCta2', e.target.value)}
                        placeholder="Texto del segundo botón"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contenido específico por página */}
              {slug === 'calidad' && (
                <>
                  {/* Componentes SIG */}
                  <Card className="shadow-sm">
                    <CardHeader className="bg-green-50 border-b">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5 text-green-600" />
                        Componentes SIG
                      </CardTitle>
                      <CardDescription>Los 4 pilares del Sistema Integrado de Gestión</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[0, 1, 2, 3].map((index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                            <h4 className="font-medium text-gray-900">Componente {index + 1}</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Título</Label>
                                <Input
                                  value={getContent(`sigComponents.${index}.title`)}
                                  onChange={(e) => updateContent(`sigComponents.${index}.title`, e.target.value)}
                                  placeholder={`Título del componente ${index + 1}`}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Descripción</Label>
                                <Textarea
                                  value={getContent(`sigComponents.${index}.description`)}
                                  onChange={(e) => updateContent(`sigComponents.${index}.description`, e.target.value)}
                                  placeholder={`Descripción del componente ${index + 1}`}
                                  rows={2}
                                  className="mt-1"
                                />
                              </div>
                              <ImageSelector
                                value={getContent(`sigComponents.${index}.image`)}
                                onChange={(url) => updateContent(`sigComponents.${index}.image`, url)}
                                label={`Icono/Imagen del Componente ${index + 1}`}
                                placeholder="Imagen para representar este componente"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Políticas */}
                  <Card className="shadow-sm">
                    <CardHeader className="bg-purple-50 border-b">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        Políticas Corporativas
                      </CardTitle>
                      <CardDescription>Las 4 políticas principales de la empresa</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {[0, 1, 2, 3].map((index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                            <h4 className="font-medium text-gray-900">Política {index + 1}</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Título</Label>
                                <Input
                                  value={getContent(`policies.${index}.title`)}
                                  onChange={(e) => updateContent(`policies.${index}.title`, e.target.value)}
                                  placeholder={`Título de la política ${index + 1}`}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Descripción</Label>
                                <Textarea
                                  value={getContent(`policies.${index}.description`)}
                                  onChange={(e) => updateContent(`policies.${index}.description`, e.target.value)}
                                  placeholder={`Descripción de la política ${index + 1}`}
                                  rows={2}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">Compromisos</Label>
                                <div className="space-y-2">
                                  {[0, 1, 2, 3, 4].map((commitmentIndex) => (
                                    <Input
                                      key={commitmentIndex}
                                      value={getContent(`policies.${index}.commitments.${commitmentIndex}`)}
                                      onChange={(e) => updateContent(`policies.${index}.commitments.${commitmentIndex}`, e.target.value)}
                                      placeholder={`Compromiso ${commitmentIndex + 1}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Contenido específico para TECNOLOGÍA */}
              {slug === 'tecnologia' && (
                <>
                  {/* Software Tools */}
                  <Card className="shadow-sm">
                    <CardHeader className="bg-blue-50 border-b">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        Herramientas de Software
                      </CardTitle>
                      <CardDescription>Software especializado para diseño y análisis</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {[0, 1, 2, 3].map((index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                            <h4 className="font-medium text-gray-900">Software {index + 1}</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                                <Input
                                  value={getContent(`softwareTools.${index}.name`)}
                                  onChange={(e) => updateContent(`softwareTools.${index}.name`, e.target.value)}
                                  placeholder={`Nombre del software ${index + 1}`}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Descripción</Label>
                                <Textarea
                                  value={getContent(`softwareTools.${index}.description`)}
                                  onChange={(e) => updateContent(`softwareTools.${index}.description`, e.target.value)}
                                  placeholder={`Descripción del software ${index + 1}`}
                                  rows={2}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">Características</Label>
                                <div className="space-y-2">
                                  {[0, 1, 2, 3, 4].map((featureIndex) => (
                                    <Input
                                      key={featureIndex}
                                      value={getContent(`softwareTools.${index}.features.${featureIndex}`)}
                                      onChange={(e) => updateContent(`softwareTools.${index}.features.${featureIndex}`, e.target.value)}
                                      placeholder={`Característica ${featureIndex + 1}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Equipamiento */}
                  <Card className="shadow-sm">
                    <CardHeader className="bg-orange-50 border-b">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5 text-orange-600" />
                        Equipamiento Industrial
                      </CardTitle>
                      <CardDescription>Maquinaria especializada de las plantas</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {[0, 1, 2].map((index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                            <h4 className="font-medium text-gray-900">Equipo {index + 1}</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Título</Label>
                                <Input
                                  value={getContent(`equipment.${index}.title`)}
                                  onChange={(e) => updateContent(`equipment.${index}.title`, e.target.value)}
                                  placeholder={`Título del equipo ${index + 1}`}
                                  className="mt-1"
                                />
                              </div>
                              <ImageSelector
                                value={getContent(`equipment.${index}.image`)}
                                onChange={(url) => updateContent(`equipment.${index}.image`, url)}
                                label={`Imagen del Equipo ${index + 1}`}
                                placeholder="Imagen representativa del equipamiento"
                              />
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">Items</Label>
                                <div className="space-y-2">
                                  {[0, 1, 2, 3, 4].map((itemIndex) => (
                                    <Input
                                      key={itemIndex}
                                      value={getContent(`equipment.${index}.items.${itemIndex}`)}
                                      onChange={(e) => updateContent(`equipment.${index}.items.${itemIndex}`, e.target.value)}
                                      placeholder={`Item ${itemIndex + 1}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Contenido específico para EMPRESA */}
              {slug === 'empresa' && (
                <>
                  {/* Estadísticas */}
                  <Card className="shadow-sm">
                    <CardHeader className="bg-indigo-50 border-b">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-600" />
                        Estadísticas Principales
                      </CardTitle>
                      <CardDescription>Números que destacan de la empresa</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[0, 1, 2, 3].map((index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                            <h4 className="font-medium text-gray-900">Estadística {index + 1}</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Número</Label>
                                <Input
                                  value={getContent(`numeroStats.${index}.number`)}
                                  onChange={(e) => updateContent(`numeroStats.${index}.number`, e.target.value)}
                                  placeholder={`Número ${index + 1}`}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Etiqueta</Label>
                                <Input
                                  value={getContent(`numeroStats.${index}.label`)}
                                  onChange={(e) => updateContent(`numeroStats.${index}.label`, e.target.value)}
                                  placeholder={`Etiqueta ${index + 1}`}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Descripción</Label>
                                <Input
                                  value={getContent(`capacidadStats.${index}.desc`)}
                                  onChange={(e) => updateContent(`capacidadStats.${index}.desc`, e.target.value)}
                                  placeholder={`Descripción ${index + 1}`}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Historia */}
                  <Card className="shadow-sm">
                    <CardHeader className="bg-green-50 border-b">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        Historia de la Empresa
                      </CardTitle>
                      <CardDescription>Contenido de la sección historia</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Párrafo 1</Label>
                        <Textarea
                          value={getContent('historia.parrafo1')}
                          onChange={(e) => updateContent('historia.parrafo1', e.target.value)}
                          placeholder="Primer párrafo de la historia"
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Párrafo 2</Label>
                        <Textarea
                          value={getContent('historia.parrafo2')}
                          onChange={(e) => updateContent('historia.parrafo2', e.target.value)}
                          placeholder="Segundo párrafo de la historia"
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Título de la Tarjeta</Label>
                          <Input
                            value={getContent('historia.card.title')}
                            onChange={(e) => updateContent('historia.card.title', e.target.value)}
                            placeholder="Desde 1998"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Subtítulo de la Tarjeta</Label>
                          <Textarea
                            value={getContent('historia.card.subtitle')}
                            onChange={(e) => updateContent('historia.card.subtitle', e.target.value)}
                            placeholder="Descripción de la tarjeta"
                            rows={2}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Misión y Visión */}
                  <Card className="shadow-sm">
                    <CardHeader className="bg-blue-50 border-b">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        Misión y Visión
                      </CardTitle>
                      <CardDescription>Identidad corporativa</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h5 className="font-medium text-gray-900">Misión</h5>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Título</Label>
                            <Input
                              value={getContent('identidad.mision.title')}
                              onChange={(e) => updateContent('identidad.mision.title', e.target.value)}
                              placeholder="Nuestra Misión"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Texto</Label>
                            <Textarea
                              value={getContent('identidad.mision.texto')}
                              onChange={(e) => updateContent('identidad.mision.texto', e.target.value)}
                              placeholder="Descripción de la misión"
                              rows={3}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h5 className="font-medium text-gray-900">Visión</h5>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Título</Label>
                            <Input
                              value={getContent('identidad.vision.title')}
                              onChange={(e) => updateContent('identidad.vision.title', e.target.value)}
                              placeholder="Nuestra Visión"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Texto</Label>
                            <Textarea
                              value={getContent('identidad.vision.texto')}
                              onChange={(e) => updateContent('identidad.vision.texto', e.target.value)}
                              placeholder="Descripción de la visión"
                              rows={3}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* CTA Final */}
              <Card className="shadow-sm">
                <CardHeader className="bg-orange-50 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-orange-600" />
                    Sección CTA Final
                  </CardTitle>
                  <CardDescription>Call to action al final de la página</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Título</Label>
                    <Input
                      value={getContent('cta.title')}
                      onChange={(e) => updateContent('cta.title', e.target.value)}
                      placeholder="Título del CTA"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Subtítulo</Label>
                    <Textarea
                      value={getContent('cta.subtitle')}
                      onChange={(e) => updateContent('cta.subtitle', e.target.value)}
                      placeholder="Descripción del llamado a la acción"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Botón CTA 1</Label>
                      <Input
                        value={getContent('ctaCta1')}
                        onChange={(e) => updateContent('ctaCta1', e.target.value)}
                        placeholder="Texto del primer botón"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Botón CTA 2</Label>
                      <Input
                        value={getContent('ctaCta2')}
                        onChange={(e) => updateContent('ctaCta2', e.target.value)}
                        placeholder="Texto del segundo botón"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              {/* Imágenes Principales */}
              <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Image className="w-5 h-5 text-blue-600" />
                    Imágenes Principales de la Página
                  </CardTitle>
                  <CardDescription>
                    Imágenes fundamentales que aparecen en secciones principales
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Imagen Hero */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 mb-3">Imagen Hero Principal</h4>
                      <ImageSelector
                        value={getContent('heroImage', slug === 'empresa' ? '/images/empresa/instalaciones-planta.jpg' : slug === 'calidad' ? '/images/hero/hero-construccion-industrial.jpg' : '/images/tecnologia/tecnologia-industrial-1.jpg')}
                        onChange={(url) => updateContent('heroImage', url)}
                        label=""
                        placeholder="Imagen principal del hero"
                      />
                      <p className="text-xs text-gray-500">Se muestra como fondo en la sección principal</p>
                    </div>

                    {/* Imagen de fondo del Hero */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 mb-3">Imagen de Fondo del Hero</h4>
                      <ImageSelector
                        value={getContent('heroBackgroundImage')}
                        onChange={(url) => updateContent('heroBackgroundImage', url)}
                        label=""
                        placeholder="Imagen de fondo adicional (opcional)"
                      />
                      <p className="text-xs text-gray-500">Fondo alternativo o patrón decorativo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Imágenes específicas por página */}
              {slug === 'calidad' && (
                <Card className="shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="w-5 h-5 text-green-600" />
                      Contenido Visual - Página de Calidad
                    </CardTitle>
                    <CardDescription>
                      Imágenes específicas para la página de calidad y certificaciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    {/* SIG Components - 4 Pilares del Sistema */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">4 Pilares del Sistema SIG</h4>
                          <p className="text-sm text-gray-600">Imágenes para las tarjetas de componentes del Sistema Integrado de Gestión</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">1. Gestión de Calidad</label>
                          <ImageSelector
                            value={getContent('sigComponents.0.image', '/images/certificaciones/certificacion-calidad-1.jpg')}
                            onChange={(url) => updateContent('sigComponents.0.image', url)}
                            label=""
                            placeholder="Certificaciones y sistemas de calidad"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">2. Seguridad y Salud Ocupacional</label>
                          <ImageSelector
                            value={getContent('sigComponents.1.image', '/images/equipo/equipo-industrial-1.jpg')}
                            onChange={(url) => updateContent('sigComponents.1.image', url)}
                            label=""
                            placeholder="Equipo de seguridad industrial"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">3. Gestión Ambiental</label>
                          <ImageSelector
                            value={getContent('sigComponents.2.image', '/images/empresa/instalaciones-planta.jpg')}
                            onChange={(url) => updateContent('sigComponents.2.image', url)}
                            label=""
                            placeholder="Instalaciones y medio ambiente"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">4. Gestión de Riesgos</label>
                          <ImageSelector
                            value={getContent('sigComponents.3.image', '/images/servicios/gestion-4.jpg')}
                            onChange={(url) => updateContent('sigComponents.3.image', url)}
                            label=""
                            placeholder="Control de riesgos en obra"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {slug === 'tecnologia' && (
                <Card className="shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-blue-600" />
                      Contenido Visual - Página de Tecnología
                    </CardTitle>
                    <CardDescription>
                      Imágenes específicas para mostrar la tecnología e innovación de MEISA
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    {/* Proceso Tecnológico - 4 Fases */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Proceso Tecnológico Integral (4 Fases)</h4>
                          <p className="text-sm text-gray-600">Imágenes para mostrar cada etapa del proceso tecnológico</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">1. Diseño BIM</label>
                          <ImageSelector
                            value={getContent('procesoFases.0.image', '/images/servicios/consultoria-1.jpg')}
                            onChange={(url) => updateContent('procesoFases.0.image', url)}
                            label=""
                            placeholder="Software Tekla Structures en uso"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">2. Análisis Estructural</label>
                          <ImageSelector
                            value={getContent('procesoFases.1.image', '/images/servicios/consultoria-4.jpg')}
                            onChange={(url) => updateContent('procesoFases.1.image', url)}
                            label=""
                            placeholder="Pantallas de ETABS/SAP2000/Midas"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">3. Fabricación CNC</label>
                          <ImageSelector
                            value={getContent('procesoFases.2.image', '/images/equipo/equipo-industrial-1.jpg')}
                            onChange={(url) => updateContent('procesoFases.2.image', url)}
                            label=""
                            placeholder="Máquinas de corte en operación"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">4. Control Digital</label>
                          <ImageSelector
                            value={getContent('procesoFases.3.image', '/images/servicios/gestion-2.jpg')}
                            onChange={(url) => updateContent('procesoFases.3.image', url)}
                            label=""
                            placeholder="Sistemas de trazabilidad y QR"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Software Tools Screenshots */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Monitor className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Screenshots de Software Especializado</h4>
                          <p className="text-sm text-gray-600">Capturas de pantalla de los software utilizados</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Trimble Tekla Structures</label>
                          <ImageSelector
                            value={getContent('softwareTools.0.screenshot', '/images/software/tekla-modelado-3d.jpg')}
                            onChange={(url) => updateContent('softwareTools.0.screenshot', url)}
                            label=""
                            placeholder="Screenshot del modelado 3D en Tekla"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ETABS</label>
                          <ImageSelector
                            value={getContent('softwareTools.1.screenshot', '/images/software/etabs-screenshot.jpg')}
                            onChange={(url) => updateContent('softwareTools.1.screenshot', url)}
                            label=""
                            placeholder="Screenshot de análisis en ETABS"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">SAP2000</label>
                          <ImageSelector
                            value={getContent('softwareTools.2.screenshot', '/images/software/sap2000-screenshot.jpg')}
                            onChange={(url) => updateContent('softwareTools.2.screenshot', url)}
                            label=""
                            placeholder="Screenshot de diseño en SAP2000"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">IDEA StatiCa Connection</label>
                          <ImageSelector
                            value={getContent('softwareTools.3.screenshot', '/images/software/idea-statica-screenshot.jpg')}
                            onChange={(url) => updateContent('softwareTools.3.screenshot', url)}
                            label=""
                            placeholder="Screenshot de diseño de conexiones"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Equipamiento Industrial */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Factory className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Equipamiento Industrial MEISA</h4>
                          <p className="text-sm text-gray-600">Fotos reales de la maquinaria en plantas</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Maquinaria de Corte CNC</label>
                          <ImageSelector
                            value={getContent('equipment.0.image', '/images/maquinaria/mesas-cnc-1.jpg')}
                            onChange={(url) => updateContent('equipment.0.image', url)}
                            label=""
                            placeholder="Fotos de las 3 mesas CNC"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Equipos de Izaje</label>
                          <ImageSelector
                            value={getContent('equipment.1.image', '/images/maquinaria/puentes-grua-1.jpg')}
                            onChange={(url) => updateContent('equipment.1.image', url)}
                            label=""
                            placeholder="Fotos de los 8 puentes grúa"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Equipos Especializados</label>
                          <ImageSelector
                            value={getContent('equipment.2.image', '/images/maquinaria/equipos-especializados-1.jpg')}
                            onChange={(url) => updateContent('equipment.2.image', url)}
                            label=""
                            placeholder="Granalladora, ensambladora, curvadora"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {slug === 'empresa' && (
                <Card className="shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-600" />
                      Contenido Visual - Página de Empresa
                    </CardTitle>
                    <CardDescription>
                      Imágenes específicas para mostrar la historia, capacidades e instalaciones de MEISA
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    {/* Historia de MEISA - Crítica */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <History className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Historia de MEISA</h4>
                          <p className="text-sm text-red-600"><strong>CRÍTICO:</strong> Sección necesita imagen principal</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Imagen Principal de Historia</label>
                          <ImageSelector
                            value={getContent('historia.mainImage', '/images/empresa/instalaciones-planta.jpg')}
                            onChange={(url) => updateContent('historia.mainImage', url)}
                            label=""
                            placeholder="Foto histórica, fundación, evolución"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Timeline Visual (Opcional)</label>
                          <ImageSelector
                            value={getContent('historia.timelineImage')}
                            onChange={(url) => updateContent('historia.timelineImage', url)}
                            label=""
                            placeholder="Timeline de evolución de la empresa"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Capacidades y Equipo Técnico */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Capacidades y Equipo Humano</h4>
                          <p className="text-sm text-gray-600">Imágenes que muestran las capacidades técnicas</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Equipo Técnico Especializado</label>
                          <ImageSelector
                            value={getContent('capacidades.equipoTecnico', '/images/equipo/equipo-industrial-1.jpg')}
                            onChange={(url) => updateContent('capacidades.equipoTecnico', url)}
                            label=""
                            placeholder="Ingenieros y técnicos trabajando"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Proceso de Fabricación</label>
                          <ImageSelector
                            value={getContent('capacidades.procesoFabricacion', '/images/servicios/gestion-3.jpg')}
                            onChange={(url) => updateContent('capacidades.procesoFabricacion', url)}
                            label=""
                            placeholder="Personal en proceso de fabricación"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Maquinaria y Equipos</label>
                          <ImageSelector
                            value={getContent('capacidades.maquinariaEquipos', '/images/general/industria-general.jpg')}
                            onChange={(url) => updateContent('capacidades.maquinariaEquipos', url)}
                            label=""
                            placeholder="Maquinaria industrial en operación"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Instalaciones de Producción</label>
                          <ImageSelector
                            value={getContent('capacidades.instalacionesProduccion', '/images/empresa/instalaciones-planta.jpg')}
                            onChange={(url) => updateContent('capacidades.instalacionesProduccion', url)}
                            label=""
                            placeholder="Vista general de las plantas"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Instalaciones y Ubicaciones */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Instalaciones y Ubicaciones</h4>
                          <p className="text-sm text-gray-600">Fotos de las plantas principales de MEISA</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Planta Popayán</label>
                          <ImageSelector
                            value={getContent('instalaciones.plantaPopayan', '/images/empresa/instalaciones-planta.jpg')}
                            onChange={(url) => updateContent('instalaciones.plantaPopayan', url)}
                            label=""
                            placeholder="Vista de la planta principal en Popayán"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Planta Jamundí</label>
                          <ImageSelector
                            value={getContent('instalaciones.plantaJamundi', '/images/general/industria-general.jpg')}
                            onChange={(url) => updateContent('instalaciones.plantaJamundi', url)}
                            label=""
                            placeholder="Vista de la planta en Jamundí"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Vista Panorámica</label>
                          <ImageSelector
                            value={getContent('instalaciones.vistaPanoramica', '/images/servicios/gestion-4.jpg')}
                            onChange={(url) => updateContent('instalaciones.vistaPanoramica', url)}
                            label=""
                            placeholder="Vista aérea o panorámica"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Logros y Reconocimientos */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Award className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Logros y Reconocimientos</h4>
                          <p className="text-sm text-gray-600">Certificaciones, premios y reconocimientos</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Certificaciones Obtenidas</label>
                          <ImageSelector
                            value={getContent('logros.certificaciones', '/images/certificaciones/iso-certificacion.jpg')}
                            onChange={(url) => updateContent('logros.certificaciones', url)}
                            label=""
                            placeholder="Certificados y reconocimientos"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Premios y Reconocimientos</label>
                          <ImageSelector
                            value={getContent('logros.premios', '/images/certificaciones/certificacion-calidad-1.jpg')}
                            onChange={(url) => updateContent('logros.premios', url)}
                            label=""
                            placeholder="Premios y galardones recibidos"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Biblioteca multimedia completa */}
              <Card className="shadow-sm">
                <CardHeader className="bg-green-50 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Image className="w-5 h-5 text-green-600" />
                    Biblioteca Multimedia
                  </CardTitle>
                  <CardDescription>
                    Gestiona todas las imágenes y archivos multimedia del sitio
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <MediaManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="bg-purple-50 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    Optimización SEO
                  </CardTitle>
                  <CardDescription>
                    Metadatos para motores de búsqueda y redes sociales
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-700">
                      Meta Título (SEO)
                    </Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="Título que aparece en Google"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.metaTitle.length} / 60 caracteres recomendados
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="metaDescription" className="text-sm font-medium text-gray-700">
                      Meta Descripción (SEO)
                    </Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="Descripción que aparece en Google"
                      rows={3}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.metaDescription.length} / 160 caracteres recomendados
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}
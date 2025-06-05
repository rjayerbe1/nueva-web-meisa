'use client'

import { useState } from 'react'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Trash2, 
  Save,
  Upload,
  Image as ImageIcon,
  BarChart3,
  FileText,
  Users,
  HelpCircle,
  Download,
  Video
} from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface ServiceDetailEditorProps {
  service: any
  onSave: (data: any) => void
  loading?: boolean
}

export default function ServiceDetailEditor({ service, onSave, loading }: ServiceDetailEditorProps) {
  // Helper function to ensure structured sections have correct format
  const initializeSection = (data: any, defaultTitle: string = '') => {
    if (!data) return { titulo: defaultTitle, items: [] }
    
    // If already in correct format
    if (data.titulo !== undefined && Array.isArray(data.items)) {
      return data
    }
    
    // If it's an array, need to check what type of array
    if (Array.isArray(data)) {
      const cleanItems = data.map(item => {
        if (typeof item === 'string') return item
        if (typeof item === 'object' && item.titulo) return item.titulo
        if (typeof item === 'object' && item.nombre) return item.nombre
        return String(item)
      }).filter(item => item && item !== '[object Object]' && item !== 'undefined')
      
      return { titulo: defaultTitle, items: cleanItems }
    }
    
    // If it's a single string
    if (typeof data === 'string') {
      return { titulo: defaultTitle, items: [data] }
    }
    
    // Default fallback
    return { titulo: defaultTitle, items: [] }
  }

  const [formData, setFormData] = useState({
    ...service,
    capacidades: Array.isArray(service.capacidades) ? service.capacidades : [],
    tecnologias: initializeSection(service.tecnologias, 'Tecnología de Vanguardia'),
    normativas: initializeSection(service.normativas, 'Cumplimiento Normativo Integral'),
    ventajas: initializeSection(service.ventajas, 'Valor Agregado MEISA'),
    equipamiento: initializeSection(service.equipamiento, 'Equipamiento Especializado'),
    certificaciones: initializeSection(service.certificaciones, 'Certificaciones de Calidad'),
    metodologia: initializeSection(service.metodologia, 'Metodología de Trabajo'),
    equipos: initializeSection(service.equipos, 'Equipos Especializados'),
    seguridad: initializeSection(service.seguridad, 'Seguridad Industrial'),
    imagenesGaleria: Array.isArray(service.imagenesGaleria) ? service.imagenesGaleria : [],
    estadisticas: Array.isArray(service.estadisticas) ? service.estadisticas : [
      { label: 'Años de experiencia', value: '25+', icon: 'Clock' },
      { label: 'Proyectos completados', value: '500+', icon: 'Building2' }
    ],
    procesoPasos: Array.isArray(service.procesoPasos) ? service.procesoPasos : [],
    competencias: Array.isArray(service.competencias) ? service.competencias : [],
    tablaComparativa: service.tablaComparativa || { headers: [], rows: [] },
    casosExito: Array.isArray(service.casosExito) ? service.casosExito : [],
    testimonios: Array.isArray(service.testimonios) ? service.testimonios : [],
    preguntasFrecuentes: Array.isArray(service.preguntasFrecuentes) ? service.preguntasFrecuentes : [],
    recursosDescargables: Array.isArray(service.recursosDescargables) ? service.recursosDescargables : []
  })


  const handleArrayFieldAdd = (field: string, newItem: any) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), newItem]
    })
  }

  const handleArrayFieldRemove = (field: string, index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_: any, i: number) => i !== index)
    })
  }

  const handleArrayFieldUpdate = (field: string, index: number, value: any) => {
    const updated = [...formData[field]]
    updated[index] = value
    setFormData({
      ...formData,
      [field]: updated
    })
  }


  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-8 w-full text-xs">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="capacidades">Capacidades</TabsTrigger>
          <TabsTrigger value="secciones">Secciones</TabsTrigger>
          <TabsTrigger value="galeria">Galería</TabsTrigger>
          <TabsTrigger value="estadisticas">Stats</TabsTrigger>
          <TabsTrigger value="proceso">Proceso</TabsTrigger>
          <TabsTrigger value="casos">Casos</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título del Servicio</Label>
                <Input
                  value={formData.titulo || formData.nombre}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ej: Consultoría en Diseño Estructural"
                />
              </div>

              <div>
                <Label>Subtítulo</Label>
                <Input
                  value={formData.subtitulo || ''}
                  onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                  placeholder="Ej: Soluciones innovadoras para estructuras complejas"
                />
              </div>

              <div>
                <Label>Descripción Completa</Label>
                <Textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={6}
                  placeholder="Descripción detallada del servicio..."
                />
              </div>

              <div>
                <Label>Video Demostrativo (URL)</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.videoDemostrativo || ''}
                    onChange={(e) => setFormData({ ...formData, videoDemostrativo: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <Button variant="outline" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capacidades Tab */}
        <TabsContent value="capacidades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Capacidades Principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.capacidades?.map((capacidad: string, index: number) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Capacidad {index + 1}</Label>
                    <Input
                      value={capacidad}
                      onChange={(e) => {
                        const updated = [...(formData.capacidades || [])]
                        updated[index] = e.target.value
                        setFormData({ ...formData, capacidades: updated })
                      }}
                      placeholder="Ej: Análisis estructural avanzado con software especializado"
                    />
                  </div>
                  <Button
                    onClick={() => handleArrayFieldRemove('capacidades', index)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => handleArrayFieldAdd('capacidades', '')}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Capacidad
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Secciones Estructuradas Tab */}
        <TabsContent value="secciones" className="space-y-6">
          {/* Tecnologías */}
          <Card>
            <CardHeader>
              <CardTitle>Tecnologías</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título de la Sección</Label>
                <Input
                  value={formData.tecnologias?.titulo || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tecnologias: { 
                      ...formData.tecnologias, 
                      titulo: e.target.value,
                      items: formData.tecnologias?.items || []
                    }
                  })}
                  placeholder="Ej: Tecnología de Vanguardia"
                />
              </div>
              
              {formData.tecnologias?.items?.map((item: string, index: number) => (
                <div key={index} className="flex gap-4 items-center">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...(formData.tecnologias?.items || [])]
                      updated[index] = e.target.value
                      setFormData({ 
                        ...formData, 
                        tecnologias: { 
                          ...formData.tecnologias, 
                          items: updated 
                        }
                      })
                    }}
                    placeholder="Ej: Tecnología BIM integrada"
                  />
                  <Button
                    onClick={() => {
                      const updated = (formData.tecnologias?.items || []).filter((_: any, i: number) => i !== index)
                      setFormData({ 
                        ...formData, 
                        tecnologias: { 
                          ...formData.tecnologias, 
                          items: updated 
                        }
                      })
                    }}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const items = formData.tecnologias?.items || []
                  setFormData({ 
                    ...formData, 
                    tecnologias: { 
                      titulo: formData.tecnologias?.titulo || 'Tecnología de Vanguardia',
                      items: [...items, '']
                    }
                  })
                }}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Tecnología
              </Button>
            </CardContent>
          </Card>

          {/* Normativas */}
          <Card>
            <CardHeader>
              <CardTitle>Normativas y Estándares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título de la Sección</Label>
                <Input
                  value={formData.normativas?.titulo || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    normativas: { 
                      ...formData.normativas, 
                      titulo: e.target.value,
                      items: formData.normativas?.items || []
                    }
                  })}
                  placeholder="Ej: Cumplimiento Normativo Integral"
                />
              </div>
              
              {formData.normativas?.items?.map((item: string, index: number) => (
                <div key={index} className="flex gap-4 items-center">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...(formData.normativas?.items || [])]
                      updated[index] = e.target.value
                      setFormData({ 
                        ...formData, 
                        normativas: { 
                          ...formData.normativas, 
                          items: updated 
                        }
                      })
                    }}
                    placeholder="Ej: NSR-10 - Reglamento Colombiano de Construcción Sismo Resistente"
                  />
                  <Button
                    onClick={() => {
                      const updated = (formData.normativas?.items || []).filter((_: any, i: number) => i !== index)
                      setFormData({ 
                        ...formData, 
                        normativas: { 
                          ...formData.normativas, 
                          items: updated 
                        }
                      })
                    }}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const items = formData.normativas?.items || []
                  setFormData({ 
                    ...formData, 
                    normativas: { 
                      titulo: formData.normativas?.titulo || 'Cumplimiento Normativo Integral',
                      items: [...items, '']
                    }
                  })
                }}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Normativa
              </Button>
            </CardContent>
          </Card>

          {/* Ventajas */}
          <Card>
            <CardHeader>
              <CardTitle>Valor Agregado / Ventajas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título de la Sección</Label>
                <Input
                  value={formData.ventajas?.titulo || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    ventajas: { 
                      ...formData.ventajas, 
                      titulo: e.target.value,
                      items: formData.ventajas?.items || []
                    }
                  })}
                  placeholder="Ej: Valor Agregado MEISA"
                />
              </div>
              
              {formData.ventajas?.items?.map((item: string, index: number) => (
                <div key={index} className="flex gap-4 items-center">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...(formData.ventajas?.items || [])]
                      updated[index] = e.target.value
                      setFormData({ 
                        ...formData, 
                        ventajas: { 
                          ...formData.ventajas, 
                          items: updated 
                        }
                      })
                    }}
                    placeholder="Ej: Tecnología BIM integrada"
                  />
                  <Button
                    onClick={() => {
                      const updated = (formData.ventajas?.items || []).filter((_: any, i: number) => i !== index)
                      setFormData({ 
                        ...formData, 
                        ventajas: { 
                          ...formData.ventajas, 
                          items: updated 
                        }
                      })
                    }}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const items = formData.ventajas?.items || []
                  setFormData({ 
                    ...formData, 
                    ventajas: { 
                      titulo: formData.ventajas?.titulo || 'Valor Agregado MEISA',
                      items: [...items, '']
                    }
                  })
                }}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Ventaja
              </Button>
            </CardContent>
          </Card>

          {/* Equipamiento */}
          <Card>
            <CardHeader>
              <CardTitle>Equipamiento Especializado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título de la Sección</Label>
                <Input
                  value={formData.equipamiento?.titulo || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    equipamiento: { 
                      ...formData.equipamiento, 
                      titulo: e.target.value,
                      items: formData.equipamiento?.items || []
                    }
                  })}
                  placeholder="Ej: Equipamiento Especializado"
                />
              </div>
              
              {formData.equipamiento?.items?.map((item: string, index: number) => (
                <div key={index} className="flex gap-4 items-center">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...(formData.equipamiento?.items || [])]
                      updated[index] = e.target.value
                      setFormData({ 
                        ...formData, 
                        equipamiento: { 
                          ...formData.equipamiento, 
                          items: updated 
                        }
                      })
                    }}
                    placeholder="Ej: Grúas telescópicas de 200 toneladas"
                  />
                  <Button
                    onClick={() => {
                      const updated = (formData.equipamiento?.items || []).filter((_: any, i: number) => i !== index)
                      setFormData({ 
                        ...formData, 
                        equipamiento: { 
                          ...formData.equipamiento, 
                          items: updated 
                        }
                      })
                    }}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const items = formData.equipamiento?.items || []
                  setFormData({ 
                    ...formData, 
                    equipamiento: { 
                      titulo: formData.equipamiento?.titulo || 'Equipamiento Especializado',
                      items: [...items, '']
                    }
                  })
                }}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Equipo
              </Button>
            </CardContent>
          </Card>

          {/* Certificaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Certificaciones de Calidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título de la Sección</Label>
                <Input
                  value={formData.certificaciones?.titulo || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    certificaciones: { 
                      ...formData.certificaciones, 
                      titulo: e.target.value,
                      items: formData.certificaciones?.items || []
                    }
                  })}
                  placeholder="Ej: Certificaciones y Acreditaciones"
                />
              </div>
              
              {formData.certificaciones?.items?.map((item: string, index: number) => (
                <div key={index} className="flex gap-4 items-center">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...(formData.certificaciones?.items || [])]
                      updated[index] = e.target.value
                      setFormData({ 
                        ...formData, 
                        certificaciones: { 
                          ...formData.certificaciones, 
                          items: updated 
                        }
                      })
                    }}
                    placeholder="Ej: ISO 9001:2015"
                  />
                  <Button
                    onClick={() => {
                      const updated = (formData.certificaciones?.items || []).filter((_: any, i: number) => i !== index)
                      setFormData({ 
                        ...formData, 
                        certificaciones: { 
                          ...formData.certificaciones, 
                          items: updated 
                        }
                      })
                    }}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const items = formData.certificaciones?.items || []
                  setFormData({ 
                    ...formData, 
                    certificaciones: { 
                      titulo: formData.certificaciones?.titulo || 'Certificaciones de Calidad',
                      items: [...items, '']
                    }
                  })
                }}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Certificación
              </Button>
            </CardContent>
          </Card>

          {/* Metodología */}
          <Card>
            <CardHeader>
              <CardTitle>Metodología de Trabajo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título de la Sección</Label>
                <Input
                  value={formData.metodologia?.titulo || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    metodologia: { 
                      ...formData.metodologia, 
                      titulo: e.target.value,
                      items: formData.metodologia?.items || []
                    }
                  })}
                  placeholder="Ej: Metodología de Trabajo"
                />
              </div>
              
              {formData.metodologia?.items?.map((item: string, index: number) => (
                <div key={index} className="flex gap-4 items-center">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...(formData.metodologia?.items || [])]
                      updated[index] = e.target.value
                      setFormData({ 
                        ...formData, 
                        metodologia: { 
                          ...formData.metodologia, 
                          items: updated 
                        }
                      })
                    }}
                    placeholder="Ej: Fase 1: Análisis y Planificación"
                  />
                  <Button
                    onClick={() => {
                      const updated = (formData.metodologia?.items || []).filter((_: any, i: number) => i !== index)
                      setFormData({ 
                        ...formData, 
                        metodologia: { 
                          ...formData.metodologia, 
                          items: updated 
                        }
                      })
                    }}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const items = formData.metodologia?.items || []
                  setFormData({ 
                    ...formData, 
                    metodologia: { 
                      titulo: formData.metodologia?.titulo || 'Metodología de Trabajo',
                      items: [...items, '']
                    }
                  })
                }}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Fase
              </Button>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle>Protocolos de Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título de la Sección</Label>
                <Input
                  value={formData.seguridad?.titulo || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    seguridad: { 
                      ...formData.seguridad, 
                      titulo: e.target.value,
                      items: formData.seguridad?.items || []
                    }
                  })}
                  placeholder="Ej: Seguridad Industrial"
                />
              </div>
              
              {formData.seguridad?.items?.map((item: string, index: number) => (
                <div key={index} className="flex gap-4 items-center">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...(formData.seguridad?.items || [])]
                      updated[index] = e.target.value
                      setFormData({ 
                        ...formData, 
                        seguridad: { 
                          ...formData.seguridad, 
                          items: updated 
                        }
                      })
                    }}
                    placeholder="Ej: Uso obligatorio de EPP certificado"
                  />
                  <Button
                    onClick={() => {
                      const updated = (formData.seguridad?.items || []).filter((_: any, i: number) => i !== index)
                      setFormData({ 
                        ...formData, 
                        seguridad: { 
                          ...formData.seguridad, 
                          items: updated 
                        }
                      })
                    }}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const items = formData.seguridad?.items || []
                  setFormData({ 
                    ...formData, 
                    seguridad: { 
                      titulo: formData.seguridad?.titulo || 'Seguridad Industrial',
                      items: [...items, '']
                    }
                  })
                }}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Protocolo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Galería Tab */}
        <TabsContent value="galeria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Galería de Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {formData.imagenesGaleria?.map((imagen: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={imagen}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleArrayFieldRemove('imagenesGaleria', index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <ImageUploader
                images={formData.imagenesGaleria || []}
                onUpload={(urls) => handleArrayFieldAdd('imagenesGaleria', urls[0])}
                maxFiles={1}
                label="Agregar Imagen a Galería"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estadísticas Tab */}
        <TabsContent value="estadisticas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas Clave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.estadisticas?.map((stat: any, index: number) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Etiqueta</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...formData.estadisticas]
                        updated[index] = { ...stat, label: e.target.value }
                        setFormData({ ...formData, estadisticas: updated })
                      }}
                      placeholder="Ej: Años de experiencia"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Valor</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...formData.estadisticas]
                        updated[index] = { ...stat, value: e.target.value }
                        setFormData({ ...formData, estadisticas: updated })
                      }}
                      placeholder="Ej: 25+"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Icono</Label>
                    <Input
                      value={stat.icon}
                      onChange={(e) => {
                        const updated = [...formData.estadisticas]
                        updated[index] = { ...stat, icon: e.target.value }
                        setFormData({ ...formData, estadisticas: updated })
                      }}
                      placeholder="Ej: Clock"
                    />
                  </div>
                  <Button
                    onClick={() => handleArrayFieldRemove('estadisticas', index)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => handleArrayFieldAdd('estadisticas', { label: '', value: '', icon: 'BarChart3' })}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Estadística
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Competencias (para gráfico radar)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.competencias?.map((comp: any, index: number) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Competencia</Label>
                    <Input
                      value={comp.label}
                      onChange={(e) => {
                        const updated = [...formData.competencias]
                        updated[index] = { ...comp, label: e.target.value }
                        setFormData({ ...formData, competencias: updated })
                      }}
                      placeholder="Ej: Diseño BIM"
                    />
                  </div>
                  <div className="w-32">
                    <Label>Nivel (0-100)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={comp.value}
                      onChange={(e) => {
                        const updated = [...formData.competencias]
                        updated[index] = { ...comp, value: parseInt(e.target.value) }
                        setFormData({ ...formData, competencias: updated })
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => handleArrayFieldRemove('competencias', index)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => handleArrayFieldAdd('competencias', { label: '', value: 50 })}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Competencia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proceso Tab */}
        <TabsContent value="proceso" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pasos del Proceso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.procesoPasos?.map((paso: any, index: number) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label>Título del Paso</Label>
                      <Input
                        value={paso.title}
                        onChange={(e) => {
                          const updated = [...formData.procesoPasos]
                          updated[index] = { ...paso, title: e.target.value }
                          setFormData({ ...formData, procesoPasos: updated })
                        }}
                        placeholder="Ej: Análisis inicial"
                      />
                    </div>
                    <div className="w-32">
                      <Label>Icono</Label>
                      <Input
                        value={paso.icon}
                        onChange={(e) => {
                          const updated = [...formData.procesoPasos]
                          updated[index] = { ...paso, icon: e.target.value }
                          setFormData({ ...formData, procesoPasos: updated })
                        }}
                        placeholder="Ej: Search"
                      />
                    </div>
                    <Button
                      onClick={() => handleArrayFieldRemove('procesoPasos', index)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={paso.description}
                      onChange={(e) => {
                        const updated = [...formData.procesoPasos]
                        updated[index] = { ...paso, description: e.target.value }
                        setFormData({ ...formData, procesoPasos: updated })
                      }}
                      placeholder="Descripción del paso..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button
                onClick={() => handleArrayFieldAdd('procesoPasos', { title: '', description: '', icon: 'Target' })}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Paso
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Casos de Éxito Tab */}
        <TabsContent value="casos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Casos de Éxito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.casosExito?.map((caso: any, index: number) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label>Título del Caso</Label>
                      <Input
                        value={caso.titulo}
                        onChange={(e) => {
                          const updated = [...formData.casosExito]
                          updated[index] = { ...caso, titulo: e.target.value }
                          setFormData({ ...formData, casosExito: updated })
                        }}
                        placeholder="Ej: Centro Comercial Único"
                      />
                    </div>
                    <Button
                      onClick={() => handleArrayFieldRemove('casosExito', index)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={caso.descripcion}
                      onChange={(e) => {
                        const updated = [...formData.casosExito]
                        updated[index] = { ...caso, descripcion: e.target.value }
                        setFormData({ ...formData, casosExito: updated })
                      }}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Métrica 1</Label>
                      <Input
                        value={caso.metrica1}
                        onChange={(e) => {
                          const updated = [...formData.casosExito]
                          updated[index] = { ...caso, metrica1: e.target.value }
                          setFormData({ ...formData, casosExito: updated })
                        }}
                        placeholder="Ej: 5000 m²"
                      />
                    </div>
                    <div>
                      <Label>Métrica 2</Label>
                      <Input
                        value={caso.metrica2}
                        onChange={(e) => {
                          const updated = [...formData.casosExito]
                          updated[index] = { ...caso, metrica2: e.target.value }
                          setFormData({ ...formData, casosExito: updated })
                        }}
                        placeholder="Ej: 12 meses"
                      />
                    </div>
                    <div>
                      <Label>Métrica 3</Label>
                      <Input
                        value={caso.metrica3}
                        onChange={(e) => {
                          const updated = [...formData.casosExito]
                          updated[index] = { ...caso, metrica3: e.target.value }
                          setFormData({ ...formData, casosExito: updated })
                        }}
                        placeholder="Ej: $2M USD"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                onClick={() => handleArrayFieldAdd('casosExito', { 
                  titulo: '', 
                  descripcion: '', 
                  metrica1: '', 
                  metrica2: '', 
                  metrica3: '' 
                })}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Caso de Éxito
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testimonios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.testimonios?.map((testimonio: any, index: number) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label>Cliente</Label>
                      <Input
                        value={testimonio.cliente}
                        onChange={(e) => {
                          const updated = [...formData.testimonios]
                          updated[index] = { ...testimonio, cliente: e.target.value }
                          setFormData({ ...formData, testimonios: updated })
                        }}
                        placeholder="Nombre del cliente"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Cargo</Label>
                      <Input
                        value={testimonio.cargo}
                        onChange={(e) => {
                          const updated = [...formData.testimonios]
                          updated[index] = { ...testimonio, cargo: e.target.value }
                          setFormData({ ...formData, testimonios: updated })
                        }}
                        placeholder="Cargo del cliente"
                      />
                    </div>
                    <Button
                      onClick={() => handleArrayFieldRemove('testimonios', index)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Testimonio</Label>
                    <Textarea
                      value={testimonio.texto}
                      onChange={(e) => {
                        const updated = [...formData.testimonios]
                        updated[index] = { ...testimonio, texto: e.target.value }
                        setFormData({ ...formData, testimonios: updated })
                      }}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button
                onClick={() => handleArrayFieldAdd('testimonios', { cliente: '', cargo: '', texto: '' })}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Testimonio
              </Button>
            </CardContent>
          </Card>
        </TabsContent>


        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimización SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Slug (URL)*</Label>
                <Input
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="consultoria-diseno-estructural"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL amigable: /servicios/{formData.slug || 'slug-del-servicio'}
                </p>
              </div>

              <div>
                <Label>Meta Título</Label>
                <Input
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Título que aparecerá en Google"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Longitud recomendada: 50-60 caracteres ({(formData.metaTitle || '').length}/60)
                </p>
              </div>

              <div>
                <Label>Meta Descripción</Label>
                <Textarea
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Descripción que aparecerá en los resultados de búsqueda"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Longitud recomendada: 150-160 caracteres ({(formData.metaDescription || '').length}/160)
                </p>
              </div>

              <div>
                <Label>Título de Expertise</Label>
                <Input
                  value={formData.expertiseTitulo || ''}
                  onChange={(e) => setFormData({ ...formData, expertiseTitulo: e.target.value })}
                  placeholder="Ej: Nuestra Experiencia"
                />
              </div>

              <div>
                <Label>Descripción de Expertise</Label>
                <Textarea
                  value={formData.expertiseDescripcion || ''}
                  onChange={(e) => setFormData({ ...formData, expertiseDescripcion: e.target.value })}
                  rows={3}
                  placeholder="Descripción de la experiencia y capacidades..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 mt-6">
        <Button 
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

    </>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Eye, RotateCcw } from 'lucide-react'

interface EditPageFormProps {
  pagina: {
    id: string
    slug: string
    titulo: string
    subtitulo: string | null
    metaTitle: string | null
    metaDescription: string | null
    contenido: any
  }
}

export default function EditPageForm({ pagina }: EditPageFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: pagina.titulo,
    subtitulo: pagina.subtitulo || '',
    metaTitle: pagina.metaTitle || '',
    metaDescription: pagina.metaDescription || '',
    contenido: pagina.contenido || {}
  })

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

  const getContent = (path: string, defaultValue: string = '') => {
    const keys = path.split('.')
    let current = formData.contenido

    for (const key of keys) {
      current = current?.[key]
      if (current === undefined) return defaultValue
    }

    return current || defaultValue
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

      router.refresh()
      alert('Página actualizada exitosamente')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar la página')
    } finally {
      setIsLoading(false)
    }
  }

  const resetToDefault = () => {
    setFormData({
      titulo: pagina.titulo,
      subtitulo: pagina.subtitulo || '',
      metaTitle: pagina.metaTitle || '',
      metaDescription: pagina.metaDescription || '',
      contenido: pagina.contenido || {}
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="meta">SEO y Metadatos</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {/* Sección Hero */}
          <Card>
            <CardHeader>
              <CardTitle>Sección Principal (Hero)</CardTitle>
              <CardDescription>
                Contenido principal que aparece en la parte superior de la página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">Título Principal</Label>
                <Input
                  id="heroTitle"
                  value={getContent('heroTitle')}
                  onChange={(e) => updateContent('heroTitle', e.target.value)}
                  placeholder="Título principal de la página"
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitle">Subtítulo</Label>
                <Textarea
                  id="heroSubtitle"
                  value={getContent('heroSubtitle')}
                  onChange={(e) => updateContent('heroSubtitle', e.target.value)}
                  placeholder="Descripción principal de la página"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Secciones específicas por página */}
          {pagina.slug === 'calidad' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Textos del Hero</CardTitle>
                  <CardDescription>Elementos específicos del banner principal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tag del Hero</Label>
                    <Input
                      value={getContent('heroTag')}
                      onChange={(e) => updateContent('heroTag', e.target.value)}
                      placeholder="CALIDAD Y CERTIFICACIONES"
                    />
                  </div>
                  <div>
                    <Label>Highlight del Título</Label>
                    <Input
                      value={getContent('heroTitleHighlight')}
                      onChange={(e) => updateContent('heroTitleHighlight', e.target.value)}
                      placeholder="Excelencia"
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 1</Label>
                    <Input
                      value={getContent('heroCta1')}
                      onChange={(e) => updateContent('heroCta1', e.target.value)}
                      placeholder="Solicitar Certificaciones"
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 2</Label>
                    <Input
                      value={getContent('heroCta2')}
                      onChange={(e) => updateContent('heroCta2', e.target.value)}
                      placeholder="Ver Proyectos Certificados"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Proceso Integral</CardTitle>
                  <CardDescription>Sección después del hero que describe el sistema integral</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={getContent('procesoIntegral.title')}
                      onChange={(e) => updateContent('procesoIntegral.title', e.target.value)}
                      placeholder="Sistema de Gestión Integral"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('procesoIntegral.subtitle')}
                      onChange={(e) => updateContent('procesoIntegral.subtitle', e.target.value)}
                      placeholder="Descripción del proceso integral"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Componentes SIG</CardTitle>
                  <CardDescription>Los 4 pilares del Sistema Integrado de Gestión</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Componente {index + 1}</h4>
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={getContent(`sigComponents.${index}.title`)}
                          onChange={(e) => updateContent(`sigComponents.${index}.title`, e.target.value)}
                          placeholder={`Título del componente ${index + 1}`}
                        />
                      </div>
                      <div>
                        <Label>Descripción</Label>
                        <Textarea
                          value={getContent(`sigComponents.${index}.description`)}
                          onChange={(e) => updateContent(`sigComponents.${index}.description`, e.target.value)}
                          placeholder={`Descripción del componente ${index + 1}`}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sistema Integrado de Gestión (SIG)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.sig.title')}
                      onChange={(e) => updateContent('sections.sig.title', e.target.value)}
                      placeholder="Sistema Integrado de Gestión (SIG)"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.sig.subtitle')}
                      onChange={(e) => updateContent('sections.sig.subtitle', e.target.value)}
                      placeholder="Descripción de la sección"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Políticas Corporativas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.politicas.title')}
                      onChange={(e) => updateContent('sections.politicas.title', e.target.value)}
                      placeholder="Políticas Corporativas"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.politicas.subtitle')}
                      onChange={(e) => updateContent('sections.politicas.subtitle', e.target.value)}
                      placeholder="Descripción de las políticas"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cumplimiento Normativo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.cumplimiento.title')}
                      onChange={(e) => updateContent('sections.cumplimiento.title', e.target.value)}
                      placeholder="Cumplimiento Normativo"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.cumplimiento.subtitle')}
                      onChange={(e) => updateContent('sections.cumplimiento.subtitle', e.target.value)}
                      placeholder="Descripción del cumplimiento normativo"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Control de Calidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.controlcalidad.title')}
                      onChange={(e) => updateContent('sections.controlcalidad.title', e.target.value)}
                      placeholder="Control de Calidad"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.controlcalidad.subtitle')}
                      onChange={(e) => updateContent('sections.controlcalidad.subtitle', e.target.value)}
                      placeholder="Descripción del control de calidad"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Políticas Corporativas</CardTitle>
                  <CardDescription>Las 4 políticas principales de la empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Política {index + 1}</h4>
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={getContent(`policies.${index}.title`)}
                          onChange={(e) => updateContent(`policies.${index}.title`, e.target.value)}
                          placeholder={`Título de la política ${index + 1}`}
                        />
                      </div>
                      <div>
                        <Label>Descripción</Label>
                        <Textarea
                          value={getContent(`policies.${index}.description`)}
                          onChange={(e) => updateContent(`policies.${index}.description`, e.target.value)}
                          placeholder={`Descripción de la política ${index + 1}`}
                          rows={2}
                        />
                      </div>
                      {[0, 1, 2, 3, 4].map((commitmentIndex) => (
                        <div key={commitmentIndex}>
                          <Label>Compromiso {commitmentIndex + 1}</Label>
                          <Input
                            value={getContent(`policies.${index}.commitments.${commitmentIndex}`)}
                            onChange={(e) => updateContent(`policies.${index}.commitments.${commitmentIndex}`, e.target.value)}
                            placeholder={`Compromiso ${commitmentIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Standards y Normas</CardTitle>
                  <CardDescription>Estándares de cumplimiento normativo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2].map((categoryIndex) => (
                    <div key={categoryIndex} className="border p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Categoría {categoryIndex + 1}</h4>
                      <div>
                        <Label>Nombre de Categoría</Label>
                        <Input
                          value={getContent(`standards.${categoryIndex}.category`)}
                          onChange={(e) => updateContent(`standards.${categoryIndex}.category`, e.target.value)}
                          placeholder={`Categoría ${categoryIndex + 1}`}
                        />
                      </div>
                      {[0, 1, 2, 3].map((itemIndex) => (
                        <div key={itemIndex} className="ml-4 space-y-2">
                          <div>
                            <Label>Item {itemIndex + 1} - Nombre</Label>
                            <Input
                              value={getContent(`standards.${categoryIndex}.items.${itemIndex}.name`)}
                              onChange={(e) => updateContent(`standards.${categoryIndex}.items.${itemIndex}.name`, e.target.value)}
                              placeholder={`Nombre del item ${itemIndex + 1}`}
                            />
                          </div>
                          <div>
                            <Label>Item {itemIndex + 1} - Descripción</Label>
                            <Input
                              value={getContent(`standards.${categoryIndex}.items.${itemIndex}.description`)}
                              onChange={(e) => updateContent(`standards.${categoryIndex}.items.${itemIndex}.description`, e.target.value)}
                              placeholder={`Descripción del item ${itemIndex + 1}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Control de Calidad</CardTitle>
                  <CardDescription>Etapas del control de calidad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2].map((stageIndex) => (
                    <div key={stageIndex} className="border p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Etapa {stageIndex + 1}</h4>
                      <div>
                        <Label>Nombre de Etapa</Label>
                        <Input
                          value={getContent(`qualityControl.${stageIndex}.stage`)}
                          onChange={(e) => updateContent(`qualityControl.${stageIndex}.stage`, e.target.value)}
                          placeholder={`Etapa ${stageIndex + 1}`}
                        />
                      </div>
                      {Array.from({ length: stageIndex === 1 ? 5 : 4 }).map((_, processIndex) => (
                        <div key={processIndex}>
                          <Label>Proceso {processIndex + 1}</Label>
                          <Input
                            value={getContent(`qualityControl.${stageIndex}.processes.${processIndex}`)}
                            onChange={(e) => updateContent(`qualityControl.${stageIndex}.processes.${processIndex}`, e.target.value)}
                            placeholder={`Proceso ${processIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sección CTA Final</CardTitle>
                  <CardDescription>Call to action al final de la página</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={getContent('cta.title')}
                      onChange={(e) => updateContent('cta.title', e.target.value)}
                      placeholder="Calidad que Trasciende en cada Proyecto"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('cta.subtitle')}
                      onChange={(e) => updateContent('cta.subtitle', e.target.value)}
                      placeholder="Descripción del llamado a la acción"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 1</Label>
                    <Input
                      value={getContent('ctaCta1')}
                      onChange={(e) => updateContent('ctaCta1', e.target.value)}
                      placeholder="Solicitar Certificaciones"
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 2</Label>
                    <Input
                      value={getContent('ctaCta2')}
                      onChange={(e) => updateContent('ctaCta2', e.target.value)}
                      placeholder="Ver Proyectos Certificados"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {pagina.slug === 'tecnologia' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Textos del Hero</CardTitle>
                  <CardDescription>Elementos específicos del banner principal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tag del Hero</Label>
                    <Input
                      value={getContent('heroTag')}
                      onChange={(e) => updateContent('heroTag', e.target.value)}
                      placeholder="TECNOLOGÍA E INNOVACIÓN"
                    />
                  </div>
                  <div>
                    <Label>Highlight del Título</Label>
                    <Input
                      value={getContent('heroTitleHighlight')}
                      onChange={(e) => updateContent('heroTitleHighlight', e.target.value)}
                      placeholder="de Vanguardia"
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 1</Label>
                    <Input
                      value={getContent('heroCta1')}
                      onChange={(e) => updateContent('heroCta1', e.target.value)}
                      placeholder="Solicitar Consultoría"
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 2</Label>
                    <Input
                      value={getContent('heroCta2')}
                      onChange={(e) => updateContent('heroCta2', e.target.value)}
                      placeholder="Ver Proyectos Realizados"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Proceso Tecnológico Integral</CardTitle>
                  <CardDescription>Sección después del hero que describe el proceso tecnológico</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={getContent('procesoIntegral.title')}
                      onChange={(e) => updateContent('procesoIntegral.title', e.target.value)}
                      placeholder="Proceso Tecnológico Integral"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('procesoIntegral.subtitle')}
                      onChange={(e) => updateContent('procesoIntegral.subtitle', e.target.value)}
                      placeholder="Descripción del proceso tecnológico"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fases del Proceso</CardTitle>
                  <CardDescription>Las 4 fases del proceso tecnológico</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Fase {index + 1}</h4>
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={getContent(`procesoFases.${index}.title`)}
                          onChange={(e) => updateContent(`procesoFases.${index}.title`, e.target.value)}
                          placeholder={`Título de la fase ${index + 1}`}
                        />
                      </div>
                      <div>
                        <Label>Descripción</Label>
                        <Input
                          value={getContent(`procesoFases.${index}.desc`)}
                          onChange={(e) => updateContent(`procesoFases.${index}.desc`, e.target.value)}
                          placeholder={`Descripción de la fase ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Software Tools</CardTitle>
                  <CardDescription>Herramientas de software especializadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Software {index + 1}</h4>
                      <div>
                        <Label>Nombre</Label>
                        <Input
                          value={getContent(`softwareTools.${index}.name`)}
                          onChange={(e) => updateContent(`softwareTools.${index}.name`, e.target.value)}
                          placeholder={`Nombre del software ${index + 1}`}
                        />
                      </div>
                      <div>
                        <Label>Descripción</Label>
                        <Textarea
                          value={getContent(`softwareTools.${index}.description`)}
                          onChange={(e) => updateContent(`softwareTools.${index}.description`, e.target.value)}
                          placeholder={`Descripción del software ${index + 1}`}
                          rows={2}
                        />
                      </div>
                      {[0, 1, 2, 3, 4].map((featureIndex) => (
                        <div key={featureIndex}>
                          <Label>Característica {featureIndex + 1}</Label>
                          <Input
                            value={getContent(`softwareTools.${index}.features.${featureIndex}`)}
                            onChange={(e) => updateContent(`softwareTools.${index}.features.${featureIndex}`, e.target.value)}
                            placeholder={`Característica ${featureIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipamiento Industrial</CardTitle>
                  <CardDescription>Maquinaria y equipos especializados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Equipo {index + 1}</h4>
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={getContent(`equipment.${index}.title`)}
                          onChange={(e) => updateContent(`equipment.${index}.title`, e.target.value)}
                          placeholder={`Título del equipo ${index + 1}`}
                        />
                      </div>
                      {[0, 1, 2, 3, 4].map((itemIndex) => (
                        <div key={itemIndex}>
                          <Label>Item {itemIndex + 1}</Label>
                          <Input
                            value={getContent(`equipment.${index}.items.${itemIndex}`)}
                            onChange={(e) => updateContent(`equipment.${index}.items.${itemIndex}`, e.target.value)}
                            placeholder={`Item ${itemIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Innovaciones</CardTitle>
                  <CardDescription>Tecnologías innovadoras implementadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1].map((index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Innovación {index + 1}</h4>
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={getContent(`innovations.${index}.title`)}
                          onChange={(e) => updateContent(`innovations.${index}.title`, e.target.value)}
                          placeholder={`Título de la innovación ${index + 1}`}
                        />
                      </div>
                      <div>
                        <Label>Descripción</Label>
                        <Textarea
                          value={getContent(`innovations.${index}.description`)}
                          onChange={(e) => updateContent(`innovations.${index}.description`, e.target.value)}
                          placeholder={`Descripción de la innovación ${index + 1}`}
                          rows={2}
                        />
                      </div>
                      {[0, 1, 2, 3, 4].map((benefitIndex) => (
                        <div key={benefitIndex}>
                          <Label>Beneficio {benefitIndex + 1}</Label>
                          <Input
                            value={getContent(`innovations.${index}.benefits.${benefitIndex}`)}
                            onChange={(e) => updateContent(`innovations.${index}.benefits.${benefitIndex}`, e.target.value)}
                            placeholder={`Beneficio ${benefitIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Software de Diseño e Ingeniería</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.softwarediseno.title')}
                      onChange={(e) => updateContent('sections.softwarediseno.title', e.target.value)}
                      placeholder="Software de Diseño e Ingeniería"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.softwarediseno.subtitle')}
                      onChange={(e) => updateContent('sections.softwarediseno.subtitle', e.target.value)}
                      placeholder="Descripción del software de diseño"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Software de Conexiones y Elementos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.softwareconexiones.title')}
                      onChange={(e) => updateContent('sections.softwareconexiones.title', e.target.value)}
                      placeholder="Software de Conexiones y Elementos"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.softwareconexiones.subtitle')}
                      onChange={(e) => updateContent('sections.softwareconexiones.subtitle', e.target.value)}
                      placeholder="Descripción del software de conexiones"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Software de Análisis Avanzado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.softwareanalisis.title')}
                      onChange={(e) => updateContent('sections.softwareanalisis.title', e.target.value)}
                      placeholder="Software de Análisis Avanzado"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.softwareanalisis.subtitle')}
                      onChange={(e) => updateContent('sections.softwareanalisis.subtitle', e.target.value)}
                      placeholder="Descripción del software de análisis"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Software de Gestión y Producción</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.gestionproduccion.title')}
                      onChange={(e) => updateContent('sections.gestionproduccion.title', e.target.value)}
                      placeholder="Software de Gestión y Producción"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.gestionproduccion.subtitle')}
                      onChange={(e) => updateContent('sections.gestionproduccion.subtitle', e.target.value)}
                      placeholder="Descripción del software de gestión"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipamiento Industrial</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.equipamiento.title')}
                      onChange={(e) => updateContent('sections.equipamiento.title', e.target.value)}
                      placeholder="Equipamiento Industrial"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.equipamiento.subtitle')}
                      onChange={(e) => updateContent('sections.equipamiento.subtitle', e.target.value)}
                      placeholder="Descripción del equipamiento"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Innovación en Procesos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.innovacion.title')}
                      onChange={(e) => updateContent('sections.innovacion.title', e.target.value)}
                      placeholder="Innovación en Procesos"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.innovacion.subtitle')}
                      onChange={(e) => updateContent('sections.innovacion.subtitle', e.target.value)}
                      placeholder="Descripción de la innovación"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sección CTA Final</CardTitle>
                  <CardDescription>Call to action al final de la página</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={getContent('cta.title')}
                      onChange={(e) => updateContent('cta.title', e.target.value)}
                      placeholder="Tecnología al Servicio de tus Proyectos"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('cta.subtitle')}
                      onChange={(e) => updateContent('cta.subtitle', e.target.value)}
                      placeholder="Descripción del llamado a la acción"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 1</Label>
                    <Input
                      value={getContent('ctaCta1')}
                      onChange={(e) => updateContent('ctaCta1', e.target.value)}
                      placeholder="Solicitar Consultoría"
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 2</Label>
                    <Input
                      value={getContent('ctaCta2')}
                      onChange={(e) => updateContent('ctaCta2', e.target.value)}
                      placeholder="Ver Proyectos Realizados"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {pagina.slug === 'empresa' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Textos del Hero</CardTitle>
                  <CardDescription>Elementos específicos del banner principal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tag del Hero</Label>
                    <Input
                      value={getContent('heroTag')}
                      onChange={(e) => updateContent('heroTag', e.target.value)}
                      placeholder="NUESTRA EMPRESA"
                    />
                  </div>
                  <div>
                    <Label>Highlight del Título</Label>
                    <Input
                      value={getContent('heroTitleHighlight')}
                      onChange={(e) => updateContent('heroTitleHighlight', e.target.value)}
                      placeholder="Líderes en Estructuras Metálicas"
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 1</Label>
                    <Input
                      value={getContent('heroCta1')}
                      onChange={(e) => updateContent('heroCta1', e.target.value)}
                      placeholder="Hablemos de tu Proyecto"
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 2</Label>
                    <Input
                      value={getContent('heroCta2')}
                      onChange={(e) => updateContent('heroCta2', e.target.value)}
                      placeholder="Ver Nuestros Proyectos"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>MEISA en Números</CardTitle>
                  <CardDescription>Sección después del hero con estadísticas principales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={getContent('numeros.title')}
                      onChange={(e) => updateContent('numeros.title', e.target.value)}
                      placeholder="MEISA en Números"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('numeros.subtitle')}
                      onChange={(e) => updateContent('numeros.subtitle', e.target.value)}
                      placeholder="Descripción de los números de la empresa"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de Números</CardTitle>
                  <CardDescription>Los 4 números destacados de la empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Estadística {index + 1}</h4>
                      <div>
                        <Label>Número</Label>
                        <Input
                          value={getContent(`numeroStats.${index}.number`)}
                          onChange={(e) => updateContent(`numeroStats.${index}.number`, e.target.value)}
                          placeholder={`Número ${index + 1}`}
                        />
                      </div>
                      <div>
                        <Label>Etiqueta</Label>
                        <Input
                          value={getContent(`numeroStats.${index}.label`)}
                          onChange={(e) => updateContent(`numeroStats.${index}.label`, e.target.value)}
                          placeholder={`Etiqueta ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historia de la Empresa</CardTitle>
                  <CardDescription>Contenido de la sección historia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Párrafo 1</Label>
                    <Textarea
                      value={getContent('historia.parrafo1')}
                      onChange={(e) => updateContent('historia.parrafo1', e.target.value)}
                      placeholder="Primer párrafo de la historia"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Párrafo 2</Label>
                    <Textarea
                      value={getContent('historia.parrafo2')}
                      onChange={(e) => updateContent('historia.parrafo2', e.target.value)}
                      placeholder="Segundo párrafo de la historia"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Título de la Tarjeta</Label>
                    <Input
                      value={getContent('historia.card.title')}
                      onChange={(e) => updateContent('historia.card.title', e.target.value)}
                      placeholder="Desde 1998"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo de la Tarjeta</Label>
                    <Textarea
                      value={getContent('historia.card.subtitle')}
                      onChange={(e) => updateContent('historia.card.subtitle', e.target.value)}
                      placeholder="Descripción de la tarjeta"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Misión y Visión</CardTitle>
                  <CardDescription>Contenido de identidad corporativa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de Misión</Label>
                    <Input
                      value={getContent('identidad.mision.title')}
                      onChange={(e) => updateContent('identidad.mision.title', e.target.value)}
                      placeholder="Nuestra Misión"
                    />
                  </div>
                  <div>
                    <Label>Texto de Misión</Label>
                    <Textarea
                      value={getContent('identidad.mision.texto')}
                      onChange={(e) => updateContent('identidad.mision.texto', e.target.value)}
                      placeholder="Descripción de la misión"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Título de Visión</Label>
                    <Input
                      value={getContent('identidad.vision.title')}
                      onChange={(e) => updateContent('identidad.vision.title', e.target.value)}
                      placeholder="Nuestra Visión"
                    />
                  </div>
                  <div>
                    <Label>Texto de Visión</Label>
                    <Textarea
                      value={getContent('identidad.vision.texto')}
                      onChange={(e) => updateContent('identidad.vision.texto', e.target.value)}
                      placeholder="Descripción de la visión"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de Capacidades</CardTitle>
                  <CardDescription>Los 4 números de capacidades empresariales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Capacidad {index + 1}</h4>
                      <div>
                        <Label>Número</Label>
                        <Input
                          value={getContent(`capacidadStats.${index}.number`)}
                          onChange={(e) => updateContent(`capacidadStats.${index}.number`, e.target.value)}
                          placeholder={`Número ${index + 1}`}
                        />
                      </div>
                      <div>
                        <Label>Etiqueta</Label>
                        <Input
                          value={getContent(`capacidadStats.${index}.label`)}
                          onChange={(e) => updateContent(`capacidadStats.${index}.label`, e.target.value)}
                          placeholder={`Etiqueta ${index + 1}`}
                        />
                      </div>
                      <div>
                        <Label>Descripción</Label>
                        <Input
                          value={getContent(`capacidadStats.${index}.desc`)}
                          onChange={(e) => updateContent(`capacidadStats.${index}.desc`, e.target.value)}
                          placeholder={`Descripción ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Políticas - Objetivos</CardTitle>
                  <CardDescription>Objetivos de las políticas integradas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de Objetivos</Label>
                    <Input
                      value={getContent('politicas.objetivosTitle')}
                      onChange={(e) => updateContent('politicas.objetivosTitle', e.target.value)}
                      placeholder="Nuestros Objetivos:"
                    />
                  </div>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div key={index}>
                      <Label>Objetivo {index + 1}</Label>
                      <Input
                        value={getContent(`politicas.objetivos.${index}`)}
                        onChange={(e) => updateContent(`politicas.objetivos.${index}`, e.target.value)}
                        placeholder={`Objetivo ${index + 1}`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nuestra Historia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.historia.title')}
                      onChange={(e) => updateContent('sections.historia.title', e.target.value)}
                      placeholder="Nuestra Historia"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.historia.subtitle')}
                      onChange={(e) => updateContent('sections.historia.subtitle', e.target.value)}
                      placeholder="Descripción de la historia"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Misión, Visión y Valores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.identidad.title')}
                      onChange={(e) => updateContent('sections.identidad.title', e.target.value)}
                      placeholder="Misión, Visión y Valores"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.identidad.subtitle')}
                      onChange={(e) => updateContent('sections.identidad.subtitle', e.target.value)}
                      placeholder="Descripción de la identidad"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nuestras Capacidades</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.capacidades.title')}
                      onChange={(e) => updateContent('sections.capacidades.title', e.target.value)}
                      placeholder="Nuestras Capacidades"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.capacidades.subtitle')}
                      onChange={(e) => updateContent('sections.capacidades.subtitle', e.target.value)}
                      placeholder="Descripción de las capacidades"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Política Integrada de Gestión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.politicas.title')}
                      onChange={(e) => updateContent('sections.politicas.title', e.target.value)}
                      placeholder="Política Integrada de Gestión"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.politicas.subtitle')}
                      onChange={(e) => updateContent('sections.politicas.subtitle', e.target.value)}
                      placeholder="Descripción de las políticas"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gobierno Corporativo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título de la Sección</Label>
                    <Input
                      value={getContent('sections.gobierno.title')}
                      onChange={(e) => updateContent('sections.gobierno.title', e.target.value)}
                      placeholder="Gobierno Corporativo"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('sections.gobierno.subtitle')}
                      onChange={(e) => updateContent('sections.gobierno.subtitle', e.target.value)}
                      placeholder="Descripción del gobierno corporativo"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sección CTA Final</CardTitle>
                  <CardDescription>Call to action al final de la página</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={getContent('cta.title')}
                      onChange={(e) => updateContent('cta.title', e.target.value)}
                      placeholder="Construyamos el Futuro Juntos"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea
                      value={getContent('cta.subtitle')}
                      onChange={(e) => updateContent('cta.subtitle', e.target.value)}
                      placeholder="Descripción del llamado a la acción"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 1</Label>
                    <Input
                      value={getContent('ctaCta1')}
                      onChange={(e) => updateContent('ctaCta1', e.target.value)}
                      placeholder="Hablemos de tu Proyecto"
                    />
                  </div>
                  <div>
                    <Label>Botón CTA 2</Label>
                    <Input
                      value={getContent('ctaCta2')}
                      onChange={(e) => updateContent('ctaCta2', e.target.value)}
                      placeholder="Conoce Nuestros Proyectos"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="meta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadatos y SEO</CardTitle>
              <CardDescription>
                Información para motores de búsqueda y redes sociales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título de la Página</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título principal"
                />
              </div>
              <div>
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  value={formData.subtitulo}
                  onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                  placeholder="Subtítulo de la página"
                />
              </div>
              <div>
                <Label htmlFor="metaTitle">Meta Título (SEO)</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Título que aparece en Google"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Descripción (SEO)</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Descripción que aparece en Google"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={resetToDefault}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Restaurar
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => window.open(`/${pagina.slug}`, '_blank')}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Vista Previa
        </Button>
      </div>
    </form>
  )
}
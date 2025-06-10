'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Save,
  Plus,
  GripVertical,
  Trash2,
  Eye,
  EyeOff,
  Image,
  Type,
  List,
  BarChart3,
  Users,
  Zap,
  MessageSquare,
  PlayCircle,
  Map,
  FileText,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { TipoSeccion } from '@prisma/client'
import dynamic from 'next/dynamic'

// Editor de texto enriquecido
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px]" />
})

interface Seccion {
  id?: string
  titulo: string
  subtitulo?: string
  contenido: any
  tipo: TipoSeccion
  orden: number
  visible: boolean
}

interface Pagina {
  id: string
  slug: string
  titulo: string
  subtitulo?: string
  contenido: any
  metaTitle?: string
  metaDescription?: string
  imagenHero?: string
  imagenBanner?: string
  activa: boolean
  secciones?: Seccion[]
}

const tiposSecciones = [
  { value: 'HERO', label: 'Hero', icon: Image },
  { value: 'CONTENIDO', label: 'Contenido', icon: Type },
  { value: 'CARACTERISTICAS', label: 'Características', icon: List },
  { value: 'ESTADISTICAS', label: 'Estadísticas', icon: BarChart3 },
  { value: 'PROCESOS', label: 'Procesos', icon: Zap },
  { value: 'EQUIPO', label: 'Equipo', icon: Users },
  { value: 'TESTIMONIOS', label: 'Testimonios', icon: MessageSquare },
  { value: 'VIDEO', label: 'Video', icon: PlayCircle },
  { value: 'MAPA', label: 'Mapa', icon: Map },
  { value: 'CTA', label: 'Llamada a la acción', icon: Zap },
]

export default function EditarPaginaClient({ slug }: { slug: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pagina, setPagina] = useState<Pagina | null>(null)
  const [secciones, setSecciones] = useState<Seccion[]>([])

  useEffect(() => {
    fetchPagina()
  }, [slug])

  const fetchPagina = async () => {
    try {
      const response = await fetch(`/api/paginas?slug=${slug}&incluirSecciones=true`)
      if (!response.ok) throw new Error('Error al cargar página')
      const data = await response.json()
      setPagina(data)
      setSecciones(data.secciones || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar la página',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!pagina) return

    setSaving(true)
    try {
      const response = await fetch(`/api/paginas/${pagina.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: pagina.titulo,
          subtitulo: pagina.subtitulo,
          contenido: pagina.contenido,
          metaTitle: pagina.metaTitle,
          metaDescription: pagina.metaDescription,
          imagenHero: pagina.imagenHero,
          imagenBanner: pagina.imagenBanner,
          activa: pagina.activa,
        }),
      })

      if (!response.ok) throw new Error('Error al guardar página')

      // Guardar secciones
      for (const seccion of secciones) {
        if (seccion.id) {
          // Actualizar sección existente
          await fetch(`/api/secciones/${seccion.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(seccion),
          })
        } else {
          // Crear nueva sección
          await fetch(`/api/paginas/${pagina.id}/secciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(seccion),
          })
        }
      }

      toast({
        title: 'Página guardada',
        description: 'Los cambios se han guardado correctamente',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const addSeccion = (tipo: TipoSeccion) => {
    const nuevaSeccion: Seccion = {
      titulo: `Nueva sección ${tipo}`,
      contenido: {},
      tipo,
      orden: secciones.length,
      visible: true,
    }
    setSecciones([...secciones, nuevaSeccion])
  }

  const updateSeccion = (index: number, updates: Partial<Seccion>) => {
    const nuevasSecciones = [...secciones]
    nuevasSecciones[index] = { ...nuevasSecciones[index], ...updates }
    setSecciones(nuevasSecciones)
  }

  const deleteSeccion = (index: number) => {
    setSecciones(secciones.filter((_, i) => i !== index))
  }

  const moveSeccion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === secciones.length - 1)
    ) {
      return
    }

    const nuevasSecciones = [...secciones]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const temp = nuevasSecciones[index]
    nuevasSecciones[index] = nuevasSecciones[newIndex]
    nuevasSecciones[newIndex] = temp

    // Actualizar orden
    nuevasSecciones.forEach((seccion, i) => {
      seccion.orden = i
    })

    setSecciones(nuevasSecciones)
  }

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px]" />
      </div>
    )
  }

  if (!pagina) {
    return (
      <div className="container py-6">
        <p>Página no encontrada</p>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/paginas')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{pagina.titulo}</h1>
            <p className="text-gray-500">/{pagina.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(`/${pagina.slug}`, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver página
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="contenido" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contenido">Contenido</TabsTrigger>
          <TabsTrigger value="secciones">Secciones</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="contenido" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información básica</CardTitle>
              <CardDescription>
                Título y descripción principal de la página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={pagina.titulo}
                  onChange={(e) => setPagina({ ...pagina, titulo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  value={pagina.subtitulo || ''}
                  onChange={(e) => setPagina({ ...pagina, subtitulo: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imágenes</CardTitle>
              <CardDescription>
                Imágenes principales de la página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="imagenHero">Imagen Hero</Label>
                <Input
                  id="imagenHero"
                  value={pagina.imagenHero || ''}
                  onChange={(e) => setPagina({ ...pagina, imagenHero: e.target.value })}
                  placeholder="URL de la imagen hero"
                />
              </div>
              <div>
                <Label htmlFor="imagenBanner">Imagen Banner</Label>
                <Input
                  id="imagenBanner"
                  value={pagina.imagenBanner || ''}
                  onChange={(e) => setPagina({ ...pagina, imagenBanner: e.target.value })}
                  placeholder="URL de la imagen banner"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="secciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Secciones de la página</CardTitle>
              <CardDescription>
                Organiza el contenido en secciones personalizables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tiposSecciones.map((tipo) => {
                  const Icon = tipo.icon
                  return (
                    <Button
                      key={tipo.value}
                      variant="outline"
                      size="sm"
                      onClick={() => addSeccion(tipo.value as TipoSeccion)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tipo.label}
                    </Button>
                  )
                })}
              </div>

              <div className="space-y-4">
                {secciones.map((seccion, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <Input
                            value={seccion.titulo}
                            onChange={(e) =>
                              updateSeccion(index, { titulo: e.target.value })
                            }
                            className="font-semibold"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveSeccion(index, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveSeccion(index, 'down')}
                            disabled={index === secciones.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateSeccion(index, { visible: !seccion.visible })
                            }
                          >
                            {seccion.visible ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSeccion(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Input
                          placeholder="Subtítulo"
                          value={seccion.subtitulo || ''}
                          onChange={(e) =>
                            updateSeccion(index, { subtitulo: e.target.value })
                          }
                        />
                        {seccion.tipo === 'CONTENIDO' && (
                          <RichTextEditor
                            value={seccion.contenido.texto || ''}
                            onChange={(value) =>
                              updateSeccion(index, {
                                contenido: { ...seccion.contenido, texto: value },
                              })
                            }
                          />
                        )}
                        {/* Aquí se pueden agregar más editores específicos para cada tipo de sección */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimización SEO</CardTitle>
              <CardDescription>
                Configura los metadatos para mejorar el posicionamiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta título</Label>
                <Input
                  id="metaTitle"
                  value={pagina.metaTitle || ''}
                  onChange={(e) => setPagina({ ...pagina, metaTitle: e.target.value })}
                  placeholder={pagina.titulo}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {(pagina.metaTitle || pagina.titulo).length} / 60 caracteres
                </p>
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta descripción</Label>
                <Textarea
                  id="metaDescription"
                  value={pagina.metaDescription || ''}
                  onChange={(e) =>
                    setPagina({ ...pagina, metaDescription: e.target.value })
                  }
                  placeholder="Descripción de la página para los motores de búsqueda"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {(pagina.metaDescription || '').length} / 160 caracteres
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la página</CardTitle>
              <CardDescription>
                Opciones avanzadas de la página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="activa">Página activa</Label>
                  <p className="text-sm text-gray-500">
                    La página será visible para los visitantes
                  </p>
                </div>
                <Switch
                  id="activa"
                  checked={pagina.activa}
                  onCheckedChange={(checked) =>
                    setPagina({ ...pagina, activa: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
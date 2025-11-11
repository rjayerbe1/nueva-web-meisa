"use client"

import { useState, useEffect } from 'react'
import { Edit, Eye, EyeOff, RefreshCw, Save, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface ResumenAnio {
  id: string
  anio: number
  titulo: string
  descripcion: string
  categorias: string[] | null
  imagenesFeatured: string[] | null
  estadisticas: {
    proyectos: number
    toneladas: number
    m2: number
  } | null
  visible: boolean
}

export default function ResumenesAnioPage() {
  const [resumenes, setResumenes] = useState<ResumenAnio[]>([])
  const [loading, setLoading] = useState(true)
  const [editingResumen, setEditingResumen] = useState<ResumenAnio | null>(null)
  const [formData, setFormData] = useState<Partial<ResumenAnio>>({})

  useEffect(() => {
    fetchResumenes()
  }, [])

  const fetchResumenes = async () => {
    try {
      const res = await fetch('/api/trayectoria/resumenes')
      const data = await res.json()
      setResumenes(data)
    } catch (error) {
      toast.error('Error al cargar resúmenes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (resumen: ResumenAnio) => {
    setEditingResumen(resumen)
    setFormData({
      ...resumen,
      categorias: resumen.categorias || []
    })
  }

  const handleSave = async () => {
    if (!editingResumen) return

    try {
      const res = await fetch(`/api/trayectoria/resumenes/${editingResumen.anio}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Error al guardar')

      toast.success('Resumen actualizado exitosamente')
      setEditingResumen(null)
      fetchResumenes()
    } catch (error) {
      toast.error('Error al guardar resumen')
      console.error(error)
    }
  }

  const toggleVisibility = async (resumen: ResumenAnio) => {
    try {
      const res = await fetch(`/api/trayectoria/resumenes/${resumen.anio}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...resumen,
          visible: !resumen.visible
        })
      })

      if (!res.ok) throw new Error('Error al actualizar visibilidad')

      toast.success(resumen.visible ? 'Resumen ocultado' : 'Resumen visible')
      fetchResumenes()
    } catch (error) {
      toast.error('Error al cambiar visibilidad')
      console.error(error)
    }
  }

  const handleCategoriaAdd = (value: string) => {
    if (!value.trim()) return

    const currentCategorias = (formData.categorias || []) as string[]
    setFormData({
      ...formData,
      categorias: [...currentCategorias, value.trim()]
    })
  }

  const handleCategoriaRemove = (index: number) => {
    const currentCategorias = (formData.categorias || []) as string[]
    setFormData({
      ...formData,
      categorias: currentCategorias.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Resúmenes de Años</h1>
          <p className="text-slate-600 mt-1">
            Gestiona el contenido que aparece en los espacios vacíos del timeline
          </p>
        </div>
        <Button
          onClick={fetchResumenes}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
      </div>

      {/* Lista de resúmenes */}
      <div className="grid gap-4">
        {resumenes.map((resumen) => (
          <Card key={resumen.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-slate-900">{resumen.anio}</h2>
                  {!resumen.visible && (
                    <Badge variant="secondary" className="bg-slate-200">
                      Oculto
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {resumen.titulo}
                </h3>

                <p className="text-slate-600 text-sm mb-3">
                  {resumen.descripcion}
                </p>

                {resumen.categorias && resumen.categorias.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {resumen.categorias.slice(0, 3).map((cat, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                )}

                {resumen.estadisticas && (
                  <div className="flex gap-4 text-sm text-slate-600">
                    <span><strong>{resumen.estadisticas.proyectos}</strong> proyectos</span>
                    {resumen.estadisticas.toneladas > 0 && (
                      <span><strong>{resumen.estadisticas.toneladas}</strong> ton</span>
                    )}
                    {resumen.estadisticas.m2 > 0 && (
                      <span><strong>{resumen.estadisticas.m2}</strong> m²</span>
                    )}
                  </div>
                )}

                {resumen.imagenesFeatured && resumen.imagenesFeatured.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <ImageIcon className="w-4 h-4" />
                    <span>{resumen.imagenesFeatured.length} imágenes destacadas</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => toggleVisibility(resumen)}
                  variant="outline"
                  size="icon"
                  title={resumen.visible ? 'Ocultar' : 'Mostrar'}
                >
                  {resumen.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={() => handleEdit(resumen)}
                  variant="outline"
                  size="icon"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Dialog de edición */}
      <Dialog open={!!editingResumen} onOpenChange={(open) => !open && setEditingResumen(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Resumen {editingResumen?.anio}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Título */}
            <div>
              <label className="text-sm font-medium text-slate-900 mb-2 block">
                Título
              </label>
              <Input
                value={formData.titulo || ''}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="2015: Expansión Industrial"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="text-sm font-medium text-slate-900 mb-2 block">
                Descripción
              </label>
              <Textarea
                value={formData.descripcion || ''}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción breve del año..."
                rows={4}
              />
            </div>

            {/* Categorías */}
            <div>
              <label className="text-sm font-medium text-slate-900 mb-2 block">
                Categorías
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.categorias as string[] || []).map((cat, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {cat}
                    <button
                      onClick={() => handleCategoriaRemove(idx)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Nueva categoría"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCategoriaAdd(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Presiona Enter para agregar
              </p>
            </div>

            {/* Imágenes destacadas */}
            <div>
              <label className="text-sm font-medium text-slate-900 mb-2 block">
                Imágenes Destacadas (máximo 4)
              </label>
              <ImageUploader
                images={(formData.imagenesFeatured as string[]) || []}
                onImagesChange={(images) =>
                  setFormData({ ...formData, imagenesFeatured: images })
                }
                maxImages={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              onClick={() => setEditingResumen(null)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

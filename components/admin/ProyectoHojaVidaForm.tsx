"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Save, Loader2, Image as ImageIcon } from 'lucide-react'

interface ProyectoHojaVida {
  id: string
  entidadContratante: string
  objetoContrato: string
  fechaInicio: string | Date
  fechaFin: string | Date
  pesoKg: number | null
  areaM2: number | null
  ubicacion: string
  departamento: string | null
  valorContrato: number
  moneda: string
  imagenes: string[] | null
  visible: boolean
  destacado: boolean
  orden: number
}

interface Props {
  proyecto?: ProyectoHojaVida
}

export function ProyectoHojaVidaForm({ proyecto }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    entidadContratante: proyecto?.entidadContratante || '',
    objetoContrato: proyecto?.objetoContrato || '',
    fechaInicio: proyecto ? formatDateForInput(proyecto.fechaInicio) : '',
    fechaFin: proyecto ? formatDateForInput(proyecto.fechaFin) : '',
    pesoKg: proyecto?.pesoKg?.toString() || '',
    areaM2: proyecto?.areaM2?.toString() || '',
    ubicacion: proyecto?.ubicacion || '',
    departamento: proyecto?.departamento || '',
    valorContrato: proyecto?.valorContrato.toString() || '',
    moneda: proyecto?.moneda || 'COP',
    imagenes: proyecto?.imagenes || [],
    visible: proyecto?.visible ?? true,
    destacado: proyecto?.destacado ?? false,
    orden: proyecto?.orden || 0
  })

  function formatDateForInput(date: string | Date) {
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = proyecto
        ? `/api/trayectoria/proyectos/${proyecto.id}`
        : '/api/trayectoria/proyectos'

      const method = proyecto ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Error al guardar')

      router.push('/admin/trayectoria')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar el proyecto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Información del Proyecto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="entidadContratante">Entidad Contratante *</Label>
            <Input
              id="entidadContratante"
              name="entidadContratante"
              value={formData.entidadContratante}
              onChange={handleChange}
              required
              placeholder="Ej: PAVCOL, MHC, Dollar City..."
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="objetoContrato">Descripción del Proyecto *</Label>
            <Textarea
              id="objetoContrato"
              name="objetoContrato"
              value={formData.objetoContrato}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Descripción completa del objeto del contrato"
            />
          </div>

          <div>
            <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
            <Input
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              value={formData.fechaInicio}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="fechaFin">Fecha de Fin *</Label>
            <Input
              id="fechaFin"
              name="fechaFin"
              type="date"
              value={formData.fechaFin}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="ubicacion">Ubicación *</Label>
            <Input
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
              placeholder="Ej: Bogotá, Cali-Valle, Popayán-Cauca"
            />
          </div>

          <div>
            <Label htmlFor="departamento">Departamento</Label>
            <Input
              id="departamento"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              placeholder="Ej: Bogotá D.C., Valle del Cauca, Cauca"
            />
          </div>

          <div>
            <Label htmlFor="valorContrato">Valor del Contrato (COP) *</Label>
            <Input
              id="valorContrato"
              name="valorContrato"
              type="number"
              value={formData.valorContrato}
              onChange={handleChange}
              required
              placeholder="Ej: 6186781197"
            />
          </div>

          <div>
            <Label htmlFor="pesoKg">Peso (Kg)</Label>
            <Input
              id="pesoKg"
              name="pesoKg"
              type="number"
              step="0.01"
              value={formData.pesoKg}
              onChange={handleChange}
              placeholder="Ej: 381379"
            />
          </div>

          <div>
            <Label htmlFor="areaM2">Área (m²)</Label>
            <Input
              id="areaM2"
              name="areaM2"
              type="number"
              step="0.01"
              value={formData.areaM2}
              onChange={handleChange}
              placeholder="Ej: 1528"
            />
          </div>

          <div>
            <Label htmlFor="orden">Orden de Visualización</Label>
            <Input
              id="orden"
              name="orden"
              type="number"
              value={formData.orden}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Opciones de Visualización</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Visible en la página pública</Label>
              <p className="text-sm text-slate-500">
                El proyecto aparecerá en la página de trayectoria
              </p>
            </div>
            <Switch
              checked={formData.visible}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, visible: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Proyecto Destacado</Label>
              <p className="text-sm text-slate-500">
                Aparecerá primero en su año
              </p>
            </div>
            <Switch
              checked={formData.destacado}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, destacado: checked }))
              }
            />
          </div>
        </div>
      </Card>

      {/* Galería de Imágenes - Solo para proyectos destacados */}
      {formData.destacado && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Galería de Imágenes</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Los proyectos destacados pueden incluir imágenes para mostrar en la página pública.
            Las imágenes aparecerán en un carousel en el modal de detalles.
          </p>
          <ImageUploader
            images={formData.imagenes}
            onImagesChange={(images) =>
              setFormData(prev => ({ ...prev, imagenes: images }))
            }
            maxImages={10}
            label="Arrastra imágenes aquí o haz click para seleccionar"
          />
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {proyecto ? 'Actualizar' : 'Crear'} Proyecto
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Save, Loader2 } from 'lucide-react'

interface Configuracion {
  id: string
  resenaHistorica: string
  mision: string
  vision: string
  valores: any
}

interface Props {
  configuracion: Configuracion | null
}

export function ConfiguracionTrayectoriaForm({ configuracion }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    resenaHistorica: configuracion?.resenaHistorica || '',
    mision: configuracion?.mision || '',
    vision: configuracion?.vision || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/trayectoria/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          valores: configuracion?.valores || []
        })
      })

      if (!response.ok) throw new Error('Error al guardar')

      alert('Configuración actualizada correctamente')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar la configuración')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Reseña Histórica</h3>
        <div>
          <Label htmlFor="resenaHistorica">
            Historia de la empresa
          </Label>
          <Textarea
            id="resenaHistorica"
            name="resenaHistorica"
            value={formData.resenaHistorica}
            onChange={handleChange}
            rows={8}
            className="mt-2"
            placeholder="Escribe la reseña histórica de MEISA..."
          />
          <p className="text-sm text-slate-500 mt-2">
            Esta sección aparecerá al final de la página de trayectoria
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Misión</h3>
        <div>
          <Label htmlFor="mision">
            Misión de la empresa
          </Label>
          <Textarea
            id="mision"
            name="mision"
            value={formData.mision}
            onChange={handleChange}
            rows={6}
            className="mt-2"
            placeholder="Escribe la misión de MEISA..."
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Visión</h3>
        <div>
          <Label htmlFor="vision">
            Visión de la empresa
          </Label>
          <Textarea
            id="vision"
            name="vision"
            value={formData.vision}
            onChange={handleChange}
            rows={6}
            className="mt-2"
            placeholder="Escribe la visión de MEISA..."
          />
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">Valores Corporativos</h3>
        <p className="text-sm text-blue-700">
          Los valores corporativos están pre-configurados en el sistema:
          Efectividad, Integridad, Respeto, Lealtad, Proactividad, Pasión, Disciplina, Aprendizaje continuo.
        </p>
        <p className="text-sm text-blue-600 mt-2">
          Para modificar los valores, contacta al desarrollador.
        </p>
      </Card>

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
              Guardar Configuración
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  nombre: string
  descripcion: string
  caracteristicas?: string[]
  orden: number
  icono: string | null
}

interface EditServiceFormProps {
  serviceId: string
}

export default function EditServiceForm({ serviceId }: EditServiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    caracteristicas: [''],
    orden: 1,
    icono: ''
  })

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/admin/services/${serviceId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        
        if (response.ok) {
          const service: Service = await response.json()
          setFormData({
            nombre: service.nombre,
            descripcion: service.descripcion,
            caracteristicas: (service.caracteristicas && service.caracteristicas.length > 0) ? service.caracteristicas : [''],
            orden: service.orden,
            icono: service.icono || ''
          })
        } else if (response.status === 401) {
          // Si no está autenticado, redirigir al login
          router.push('/auth/signin')
        } else {
          console.error('Error response:', response.status, response.statusText)
          const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
          alert(`Error al cargar el servicio: ${errorData.error || 'Error del servidor'}`)
          router.push('/admin/services')
        }
      } catch (error) {
        console.error('Error fetching service:', error)
        alert('Error de conexión al cargar el servicio')
        router.push('/admin/services')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchService()
  }, [serviceId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          caracteristicas: formData.caracteristicas.filter(c => c.trim() !== '')
        }),
      })

      if (response.ok) {
        router.push('/admin/services')
        router.refresh()
      } else {
        alert('Error al actualizar el servicio')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el servicio')
    } finally {
      setLoading(false)
    }
  }

  const addCaracteristica = () => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: [...prev.caracteristicas, '']
    }))
  }

  const removeCaracteristica = (index: number) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index)
    }))
  }

  const updateCaracteristica = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.map((c, i) => i === index ? value : c)
    }))
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-meisa-blue"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/services"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Servicio</h1>
            <p className="text-gray-600">Modifica la información del servicio</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Servicio *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
                placeholder="Ej: Diseño Estructural"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden de Aparición
              </label>
              <input
                type="number"
                min="1"
                value={formData.orden}
                onChange={(e) => setFormData(prev => ({ ...prev, orden: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              required
              rows={4}
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              placeholder="Describe el servicio en detalle..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Características
              </label>
              <button
                type="button"
                onClick={addCaracteristica}
                className="flex items-center text-sm text-meisa-blue hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Añadir característica
              </button>
            </div>
            <div className="space-y-3">
              {formData.caracteristicas.map((caracteristica, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={caracteristica}
                    onChange={(e) => updateCaracteristica(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
                    placeholder="Ej: Análisis de cargas y esfuerzos"
                  />
                  {formData.caracteristicas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCaracteristica(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icono (opcional)
            </label>
            <input
              type="text"
              value={formData.icono}
              onChange={(e) => setFormData(prev => ({ ...prev, icono: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              placeholder="Ej: 🏗️"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              href="/admin/services"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-meisa-blue border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
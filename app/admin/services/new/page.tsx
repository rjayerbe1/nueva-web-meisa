"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"

export default function NewServicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    caracteristicas: [''],
    orden: 1,
    icono: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          caracteristicas: formData.caracteristicas.filter(c => c.trim() !== '')
        }),
      })

      if (response.ok) {
        router.push('/admin/services')
        router.refresh()
      } else {
        alert('Error al crear el servicio')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el servicio')
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
            <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Servicio</h1>
            <p className="text-gray-600">Añade un nuevo servicio a la lista</p>
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
              {loading ? 'Guardando...' : 'Guardar Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
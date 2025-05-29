"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Calendar, MapPin, DollarSign } from "lucide-react"
import { CategoriaEnum, EstadoProyecto, PrioridadEnum } from "@prisma/client"

interface Project {
  id: string
  titulo: string
  descripcion: string
  categoria: CategoriaEnum
  cliente: string
  ubicacion: string
  fechaInicio: Date
  fechaFin: Date
  estado: EstadoProyecto
  prioridad: PrioridadEnum
  presupuesto: number | null
  costoReal: number | null
  moneda: string
  contactoCliente: string | null
  telefono: string | null
  email: string | null
  destacado: boolean
  visible: boolean
  slug: string
}

interface EditProjectFormProps {
  project: Project
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: project.titulo,
    descripcion: project.descripcion,
    categoria: project.categoria,
    cliente: project.cliente,
    ubicacion: project.ubicacion,
    fechaInicio: new Date(project.fechaInicio).toISOString().split('T')[0],
    fechaFin: new Date(project.fechaFin).toISOString().split('T')[0],
    estado: project.estado,
    prioridad: project.prioridad,
    presupuesto: project.presupuesto || '',
    costoReal: project.costoReal || '',
    moneda: project.moneda || 'COP',
    contactoCliente: project.contactoCliente || '',
    telefono: project.telefono || '',
    email: project.email || '',
    destacado: project.destacado,
    visible: project.visible
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          presupuesto: formData.presupuesto ? Number(formData.presupuesto) : null,
          costoReal: formData.costoReal ? Number(formData.costoReal) : null,
        }),
      })

      if (response.ok) {
        router.push(`/admin/projects/${project.id}`)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al actualizar el proyecto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el proyecto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/projects/${project.id}`}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Proyecto</h1>
            <p className="text-gray-600">Modifica la información del proyecto</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información Básica */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Proyecto *
              </label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                required
                rows={4}
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                required
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as CategoriaEnum }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              >
                {Object.values(CategoriaEnum).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <input
                type="text"
                required
                value={formData.cliente}
                onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Ubicación *
              </label>
              <input
                type="text"
                required
                value={formData.ubicacion}
                onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fecha de Inicio *
              </label>
              <input
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaInicio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fecha de Fin *
              </label>
              <input
                type="date"
                required
                value={formData.fechaFin}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaFin: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Estado y Prioridad */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Estado y Prioridad</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                required
                value={formData.estado}
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as EstadoProyecto }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              >
                {Object.values(EstadoProyecto).map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad *
              </label>
              <select
                required
                value={formData.prioridad}
                onChange={(e) => setFormData(prev => ({ ...prev, prioridad: e.target.value as PrioridadEnum }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              >
                {Object.values(PrioridadEnum).map((prioridad) => (
                  <option key={prioridad} value={prioridad}>
                    {prioridad}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.destacado}
                  onChange={(e) => setFormData(prev => ({ ...prev, destacado: e.target.checked }))}
                  className="h-4 w-4 text-meisa-blue focus:ring-meisa-blue border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Proyecto Destacado
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                  className="h-4 w-4 text-meisa-blue focus:ring-meisa-blue border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Visible en el sitio web
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Información Financiera */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Información Financiera</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Presupuesto
              </label>
              <input
                type="number"
                value={formData.presupuesto}
                onChange={(e) => setFormData(prev => ({ ...prev, presupuesto: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Costo Real
              </label>
              <input
                type="number"
                value={formData.costoReal}
                onChange={(e) => setFormData(prev => ({ ...prev, costoReal: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <select
                value={formData.moneda}
                onChange={(e) => setFormData(prev => ({ ...prev, moneda: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              >
                <option value="COP">COP - Peso Colombiano</option>
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Información de Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contacto del Cliente
              </label>
              <input
                type="text"
                value={formData.contactoCliente}
                onChange={(e) => setFormData(prev => ({ ...prev, contactoCliente: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <Link
            href={`/admin/projects/${project.id}`}
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
  )
}
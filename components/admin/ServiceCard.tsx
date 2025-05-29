"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Wrench, Edit, Trash2, Eye } from "lucide-react"

interface Service {
  id: string
  nombre: string
  descripcion: string
  caracteristicas?: string[]
  orden: number
  icono: string | null
}

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el servicio "${service.nombre}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Error al eliminar el servicio')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el servicio')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              {service.icono ? (
                <span className="text-2xl">{service.icono}</span>
              ) : (
                <Wrench className="h-6 w-6 text-green-600" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{service.nombre}</h3>
              <p className="text-sm text-gray-500">Orden: {service.orden}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={`/admin/services/${service.id}`}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Ver detalles"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              href={`/admin/services/${service.id}/edit`}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-4 text-gray-600 line-clamp-3">{service.descripcion}</p>
        {service.caracteristicas && service.caracteristicas.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Características:</p>
            <ul className="mt-2 space-y-1">
              {service.caracteristicas.slice(0, 3).map((caracteristica, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  {caracteristica}
                </li>
              ))}
              {service.caracteristicas.length > 3 && (
                <li className="text-sm text-gray-500 italic">
                  +{service.caracteristicas.length - 3} más...
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
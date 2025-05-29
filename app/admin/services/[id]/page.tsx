"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Wrench } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  nombre: string
  descripcion: string
  caracteristicas: string[]
  orden: number
  icono: string | null
  createdAt: string
  updatedAt: string
}

export default function ServiceDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [service, setService] = useState<Service | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/admin/services/${params.id}`)
        if (response.ok) {
          const serviceData = await response.json()
          setService(serviceData)
        } else {
          alert('Error al cargar el servicio')
          router.push('/admin/services')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al cargar el servicio')
        router.push('/admin/services')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchService()
    }
  }, [params.id, router])

  const handleDelete = async () => {
    if (!service || !confirm(`¿Estás seguro de que quieres eliminar el servicio "${service.nombre}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/services')
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-meisa-blue"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Servicio no encontrado</h2>
        <Link href="/admin/services" className="text-meisa-blue hover:underline mt-2 inline-block">
          Volver a servicios
        </Link>
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
            <h1 className="text-2xl font-bold text-gray-900">{service.nombre}</h1>
            <p className="text-gray-600">Detalles del servicio</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/services/${service.id}/edit`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      {/* Service Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-8">
          {/* Header con icono */}
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center">
              {service.icono ? (
                <span className="text-3xl">{service.icono}</span>
              ) : (
                <Wrench className="h-8 w-8 text-green-600" />
              )}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{service.nombre}</h2>
              <p className="text-gray-600">Orden de aparición: {service.orden}</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{service.descripcion}</p>
          </div>

          {/* Características */}
          {service.caracteristicas && service.caracteristicas.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Características</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.caracteristicas.map((caracteristica, index) => (
                  <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{caracteristica}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700">Fecha de creación</p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(service.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Última modificación</p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(service.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
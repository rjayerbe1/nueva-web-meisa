"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Mail, Phone, Calendar, Clock, CheckCircle, Circle, Trash2, Reply } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  nombre: string
  email: string
  telefono: string | null
  mensaje: string
  leido: boolean
  createdAt: string
  updatedAt: string
}

export default function MessageDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<Message | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/admin/messages/${params.id}`)
        if (response.ok) {
          const messageData = await response.json()
          setMessage(messageData)
          
          // Marcar como leído automáticamente al abrir
          if (!messageData.leido) {
            await fetch(`/api/admin/messages/${params.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ leido: true }),
            })
          }
        } else {
          alert('Error al cargar el mensaje')
          router.push('/admin/messages')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al cargar el mensaje')
        router.push('/admin/messages')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMessage()
    }
  }, [params.id, router])

  const handleDelete = async () => {
    if (!message || !confirm(`¿Estás seguro de que quieres eliminar el mensaje de "${message.nombre}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/messages')
        router.refresh()
      } else {
        alert('Error al eliminar el mensaje')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el mensaje')
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleRead = async () => {
    if (!message) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leido: !message.leido }),
      })

      if (response.ok) {
        const updatedMessage = await response.json()
        setMessage(updatedMessage)
      } else {
        alert('Error al actualizar el mensaje')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el mensaje')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-meisa-blue"></div>
      </div>
    )
  }

  if (!message) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Mensaje no encontrado</h2>
        <Link href="/admin/messages" className="text-meisa-blue hover:underline mt-2 inline-block">
          Volver a mensajes
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
            href="/admin/messages"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mensaje de {message.nombre}</h1>
            <p className="text-gray-600">Detalles del mensaje</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleRead}
            disabled={isUpdating}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            {message.leido ? (
              <>
                <Circle className="h-4 w-4 mr-2" />
                Marcar como no leído
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como leído
              </>
            )}
          </button>
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

      {/* Message Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-8">
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              message.leido 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {message.leido ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Leído
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4 mr-1" />
                  No leído
                </>
              )}
            </span>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700">Nombre</p>
                <p className="text-lg text-gray-900 mt-1">{message.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <a 
                    href={`mailto:${message.email}`}
                    className="text-lg text-meisa-blue hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
              </div>
              {message.telefono && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Teléfono</p>
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <a 
                      href={`tel:${message.telefono}`}
                      className="text-lg text-meisa-blue hover:underline"
                    >
                      {message.telefono}
                    </a>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">Fecha y hora</p>
                <div className="flex items-center mt-1 text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">
                    {new Date(message.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensaje</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{message.mensaje}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${message.email}?subject=Re: Consulta sobre servicios de MEISA&body=Hola ${message.nombre},%0D%0A%0D%0AGracias por contactarnos.%0D%0A%0D%0ASaludos,%0D%0AEquipo MEISA`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-meisa-blue border border-transparent rounded-md hover:bg-blue-700"
              >
                <Reply className="h-4 w-4 mr-2" />
                Responder por email
              </a>
              {message.telefono && (
                <a
                  href={`tel:${message.telefono}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
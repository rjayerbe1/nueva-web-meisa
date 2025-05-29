"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Phone, Calendar, Clock, CheckCircle, Circle, Trash2, Eye } from "lucide-react"

interface Message {
  id: string
  nombre: string
  email: string
  telefono: string | null
  mensaje: string
  leido: boolean
  createdAt: string
}

interface MessageCardProps {
  message: Message
}

export default function MessageCard({ message }: MessageCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el mensaje de "${message.nombre}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
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
        router.refresh()
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

  return (
    <div
      className={`p-6 hover:bg-gray-50 transition-colors ${
        !message.leido ? 'bg-orange-50' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <button
            onClick={toggleRead}
            disabled={isUpdating}
            className={`flex-shrink-0 mt-1 transition-colors ${
              message.leido ? 'text-green-500' : 'text-orange-500'
            } ${isUpdating ? 'opacity-50' : 'hover:opacity-75'}`}
            title={message.leido ? 'Marcar como no leído' : 'Marcar como leído'}
          >
            {message.leido ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {message.nombre}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(message.createdAt).toLocaleDateString('es-ES')}
                <Clock className="h-4 w-4 ml-3 mr-1" />
                {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                <a href={`mailto:${message.email}`} className="hover:text-blue-600">
                  {message.email}
                </a>
              </div>
              {message.telefono && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <a href={`tel:${message.telefono}`} className="hover:text-blue-600">
                    {message.telefono}
                  </a>
                </div>
              )}
            </div>
            
            <p className="text-gray-700 line-clamp-2">{message.mensaje}</p>
            
            {!message.leido && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-2">
                Nuevo
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Link
            href={`/admin/messages/${message.id}`}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Ver mensaje completo"
          >
            <Eye className="h-4 w-4" />
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
    </div>
  )
}
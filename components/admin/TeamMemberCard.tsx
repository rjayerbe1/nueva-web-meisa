"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Users, Edit, Trash2, Mail, Phone, Briefcase, ExternalLink } from "lucide-react"

interface TeamMember {
  id: string
  nombre: string
  cargo: string
  bio: string | null
  foto: string | null
  email: string | null
  telefono: string | null
  linkedin: string | null
  orden: number
}

interface TeamMemberCardProps {
  member: TeamMember
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a "${member.nombre}" del equipo?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/team/${member.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Error al eliminar el miembro del equipo')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el miembro del equipo')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-3 aspect-h-2 bg-gray-200">
        {member.foto ? (
          <Image
            src={member.foto}
            alt={member.nombre}
            width={400}
            height={300}
            className="object-cover w-full h-48"
          />
        ) : (
          <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 h-48">
            <Users className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{member.nombre}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Briefcase className="h-4 w-4 mr-1" />
              {member.cargo}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Link
              href={`/admin/team/${member.id}/edit`}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {member.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{member.bio}</p>
        )}
        
        <div className="space-y-2 text-sm">
          {member.email && (
            <div className="flex items-center text-gray-500">
              <Mail className="h-4 w-4 mr-2" />
              <a 
                href={`mailto:${member.email}`}
                className="truncate hover:text-meisa-blue transition-colors"
              >
                {member.email}
              </a>
            </div>
          )}
          {member.telefono && (
            <div className="flex items-center text-gray-500">
              <Phone className="h-4 w-4 mr-2" />
              <a 
                href={`tel:${member.telefono}`}
                className="hover:text-meisa-blue transition-colors"
              >
                {member.telefono}
              </a>
            </div>
          )}
          {member.linkedin && (
            <div className="flex items-center text-gray-500">
              <ExternalLink className="h-4 w-4 mr-2" />
              <a 
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-meisa-blue transition-colors flex items-center"
              >
                LinkedIn
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">Orden: {member.orden}</span>
        </div>
      </div>
    </div>
  )
}
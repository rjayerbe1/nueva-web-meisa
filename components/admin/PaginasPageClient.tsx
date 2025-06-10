'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Edit,
  FileText,
} from 'lucide-react'

interface Pagina {
  id: string
  slug: string
  titulo: string
  subtitulo?: string
  activa: boolean
  createdAt: string
  updatedAt: string
}

export default function PaginasPageClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const predefinedPages = [
    { slug: 'calidad', titulo: 'Calidad' },
    { slug: 'tecnologia', titulo: 'Tecnología' },
    { slug: 'empresa', titulo: 'Empresa' },
  ]

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Páginas</h1>
      </div>

      {/* Páginas principales */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Páginas principales del sitio
        </h3>
        <p className="text-blue-800 mb-6">
          Edita el contenido de las páginas principales del sitio web. Cada página cuenta con secciones personalizables.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {predefinedPages.map((page) => (
            <div
              key={page.slug}
              className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{page.titulo}</h4>
                  <p className="text-sm text-gray-500 mt-1">/{page.slug}</p>
                  <p className="text-xs text-green-600 mt-2">✓ Configurada</p>
                </div>
                <Button
                  onClick={() => router.push(`/admin/paginas/${page.slug}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Información</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium">Acceso directo:</p>
            <p>Usa el menú lateral "Páginas" para acceder directamente a cada sección</p>
          </div>
          <div>
            <p className="font-medium">Edición en tiempo real:</p>
            <p>Los cambios se reflejan inmediatamente en el sitio web público</p>
          </div>
        </div>
      </div>

    </div>
  )
}
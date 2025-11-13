'use client'

import { useState, useMemo } from 'react'
import { FileText, Plus, Search, Star } from 'lucide-react'
import Link from 'next/link'
import { TemplatesTable } from '@/components/admin/TemplatesTable'
import type { CategoriaEnum } from '@prisma/client'

type Template = {
  id: string
  nombre: string
  descripcion: string | null
  thumbnail: string | null
  tipoCategoria: CategoriaEnum | null
  isPublic: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
  _count: {
    brochures: number
    pages: number
  }
}

interface TemplatesPageClientProps {
  templates: Template[]
}

export function TemplatesPageClient({ templates }: TemplatesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'TODOS' | 'DEFAULT' | 'PUBLIC' | 'PRIVATE'>('TODOS')

  // Filtrar templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = searchTerm === '' ||
        template.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.descripcion && template.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType =
        filterType === 'TODOS' ||
        (filterType === 'DEFAULT' && template.isDefault) ||
        (filterType === 'PUBLIC' && template.isPublic) ||
        (filterType === 'PRIVATE' && !template.isPublic)

      return matchesSearch && matchesType
    })
  }, [templates, searchTerm, filterType])

  // Estadísticas
  const stats = useMemo(() => {
    return {
      total: templates.length,
      defaults: templates.filter(t => t.isDefault).length,
      public: templates.filter(t => t.isPublic).length,
      inUse: templates.filter(t => t._count.brochures > 0).length
    }
  }, [templates])

  return (
    <div className="space-y-8 max-w-none w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates de Brochure</h1>
          <p className="mt-2 text-lg text-gray-600">
            Gestiona los templates disponibles para crear brochures
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/brochures/templates/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-meisa-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Template
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Templates</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Por Defecto</p>
              <p className="text-3xl font-bold text-amber-900 mt-1">{stats.defaults}</p>
            </div>
            <div className="bg-amber-500 bg-opacity-20 p-3 rounded-lg">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Públicos</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.public}</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">En Uso</p>
              <p className="text-3xl font-bold text-indigo-900 mt-1">{stats.inUse}</p>
            </div>
            <div className="bg-indigo-500 bg-opacity-20 p-3 rounded-lg">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-meisa-blue focus:border-meisa-blue sm:text-sm"
                placeholder="Buscar templates..."
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Filtro por Tipo */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-meisa-blue focus:border-meisa-blue sm:text-sm rounded-md"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="DEFAULT">Por defecto</option>
              <option value="PUBLIC">Públicos</option>
              <option value="PRIVATE">Privados</option>
            </select>
          </div>
        </div>

        {/* Mostrar resultados de filtrado */}
        {(searchTerm || filterType !== 'TODOS') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Mostrando {filteredTemplates.length} de {templates.length} templates
              {searchTerm && (
                <span className="ml-1">
                  para "<span className="font-medium">{searchTerm}</span>"
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Templates Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredTemplates.length === templates.length ? 'Todos los Templates' : 'Templates Filtrados'}
          </h2>
        </div>

        <TemplatesTable templates={filteredTemplates} />
      </div>
    </div>
  )
}

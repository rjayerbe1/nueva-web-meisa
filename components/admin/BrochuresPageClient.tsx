'use client'

import { useState, useMemo } from 'react'
import { BookOpen, Plus, Search, FileText } from 'lucide-react'
import Link from 'next/link'
import { BrochuresTable } from '@/components/admin/BrochuresTable'
import type { CategoriaEnum } from '@prisma/client'

type Brochure = {
  id: string
  titulo: string
  descripcion: string | null
  activo: boolean
  publicado: boolean
  urlAmigable: string
  thumbnail: string | null
  versionNumero: number
  fechaPublicacion: string | null
  createdAt: string
  updatedAt: string
  template: {
    nombre: string
    thumbnail: string | null
  }
  categoria: {
    nombre: string
    slug: string
    key: CategoriaEnum
  } | null
  _count: {
    pages: number
    analytics: number
  }
}

interface BrochuresPageClientProps {
  brochures: Brochure[]
}

export function BrochuresPageClient({ brochures }: BrochuresPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<'TODOS' | 'ACTIVO' | 'INACTIVO' | 'PUBLICADO'>('TODOS')
  const [filterCategoria, setFilterCategoria] = useState<CategoriaEnum | 'TODAS'>('TODAS')

  // Obtener categorías únicas de los brochures
  const uniqueCategories = useMemo(() => {
    const categories = new Set(brochures.filter(b => b.categoria).map(b => b.categoria!.key))
    return Array.from(categories).sort()
  }, [brochures])

  // Filtrar brochures basado en los criterios de búsqueda
  const filteredBrochures = useMemo(() => {
    return brochures.filter(brochure => {
      const matchesSearch = searchTerm === '' ||
        brochure.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brochure.urlAmigable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (brochure.descripcion && brochure.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (brochure.categoria && brochure.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesEstado =
        filterEstado === 'TODOS' ||
        (filterEstado === 'ACTIVO' && brochure.activo) ||
        (filterEstado === 'INACTIVO' && !brochure.activo) ||
        (filterEstado === 'PUBLICADO' && brochure.publicado)

      const matchesCategoria =
        filterCategoria === 'TODAS' ||
        (brochure.categoria && brochure.categoria.key === filterCategoria)

      return matchesSearch && matchesEstado && matchesCategoria
    })
  }, [brochures, searchTerm, filterEstado, filterCategoria])

  // Estadísticas calculadas
  const stats = useMemo(() => {
    return {
      total: brochures.length,
      publicados: brochures.filter(b => b.publicado).length,
      activos: brochures.filter(b => b.activo).length,
      sinCategoria: brochures.filter(b => !b.categoria).length
    }
  }, [brochures])

  return (
    <div className="space-y-8 max-w-none w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Brochures Digitales</h1>
          <p className="mt-2 text-lg text-gray-600">
            Administra los brochures digitales de las categorías
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Link
            href="/admin/brochures/templates"
            className="inline-flex items-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            Templates
          </Link>
          <Link
            href="/admin/brochures/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-meisa-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Brochure
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Brochures</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Publicados</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.publicados}</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">Activos</p>
              <p className="text-3xl font-bold text-indigo-900 mt-1">{stats.activos}</p>
            </div>
            <div className="bg-indigo-500 bg-opacity-20 p-3 rounded-lg">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Sin Categoría</p>
              <p className="text-3xl font-bold text-amber-900 mt-1">{stats.sinCategoria}</p>
            </div>
            <div className="bg-amber-500 bg-opacity-20 p-3 rounded-lg">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
                placeholder="Buscar por título, URL o categoría..."
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Filtro por Estado */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value as 'TODOS' | 'ACTIVO' | 'INACTIVO' | 'PUBLICADO')}
              className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-meisa-blue focus:border-meisa-blue sm:text-sm rounded-md"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="PUBLICADO">Publicados</option>
              <option value="ACTIVO">Activos</option>
              <option value="INACTIVO">Inactivos</option>
            </select>

            {/* Filtro por Categoría */}
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value as CategoriaEnum | 'TODAS')}
              className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-meisa-blue focus:border-meisa-blue sm:text-sm rounded-md"
            >
              <option value="TODAS">Todas las categorías</option>
              {uniqueCategories.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mostrar resultados de filtrado */}
        {(searchTerm || filterEstado !== 'TODOS' || filterCategoria !== 'TODAS') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Mostrando {filteredBrochures.length} de {brochures.length} brochures
              {searchTerm && (
                <span className="ml-1">
                  para "<span className="font-medium">{searchTerm}</span>"
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Brochures Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredBrochures.length === brochures.length ? 'Todos los Brochures' : 'Brochures Filtrados'}
          </h2>
        </div>

        <BrochuresTable brochures={filteredBrochures} />
      </div>
    </div>
  )
}

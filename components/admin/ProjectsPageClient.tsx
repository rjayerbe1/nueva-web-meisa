'use client'

import { useState, useMemo } from 'react'
import { Building2, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { ProjectsTable } from '@/components/admin/ProjectsTable'
import type { CategoriaEnum, EstadoProyecto } from '@prisma/client'

type Project = {
  id: string
  titulo: string
  codigoInterno: string | null
  categoria: CategoriaEnum
  estado: EstadoProyecto
  cliente: string
  ubicacion: string
  fechaInicio: string
  fechaFin: string | null
  presupuesto: number | null
  destacado: boolean
  visible: boolean
  createdAt: string
  imagenPortada: {
    url: string
    alt: string
  } | null
}

interface ProjectsPageClientProps {
  projects: Project[]
}

// Mapeo de categorías para mostrar nombres legibles
const CATEGORIA_LABELS = {
  CENTROS_COMERCIALES: 'Centros Comerciales',
  EDIFICIOS: 'Edificios',
  PUENTES: 'Puentes',
  OIL_GAS: 'Oil & Gas',
  INDUSTRIAL: 'Industrial',
  RESIDENCIAL: 'Residencial',
  INFRAESTRUCTURA: 'Infraestructura',
  OTRO: 'Otros'
} as const

// Mapeo de estados para mostrar nombres legibles
const ESTADO_LABELS = {
  PLANIFICACION: 'Planificación',
  EN_PROGRESO: 'En Progreso',
  PAUSADO: 'Pausado',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado'
} as const

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstado, setSelectedEstado] = useState<EstadoProyecto | 'TODOS'>('TODOS')
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaEnum | 'TODAS'>('TODAS')

  // Obtener categorías y estados únicos de los proyectos
  const uniqueCategories = useMemo(() => {
    const categories = new Set(projects.map(p => p.categoria))
    return Array.from(categories).sort()
  }, [projects])

  const uniqueEstados = useMemo(() => {
    const estados = new Set(projects.map(p => p.estado))
    return Array.from(estados).sort()
  }, [projects])

  // Filtrar proyectos basado en los criterios de búsqueda
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' || 
        project.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.codigoInterno && project.codigoInterno.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesEstado = selectedEstado === 'TODOS' || project.estado === selectedEstado
      const matchesCategoria = selectedCategoria === 'TODAS' || project.categoria === selectedCategoria

      return matchesSearch && matchesEstado && matchesCategoria
    })
  }, [projects, searchTerm, selectedEstado, selectedCategoria])

  // Estadísticas calculadas
  const stats = useMemo(() => {
    return {
      total: projects.length,
      completados: projects.filter(p => p.estado === 'COMPLETADO').length,
      enProgreso: projects.filter(p => p.estado === 'EN_PROGRESO').length,
      destacados: projects.filter(p => p.destacado).length
    }
  }, [projects])

  return (
    <div className="space-y-8 max-w-none w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
          <p className="mt-2 text-lg text-gray-600">
            Administra todos los proyectos de MEISA
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-meisa-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Proyecto
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Proyectos</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completados</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.completados}</p>
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
              <p className="text-indigo-600 text-sm font-medium">En Progreso</p>
              <p className="text-3xl font-bold text-indigo-900 mt-1">{stats.enProgreso}</p>
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
              <p className="text-amber-600 text-sm font-medium">Destacados</p>
              <p className="text-3xl font-bold text-amber-900 mt-1">{stats.destacados}</p>
            </div>
            <div className="bg-amber-500 bg-opacity-20 p-3 rounded-lg">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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
                placeholder="Buscar por título, código, cliente o ubicación..."
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Filtro por Estado */}
            <select 
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value as EstadoProyecto | 'TODOS')}
              className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-meisa-blue focus:border-meisa-blue sm:text-sm rounded-md"
            >
              <option value="TODOS">Todos los estados</option>
              {uniqueEstados.map(estado => (
                <option key={estado} value={estado}>
                  {ESTADO_LABELS[estado]}
                </option>
              ))}
            </select>

            {/* Filtro por Categoría */}
            <select 
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value as CategoriaEnum | 'TODAS')}
              className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-meisa-blue focus:border-meisa-blue sm:text-sm rounded-md"
            >
              <option value="TODAS">Todas las categorías</option>
              {uniqueCategories.map(categoria => (
                <option key={categoria} value={categoria}>
                  {CATEGORIA_LABELS[categoria]}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Mostrar resultados de filtrado */}
        {(searchTerm || selectedEstado !== 'TODOS' || selectedCategoria !== 'TODAS') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Mostrando {filteredProjects.length} de {projects.length} proyectos
              {searchTerm && (
                <span className="ml-1">
                  para "<span className="font-medium">{searchTerm}</span>"
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Projects Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredProjects.length === projects.length ? 'Todos los Proyectos' : 'Proyectos Filtrados'}
          </h2>
        </div>
        
        <ProjectsTable projects={filteredProjects} />
      </div>
    </div>
  )
}
"use client"

import { useState, useMemo } from "react"
import { Search, Filter } from "lucide-react"
import MediaCard from "./MediaCard"

interface MediaImage {
  id: string
  url: string
  descripcion: string | null
  proyectoId: string | null
  proyecto: {
    titulo: string
  } | null
}

interface MediaLibraryProps {
  images: MediaImage[]
}

type FilterType = 'all' | 'with-project' | 'without-project'

export default function MediaLibrary({ images }: MediaLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredImages = useMemo(() => {
    let result = images

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(img =>
        img.descripcion?.toLowerCase().includes(search) ||
        img.proyecto?.titulo.toLowerCase().includes(search) ||
        img.url.toLowerCase().includes(search)
      )
    }

    if (filter === 'with-project') {
      result = result.filter(img => img.proyectoId !== null)
    } else if (filter === 'without-project') {
      result = result.filter(img => img.proyectoId === null)
    }

    return result
  }, [images, searchTerm, filter])

  const counts = useMemo(() => ({
    all: images.length,
    withProject: images.filter(img => img.proyectoId !== null).length,
    withoutProject: images.filter(img => img.proyectoId === null).length,
  }), [images])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, proyecto o descripcion..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-meisa-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({counts.all})
          </button>
          <button
            onClick={() => setFilter('with-project')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'with-project'
                ? 'bg-meisa-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Con Proyecto ({counts.withProject})
          </button>
          <button
            onClick={() => setFilter('without-project')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'without-project'
                ? 'bg-meisa-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sin Proyecto ({counts.withoutProject})
          </button>
        </div>
      </div>

      {searchTerm && (
        <div className="text-sm text-gray-600">
          {filteredImages.length} resultado{filteredImages.length !== 1 ? 's' : ''} encontrado{filteredImages.length !== 1 ? 's' : ''}
        </div>
      )}

      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map((image) => (
            <MediaCard key={image.id} image={image} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay imagenes</h3>
          <p className="text-gray-500">
            {searchTerm || filter !== 'all'
              ? 'No se encontraron imagenes con los filtros aplicados'
              : 'Las imagenes subidas apareceran aqui'}
          </p>
        </div>
      )}
    </div>
  )
}

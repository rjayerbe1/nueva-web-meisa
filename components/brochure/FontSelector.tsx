'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, X, Type } from 'lucide-react'
import { getFontsGroupedByCategory, loadFontOnDemand, FontFamily } from '@/lib/fonts'

interface FontSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (fontName: string) => void
  currentFont?: string
}

export function FontSelector({ isOpen, onClose, onSelect, currentFont }: FontSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const fontsGrouped = getFontsGroupedByCategory()

  // Filtrar fuentes según búsqueda y categoría
  const filteredFonts = useMemo(() => {
    const allFonts = Object.entries(fontsGrouped).flatMap(([category, fonts]) =>
      fonts.map(font => ({ ...font, displayCategory: category }))
    )

    let filtered = allFonts

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.displayCategory === selectedCategory)
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(f => f.name.toLowerCase().includes(query))
    }

    return filtered
  }, [searchQuery, selectedCategory, fontsGrouped])

  // Cargar fuente cuando se muestra en el preview
  const handleFontHover = (fontName: string) => {
    loadFontOnDemand(fontName)
  }

  const handleSelectFont = (fontName: string) => {
    loadFontOnDemand(fontName)
    onSelect(fontName)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Seleccionar Fuente</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Búsqueda y filtros */}
        <div className="px-6 py-4 border-b border-gray-200 space-y-3">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar fuente..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categorías */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {Object.keys(fontsGrouped).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de fuentes */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredFonts.length === 0 ? (
            <div className="text-center py-12">
              <Type className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron fuentes</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() => handleSelectFont(font.name)}
                  onMouseEnter={() => handleFontHover(font.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    currentFont === font.name
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{font.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {font.displayCategory}
                    </span>
                  </div>
                  <p
                    style={{ fontFamily: font.name }}
                    className="text-lg text-gray-700"
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p
                    style={{ fontFamily: font.name }}
                    className="text-sm text-gray-600 mt-1"
                  >
                    0123456789 !@#$%^&*()
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredFonts.length} fuente{filteredFonts.length !== 1 ? 's' : ''} disponible{filteredFonts.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

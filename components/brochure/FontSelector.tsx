'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, X, Type, Upload, Trash2, AlertCircle } from 'lucide-react'
import { getFontsGroupedByCategory, loadFontOnDemand, loadCustomFont, addCustomFontToCache, FontFamily } from '@/lib/fonts'
import { FontUploader } from './FontUploader'

interface FontSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (fontName: string) => void
  currentFont?: string
}

interface CustomFontData {
  id: string
  nombre: string
  fontFamily: string
  fileUrl: string
  fileFormat: string
  description?: string
  category?: string
  createdAt: string
}

export function FontSelector({ isOpen, onClose, onSelect, currentFont }: FontSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'system' | 'custom'>('system')
  const [customFonts, setCustomFonts] = useState<CustomFontData[]>([])
  const [showFontUploader, setShowFontUploader] = useState(false)
  const [deletingFont, setDeletingFont] = useState<string | null>(null)
  const fontsGrouped = getFontsGroupedByCategory()

  // Cargar fuentes personalizadas al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadCustomFonts()
    }
  }, [isOpen])

  const loadCustomFonts = async () => {
    try {
      const response = await fetch('/api/fonts/upload')
      if (response.ok) {
        const data = await response.json()
        setCustomFonts(data.fonts || [])
        console.log('✅ Fuentes personalizadas cargadas:', data.fonts?.length || 0)
      }
    } catch (error) {
      console.error('❌ Error cargando fuentes personalizadas:', error)
    }
  }

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

  // Eliminar fuente personalizada
  const handleDeleteFont = async (fontId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta fuente?')) return

    setDeletingFont(fontId)
    try {
      const response = await fetch(`/api/fonts/upload?id=${fontId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        console.log('✅ Fuente eliminada')
        await loadCustomFonts() // Recargar lista
      } else {
        const data = await response.json()
        alert(data.error || 'Error al eliminar la fuente')
      }
    } catch (error) {
      console.error('❌ Error eliminando fuente:', error)
      alert('Error al eliminar la fuente')
    } finally {
      setDeletingFont(null)
    }
  }

  // Cargar fuente cuando se muestra en el preview
  const handleFontHover = (fontName: string) => {
    loadFontOnDemand(fontName)
  }

  const handleSelectFont = (fontName: string, isCustom = false) => {
    if (isCustom) {
      // Para fuentes personalizadas, cargar dinámicamente
      const font = customFonts.find(f => f.fontFamily === fontName)
      if (font) {
        loadCustomFont(font.fontFamily, font.fileUrl, font.fileFormat)
      }
    } else {
      loadFontOnDemand(fontName)
    }
    onSelect(fontName)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
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

          {/* Pestañas */}
          <div className="px-6 pt-4 flex gap-2">
            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'system'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fuentes del Sistema
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'custom'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fuentes Personalizadas ({customFonts.length})
            </button>
          </div>

        {/* Búsqueda y filtros - Solo para fuentes del sistema */}
        {activeTab === 'system' && (
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
        )}

        {/* Header para fuentes personalizadas */}
        {activeTab === 'custom' && (
          <div className="px-6 py-4 border-b border-gray-200">
            <button
              onClick={() => setShowFontUploader(true)}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Subir Nueva Fuente
            </button>
          </div>
        )}

        {/* Lista de fuentes */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === 'system' ? (
            // Fuentes del sistema y Google Fonts
            filteredFonts.length === 0 ? (
              <div className="text-center py-12">
                <Type className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron fuentes</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFonts.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => handleSelectFont(font.name, false)}
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
            )
          ) : (
            // Fuentes personalizadas
            customFonts.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No hay fuentes personalizadas</p>
                <p className="text-sm text-gray-400">
                  Haz clic en "Subir Nueva Fuente" para agregar tus propias fuentes
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {customFonts.map((font) => (
                  <div
                    key={font.id}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      currentFont === font.fontFamily
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => handleSelectFont(font.fontFamily, true)}
                        className="flex-1 text-left"
                        onMouseEnter={() => loadCustomFont(font.fontFamily, font.fileUrl, font.fileFormat)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{font.nombre}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {font.category || 'Personalizada'}
                          </span>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDeleteFont(font.id)}
                        disabled={deletingFont === font.id}
                        className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar fuente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleSelectFont(font.fontFamily, true)}
                      className="w-full text-left"
                    >
                      <p
                        style={{ fontFamily: font.fontFamily }}
                        className="text-lg text-gray-700"
                      >
                        The quick brown fox jumps over the lazy dog
                      </p>
                      <p
                        style={{ fontFamily: font.fontFamily }}
                        className="text-sm text-gray-600 mt-1"
                      >
                        0123456789 !@#$%^&*()
                      </p>
                      {font.description && (
                        <p className="text-xs text-gray-500 mt-2 italic">
                          {font.description}
                        </p>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {activeTab === 'system'
              ? `${filteredFonts.length} fuente${filteredFonts.length !== 1 ? 's' : ''} disponible${filteredFonts.length !== 1 ? 's' : ''}`
              : `${customFonts.length} fuente${customFonts.length !== 1 ? 's' : ''} personalizada${customFonts.length !== 1 ? 's' : ''}`
            }
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

      {/* Modal de subida de fuentes */}
      <FontUploader
        isOpen={showFontUploader}
        onClose={() => setShowFontUploader(false)}
        onFontUploaded={async (fontData) => {
          // Agregar al cache primero
          addCustomFontToCache(fontData.fontFamily, fontData.fileUrl, fontData.fileFormat)
          // Cargar la nueva fuente dinámicamente y esperar a que esté lista
          await loadCustomFont(fontData.fontFamily, fontData.fileUrl, fontData.fileFormat)
          // Recargar lista de fuentes personalizadas
          await loadCustomFonts()
          setShowFontUploader(false)
        }}
      />
    </>
  )
}

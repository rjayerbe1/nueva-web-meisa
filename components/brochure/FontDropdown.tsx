'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search } from 'lucide-react'

interface FontDropdownProps {
  value: string
  onChange: (fontName: string) => void
  fonts: string[]
  customFonts?: string[]
}

export function FontDropdown({ value, onChange, fonts, customFonts = [] }: FontDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Combinar todas las fuentes
  const allFonts = [...fonts, ...customFonts]

  // Filtrar fuentes según búsqueda
  const filteredFonts = searchQuery
    ? allFonts.filter(font => font.toLowerCase().includes(searchQuery.toLowerCase()))
    : allFonts

  // Calcular posición del dropdown cuando se abre
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [isOpen])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (fontName: string) => {
    onChange(fontName)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <>
      {/* Botón para abrir dropdown */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        style={{ fontFamily: value }}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menú desplegable - Renderizado en portal */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[10000] bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`
          }}
        >
          {/* Barra de búsqueda */}
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar fuente..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Lista de fuentes */}
          <div className="overflow-y-auto max-h-64">
            {filteredFonts.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No se encontraron fuentes
              </div>
            ) : (
              <>
                {/* Fuentes del sistema y Google */}
                {filteredFonts.filter(f => fonts.includes(f)).map((fontName) => (
                  <button
                    key={fontName}
                    type="button"
                    onClick={() => handleSelect(fontName)}
                    className={`w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      value === fontName ? 'bg-blue-100' : ''
                    }`}
                    style={{ fontFamily: fontName }}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {fontName}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: fontName }}>
                        The quick brown fox jumps over the lazy dog
                      </span>
                    </div>
                  </button>
                ))}

                {/* Fuentes personalizadas */}
                {customFonts.length > 0 && filteredFonts.some(f => customFonts.includes(f)) && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-t border-gray-200">
                      FUENTES PERSONALIZADAS
                    </div>
                    {filteredFonts.filter(f => customFonts.includes(f)).map((fontName) => (
                      <button
                        key={`custom-${fontName}`}
                        type="button"
                        onClick={() => handleSelect(fontName)}
                        className={`w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          value === fontName ? 'bg-blue-100' : ''
                        }`}
                        style={{ fontFamily: fontName }}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {fontName}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: fontName }}>
                            The quick brown fox jumps over the lazy dog
                          </span>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { Settings, X } from 'lucide-react'

interface GlobalIconSizeConfigProps {
  onUpdate?: () => void
}

export function GlobalIconSizeConfig({ onUpdate }: GlobalIconSizeConfigProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [iconSize, setIconSize] = useState(48)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Cargar configuración actual
  useEffect(() => {
    if (isOpen) {
      loadConfig()
    }
  }, [isOpen])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/site-config')
      if (response.ok) {
        const data = await response.json()
        setIconSize(data.categoryIconSize || 48)
      }
    } catch (error) {
      console.error('Error loading config:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoryIconSize: iconSize
        })
      })

      if (response.ok) {
        setIsOpen(false)
        if (onUpdate) {
          onUpdate()
        }
        // Recargar la página para ver los cambios
        window.location.reload()
      } else {
        alert('Error al guardar la configuración')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Botón para abrir modal */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        title="Configurar tamaño global de iconos"
      >
        <Settings className="w-3.5 h-3.5" />
        Tamaño Global
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Configuración Global de Iconos
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              <p className="text-sm text-gray-600">
                Este tamaño se aplicará a todas las categorías de forma consistente en todo el sitio.
              </p>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Cargando...</div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño de Iconos de Categorías
                  </label>
                  <div className="space-y-3">
                    {/* Slider para tamaño */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">
                        Tamaño: {iconSize} ({iconSize * 4}px)
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="80"
                        step="4"
                        value={iconSize}
                        onChange={(e) => setIconSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Pequeño (12)</span>
                        <span>Mediano (48)</span>
                        <span>Grande (80)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      El tamaño se aplica en todas las tarjetas de categoría del sitio.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveConfig}
                disabled={saving || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

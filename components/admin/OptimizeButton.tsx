"use client"

import { useState } from 'react'
import { Zap, Loader2, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { BeforeAfterComparison } from './BeforeAfterComparison'

interface OptimizeButtonProps {
  imageUrl: string
  onOptimizeComplete: (optimizedUrl: string) => void
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  className?: string
  showLabel?: boolean
}

interface OptimizationResult {
  url: string
  originalSize: number
  optimizedSize: number
  reduction: number
  format: string
  dimensions: { width: number; height: number }
}

export function OptimizeButton({
  imageUrl,
  onOptimizeComplete,
  disabled = false,
  size = 'sm',
  variant = 'secondary',
  className = '',
  showLabel = true
}: OptimizeButtonProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)

  // Configuración
  const [quality, setQuality] = useState(85)
  const [format, setFormat] = useState<'auto' | 'jpeg' | 'webp' | 'png'>('auto')

  const handleOptimize = async () => {
    if (!imageUrl) {
      toast.error('No hay imagen para optimizar')
      return
    }

    setIsOptimizing(true)
    setShowSettings(false)
    const toastId = toast.loading('Optimizando imagen...\nEsto puede tomar 10-30 segundos')

    try {
      const response = await fetch('/api/optimize-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          quality,
          format
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al optimizar imagen')
      }

      // Mostrar resultados
      const sizeMB = (data.originalSize / 1024 / 1024).toFixed(2)
      const optimizedMB = (data.optimizedSize / 1024 / 1024).toFixed(2)

      toast.success(
        `Imagen optimizada exitosamente\n${sizeMB}MB → ${optimizedMB}MB (${data.reduction}% reducido)`,
        { id: toastId }
      )

      setOptimizationResult(data)
      setShowComparison(true)
    } catch (error) {
      console.error('Error optimizando imagen:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al optimizar imagen',
        { id: toastId }
      )
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleAccept = () => {
    if (optimizationResult) {
      onOptimizeComplete(optimizationResult.url)
      setShowComparison(false)
      setOptimizationResult(null)
      toast.success('Imagen optimizada aplicada')
    }
  }

  const handleDiscard = () => {
    setShowComparison(false)
    setOptimizationResult(null)
    toast.info('Imagen optimizada descartada')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <>
      <Button
        type="button"
        size={size}
        variant={variant}
        onClick={() => setShowSettings(true)}
        disabled={disabled || isOptimizing || !imageUrl}
        className={className}
        title="Optimizar imagen sin perder calidad"
      >
        {isOptimizing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {showLabel && <span className="ml-2">Optimizando...</span>}
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            {showLabel && (
              <span className="ml-2 flex flex-col items-start">
                <span className="font-medium">Optimizar</span>
                <span className="text-xs opacity-70">Reduce tamaño</span>
              </span>
            )}
          </>
        )}
      </Button>

      {/* Modal de Configuración */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Optimizar Imagen</h3>
              <Settings2 className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
              {/* Calidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calidad: {quality}%
                </label>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="5"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Menor calidad</span>
                  <span className="font-medium">Recomendado: 85%</span>
                  <span>Mayor calidad</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  85-90% es casi indistinguible del original pero reduce significativamente el tamaño
                </p>
              </div>

              {/* Formato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato de Salida
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('auto')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      format === 'auto'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('jpeg')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      format === 'jpeg'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    JPEG
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('webp')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      format === 'webp'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    WebP
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('png')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      format === 'png'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    PNG
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {format === 'auto' && 'Mantiene el formato original'}
                  {format === 'jpeg' && 'Mejor para fotografías'}
                  {format === 'webp' && 'Mejor compresión, ideal para web moderna'}
                  {format === 'png' && 'Para imágenes con transparencia'}
                </p>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>💡 Tip:</strong> Las imágenes upscaleadas suelen quedar muy pesadas.
                  Esta herramienta las optimiza manteniendo la calidad visual.
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleOptimize}
                className="flex-1"
              >
                Optimizar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de comparación */}
      {showComparison && optimizationResult && (
        <BeforeAfterComparison
          beforeUrl={imageUrl}
          afterUrl={optimizationResult.url}
          beforeLabel={`Original (${formatFileSize(optimizationResult.originalSize)})`}
          afterLabel={`Optimizada (${formatFileSize(optimizationResult.optimizedSize)})`}
          onAccept={handleAccept}
          onDiscard={handleDiscard}
          title="Comparación: Optimización de Imagen"
          description={`Reducción de ${optimizationResult.reduction}% • ${optimizationResult.dimensions.width}x${optimizationResult.dimensions.height}px • ${optimizationResult.format.toUpperCase()}`}
        />
      )}
    </>
  )
}

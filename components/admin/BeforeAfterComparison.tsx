"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { X, Check, Download, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BeforeAfterComparisonProps {
  beforeUrl: string
  afterUrl: string
  beforeLabel?: string
  afterLabel?: string
  onAccept: () => void
  onDiscard: () => void
  title?: string
  description?: string
}

export function BeforeAfterComparison({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Original',
  afterLabel = 'Procesada',
  onAccept,
  onDiscard,
  title = 'Comparación de Resultados',
  description = 'Arrastra el divisor para comparar'
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return

    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleDownloadBoth = async () => {
    try {
      const toastId = toast.loading('Descargando imágenes...')

      // Descargar imagen ANTES
      const beforeResponse = await fetch(beforeUrl)
      const beforeBlob = await beforeResponse.blob()
      const beforeLink = document.createElement('a')
      beforeLink.href = URL.createObjectURL(beforeBlob)
      beforeLink.download = `${beforeLabel.toLowerCase()}.png`
      beforeLink.click()
      URL.revokeObjectURL(beforeLink.href)

      // Pequeño delay para que los navegadores no bloqueen la segunda descarga
      await new Promise(resolve => setTimeout(resolve, 500))

      // Descargar imagen DESPUÉS
      const afterResponse = await fetch(afterUrl)
      const afterBlob = await afterResponse.blob()
      const afterLink = document.createElement('a')
      afterLink.href = URL.createObjectURL(afterBlob)
      afterLink.download = `${afterLabel.toLowerCase()}.png`
      afterLink.click()
      URL.revokeObjectURL(afterLink.href)

      toast.success('Imágenes descargadas exitosamente', { id: toastId })
    } catch (error) {
      console.error('Error descargando imágenes:', error)
      toast.error('Error al descargar imágenes')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <button
            type="button"
            onClick={onDiscard}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparador de imágenes */}
        <div className="flex-1 p-6 overflow-auto">
          <div
            ref={containerRef}
            className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden cursor-col-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
          >
            {/* Imagen DESPUÉS (fondo) */}
            <div className="absolute inset-0">
              <Image
                src={afterUrl}
                alt={afterLabel}
                fill
                className="object-contain"
                unoptimized
                priority
              />
              {/* Etiqueta DESPUÉS */}
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                {afterLabel}
              </div>
            </div>

            {/* Imagen ANTES (con clip-path) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
              }}
            >
              <Image
                src={beforeUrl}
                alt={beforeLabel}
                fill
                className="object-contain"
                unoptimized
                priority
              />
              {/* Etiqueta ANTES */}
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                {beforeLabel}
              </div>
            </div>

            {/* Divisor arrastrable */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Handle del divisor */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 shadow-xl flex items-center justify-center border-2 border-blue-600">
                <Move className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Indicador de posición */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>{beforeLabel}: {sliderPosition.toFixed(0)}%</span>
            <span className="text-gray-400">|</span>
            <span>{afterLabel}: {(100 - sliderPosition).toFixed(0)}%</span>
          </div>
        </div>

        {/* Footer con botones de acción */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadBoth}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar Ambas
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onDiscard}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Descartar
            </Button>
            <Button
              type="button"
              onClick={onAccept}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <Check className="w-4 h-4" />
              Aceptar y Usar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

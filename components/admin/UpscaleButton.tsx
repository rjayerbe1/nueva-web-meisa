"use client"

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { BeforeAfterComparison } from './BeforeAfterComparison'

interface UpscaleButtonProps {
  imageUrl: string
  onUpscaleComplete: (upscaledUrl: string) => void
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  className?: string
  showLabel?: boolean
}

export function UpscaleButton({
  imageUrl,
  onUpscaleComplete,
  disabled = false,
  size = 'sm',
  variant = 'secondary',
  className = '',
  showLabel = true
}: UpscaleButtonProps) {
  const [isUpscaling, setIsUpscaling] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null)

  const handleUpscale = async () => {
    if (!imageUrl) {
      toast.error('No hay imagen para upscalear')
      return
    }

    setIsUpscaling(true)
    const toastId = toast.loading('Upscaleando imagen con AI (4x)...\nEsto puede tomar 30-60 segundos')

    try {
      const response = await fetch('/api/upscale-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al upscalear imagen')
      }

      // Éxito - Mostrar modal de comparación
      toast.success('Imagen upscaled exitosamente. Compara y decide', { id: toastId })
      setUpscaledUrl(data.upscaledUrl)
      setShowComparison(true)
    } catch (error) {
      console.error('Error upscaleando imagen:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al upscalear imagen',
        { id: toastId }
      )
    } finally {
      setIsUpscaling(false)
    }
  }

  const handleAccept = () => {
    if (upscaledUrl) {
      onUpscaleComplete(upscaledUrl)
      setShowComparison(false)
      setUpscaledUrl(null)
      toast.success('Imagen upscaled aplicada')
    }
  }

  const handleDiscard = () => {
    setShowComparison(false)
    setUpscaledUrl(null)
    toast.info('Imagen upscaled descartada')
  }

  return (
    <>
      <Button
        size={size}
        variant={variant}
        onClick={handleUpscale}
        disabled={disabled || isUpscaling || !imageUrl}
        className={className}
        title="~$0.04 USD por imagen"
      >
        {isUpscaling ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {showLabel && <span className="ml-2">Upscaling...</span>}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            {showLabel && (
              <span className="ml-2 flex flex-col items-start">
                <span className="font-medium">Upscale 4x</span>
                <span className="text-xs opacity-70">~$0.04 USD</span>
              </span>
            )}
          </>
        )}
      </Button>

      {/* Modal de comparación */}
      {showComparison && upscaledUrl && (
        <BeforeAfterComparison
          beforeUrl={imageUrl}
          afterUrl={upscaledUrl}
          beforeLabel="Original"
          afterLabel="Upscaled 4x"
          onAccept={handleAccept}
          onDiscard={handleDiscard}
          title="Comparación: Upscale 4x"
          description="Arrastra el divisor para comparar la calidad. ¿Notas la mejora?"
        />
      )}
    </>
  )
}

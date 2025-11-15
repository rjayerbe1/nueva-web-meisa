"use client"

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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

      // Éxito
      toast.success('Imagen upscaled exitosamente (4x mejor calidad)', { id: toastId })
      onUpscaleComplete(data.upscaledUrl)
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

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleUpscale}
      disabled={disabled || isUpscaling || !imageUrl}
      className={className}
    >
      {isUpscaling ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showLabel && <span className="ml-2">Upscaling...</span>}
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          {showLabel && <span className="ml-2">Upscale 4x</span>}
        </>
      )}
    </Button>
  )
}

import { useState, useEffect } from 'react'
import { ImageDimensions } from '@/lib/aspectRatioHelpers'

/**
 * Hook para obtener las dimensiones de una imagen desde su URL
 */
export function useImageDimensions(imageUrl: string | null | undefined) {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!imageUrl) {
      setDimensions(null)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const img = new Image()

    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
      setLoading(false)
    }

    img.onerror = () => {
      setError('Error cargando la imagen')
      setLoading(false)
      setDimensions(null)
    }

    // Agregar timestamp para evitar cache
    const urlWithCacheBuster = imageUrl.includes('?')
      ? `${imageUrl}&_t=${Date.now()}`
      : `${imageUrl}?_t=${Date.now()}`

    img.src = urlWithCacheBuster

    // Cleanup
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imageUrl])

  return { dimensions, loading, error }
}

import { useState, useEffect } from 'react'
import { HeroImageConfig, defaultHeroImages } from '@/lib/hero-config'

export function useHeroImages() {
  const [images, setImages] = useState<HeroImageConfig>(defaultHeroImages)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/admin/hero-images')
        const result = await response.json()

        if (result.success) {
          setImages(result.data)
        }
      } catch (error) {
        console.error('Error cargando imágenes del hero:', error)
        // Usar imágenes por defecto en caso de error
        setImages(defaultHeroImages)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  return { images, loading }
}

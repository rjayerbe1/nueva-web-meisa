'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Upload, Save, RotateCcw, Eye } from 'lucide-react'
import { HeroImageConfig } from '@/lib/hero-config'

export default function HeroImagesAdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [heroImages, setHeroImages] = useState<HeroImageConfig>({
    leftColumn: '',
    centerTop: '',
    centerBottom: '',
    rightTop: '',
    rightBottom: '',
  })

  const [originalImages, setOriginalImages] = useState<HeroImageConfig>({
    leftColumn: '',
    centerTop: '',
    centerBottom: '',
    rightTop: '',
    rightBottom: '',
  })

  // Verificar autenticación
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    if (status === 'authenticated' && session?.user.role !== 'ADMIN') {
      router.push('/admin')
    }
  }, [status, session, router])

  // Cargar configuración actual
  useEffect(() => {
    fetchHeroImages()
  }, [])

  const fetchHeroImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/hero-images')
      const result = await response.json()

      if (result.success) {
        setHeroImages(result.data)
        setOriginalImages(result.data)
      }
    } catch (error) {
      console.error('Error cargando imágenes:', error)
      setMessage('Error cargando configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (position: keyof HeroImageConfig, url: string) => {
    setHeroImages(prev => ({
      ...prev,
      [position]: url
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage('')

      const response = await fetch('/api/admin/hero-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroImages)
      })

      const result = await response.json()

      if (result.success) {
        setMessage('✓ Configuración guardada exitosamente')
        setOriginalImages(heroImages)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Error: ' + result.error)
      }
    } catch (error) {
      console.error('Error guardando:', error)
      setMessage('Error guardando configuración')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setHeroImages(originalImages)
    setMessage('')
  }

  const hasChanges = JSON.stringify(heroImages) !== JSON.stringify(originalImages)

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestionar Imágenes del Hero
              </h1>
              <p className="text-gray-600 mt-1">
                Configura las 5 imágenes que se muestran en la sección Hero de la página principal
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver sitio
              </a>
              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Revertir
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-colors ${
                  hasChanges && !saving
                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>

          {/* Mensaje de estado */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.startsWith('✓')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Grid de imágenes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda */}
          <ImageUploadCard
            title="Columna Izquierda"
            description="Imagen que cubre el logo al hacer scroll (Desktop)"
            imageUrl={heroImages.leftColumn}
            onChange={(url) => handleImageChange('leftColumn', url)}
            aspectRatio="3/5"
          />

          {/* Columna Central */}
          <div className="space-y-6">
            <ImageUploadCard
              title="Columna Central - Superior"
              description="Imagen de fondo de la columna central"
              imageUrl={heroImages.centerTop}
              onChange={(url) => handleImageChange('centerTop', url)}
              aspectRatio="3/5"
            />
            <ImageUploadCard
              title="Columna Central - Inferior"
              description="Imagen que se revela con scroll en centro"
              imageUrl={heroImages.centerBottom}
              onChange={(url) => handleImageChange('centerBottom', url)}
              aspectRatio="3/5"
            />
          </div>

          {/* Columna Derecha */}
          <div className="space-y-6">
            <ImageUploadCard
              title="Columna Derecha - Superior"
              description="Imagen de fondo de la columna derecha"
              imageUrl={heroImages.rightTop}
              onChange={(url) => handleImageChange('rightTop', url)}
              aspectRatio="3/5"
            />
            <ImageUploadCard
              title="Columna Derecha - Inferior"
              description="Imagen que se revela con scroll a la derecha"
              imageUrl={heroImages.rightBottom}
              onChange={(url) => handleImageChange('rightBottom', url)}
              aspectRatio="3/5"
            />
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">📐 Dimensiones Recomendadas</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Aspect Ratio:</strong> 3:5 (Vertical/Retrato)</li>
            <li>• <strong>Dimensiones ideales:</strong> 1200 x 2000 px</li>
            <li>• <strong>Peso:</strong> 200-500 KB por imagen</li>
            <li>• <strong>Formato:</strong> JPG o PNG</li>
            <li>• <strong>Tip:</strong> El contenido importante debe estar en el centro de la imagen</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Componente para subir cada imagen
function ImageUploadCard({
  title,
  description,
  imageUrl,
  onChange,
  aspectRatio
}: {
  title: string
  description: string
  imageUrl: string
  onChange: (url: string) => void
  aspectRatio: string
}) {
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      // Subir a /public/images/hero/
      const formData = new FormData()
      formData.append('file', file)

      // Crear URL temporal para mostrar mientras sube
      const tempUrl = URL.createObjectURL(file)
      onChange(tempUrl)

      // Aquí podrías implementar la subida real a Uploadcare o al servidor
      // Por ahora, simplificado para usar archivos locales
      const fileName = `hero-${Date.now()}-${file.name}`
      const publicUrl = `/images/hero/${fileName}`

      // Simular subida (en producción, esto sería una llamada real al servidor)
      await new Promise(resolve => setTimeout(resolve, 1000))

      onChange(publicUrl)
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      alert('Error subiendo la imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="p-4">
        {/* Preview */}
        <div
          className="relative w-full bg-gray-100 rounded-lg overflow-hidden mb-4"
          style={{ aspectRatio }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Upload className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Input URL manual */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de la imagen
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/hero/mi-imagen.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Botón subir archivo */}
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <div className={`w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            <Upload className="w-5 h-5 mx-auto mb-1 text-gray-400" />
            <span className="text-sm text-gray-600">
              {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
            </span>
          </div>
        </label>
      </div>
    </div>
  )
}

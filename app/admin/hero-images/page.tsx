'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Upload, Save, RotateCcw, Eye, Monitor, Smartphone, Crop } from 'lucide-react'
import { HeroImageConfig } from '@/lib/hero-config'
import { UpscaleButton } from '@/components/admin/UpscaleButton'
import ImageCropModal from '@/components/admin/ImageCropModal'

type ViewMode = 'desktop' | 'mobile'

export default function HeroImagesAdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')

  const [heroImages, setHeroImages] = useState<HeroImageConfig>({
    leftColumn: '',
    centerTop: '',
    centerBottom: '',
    rightTop: '',
    rightBottom: '',
    mobile: {
      row2Top: undefined,
      row2Bottom: undefined,
      row3Top: undefined,
      row3Bottom: undefined,
    }
  })

  const [originalImages, setOriginalImages] = useState<HeroImageConfig>(heroImages)

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
        const data = result.data
        // Asegurar que mobile existe
        if (!data.mobile) {
          data.mobile = {}
        }
        setHeroImages(data)
        setOriginalImages(data)
      }
    } catch (error) {
      console.error('Error cargando imágenes:', error)
      setMessage('Error cargando configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (position: keyof Omit<HeroImageConfig, 'mobile'>, url: string) => {
    setHeroImages(prev => ({
      ...prev,
      [position]: url
    }))
  }

  const handleMobileImageChange = (position: keyof NonNullable<HeroImageConfig['mobile']>, url: string) => {
    setHeroImages(prev => ({
      ...prev,
      mobile: {
        ...prev.mobile,
        [position]: url || undefined
      }
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
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestionar Imágenes del Hero
              </h1>
              <p className="text-gray-600 mt-1">
                Configura las imágenes que se muestran en la sección Hero (Desktop y Mobile)
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

          {/* Tabs Desktop/Mobile */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setViewMode('desktop')}
              className={`inline-flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                viewMode === 'desktop'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Desktop (3:5 Vertical)
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`inline-flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                viewMode === 'mobile'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Mobile (5:3 Landscape)
            </button>
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

        {/* Desktop View */}
        {viewMode === 'desktop' && (
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
        )}

        {/* Mobile View */}
        {viewMode === 'mobile' && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 mb-3">
                💡 <strong>Opcional:</strong> Si no configuras imágenes específicas para móvil, se usarán las de desktop automáticamente.
                <br />
                La Fila 1 en móvil muestra el logo + contenido (sin imagen).
              </p>
              <div className="bg-white rounded-lg p-3 mt-3 border border-blue-300">
                <p className="text-xs text-blue-900 font-bold mb-2">📱 ¿Cuándo se usan estas imágenes?</p>
                <ul className="text-xs text-blue-800 space-y-1 ml-4">
                  <li>✅ <strong>Celular en Portrait (vertical):</strong> Usa estas imágenes 5:3 landscape</li>
                  <li>✅ <strong>Celular en Landscape (rotado):</strong> Usa las imágenes Desktop 3:5 vertical</li>
                  <li>• El breakpoint es 768px de ancho (Tailwind md:)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              {/* Fila 2 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fila 2 (Segunda fila en móvil)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploadCard
                    title="Fila 2 - Fondo"
                    description="Imagen de fondo (usa centerTop si está vacío)"
                    imageUrl={heroImages.mobile?.row2Top || heroImages.centerTop}
                    onChange={(url) => handleMobileImageChange('row2Top', url)}
                    aspectRatio="5/3"
                    placeholder={`Por defecto: ${heroImages.centerTop}`}
                  />
                  <ImageUploadCard
                    title="Fila 2 - Reveal"
                    description="Imagen que se revela con scroll (usa centerBottom si está vacío)"
                    imageUrl={heroImages.mobile?.row2Bottom || heroImages.centerBottom}
                    onChange={(url) => handleMobileImageChange('row2Bottom', url)}
                    aspectRatio="5/3"
                    placeholder={`Por defecto: ${heroImages.centerBottom}`}
                  />
                </div>
              </div>

              {/* Fila 3 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fila 3 (Tercera fila en móvil)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploadCard
                    title="Fila 3 - Fondo"
                    description="Imagen de fondo (usa rightTop si está vacío)"
                    imageUrl={heroImages.mobile?.row3Top || heroImages.rightTop}
                    onChange={(url) => handleMobileImageChange('row3Top', url)}
                    aspectRatio="5/3"
                    placeholder={`Por defecto: ${heroImages.rightTop}`}
                  />
                  <ImageUploadCard
                    title="Fila 3 - Reveal"
                    description="Imagen que se revela con scroll (usa rightBottom si está vacío)"
                    imageUrl={heroImages.mobile?.row3Bottom || heroImages.rightBottom}
                    onChange={(url) => handleMobileImageChange('row3Bottom', url)}
                    aspectRatio="5/3"
                    placeholder={`Por defecto: ${heroImages.rightBottom}`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info adicional */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">📐 Dimensiones Recomendadas</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-bold mb-1">Desktop (3:5 Vertical):</h4>
              <ul className="space-y-1 ml-4">
                <li>• Aspect Ratio: 3:5 (Vertical/Retrato)</li>
                <li>• Dimensiones: 1200 x 2000 px</li>
                <li>• Formato: JPG o PNG</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-1">Mobile (5:3 Landscape):</h4>
              <ul className="space-y-1 ml-4">
                <li>• Aspect Ratio: 5:3 (Landscape - más ancho que alto)</li>
                <li>• Dimensiones: 1000 x 600 px</li>
                <li>• Formato: JPG o PNG</li>
              </ul>
            </div>
          </div>
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
  aspectRatio,
  placeholder
}: {
  title: string
  description: string
  imageUrl: string
  onChange: (url: string) => void
  aspectRatio: string
  placeholder?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Convertir aspectRatio string "3/5" a número
  const aspectRatioNumber = (() => {
    const parts = aspectRatio.split('/')
    return parseFloat(parts[0]) / parseFloat(parts[1])
  })()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Abrir modal de crop
    setSelectedFile(file)
    setShowCropModal(true)
  }

  const handleCropComplete = (croppedUrl: string) => {
    // La URL ya viene de GCS desde el modal
    onChange(croppedUrl)
    setSelectedFile(null)
  }

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      // Subir directamente sin crop
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'hero')

      const response = await fetch('/api/admin/upload-to-gcs', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error subiendo imagen')
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      alert(error instanceof Error ? error.message : 'Error subiendo la imagen')
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
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4">
              <Upload className="w-8 h-8 mb-2" />
              {placeholder && (
                <p className="text-xs text-center">{placeholder}</p>
              )}
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

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Botón con Recorte */}
          <label className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <div className={`w-full px-3 py-2 border-2 border-blue-500 bg-blue-50 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
              <Crop className="w-4 h-4 mx-auto mb-1 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                Con Recorte
              </span>
            </div>
          </label>

          {/* Botón sin recorte (directo) */}
          <label className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleDirectUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className={`w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
              <Upload className="w-4 h-4 mx-auto mb-1 text-gray-400" />
              <span className="text-xs text-gray-600">
                {uploading ? 'Subiendo...' : 'Subir Directo'}
              </span>
            </div>
          </label>
        </div>

        {/* Botón Upscale */}
        {imageUrl && imageUrl.includes('storage.googleapis.com') && (
          <div className="mb-3">
            <UpscaleButton
              imageUrl={imageUrl}
              onUpscaleComplete={(upscaledUrl) => onChange(upscaledUrl)}
              size="default"
              variant="outline"
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Modal de Crop */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false)
          setSelectedFile(null)
        }}
        onCropComplete={handleCropComplete}
        imageFile={selectedFile}
        aspectRatio={aspectRatioNumber}
        folder="hero"
      />
    </div>
  )
}

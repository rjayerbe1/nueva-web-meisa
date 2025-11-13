'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Search,
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  Check,
  AlertCircle,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from '@/hooks/use-toast'
import { optimizeImageComplete, validateImageFile, cleanupImageUrls, type OptimizedImageResult } from '@/lib/imageOptimizer'

interface MediaFile {
  id: string
  url: string
  name: string
  type: string
  size: number
  category: string
  uploadedAt: string
}

interface ImageSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (imageUrl: string, isSmall: boolean, base64?: string) => void
}

export function ImageSelectorModal({
  isOpen,
  onClose,
  onSelectImage,
}: ImageSelectorModalProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery')

  // Gallery state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  // Upload state
  const [isDragging, setIsDragging] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [optimizedResult, setOptimizedResult] = useState<OptimizedImageResult | null>(null)

  // Cargar archivos de media al abrir
  useEffect(() => {
    if (isOpen && activeTab === 'gallery') {
      fetchMediaFiles()
    }
  }, [isOpen, activeTab])

  const fetchMediaFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/media?category=brochures')
      if (!response.ok) throw new Error('Error al cargar archivos')

      const data = await response.json()
      if (data.success) {
        setMediaFiles(data.files || [])
      }
    } catch (error) {
      console.error('Error fetching media files:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los archivos de media',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar archivos por búsqueda
  const filteredFiles = mediaFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelected(files[0])
    }
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelected(files[0])
    }
  }, [])

  const handleFileSelected = async (file: File) => {
    // Validar archivo
    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast({
        title: 'Archivo inválido',
        description: validation.error,
        variant: 'destructive'
      })
      return
    }

    setUploadFile(file)

    // Mostrar preview inmediato
    const previewUrl = URL.createObjectURL(file)
    setUploadPreview(previewUrl)

    // Optimizar en segundo plano
    toast({
      title: 'Optimizando imagen...',
      description: 'Estamos procesando tu imagen para mejor rendimiento'
    })

    try {
      const result = await optimizeImageComplete(file)
      setOptimizedResult(result)

      toast({
        title: 'Imagen optimizada',
        description: `Reducido a ${(result.optimized.size / 1024).toFixed(0)}KB`
      })
    } catch (error) {
      console.error('Error optimizando imagen:', error)
      toast({
        title: 'Error',
        description: 'No se pudo optimizar la imagen, pero aún puedes usarla',
        variant: 'destructive'
      })
    }
  }

  const handleSelectFromGallery = () => {
    if (!selectedImageUrl) {
      console.warn('⚠️ [ImageSelector] No hay imagen seleccionada')
      return
    }

    console.log('✅ [ImageSelector] Seleccionando imagen de galería:', {
      url: selectedImageUrl,
      isSmall: false
    })

    // Las imágenes de la galería ya están optimizadas y en el servidor
    onSelectImage(selectedImageUrl, false)
    handleClose()
  }

  const handleUploadAndSelect = async () => {
    if (!uploadFile || !optimizedResult) return

    setUploading(true)

    try {
      // Si la imagen es pequeña, usar Base64 directamente
      if (optimizedResult.shouldUseBase64 && optimizedResult.base64) {
        console.log('📦 [ImageSelector] Usando Base64 para imagen pequeña')
        onSelectImage(optimizedResult.base64, true, optimizedResult.base64)
        handleClose()
        return
      }

      // Si es grande, subir al servidor
      console.log('📤 [ImageSelector] Subiendo imagen al servidor...')

      const formData = new FormData()
      formData.append('file', optimizedResult.optimized.file)
      formData.append('category', 'brochures')

      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Error al subir archivo')
      }

      const uploadData = await uploadResponse.json()

      // Guardar en la base de datos de media
      const mediaResponse = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadData.url,
          name: uploadFile.name,
          type: uploadFile.type,
          size: optimizedResult.optimized.size,
          category: 'brochures',
        }),
      })

      if (!mediaResponse.ok) {
        const errorData = await mediaResponse.json()
        console.error('❌ [ImageSelector] Error guardando en media:', errorData)
        throw new Error(errorData.error || 'Error al guardar en galería')
      }

      const mediaData = await mediaResponse.json()
      console.log('✅ [ImageSelector] Archivo guardado en galería:', mediaData)

      toast({
        title: 'Imagen subida',
        description: 'La imagen se ha agregado correctamente a la galería'
      })

      onSelectImage(uploadData.url, false)
      handleClose()
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    // Limpiar state
    setSelectedImageUrl(null)
    setUploadFile(null)
    setUploadPreview(null)
    setOptimizedResult(null)
    setSearchQuery('')
    setActiveTab('gallery')

    // Limpiar URLs
    if (uploadPreview) {
      cleanupImageUrls(uploadPreview)
    }
    if (optimizedResult) {
      cleanupImageUrls(
        optimizedResult.original.url,
        optimizedResult.optimized.url,
        optimizedResult.thumbnail.url
      )
    }

    onClose()
  }

  const removeUploadedFile = () => {
    if (uploadPreview) {
      cleanupImageUrls(uploadPreview)
    }
    if (optimizedResult) {
      cleanupImageUrls(
        optimizedResult.original.url,
        optimizedResult.optimized.url,
        optimizedResult.thumbnail.url
      )
    }

    setUploadFile(null)
    setUploadPreview(null)
    setOptimizedResult(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Seleccionar Imagen</DialogTitle>
          <DialogDescription>
            Elige una imagen de la galería o sube una nueva
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'gallery' | 'upload')} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery">
              <ImageIcon className="w-4 h-4 mr-2" />
              Galería de Media
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Subir Nueva
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: GALERÍA DE MEDIA */}
          <TabsContent value="gallery" className="flex-1 flex flex-col overflow-hidden mt-4">
            {/* Búsqueda */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar imágenes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Grid de imágenes */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No hay imágenes</p>
                  <p className="text-sm">Sube tu primera imagen en la pestaña "Subir Nueva"</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 pb-4">
                  {filteredFiles.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedImageUrl(file.url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        selectedImageUrl === file.url
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {selectedImageUrl === file.url && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <div className="bg-blue-500 rounded-full p-2">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con botones */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleSelectFromGallery}
                disabled={!selectedImageUrl}
              >
                Agregar Imagen
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: SUBIR NUEVA */}
          <TabsContent value="upload" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex-1 flex flex-col overflow-y-auto">
              {!uploadFile ? (
                /* Drop zone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload className={`w-16 h-16 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Arrastra una imagen aquí
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    o haz clic para seleccionar
                  </p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>Seleccionar archivo</span>
                    </Button>
                  </label>
                  <p className="text-xs text-gray-400 mt-4">
                    PNG, JPEG, GIF, WebP, SVG - Máx 10MB
                  </p>
                </div>
              ) : (
                /* Preview de imagen seleccionada */
                <div className="flex-1 flex flex-col">
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                    {uploadPreview && (
                      <Image
                        src={uploadPreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    )}
                    <button
                      onClick={removeUploadedFile}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info de la imagen */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium">{uploadFile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tamaño original:</span>
                      <span className="font-medium">{(uploadFile.size / 1024).toFixed(2)} KB</span>
                    </div>
                    {optimizedResult && (
                      <>
                        <div className="flex justify-between text-green-600">
                          <span>Tamaño optimizado:</span>
                          <span className="font-medium">
                            {(optimizedResult.optimized.size / 1024).toFixed(2)} KB
                            <span className="text-xs ml-1">
                              (-{(((uploadFile.size - optimizedResult.optimized.size) / uploadFile.size) * 100).toFixed(0)}%)
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dimensiones:</span>
                          <span className="font-medium">
                            {optimizedResult.optimized.width} × {optimizedResult.optimized.height}px
                          </span>
                        </div>
                        {optimizedResult.shouldUseBase64 && (
                          <div className="flex items-center gap-2 text-blue-600 text-xs">
                            <AlertCircle className="w-4 h-4" />
                            <span>Imagen pequeña - Se embebará en el documento</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer con botones */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleUploadAndSelect}
                disabled={!uploadFile || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  'Agregar Imagen'
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

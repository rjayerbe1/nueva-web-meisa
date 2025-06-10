'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Copy,
  Search,
  Grid3X3,
  List,
  Check,
  X,
  Plus,
  Folder,
  FolderOpen
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

interface MediaFile {
  id: string
  url: string
  name: string
  type: string
  size: number
  category: string
  uploadedAt: string
}

interface MediaManagerProps {
  onSelectImage?: (url: string) => void
  selectedImage?: string
  showSelector?: boolean
}

const imageCategories = [
  { value: 'hero', label: 'Imágenes Hero', color: 'bg-blue-100 text-blue-800' },
  { value: 'servicios', label: 'Servicios', color: 'bg-green-100 text-green-800' },
  { value: 'proyectos', label: 'Proyectos', color: 'bg-purple-100 text-purple-800' },
  { value: 'equipo', label: 'Equipo', color: 'bg-orange-100 text-orange-800' },
  { value: 'certificaciones', label: 'Certificaciones', color: 'bg-red-100 text-red-800' },
  { value: 'tecnologia', label: 'Tecnología', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' }
]

export default function MediaManager({ onSelectImage, selectedImage, showSelector = false }: MediaManagerProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  useEffect(() => {
    fetchMediaFiles()
  }, [])

  const fetchMediaFiles = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/media?${params}`)
      if (!response.ok) throw new Error('Error al cargar archivos')
      
      const data = await response.json()
      if (data.success) {
        setFiles(data.files || [])
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error fetching media files:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los archivos multimedia',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (!uploadedFiles || uploadedFiles.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(uploadedFiles)) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Archivo no válido',
            description: `${file.name} no es una imagen válida`,
            variant: 'destructive'
          })
          continue
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'Archivo muy grande',
            description: `${file.name} excede el límite de 5MB`,
            variant: 'destructive'
          })
          continue
        }

        // En un caso real, aquí subirías el archivo a un servicio como Uploadcare, S3, etc.
        // Por ahora simularemos la subida
        const newFile: MediaFile = {
          id: Date.now().toString() + Math.random(),
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
          size: file.size,
          category: 'general',
          uploadedAt: new Date().toISOString()
        }

        setFiles(prev => [newFile, ...prev])
      }

      toast({
        title: 'Archivos subidos',
        description: `Se subieron ${uploadedFiles.length} archivo(s) correctamente`,
      })
    } catch (error) {
      console.error('Error uploading files:', error)
      toast({
        title: 'Error',
        description: 'Error al subir los archivos',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    try {
      // En un caso real, aquí harías la llamada a la API para eliminar
      setFiles(prev => prev.filter(f => f.id !== fileId))
      toast({
        title: 'Archivo eliminado',
        description: 'El archivo se eliminó correctamente'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el archivo',
        variant: 'destructive'
      })
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: 'URL copiada',
      description: 'La URL de la imagen se copió al portapapeles'
    })
  }

  const handleSelectFile = (url: string) => {
    if (onSelectImage) {
      onSelectImage(url)
      toast({
        title: 'Imagen seleccionada',
        description: 'La imagen se ha seleccionado para usar en la sección'
      })
    }
  }

  const handleCategoryChange = (fileId: string, newCategory: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, category: newCategory } : f
    ))
  }

  const filteredFiles = files.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header de gestión */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Medios</h3>
          <p className="text-sm text-gray-600">
            {showSelector ? 'Selecciona una imagen para usar en la sección' : 'Sube y organiza tus archivos multimedia'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
          
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <Button asChild disabled={uploading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Subiendo...' : 'Subir Imágenes'}
              </label>
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar archivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Todos ({files.length})
          </Button>
          {imageCategories.map((category) => {
            const count = files.filter(f => f.category === category.value).length
            return (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label} ({count})
              </Button>
            )
          })}
        </div>
      </div>

      {/* Grid/Lista de archivos */}
      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || selectedCategory !== 'all' ? 'No se encontraron archivos' : 'No hay archivos multimedia'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Intenta cambiar los filtros de búsqueda'
                : 'Comienza subiendo algunas imágenes para tus páginas'
              }
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Subir primera imagen
                </label>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
          : 'space-y-3'
        }>
          {filteredFiles.map((file) => (
            <Card 
              key={file.id} 
              className={`overflow-hidden hover:shadow-md transition-shadow ${
                selectedImage === file.url ? 'ring-2 ring-blue-500' : ''
              } ${showSelector ? 'cursor-pointer' : ''}`}
              onClick={() => showSelector && handleSelectFile(file.url)}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                    {selectedImage === file.url && showSelector && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <Check className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className={imageCategories.find(c => c.value === file.category)?.color}
                        >
                          {imageCategories.find(c => c.value === file.category)?.label}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      </div>
                      {!showSelector && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyUrl(file.url)
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFile(file.id)
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative bg-gray-100 rounded">
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      <Badge 
                        variant="secondary" 
                        className={`mt-1 ${imageCategories.find(c => c.value === file.category)?.color}`}
                      >
                        {imageCategories.find(c => c.value === file.category)?.label}
                      </Badge>
                    </div>
                    {!showSelector && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyUrl(file.url)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                    {showSelector && selectedImage === file.url && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Información de uso */}
      {!showSelector && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>• Las imágenes subidas se pueden usar en cualquier sección de las páginas</p>
            <p>• Organiza las imágenes por categorías para encontrarlas más fácilmente</p>
            <p>• Haz clic en el icono de copiar para obtener la URL de una imagen</p>
            <p>• Formatos soportados: JPG, PNG, WebP, GIF (máximo 5MB)</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
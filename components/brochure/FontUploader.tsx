'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface FontUploaderProps {
  isOpen: boolean
  onClose: () => void
  onFontUploaded?: (fontData: { fontFamily: string; fileUrl: string; fileFormat: string }) => void
}

export function FontUploader({ isOpen, onClose, onFontUploaded }: FontUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [nombre, setNombre] = useState('')
  const [fontFamily, setFontFamily] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Sans-serif')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validar formato
    const allowedFormats = ['ttf', 'otf', 'woff', 'woff2']
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()

    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      setError(`Formato no permitido. Usa: ${allowedFormats.join(', ')}`)
      return
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024
    if (selectedFile.size > maxSize) {
      setError('El archivo es demasiado grande. Máximo 10MB')
      return
    }

    setFile(selectedFile)
    setError(null)

    // Auto-rellenar nombre y fontFamily si están vacíos
    if (!nombre) {
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '') // Remover extensión
      setNombre(baseName)
    }
    if (!fontFamily) {
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '')
      setFontFamily(baseName.replace(/[^a-zA-Z0-9]/g, ' ')) // Limpiar caracteres especiales
    }
  }

  const handleUpload = async () => {
    if (!file || !nombre || !fontFamily) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('nombre', nombre)
      formData.append('fontFamily', fontFamily)
      if (description) formData.append('description', description)
      if (category) formData.append('category', category)

      const response = await fetch('/api/fonts/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir la fuente')
      }

      console.log('✅ Fuente subida:', data.font)
      setSuccess(true)

      // Notificar al componente padre con todos los datos de la fuente
      if (onFontUploaded) {
        onFontUploaded({
          fontFamily: data.font.fontFamily,
          fileUrl: data.font.fileUrl,
          fileFormat: data.font.fileFormat || file.name.split('.').pop()?.toLowerCase() || 'woff2'
        })
      }

      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        handleClose()
      }, 1500)

    } catch (err: any) {
      console.error('❌ Error:', err)
      setError(err.message || 'Error al subir la fuente')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setNombre('')
    setFontFamily('')
    setDescription('')
    setCategory('Sans-serif')
    setError(null)
    setSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Subir Fuente Personalizada</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            disabled={uploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Mensaje de éxito */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">¡Fuente subida exitosamente!</p>
                <p className="text-sm">Ya puedes usar esta fuente en tus diseños.</p>
              </div>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Selector de archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo de Fuente *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                file
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <File className="w-6 h-6" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-sm text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Haz clic para seleccionar un archivo de fuente</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos: TTF, OTF, WOFF, WOFF2 (máx. 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Nombre de la fuente */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Fuente *
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mi Fuente Corporativa"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Nombre descriptivo para identificar la fuente
            </p>
          </div>

          {/* Familia de fuente (CSS) */}
          <div>
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-2">
              Familia de Fuente (CSS) *
            </label>
            <input
              type="text"
              id="fontFamily"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              placeholder="Ej: MyCustomFont"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Nombre que se usará en el CSS (sin espacios especiales)
            </p>
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            >
              <option value="Sans-serif">Sans-serif</option>
              <option value="Serif">Serif</option>
              <option value="Display">Display</option>
              <option value="Handwriting">Handwriting</option>
              <option value="Monospace">Monospace</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Agrega una descripción sobre el uso de esta fuente..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={uploading}
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !file || !nombre || !fontFamily}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Subir Fuente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

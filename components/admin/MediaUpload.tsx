"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"

interface Project {
  id: string
  titulo: string
}

interface MediaUploadProps {
  projects: Project[]
  onClose: () => void
}

export default function MediaUpload({ projects, onClose }: MediaUploadProps) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [selectedProject, setSelectedProject] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files || files.length === 0 || !selectedProject) {
      alert('Por favor selecciona al menos un archivo y un proyecto')
      return
    }

    setUploading(true)
    try {
      // En un escenario real, aquí subirías a un servicio como Uploadcare, Cloudinary, etc.
      // Por ahora simularemos la funcionalidad
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string
          
          try {
            const response = await fetch('/api/admin/media', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url: dataUrl, // En producción esto sería la URL real del archivo subido
                descripcion: description || file.name,
                proyectoId: selectedProject
              }),
            })

            if (response.ok) {
              router.refresh()
            } else {
              alert(`Error al subir ${file.name}`)
            }
          } catch (error) {
            console.error('Error:', error)
            alert(`Error al subir ${file.name}`)
          }
        }
        
        reader.readAsDataURL(file)
      }
      
      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      onClose()
      
    } catch (error) {
      console.error('Error:', error)
      alert('Error al subir los archivos')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Subir Archivos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleUpload} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proyecto *
            </label>
            <select
              required
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
            >
              <option value="">Seleccionar proyecto...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.titulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
              placeholder="Descripción de las imágenes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivos *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-meisa-blue hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-meisa-blue">
                    <span>Subir archivos</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => setFiles(e.target.files)}
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
              </div>
            </div>
            {files && files.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {files.length} archivo(s) seleccionado(s)
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-meisa-blue border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
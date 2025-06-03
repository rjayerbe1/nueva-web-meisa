'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Eye, Plus, X, Trash2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import ImageSelectorModal from '@/components/admin/ImageSelectorModal'

interface HistoriaProyecto {
  id: string
  activo: boolean
  proyectoId: string
  resumenCorto: string | null
  tituloAlternativo: string | null
  contexto: string | null
  problemasIniciales: string | null
  desafios: any
  enfoque: string | null
  solucionTecnica: string | null
  innovaciones: any
  metodologia: string | null
  tiempoTotal: string | null
  resultados: any
  impactoCliente: string | null
  valorAgregado: string | null
  testimonioCliente: string | null
  testimonioEquipo: string | null
  dificultadTecnica: number | null
  innovacionNivel: number | null
  tagsTecnicos: any
  imagenDestacada: string | null
  proyecto: {
    titulo: string
    cliente: string
    categoria: string
    slug: string
  }
}

export default function EditHistoriaPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [historia, setHistoria] = useState<HistoriaProyecto | null>(null)
  const [proyectosDisponibles, setProyectosDisponibles] = useState<any[]>([])
  const [showReassign, setShowReassign] = useState(false)
  const [newProyectoId, setNewProyectoId] = useState('')
  const [proyectoImagenes, setProyectoImagenes] = useState<any[]>([])
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSection, setModalSection] = useState<'desafio' | 'solucion' | 'resultado' | null>(null)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    activo: false,
    tituloAlternativo: '',
    resumenCorto: '',
    contexto: '',
    problemasIniciales: '',
    desafios: [] as string[],
    enfoque: '',
    solucionTecnica: '',
    innovaciones: [] as string[],
    equipoEspecialista: [] as any[],
    metodologia: '',
    tiempoTotal: '',
    fasesEjecucion: [] as any[],
    recursos: [] as string[],
    resultados: [] as string[],
    reconocimientos: [] as string[],
    impactoCliente: '',
    valorAgregado: '',
    testimonioCliente: '',
    testimonioEquipo: '',
    dificultadTecnica: 5,
    innovacionNivel: 5,
    tagsTecnicos: [] as string[],
    imagenDestacada: '',
    videoUrl: '',
    datosInteres: {} as any,
    leccionesAprendidas: '',
    // Selección de imágenes (nuevo esquema)
    imagenesDesafio: [] as any[],
    imagenesSolucion: [] as any[],
    imagenesResultado: [] as any[]
  })

  useEffect(() => {
    if (params.id) {
      fetchHistoria()
      fetchProyectosDisponibles()
    }
  }, [params.id])

  useEffect(() => {
    if (historia?.proyectoId) {
      fetchProyectoImagenes(historia.proyectoId)
    }
  }, [historia?.proyectoId])

  const fetchHistoria = async () => {
    try {
      const response = await fetch(`/api/admin/historias/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setHistoria(data)
        
        // Poblar el formulario
        setFormData({
          activo: data.activo || false,
          tituloAlternativo: data.tituloAlternativo || '',
          resumenCorto: data.resumenCorto || '',
          contexto: data.contexto || '',
          problemasIniciales: data.problemasIniciales || '',
          desafios: Array.isArray(data.desafios) ? data.desafios : [],
          enfoque: data.enfoque || '',
          solucionTecnica: data.solucionTecnica || '',
          innovaciones: Array.isArray(data.innovaciones) ? data.innovaciones : [],
          equipoEspecialista: Array.isArray(data.equipoEspecialista) ? data.equipoEspecialista : [],
          metodologia: data.metodologia || '',
          tiempoTotal: data.tiempoTotal || '',
          fasesEjecucion: Array.isArray(data.fasesEjecucion) ? data.fasesEjecucion : [],
          recursos: Array.isArray(data.recursos) ? data.recursos : [],
          resultados: Array.isArray(data.resultados) ? data.resultados : [],
          reconocimientos: Array.isArray(data.reconocimientos) ? data.reconocimientos : [],
          impactoCliente: data.impactoCliente || '',
          valorAgregado: data.valorAgregado || '',
          testimonioCliente: data.testimonioCliente || '',
          testimonioEquipo: data.testimonioEquipo || '',
          dificultadTecnica: data.dificultadTecnica || 5,
          innovacionNivel: data.innovacionNivel || 5,
          tagsTecnicos: Array.isArray(data.tagsTecnicos) ? data.tagsTecnicos : [],
          imagenDestacada: data.imagenDestacada || '',
          videoUrl: data.videoUrl || '',
          datosInteres: data.datosInteres || {},
          leccionesAprendidas: data.leccionesAprendidas || '',
          // Selección de imágenes (nuevo esquema)
          imagenesDesafio: Array.isArray(data.imagenesDesafio) ? data.imagenesDesafio : [],
          imagenesSolucion: Array.isArray(data.imagenesSolucion) ? data.imagenesSolucion : [],
          imagenesResultado: Array.isArray(data.imagenesResultado) ? data.imagenesResultado : []
        })
      }
    } catch (error) {
      console.error('Error fetching historia:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProyectosDisponibles = async () => {
    try {
      const response = await fetch('/api/admin/proyectos/sin-historia')
      if (response.ok) {
        const data = await response.json()
        setProyectosDisponibles(data)
      }
    } catch (error) {
      console.error('Error fetching proyectos disponibles:', error)
    }
  }

  const fetchProyectoImagenes = async (proyectoId: string) => {
    try {
      const response = await fetch(`/api/admin/proyectos/${proyectoId}`)
      if (response.ok) {
        const data = await response.json()
        setProyectoImagenes(data.imagenes || [])
      }
    } catch (error) {
      console.error('Error fetching proyecto imagenes:', error)
    }
  }

  const handleReassign = async () => {
    if (!newProyectoId) {
      alert('Debes seleccionar un proyecto')
      return
    }

    try {
      const response = await fetch(`/api/admin/historias/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proyectoId: newProyectoId
        })
      })

      if (response.ok) {
        alert('Historia reasignada exitosamente')
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al reasignar la historia')
      }
    } catch (error) {
      console.error('Error reassigning historia:', error)
      alert('Error al reasignar la historia')
    }
  }

  const handleSubmit = async (shouldActivate = false) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/historias/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          activo: shouldActivate
        })
      })

      if (response.ok) {
        router.push('/admin/historias')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al actualizar la historia')
      }
    } catch (error) {
      console.error('Error updating historia:', error)
      alert('Error al actualizar la historia')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta historia? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/historias/${params.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin/historias')
      } else {
        alert('Error al eliminar la historia')
      }
    } catch (error) {
      console.error('Error deleting historia:', error)
      alert('Error al eliminar la historia')
    }
  }

  // Funciones para el modal de selección de imágenes
  const openImageModal = (section: 'desafio' | 'solucion' | 'resultado') => {
    setModalSection(section)
    setModalOpen(true)
  }

  const handleImageSelection = (selectedImages: any[]) => {
    if (modalSection) {
      const fieldName = `imagenes${modalSection.charAt(0).toUpperCase() + modalSection.slice(1)}` as keyof typeof formData
      setFormData(prev => ({
        ...prev,
        [fieldName]: selectedImages
      }))
    }
  }

  const getCurrentSelection = (section: 'desafio' | 'solucion' | 'resultado') => {
    const fieldName = `imagenes${section.charAt(0).toUpperCase() + section.slice(1)}` as keyof typeof formData
    return formData[fieldName] as any[] || []
  }

  const getSectionTitle = (section: 'desafio' | 'solucion' | 'resultado') => {
    switch (section) {
      case 'desafio': return 'El Desafío'
      case 'solucion': return 'La Solución'
      case 'resultado': return 'Los Resultados'
      default: return ''
    }
  }

  const getSectionColor = (section: 'desafio' | 'solucion' | 'resultado') => {
    switch (section) {
      case 'desafio': return 'red' as const
      case 'solucion': return 'blue' as const
      case 'resultado': return 'green' as const
      default: return 'blue' as const
    }
  }

  const addToArray = (field: string, value: string) => {
    if (!value.trim()) return
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()]
    }))
  }

  const removeFromArray = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }))
  }

  const ArrayInput = ({ 
    field, 
    placeholder, 
    label 
  }: { 
    field: string
    placeholder: string
    label: string 
  }) => {
    const [inputValue, setInputValue] = useState('')
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              addToArray(field, inputValue)
              setInputValue('')
            }}
            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData[field] as string[]).map((item, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
            >
              {item}
              <button
                type="button"
                onClick={() => removeFromArray(field, index)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    )
  }

  if (!historia) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Historia no encontrada</h1>
          <Link
            href="/admin/historias"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Volver a Historias
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/historias"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Historia: {historia.proyecto.titulo}
            </h1>
            <p className="text-gray-600">
              {historia.proyecto.cliente} • {historia.proyecto.categoria}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </div>

      <div className="space-y-8">
        {/* Selección de Imágenes */}
        {proyectoImagenes.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Selección de Imágenes para la Historia</h2>
            <p className="text-gray-600 mb-6">Elige hasta 4 imágenes para cada sección de la historia y personaliza sus títulos y descripciones.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Botón para El Desafío */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  El Desafío
                </h3>
                <button
                  onClick={() => openImageModal('desafio')}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-red-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-red-600" />
                  <span className="text-red-700 font-medium">
                    {getCurrentSelection('desafio').length > 0 
                      ? `${getCurrentSelection('desafio').length} imagen(es) seleccionada(s)`
                      : 'Seleccionar imágenes'
                    }
                  </span>
                </button>
                {getCurrentSelection('desafio').length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {getCurrentSelection('desafio').slice(0, 3).map((img: any, idx: number) => {
                      const imageData = proyectoImagenes.find(p => p.id === img.id)
                      return imageData ? (
                        <div key={img.id} className="w-12 h-8 rounded overflow-hidden">
                          <img src={imageData.urlOptimized || imageData.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : null
                    })}
                    {getCurrentSelection('desafio').length > 3 && (
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                        +{getCurrentSelection('desafio').length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón para La Solución */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  La Solución
                </h3>
                <button
                  onClick={() => openImageModal('solucion')}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    {getCurrentSelection('solucion').length > 0 
                      ? `${getCurrentSelection('solucion').length} imagen(es) seleccionada(s)`
                      : 'Seleccionar imágenes'
                    }
                  </span>
                </button>
                {getCurrentSelection('solucion').length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {getCurrentSelection('solucion').slice(0, 3).map((img: any, idx: number) => {
                      const imageData = proyectoImagenes.find(p => p.id === img.id)
                      return imageData ? (
                        <div key={img.id} className="w-12 h-8 rounded overflow-hidden">
                          <img src={imageData.urlOptimized || imageData.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : null
                    })}
                    {getCurrentSelection('solucion').length > 3 && (
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                        +{getCurrentSelection('solucion').length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón para Los Resultados */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Los Resultados
                </h3>
                <button
                  onClick={() => openImageModal('resultado')}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">
                    {getCurrentSelection('resultado').length > 0 
                      ? `${getCurrentSelection('resultado').length} imagen(es) seleccionada(s)`
                      : 'Seleccionar imágenes'
                    }
                  </span>
                </button>
                {getCurrentSelection('resultado').length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {getCurrentSelection('resultado').slice(0, 3).map((img: any, idx: number) => {
                      const imageData = proyectoImagenes.find(p => p.id === img.id)
                      return imageData ? (
                        <div key={img.id} className="w-12 h-8 rounded overflow-hidden">
                          <img src={imageData.urlOptimized || imageData.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : null
                    })}
                    {getCurrentSelection('resultado').length > 3 && (
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                        +{getCurrentSelection('resultado').length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 1. Estado Actual y Proyecto Asignado */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700">Estado:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                historia.activo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {historia.activo ? 'Activa (Visible en el sitio)' : 'Borrador'}
              </span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-700">Proyecto Asignado:</span>
                  <div className="mt-1">
                    <p className="font-semibold text-gray-900">{historia.proyecto.titulo}</p>
                    <p className="text-sm text-gray-600">{historia.proyecto.cliente} • {historia.proyecto.categoria}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReassign(!showReassign)}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition-colors"
                >
                  {showReassign ? 'Cancelar' : 'Reasignar'}
                </button>
              </div>
              
              {showReassign && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Reasignar Historia a Otro Proyecto</h4>
                  <div className="space-y-3">
                    <select
                      value={newProyectoId}
                      onChange={(e) => setNewProyectoId(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="">Selecciona el nuevo proyecto...</option>
                      {proyectosDisponibles.map((proyecto) => (
                        <option key={proyecto.id} value={proyecto.id}>
                          {proyecto.titulo} - {proyecto.cliente} ({proyecto.categoria.replace(/_/g, ' ')})
                        </option>
                      ))}
                    </select>
                    
                    {proyectosDisponibles.length === 0 && (
                      <p className="text-sm text-blue-700">
                        No hay proyectos disponibles. Todos los proyectos visibles ya tienen historia asignada.
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleReassign}
                        disabled={!newProyectoId || proyectosDisponibles.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm transition-colors"
                      >
                        Confirmar Reasignación
                      </button>
                      <button
                        onClick={() => {
                          setShowReassign(false)
                          setNewProyectoId('')
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                    
                    <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                      <strong>Nota:</strong> Al reasignar, esta historia se desvinculará del proyecto actual y se asignará al nuevo proyecto seleccionado.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Información Básica */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Información Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Alternativo
              </label>
              <input
                type="text"
                value={formData.tituloAlternativo}
                onChange={(e) => setFormData(prev => ({ ...prev, tituloAlternativo: e.target.value }))}
                placeholder="Título más narrativo para la historia"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Destacada
              </label>
              <input
                type="url"
                value={formData.imagenDestacada}
                onChange={(e) => setFormData(prev => ({ ...prev, imagenDestacada: e.target.value }))}
                placeholder="URL de la imagen principal"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen Corto
              </label>
              <textarea
                value={formData.resumenCorto}
                onChange={(e) => setFormData(prev => ({ ...prev, resumenCorto: e.target.value }))}
                placeholder="Resumen de 2-3 líneas para previews"
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* 3. El Desafío */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">3. El Desafío</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contexto Inicial
              </label>
              <textarea
                value={formData.contexto}
                onChange={(e) => setFormData(prev => ({ ...prev, contexto: e.target.value }))}
                placeholder="Describe la situación inicial del cliente"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problemas a Resolver
              </label>
              <textarea
                value={formData.problemasIniciales}
                onChange={(e) => setFormData(prev => ({ ...prev, problemasIniciales: e.target.value }))}
                placeholder="Descripción detallada de los problemas"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <ArrayInput
              field="desafios"
              placeholder="Ej: Estructura en zona sísmica"
              label="Desafíos Específicos"
            />
          </div>
        </div>

        {/* 4. La Solución */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">4. La Solución MEISA</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enfoque Técnico
              </label>
              <textarea
                value={formData.enfoque}
                onChange={(e) => setFormData(prev => ({ ...prev, enfoque: e.target.value }))}
                placeholder="Describe el enfoque técnico general"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Solución Técnica Detallada
              </label>
              <textarea
                value={formData.solucionTecnica}
                onChange={(e) => setFormData(prev => ({ ...prev, solucionTecnica: e.target.value }))}
                placeholder="Detalles técnicos de la solución"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metodología
                </label>
                <textarea
                  value={formData.metodologia}
                  onChange={(e) => setFormData(prev => ({ ...prev, metodologia: e.target.value }))}
                  placeholder="Metodología de trabajo aplicada"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo Total
                </label>
                <input
                  type="text"
                  value={formData.tiempoTotal}
                  onChange={(e) => setFormData(prev => ({ ...prev, tiempoTotal: e.target.value }))}
                  placeholder="Ej: 8 meses"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <ArrayInput
              field="innovaciones"
              placeholder="Ej: Soldadura robotizada"
              label="Innovaciones Aplicadas"
            />
          </div>
        </div>

        {/* 5. El Proceso */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">5. El Proceso</h2>
          <div className="space-y-6">
            <ArrayInput
              field="equipoEspecialista"
              placeholder="Ej: Ingeniero Estructural con 15 años de experiencia"
              label="Equipo Especialista"
            />

            <ArrayInput
              field="fasesEjecucion"
              placeholder="Ej: Diseño - 2 meses - Planos detallados y cálculos"
              label="Fases de Ejecución"
            />

            <ArrayInput
              field="recursos"
              placeholder="Ej: Grúa de 50 toneladas"
              label="Recursos Especializados"
            />
          </div>
        </div>

        {/* 6. Los Resultados */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">6. Los Resultados</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Impacto para el Cliente
              </label>
              <textarea
                value={formData.impactoCliente}
                onChange={(e) => setFormData(prev => ({ ...prev, impactoCliente: e.target.value }))}
                placeholder="Describe el impacto específico para el cliente"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Agregado de MEISA
              </label>
              <textarea
                value={formData.valorAgregado}
                onChange={(e) => setFormData(prev => ({ ...prev, valorAgregado: e.target.value }))}
                placeholder="¿Qué valor único aportó MEISA?"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <ArrayInput
              field="resultados"
              placeholder="Ej: Reducción de 30% en tiempo de montaje"
              label="Resultados Específicos"
            />

            <ArrayInput
              field="reconocimientos"
              placeholder="Ej: Certificación LEED Gold"
              label="Reconocimientos y Premios"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lecciones Aprendidas
              </label>
              <textarea
                value={formData.leccionesAprendidas}
                onChange={(e) => setFormData(prev => ({ ...prev, leccionesAprendidas: e.target.value }))}
                placeholder="Conocimientos valiosos obtenidos del proyecto"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* 7. Métricas */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">7. Métricas del Proyecto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dificultad Técnica (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.dificultadTecnica}
                onChange={(e) => setFormData(prev => ({ ...prev, dificultadTecnica: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                {formData.dificultadTecnica}/10
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Innovación (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.innovacionNivel}
                onChange={(e) => setFormData(prev => ({ ...prev, innovacionNivel: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                {formData.innovacionNivel}/10
              </div>
            </div>
          </div>
        </div>

        {/* 8. Testimonios */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">8. Testimonios</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testimonio del Cliente
              </label>
              <textarea
                value={formData.testimonioCliente}
                onChange={(e) => setFormData(prev => ({ ...prev, testimonioCliente: e.target.value }))}
                placeholder="Testimonio directo del cliente"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testimonio del Equipo
              </label>
              <textarea
                value={formData.testimonioEquipo}
                onChange={(e) => setFormData(prev => ({ ...prev, testimonioEquipo: e.target.value }))}
                placeholder="Testimonio del equipo MEISA"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* 9. Assets Visuales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">9. Assets Visuales</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Explicativo
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="URL del video explicativo (opcional)"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Datos de Interés
              </label>
              <textarea
                value={JSON.stringify(formData.datosInteres, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setFormData(prev => ({ ...prev, datosInteres: parsed }))
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder='{"metrosCuadrados": "5000", "pisos": "12", "materiales": ["Acero", "Concreto"]}'
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Datos adicionales en formato JSON para mostrar métricas específicas del proyecto</p>
            </div>
          </div>
        </div>

        {/* 10. Tags Técnicos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">10. Tags Técnicos</h2>
          <ArrayInput
            field="tagsTecnicos"
            placeholder="Ej: soldadura-especializada"
            label="Tags Técnicos"
          />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <Link
          href="/admin/historias"
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
        >
          Cancelar
        </Link>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Borrador
          </button>
          
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {historia.activo ? 'Actualizar y Mantener Activa' : 'Guardar y Activar'}
          </button>
          
          <Link
            href={`/proyectos/detalle/${historia.proyecto.slug}`}
            target="_blank"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Vista Previa
          </Link>
        </div>
      </div>

      {/* Modal de selección de imágenes */}
      {modalOpen && modalSection && (
        <ImageSelectorModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setModalSection(null)
          }}
          onSave={handleImageSelection}
          availableImages={proyectoImagenes}
          currentSelection={getCurrentSelection(modalSection)}
          sectionTitle={getSectionTitle(modalSection)}
          sectionColor={getSectionColor(modalSection)}
          maxImages={4}
        />
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Plus, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Proyecto {
  id: string
  titulo: string
  cliente: string
  categoria: string
}

export default function NuevaHistoriaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [selectedProyecto, setSelectedProyecto] = useState('')
  const [proyectoImagenes, setProyectoImagenes] = useState<any[]>([])
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    // Básico
    activo: false,
    tituloAlternativo: '',
    resumenCorto: '',
    
    // Desafío
    contexto: '',
    problemasIniciales: '',
    desafios: [] as string[],
    
    // Solución
    enfoque: '',
    solucionTecnica: '',
    innovaciones: [] as string[],
    equipoEspecialista: [] as any[],
    
    // Proceso
    metodologia: '',
    tiempoTotal: '',
    fasesEjecucion: [] as any[],
    recursos: [] as string[],
    
    // Resultado
    impactoCliente: '',
    leccionesAprendidas: '',
    valorAgregado: '',
    resultados: [] as string[],
    reconocimientos: [] as string[],
    
    // Testimonios
    testimonioCliente: '',
    testimonioEquipo: '',
    
    // Visual
    imagenDestacada: '',
    videoUrl: '',
    infografias: [] as string[],
    
    // Métricas
    dificultadTecnica: 5,
    innovacionNivel: 5,
    tagsTecnicos: [] as string[],
    datosInteres: {} as any,
    
    // Selección de imágenes
    imagenDesafio: '',
    imagenSolucion: '',
    imagenResultado: '',
    imagenesGaleria: [] as string[]
  })

  useEffect(() => {
    fetchProyectos()
    
    // Preseleccionar proyecto si viene en la URL
    const params = new URLSearchParams(window.location.search)
    const proyectoId = params.get('proyectoId')
    if (proyectoId) {
      setSelectedProyecto(proyectoId)
    }
  }, [])

  const fetchProyectos = async () => {
    try {
      const response = await fetch('/api/admin/proyectos/sin-historia')
      if (response.ok) {
        const data = await response.json()
        setProyectos(data)
      }
    } catch (error) {
      console.error('Error fetching proyectos:', error)
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

  const handleSubmit = async (isDraft = true) => {
    if (!selectedProyecto) {
      alert('Debes seleccionar un proyecto')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/historias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proyectoId: selectedProyecto,
          activo: !isDraft,
          ...formData
        })
      })

      if (response.ok) {
        router.push('/admin/historias')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al crear la historia')
      }
    } catch (error) {
      console.error('Error creating historia:', error)
      alert('Error al crear la historia')
    } finally {
      setLoading(false)
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/admin/historias"
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Historia de Proyecto</h1>
          <p className="text-gray-600">Crea una historia completa para mostrar el valor de MEISA</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Selección de Proyecto */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Selecciona el Proyecto</h2>
          <select
            value={selectedProyecto}
            onChange={(e) => {
              const newProyectoId = e.target.value
              setSelectedProyecto(newProyectoId)
              if (newProyectoId) {
                fetchProyectoImagenes(newProyectoId)
              } else {
                setProyectoImagenes([])
              }
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4"
            required
          >
            <option value="">Selecciona un proyecto...</option>
            {proyectos.map((proyecto) => (
              <option key={proyecto.id} value={proyecto.id}>
                {proyecto.titulo} - {proyecto.cliente} ({proyecto.categoria.replace(/_/g, ' ')})
              </option>
            ))}
          </select>
          
          {selectedProyecto && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              {(() => {
                const proyecto = proyectos.find(p => p.id === selectedProyecto)
                return proyecto ? (
                  <div>
                    <h3 className="font-medium text-blue-900 mb-2">Proyecto Seleccionado:</h3>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p><span className="font-medium">Título:</span> {proyecto.titulo}</p>
                      <p><span className="font-medium">Cliente:</span> {proyecto.cliente}</p>
                      <p><span className="font-medium">Categoría:</span> {proyecto.categoria.replace(/_/g, ' ')}</p>
                      {proyecto.destacado && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Proyecto Destacado
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <Link
                        href={`/proyectos/detalle/${proyecto.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Ver proyecto en el sitio web
                      </Link>
                    </div>
                  </div>
                ) : null
              })()}
            </div>
          )}
          
          {proyectos.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-yellow-800 font-medium">No hay proyectos disponibles</p>
              <p className="text-yellow-700 text-sm">Todos los proyectos visibles ya tienen historia asignada.</p>
            </div>
          )}
        </div>

        {/* Información Básica */}
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

        {/* Selección de Imágenes */}
        {selectedProyecto && proyectoImagenes.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2b. Selección de Imágenes para la Historia</h2>
            <p className="text-gray-600 mb-6">Selecciona qué imágenes del proyecto mostrar en cada sección de la historia</p>
            
            <div className="space-y-6">
              {/* Imagen para El Desafío */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Imagen para "El Desafío" (situación inicial)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {proyectoImagenes.map((imagen) => (
                    <div 
                      key={imagen.id}
                      onClick={() => setFormData(prev => ({ ...prev, imagenDesafio: imagen.id }))}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        formData.imagenDesafio === imagen.id 
                          ? 'border-red-500 ring-2 ring-red-200' 
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className="aspect-[4/3] relative">
                        <img
                          src={imagen.urlOptimized || imagen.url}
                          alt={imagen.alt}
                          className="w-full h-full object-cover"
                        />
                        {formData.imagenDesafio === imagen.id && (
                          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                              Seleccionada
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{imagen.titulo || imagen.alt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Imagen para La Solución */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Imagen para "La Solución" (proceso de trabajo)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {proyectoImagenes.map((imagen) => (
                    <div 
                      key={imagen.id}
                      onClick={() => setFormData(prev => ({ ...prev, imagenSolucion: imagen.id }))}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        formData.imagenSolucion === imagen.id 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="aspect-[4/3] relative">
                        <img
                          src={imagen.urlOptimized || imagen.url}
                          alt={imagen.alt}
                          className="w-full h-full object-cover"
                        />
                        {formData.imagenSolucion === imagen.id && (
                          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                            <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                              Seleccionada
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{imagen.titulo || imagen.alt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Imagen para Los Resultados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Imagen para "Los Resultados" (proyecto terminado)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {proyectoImagenes.map((imagen) => (
                    <div 
                      key={imagen.id}
                      onClick={() => setFormData(prev => ({ ...prev, imagenResultado: imagen.id }))}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        formData.imagenResultado === imagen.id 
                          ? 'border-green-500 ring-2 ring-green-200' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="aspect-[4/3] relative">
                        <img
                          src={imagen.urlOptimized || imagen.url}
                          alt={imagen.alt}
                          className="w-full h-full object-cover"
                        />
                        {formData.imagenResultado === imagen.id && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                              Seleccionada
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{imagen.titulo || imagen.alt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Imágenes para Galería Adicional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Imágenes para Galería Adicional (selecciona múltiples)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {proyectoImagenes.map((imagen) => (
                    <div 
                      key={imagen.id}
                      onClick={() => {
                        const isSelected = formData.imagenesGaleria.includes(imagen.id)
                        if (isSelected) {
                          setFormData(prev => ({ 
                            ...prev, 
                            imagenesGaleria: prev.imagenesGaleria.filter(id => id !== imagen.id)
                          }))
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            imagenesGaleria: [...prev.imagenesGaleria, imagen.id]
                          }))
                        }
                      }}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        formData.imagenesGaleria.includes(imagen.id)
                          ? 'border-purple-500 ring-2 ring-purple-200' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="aspect-[4/3] relative">
                        <img
                          src={imagen.urlOptimized || imagen.url}
                          alt={imagen.alt}
                          className="w-full h-full object-cover"
                        />
                        {formData.imagenesGaleria.includes(imagen.id) && (
                          <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                            <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                              En Galería
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{imagen.titulo || imagen.alt}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {formData.imagenesGaleria.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-purple-700 font-medium">
                      {formData.imagenesGaleria.length} imagen(es) seleccionada(s) para la galería
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Desafío */}
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
                placeholder="Describe la situación inicial del cliente y el contexto del proyecto"
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
                placeholder="Descripción detallada de los problemas que debía resolver MEISA"
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

        {/* Solución */}
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
                placeholder="Describe el enfoque técnico general que utilizó MEISA"
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
                placeholder="Detalles técnicos de la solución implementada"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <ArrayInput
              field="innovaciones"
              placeholder="Ej: Soldadura robotizada"
              label="Innovaciones Aplicadas"
            />
          </div>
        </div>

        {/* Proceso */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">5. El Proceso</h2>
          <div className="space-y-6">
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
              field="recursos"
              placeholder="Ej: Grúa de 50 toneladas"
              label="Recursos Especializados"
            />
          </div>
        </div>

        {/* Resultado */}
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
                placeholder="Describe el impacto específico que tuvo el proyecto para el cliente"
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
                placeholder="¿Qué valor único aportó MEISA que otros no hubieran podido aportar?"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <ArrayInput
              field="resultados"
              placeholder="Ej: Reducción de 30% en tiempo de montaje"
              label="Resultados Específicos"
            />
          </div>
        </div>

        {/* Métricas */}
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

        {/* Testimonios */}
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
                placeholder="Testimonio directo del cliente sobre el proyecto"
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
                placeholder="Testimonio del equipo MEISA sobre el proyecto"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Assets Visuales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">9. Assets Visuales</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Destacada
              </label>
              <input
                type="url"
                value={formData.imagenDestacada}
                onChange={(e) => setFormData(prev => ({ ...prev, imagenDestacada: e.target.value }))}
                placeholder="URL de la imagen principal para la historia"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
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
          </div>
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
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Borrador
          </button>
          
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Publicar Historia
          </button>
        </div>
      </div>
    </div>
  )
}
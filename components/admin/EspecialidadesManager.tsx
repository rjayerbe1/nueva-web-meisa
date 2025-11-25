'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Save,
  X,
  Sparkles
} from 'lucide-react'
import * as Icons from 'lucide-react'
import { EspecialidadImageUploader } from './EspecialidadImageUploader'

// Lista de iconos comunes de Lucide para selector
const ICONOS_DISPONIBLES = [
  'Warehouse', 'FlaskConical', 'Factory', 'Snowflake', 'Plane', 'Crane',
  'Building2', 'Cog', 'Bridge', 'Sparkles', 'Bike', 'Cable', 'Shield',
  'Users', 'Building', 'ParkingCircle', 'Theater', 'TowerControl', 'HardHat',
  'Home', 'ShoppingCart', 'Layers', 'Armchair', 'Layers3', 'Key', 'Trophy',
  'Waves', 'Grid3x3', 'Volleyball', 'Globe', 'BusFront', 'Bus', 'Palette',
  'ArrowUpFromLine', 'Star', 'Target', 'Zap', 'Wrench', 'Camera'
]

interface Especialidad {
  id: string
  titulo: string
  icono: string
  descripcion: string
  proyectosEjemplo: string[]
  orden: number
  activo: boolean
  imagen?: string
}

interface EspecialidadesManagerProps {
  especialidades: Especialidad[]
  onChange: (especialidades: Especialidad[]) => void
  color?: string
}

export function EspecialidadesManager({
  especialidades = [],
  onChange,
  color = '#3b82f6'
}: EspecialidadesManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Especialidad>>({})

  // Ordenar especialidades por orden
  const sortedEspecialidades = [...especialidades].sort((a, b) => a.orden - b.orden)

  const handleAdd = () => {
    const nuevaEspecialidad: Especialidad = {
      id: `esp-${Date.now()}`,
      titulo: '',
      icono: 'Star',
      descripcion: '',
      proyectosEjemplo: [],
      orden: especialidades.length + 1,
      activo: true
    }
    setEditingId(nuevaEspecialidad.id)
    setEditForm(nuevaEspecialidad)
    onChange([...especialidades, nuevaEspecialidad])
  }

  const handleEdit = (especialidad: Especialidad) => {
    setEditingId(especialidad.id)
    setEditForm(especialidad)
  }

  const handleSave = () => {
    if (!editingId) return

    const updated = especialidades.map(esp =>
      esp.id === editingId ? { ...esp, ...editForm } : esp
    )
    onChange(updated)
    setEditingId(null)
    setEditForm({})
  }

  const handleCancel = () => {
    // Si era nueva y está vacía, eliminarla
    if (editForm.titulo === '' && editForm.descripcion === '') {
      const updated = especialidades.filter(esp => esp.id !== editingId)
      onChange(updated)
    }
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta especialidad?')) return

    const updated = especialidades
      .filter(esp => esp.id !== id)
      .map((esp, index) => ({ ...esp, orden: index + 1 }))
    onChange(updated)
  }

  const handleToggleActive = (id: string) => {
    const updated = especialidades.map(esp =>
      esp.id === id ? { ...esp, activo: !esp.activo } : esp
    )
    onChange(updated)
  }

  const handleMoveUp = (id: string) => {
    const index = sortedEspecialidades.findIndex(esp => esp.id === id)
    if (index <= 0) return

    const updated = [...sortedEspecialidades]
    const temp = updated[index].orden
    updated[index].orden = updated[index - 1].orden
    updated[index - 1].orden = temp

    onChange(updated)
  }

  const handleMoveDown = (id: string) => {
    const index = sortedEspecialidades.findIndex(esp => esp.id === id)
    if (index >= sortedEspecialidades.length - 1) return

    const updated = [...sortedEspecialidades]
    const temp = updated[index].orden
    updated[index].orden = updated[index + 1].orden
    updated[index + 1].orden = temp

    onChange(updated)
  }

  // Obtener componente de icono dinámicamente
  const getIconComponent = (iconName: string) => {
    return (Icons as any)[iconName] || Icons.Star
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color }} />
              Especialidades Técnicas
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona las especialidades que se mostrarán en el carrusel del hero
            </p>
          </div>
          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {sortedEspecialidades.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay especialidades. Agrega la primera.</p>
          </div>
        ) : (
          sortedEspecialidades.map((especialidad, index) => {
            const isEditing = editingId === especialidad.id
            const IconComponent = getIconComponent(especialidad.icono)

            return (
              <div
                key={especialidad.id}
                className={`border rounded-lg p-4 ${
                  !especialidad.activo ? 'opacity-50 bg-gray-50' : ''
                } ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
              >
                {isEditing ? (
                  // MODO EDICIÓN
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label>Título de la Especialidad *</Label>
                        <Input
                          value={editForm.titulo || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, titulo: e.target.value })
                          }
                          placeholder="Ej: Bodegas de gran escala"
                        />
                      </div>
                      <div className="w-48">
                        <Label>Icono</Label>
                        <select
                          value={editForm.icono || 'Star'}
                          onChange={(e) =>
                            setEditForm({ ...editForm, icono: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          {ICONOS_DISPONIBLES.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>Descripción Técnica *</Label>
                      <Textarea
                        value={editForm.descripcion || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, descripcion: e.target.value })
                        }
                        placeholder="Descripción detallada que incluya datos técnicos, capacidades y logros..."
                        rows={5}
                      />
                    </div>

                    <div>
                      <Label>Proyectos Ejemplo (uno por línea)</Label>
                      <Textarea
                        value={(editForm.proyectosEjemplo || []).join('\n')}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            proyectosEjemplo: e.target.value
                              .split('\n')
                              .filter((p) => p.trim())
                          })
                        }
                        placeholder="Centros comerciales&#10;Bodegas industriales&#10;Plantas de producción"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tipos de proyectos genéricos (NO mencionar nombres específicos de clientes o proyectos)
                      </p>
                    </div>

                    <div>
                      <Label>Imagen de Fondo</Label>
                      <EspecialidadImageUploader
                        currentImage={editForm.imagen}
                        onImageChange={(url) =>
                          setEditForm({ ...editForm, imagen: url })
                        }
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // MODO VISTA
                  <div className="flex items-start gap-4">
                    {/* Icono */}
                    <div
                      className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${color}20`,
                        borderColor: color,
                        borderWidth: '2px'
                      }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color }} />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg mb-1">
                        {especialidad.titulo}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {especialidad.descripcion}
                      </p>
                      {especialidad.imagen && (
                        <div className="mb-2">
                          <span className="text-xs text-gray-500">Imagen: </span>
                          <a
                            href={especialidad.imagen}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {especialidad.imagen.substring(0, 40)}...
                          </a>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {especialidad.proyectosEjemplo && especialidad.proyectosEjemplo.slice(0, 3).map((proyecto, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded"
                          >
                            ● {proyecto}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleMoveUp(especialidad.id)}
                          variant="ghost"
                          size="sm"
                          disabled={index === 0}
                          title="Subir"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleMoveDown(especialidad.id)}
                          variant="ghost"
                          size="sm"
                          disabled={index === sortedEspecialidades.length - 1}
                          title="Bajar"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleToggleActive(especialidad.id)}
                          variant="ghost"
                          size="sm"
                          title={especialidad.activo ? 'Desactivar' : 'Activar'}
                        >
                          {especialidad.activo ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          onClick={() => handleEdit(especialidad)}
                          variant="ghost"
                          size="sm"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(especialidad.id)}
                          variant="ghost"
                          size="sm"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}

        {/* Nota informativa */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Nota:</strong> Las especialidades se mostrarán en el carrusel del
            hero en el orden definido aquí. Solo las especialidades activas serán
            visibles en el sitio web.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

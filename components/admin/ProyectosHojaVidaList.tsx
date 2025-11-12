"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Proyecto {
  id: string
  entidadContratante: string
  objetoContrato: string
  tituloDisplay: string | null
  descripcionSecundaria: string | null
  fechaInicio: string
  fechaFin: string
  ubicacion: string
  departamento: string | null
  valorContrato: number
  pesoKg: number | null
  areaM2: number | null
  visible: boolean
  destacado: boolean
}

export function ProyectosHojaVidaList() {
  const router = useRouter()
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchProyectos()
  }, [])

  const fetchProyectos = async () => {
    try {
      const res = await fetch('/api/trayectoria/proyectos')
      const data = await res.json()
      setProyectos(data)
    } catch (error) {
      console.error('Error fetching proyectos:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleVisible = async (id: string, currentValue: boolean) => {
    try {
      const proyecto = proyectos.find(p => p.id === id)
      if (!proyecto) return

      await fetch(`/api/trayectoria/proyectos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...proyecto, visible: !currentValue })
      })

      setProyectos(proyectos.map(p =>
        p.id === id ? { ...p, visible: !currentValue } : p
      ))
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const toggleDestacado = async (id: string, currentValue: boolean) => {
    try {
      const proyecto = proyectos.find(p => p.id === id)
      if (!proyecto) return

      await fetch(`/api/trayectoria/proyectos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...proyecto, destacado: !currentValue })
      })

      setProyectos(proyectos.map(p =>
        p.id === id ? { ...p, destacado: !currentValue } : p
      ))
    } catch (error) {
      console.error('Error toggling destacado:', error)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await fetch(`/api/trayectoria/proyectos/${deleteId}`, {
        method: 'DELETE'
      })

      setProyectos(proyectos.filter(p => p.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting proyecto:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short'
    })
  }

  const proyectosFiltrados = proyectos.filter(p => {
    const searchLower = busqueda.toLowerCase()
    return (
      p.entidadContratante.toLowerCase().includes(searchLower) ||
      p.objetoContrato.toLowerCase().includes(searchLower) ||
      p.ubicacion.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return <div className="text-center py-12">Cargando proyectos...</div>
  }

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por entidad, proyecto o ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700">{proyectos.length}</div>
          <div className="text-sm text-blue-600">Total proyectos</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-700">
            {proyectos.filter(p => p.visible).length}
          </div>
          <div className="text-sm text-green-600">Visibles</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-amber-700">
            {proyectos.filter(p => p.destacado).length}
          </div>
          <div className="text-sm text-amber-600">Destacados</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-slate-700">
            {proyectos.filter(p => !p.visible).length}
          </div>
          <div className="text-sm text-slate-600">Ocultos</div>
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Proyecto y Cliente</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Fechas</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proyectosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                  No se encontraron proyectos
                </TableCell>
              </TableRow>
            ) : (
              proyectosFiltrados.map((proyecto) => (
                <TableRow key={proyecto.id} className="hover:bg-slate-50">
                  <TableCell className="max-w-md">
                    <div className="space-y-1">
                      {proyecto.tituloDisplay ? (
                        <>
                          {/* Formato con título display (limpio) */}
                          <div className="font-semibold text-slate-900 truncate" title={proyecto.tituloDisplay}>
                            {proyecto.tituloDisplay}
                          </div>
                          {proyecto.descripcionSecundaria && (
                            <div className="text-sm text-slate-600 truncate" title={proyecto.descripcionSecundaria}>
                              {proyecto.descripcionSecundaria}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              {proyecto.entidadContratante}
                            </span>
                            {proyecto.destacado && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                                ⭐ Destacado
                              </Badge>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Formato original (fallback) */}
                          <div className="font-semibold text-slate-900 truncate" title={proyecto.objetoContrato}>
                            {proyecto.objetoContrato}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">
                              {proyecto.entidadContratante}
                            </span>
                            {proyecto.destacado && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                                ⭐ Destacado
                              </Badge>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {proyecto.ubicacion}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="w-3 h-3" />
                      {formatDate(proyecto.fechaInicio)} - {formatDate(proyecto.fechaFin)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-medium">
                      <DollarSign className="w-3 h-3" />
                      {formatCurrency(proyecto.valorContrato)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {proyecto.visible ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        Visible
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Oculto</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisible(proyecto.id, proyecto.visible)}
                        title={proyecto.visible ? 'Ocultar' : 'Mostrar'}
                      >
                        {proyecto.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDestacado(proyecto.id, proyecto.destacado)}
                        title={proyecto.destacado ? 'Quitar de destacados' : 'Marcar como destacado'}
                        className={proyecto.destacado ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : ''}
                      >
                        <Star className={`w-4 h-4 ${proyecto.destacado ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/trayectoria/${proyecto.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(proyecto.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

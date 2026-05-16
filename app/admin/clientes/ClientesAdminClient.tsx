'use client'

import { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Building2,
  Factory,
  ShoppingCart,
  Shield,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  GripVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const sectorIcons = {
  INDUSTRIAL: Factory,
  COMERCIAL: ShoppingCart,
  CONSTRUCCION: Building2,
  INSTITUCIONAL: Shield,
  GOBIERNO: Shield,
  ENERGIA: Shield,
  MINERIA: Shield,
  OTRO: Shield,
}

const sectorColors = {
  INDUSTRIAL: 'bg-blue-100 text-blue-800',
  COMERCIAL: 'bg-green-100 text-green-800',
  CONSTRUCCION: 'bg-gray-100 text-gray-800',
  INSTITUCIONAL: 'bg-purple-100 text-purple-800',
  GOBIERNO: 'bg-red-100 text-red-800',
  ENERGIA: 'bg-yellow-100 text-yellow-800',
  MINERIA: 'bg-orange-100 text-orange-800',
  OTRO: 'bg-gray-100 text-gray-800',
}

interface Cliente {
  id: string
  nombre: string
  logo?: string | null
  sitioWeb?: string | null
  sector: string
  proyectoDestacado?: string | null
  capacidadProyecto?: string | null
  mostrarEnHome: boolean
  destacado: boolean
  orden: number
}

interface ClientesAdminClientProps {
  initialClientes: Cliente[]
}

export default function ClientesAdminClient({ initialClientes }: ClientesAdminClientProps) {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes)
  const [searchTerm, setSearchTerm] = useState('')
  const [sectorFilter, setSectorFilter] = useState('TODOS')
  const [showInHomeFilter, setShowInHomeFilter] = useState('TODOS')
  const [savingOrder, setSavingOrder] = useState(false)
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const filtersActive =
    searchTerm.trim() !== '' || sectorFilter !== 'TODOS' || showInHomeFilter !== 'TODOS'

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      toast.error('Error al cargar clientes')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return

    try {
      const response = await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Cliente eliminado')
        fetchClientes()
      } else {
        toast.error('Error al eliminar cliente')
      }
    } catch (error) {
      toast.error('Error al eliminar cliente')
    }
  }

  const toggleMostrarEnHome = async (cliente: Cliente) => {
    try {
      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cliente, mostrarEnHome: !cliente.mostrarEnHome }),
      })
      if (response.ok) {
        toast.success('Cliente actualizado')
        fetchClientes()
      }
    } catch (error) {
      toast.error('Error al actualizar cliente')
    }
  }

  const toggleDestacado = async (cliente: Cliente) => {
    try {
      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cliente, destacado: !cliente.destacado }),
      })
      if (response.ok) {
        toast.success('Cliente actualizado')
        fetchClientes()
      }
    } catch (error) {
      toast.error('Error al actualizar cliente')
    }
  }

  const persistOrder = async (orderedList: Cliente[]) => {
    setSavingOrder(true)
    try {
      const items = orderedList.map((c, idx) => ({ id: c.id, orden: idx }))
      const response = await fetch('/api/clientes/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error || 'Error al guardar orden')
      }
      toast.success('Orden guardado')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al guardar orden'
      toast.error(msg)
      fetchClientes() // revertir desde servidor
    } finally {
      setSavingOrder(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = clientes.findIndex((c) => c.id === active.id)
    const newIndex = clientes.findIndex((c) => c.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const next = arrayMove(clientes, oldIndex, newIndex).map((c, idx) => ({ ...c, orden: idx }))
    setClientes(next)
    persistOrder(next)
  }

  const filteredClientes = useMemo(
    () =>
      clientes.filter((cliente) => {
        const matchesSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSector = sectorFilter === 'TODOS' || cliente.sector === sectorFilter
        const matchesShowInHome =
          showInHomeFilter === 'TODOS' ||
          (showInHomeFilter === 'SI' && cliente.mostrarEnHome) ||
          (showInHomeFilter === 'NO' && !cliente.mostrarEnHome)
        return matchesSearch && matchesSector && matchesShowInHome
      }),
    [clientes, searchTerm, sectorFilter, showInHomeFilter]
  )

  const itemIds = useMemo(() => filteredClientes.map((c) => c.id), [filteredClientes])

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-2">
            Administra los clientes y sus logos. Arrastra desde <GripVertical className="inline h-4 w-4 align-text-bottom" /> para reordenar — ese orden se refleja en la página pública.
          </p>
        </div>
        <Button onClick={() => router.push('/admin/clientes/nuevo')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los sectores</SelectItem>
            <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
            <SelectItem value="COMERCIAL">Comercial</SelectItem>
            <SelectItem value="CONSTRUCCION">Construcción</SelectItem>
            <SelectItem value="INSTITUCIONAL">Institucional</SelectItem>
            <SelectItem value="GOBIERNO">Gobierno</SelectItem>
            <SelectItem value="ENERGIA">Energía</SelectItem>
            <SelectItem value="MINERIA">Minería</SelectItem>
            <SelectItem value="OTRO">Otro</SelectItem>
          </SelectContent>
        </Select>

        <Select value={showInHomeFilter} onValueChange={setShowInHomeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Mostrar en home" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="SI">Mostrar en home</SelectItem>
            <SelectItem value="NO">No mostrar en home</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtersActive && (
        <div className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Reordenamiento deshabilitado mientras hay filtros activos. Limpia los filtros para arrastrar.
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Proyecto Destacado</TableHead>
              <TableHead>Mostrar en Home</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <SortableClienteRow
                    key={cliente.id}
                    cliente={cliente}
                    canDrag={!filtersActive && !savingOrder}
                    onEdit={() => router.push(`/admin/clientes/${cliente.id}`)}
                    onDelete={() => handleDelete(cliente.id)}
                    onToggleHome={() => toggleMostrarEnHome(cliente)}
                    onToggleDestacado={() => toggleDestacado(cliente)}
                  />
                ))}
              </TableBody>
            </SortableContext>
          </DndContext>
        </Table>

        {filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron clientes</p>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold">{clientes.length}</p>
          <p className="text-gray-600">Total Clientes</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold">{clientes.filter((c) => c.mostrarEnHome).length}</p>
          <p className="text-gray-600">En Home</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold">{clientes.filter((c) => c.destacado).length}</p>
          <p className="text-gray-600">Destacados</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold">{clientes.filter((c) => c.logo).length}</p>
          <p className="text-gray-600">Con Logo</p>
        </div>
      </div>
    </div>
  )
}

interface SortableClienteRowProps {
  cliente: Cliente
  canDrag: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleHome: () => void
  onToggleDestacado: () => void
}

function SortableClienteRow({
  cliente,
  canDrag,
  onEdit,
  onDelete,
  onToggleHome,
  onToggleDestacado,
}: SortableClienteRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cliente.id,
    disabled: !canDrag,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    background: isDragging ? '#f8fafc' : undefined,
  }

  const SectorIcon = (sectorIcons as any)[cliente.sector] || Shield

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-10">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={!canDrag}
          aria-label="Arrastrar para reordenar"
          className={`p-1 rounded transition-colors ${
            canDrag
              ? 'cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              : 'cursor-not-allowed text-gray-200'
          }`}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </TableCell>
      <TableCell>
        {cliente.logo ? (
          <div className="w-16 h-16 bg-gray-100 rounded-lg p-2 flex items-center justify-center">
            <Image
              src={cliente.logo}
              alt={cliente.nombre}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <SectorIcon className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{cliente.nombre}</p>
          {cliente.sitioWeb && <p className="text-sm text-gray-500">{cliente.sitioWeb}</p>}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={(sectorColors as any)[cliente.sector]}>{cliente.sector}</Badge>
      </TableCell>
      <TableCell>
        {cliente.proyectoDestacado ? (
          <div className="text-sm">
            <p className="font-medium">{cliente.proyectoDestacado}</p>
            <p className="text-gray-500">{cliente.capacidadProyecto}</p>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleHome}
          className={cliente.mostrarEnHome ? 'text-green-600' : 'text-gray-400'}
        >
          {cliente.mostrarEnHome ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDestacado}
          className={cliente.destacado ? 'text-yellow-600' : 'text-gray-400'}
        >
          <Star className={`h-4 w-4 ${cliente.destacado ? 'fill-current' : ''}`} />
        </Button>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Building2, Factory, ShoppingCart, Shield, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
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
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const sectorIcons = {
  INDUSTRIAL: Factory,
  COMERCIAL: ShoppingCart,
  CONSTRUCCION: Building2,
  INSTITUCIONAL: Shield,
  GOBIERNO: Shield,
  ENERGIA: Shield,
  MINERIA: Shield,
  OTRO: Shield
}

const sectorColors = {
  INDUSTRIAL: 'bg-blue-100 text-blue-800',
  COMERCIAL: 'bg-green-100 text-green-800',
  CONSTRUCCION: 'bg-gray-100 text-gray-800',
  INSTITUCIONAL: 'bg-purple-100 text-purple-800',
  GOBIERNO: 'bg-red-100 text-red-800',
  ENERGIA: 'bg-yellow-100 text-yellow-800',
  MINERIA: 'bg-orange-100 text-orange-800',
  OTRO: 'bg-gray-100 text-gray-800'
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sectorFilter, setSectorFilter] = useState('TODOS')
  const [showInHomeFilter, setShowInHomeFilter] = useState('TODOS')
  const router = useRouter()

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      toast.error('Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return

    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: 'DELETE'
      })

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

  const toggleMostrarEnHome = async (cliente: any) => {
    try {
      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cliente,
          mostrarEnHome: !cliente.mostrarEnHome
        })
      })

      if (response.ok) {
        toast.success('Cliente actualizado')
        fetchClientes()
      }
    } catch (error) {
      toast.error('Error al actualizar cliente')
    }
  }

  const toggleDestacado = async (cliente: any) => {
    try {
      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cliente,
          destacado: !cliente.destacado
        })
      })

      if (response.ok) {
        toast.success('Cliente actualizado')
        fetchClientes()
      }
    } catch (error) {
      toast.error('Error al actualizar cliente')
    }
  }

  const filteredClientes = clientes.filter((cliente: any) => {
    const matchesSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = sectorFilter === 'TODOS' || cliente.sector === sectorFilter
    const matchesShowInHome = showInHomeFilter === 'TODOS' || 
      (showInHomeFilter === 'SI' && cliente.mostrarEnHome) ||
      (showInHomeFilter === 'NO' && !cliente.mostrarEnHome)
    
    return matchesSearch && matchesSector && matchesShowInHome
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-2">Administra los clientes y sus logos</p>
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

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Proyecto Destacado</TableHead>
              <TableHead>Mostrar en Home</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.map((cliente: any) => {
              const SectorIcon = (sectorIcons as any)[cliente.sector] || Shield
              return (
                <TableRow key={cliente.id}>
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
                      {cliente.sitioWeb && (
                        <p className="text-sm text-gray-500">{cliente.sitioWeb}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={(sectorColors as any)[cliente.sector]}>
                      {cliente.sector}
                    </Badge>
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
                      onClick={() => toggleMostrarEnHome(cliente)}
                      className={cliente.mostrarEnHome ? 'text-green-600' : 'text-gray-400'}
                    >
                      {cliente.mostrarEnHome ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDestacado(cliente)}
                      className={cliente.destacado ? 'text-yellow-600' : 'text-gray-400'}
                    >
                      <Star className={`h-4 w-4 ${cliente.destacado ? 'fill-current' : ''}`} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/clientes/${cliente.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cliente.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
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
          <p className="text-3xl font-bold">
            {clientes.filter((c: any) => c.mostrarEnHome).length}
          </p>
          <p className="text-gray-600">En Home</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold">
            {clientes.filter((c: any) => c.destacado).length}
          </p>
          <p className="text-gray-600">Destacados</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold">
            {clientes.filter((c: any) => c.logo).length}
          </p>
          <p className="text-gray-600">Con Logo</p>
        </div>
      </div>
    </div>
  )
}
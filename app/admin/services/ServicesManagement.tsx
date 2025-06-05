'use client'

import { useState } from 'react'
import { Servicio } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus, Eye, EyeOff, Palette, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import * as Icons from 'lucide-react'

interface ServicesManagementProps {
  initialServices: Servicio[]
}

export default function ServicesManagement({ initialServices }: ServicesManagementProps) {
  const [services, setServices] = useState(initialServices)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/services/${deleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el servicio')
      }

      setServices(services.filter(s => s.id !== deleteId))
      toast.success('Servicio eliminado exitosamente')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar el servicio')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const toggleActive = async (serviceId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el servicio')
      }

      setServices(services.map(s => 
        s.id === serviceId ? { ...s, activo: !currentStatus } : s
      ))
      
      toast.success(`Servicio ${!currentStatus ? 'activado' : 'desactivado'}`)
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar el servicio')
    }
  }

  // Función para obtener el icono dinámicamente
  const getIcon = (iconName: string | null) => {
    if (!iconName) return Icons.Settings
    const Icon = (Icons as any)[iconName] || Icons.Settings
    return Icon
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Total de servicios: {services.length}
        </p>
        <Link href="/admin/services/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Agregar Servicio
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {services.map((service) => {
          const Icon = getIcon(service.icono)
          
          return (
            <Card key={service.id} className={!service.activo ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-${service.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${service.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {service.titulo || service.nombre}
                      </CardTitle>
                      {service.subtitulo && (
                        <p className="text-gray-600 mt-1">{service.subtitulo}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={service.activo ? 'default' : 'secondary'}>
                      {service.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                    {service.destacado && (
                      <Badge variant="outline">Destacado</Badge>
                    )}
                    <Badge variant="outline">Orden: {service.orden}</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {service.descripcion}
                </p>
                

                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  {service.expertiseTitulo && (
                    <span>✓ Expertise definido</span>
                  )}
                  {service.imagen && (
                    <span>✓ Imagen configurada</span>
                  )}
                  {service.bgGradient && (
                    <span>✓ Gradiente personalizado</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(service.id, service.activo)}
                    className="flex items-center gap-2"
                  >
                    {service.activo ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Activar
                      </>
                    )}
                  </Button>
                  
                  <Link href="/admin/services/visual">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                      <Palette className="w-4 h-4" />
                      Visual
                    </Button>
                  </Link>

                  <Link href="/admin/services/content">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <FileText className="w-4 h-4" />
                      Contenido
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(service.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el servicio
              de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
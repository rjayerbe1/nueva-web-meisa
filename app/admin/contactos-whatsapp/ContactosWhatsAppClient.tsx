'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, MessageSquare, Phone, Settings } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ContactoWhatsApp {
  id: string
  nombre: string
  cargo: string
  telefono: string
  mensajePredeterminado: string
  avatar: string | null
  orden: number
  activo: boolean
  createdAt: string
  updatedAt: string
}

interface Configuracion {
  id: string
  horarioAtencion: string
  mensajeIntroduccion: string
  tituloWidget: string
  activo: boolean
}

interface ContactosWhatsAppClientProps {
  initialContactos: ContactoWhatsApp[]
  initialConfiguracion: Configuracion | null
}

export default function ContactosWhatsAppClient({
  initialContactos,
  initialConfiguracion,
}: ContactosWhatsAppClientProps) {
  const [contactos, setContactos] = useState<ContactoWhatsApp[]>(initialContactos)
  const [configuracion, setConfiguracion] = useState<Configuracion | null>(initialConfiguracion)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [editingContacto, setEditingContacto] = useState<ContactoWhatsApp | null>(null)

  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    telefono: '',
    mensajePredeterminado: 'Hola, me gustaría solicitar información sobre sus servicios.',
    avatar: '',
    activo: true,
  })

  const [configFormData, setConfigFormData] = useState({
    horarioAtencion: initialConfiguracion?.horarioAtencion || '',
    mensajeIntroduccion: initialConfiguracion?.mensajeIntroduccion || '',
    tituloWidget: initialConfiguracion?.tituloWidget || '',
    activo: initialConfiguracion?.activo ?? true,
  })

  const fetchContactos = async () => {
    try {
      const response = await fetch('/api/admin/contactos-whatsapp')
      if (response.ok) {
        const data = await response.json()
        setContactos(data)
      } else {
        toast.error('Error al cargar contactos')
      }
    } catch (error) {
      toast.error('Error al cargar contactos')
    }
  }

  const fetchConfiguracion = async () => {
    try {
      const response = await fetch('/api/admin/contactos-whatsapp/configuracion')
      if (response.ok) {
        const data = await response.json()
        setConfiguracion(data)
        setConfigFormData({
          horarioAtencion: data.horarioAtencion,
          mensajeIntroduccion: data.mensajeIntroduccion,
          tituloWidget: data.tituloWidget,
          activo: data.activo,
        })
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error)
    }
  }

  const handleOpenDialog = (contacto?: ContactoWhatsApp) => {
    if (contacto) {
      setEditingContacto(contacto)
      setFormData({
        nombre: contacto.nombre,
        cargo: contacto.cargo,
        telefono: contacto.telefono,
        mensajePredeterminado: contacto.mensajePredeterminado,
        avatar: contacto.avatar || '',
        activo: contacto.activo
      })
    } else {
      setEditingContacto(null)
      setFormData({
        nombre: '',
        cargo: '',
        telefono: '',
        mensajePredeterminado: 'Hola, me gustaría solicitar información sobre sus servicios.',
        avatar: '',
        activo: true
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingContacto(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingContacto
        ? `/api/admin/contactos-whatsapp/${editingContacto.id}`
        : '/api/admin/contactos-whatsapp'

      const method = editingContacto ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          orden: editingContacto ? editingContacto.orden : contactos.length
        })
      })

      if (response.ok) {
        toast.success(editingContacto ? 'Contacto actualizado' : 'Contacto creado')
        handleCloseDialog()
        fetchContactos()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al guardar contacto')
      }
    } catch (error) {
      toast.error('Error al guardar contacto')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este contacto?')) return

    try {
      const response = await fetch(`/api/admin/contactos-whatsapp/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Contacto eliminado')
        fetchContactos()
      } else {
        toast.error('Error al eliminar contacto')
      }
    } catch (error) {
      toast.error('Error al eliminar contacto')
    }
  }

  const toggleActivo = async (contacto: ContactoWhatsApp) => {
    try {
      const response = await fetch(`/api/admin/contactos-whatsapp/${contacto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contacto,
          activo: !contacto.activo
        })
      })

      if (response.ok) {
        toast.success(contacto.activo ? 'Contacto desactivado' : 'Contacto activado')
        fetchContactos()
      } else {
        toast.error('Error al cambiar estado')
      }
    } catch (error) {
      toast.error('Error al cambiar estado')
    }
  }

  const moveContacto = async (index: number, direction: 'up' | 'down') => {
    const newContactos = [...contactos]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newContactos.length) return

    // Intercambiar posiciones
    const temp = newContactos[index]
    newContactos[index] = newContactos[targetIndex]
    newContactos[targetIndex] = temp

    // Actualizar órdenes
    const updates = newContactos.map((contacto, idx) => ({
      id: contacto.id,
      orden: idx
    }))

    try {
      const response = await fetch('/api/admin/contactos-whatsapp/reordenar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactos: updates })
      })

      if (response.ok) {
        toast.success('Orden actualizado')
        fetchContactos()
      } else {
        toast.error('Error al actualizar orden')
      }
    } catch (error) {
      toast.error('Error al actualizar orden')
    }
  }

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/contactos-whatsapp/configuracion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configFormData)
      })

      if (response.ok) {
        toast.success('Configuración actualizada')
        setIsConfigDialogOpen(false)
        fetchConfiguracion()
      } else {
        toast.error('Error al actualizar configuración')
      }
    } catch (error) {
      toast.error('Error al actualizar configuración')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Contactos de WhatsApp</h1>
          <p className="text-gray-600 mt-2">
            Gestiona los contactos que aparecen en el widget flotante de WhatsApp
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsConfigDialogOpen(true)}
            variant="outline"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Contacto
          </Button>
        </div>
      </div>

      {configuracion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Estado del Widget</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <p className="text-sm text-blue-700 font-medium">Estado</p>
              <Badge variant={configuracion.activo ? "default" : "secondary"}>
                {configuracion.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Título</p>
              <p className="text-sm text-blue-900">{configuracion.tituloWidget}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Horario</p>
              <p className="text-sm text-blue-900">{configuracion.horarioAtencion}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Orden</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No hay contactos registrados. Crea el primero.
                </TableCell>
              </TableRow>
            ) : (
              contactos.map((contacto, index) => (
                <TableRow key={contacto.id}>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveContacto(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveContacto(index, 'down')}
                        disabled={index === contactos.length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contacto.avatar || undefined} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {contacto.nombre.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contacto.nombre}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contacto.cargo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {contacto.telefono}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={contacto.activo ? "default" : "secondary"}>
                      {contacto.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActivo(contacto)}
                        title={contacto.activo ? 'Desactivar' : 'Activar'}
                      >
                        {contacto.activo ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(contacto)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(contacto.id)}
                        className="text-red-600 hover:text-red-700"
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

      {/* Dialog para crear/editar contacto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingContacto ? 'Editar Contacto' : 'Nuevo Contacto'}
            </DialogTitle>
            <DialogDescription>
              {editingContacto
                ? 'Actualiza la información del contacto de WhatsApp'
                : 'Agrega un nuevo contacto al widget de WhatsApp'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                  placeholder="Ej: Ricardo Ocampo"
                />
              </div>
              <div>
                <Label htmlFor="cargo">Cargo *</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) =>
                    setFormData({ ...formData, cargo: e.target.value })
                  }
                  required
                  placeholder="Ej: Gerente Comercial"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono de WhatsApp *</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                required
                placeholder="+57 310 432 7227"
              />
              <p className="text-xs text-gray-500 mt-1">
                Incluye el código de país (ej: +57 para Colombia)
              </p>
            </div>

            <div>
              <Label htmlFor="mensajePredeterminado">Mensaje Predeterminado</Label>
              <Textarea
                id="mensajePredeterminado"
                value={formData.mensajePredeterminado}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mensajePredeterminado: e.target.value,
                  })
                }
                rows={3}
                placeholder="Mensaje que se enviará al iniciar la conversación"
              />
            </div>

            <div>
              <Label htmlFor="avatar">URL del Avatar (opcional)</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.value })
                }
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Deja vacío para usar un avatar con las iniciales del nombre
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) =>
                  setFormData({ ...formData, activo: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="activo" className="cursor-pointer">
                Contacto activo (visible en el widget)
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingContacto ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para configuración */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configuración del Widget</DialogTitle>
            <DialogDescription>
              Personaliza los textos y el estado del widget flotante de WhatsApp
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfigSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tituloWidget">Título del Widget</Label>
              <Input
                id="tituloWidget"
                value={configFormData.tituloWidget}
                onChange={(e) =>
                  setConfigFormData({
                    ...configFormData,
                    tituloWidget: e.target.value,
                  })
                }
                placeholder="Háblanos por WhatsApp"
              />
            </div>

            <div>
              <Label htmlFor="mensajeIntroduccion">Mensaje de Introducción</Label>
              <Textarea
                id="mensajeIntroduccion"
                value={configFormData.mensajeIntroduccion}
                onChange={(e) =>
                  setConfigFormData({
                    ...configFormData,
                    mensajeIntroduccion: e.target.value,
                  })
                }
                rows={2}
                placeholder="Elije la persona disponible..."
              />
            </div>

            <div>
              <Label htmlFor="horarioAtencion">Horario de Atención</Label>
              <Input
                id="horarioAtencion"
                value={configFormData.horarioAtencion}
                onChange={(e) =>
                  setConfigFormData({
                    ...configFormData,
                    horarioAtencion: e.target.value,
                  })
                }
                placeholder="Lunes a Viernes: 7:00 AM - 5:00 PM"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activoConfig"
                checked={configFormData.activo}
                onChange={(e) =>
                  setConfigFormData({
                    ...configFormData,
                    activo: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="activoConfig" className="cursor-pointer">
                Widget activo (mostrar en el sitio público)
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConfigDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Configuración</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

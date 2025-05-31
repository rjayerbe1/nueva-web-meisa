'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, Copy, Download, Plus, X, Building2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { ImageUploaderFixed } from '@/components/admin/ImageUploaderFixed'

interface PageProps {
  params: { id: string }
}

export default function ClienteFormPage({ params }: PageProps) {
  const router = useRouter()
  const isNew = params.id === 'nuevo'
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    logo: '',
    logoBlanco: '',
    descripcion: '',
    sitioWeb: '',
    sector: 'COMERCIAL',
    proyectoDestacado: '',
    capacidadProyecto: '',
    ubicacionProyecto: '',
    mostrarEnHome: true,
    destacado: false,
    orden: 0,
    activo: true,
    slug: ''
  })
  
  const [availableProjects, setAvailableProjects] = useState([])
  const [connectedProjects, setConnectedProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(false)

  useEffect(() => {
    if (!isNew) {
      fetchCliente()
    }
    loadProjects()
  }, [params.id])

  const loadProjects = async () => {
    setLoadingProjects(true)
    try {
      const response = await fetch('/api/admin/projects')
      if (response.ok) {
        const projects = await response.json()
        setAvailableProjects(projects)
        
        if (!isNew) {
          // Filtrar proyectos conectados a este cliente
          const connected = projects.filter(p => p.clienteId === params.id)
          setConnectedProjects(connected)
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  const fetchCliente = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/clientes/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        // Handle null values to prevent React warnings
        setFormData({
          nombre: data.nombre || '',
          logo: data.logo || '',
          logoBlanco: data.logoBlanco || '',
          descripcion: data.descripcion || '',
          sitioWeb: data.sitioWeb || '',
          sector: data.sector || 'COMERCIAL',
          proyectoDestacado: data.proyectoDestacado || '',
          capacidadProyecto: data.capacidadProyecto || '',
          ubicacionProyecto: data.ubicacionProyecto || '',
          mostrarEnHome: data.mostrarEnHome ?? true,
          destacado: data.destacado ?? false,
          orden: data.orden || 0,
          activo: data.activo ?? true,
          slug: data.slug || ''
        })
      } else {
        toast.error('Error al cargar cliente')
      }
    } catch (error) {
      toast.error('Error al cargar cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = isNew ? '/api/clientes' : `/api/clientes/${params.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(isNew ? 'Cliente creado' : 'Cliente actualizado')
        router.push('/admin/clientes')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al guardar')
      }
    } catch (error) {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = (urls: string[]) => {
    setFormData({ ...formData, logo: urls[0] || '' })
  }

  const handleLogoBlancoUpload = (urls: string[]) => {
    setFormData({ ...formData, logoBlanco: urls[0] || '' })
  }

  const copyLogoToBlanco = () => {
    if (formData.logo) {
      setFormData({ ...formData, logoBlanco: formData.logo })
      toast.success('Logo principal copiado como logo blanco')
    } else {
      toast.error('No hay logo principal para copiar')
    }
  }

  const downloadLogo = async (logoUrl: string, logoType: 'principal' | 'blanco') => {
    if (!logoUrl) {
      toast.error(`No hay logo ${logoType} para descargar`)
      return
    }

    try {
      // Si es una URL de datos (base64), crear blob directamente
      if (logoUrl.startsWith('data:')) {
        const response = await fetch(logoUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${formData.nombre || 'cliente'}-logo-${logoType}.webp`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        // Si es una URL normal, descargar desde el servidor
        const response = await fetch(logoUrl)
        if (!response.ok) throw new Error('Error al descargar')
        
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        const extension = logoUrl.split('.').pop() || 'webp'
        link.download = `${formData.nombre || 'cliente'}-logo-${logoType}.${extension}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
      
      toast.success(`Logo ${logoType} descargado`)
    } catch (error) {
      console.error('Error downloading logo:', error)
      toast.error(`Error al descargar logo ${logoType}`)
    }
  }

  const connectProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId: params.id })
      })

      if (response.ok) {
        toast.success('Proyecto conectado')
        loadProjects()
      } else {
        toast.error('Error al conectar proyecto')
      }
    } catch (error) {
      toast.error('Error al conectar proyecto')
    }
  }

  const disconnectProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId: null })
      })

      if (response.ok) {
        toast.success('Proyecto desconectado')
        loadProjects()
      } else {
        toast.error('Error al desconectar proyecto')
      }
    } catch (error) {
      toast.error('Error al desconectar proyecto')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/clientes')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isNew ? 'Nuevo Cliente' : 'Editar Cliente'}
            </h1>
            <p className="text-gray-600">
              {isNew ? 'Añade un nuevo cliente' : 'Actualiza la información del cliente'}
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>
              Datos principales del cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del Cliente *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="sector">Sector *</Label>
              <Select
                value={formData.sector}
                onValueChange={(value) => setFormData({ ...formData, sector: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un sector" />
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div>
              <Label htmlFor="sitioWeb">Sitio Web</Label>
              <Input
                id="sitioWeb"
                type="url"
                value={formData.sitioWeb}
                onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
                placeholder="https://ejemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                placeholder="Breve descripción del cliente..."
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug URL</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="cliente-ejemplo"
              />
              <p className="text-sm text-gray-500 mt-1">
                Se genera automáticamente si lo dejas vacío
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Logos */}
        <Card>
          <CardHeader>
            <CardTitle>Logos</CardTitle>
            <CardDescription>
              Sube los logos del cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Logo Principal</Label>
                {formData.logo && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadLogo(formData.logo, 'principal')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                )}
              </div>
              <ImageUploaderFixed
                images={formData.logo ? [formData.logo] : []}
                onUpload={handleLogoUpload}
                maxFiles={1}
                acceptedFileTypes={['image/*']}
                label="Subir logo"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Logo Blanco (para fondos oscuros)</Label>
                <div className="flex gap-2">
                  {formData.logo && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyLogoToBlanco}
                      disabled={!formData.logo}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar principal
                    </Button>
                  )}
                  {formData.logoBlanco && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => downloadLogo(formData.logoBlanco, 'blanco')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  )}
                </div>
              </div>
              <ImageUploaderFixed
                images={formData.logoBlanco ? [formData.logoBlanco] : []}
                onUpload={handleLogoBlancoUpload}
                maxFiles={1}
                acceptedFileTypes={['image/*']}
                label="Subir logo blanco"
              />
            </div>
          </CardContent>
        </Card>

        {/* Proyecto destacado */}
        <Card>
          <CardHeader>
            <CardTitle>Proyecto Destacado</CardTitle>
            <CardDescription>
              Información del proyecto principal con este cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="proyectoDestacado">Nombre del Proyecto</Label>
              <Input
                id="proyectoDestacado"
                value={formData.proyectoDestacado}
                onChange={(e) => setFormData({ ...formData, proyectoDestacado: e.target.value })}
                placeholder="Centro Comercial Ejemplo"
              />
            </div>

            <div>
              <Label htmlFor="capacidadProyecto">Capacidad/Tamaño</Label>
              <Input
                id="capacidadProyecto"
                value={formData.capacidadProyecto}
                onChange={(e) => setFormData({ ...formData, capacidadProyecto: e.target.value })}
                placeholder="500 toneladas"
              />
            </div>

            <div>
              <Label htmlFor="ubicacionProyecto">Ubicación</Label>
              <Input
                id="ubicacionProyecto"
                value={formData.ubicacionProyecto}
                onChange={(e) => setFormData({ ...formData, ubicacionProyecto: e.target.value })}
                placeholder="Bogotá, Colombia"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
            <CardDescription>
              Opciones de visualización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar en página principal</Label>
                <p className="text-sm text-gray-500">
                  El cliente aparecerá en la sección de clientes del home
                </p>
              </div>
              <Switch
                checked={formData.mostrarEnHome}
                onCheckedChange={(checked) => setFormData({ ...formData, mostrarEnHome: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cliente destacado</Label>
                <p className="text-sm text-gray-500">
                  Aparecerá primero en las listas
                </p>
              </div>
              <Switch
                checked={formData.destacado}
                onCheckedChange={(checked) => setFormData({ ...formData, destacado: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activo</Label>
                <p className="text-sm text-gray-500">
                  Cliente activo en el sistema
                </p>
              </div>
              <Switch
                checked={formData.activo}
                onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
              />
            </div>

            <div>
              <Label htmlFor="orden">Orden de visualización</Label>
              <Input
                id="orden"
                type="number"
                value={formData.orden}
                onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                min="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Menor número aparece primero (0 = orden por defecto)
              </p>
            </div>
          </CardContent>
        </Card>
        </form>

        {/* Proyectos Conectados */}
        {!isNew && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Proyectos Conectados
              </CardTitle>
              <CardDescription>
                Proyectos asociados a este cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingProjects ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Proyectos Conectados */}
                  {connectedProjects.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Proyectos Asociados ({connectedProjects.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {connectedProjects.map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div>
                                <p className="font-medium text-gray-900">{project.titulo}</p>
                                <p className="text-sm text-gray-500">{project.categoria?.replace('_', ' ')}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/admin/projects/${project.id}`, '_blank')}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => disconnectProject(project.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Proyectos Disponibles */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Conectar Proyectos Existentes
                    </h4>
                    <div className="max-h-60 overflow-y-auto">
                      {availableProjects
                        .filter(p => p.clienteId !== params.id && (!p.clienteId || p.cliente === formData.nombre))
                        .map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <div>
                                <p className="font-medium text-gray-900">{project.titulo}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span>{project.categoria?.replace('_', ' ')}</span>
                                  {project.cliente && (
                                    <>
                                      <span>•</span>
                                      <span>Cliente: {project.cliente}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => connectProject(project.id)}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Conectar
                            </Button>
                          </div>
                        ))}
                      {availableProjects.filter(p => p.clienteId !== params.id && (!p.clienteId || p.cliente === formData.nombre)).length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          No hay proyectos disponibles para conectar
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
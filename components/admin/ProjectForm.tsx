"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { ProgressTracker } from "@/components/admin/ProgressTracker"
import { Loader2, Save, Eye } from "lucide-react"
import { CategoriaEnum, EstadoProyecto, PrioridadEnum } from "@prisma/client"

const projectSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  categoria: z.nativeEnum(CategoriaEnum),
  estado: z.nativeEnum(EstadoProyecto),
  prioridad: z.nativeEnum(PrioridadEnum),
  fechaInicio: z.string(),
  fechaFin: z.string().optional(),
  fechaEstimada: z.string().optional(),
  presupuesto: z.number().optional(),
  cliente: z.string().min(1, "El cliente es requerido"),
  contactoCliente: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  coordenadas: z.string().optional(),
  tags: z.array(z.string()).default([]),
  destacado: z.boolean().default(false),
  destacadoEnCategoria: z.boolean().default(false),
  visible: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>
  onSubmit: (data: ProjectFormData) => Promise<void>
  isLoading?: boolean
}

const categoriaLabels = {
  CENTROS_COMERCIALES: "Centros Comerciales",
  EDIFICIOS: "Edificios",
  INDUSTRIA: "Industria",
  PUENTES_VEHICULARES: "Puentes Vehiculares",
  PUENTES_PEATONALES: "Puentes Peatonales",
  ESCENARIOS_DEPORTIVOS: "Escenarios Deportivos",
  CUBIERTAS_Y_FACHADAS: "Cubiertas y Fachadas",
  ESTRUCTURAS_MODULARES: "Estructuras Modulares",
  OIL_AND_GAS: "Oil & Gas",
  OTRO: "Otro"
}

const estadoLabels = {
  PLANIFICACION: "Planificación",
  EN_PROGRESO: "En Progreso",
  PAUSADO: "Pausado",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado"
}

const prioridadLabels = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
  URGENTE: "Urgente"
}

export function ProjectForm({ initialData, onSubmit, isLoading }: ProjectFormProps) {
  const [imagenes, setImagenes] = useState<string[]>([])
  const [preview, setPreview] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      prioridad: PrioridadEnum.MEDIA,
      estado: EstadoProyecto.PLANIFICACION,
      destacado: false,
      destacadoEnCategoria: false,
      visible: true,
      ...initialData
    }
  })

  const watchedData = watch()

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      await onSubmit({
        ...data,
        presupuesto: data.presupuesto ? Number(data.presupuesto) : undefined
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {initialData ? "Editar Proyecto" : "Nuevo Proyecto"}
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreview(!preview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {preview ? "Ocultar" : "Vista Previa"}
          </Button>
        </div>
      </div>

      <div className={`grid ${preview ? "grid-cols-2" : "grid-cols-1"} gap-6`}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título del Proyecto</Label>
                <Input
                  id="titulo"
                  {...register("titulo")}
                  placeholder="Ej: Centro Comercial Portal del Norte"
                />
                {errors.titulo && (
                  <p className="text-sm text-red-600">{errors.titulo.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  {...register("descripcion")}
                  placeholder="Descripción detallada del proyecto..."
                  rows={4}
                />
                {errors.descripcion && (
                  <p className="text-sm text-red-600">{errors.descripcion.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={watchedData.categoria}
                    onValueChange={(value) => setValue("categoria", value as CategoriaEnum)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoriaLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={watchedData.estado}
                    onValueChange={(value) => setValue("estado", value as EstadoProyecto)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(estadoLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cliente y Ubicación */}
          <Card>
            <CardHeader>
              <CardTitle>Cliente y Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    {...register("cliente")}
                    placeholder="Nombre del cliente"
                  />
                </div>

                <div>
                  <Label htmlFor="contactoCliente">Contacto</Label>
                  <Input
                    id="contactoCliente"
                    {...register("contactoCliente")}
                    placeholder="Persona de contacto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    {...register("telefono")}
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="contacto@cliente.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  {...register("ubicacion")}
                  placeholder="Ciudad, Departamento, País"
                />
              </div>
            </CardContent>
          </Card>

          {/* Fechas y Presupuesto */}
          <Card>
            <CardHeader>
              <CardTitle>Cronograma y Presupuesto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    {...register("fechaInicio")}
                  />
                </div>

                <div>
                  <Label htmlFor="fechaEstimada">Fecha Estimada</Label>
                  <Input
                    id="fechaEstimada"
                    type="date"
                    {...register("fechaEstimada")}
                  />
                </div>

                <div>
                  <Label htmlFor="fechaFin">Fecha Finalización</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    {...register("fechaFin")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="presupuesto">Presupuesto (COP)</Label>
                  <Input
                    id="presupuesto"
                    type="number"
                    {...register("presupuesto", { valueAsNumber: true })}
                    placeholder="100000000"
                  />
                </div>

                <div>
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select
                    value={watchedData.prioridad}
                    onValueChange={(value) => setValue("prioridad", value as PrioridadEnum)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(prioridadLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Visibilidad */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Visibilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="destacado" className="text-sm font-medium">
                      Proyecto Destacado
                    </Label>
                    <p className="text-xs text-gray-500">
                      Aparecerá en la sección de proyectos destacados
                    </p>
                  </div>
                  <Switch
                    id="destacado"
                    checked={watchedData.destacado}
                    onCheckedChange={(checked) => setValue("destacado", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="destacadoEnCategoria" className="text-sm font-medium">
                      Destacado en Categoría
                    </Label>
                    <p className="text-xs text-gray-500">
                      Aparecerá en la sección de proyectos por categoría del home
                    </p>
                  </div>
                  <Switch
                    id="destacadoEnCategoria"
                    checked={watchedData.destacadoEnCategoria}
                    onCheckedChange={(checked) => setValue("destacadoEnCategoria", checked)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="visible" className="text-sm font-medium">
                    Proyecto Visible
                  </Label>
                  <p className="text-xs text-gray-500">
                    Controla si el proyecto es visible en el sitio web
                  </p>
                </div>
                <Switch
                  id="visible"
                  checked={watchedData.visible}
                  onCheckedChange={(checked) => setValue("visible", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Imágenes */}
          <Card>
            <CardHeader>
              <CardTitle>Imágenes del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={imagenes}
                onImagesChange={setImagenes}
                maxImages={20}
              />
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              size="lg"
            >
              {isSubmitting || isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {initialData ? "Actualizar" : "Crear"} Proyecto
            </Button>
          </div>
        </form>

        {/* Vista Previa */}
        {preview && (
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{watchedData.titulo || "Título del proyecto"}</h2>
                <p className="text-gray-600">{watchedData.descripcion || "Descripción del proyecto..."}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Cliente:</strong> {watchedData.cliente || "N/A"}
                  </div>
                  <div>
                    <strong>Ubicación:</strong> {watchedData.ubicacion || "N/A"}
                  </div>
                  <div>
                    <strong>Categoría:</strong> {watchedData.categoria ? categoriaLabels[watchedData.categoria] : "N/A"}
                  </div>
                  <div>
                    <strong>Estado:</strong> {watchedData.estado ? estadoLabels[watchedData.estado] : "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { 
  ArrowLeft, Calendar, MapPin, Users, DollarSign, 
  Building, Clock, Tag, Edit, Image as ImageIcon,
  FileText, CheckCircle, AlertCircle, XCircle, Scale, Ruler
} from "lucide-react"
import ProjectDetailClient from "@/components/admin/ProjectDetailClient"
import ProjectImageGallery from "@/components/admin/ProjectImageGallery"

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

async function getProject(id: string) {
  return await prisma.proyecto.findUnique({
    where: { id },
    include: {
      imagenes: {
        orderBy: { createdAt: 'desc' }
      },
      documentos: {
        orderBy: { createdAt: 'desc' }
      },
      progreso: {
        orderBy: { orden: 'asc' }
      },
      timeline: {
        orderBy: { fecha: 'asc' }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  // Calcular progreso total
  const totalProgress = project.progreso.length > 0
    ? Math.round(project.progreso.reduce((acc, p) => acc + p.porcentaje, 0) / project.progreso.length)
    : 0

  // Formatear valores monetarios
  const formatCurrency = (value: any) => {
    if (!value) return '--'
    const numValue = typeof value === 'number' ? value : Number(value)
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: project.moneda || 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue)
  }

  // Formatear toneladas
  const formatToneladas = (toneladas: any) => {
    if (!toneladas) return '--'
    return `${parseFloat(toneladas).toFixed(1)} ton`
  }

  // Formatear área
  const formatArea = (area: any) => {
    if (!area) return '--'
    const areaNum = parseFloat(area)
    if (areaNum >= 10000) {
      return `${(areaNum / 10000).toFixed(1)} ha`
    }
    return `${areaNum.toLocaleString('es-CO')} m²`
  }

  // Obtener icono de estado
  const getStatusIcon = () => {
    switch (project.estado) {
      case 'COMPLETADO':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'EN_PROGRESO':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'PAUSADO':
      case 'CANCELADO':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  // Obtener color de prioridad
  const getPriorityColor = () => {
    switch (project.prioridad) {
      case 'ALTA':
        return 'text-red-600 bg-red-100'
      case 'MEDIA':
        return 'text-yellow-600 bg-yellow-100'
      case 'BAJA':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Link
            href="/admin/projects"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.titulo}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                {getStatusIcon()}
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {project.estado.replace('_', ' ')}
                </span>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor()}`}>
                Prioridad {project.prioridad}
              </span>
              {project.destacado && (
                <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                  Destacado
                </span>
              )}
            </div>
          </div>
        </div>
        <Link
          href={`/admin/projects/${project.id}/edit`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-meisa-blue rounded-md hover:bg-blue-700"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Link>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descripción */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
            <p className="text-gray-600 whitespace-pre-line">{project.descripcion}</p>
          </div>

          {/* Detalles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Proyecto</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium text-gray-900">{project.cliente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Categoría</p>
                <p className="font-medium text-gray-900">{project.categoria.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ubicación</p>
                <p className="font-medium text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.ubicacion}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fechas</p>
                <p className="font-medium text-gray-900">
                  {new Date(project.fechaInicio).toLocaleDateString()} - {project.fechaFin ? new Date(project.fechaFin).toLocaleDateString() : 'En progreso'}
                </p>
              </div>
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          {(project.toneladas || project.areaTotal) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones Técnicas</h2>
              <div className="grid grid-cols-2 gap-6">
                {project.toneladas && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Scale className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-900">Toneladas de Acero</p>
                        <p className="text-2xl font-bold text-blue-600">{formatToneladas(project.toneladas)}</p>
                      </div>
                    </div>
                  </div>
                )}
                {project.areaTotal && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Ruler className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-900">Área Total</p>
                        <p className="text-2xl font-bold text-green-600">{formatArea(project.areaTotal)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Métricas adicionales */}
              {project.toneladas && project.areaTotal && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Métricas de Eficiencia</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Densidad de Acero</p>
                      <p className="text-sm font-medium text-gray-900">
                        {(parseFloat(project.toneladas) / parseFloat(project.areaTotal) * 1000).toFixed(1)} kg/m²
                      </p>
                    </div>
                    {project.presupuesto && (
                      <div>
                        <p className="text-xs text-gray-500">Costo por Tonelada</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(parseFloat(project.presupuesto) / parseFloat(project.toneladas))}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progreso */}
          {project.progreso.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Progreso del Proyecto</h2>
              <div className="space-y-4">
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso Total</span>
                    <span className="text-sm font-medium text-gray-900">{totalProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                </div>
                {project.progreso.map((fase) => (
                  <div key={fase.id} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{fase.fase}</h3>
                        {fase.descripcion && (
                          <p className="text-sm text-gray-600 mt-1">{fase.descripcion}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{fase.porcentaje}%</span>
                        {fase.completado && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2 inline" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Galería de Imágenes */}
          <ProjectImageGallery
            projectId={project.id}
            projectTitle={project.titulo}
            images={project.imagenes}
            canEdit={session.user.role !== 'VIEWER'}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Finanzas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Financiera</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Presupuesto</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(project.presupuesto)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Costo Real</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(project.costoReal)}</p>
              </div>
              {project.presupuesto && project.costoReal && (
                <div>
                  <p className="text-sm text-gray-500">Margen</p>
                  <p className="text-lg font-medium text-gray-900">
                    {((1 - Number(project.costoReal) / Number(project.presupuesto)) * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contacto */}
          {(project.contactoCliente || project.telefono || project.email) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacto del Cliente</h2>
              <div className="space-y-3">
                {project.contactoCliente && (
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="font-medium text-gray-900">{project.contactoCliente}</p>
                  </div>
                )}
                {project.telefono && (
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium text-gray-900">{project.telefono}</p>
                  </div>
                )}
                {project.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{project.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <p>Creado por: {project.user.name || project.user.email}</p>
            <p>Fecha: {new Date(project.createdAt).toLocaleDateString()}</p>
            <p>Última actualización: {new Date(project.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Cliente Component para acciones */}
      <ProjectDetailClient projectId={project.id} />
    </div>
  )
}
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { Building2, Users, Wrench, MessageSquare, BarChart3, Plus, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

async function getStats() {
  const [proyectos, servicios, formularios] = await Promise.all([
    prisma.proyecto.count(),
    prisma.servicio.count(),
    prisma.contactForm.count({ where: { leido: false } }).catch(() => 0),
  ])

  const proyectosRecientes = await prisma.proyecto.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      titulo: true,
      estado: true,
      createdAt: true,
      cliente: true,
    }
  })

  return {
    proyectos,
    servicios,
    formularios,
    proyectosRecientes,
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/")
  }

  const stats = await getStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-lg text-gray-600">
            Bienvenido, {session.user.name || session.user.email}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-meisa-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Proyecto
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Proyectos</p>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{stats.proyectos}</p>
                <span className="ml-2 text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Servicios Activos</p>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{stats.servicios}</p>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Wrench className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mensajes Nuevos</p>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{stats.formularios}</p>
                {stats.formularios > 0 && (
                  <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    Sin leer
                  </span>
                )}
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total General</p>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">
                  {stats.proyectos + stats.servicios}
                </p>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Proyectos Recientes */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Proyectos Recientes</h2>
            <p className="text-sm text-gray-500 mt-1">Últimas actualizaciones de proyectos</p>
          </div>
          <Link
            href="/admin/projects"
            className="text-meisa-blue hover:text-blue-700 text-sm font-medium flex items-center"
          >
            Ver todos
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.proyectosRecientes.length > 0 ? (
            stats.proyectosRecientes.map((proyecto) => (
              <Link
                key={proyecto.id}
                href={`/admin/projects/${proyecto.id}`}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-2 h-12 bg-meisa-blue rounded-full" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{proyecto.titulo}</h3>
                    <p className="text-sm text-gray-500">{proyecto.cliente}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                    proyecto.estado === 'COMPLETADO' ? 'bg-green-100 text-green-800' :
                    proyecto.estado === 'EN_PROGRESO' ? 'bg-blue-100 text-blue-800' :
                    proyecto.estado === 'PAUSADO' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {proyecto.estado.replace('_', ' ')}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(proyecto.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No hay proyectos aún</p>
              <Link
                href="/admin/projects/new"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Crear el primer proyecto
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/projects"
            className="group relative bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-meisa-blue transition-all"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Building2 className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-meisa-blue transition-colors">
                Gestionar Proyectos
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Crear, editar y administrar todos los proyectos de MEISA
              </p>
            </div>
            <span className="absolute top-6 right-6 text-gray-300 group-hover:text-meisa-blue transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          <Link
            href="/admin/services"
            className="group relative bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-green-500 transition-all"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                <Wrench className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                Servicios
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Administrar todos los servicios que ofrece MEISA
              </p>
            </div>
            <span className="absolute top-6 right-6 text-gray-300 group-hover:text-green-500 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          <Link
            href="/admin/messages"
            className="group relative bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-500 transition-all"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
                <MessageSquare className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                Mensajes
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Ver y gestionar consultas de clientes potenciales
              </p>
            </div>
            <span className="absolute top-6 right-6 text-gray-300 group-hover:text-orange-500 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
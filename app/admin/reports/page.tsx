import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { BarChart3, TrendingUp, Calendar, FileText, DollarSign, Building2, Users } from "lucide-react"
import ReportsExport from "@/components/admin/ReportsExport"

async function getReportData() {
  const [proyectos, servicios, contactos, equipo] = await Promise.all([
    prisma.proyecto.findMany({
      select: {
        estado: true,
        categoria: true,
        presupuesto: true,
        fechaInicio: true,
        fechaFin: true,
        createdAt: true,
      }
    }),
    prisma.servicio.count(),
    prisma.contactForm.findMany({
      select: {
        createdAt: true,
        leido: true,
      }
    }),
    prisma.miembroEquipo.count(),
  ])

  // Calcular estadísticas
  const totalProyectos = proyectos.length
  const proyectosCompletados = proyectos.filter(p => p.estado === 'COMPLETADO').length
  const proyectosEnProgreso = proyectos.filter(p => p.estado === 'EN_PROGRESO').length
  const proyectosPausados = proyectos.filter(p => p.estado === 'PAUSADO').length
  
  const presupuestoTotal = proyectos.reduce((sum, p) => sum + (Number(p.presupuesto) || 0), 0)
  
  const proyectosPorCategoria = proyectos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const contactosPorMes = contactos.reduce((acc, c) => {
    const mes = new Date(c.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
    acc[mes] = (acc[mes] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalProyectos,
    proyectosCompletados,
    proyectosEnProgreso,
    proyectosPausados,
    presupuestoTotal,
    proyectosPorCategoria,
    contactosPorMes,
    totalServicios: servicios,
    totalContactos: contactos.length,
    contactosNoLeidos: contactos.filter(c => !c.leido).length,
    totalEquipo: equipo,
  }
}

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/")
  }

  const data = await getReportData()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="mt-2 text-lg text-gray-600">
            Análisis detallado del desempeño de MEISA
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <ReportsExport data={data} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Proyectos Totales</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{data.totalProyectos}</p>
              <div className="mt-2 flex items-center text-sm">
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {data.proyectosCompletados} completados
                </div>
              </div>
            </div>
            <Building2 className="h-12 w-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Presupuesto Total</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                ${new Intl.NumberFormat('es-CO').format(data.presupuestoTotal)}
              </p>
              <p className="text-sm text-green-600 mt-2">COP en proyectos</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Contactos</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">{data.totalContactos}</p>
              <p className="text-sm text-orange-600 mt-2">
                {data.contactosNoLeidos} sin leer
              </p>
            </div>
            <FileText className="h-12 w-12 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Equipo</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{data.totalEquipo}</p>
              <p className="text-sm text-purple-600 mt-2">miembros activos</p>
            </div>
            <Users className="h-12 w-12 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de Proyectos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado de Proyectos</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Completados</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 mr-2">{data.proyectosCompletados}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${(data.proyectosCompletados / data.totalProyectos * 100)}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">En Progreso</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 mr-2">{data.proyectosEnProgreso}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(data.proyectosEnProgreso / data.totalProyectos * 100)}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Pausados</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 mr-2">{data.proyectosPausados}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(data.proyectosPausados / data.totalProyectos * 100)}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proyectos por Categoría */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Proyectos por Categoría</h2>
          <div className="space-y-3">
            {Object.entries(data.proyectosPorCategoria).map(([categoria, count]) => (
              <div key={categoria} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{categoria.replace('_', ' ')}</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-3">{count}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-meisa-blue h-2 rounded-full" style={{width: `${(count / data.totalProyectos * 100)}%`}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <Building2 className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-sm text-gray-700">
              {data.proyectosEnProgreso} proyectos actualmente en progreso
            </span>
          </div>
          <div className="flex items-center p-3 bg-orange-50 rounded-lg">
            <FileText className="h-5 w-5 text-orange-600 mr-3" />
            <span className="text-sm text-gray-700">
              {data.contactosNoLeidos} mensajes pendientes de respuesta
            </span>
          </div>
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-sm text-gray-700">
              {data.proyectosCompletados} proyectos completados exitosamente
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
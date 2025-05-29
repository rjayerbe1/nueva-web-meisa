import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import ConfigurationForm from "@/components/admin/ConfigurationForm"

export default async function ConfiguracionPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/admin")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-2 text-lg text-gray-600">
            Gestiona la configuración general del sistema
          </p>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ConfigurationForm />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Versión</p>
                <p className="text-sm font-medium text-gray-900">2.0.0</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Base de datos</p>
                <p className="text-sm font-medium text-gray-900">PostgreSQL 15.2</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Framework</p>
                <p className="text-sm font-medium text-gray-900">Next.js 14.2</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Último mantenimiento</p>
                <p className="text-sm font-medium text-gray-900">29 May 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
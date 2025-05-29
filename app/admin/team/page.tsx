import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { Users, Plus } from "lucide-react"
import Link from "next/link"
import TeamMemberCard from "@/components/admin/TeamMemberCard"

async function getTeamMembers() {
  return await prisma.miembroEquipo.findMany({
    orderBy: { orden: 'asc' },
  })
}

export default async function TeamPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/")
  }

  const teamMembers = await getTeamMembers()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión del Equipo</h1>
          <p className="mt-2 text-lg text-gray-600">
            Administra los miembros del equipo de MEISA
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/team/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-meisa-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Miembro
          </Link>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay miembros del equipo</h3>
          <p className="text-gray-500 mb-4">Comienza agregando el primer miembro</p>
          <Link
            href="/admin/team/new"
            className="bg-meisa-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Miembro
          </Link>
        </div>
      )}
    </div>
  )
}
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { ProjectsPageClient } from "@/components/admin/ProjectsPageClient"

async function getProjects() {
  const projects = await prisma.proyecto.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      titulo: true,
      codigoInterno: true,
      categoria: true,
      estado: true,
      cliente: true,
      ubicacion: true,
      fechaInicio: true,
      fechaFin: true,
      presupuesto: true,
      toneladas: true,
      areaTotal: true,
      destacado: true,
      visible: true,
      createdAt: true,
      imagenes: {
        where: { tipo: 'PORTADA' },
        take: 1,
        select: {
          url: true,
          alt: true
        }
      }
    }
  })

  // Convertir Decimal a number y serializar fechas para el cliente
  return projects.map(project => ({
    ...project,
    presupuesto: project.presupuesto ? Number(project.presupuesto) : null,
    toneladas: project.toneladas ? Number(project.toneladas) : null,
    areaTotal: project.areaTotal ? Number(project.areaTotal) : null,
    fechaInicio: project.fechaInicio.toISOString(),
    fechaFin: project.fechaFin?.toISOString() || null,
    createdAt: project.createdAt.toISOString(),
    imagenPortada: project.imagenes[0] || null,
    imagenes: undefined // No necesitamos pasar el array completo al cliente
  }))
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/")
  }

  const projects = await getProjects()

  return <ProjectsPageClient projects={projects} />
}
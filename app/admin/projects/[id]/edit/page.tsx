import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import EditProjectForm from "@/components/admin/EditProjectForm"
import ProjectImageGallery from "@/components/admin/ProjectImageGallery"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/admin/projects")
  }

  const project = await prisma.proyecto.findUnique({
    where: { id: params.id },
    include: {
      imagenes: true,
      documentos: true,
      progreso: {
        orderBy: { orden: 'asc' }
      }
    }
  })

  if (!project) {
    notFound()
  }

  // Convert Decimal fields to numbers for the form
  const projectForForm = {
    ...project,
    presupuesto: project.presupuesto ? Number(project.presupuesto) : null,
    costoReal: project.costoReal ? Number(project.costoReal) : null,
    toneladas: project.toneladas ? Number(project.toneladas) : null,
    areaTotal: project.areaTotal ? Number(project.areaTotal) : null,
  }

  return (
    <div className="space-y-8">
      <EditProjectForm project={projectForForm as any} />
      
      {/* Galería de Imágenes */}
      <ProjectImageGallery
        projectId={project.id}
        projectTitle={project.titulo}
        images={project.imagenes}
        canEdit={true}
      />
    </div>
  )
}
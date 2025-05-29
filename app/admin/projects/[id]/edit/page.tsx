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

  return (
    <div className="space-y-8">
      <EditProjectForm project={project} />
      
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
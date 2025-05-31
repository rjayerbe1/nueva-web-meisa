import { prisma } from "@/lib/prisma"
import ProjectsPageClient from "./ProjectsPageClient"

async function getProyectos() {
  return await prisma.proyecto.findMany({
    where: { visible: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      categoria: true,
      estado: true,
      cliente: true,
      ubicacion: true,
      fechaInicio: true,
      presupuesto: true,
      slug: true,
      destacado: true,
    }
  })
}

export default async function ProyectosPage() {
  const proyectos = await getProyectos()

  return <ProjectsPageClient proyectos={proyectos} />
}
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { BrochureVisualBuilder } from "@/components/admin/BrochureVisualBuilder"

async function getBrochureWithData(brochureId: string) {
  const [brochure, components, projects] = await Promise.all([
    prisma.brochure.findUnique({
      where: { id: brochureId },
      include: {
        template: {
          include: {
            pages: {
              orderBy: { orden: 'asc' }
            }
          }
        },
        categoria: true,
        pages: {
          orderBy: { orden: 'asc' }
        }
      }
    }),
    prisma.brochureComponent.findMany({
      where: { isPublic: true },
      orderBy: { usageCount: 'desc' }
    }),
    // Get projects for the category if assigned
    prisma.proyecto.findMany({
      where: {
        // Will filter by category if brochure has one
        visible: true,
        estado: 'COMPLETADO'
      },
      take: 20,
      orderBy: { destacado: 'desc' },
      include: {
        imagenes: {
          where: { tipo: 'PORTADA' },
          take: 1
        }
      }
    })
  ])

  if (!brochure) {
    return null
  }

  return {
    brochure,
    components,
    projects: projects.map(p => ({
      ...p,
      fechaInicio: p.fechaInicio.toISOString(),
      fechaFin: p.fechaFin?.toISOString() || null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      toneladas: p.toneladas ? Number(p.toneladas) : null,
      areaTotal: p.areaTotal ? Number(p.areaTotal) : null,
      presupuesto: p.presupuesto ? Number(p.presupuesto) : null,
      costoReal: p.costoReal ? Number(p.costoReal) : null
    }))
  }
}

export default async function BrochureBuilderPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/admin")
  }

  const data = await getBrochureWithData(params.id)

  if (!data) {
    notFound()
  }

  const { brochure, components, projects } = data

  return (
    <div className="h-screen overflow-hidden">
      <BrochureVisualBuilder
        brochure={{
          ...brochure,
          createdAt: brochure.createdAt.toISOString(),
          updatedAt: brochure.updatedAt.toISOString(),
          fechaPublicacion: brochure.fechaPublicacion?.toISOString() || null
        } as any}
      />
    </div>
  )
}

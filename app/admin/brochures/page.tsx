import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { BrochuresPageClient } from "@/components/admin/BrochuresPageClient"

async function getBrochures() {
  const brochures = await prisma.brochure.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      activo: true,
      publicado: true,
      urlAmigable: true,
      thumbnail: true,
      versionNumero: true,
      fechaPublicacion: true,
      createdAt: true,
      updatedAt: true,
      template: {
        select: {
          nombre: true,
          thumbnail: true
        }
      },
      categoria: {
        select: {
          nombre: true,
          slug: true,
          key: true
        }
      },
      _count: {
        select: {
          pages: true,
          analytics: true
        }
      }
    }
  })

  // Serializar fechas para el cliente
  return brochures.map(brochure => ({
    ...brochure,
    fechaPublicacion: brochure.fechaPublicacion?.toISOString() || null,
    createdAt: brochure.createdAt.toISOString(),
    updatedAt: brochure.updatedAt.toISOString()
  }))
}

export default async function BrochuresPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/")
  }

  const brochures = await getBrochures()

  return <BrochuresPageClient brochures={brochures} />
}

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { BrochureForm } from "@/components/admin/BrochureForm"

async function getCategories() {
  const categories = await prisma.categoriaProyecto.findMany({
    orderBy: { nombre: 'asc' },
    select: {
      id: true,
      nombre: true,
      slug: true,
      key: true,
      brochure: {
        select: {
          id: true,
          titulo: true
        }
      }
    }
  })

  return categories
}

export default async function NewBrochurePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/admin")
  }

  const categories = await getCategories()

  // Filtrar categorías que no tengan brochure asignado
  const availableCategories = categories.filter(cat => !cat.brochure)

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Brochure</h1>
        <p className="mt-2 text-lg text-gray-600">
          Crea un brochure digital vacío. Podrás agregar páginas usando templates desde el editor visual.
        </p>
      </div>

      <BrochureForm
        categories={availableCategories}
      />
    </div>
  )
}

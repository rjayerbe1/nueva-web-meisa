import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { PageTemplateForm } from "@/components/admin/PageTemplateForm"

export default async function NewPageTemplatePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/admin")
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Plantilla</h1>
        <p className="mt-2 text-lg text-gray-600">
          Diseña una plantilla de página que podrás reutilizar en tus brochures
        </p>
      </div>

      <PageTemplateForm />
    </div>
  )
}

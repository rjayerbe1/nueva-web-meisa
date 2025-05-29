import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import EditServiceForm from "@/components/admin/EditServiceForm"

interface EditServicePageProps {
  params: { id: string }
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/admin")
  }

  return <EditServiceForm serviceId={params.id} />
}
import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient"
import { UserRole } from "@prisma/client"

export const metadata: Metadata = {
  title: "Panel Administrativo - MEISA",
  description: "Panel de administración para gestionar proyectos y contenido",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/")
  }

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  )
}
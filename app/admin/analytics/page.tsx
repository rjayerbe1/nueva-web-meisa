import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard"
import LeadsInteraccionesSection from "@/components/admin/LeadsInteraccionesSection"

export const metadata: Metadata = {
  title: "Analítica - Panel Administrativo MEISA",
  description: "Tráfico del sitio (GA4) y rendimiento en búsqueda de Google (Search Console)",
}

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analítica</h1>
        <p className="mt-2 text-lg text-gray-600">
          Tráfico del sitio (Google Analytics 4) y rendimiento en búsqueda (Search Console)
        </p>
      </div>

      <LeadsInteraccionesSection />

      <AnalyticsDashboard />
    </div>
  )
}

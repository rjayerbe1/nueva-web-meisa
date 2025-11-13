import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { TemplatesPageClient } from "@/components/admin/TemplatesPageClient"

async function getTemplates() {
  const templates = await prisma.brochureTemplate.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          brochures: true,
          pages: true
        }
      }
    }
  })

  return templates.map(template => ({
    ...template,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString()
  }))
}

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/admin")
  }

  const templates = await getTemplates()

  return <TemplatesPageClient templates={templates} />
}

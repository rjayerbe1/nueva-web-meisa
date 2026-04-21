import { prisma } from "@/lib/prisma"
import { NavegacionAdminTabs } from "@/components/admin/navegacion/NavegacionAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function NavegacionAdminPage() {
  const [menuItems, footerLinks, socialLinks] = await Promise.all([
    prisma.menuItem.findMany({ orderBy: { orden: "asc" } }),
    prisma.footerLink.findMany({ orderBy: [{ grupo: "asc" }, { orden: "asc" }] }),
    prisma.socialLink.findMany({ orderBy: { orden: "asc" } }),
  ])

  return (
    <NavegacionAdminTabs
      menuItems={menuItems}
      footerLinks={footerLinks}
      socialLinks={socialLinks}
    />
  )
}

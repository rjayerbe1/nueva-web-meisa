import { prisma } from "@/lib/prisma"
import { ContactoAdminTabs } from "@/components/admin/contacto/ContactoAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ContactoAdminPage() {
  const [config, formOptions, plantas] = await Promise.all([
    prisma.configuracionContacto.findUnique({ where: { id: "default" } }),
    prisma.formOption.findMany({ orderBy: [{ grupo: "asc" }, { orden: "asc" }] }),
    prisma.plant.findMany({ orderBy: { orden: "asc" } }),
  ])

  return <ContactoAdminTabs config={config} formOptions={formOptions} plantas={plantas} />
}

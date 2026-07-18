import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { DEFAULT_CONSENTIMIENTO } from "@/lib/talento/consentimiento"
import TrabajaContent from "./TrabajaContent"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const description =
    "Trabaja en MEISA: vacantes en fabricación y montaje de estructuras metálicas en Jamundí y el suroccidente colombiano. Envía tu hoja de vida."
  return {
    title: { absolute: "Trabaja con Nosotros | MEISA" },
    description,
    alternates: { canonical: "/trabaja-con-nosotros" },
    openGraph: {
      title: "Trabaja con Nosotros | MEISA",
      description,
      url: "/trabaja-con-nosotros",
      type: "website",
    },
  }
}

export default async function TrabajaConNosotrosPage() {
  const config = await prisma.configuracionTalento.findUnique({ where: { id: "default" } })
  // El switch: mientras esté apagado, la página no existe para el público.
  if (!config?.paginaPublicaActiva) notFound()

  const vacantes = await prisma.vacante.findMany({
    where: { estado: "ABIERTA" },
    orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      titulo: true,
      area: true,
      ciudad: true,
      modalidad: true,
      tipoContrato: true,
      descripcion: true,
    },
  })

  return (
    <TrabajaContent
      vacantes={vacantes}
      textoConsentimiento={config.textoConsentimiento?.trim() || DEFAULT_CONSENTIMIENTO}
    />
  )
}

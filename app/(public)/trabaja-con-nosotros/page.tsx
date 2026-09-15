import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSitio } from "@/lib/content/snapshot"
import { DEFAULT_CONSENTIMIENTO } from "@/lib/talento/consentimiento"
import { listaSedes } from "@/lib/talento/sedes"
import TrabajaContent from "./TrabajaContent"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { plantas } = await getSitio()
  const description = `Trabaja en MEISA: vacantes en fabricación y montaje de estructuras metálicas en ${listaSedes(plantas)} y el suroccidente colombiano. Envía tu hoja de vida.`
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
  const { talento: config, vacantesAbiertas, plantas } = await getSitio()
  // El switch: mientras esté apagado, la página no existe para el público.
  if (!config?.paginaPublicaActiva) notFound()

  // Misma proyección que antes: no mandar al cliente criterios internos.
  const vacantes = vacantesAbiertas.map((v) => ({
    id: v.id,
    slug: v.slug,
    titulo: v.titulo,
    area: v.area,
    ciudad: v.ciudad,
    modalidad: v.modalidad,
    tipoContrato: v.tipoContrato,
    descripcion: v.descripcion,
  }))

  return (
    <TrabajaContent
      vacantes={vacantes}
      sedes={listaSedes(plantas)}
      textoConsentimiento={config.textoConsentimiento?.trim() || DEFAULT_CONSENTIMIENTO}
    />
  )
}

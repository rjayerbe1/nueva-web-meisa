// Componentes JSON-LD Schema para SEO
// Server components async que leen de DB (Plant, ConfiguracionEmpresa,
// SocialLink, ConfiguracionContacto) en lugar de hardcoded.
import { cache } from "react"
import { prisma } from "@/lib/prisma"

const SITE_URL = "https://meisa.com.co"

const getSchemaData = cache(async () => {
  const [config, plants, social, contact] = await Promise.all([
    prisma.configuracionEmpresa.findUnique({ where: { id: "default" } }),
    prisma.plant.findMany({ where: { activo: true }, orderBy: { orden: "asc" } }),
    prisma.socialLink.findMany({ where: { activo: true }, orderBy: { orden: "asc" } }),
    prisma.configuracionContacto.findUnique({ where: { id: "default" } }),
  ])
  return { config, plants, social, contact }
})

function getAniosExperiencia(fundacion: number | undefined | null): number {
  const year = fundacion ?? 1996
  return new Date().getFullYear() - year
}

export async function OrganizationSchema() {
  const { config, social, contact } = await getSchemaData()
  const anios = getAniosExperiencia(config?.fundacion)

  const contactPoints: Array<Record<string, unknown>> = []
  if (contact?.pbx) {
    contactPoints.push({
      "@type": "ContactPoint",
      telephone: contact.pbx,
      contactType: "customer service",
      areaServed: "CO",
      availableLanguage: "Spanish",
    })
  }
  if (contact?.movil) {
    contactPoints.push({
      "@type": "ContactPoint",
      telephone: contact.movil,
      contactType: "sales",
      areaServed: "CO",
      availableLanguage: "Spanish",
    })
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: config?.nombreCompleto ?? "MEISA - Metálicas e Ingeniería S.A.S.",
    legalName: "Metálicas e Ingeniería S.A.S.",
    alternateName: config?.nombre ?? "MEISA",
    url: SITE_URL,
    ...(contact?.email ? { email: contact.email } : {}),
    logo: {
      "@type": "ImageObject",
      url: "https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png",
      width: 300,
      height: 100,
    },
    image: `https://storage.googleapis.com/meisa-imagenes/site/og-image.jpg`,
    description:
      (config?.descripcion ??
        "Empresa líder en diseño, fabricación y montaje de estructuras metálicas en Colombia.") +
      ` Más de ${anios} años de experiencia.`,
    foundingDate: String(config?.fundacion ?? 1996),
    slogan: "Construyendo el futuro con acero",
    knowsAbout: [
      "Estructuras metálicas",
      "Puentes metálicos",
      "Edificios de acero",
      "Centros comerciales",
      "Naves industriales",
      "Cubiertas metálicas",
      "Construcción en acero",
      "Montaje estructural",
    ],
    areaServed: { "@type": "Country", name: "Colombia" },
    sameAs: social.map((s) => s.url),
    contactPoint: contactPoints,
    ...(contact?.direccionLinea1
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.direccionLinea1,
            addressLocality: plantsToCity(await getSchemaData().then((d) => d.plants)),
            addressCountry: "CO",
          },
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

function plantsToCity(plants: { ciudad: string | null; esSedePrincipal: boolean }[]): string {
  const main = plants.find((p) => p.esSedePrincipal)
  return main?.ciudad ?? plants[0]?.ciudad ?? "Popayán"
}

export async function LocalBusinessSchema() {
  const { plants } = await getSchemaData()

  const schemas = plants
    .filter((p) => p.ciudad && p.lat && p.lng)
    .map((plant, index) => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#location-${plant.slug}`,
      name: `MEISA - ${plant.nombre}`,
      image: `https://storage.googleapis.com/meisa-imagenes/site/og-image.jpg`,
      url: SITE_URL,
      telephone: plant.telefono ?? "",
      priceRange: "$$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: plant.ubicacion,
        addressLocality: plant.ciudad!,
        addressRegion: plant.departamento ?? "",
        addressCountry: "CO",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: plant.lat,
        longitude: plant.lng,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:00",
          closes: "17:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "08:00",
          closes: "12:00",
        },
      ],
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
    }))

  return (
    <>
      {schemas.map((loc, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(loc) }}
        />
      ))}
    </>
  )
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "MEISA - Estructuras Metálicas Colombia",
    description:
      "Diseño, fabricación y montaje de estructuras metálicas en Colombia. Puentes, edificios, centros comerciales, naves industriales.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "es-CO",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/proyectos?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ServiceSchemaProps {
  name: string
  description: string
  url: string
  image?: string
}

export function ServiceSchema({ name, description, url, image }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    image: image || `https://storage.googleapis.com/meisa-imagenes/site/og-image.jpg`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Colombia" },
    serviceType: "Estructuras Metálicas",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQSchemaProps {
  items: Array<{ pregunta: string; respuesta: string }>
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.respuesta,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ProjectSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  datePublished?: string
  location?: string
  client?: string
}

export function ProjectSchema({
  name,
  description,
  url,
  image,
  datePublished,
  location,
  client,
}: ProjectSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    image: image || `https://storage.googleapis.com/meisa-imagenes/site/og-image.jpg`,
    datePublished,
    creator: { "@id": `${SITE_URL}/#organization` },
    locationCreated: location
      ? {
          "@type": "Place",
          name: location,
          address: { "@type": "PostalAddress", addressCountry: "CO" },
        }
      : undefined,
    about: { "@type": "Thing", name: "Estructuras Metálicas" },
    keywords: [
      "estructuras metálicas",
      "construcción en acero",
      "proyecto estructural",
      client,
      location,
    ].filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export async function GlobalSchemas() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <LocalBusinessSchema />
    </>
  )
}

// Componentes JSON-LD Schema para SEO
// Estos schemas ayudan a Google a entender mejor el contenido del sitio
import { siteConfig } from '@/lib/site-config'

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://meisa.com.co/#organization',
    name: 'MEISA - Metálicas e Ingeniería S.A.',
    alternateName: 'MEISA',
    url: 'https://meisa.com.co',
    logo: {
      '@type': 'ImageObject',
      url: 'https://meisa.com.co/images/logo-meisa.png',
      width: 300,
      height: 100,
    },
    image: 'https://meisa.com.co/images/og-image.jpg',
    description:
      `Empresa líder en diseño, fabricación y montaje de estructuras metálicas en Colombia. Más de ${siteConfig.empresa.aniosExperiencia} años de experiencia en puentes, edificios, centros comerciales y naves industriales.`,
    foundingDate: '1996',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 100,
      maxValue: 500,
    },
    slogan: 'Construyendo el futuro con acero',
    knowsAbout: [
      'Estructuras metálicas',
      'Puentes metálicos',
      'Edificios de acero',
      'Centros comerciales',
      'Naves industriales',
      'Cubiertas metálicas',
      'Construcción en acero',
      'Montaje estructural',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de Estructuras Metálicas',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Diseño de Estructuras Metálicas',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Fabricación de Estructuras Metálicas',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Montaje de Estructuras Metálicas',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Construcción de Puentes Metálicos',
          },
        },
      ],
    },
    areaServed: {
      '@type': 'Country',
      name: 'Colombia',
    },
    sameAs: [
      'https://www.facebook.com/meisa.colombia',
      'https://www.linkedin.com/company/meisa-metalicas-ingenieria',
      'https://www.instagram.com/meisa_colombia',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+57-602-8231818',
        contactType: 'customer service',
        areaServed: 'CO',
        availableLanguage: 'Spanish',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+57-602-4854800',
        contactType: 'sales',
        areaServed: 'CO',
        availableLanguage: 'Spanish',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Zona Industrial - Parque Sur',
      addressLocality: 'Popayán',
      addressRegion: 'Cauca',
      postalCode: '190001',
      addressCountry: 'CO',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessSchema() {
  const locations = [
    {
      name: 'MEISA - Sede Principal Popayán',
      streetAddress: 'Zona Industrial - Parque Sur',
      city: 'Popayán',
      region: 'Cauca',
      postalCode: '190001',
      phone: '+57-602-8231818',
      lat: 2.4448,
      lng: -76.6147,
    },
    {
      name: 'MEISA - Sede Cali',
      streetAddress: 'Acopi Yumbo',
      city: 'Cali',
      region: 'Valle del Cauca',
      postalCode: '760001',
      phone: '+57-602-4854800',
      lat: 3.4516,
      lng: -76.532,
    },
    {
      name: 'MEISA - Sede Bogotá',
      streetAddress: 'Zona Industrial',
      city: 'Bogotá',
      region: 'Cundinamarca',
      postalCode: '110111',
      phone: '+57-601-7456789',
      lat: 4.711,
      lng: -74.0721,
    },
  ]

  const schema = locations.map((location, index) => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://meisa.com.co/#location-${index + 1}`,
    name: location.name,
    image: 'https://meisa.com.co/images/og-image.jpg',
    url: 'https://meisa.com.co',
    telephone: location.phone,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.streetAddress,
      addressLocality: location.city,
      addressRegion: location.region,
      postalCode: location.postalCode,
      addressCountry: 'CO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.lat,
      longitude: location.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '12:00',
      },
    ],
    parentOrganization: {
      '@id': 'https://meisa.com.co/#organization',
    },
  }))

  return (
    <>
      {schema.map((loc, index) => (
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
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://meisa.com.co/#website',
    url: 'https://meisa.com.co',
    name: 'MEISA - Estructuras Metálicas Colombia',
    description:
      'Diseño, fabricación y montaje de estructuras metálicas en Colombia. Puentes, edificios, centros comerciales, naves industriales.',
    publisher: {
      '@id': 'https://meisa.com.co/#organization',
    },
    inLanguage: 'es-CO',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://meisa.com.co/proyectos?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
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
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    image: image || 'https://meisa.com.co/images/og-image.jpg',
    provider: {
      '@id': 'https://meisa.com.co/#organization',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Colombia',
    },
    serviceType: 'Estructuras Metálicas',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
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
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url,
    image: image || 'https://meisa.com.co/images/og-image.jpg',
    datePublished,
    creator: {
      '@id': 'https://meisa.com.co/#organization',
    },
    locationCreated: location
      ? {
          '@type': 'Place',
          name: location,
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'CO',
          },
        }
      : undefined,
    about: {
      '@type': 'Thing',
      name: 'Estructuras Metálicas',
    },
    keywords: [
      'estructuras metálicas',
      'construcción en acero',
      'proyecto estructural',
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

// Componente principal que agrupa todos los schemas globales
export function GlobalSchemas() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <LocalBusinessSchema />
    </>
  )
}

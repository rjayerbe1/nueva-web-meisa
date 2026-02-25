import { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/JsonLdSchema'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Trayectoria y Proyectos',
  description:
    `Conozca la trayectoria de MEISA: más de ${siteConfig.empresa.aniosExperiencia} años construyendo estructuras metálicas en Colombia. Historia de proyectos exitosos, puentes, edificios, centros comerciales y naves industriales.`,
  keywords: [
    'trayectoria MEISA',
    'historia MEISA',
    'experiencia estructuras metálicas Colombia',
    'proyectos realizados MEISA',
    'obras estructuras metálicas',
    `${siteConfig.empresa.aniosExperiencia} años experiencia construcción`,
    'portafolio MEISA',
    'casos de éxito estructuras metálicas',
  ],
  openGraph: {
    title: `Trayectoria MEISA | +${siteConfig.empresa.aniosExperiencia} Años de Experiencia`,
    description:
      `Más de ${siteConfig.empresa.aniosExperiencia} años construyendo el futuro de Colombia. Conozca nuestra historia y proyectos emblemáticos en estructuras metálicas.`,
    url: 'https://meisa.com.co/trayectoria',
    images: [
      {
        url: '/images/og-trayectoria.jpg',
        width: 1200,
        height: 630,
        alt: 'Trayectoria MEISA - Estructuras Metálicas Colombia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Trayectoria MEISA | +${siteConfig.empresa.aniosExperiencia} Años de Experiencia`,
    description: 'Historia y proyectos emblemáticos de MEISA en estructuras metálicas.',
  },
  alternates: {
    canonical: 'https://meisa.com.co/trayectoria',
  },
}

export default function TrayectoriaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: 'https://meisa.com.co' },
          { name: 'Trayectoria', url: 'https://meisa.com.co/trayectoria' },
        ]}
      />
      {children}
    </>
  )
}

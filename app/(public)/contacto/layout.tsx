import { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/JsonLdSchema'
import { aniosExperiencia } from '@/lib/site-meta'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contacte a MEISA para cotizar su proyecto de estructuras metálicas. Sedes en Jamundí, Popayán y Villa Rica. Teléfono: +57 (2) 312 0050. Atendemos proyectos en toda Colombia.',
  keywords: [
    'contacto MEISA',
    'cotización estructuras metálicas',
    'teléfono MEISA',
    'contactar empresa estructuras metálicas Colombia',
    'estructuras metálicas Cali',
    'estructuras metálicas Popayán',
    'solicitar cotización acero',
    'presupuesto estructuras metálicas',
  ],
  openGraph: {
    title: 'Contacto MEISA | Estructuras Metálicas Colombia',
    description:
      `Solicite cotización para su proyecto de estructuras metálicas. Sedes en Jamundí, Popayán y Villa Rica. +${aniosExperiencia()} años de experiencia.`,
    url: 'https://meisa.com.co/contacto',
    images: [
      {
        url: '/images/og-contacto.jpg',
        width: 1200,
        height: 630,
        alt: 'Contacto MEISA - Estructuras Metálicas Colombia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contacto MEISA | Estructuras Metálicas',
    description: 'Cotice su proyecto de estructuras metálicas. Atención personalizada.',
  },
  alternates: {
    canonical: 'https://meisa.com.co/contacto',
  },
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: 'https://meisa.com.co' },
          { name: 'Contacto', url: 'https://meisa.com.co/contacto' },
        ]}
      />
      {children}
    </>
  )
}

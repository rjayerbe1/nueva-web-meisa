import type { Metadata } from 'next'
import ContactoContent from './ContactoContent'
import { getPlantasPublicas } from '@/lib/content/plantas'
import { getTalentoPublico } from '@/lib/talento/publico'

export const revalidate = 60

export const metadata: Metadata = {
  alternates: { canonical: '/contacto' },
  title: { absolute: 'Contacto | MEISA - Estructuras Metálicas Colombia' },
  description:
    'Contacta a MEISA para cotizaciones y consultas sobre estructuras metálicas. Sedes en Jamundí, Popayán y Villa Rica.',
  openGraph: {
    images: [
      {
        url: 'https://storage.googleapis.com/meisa-imagenes/site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contacto MEISA — Estructuras metálicas en Colombia',
      },
    ],
  },
}

export default async function ContactoPage() {
  const [plantas, talento] = await Promise.all([
    getPlantasPublicas(),
    getTalentoPublico().catch(() => ({ activa: false, vacantes: [] })),
  ])
  return <ContactoContent plantas={plantas} talento={talento} />
}

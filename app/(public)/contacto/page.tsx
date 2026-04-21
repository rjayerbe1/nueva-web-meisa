import type { Metadata } from 'next'
import ContactoContent from './ContactoContent'
import { getPlantasPublicas } from '@/lib/content/plantas'
import { getContactoData } from '@/lib/content/servicios-contacto'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Contacto | MEISA - Estructuras Metálicas',
  description:
    'Contacta a MEISA para cotizaciones y consultas sobre estructuras metálicas. Sedes en Jamundí, Popayán y Villa Rica.',
}

export default async function ContactoPage() {
  const [plantas, contactoData] = await Promise.all([
    getPlantasPublicas(),
    getContactoData(),
  ])
  return <ContactoContent plantas={plantas} contactoData={contactoData} />
}

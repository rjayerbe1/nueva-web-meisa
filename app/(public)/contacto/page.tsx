import type { Metadata } from 'next'
import ContactoContent from './ContactoContent'
import { getPlantasPublicas } from '@/lib/content/plantas'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contacto | MEISA - Estructuras Metálicas',
  description:
    'Contacta a MEISA para cotizaciones y consultas sobre estructuras metálicas. Sedes en Jamundí, Popayán y Villa Rica.',
}

export default async function ContactoPage() {
  const plantas = await getPlantasPublicas()
  return <ContactoContent plantas={plantas} />
}

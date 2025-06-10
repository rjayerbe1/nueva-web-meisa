import { Metadata } from 'next'
import EditPageFormImproved from '@/components/admin/EditPageFormImproved'

export const metadata: Metadata = {
  title: 'Editar Página - Calidad | Admin MEISA',
  description: 'Panel de administración para editar el contenido de la página de Calidad'
}

export default function EditCalidadPage() {
  return <EditPageFormImproved slug="calidad" />
}
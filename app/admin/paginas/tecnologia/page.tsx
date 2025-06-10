import { Metadata } from 'next'
import EditPageFormImproved from '@/components/admin/EditPageFormImproved'

export const metadata: Metadata = {
  title: 'Editar Página - Tecnología | Admin MEISA',
  description: 'Panel de administración para editar el contenido de la página de Tecnología'
}

export default function EditTecnologiaPage() {
  return <EditPageFormImproved slug="tecnologia" />
}
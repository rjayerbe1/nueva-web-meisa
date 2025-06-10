import { Metadata } from 'next'
import EditPageFormImproved from '@/components/admin/EditPageFormImproved'

export const metadata: Metadata = {
  title: 'Editar Página - Empresa | Admin MEISA',
  description: 'Panel de administración para editar el contenido de la página de Empresa'
}

export default function EditEmpresaPage() {
  return <EditPageFormImproved slug="empresa" />
}
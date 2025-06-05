import EditServiceForm from '@/components/admin/EditServiceForm'

interface EditServicePageProps {
  params: {
    id: string
  }
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  return <EditServiceForm serviceId={params.id} />
}

export const metadata = {
  title: 'Editar Servicio | Panel de Administración MEISA',
  description: 'Editar información del servicio'
}
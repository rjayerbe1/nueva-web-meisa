import { Metadata } from 'next'
import EditarPaginaClient from '@/components/admin/EditarPaginaClient'

export const metadata: Metadata = {
  title: 'Editar Página | Panel de Administración',
  description: 'Editar contenido de página',
}

interface Props {
  params: {
    slug: string
  }
}

export default function EditarPaginaPage({ params }: Props) {
  return <EditarPaginaClient slug={params.slug} />
}
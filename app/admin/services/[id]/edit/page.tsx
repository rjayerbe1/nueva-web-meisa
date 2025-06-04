import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ServiceForm from '../../ServiceForm'

interface EditServicePageProps {
  params: {
    id: string
  }
}

async function getService(id: string) {
  const service = await prisma.servicio.findUnique({
    where: { id }
  })

  if (!service) {
    notFound()
  }

  return service
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const service = await getService(params.id)

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Servicio</h1>
        <p className="text-gray-600 mt-2">
          Modifica la información del servicio
        </p>
      </div>

      <ServiceForm service={service} />
    </div>
  )
}

export const metadata = {
  title: 'Editar Servicio | Panel de Administración MEISA',
  description: 'Editar información del servicio'
}
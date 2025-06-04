import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ServicesManagement from './ServicesManagement'

async function getServices() {
  const services = await prisma.servicio.findMany({
    orderBy: [
      { orden: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return services
}

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
        <p className="text-gray-600 mt-2">
          Administra los servicios que se muestran en la página pública
        </p>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-100 rounded-lg h-96" />}>
        <ServicesManagement initialServices={services} />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: 'Gestión de Servicios | Panel de Administración MEISA',
  description: 'Administra los servicios de MEISA'
}
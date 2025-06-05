import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ServicesVisualManagement from './ServicesVisualManagement'

async function getServices() {
  const services = await prisma.servicio.findMany({
    orderBy: [
      { orden: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return services
}

export default async function ServicesVisualPage() {
  const services = await getServices()

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Aspectos Visuales de Servicios</h1>
        <p className="text-gray-600 mt-2">
          Configura iconos, colores, gradientes e imágenes para cada servicio
        </p>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-100 rounded-lg h-96" />}>
        <ServicesVisualManagement initialServices={services} />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: 'Aspectos Visuales de Servicios | Panel de Administración MEISA',
  description: 'Configura los aspectos visuales de los servicios de MEISA'
}
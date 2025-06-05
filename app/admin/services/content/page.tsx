import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ServicesContentManagement from './ServicesContentManagement'

async function getServices() {
  const services = await prisma.servicio.findMany({
    orderBy: [
      { orden: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return services
}

export default async function ServicesContentPage() {
  const services = await getServices()

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contenido Detallado de Servicios</h1>
        <p className="text-gray-600 mt-2">
          Gestiona galerías, estadísticas, procesos y casos de éxito para cada servicio
        </p>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-100 rounded-lg h-96" />}>
        <ServicesContentManagement initialServices={services} />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: 'Contenido Detallado de Servicios | Panel de Administración MEISA',
  description: 'Gestiona el contenido detallado de los servicios de MEISA'
}
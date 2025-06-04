import ServiceForm from '../ServiceForm'

export default function NewServicePage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Servicio</h1>
        <p className="text-gray-600 mt-2">
          Agrega un nuevo servicio al catálogo
        </p>
      </div>

      <ServiceForm />
    </div>
  )
}

export const metadata = {
  title: 'Crear Servicio | Panel de Administración MEISA',
  description: 'Crear un nuevo servicio'
}
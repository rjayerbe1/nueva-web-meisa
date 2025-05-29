import { prisma } from "@/lib/prisma"
import { Building2 } from "lucide-react"

async function getProyectos() {
  return await prisma.proyecto.findMany({
    where: { visible: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      categoria: true,
      estado: true,
      cliente: true,
      ubicacion: true,
      fechaInicio: true,
      presupuesto: true,
      slug: true,
      destacado: true,
    }
  })
}

export default async function ProyectosPage() {
  const proyectos = await getProyectos()

  const formatCurrency = (amount: any) => {
    if (!amount) return 'Presupuesto no definido'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount))
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO': return 'bg-green-100 text-green-800'
      case 'EN_PROGRESO': return 'bg-blue-100 text-blue-800'
      case 'PAUSADO': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestros Proyectos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre los proyectos más emblemáticos que hemos realizado en estructuras metálicas
          </p>
        </div>

        {/* Proyectos Grid */}
        {proyectos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {proyectos.map((proyecto) => (
              <div 
                key={proyecto.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-white/30" />
                  </div>
                  {proyecto.destacado && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                        Destacado
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">
                      {proyecto.categoria.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(proyecto.estado)}`}>
                      {proyecto.estado.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {proyecto.titulo}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {proyecto.descripcion}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="font-medium">Cliente:</span>
                      <span className="ml-2">{proyecto.cliente}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Ubicación:</span>
                      <span className="ml-2">{proyecto.ubicacion}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Fecha:</span>
                      <span className="ml-2">
                        {new Date(proyecto.fechaInicio).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Presupuesto:</span>
                      <span className="ml-2">{formatCurrency(proyecto.presupuesto)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay proyectos disponibles
            </h3>
            <p className="text-gray-600">
              Los proyectos se mostrarán aquí cuando estén disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
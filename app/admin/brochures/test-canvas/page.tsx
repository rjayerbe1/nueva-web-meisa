'use client'

export default function TestCanvasPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-2xl p-12 text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ✅ El Sistema Funciona
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Si puedes ver esta página, el servidor Next.js está funcionando correctamente.
        </p>
        <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <p className="text-gray-700">Servidor: <strong>Activo</strong></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <p className="text-gray-700">Puerto: <strong>3000</strong></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <p className="text-gray-700">React: <strong>Funcionando</strong></p>
          </div>
        </div>
        <div className="mt-8">
          <a
            href="/admin/brochures/cmhw7y8uv000112m2ic8w7a37/builder"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir al Editor
          </a>
        </div>
      </div>
    </div>
  )
}

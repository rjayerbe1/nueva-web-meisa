export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Test de Estilos</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prueba de Tailwind CSS</h2>
          <p className="text-gray-600 mb-4">
            Si puedes ver este texto con estilos aplicados, Tailwind está funcionando correctamente.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Botón de Prueba
          </button>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-500 p-4 rounded text-white">Rojo</div>
          <div className="bg-green-500 p-4 rounded text-white">Verde</div>
          <div className="bg-yellow-500 p-4 rounded text-white">Amarillo</div>
        </div>
      </div>
    </div>
  )
}
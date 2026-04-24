"use client"

import Image from "next/image"

export default function TestLogoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Pruebas de Nitidez del Logo MEISA
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Compara las diferentes configuraciones y elige la que se vea más nítida
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Prueba 1: Actual - unoptimized */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-blue-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                width={144}
                height={40}
                className="h-10 w-auto"
                unoptimized
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-blue-600 mb-2">OPCIÓN 1 (Actual)</p>
              <ul className="text-gray-600 space-y-1">
                <li>• unoptimized</li>
                <li>• width: 144px</li>
                <li>• height: 40px</li>
              </ul>
            </div>
          </div>

          {/* Prueba 2: quality 100 sin unoptimized */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-green-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                width={144}
                height={40}
                className="h-10 w-auto"
                quality={100}
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-green-600 mb-2">OPCIÓN 2</p>
              <ul className="text-gray-600 space-y-1">
                <li>• quality: 100</li>
                <li>• width: 144px</li>
                <li>• height: 40px</li>
                <li>• optimized</li>
              </ul>
            </div>
          </div>

          {/* Prueba 3: Dimensiones 2x más grandes */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-purple-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                width={288}
                height={80}
                className="h-10 w-auto"
                quality={100}
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-purple-600 mb-2">OPCIÓN 3</p>
              <ul className="text-gray-600 space-y-1">
                <li>• quality: 100</li>
                <li>• width: 288px (2x)</li>
                <li>• height: 80px (2x)</li>
                <li>• optimized</li>
              </ul>
            </div>
          </div>

          {/* Prueba 4: Dimensiones 2x + unoptimized */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-red-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                width={288}
                height={80}
                className="h-10 w-auto"
                unoptimized
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-red-600 mb-2">OPCIÓN 4</p>
              <ul className="text-gray-600 space-y-1">
                <li>• unoptimized</li>
                <li>• width: 288px (2x)</li>
                <li>• height: 80px (2x)</li>
              </ul>
            </div>
          </div>

          {/* Prueba 5: IMG tag nativo */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-orange-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <img
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                className="h-10 w-auto"
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-orange-600 mb-2">OPCIÓN 5</p>
              <ul className="text-gray-600 space-y-1">
                <li>• HTML &lt;img&gt; nativo</li>
                <li>• Sin Next.js Image</li>
                <li>• PNG directo</li>
              </ul>
            </div>
          </div>

          {/* Prueba 6: Con priority y unoptimized */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-teal-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                width={144}
                height={40}
                className="h-10 w-auto"
                priority
                unoptimized
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-teal-600 mb-2">OPCIÓN 6</p>
              <ul className="text-gray-600 space-y-1">
                <li>• unoptimized</li>
                <li>• priority</li>
                <li>• width: 144px</li>
                <li>• height: 40px</li>
              </ul>
            </div>
          </div>

          {/* Prueba 7: Con image-rendering CSS */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-pink-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                width={144}
                height={40}
                className="h-10 w-auto"
                style={{ imageRendering: 'crisp-edges' }}
                unoptimized
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-pink-600 mb-2">OPCIÓN 7</p>
              <ul className="text-gray-600 space-y-1">
                <li>• unoptimized</li>
                <li>• image-rendering: crisp-edges</li>
                <li>• width: 144px</li>
              </ul>
            </div>
          </div>

          {/* Prueba 8: Con image-rendering pixelated */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-yellow-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                width={144}
                height={40}
                className="h-10 w-auto"
                style={{ imageRendering: 'pixelated' }}
                unoptimized
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-yellow-600 mb-2">OPCIÓN 8</p>
              <ul className="text-gray-600 space-y-1">
                <li>• unoptimized</li>
                <li>• image-rendering: pixelated</li>
                <li>• width: 144px</li>
              </ul>
            </div>
          </div>

          {/* Prueba 9: Con image-rendering high-quality */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-indigo-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                width={144}
                height={40}
                className="h-10 w-auto"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
                unoptimized
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-indigo-600 mb-2">OPCIÓN 9</p>
              <ul className="text-gray-600 space-y-1">
                <li>• unoptimized</li>
                <li>• -webkit-optimize-contrast</li>
                <li>• width: 144px</li>
              </ul>
            </div>
          </div>

          {/* Prueba 10: Dimensiones 3x */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-cyan-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                width={432}
                height={120}
                className="h-10 w-auto"
                quality={100}
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-cyan-600 mb-2">OPCIÓN 10</p>
              <ul className="text-gray-600 space-y-1">
                <li>• quality: 100</li>
                <li>• width: 432px (3x)</li>
                <li>• height: 120px (3x)</li>
                <li>• optimized</li>
              </ul>
            </div>
          </div>

          {/* Prueba 11: IMG nativo con srcset */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-lime-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <img
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                srcSet="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png 1x, /images/logo/logo-meisa.png 2x"
                alt="MEISA"
                className="h-10 w-auto"
                style={{ imageRendering: 'auto' }}
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-lime-600 mb-2">OPCIÓN 11</p>
              <ul className="text-gray-600 space-y-1">
                <li>• HTML &lt;img&gt; nativo</li>
                <li>• srcset con 2x</li>
                <li>• image-rendering: auto</li>
              </ul>
            </div>
          </div>

          {/* Prueba 12: Sin restricción de altura */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-rose-500">
            <div className="bg-gray-100 p-4 rounded mb-4 h-20 flex items-center justify-center">
              <Image
                src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                alt="MEISA"
                width={144}
                height={40}
                unoptimized
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-rose-600 mb-2">OPCIÓN 12</p>
              <ul className="text-gray-600 space-y-1">
                <li>• unoptimized</li>
                <li>• width: 144px</li>
                <li>• Sin clase h-10</li>
                <li>• Tamaño natural</li>
              </ul>
            </div>
          </div>

        </div>

        <div className="mt-12 bg-blue-50 border-2 border-blue-500 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Instrucciones:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Observa cada opción cuidadosamente</li>
            <li>Haz zoom con Cmd + / Ctrl + para verificar la nitidez</li>
            <li>Dime el número de la opción que se ve MÁS NÍTIDA</li>
            <li>Aplicaré esa configuración al Navbar y Footer</li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Home
          </a>
        </div>
      </div>
    </div>
  )
}

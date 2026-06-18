'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Líneas de fondo sutiles (decorativo: no debe capturar clics, o tapa los botones) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(30, 64, 175, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 64, 175, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link href="/">
          <Image
            src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
            alt="MEISA"
            width={140}
            height={50}
            className="h-10 md:h-12 w-auto"
          />
        </Link>
      </motion.div>

      {/* Contenido principal - Layout de 2 columnas en desktop */}
      <div className="min-h-screen flex flex-col md:flex-row">

        {/* Izquierda - SVG Decorativo (solo desktop) */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white p-12">
          <div className="relative w-full h-full max-w-[550px] max-h-[650px]">

            {/* Marco cuadrado exterior */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 border border-gray-200"
            />

            {/* Línea diagonal 1 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute inset-0 pointer-events-none"
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                <motion.line
                  x1="0" y1="100" x2="100" y2="0"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-gray-300"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            {/* Línea diagonal 2 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute inset-0 pointer-events-none"
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                <motion.line
                  x1="0" y1="0" x2="100" y2="100"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-gray-300"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.6, duration: 1, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            {/* Cuadrado central con 404 */}
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              className="absolute inset-16 overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 to-white"
            >
              <div className="text-center">
                <span className="font-bebas text-[120px] text-transparent"
                  style={{
                    WebkitTextStroke: '2px #1e40af',
                    paintOrder: 'stroke fill'
                  }}>
                  404
                </span>
              </div>
            </motion.div>

            {/* Marco esquina superior izquierda */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, type: "spring", bounce: 0.4 }}
              className="absolute -top-3 -left-3 w-20 h-20 border-l-2 border-t-2 border-blue-700"
            />

            {/* Marco esquina inferior derecha */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, type: "spring", bounce: 0.4 }}
              className="absolute -bottom-3 -right-3 w-20 h-20 border-r-2 border-b-2 border-blue-700"
            />

            {/* Punto decorativo superior derecho */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-blue-700 rounded-full"
            />

            {/* Punto decorativo inferior izquierdo */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-700 rounded-full"
            />

            {/* Línea horizontal decorativa superior */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute top-1/4 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent origin-center"
            />

            {/* Línea horizontal decorativa inferior */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="absolute bottom-1/4 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-700 to-transparent origin-center"
            />
          </div>
        </div>

        {/* Derecha - Contenido */}
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-2xl w-full">

            {/* 404 grande (solo móvil) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center mb-12 md:hidden"
            >
              <h1 className="font-bebas text-[180px] leading-none tracking-tight">
                <span className="relative text-transparent"
                  style={{
                    WebkitTextStroke: '3px #1e40af',
                    paintOrder: 'stroke fill'
                  }}>
                  404
                </span>
              </h1>
            </motion.div>

            {/* Título */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-6"
          >
            <h2 className="font-bebas text-4xl md:text-6xl text-gray-900 tracking-wide">
              PÁGINA NO ENCONTRADA
            </h2>
            <div className="h-0.5 w-32 bg-red-600 mx-auto mt-4" />
          </motion.div>

          {/* Descripción */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mb-12"
          >
            <p className="font-lato text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              La estructura que buscas no existe en nuestros planos.
              <br />
              Te ayudamos a regresar al camino correcto.
            </p>
          </motion.div>

          {/* Botones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Link
              href="/"
              className="px-8 py-4 bg-blue-700 text-white font-lato font-bold text-sm uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto text-center"
            >
              Volver al Inicio
            </Link>

            <Link
              href="/proyectos"
              className="px-8 py-4 bg-white text-blue-700 border-2 border-blue-700 font-lato font-bold text-sm uppercase tracking-wider hover:bg-blue-700 hover:text-white transition-colors shadow-md hover:shadow-lg w-full sm:w-auto text-center"
            >
              Ver Proyectos
            </Link>

            <Link
              href="/contacto"
              className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 font-lato font-bold text-sm uppercase tracking-wider hover:border-blue-700 hover:text-blue-700 transition-colors w-full sm:w-auto text-center"
            >
              Contacto
            </Link>
          </motion.div>

          {/* Link de regreso */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center"
          >
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-blue-700 transition-colors font-lato text-sm"
            >
              ← Regresar a la página anterior
            </button>
          </motion.div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="absolute bottom-0 left-0 right-0 p-6 text-center border-t border-gray-200"
      >
        <p className="text-sm text-gray-500 font-lato">
          © {new Date().getFullYear()} MEISA - Metálicas e Ingeniería S.A.
        </p>
      </motion.footer>
    </div>
  )
}

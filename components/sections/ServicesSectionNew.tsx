'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Cpu,
  Hammer,
  Building2,
  Settings,
  Home,
  FileText,
  ArrowRight
} from 'lucide-react'

const services = [
  {
    id: 'diseno',
    title: 'Diseño Estructural',
    description: 'Ingeniería de precisión con tecnología BIM y análisis estructural avanzado',
    icon: Cpu,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'fabricacion',
    title: 'Fabricación Metálica',
    description: '3 plantas industriales con capacidad de 600 ton/mes y equipos CNC',
    icon: Hammer,
    color: 'from-slate-500 to-slate-700',
  },
  {
    id: 'montaje',
    title: 'Montaje de Estructuras',
    description: 'Instalación profesional con personal certificado y equipos de izaje',
    icon: Building2,
    color: 'from-green-600 to-green-700',
  },
  {
    id: 'construccion',
    title: 'Obra Civil',
    description: 'Servicio integral desde cimentación hasta acabados finales',
    icon: Settings,
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 'cubiertas',
    title: 'Cubiertas & Fachadas',
    description: 'Sistemas de cubierta metálica y fachadas arquitectónicas',
    icon: Home,
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'gerencia',
    title: 'Gerencia de Proyectos',
    description: 'Coordinación integral y supervisión técnica de proyectos',
    icon: FileText,
    color: 'from-indigo-500 to-indigo-600',
  },
]

export function ServicesSection() {
  return (
    <section
      id="servicios"
      className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Servicios
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-blue-200 to-slate-400">
              Integrales
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Soluciones completas en estructuras metálicas desde el diseño hasta la entrega final
          </p>
        </motion.div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-gray-600/50 transition-all duration-300 h-full">
                {/* Icono */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                {/* Contenido */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Link */}
                <Link
                  href={`/servicios#${service.id}`}
                  className="inline-flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors group/link"
                >
                  Ver detalles
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Necesitas más información?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Descubre todos nuestros servicios en detalle y cómo podemos ayudarte con tu próximo proyecto
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/servicios"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Ver Todos los Servicios
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Solicitar Cotización
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

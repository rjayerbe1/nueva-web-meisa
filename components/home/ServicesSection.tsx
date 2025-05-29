"use client"

import { useState } from 'react'
import { Compass, Factory, Wrench, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'

const iconMap = {
  design: Compass,
  factory: Factory,
  construction: Wrench,
  building: Users
}

const colorMap = {
  design: 'from-blue-500 to-blue-600',
  factory: 'from-green-500 to-green-600', 
  construction: 'from-purple-500 to-purple-600',
  building: 'from-orange-500 to-orange-600'
}

const services = siteConfig.servicios.map((servicio, index) => ({
  id: index + 1,
  name: servicio.titulo,
  description: servicio.descripcion,
  icon: iconMap[servicio.icono as keyof typeof iconMap] || Compass,
  color: colorMap[servicio.icono as keyof typeof colorMap] || 'from-blue-500 to-blue-600',
  features: servicio.caracteristicas
}))

export function ServicesSection() {
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  return (
    <section id="servicios" className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Soluciones integrales en estructuras metálicas, desde el diseño hasta la entrega final
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="relative group"
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${service.color} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500`}></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${service.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className={`w-5 h-5 text-gray-400 transition-all duration-300 ${hoveredService === service.id ? 'translate-x-2 text-gray-600' : ''}`} />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`#${service.name.toLowerCase().replace(' ', '-')}`}
                    className="mt-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Conocer más
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="#contacto"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Solicitar cotización
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
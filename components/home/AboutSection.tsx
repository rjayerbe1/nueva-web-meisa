"use client"

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Award, Shield, Zap } from 'lucide-react'

const features = [
  {
    name: 'Calidad Certificada',
    description: 'Cumplimos con los más altos estándares de calidad en todos nuestros procesos.',
    icon: CheckCircle2,
  },
  {
    name: 'Experiencia Comprobada',
    description: 'Más de 15 años de trayectoria respaldan nuestro trabajo.',
    icon: Award,
  },
  {
    name: 'Seguridad Garantizada',
    description: 'Priorizamos la seguridad en cada etapa del proyecto.',
    icon: Shield,
  },
  {
    name: 'Innovación Constante',
    description: 'Utilizamos tecnología de vanguardia en diseño y fabricación.',
    icon: Zap,
  },
]

export function AboutSection() {
  return (
    <section id="nosotros" className="overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Sobre Nosotros</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Construyendo el futuro con acero
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                MEISA es una empresa líder en el sector de estructuras metálicas en Colombia. Con más de 15 años de experiencia, 
                nos hemos consolidado como un referente en diseño, fabricación y montaje de estructuras metálicas para proyectos 
                de gran envergadura.
              </p>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Nuestro compromiso con la excelencia, la innovación y la seguridad nos ha permitido participar en los proyectos 
                más emblemáticos del país, desde centros comerciales hasta puentes y edificaciones industriales.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <Icon className="absolute left-1 top-1 h-5 w-5 text-blue-600" aria-hidden="true" />
                        {feature.name}
                      </dt>{' '}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  )
                })}
              </dl>
              <div className="mt-10">
                <Link
                  href="#contacto"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Conoce más sobre nosotros
                </Link>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden h-full">
                <div className="grid grid-cols-2 gap-4 p-8">
                  <div className="space-y-4">
                    <div className="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
                    <div className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
                    <div className="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-2xl font-bold text-gray-900">200+</p>
                    <p className="text-sm text-gray-600">Proyectos exitosos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
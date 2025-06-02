'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Ruler, Factory, Wrench, Building } from 'lucide-react'
import Link from 'next/link'

interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  delay: number
}

function ServiceCard({ title, description, icon, color, delay }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      
      <motion.button
        whileHover={{ x: 5 }}
        className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
      >
        Conocer más
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  )
}

export function ServicesSection() {
  const services = [
    {
      title: 'Diseño Estructural',
      description: 'Desarrollo de planos y cálculos estructurales utilizando tecnología BIM para garantizar precisión y eficiencia en cada proyecto.',
      icon: <Ruler className="w-8 h-8 text-white" />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Fabricación',
      description: 'Manufactura de estructuras metálicas con capacidad de 600 toneladas mensuales en nuestras 3 plantas especializadas.',
      icon: <Factory className="w-8 h-8 text-white" />,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Montaje',
      description: 'Instalación y ensamble de estructuras con equipos especializados y personal altamente calificado para garantizar calidad.',
      icon: <Wrench className="w-8 h-8 text-white" />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Obra Civil',
      description: 'Construcción integral que incluye cimentaciones, estructuras de concreto y acabados complementarios.',
      icon: <Building className="w-8 h-8 text-white" />,
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluciones integrales en estructuras metálicas desde el diseño hasta la construcción completa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
              color={service.color}
              delay={index * 0.1}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todos los servicios
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
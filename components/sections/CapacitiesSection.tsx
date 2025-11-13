'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Factory, Users, Calendar, MapPin, Briefcase, Wrench, Cpu, Code } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const capacities = [
  {
    icon: Calendar,
    number: String(siteConfig.empresa.aniosExperiencia),
    unit: "AÑOS",
    label: "Experiencia Comprobada",
    description: "Desde 1996 construyendo Colombia"
  },
  {
    icon: Briefcase,
    number: "500+",
    unit: "PROYECTOS",
    label: "Obras Ejecutadas",
    description: "En 8 departamentos del país"
  },
  {
    icon: Factory,
    number: "600",
    unit: "TON/MES",
    label: "Capacidad de Producción",
    description: "3 plantas industriales con tecnología de punta"
  },
  {
    icon: Users,
    number: "220",
    unit: "EMPLEADOS",
    label: "Equipo Especializado",
    description: "Talento humano altamente calificado"
  },
  {
    icon: MapPin,
    number: "10,400",
    unit: "M²",
    label: "Infraestructura Industrial",
    description: "Popayán, Jamundí y Villa Rica"
  },
  {
    icon: Wrench,
    number: "8",
    unit: "GRÚAS",
    label: "Puentes Grúa",
    description: "Equipamiento industrial de punta"
  },
  {
    icon: Cpu,
    number: "3",
    unit: "MESAS CNC",
    label: "Tecnología de Corte",
    description: "Precisión y eficiencia en fabricación"
  },
  {
    icon: Code,
    number: "8",
    unit: "SOFTWARE",
    label: "Herramientas Especializadas",
    description: "Diseño y fabricación digital"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export function CapacitiesSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <section id="capacidades" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full mb-4">
              NUESTRAS CAPACIDADES
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Números que
            <span className="text-blue-600"> Respaldan la Excelencia</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Más de dos décadas de trayectoria respaldadas por infraestructura de clase mundial,
            talento humano especializado y resultados concretos en los proyectos más ambiciosos de Colombia.
          </motion.p>
        </motion.div>

        {/* Capacities Grid */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {capacities.map((capacity, index) => {
            const IconComponent = capacity.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Number */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-500">
                        {capacity.number}
                      </span>
                      <span className="text-lg font-semibold text-blue-500">
                        {capacity.unit}
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-500">
                    {capacity.label}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {capacity.description}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
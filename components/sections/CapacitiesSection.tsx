'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Factory, Users, Calendar, MapPin, Award, Zap } from 'lucide-react'

const capacities = [
  {
    icon: Factory,
    number: "600",
    unit: "TON/MES",
    label: "Capacidad de Producción",
    description: "3 plantas industriales con tecnología de punta"
  },
  {
    icon: MapPin,
    number: "3",
    unit: "PLANTAS",
    label: "Ubicaciones Estratégicas", 
    description: "Popayán, Jamundí y Villa Rica"
  },
  {
    icon: Users,
    number: "320",
    unit: "PERSONAS",
    label: "Equipo Especializado",
    description: "220 trabajadores + 100 contratistas"
  },
  {
    icon: Calendar,
    number: "+27",
    unit: "AÑOS",
    label: "Experiencia Comprobada",
    description: "Desde 1996 construyendo Colombia"
  },
  {
    icon: Award,
    number: "62+",
    unit: "PROYECTOS",
    label: "Obras Ejecutadas",
    description: "En 8 departamentos del país"
  },
  {
    icon: Zap,
    number: "8",
    unit: "GRÚAS",
    label: "Equipamiento Industrial",
    description: "Puentes grúa + mesas CNC"
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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
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
            Infraestructura que 
            <span className="text-blue-600"> Respalda la Excelencia</span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Con más de dos décadas de experiencia, contamos con la infraestructura, 
            tecnología y talento humano para ejecutar los proyectos más ambiciosos de Colombia.
          </motion.p>
        </motion.div>

        {/* Capacities Grid */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={itemVariants}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Listo para materializar tu proyecto?
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Nuestra capacidad instalada y experiencia nos permiten asumir proyectos desde 30 hasta 2,500 toneladas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Solicitar Cotización
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
                Ver Proyectos
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
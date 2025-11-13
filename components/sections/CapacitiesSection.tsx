'use client'

import { motion, useAnimation, useInView } from 'framer-motion'
import { Factory, Users, Calendar, MapPin, Briefcase, Cpu, Wrench, Code } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { useEffect, useRef } from 'react'

const capacities = [
  {
    icon: Calendar,
    number: String(siteConfig.empresa.aniosExperiencia),
    suffix: "+",
    label: "Años de Experiencia",
    description: "Desde 1996 construyendo Colombia"
  },
  {
    icon: Briefcase,
    number: "500",
    suffix: "+",
    label: "Proyectos Ejecutados",
    description: "En 8 departamentos del país"
  },
  {
    icon: Factory,
    number: "600",
    suffix: " ton/mes",
    label: "Capacidad de Producción",
    description: "Infraestructura de clase mundial"
  },
  {
    icon: Users,
    number: "220",
    suffix: "",
    label: "Empleados Directos",
    description: "Equipo altamente especializado"
  },
  {
    icon: MapPin,
    number: "10,400",
    suffix: "",
    label: "M² en 3 Plantas",
    description: "Popayán, Jamundí y Villa Rica"
  },
  {
    icon: Wrench,
    number: "8",
    suffix: "",
    label: "Puentes Grúa",
    description: "Equipamiento industrial de punta"
  },
  {
    icon: Cpu,
    number: "3",
    suffix: "",
    label: "Mesas de Corte CNC",
    description: "Tecnología de precisión avanzada"
  },
  {
    icon: Code,
    number: "8",
    suffix: "",
    label: "Software Especializado",
    description: "Herramientas de diseño y fabricación"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Números que Respaldan la Excelencia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Más de dos décadas de trayectoria respaldadas por infraestructura de clase mundial,
            talento humano especializado y resultados concretos en los proyectos más ambiciosos de Colombia.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Stats Grid */}
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
                className="relative group"
              >
                {/* Card con efecto de borde gradiente */}
                <div className="relative bg-white rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Gradiente de borde en hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-[2px] bg-white rounded-3xl"></div>

                  {/* Contenido */}
                  <div className="relative z-10">
                    {/* Icono */}
                    <div className="mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    {/* Número */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-start gap-1">
                        <span className="text-5xl lg:text-6xl font-black bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
                          {capacity.number}
                        </span>
                        {capacity.suffix && (
                          <span className="text-xl font-bold text-gray-500">
                            {capacity.suffix}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Label */}
                    <h3 className="text-gray-900 font-bold text-lg mb-2 leading-snug">
                      {capacity.label}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {capacity.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Decorador final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 flex justify-center"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-[2px] bg-blue-600"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <div className="w-12 h-[2px] bg-blue-600"></div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
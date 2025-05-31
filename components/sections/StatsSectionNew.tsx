'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'
import { Building2, Users, Award, TrendingUp } from 'lucide-react'
import { COMPANY_STATS } from '@/lib/company-data'

const stats = [
  {
    id: 1,
    value: COMPANY_STATS.EMPLOYEES,
    suffix: '',
    label: 'Empleados Directos',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    description: 'Personal especializado'
  },
  {
    id: 2,
    value: COMPANY_STATS.YEARS_EXPERIENCE,
    suffix: '+',
    label: 'Años de Experiencia',
    icon: Award,
    color: 'from-slate-600 to-slate-700',
    description: 'Desde 1996 en Popayán'
  },
  {
    id: 3,
    value: COMPANY_STATS.PLANTS,
    suffix: '',
    label: 'Plantas Industriales',
    icon: Building2,
    color: 'from-green-500 to-green-600',
    description: 'Popayán, Jamundí y Villa Rica'
  },
  {
    id: 4,
    value: COMPANY_STATS.MONTHLY_CAPACITY,
    suffix: ' ton/mes',
    label: 'Capacidad Total',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    description: 'Capacidad combinada de producción'
  },
]

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      {/* Fondo decorativo simplificado */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-gray-50/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-blue-600 font-semibold text-lg mb-2">Nuestra Trayectoria</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Números que 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"> hablan</span>
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Décadas de experiencia respaldadas por resultados concretos y clientes satisfechos
          </p>
        </motion.div>

        {/* Stats Grid - Simplificado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                  {/* Icono - Sin rotación */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Número animado */}
                  <div>
                    <h4 className="text-4xl font-bold text-gray-900 mb-2">
                      {hasAnimated ? (
                        <CountUp
                          start={0}
                          end={stat.value}
                          duration={2}
                          separator=","
                          suffix={stat.suffix}
                        />
                      ) : (
                        '0'
                      )}
                    </h4>
                    
                    {/* Label */}
                    <p className="text-lg font-semibold text-gray-600 mb-2 group-hover:text-gray-900 transition-colors">
                      {stat.label}
                    </p>
                    
                    {/* Descripción */}
                    <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Mensaje adicional - Simplificado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 backdrop-blur-sm rounded-full border border-blue-200">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"
                />
              ))}
            </div>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{COMPANY_STATS.CONTRACTORS} contratistas</span> especializados trabajan con nosotros
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
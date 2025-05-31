'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { Factory, Calendar, Weight, MapPin } from 'lucide-react'
import CountUp from 'react-countup'

interface StatCardProps {
  icon: React.ReactNode
  value: number
  suffix?: string
  label: string
  delay: number
  color: string
}

function StatCard({ icon, value, suffix = '', label, delay, color }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setIsVisible(true), delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [inView, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="relative p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-gray-600">
        {/* Icono de fondo */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500`}>
          <div className="w-full h-full flex items-center justify-center">
            {icon}
          </div>
        </div>
        
        {/* Contenido */}
        <div className="relative z-10">
          <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          
          <div className="text-4xl font-bold text-white mb-2">
            {isVisible ? (
              <CountUp
                start={0}
                end={value}
                duration={2.5}
                separator=","
                suffix={suffix}
              />
            ) : (
              '0'
            )}
          </div>
          
          <p className="text-gray-400 font-medium">{label}</p>
        </div>
        
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </motion.div>
  )
}

// Componente de línea de tiempo interactiva
function Timeline() {
  const [activeYear, setActiveYear] = useState(2024)
  const timelineRef = useRef(null)
  const inView = useInView(timelineRef, { once: true })

  const milestones = [
    { year: 1996, event: 'Fundación de MEISA', description: 'Inicio en Popayán' },
    { year: 2000, event: 'Primera expansión', description: 'Nuevas instalaciones' },
    { year: 2005, event: 'Certificación ISO', description: 'Calidad internacional' },
    { year: 2010, event: 'Planta Jamundí', description: 'Segunda planta de producción' },
    { year: 2015, event: 'Modernización', description: 'Tecnología de punta' },
    { year: 2020, event: 'Líder regional', description: 'Mayor capacidad del suroccidente' },
    { year: 2024, event: 'Innovación continua', description: '600 ton/mes de capacidad' },
  ]

  return (
    <div ref={timelineRef} className="relative mt-16">
      <h3 className="text-2xl font-bold text-white text-center mb-8">Nuestra Historia</h3>
      
      {/* Línea base */}
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={inView ? { width: '100%' } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute h-full bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>
      
      {/* Marcadores */}
      <div className="relative -mt-1">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.year}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
            className="absolute transform -translate-x-1/2"
            style={{ left: `${(index / (milestones.length - 1)) * 100}%` }}
          >
            <button
              onClick={() => setActiveYear(milestone.year)}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                activeYear === milestone.year
                  ? 'bg-orange-500 border-orange-500 scale-150'
                  : 'bg-gray-800 border-gray-600 hover:scale-125'
              }`}
            />
            
            {/* Tooltip */}
            {activeYear === milestone.year && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-48 p-4 bg-gray-800 rounded-lg shadow-xl"
              >
                <p className="text-orange-500 font-bold">{milestone.year}</p>
                <p className="text-white font-medium">{milestone.event}</p>
                <p className="text-gray-400 text-sm">{milestone.description}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Años */}
      <div className="flex justify-between mt-8 text-gray-500 text-sm">
        <span>1996</span>
        <span className="text-orange-500 font-bold">2024</span>
      </div>
    </div>
  )
}

export function StatsSection() {
  const stats = [
    {
      icon: <Weight className="w-8 h-8" />,
      value: 600,
      suffix: ' ton/mes',
      label: 'Capacidad de Producción',
      color: 'bg-orange-500',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      value: 29,
      suffix: ' años',
      label: 'Años de Experiencia',
      color: 'bg-blue-500',
    },
    {
      icon: <Factory className="w-8 h-8" />,
      value: 2,
      suffix: '',
      label: 'Plantas de Producción',
      color: 'bg-green-500',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      value: 500,
      suffix: '+',
      label: 'Proyectos Completados',
      color: 'bg-purple-500',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            MEISA en Números
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Líderes en estructuras metálicas en el suroccidente colombiano
          </p>
        </motion.div>
        
        {/* Grid de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>
        
        {/* Timeline interactivo */}
        <Timeline />
        
        {/* Mapa de Colombia con proyectos */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 relative"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">Presencia Nacional</h3>
          <div className="relative max-w-2xl mx-auto">
            {/* Aquí iría un mapa SVG de Colombia con puntos de proyectos */}
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
              <p className="text-gray-500">Mapa de proyectos próximamente</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Instalar react-countup
// npm install react-countup
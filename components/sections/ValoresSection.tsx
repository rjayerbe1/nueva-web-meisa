'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Award, Heart, Zap, Target, Users, Flame, Clock } from 'lucide-react'

const valores = [
  {
    id: 1,
    nombre: "Efectividad",
    descripcion: "Cumplimos con los objetivos propuestos de manera eficiente",
    icon: CheckCircle,
    color: "from-slate-600 to-slate-700",
    iconColor: "text-blue-500"
  },
  {
    id: 2,
    nombre: "Integridad",
    descripcion: "Actuamos con honestidad y transparencia en todas nuestras acciones",
    icon: Award,
    color: "from-blue-600 to-blue-700",
    iconColor: "text-green-500"
  },
  {
    id: 3,
    nombre: "Lealtad",
    descripcion: "Comprometidos con nuestros clientes, colaboradores y la empresa",
    icon: Heart,
    color: "from-gray-600 to-gray-700",
    iconColor: "text-red-500"
  },
  {
    id: 4,
    nombre: "Proactividad",
    descripcion: "Anticipamos necesidades y tomamos iniciativa en las soluciones",
    icon: Zap,
    color: "from-slate-500 to-slate-600",
    iconColor: "text-yellow-500"
  },
  {
    id: 5,
    nombre: "Aprendizaje Continuo",
    descripcion: "Constantemente mejoramos nuestros conocimientos y habilidades",
    icon: Target,
    color: "from-blue-700 to-blue-800",
    iconColor: "text-purple-500"
  },
  {
    id: 6,
    nombre: "Respeto",
    descripcion: "Valoramos a todas las personas y tratamos con consideración",
    icon: Users,
    color: "from-gray-700 to-gray-800",
    iconColor: "text-indigo-500"
  },
  {
    id: 7,
    nombre: "Pasión",
    descripcion: "Amamos lo que hacemos y nos esforzamos por la excelencia",
    icon: Flame,
    color: "from-slate-700 to-slate-800",
    iconColor: "text-orange-500"
  },
  {
    id: 8,
    nombre: "Disciplina",
    descripcion: "Mantenemos consistencia y orden en nuestros procesos",
    icon: Clock,
    color: "from-blue-800 to-slate-700",
    iconColor: "text-gray-500"
  }
]

export function ValoresSection() {
  return (
    <section id="valores" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-blue-600 font-semibold text-lg mb-2">Nuestros Principios</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Valores
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-slate-600"> Corporativos</span>
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            8 valores fundamentales que guían nuestro actuar diario y definen la cultura organizacional de MEISA
          </p>
        </motion.div>

        {/* Grid de valores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valores.map((valor, index) => {
            const Icon = valor.icon
            return (
              <motion.div
                key={valor.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 h-full">
                  {/* Icono */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="mb-4"
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${valor.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  {/* Contenido */}
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {valor.nombre}
                  </h4>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {valor.descripcion}
                  </p>

                  {/* Decoración esquina */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 opacity-20"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${valor.color}`} />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Mensaje adicional */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-full border border-slate-200">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-slate-600 border-2 border-white"
                />
              ))}
            </div>
            <p className="text-gray-700">
              Estos valores guían cada decisión y acción en <span className="font-semibold text-blue-700">MEISA</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Award, Building, CheckCircle, Rocket, Factory, Shield, Briefcase, Star } from 'lucide-react'
import Image from 'next/image'
import { COMPANY_INFO, CORPORATE_VALUES, COMPANY_HISTORY } from '@/lib/company-data'

// Mapeo de valores a sus iconos personalizados
const valorIconPaths: Record<string, string> = {
  'Efectividad': '/images/valores/efectividad.webp',
  'Integridad': '/images/valores/integridad.webp',
  'Lealtad': '/images/valores/lealtad.webp',
  'Proactividad': '/images/valores/proactividad.webp',
  'Aprendizaje Continuo': '/images/valores/aprendizaje.webp',
  'Respeto': '/images/valores/respeto.webp',
  'Pasión': '/images/valores/pasion.webp',
  'Disciplina': '/images/valores/disciplina.webp'
}

export function QuienesSomosSection() {
  return (
    <section id="quienes-somos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Quiénes <span className="text-blue-600">Somos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Más de 29 años construyendo la infraestructura de Colombia
          </p>
        </motion.div>

        {/* Historia - Texto introductorio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <p className="text-lg text-gray-700 leading-relaxed">
            <span className="font-bold text-gray-900">Metálicas e Ingeniería S.A.S.</span> fue constituida en el año
            <span className="font-bold text-blue-600"> 1996 </span>
            en la ciudad de Popayán, centrando su actividad en el diseño, fabricación y montaje de estructuras metálicas.
            A lo largo de más de 29 años, hemos participado activamente en la construcción de proyectos
            en todo el territorio nacional, incorporando talento humano competente y tecnología de última generación.
          </p>
        </motion.div>

        {/* Timeline horizontal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">Nuestra Trayectoria</h3>

          <div className="relative">
            {/* Línea horizontal conectora */}
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-blue-300"></div>

            {/* Items */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {COMPANY_HISTORY.timeline.map((item, index) => {
                const timelineIcons = [Rocket, Factory, Shield, Briefcase, Star]
                const Icon = timelineIcons[index] || Star

                return (
                  <motion.div
                    key={item.period}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Icono en la línea */}
                    <div className="w-12 h-12 bg-blue-600 rounded-full shadow-lg z-10 mb-4 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all w-full text-center">
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold mb-2">
                        {item.period}
                      </span>
                      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 leading-snug">{item.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Highlights compactos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 mb-16"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <Building className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">3 plantas de producción</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Certificación RUC</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Tecnología BIM</span>
          </div>
        </motion.div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Misión */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Misión</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {COMPANY_INFO.MISSION}
            </p>
          </motion.div>

          {/* Visión */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-100 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Visión</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {COMPANY_INFO.VISION}
            </p>
          </motion.div>
        </div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nuestros Valores Corporativos</h3>
            <p className="text-gray-600">Principios fundamentales que guían nuestro actuar diario</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CORPORATE_VALUES.map((valor, index) => {
              const iconPath = valorIconPaths[valor.name]
              return (
                <motion.div
                  key={valor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 h-full">
                    <div className="w-16 h-16 mb-4 flex items-center justify-center">
                      {iconPath && (
                        <Image
                          src={iconPath}
                          alt={valor.name}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{valor.name}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{valor.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

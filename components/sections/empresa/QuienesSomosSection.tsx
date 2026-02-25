'use client'

import { motion } from 'framer-motion'
import { Award, Building, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { COMPANY_INFO, CORPORATE_VALUES, COMPANY_HISTORY, COMPANY_STATS } from '@/lib/company-data'

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

// Iconos animados para el timeline
const timelineIconPaths = [
  '/images/iconos-animados/fundacion.gif',
  '/images/iconos-animados/expansion.gif',
  '/images/iconos-animados/certificacion.gif',
  '/images/iconos-animados/proyectos.gif',
  '/images/iconos-animados/consolidacion.gif'
]

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
            Más de {COMPANY_STATS.YEARS_EXPERIENCE} años construyendo la infraestructura de Colombia
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
            A lo largo de más de {COMPANY_STATS.YEARS_EXPERIENCE} años, hemos participado activamente en la construcción de proyectos
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
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-blue-300"></div>

            {/* Items */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {COMPANY_HISTORY.timeline.map((item, index) => {
                const iconPath = timelineIconPaths[index]

                return (
                  <motion.div
                    key={item.period}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Icono animado */}
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg z-10 mb-4 flex items-center justify-center border-2 border-blue-200">
                      <img
                        src={iconPath}
                        alt={item.title}
                        className="w-12 h-12 object-contain"
                      />
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

        {/* Misión/Visión + Valores - Diseño integrado */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Columna 1: Misión y Visión */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Misión */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <img
                  src="/images/iconos-animados/mision.gif"
                  alt="Misión"
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-xl font-bold text-gray-900">Misión</h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-16">
                {COMPANY_INFO.MISSION}
              </p>
            </div>

            {/* Visión */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <img
                  src="/images/iconos-animados/vision.gif"
                  alt="Visión"
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-xl font-bold text-gray-900">Visión</h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-16">
                {COMPANY_INFO.VISION}
              </p>
            </div>
          </motion.div>

          {/* Columna 2: Valores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Valores Corporativos</h3>
            <div className="grid grid-cols-4 gap-6">
              {CORPORATE_VALUES.map((valor, index) => {
                const iconPath = valorIconPaths[valor.name]
                return (
                  <motion.div
                    key={valor.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110">
                      {iconPath && (
                        <Image
                          src={iconPath}
                          alt={valor.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{valor.name}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

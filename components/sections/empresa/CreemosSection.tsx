'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Quote } from 'lucide-react'
import { LEADERSHIP_QUOTE } from '@/lib/company-data'

const frases = [
  "en construir legado.",
  "que la calidad es primero.",
  "en estructuras que perduran.",
  "en equipos comprometidos.",
  "en pasión y disciplina."
]

export function CreemosSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // Parallax responsive
  const yParallaxMobile = useTransform(scrollYProgress, [0, 0.7, 1], [0, 60, 60])
  const yParallaxDesktop = useTransform(scrollYProgress, [0, 0.7, 1], [0, 150, 150])

  return (
    <section ref={containerRef} className="relative py-16 md:py-28 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Grid de 2 columnas: Frases | Cita del liderazgo */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* IZQUIERDA - Frases "Creemos" */}
          <div className="relative flex flex-col">
            <div className="flex items-start w-full">
              {/* Palabra CREEMOS - Versión móvil */}
              <motion.div
                style={{ y: yParallaxMobile }}
                className="md:hidden relative z-10 mr-2 flex-shrink-0"
              >
                <h3 className="text-2xl font-black text-blue-700 leading-none" style={{ fontFamily: 'HelveticaNowDisplay, Arial, sans-serif' }}>
                  creemos
                </h3>
              </motion.div>

              {/* Palabra CREEMOS - Versión desktop */}
              <motion.div
                style={{ y: yParallaxDesktop }}
                className="hidden md:block relative z-10 mr-3 flex-shrink-0"
              >
                <h3 className="text-4xl lg:text-5xl font-black text-blue-700 leading-none" style={{ fontFamily: 'HelveticaNowDisplay, Arial, sans-serif' }}>
                  creemos
                </h3>
              </motion.div>

              {/* Frases animadas */}
              <div className="relative z-10 flex flex-col space-y-1 md:space-y-3 w-full">
                {frases.map((frase, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="text-xl md:text-3xl lg:text-4xl text-gray-700 leading-tight"
                    style={{ fontFamily: 'HelveticaNowDisplay, Arial, sans-serif' }}
                  >
                    {frase}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>

          {/* DERECHA - Cita del Liderazgo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            {/* Quote icon decorativo */}
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6">
              <Quote className="w-12 h-12 md:w-16 md:h-16 text-blue-100 rotate-180" />
            </div>

            {/* Card de la cita */}
            <div className="relative bg-white rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100">
              {/* Línea decorativa superior */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full" />

              {/* Cita */}
              <blockquote className="text-lg md:text-xl lg:text-2xl text-gray-700 italic leading-relaxed mb-8 pt-4">
                "{LEADERSHIP_QUOTE.quote}"
              </blockquote>

              {/* Autor */}
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">M</span>
                </div>

                <div>
                  <p className="font-bold text-gray-900 text-lg">
                    {LEADERSHIP_QUOTE.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {LEADERSHIP_QUOTE.title}
                  </p>
                </div>
              </div>

              {/* Decoración esquina */}
              <div className="absolute bottom-4 right-4">
                <Quote className="w-8 h-8 text-blue-50" />
              </div>
            </div>

            {/* Badge MEISA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm"
            >
              Desde 1996
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 border border-blue-500 rounded-full" />
        <div className="absolute bottom-20 right-20 w-60 h-60 border border-blue-500 rounded-full" />
      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'

const frases = [
  "en construir legado.",
  "que la calidad es primero.",
  "en estructuras que perduran.",
  "en equipos comprometidos.",
  "en pasión y disciplina."
]

const stats = [
  { number: 29, label: "Años de Experiencia", suffix: "+" },
  { number: 500, label: "Proyectos Ejecutados", suffix: "+" },
  { number: 220, label: "Empleados Directos", suffix: "" },
  { number: 10400, label: "M² en 3 Plantas", suffix: "" }
]

function StatCard({ number, label, suffix, delay, scrollYProgress }: { number: number; label: string; suffix: string; delay: number; scrollYProgress: any }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const count = useCountUp(isInView ? number : 0, 2500)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-4 md:py-6 h-[80px] md:h-[120px]"
    >
      {/* Versión móvil - sin contador */}
      <div className="md:hidden text-3xl font-black text-blue-700 font-lato mb-1">
        {number >= 1000 ? number.toLocaleString() : number}{suffix}
      </div>

      {/* Versión desktop - con contador animado */}
      <motion.div
        className="hidden md:block text-6xl font-black text-blue-700 font-lato mb-1"
        animate={isInView ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3, delay: delay + 0.5 }}
      >
        {number >= 1000 ? count.toLocaleString() : count}{suffix}
      </motion.div>
      <div className="text-[9px] md:text-sm text-gray-500 font-lato text-center leading-tight px-1">
        {label}
      </div>
    </motion.div>
  )
}

export function CapacitiesSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // Parallax responsive: móvil 90px, desktop 225px
  const yParallaxMobile = useTransform(scrollYProgress, [0, 0.7, 1], [0, 90, 90])
  const yParallaxDesktop = useTransform(scrollYProgress, [0, 0.7, 1], [0, 225, 225])

  return (
    <section ref={containerRef} className="relative py-12 md:py-32 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Título y subtítulo */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-gray-900 mb-6"
          >
            Construyendo Legado con Cada Proyecto
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-6"
          >
            Cada proyecto es una oportunidad para dejar huella permanente.
          </motion.p>
          <div className="w-24 h-1 bg-blue-100 mx-auto rounded-full"></div>
        </div>

        {/* Grid de 2 columnas: 60% textos, 40% números */}
        <div className="grid md:grid-cols-[60%_40%] gap-6 md:gap-16 items-start">

          {/* IZQUIERDA - Frases con CREEMOS móvil */}
          <div className="relative flex flex-col -ml-2 md:-ml-24">
            <div className="flex items-start w-full">
            {/* Palabra CREEMOS - Versión móvil */}
            <motion.div
              style={{ y: yParallaxMobile }}
              className="md:hidden relative z-10 mr-1 flex-shrink-0"
            >
              <h3 className="text-xl font-black text-blue-700 leading-none" style={{ fontFamily: 'HelveticaNowDisplay, Arial, sans-serif' }}>
                creemos
              </h3>
            </motion.div>

            {/* Palabra CREEMOS - Versión desktop */}
            <motion.div
              style={{ y: yParallaxDesktop }}
              className="hidden md:block relative z-10 mr-2 flex-shrink-0"
            >
              <h3 className="text-4xl lg:text-5xl font-black text-blue-700 leading-none" style={{ fontFamily: 'HelveticaNowDisplay, Arial, sans-serif' }}>
                creemos
              </h3>
            </motion.div>

            {/* Frases animadas */}
            <div className="relative z-10 flex flex-col space-y-0.5 md:space-y-2 w-full md:pr-8">
              {frases.map((frase, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="text-xl md:text-4xl lg:text-5xl text-gray-700 leading-none"
                  style={{ fontFamily: 'HelveticaNowDisplay, Arial, sans-serif' }}
                >
                  {frase}
                </motion.p>
              ))}
            </div>
            </div>
          </div>

          {/* DERECHA - Números con contadores - Grid 2x2 */}
          <div className="relative flex flex-col">
            <div className="grid grid-cols-2 gap-3 md:gap-8 pl-0 md:pl-8">
            {stats.map((stat, i) => (
              <StatCard
                key={i}
                number={stat.number}
                label={stat.label}
                suffix={stat.suffix}
                delay={i * 0.1}
                scrollYProgress={scrollYProgress}
              />
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Award, Shield, Zap, ArrowRight } from 'lucide-react'

const features = [
  {
    name: 'Calidad Certificada',
    description: 'Cumplimos con los más altos estándares de calidad en todos nuestros procesos.',
    icon: CheckCircle2,
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Experiencia Comprobada',
    description: 'Más de 29 años de trayectoria respaldan nuestro trabajo.',
    icon: Award,
    color: 'from-slate-600 to-slate-700',
  },
  {
    name: 'Seguridad Garantizada',
    description: 'Priorizamos la seguridad en cada etapa del proyecto.',
    icon: Shield,
    color: 'from-blue-600 to-blue-700',
  },
  {
    name: 'Innovación Constante',
    description: 'Utilizamos tecnología de vanguardia en diseño y fabricación.',
    icon: Zap,
    color: 'from-purple-500 to-purple-600',
  },
]

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section 
      ref={containerRef}
      className="relative py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
    >
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-blue-400 font-semibold text-lg mb-2">Sobre Nosotros</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Construyendo el futuro <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400">
                con acero
              </span>
            </h3>
            
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              MEISA es líder en el diseño, fabricación y montaje de estructuras metálicas en Colombia. 
              Con más de 29 años de experiencia, hemos sido parte fundamental en el desarrollo de la 
              infraestructura del país.
            </p>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Desde nuestra fundación en 1996 en Popayán, hemos crecido hasta convertirnos en referentes 
              del sector, con dos plantas de producción y capacidad de 600 toneladas mensuales.
            </p>

            {/* Características */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        p-2 rounded-lg bg-gradient-to-br ${feature.color} 
                        group-hover:scale-110 transition-transform duration-300
                      `}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{feature.name}</h4>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
              >
                Conoce nuestra historia
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            style={{ y, opacity }}
            className="relative"
          >
            <div className="relative">
              {/* Marco decorativo */}
              <div className="absolute -inset-4 bg-gradient-to-r from-slate-500 to-blue-500 rounded-2xl opacity-20 blur-2xl" />
              
              {/* Grid de imágenes */}
              <div className="relative grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white/80">2</span>
                      <span className="text-lg text-white/60 ml-2">Plantas</span>
                    </div>
                  </div>
                  <div className="relative h-32 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">ISO</span>
                      <span className="text-lg text-white/80 ml-2">9001</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-4 pt-8"
                >
                  <div className="relative h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">600</span>
                      <span className="text-lg text-white/80 ml-2">ton/mes</span>
                    </div>
                  </div>
                  <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-white/80">500+</span>
                      <span className="text-lg text-white/60">Proyectos</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Badge flotante */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-2xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">29+</p>
                    <p className="text-sm text-gray-600">Años de experiencia</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
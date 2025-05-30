'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Award, Shield, Zap, ArrowRight, Factory, Users } from 'lucide-react'

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

const milestones = [
  { year: '1996', event: 'Fundación en Popayán, Cauca', icon: Factory },
  { year: '2010', event: 'Apertura segunda planta Jamundí', icon: Factory },
  { year: '2015', event: 'Apertura tercera planta Villa Rica', icon: Factory },
  { year: '2024', event: '600 toneladas/mes capacidad total', icon: CheckCircle2 },
]

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section 
      ref={containerRef}
      className="relative py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
    >
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-blue-400 font-semibold text-lg mb-2">Sobre Nosotros</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Construyendo el futuro 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400">
                con acero desde 1996
              </span>
            </h3>
            
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              <strong>Misión:</strong> Fortalecer la empresa a nivel nacional garantizando un crecimiento 
              en el tiempo a través de calidad de los productos y servicios, generando rentabilidad, 
              aumento de confianza, mayor satisfacción de clientes y colaboradores para así mantener 
              su consolidación y talento profesional ante el mercado y llegar a nuevos clientes.
            </p>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              <strong>Visión:</strong> Desarrollar soluciones a proyectos con estructuras metálicas 
              y obras civiles, logrando el balance ideal entre costos, diseño, funcionalidad y 
              excelente calidad, cumpliendo con las normas sismo resistentes vigentes, los estándares 
              de fabricación y montaje actuales, de la mano del talento humano y responsabilidad 
              de los trabajadores.
            </p>

            {/* Timeline simplificado */}
            <div className="mb-8">
              <h4 className="text-white font-semibold mb-4">Nuestra Historia</h4>
              <div className="space-y-3">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon
                  return (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-blue-400 font-semibold">{milestone.year}</span>
                          <span className="text-gray-400">{milestone.event}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
              >
                Conoce nuestra historia completa
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/politicas"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <Award className="w-5 h-5" />
                Ver políticas
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual - Características y stats */}
          <motion.div
            style={{ y, opacity }}
            className="relative"
          >
            {/* Grid de características */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="relative group"
                  >
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                      <div className={`
                        w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} 
                        flex items-center justify-center mb-4
                        group-hover:scale-110 transition-transform duration-300
                      `}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h5 className="text-white font-semibold mb-2">{feature.name}</h5>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Imagen de fondo con overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="relative h-64 bg-gradient-to-br from-gray-700 to-gray-800">
                <Image
                  src="/images/about/planta-produccion.webp"
                  alt="Planta de producción MEISA"
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                
                {/* Stats overlay - Enfoque en historia */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex justify-around">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">1996</p>
                      <p className="text-sm text-gray-300">Fundación</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">3</p>
                      <p className="text-sm text-gray-300">Generaciones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">29+</p>
                      <p className="text-sm text-gray-300">Años líder</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
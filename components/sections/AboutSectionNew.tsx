'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Award, Shield, Zap, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const features = [
  {
    name: 'Calidad Certificada',
    description: 'Cumplimos con los más altos estándares de calidad en todos nuestros procesos.',
    icon: CheckCircle2,
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Experiencia Comprobada',
    description: `Más de ${siteConfig.empresa.aniosExperiencia} años de trayectoria respaldan nuestro trabajo.`,
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
            <h2 className="text-blue-400 font-semibold text-lg mb-2">Sobre MEISA</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Más de {siteConfig.empresa.aniosExperiencia} Años
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500">
                Construyendo el Futuro de Colombia
              </span>
            </h3>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Fundada en <strong className="text-red-500">1996 en Popayán, Cauca</strong>, MEISA (Metálicas e Ingeniería S.A.S.)
              se ha consolidado como uno de los referentes nacionales en diseño, fabricación y montaje de estructuras metálicas.
              Con proyectos emblemáticos como el <strong className="text-blue-400">Puente La Floresta en Bogotá</strong> y el
              <strong className="text-blue-400"> Centro Comercial Campanario en Popayán</strong>, hemos contribuido al desarrollo
              de la infraestructura de Colombia durante {siteConfig.empresa.aniosExperiencia} años.
            </p>

            {/* CTA Prominente */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Link
                href="/empresa"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Conoce Nuestra Historia Completa
                <ArrowRight className="w-6 h-6" />
              </Link>
              <p className="text-gray-400 text-sm mt-3">
                Descubre nuestra misión, visión, valores y trayectoria detallada
              </p>
            </motion.div>

            {/* Grid de valores clave (compacto) */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 group"
                  >
                    <div className={`
                      w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color}
                      flex items-center justify-center flex-shrink-0
                      group-hover:scale-110 transition-transform duration-300
                    `}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-semibold text-sm mb-1">{feature.name}</h5>
                      <p className="text-gray-400 text-xs leading-tight">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Visual - Imagen con stats */}
          <motion.div
            style={{ y, opacity }}
            className="relative"
          >
            {/* Imagen de fondo con overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="relative h-96 bg-gradient-to-br from-gray-700 to-gray-800">
                <Image
                  src="/images/about/planta-produccion.webp"
                  alt="Planta de producción MEISA"
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

                {/* Stats overlay - Enfoque en historia */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h4 className="text-white font-bold text-2xl mb-6">Nuestra Trayectoria</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white mb-1">1996</p>
                      <p className="text-sm text-gray-300">Fundación</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white mb-1">500+</p>
                      <p className="text-sm text-gray-300">Proyectos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white mb-1">{siteConfig.empresa.aniosExperiencia}+</p>
                      <p className="text-sm text-gray-300">Años</p>
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

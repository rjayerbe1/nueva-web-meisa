'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Factory, TrendingUp, Zap, Building2, ArrowRight } from 'lucide-react'

const milestones = [
  {
    year: '1996',
    title: 'Fundación',
    description: 'Iniciamos en Popayán con estructuras metálicas',
    image: '/images/about/planta-produccion.webp',
    icon: Factory,
  },
  {
    year: '2000s',
    title: 'Expansión Nacional',
    description: 'Proyectos emblemáticos en toda Colombia',
    image: '/images/about/planta-produccion.webp', // Placeholder - cambiar por imagen real
    icon: TrendingUp,
  },
  {
    year: '2010s',
    title: 'Innovación BIM',
    description: 'Tecnología de punta en diseño y fabricación',
    image: '/images/about/planta-produccion.webp', // Placeholder - cambiar por imagen real
    icon: Zap,
  },
  {
    year: '2024',
    title: 'Consolidación',
    description: '3 plantas, 600 ton/mes, líderes en Colombia',
    image: '/images/about/planta-produccion.webp', // Placeholder - cambiar por imagen real
    icon: Building2,
  },
]

function TimelineCard({ milestone, index, isLast }: { milestone: typeof milestones[0]; index: number; isLast: boolean }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })
  const Icon = milestone.icon

  return (
    <div className="relative flex-1">
      {/* Línea conectora horizontal */}
      {!isLast && (
        <div className="hidden lg:block absolute top-[60px] left-1/2 w-full h-[2px] z-0">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 origin-left"
          />
        </div>
      )}

      {/* Punto en la línea */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Círculo con icono */}
        <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-2xl mb-6 relative group">
          {/* Anillo animado */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-0 group-hover:opacity-100 animate-ping" />

          {/* Icono */}
          <Icon className="w-12 h-12 text-white relative z-10" />

          {/* Año en el círculo */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-900 border-2 border-blue-500 rounded-full px-4 py-1">
            <span className="text-blue-400 font-bebas text-2xl">{milestone.year}</span>
          </div>
        </div>

        {/* Card con imagen */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
          className="w-full group/card cursor-pointer"
        >
          <div className="relative h-56 rounded-xl overflow-hidden shadow-xl">
            <Image
              src={milestone.image}
              alt={milestone.title}
              fill
              className="object-cover transition-transform duration-500 group-hover/card:scale-110"
            />
            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

            {/* Contenido sobre la imagen */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              {/* Título */}
              <h5 className="text-xl md:text-2xl font-bebas uppercase text-white mb-2 leading-tight">
                {milestone.title}
              </h5>

              {/* Descripción */}
              <p className="text-gray-300 font-lato text-sm leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={containerRef}
      className="relative py-16 md:py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
    >
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título y descripción */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bebas uppercase text-white mb-6"
          >
            Nuestra{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500">
              Trayectoria
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 font-lato max-w-4xl mx-auto leading-relaxed"
          >
            Desde <strong className="text-blue-400">1996 en Popayán, Cauca</strong>, MEISA nació con la visión de transformar
            la industria metalmecánica colombiana. De empresa local a referente nacional en diseño, fabricación y montaje
            de estructuras metálicas. Cada proyecto cuenta nuestra historia de innovación y compromiso con Colombia.
          </motion.p>
        </div>

        {/* Timeline horizontal con línea conectora */}
        <div className="relative mb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
            {milestones.map((milestone, index) => (
              <TimelineCard
                key={milestone.year}
                milestone={milestone}
                index={index}
                isLast={index === milestones.length - 1}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center"
        >
          <Link
            href="/trayectoria"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-lato font-bold text-lg rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            Conoce nuestra trayectoria completa
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

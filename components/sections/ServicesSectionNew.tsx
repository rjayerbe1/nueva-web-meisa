'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Cpu, Hammer, Building2, Settings } from 'lucide-react'

// Componente para el título animado con letras individuales
const AnimatedTitle = ({ text, className = "" }: { text: string; className?: string }) => {
  const words = text.split(' ')

  return (
    <h2 className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-3">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: (wordIndex * word.length + charIndex) * 0.02,
                ease: "easeOut"
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </h2>
  )
}

const services = [
  {
    id: 'diseno',
    nombre: 'Diseño Estructural',
    subtitulo: 'Ingeniería de precisión BIM',
    descripcion: 'Análisis y diseño de estructuras metálicas con tecnología avanzada',
    video: '/videos/diseno-estructural.mp4',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80', // fallback
    color: '#3b82f6', // blue-500
    overlayColor: '#1e3a8a', // blue-800
    overlayOpacity: 0.4
  },
  {
    id: 'fabricacion',
    nombre: 'Fabricación Metálica',
    subtitulo: 'Producción 600 ton/mes',
    descripcion: '3 plantas industriales con equipos de última generación',
    video: '/videos/fabricacion-metalica.mp4',
    image: 'https://images.unsplash.com/photo-1565131568475-d4004fb1be6e?w=1200&q=80', // fallback
    color: '#64748b', // slate-500
    overlayColor: '#1e293b', // slate-800
    overlayOpacity: 0.4
  },
  {
    id: 'montaje',
    nombre: 'Montaje Especializado',
    subtitulo: 'Instalación profesional',
    descripcion: 'Equipos certificados y personal experto en alturas',
    video: '/videos/montaje-especializado.mp4',
    image: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=1200&q=80', // fallback
    color: '#16a34a', // green-600
    overlayColor: '#15803d', // green-700
    overlayOpacity: 0.4
  },
  {
    id: 'construccion',
    nombre: 'Construcción Civil',
    subtitulo: 'Servicio integral',
    descripcion: 'Obras complementarias desde cimentación hasta acabados',
    video: '/videos/construccion-civil.mp4',
    image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=80', // fallback
    color: '#a855f7', // purple-500
    overlayColor: '#7e22ce', // purple-700
    overlayOpacity: 0.4
  }
]

// Componente individual para cada servicio con parallax
function ServiceCard({ servicio, index }: { servicio: typeof services[0]; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Efecto parallax para el contenido - se mueve más lento que el scroll
  const contentY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%'])

  return (
    <Link
      href={`/servicios#${servicio.id}`}
      className="group block"
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        viewport={{ once: true, margin: "-50px" }}
        className="relative h-screen overflow-hidden"
      >
        {/* Imagen o Video de fondo */}
        <div className="absolute inset-0">
          {servicio.video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={
                servicio.id === 'diseno'
                  ? { objectPosition: '15% 70%', transform: 'scale(1.30)' }
                  : servicio.id === 'construccion'
                  ? { transform: 'scale(1.60)' }
                  : undefined
              }
            >
              <source src={servicio.video} type="video/mp4" />
            </video>
          ) : (
            <img
              src={servicio.image}
              alt={servicio.nombre}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
        </div>

        {/* Overlay oscuro */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#000000',
            opacity: servicio.overlayOpacity
          }}
        />

        {/* Overlay hover con color del servicio */}
        <style jsx>{`
          .hover-overlay-${servicio.id} {
            background-color: ${servicio.overlayColor};
            opacity: 0;
            transition: opacity 500ms;
          }
          .group:hover .hover-overlay-${servicio.id} {
            opacity: 0.2;
          }
        `}</style>
        <div className={`absolute inset-0 hover-overlay-${servicio.id}`} />

        {/* Contenido en la parte inferior con efecto parallax */}
        <motion.div
          style={{ y: contentY }}
          className="absolute inset-0 flex flex-col items-center justify-end px-6 lg:px-12 pb-8 lg:pb-12 text-center"
        >
          {/* Subtítulo pequeño */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            viewport={{ once: true }}
            className="text-gray-300 font-lato text-sm lg:text-base mb-2 uppercase tracking-wider"
          >
            {servicio.subtitulo}
          </motion.p>

          {/* Título animado con letras */}
          <AnimatedTitle
            text={servicio.nombre.toUpperCase()}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bebas uppercase text-white mb-4 drop-shadow-2xl leading-tight"
          />

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            viewport={{ once: true }}
            className="text-gray-200 font-lato text-sm lg:text-base mb-6 max-w-md"
          >
            {servicio.descripcion}
          </motion.p>

          {/* Botón Conocer más estilo Ferrari */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 group/btn"
          >
            <span className="text-white font-lato uppercase tracking-wider text-sm lg:text-base font-semibold">
              Conocer más
            </span>

            {/* Círculo con flecha estilo Ferrari */}
            <div className="relative w-10 h-10 lg:w-12 lg:h-12">
              {/* Círculo exterior */}
              <div className="absolute inset-0 rounded-full border-2 border-white/80 group-hover/btn:border-white transition-all duration-300 group-hover/btn:scale-110" />

              {/* Círculo interior animado en hover */}
              <div className="absolute inset-0 rounded-full bg-white/0 group-hover/btn:bg-white transition-all duration-300" />

              {/* Flecha */}
              <div className="absolute inset-0 flex items-center justify-center">
                <ArrowRight
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white transition-all duration-300 transform group-hover/btn:translate-x-1"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Línea divisoria (excepto en el último servicio) */}
        {index < services.length - 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        )}
      </motion.div>
    </Link>
  )
}

export function ServicesSection() {
  return (
    <section id="servicios" className="bg-gray-900">
      {/* Grid de servicios estilo Ferrari - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {services.map((servicio, index) => (
          <ServiceCard key={servicio.id} servicio={servicio} index={index} />
        ))}
      </div>
    </section>
  )
}

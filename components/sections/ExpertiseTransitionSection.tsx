'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

export function ExpertiseTransitionSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Transform para parallax - la imagen se mueve más lento que el scroll
  const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Video de fondo con parallax */}
      <motion.div
        style={{ y }}
        className="absolute -top-[15%] left-0 w-full h-[130%]"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ objectPosition: '45% center' }}
        >
          <source src="/videos/expertise-background.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Contenido alineado a la izquierda */}
      <div className="relative z-10 h-full flex items-start pt-16 md:items-center md:pt-0 px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="max-w-3xl">
          {/* Título - Dos líneas con tamaños diferentes */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase text-white leading-none">
              EXPERTOS
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bebas uppercase text-white leading-tight -mt-2">
              en Acero
            </h3>
          </motion.div>

          {/* Texto descriptivo */}
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 font-lato leading-relaxed mb-8 bg-black/40 px-2 py-2 rounded-lg"
          >
            Cada detalle bajo control: planeación, tecnología BIM, presupuesto, ingeniería, diseño de conexiones, detallado, fabricación y montaje. El ciclo completo en nuestras manos.
          </motion.p>

          {/* Botón CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/tecnologia"
              className="group relative inline-block overflow-hidden"
            >
              {/* Barra azul que se expande en hover */}
              <span className="absolute left-0 top-0 h-full w-1.5 bg-blue-600 transition-all duration-500 ease-out group-hover:w-full z-0"></span>

              {/* Texto del botón */}
              <span className="relative z-10 inline-flex items-center gap-2 px-8 py-2 text-white font-lato font-bold text-sm md:text-base lg:text-lg transition-colors duration-500 group-hover:text-white whitespace-nowrap">
                Conoce Nuestros Procesos & Tecnologías
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 opacity-0 transition-all duration-300 transform group-hover:opacity-100 group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll flotante */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white font-bebas uppercase text-sm tracking-wider text-center">
          Nuestro Portafolio
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChevronDown className="w-8 h-8 text-blue-400" strokeWidth={3} />
        </motion.div>
      </motion.div>
    </section>
  )
}

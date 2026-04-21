'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export interface FeaturedProjectData {
  name: string
  location?: string | null
  image?: string | null
  stats: { value: string; label: string }[]
  description?: string | null
  eyebrow?: string | null
  ctaText?: string | null
  ctaUrl?: string | null
}

interface FeaturedProjectSectionProps {
  featured: FeaturedProjectData | null
}

export function FeaturedProjectSection({ featured }: FeaturedProjectSectionProps) {
  if (!featured) return null

  const eyebrow = featured.eyebrow || 'Proyecto destacado'
  const ctaText = featured.ctaText || 'Ver todos los proyectos'
  const ctaUrl = featured.ctaUrl || '/proyectos'
  const image = featured.image || '/images/proyectos/puente-destacado.jpg'

  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      aria-label="Proyecto destacado"
    >
      <motion.div
        style={{ y }}
        className="absolute -top-[10%] left-0 w-full h-[120%]"
      >
        <Image
          src={image}
          alt={`${featured.name} — ${featured.location ?? ''}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      <div
        className="relative z-10 h-full flex items-center md:items-end pb-12 md:pb-20 pt-20 md:pt-16 px-4 sm:px-6 lg:px-16 xl:px-24"
      >
        <div className="max-w-4xl w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-red-500 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-3"
          >
            {eyebrow}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase text-white leading-[0.95] mb-2"
          >
            {featured.name}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 font-lato text-base md:text-lg mb-6 md:mb-8"
          >
            {featured.location}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/90 font-lato text-sm md:text-base lg:text-lg max-w-2xl mb-8 md:mb-10 leading-relaxed"
          >
            {featured.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-10 max-w-xl border-t border-white/20 pt-6"
          >
            {featured.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-white font-bebas text-xl md:text-2xl lg:text-3xl uppercase leading-none">
                  {stat.value}
                </div>
                <div className="text-white/60 font-lato text-[10px] md:text-xs uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href={ctaUrl}
              className="group relative inline-block overflow-hidden"
            >
              <span className="absolute left-0 top-0 h-full w-1.5 bg-red-600 transition-all duration-500 ease-out group-hover:w-full z-0" />
              <span className="relative z-10 inline-flex items-center gap-2 px-6 py-2 text-white font-lato font-bold text-sm md:text-base transition-colors duration-500">
                {ctaText}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 opacity-0 transition-all duration-300 transform group-hover:opacity-100 group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

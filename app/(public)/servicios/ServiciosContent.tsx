'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import * as Icons from 'lucide-react'
import { aniosExperiencia } from '@/lib/site-meta'

interface ServicioData {
  id: string
  slug: string
  titulo: string
  subtitulo: string
  descripcion: string
  tecnologias?: { titulo: string; items: string[] }
  normativas?: { titulo: string; items: string[] }
  equipamiento?: { titulo: string; items: string[] }
  equipos?: { titulo: string; items: string[] }
  expertise: { titulo: string; descripcion: string }
  imagen: string
  icono: string
  color: string
  bgGradient: string
}

interface ProcesoStep {
  fase: number
  titulo: string
  descripcion: string
  fortalezas: string[]
  entregables: string
  icono: string
}

interface ServiciosContentProps {
  servicios: ServicioData[]
  procesoIntegral: ProcesoStep[]
}

export default function ServiciosContent({
  servicios,
  procesoIntegral,
}: ServiciosContentProps) {
  const [activeSection, setActiveSection] = useState('')
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})
  const navRef = useRef<HTMLDivElement>(null)

  // Scroll spy para detectar sección activa
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120

      let currentSection = ''
      Object.entries(sectionsRef.current).forEach(([id, element]) => {
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = id
          }
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-scroll del nav al servicio activo
  useEffect(() => {
    if (activeSection && navRef.current) {
      const navContainer = navRef.current.querySelector('nav')
      const activeButton = navRef.current.querySelector(`[data-service-id="${activeSection}"]`) as HTMLElement

      if (activeButton && navContainer) {
        const containerRect = navContainer.getBoundingClientRect()
        const buttonRect = activeButton.getBoundingClientRect()
        const isOutOfView = buttonRect.left < containerRect.left || buttonRect.right > containerRect.right

        if (isOutOfView) {
          const scrollLeft = activeButton.offsetLeft - navContainer.clientWidth / 2 + activeButton.clientWidth / 2
          navContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' })
        }
      }
    }
  }, [activeSection])

  // Detectar si hay contenido scrolleable en la navegación
  useEffect(() => {
    const checkScrollIndicators = () => {
      if (navRef.current) {
        const navContainer = navRef.current.querySelector('nav')
        if (navContainer) {
          setShowLeftArrow(navContainer.scrollLeft > 0)
          setShowRightArrow(navContainer.scrollLeft < navContainer.scrollWidth - navContainer.clientWidth - 1)
        }
      }
    }

    checkScrollIndicators()
    window.addEventListener('resize', checkScrollIndicators)

    const navContainer = navRef.current?.querySelector('nav')
    if (navContainer) {
      navContainer.addEventListener('scroll', checkScrollIndicators, { passive: true })
    }

    return () => {
      window.removeEventListener('resize', checkScrollIndicators)
      if (navContainer) {
        navContainer.removeEventListener('scroll', checkScrollIndicators)
      }
    }
  }, [servicios])

  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId]
    if (element) {
      const navHeight = navRef.current?.offsetHeight || 0
      const elementPosition = element.offsetTop - navHeight - 20
      window.scrollTo({ top: elementPosition, behavior: 'smooth' })
    }
  }

  const scrollNavLeft = () => {
    navRef.current?.querySelector('nav')?.scrollBy({ left: -240, behavior: 'smooth' })
  }

  const scrollNavRight = () => {
    navRef.current?.querySelector('nav')?.scrollBy({ left: 240, behavior: 'smooth' })
  }

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Settings
    return Icon
  }

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero — Full-bleed dark con imagen industrial */}
      <section className="relative h-screen md:h-[85vh] overflow-hidden bg-slate-950">
        <Image
          src="https://storage.googleapis.com/meisa-imagenes/site/hero/estructura-perspectiva.jpg"
          alt="Estructura metálica — Servicios MEISA"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/60" />

        <div className="relative z-10 h-full flex items-end pb-20 md:pb-28 px-4 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <p className="text-white/60 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-5">
                Servicios integrales — {aniosExperiencia()}+ años de experiencia
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white">
                Soluciones
              </h1>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white/50">
                en acero.
              </h2>
              <p className="mt-8 text-base md:text-lg text-white/70 font-lato leading-relaxed max-w-2xl">
                Desde diseño estructural hasta montaje en obra. Un proceso integrado que combina
                expertise técnico, tecnología BIM y control de calidad certificado.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Proceso Integral — Dark brutalist */}
      <section className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="mb-14 md:mb-20 max-w-4xl"
          >
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Metodología
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white">
              Proceso
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              integral.
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Un enfoque sistemático que garantiza resultados excepcionales en cada proyecto,
              desde la conceptualización hasta la entrega final.
            </p>
          </motion.div>

          {/* Grid de 4 fases — sharp, sin rounded */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-white/10">
            {procesoIntegral.map((paso, index) => {
              const StepIcon = getIcon(paso.icono)
              return (
                <motion.div
                  key={paso.fase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative border-b md:border-b-0 md:border-r last:md:border-r-0 border-white/10 p-6 md:p-8"
                >
                  {/* Numeración + ícono */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-bebas text-5xl md:text-6xl leading-none text-white/30">
                      {String(paso.fase).padStart(2, '0')}
                    </span>
                    <StepIcon className="w-7 h-7 text-white/70" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-white mb-3">
                    {paso.titulo}
                  </h3>
                  <p className="text-white/60 font-lato text-sm leading-relaxed mb-5">
                    {paso.descripcion}
                  </p>

                  <ul className="space-y-2 pt-4 border-t border-white/10">
                    {paso.fortalezas.map((fortaleza, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-white/30 mt-1.5">·</span>
                        <span className="text-white/70 font-lato leading-relaxed">{fortaleza}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sticky Nav brutalist — sin blur, sin rounded.
          Desktop: reparte el ancho con flex-1 (todos los servicios caben).
          Mobile: scroll horizontal con flechas si hay overflow. */}
      <div
        ref={navRef}
        className="sticky top-0 z-40 bg-slate-950/95 border-y border-white/10"
      >
        <div className="max-w-7xl mx-auto lg:px-0 relative">
          {/* Flechas de scroll — solo aparecen en mobile si hay overflow */}
          {showLeftArrow && (
            <button
              onClick={scrollNavLeft}
              className="lg:hidden absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-slate-950 border border-white/20 hover:border-white p-2 transition-colors"
              aria-label="Scroll izquierda"
            >
              <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
          )}

          <nav className="flex overflow-x-auto lg:overflow-visible scrollbar-hide scroll-smooth px-10 lg:px-0 lg:justify-stretch">
            {servicios.map((servicio) => {
              const Icon = getIcon(servicio.icono)
              const isActive = activeSection === servicio.id
              return (
                <button
                  key={servicio.id}
                  data-service-id={servicio.id}
                  onClick={() => scrollToSection(servicio.id)}
                  className={`group relative flex items-center justify-center gap-2.5 px-4 py-3.5 whitespace-nowrap transition-colors duration-200 flex-shrink-0 lg:flex-1 lg:min-w-0 border-l first:border-l-0 border-white/10 ${
                    isActive ? 'bg-white text-slate-950' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                  <span className="font-lato font-bold text-[11px] lg:text-xs uppercase tracking-[0.1em] lg:truncate">
                    {servicio.titulo}
                  </span>
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-red-600" />
                  )}
                </button>
              )
            })}
          </nav>

          {showRightArrow && (
            <button
              onClick={scrollNavRight}
              className="lg:hidden absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-slate-950 border border-white/20 hover:border-white p-2 transition-colors"
              aria-label="Scroll derecha"
            >
              <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Secciones de servicios — scroll continuo, todo dark uniforme */}
      {servicios.map((servicio, index) => {
        const Icon = getIcon(servicio.icono)
        const isEven = index % 2 === 0

        return (
          <section
            key={servicio.id}
            id={servicio.id}
            ref={(el) => {
              sectionsRef.current[servicio.id] = el
            }}
            className="relative bg-slate-950 border-b border-white/10 py-20 md:py-28"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                {/* Texto */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-7 ${isEven ? '' : 'lg:order-2'}`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <Icon className="w-5 h-5 text-white/60" strokeWidth={2} />
                    <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em]">
                      {String(index + 1).padStart(2, '0')} — {servicio.subtitulo || 'Servicio especializado'}
                    </p>
                  </div>

                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white mb-6">
                    {servicio.titulo}
                  </h2>

                  <p className="text-white/70 font-lato text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                    {servicio.descripcion}
                  </p>

                  {/* Expertise block — sharp, sin gradient */}
                  {servicio.expertise?.descripcion && (
                    <div className="border-l-2 border-red-600 pl-5 py-2 mb-8">
                      <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                        {servicio.expertise.titulo || 'Nuestra experiencia'}
                      </p>
                      <p className="text-white/80 font-lato text-sm md:text-base leading-relaxed">
                        {servicio.expertise.descripcion}
                      </p>
                    </div>
                  )}

                  {/* Normativas / tecnologías en bullets limpios */}
                  {servicio.normativas && servicio.normativas.items && servicio.normativas.items.length > 0 && (
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                        {servicio.normativas.titulo}
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
                        {servicio.normativas.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-red-600 mt-1.5">·</span>
                            <span className="text-white/70 font-lato leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA hacia detalle */}
                  <div className="mt-8">
                    <Link
                      href={`/servicios/${servicio.slug}`}
                      className="group inline-flex items-center gap-3 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider"
                    >
                      <span className="relative">
                        Explorar servicio completo
                        <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white/40 transition-colors duration-300 group-hover:bg-white" />
                      </span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>

                {/* Imagen */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`lg:col-span-5 ${isEven ? '' : 'lg:order-1'}`}
                >
                  <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
                    <Image
                      src={servicio.imagen}
                      alt={servicio.titulo}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/20" />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA Final — Dark brutalist, rojo único */}
      <section className="relative bg-slate-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mb-12 md:mb-16"
          >
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Trabajemos juntos
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white">
              Tu próximo
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              proyecto.
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Con {aniosExperiencia()}+ años de experiencia y más de 500 proyectos entregados,
              estamos listos para ejecutar tu visión en acero.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            <Link
              href="/contacto"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700"
            >
              Solicitar cotización
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
            >
              Ver proyectos
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

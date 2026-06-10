'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, BookOpen, Shield, BarChart3, GitBranch, Wrench, Cpu } from 'lucide-react'
import * as Icons from 'lucide-react'

interface TecnologiaItem {
  nombre: string
  descripcion?: string
  nivel?: 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto'
}

interface EquipamientoItem {
  nombre: string
  capacidad?: string
  cantidad?: number
}

interface ServicioData {
  id: string
  slug: string
  titulo: string
  subtitulo: string
  descripcion: string
  tecnologias?: TecnologiaItem[]
  equipamiento?: EquipamientoItem[]
  equipos?: string[]
  normativas?: string[]
  expertise: { titulo: string; descripcion: string }
  imagen: string
  icono: string
  color: string
  bgGradient: string
  backgroundImage?: string
  imagenesGaleria?: string[]
  estadisticas?: Array<{ label: string; value: string; icon: string }>
  procesoPasos?: Array<{ title: string; description: string; icon: string }>
}

interface OtroServicio {
  id: string
  slug: string
  titulo: string
  subtitulo: string
  descripcion: string
  imagen: string
  icono: string
  color: string
  bgGradient: string
}

interface ServicioDetailEnhancedProps {
  servicio: ServicioData
  otrosServicios: OtroServicio[]
}

export default function ServicioDetailEnhanced({ servicio, otrosServicios }: ServicioDetailEnhancedProps) {
  const [activeSection, setActiveSection] = useState('overview')
  const [hideNav, setHideNav] = useState(false)

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Settings
    return Icon
  }

  const ServicioIcon = getIcon(servicio.icono)

  // Secciones disponibles dinámicamente
  const sections: Array<{ id: string; label: string; icon: any }> = [
    { id: 'overview', label: 'Descripción', icon: BookOpen },
  ]
  if (servicio.tecnologias && servicio.tecnologias.length > 0) {
    sections.push({ id: 'tecnologia', label: 'Tecnología', icon: Cpu })
  }
  if (servicio.equipamiento && servicio.equipamiento.length > 0) {
    sections.push({ id: 'equipamiento', label: 'Equipamiento', icon: Wrench })
  }
  if (servicio.normativas && servicio.normativas.length > 0) {
    sections.push({ id: 'normativas', label: 'Normativas', icon: Shield })
  }
  if (servicio.estadisticas && servicio.estadisticas.length > 0) {
    sections.push({ id: 'estadisticas', label: 'Cifras', icon: BarChart3 })
  }
  if (servicio.procesoPasos && servicio.procesoPasos.length > 0) {
    sections.push({ id: 'proceso', label: 'Proceso', icon: GitBranch })
  }

  // Scroll spy + ocultar sticky cuando entra al área "related/CTA"
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160
      let current = 'overview'
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el) {
          const { offsetTop, offsetHeight } = el
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            current = s.id
          }
        }
      }
      setActiveSection(current)

      // Ocultar sticky cuando el usuario llega a la zona de "Otros servicios" o CTA final.
      const hideAnchor =
        document.getElementById('related-services') || document.getElementById('cta-final')
      if (hideAnchor) {
        const stickyThreshold = 55
        setHideNav(hideAnchor.getBoundingClientRect().top <= stickyThreshold)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 130
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  // Galería: asegurar 4 imágenes
  const galeria = [
    servicio.imagenesGaleria?.[0] || servicio.imagen,
    servicio.imagenesGaleria?.[1] || servicio.imagen,
    servicio.imagenesGaleria?.[2] || servicio.imagen,
    servicio.imagenesGaleria?.[3] || servicio.imagen,
  ]

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero full-bleed dark */}
      <section className="relative h-screen md:h-[85vh] min-h-[600px] overflow-hidden bg-slate-950">
        <Image
          src={servicio.backgroundImage || servicio.imagen}
          alt={servicio.titulo}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/70" />

        <div className="relative z-10 h-full flex items-end pb-20 md:pb-28 px-4 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl w-full">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <Link
                href="/servicios"
                className="group inline-flex items-center gap-2 text-white/60 font-lato font-bold text-xs uppercase tracking-[0.2em] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Todos los servicios
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <ServicioIcon className="w-5 h-5 text-white/60" strokeWidth={2} />
                <p className="text-white/60 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em]">
                  Servicio especializado MEISA
                </p>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white">
                {servicio.titulo}
              </h1>

              {servicio.subtitulo && (
                <p className="mt-6 text-lg md:text-xl text-white/70 font-lato leading-relaxed max-w-2xl">
                  {servicio.subtitulo}
                </p>
              )}

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link
                  href="/contacto"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700"
                >
                  Iniciar proyecto
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={`https://wa.me/573104327227?text=${encodeURIComponent(`Hola, necesito información sobre ${servicio.titulo}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp directo
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sticky section nav — dark brutalist, sin blur.
          Se oculta con fade cuando el usuario llega a "Otros servicios" + CTA final. */}
      {sections.length > 1 && (
        <div
          className={`sticky top-0 z-40 bg-slate-950/95 border-y border-white/10 transition-opacity duration-300 ${
            hideNav ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="max-w-7xl mx-auto relative">
            <nav className="flex overflow-x-auto lg:overflow-visible scrollbar-hide scroll-smooth px-4 lg:px-0 lg:justify-stretch">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`group relative flex items-center justify-center gap-2.5 px-4 py-3.5 whitespace-nowrap transition-colors duration-200 flex-shrink-0 lg:flex-1 lg:min-w-0 border-l first:border-l-0 border-white/10 ${
                      isActive ? 'bg-white text-slate-950' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                    <span className="font-lato font-bold text-[11px] lg:text-xs uppercase tracking-[0.1em]">
                      {section.label}
                    </span>
                    {isActive && (
                      <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-red-600" />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Overview — descripción + galería + expertise */}
      <section id="overview" className="relative bg-slate-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Descripción general
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white mb-8">
                Qué hacemos
                <span className="block text-white/40">y cómo lo hacemos.</span>
              </h2>

              <p className="text-white/70 font-lato text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
                {servicio.descripcion}
              </p>

              {/* Expertise — barra roja lateral */}
              {servicio.expertise?.descripcion && (
                <div className="border-l-2 border-red-600 pl-5 py-2 mb-10">
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                    {servicio.expertise.titulo || 'Nuestra experiencia'}
                  </p>
                  <p className="text-white/80 font-lato text-sm md:text-base leading-relaxed">
                    {servicio.expertise.descripcion}
                  </p>
                </div>
              )}

              {/* Stats simples inline */}
              <div className="grid grid-cols-2 border-t border-white/10 pt-8">
                <div className="md:pr-6 md:border-r md:border-white/10">
                  <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none text-white">
                    25
                    <span className="text-white/40">+</span>
                  </div>
                  <p className="mt-2 text-white/50 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                    Años de experiencia
                  </p>
                </div>
                <div className="md:pl-6">
                  <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none text-white">
                    500
                    <span className="text-white/40">+</span>
                  </div>
                  <p className="mt-2 text-white/50 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                    Proyectos entregados
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Galería 2x2 sharp */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="grid grid-cols-2 gap-px bg-white/10">
                {galeria.map((src, idx) => (
                  <div key={idx} className="relative aspect-[4/5] overflow-hidden bg-slate-950">
                    <Image
                      src={src}
                      alt={`${servicio.titulo} — imagen ${idx + 1}`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 21vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tecnología */}
      {servicio.tecnologias && servicio.tecnologias.length > 0 && (
        <section id="tecnologia" className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="mb-14 max-w-3xl"
            >
              <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Tecnología
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                Herramientas
                <span className="block text-white/40">de vanguardia.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-white/10">
              {servicio.tecnologias.map((tech, idx) => {
                const nombre = typeof tech === 'string' ? tech : (tech?.nombre || 'Tecnología')
                const descripcion = typeof tech === 'string' ? '' : tech.descripcion
                const nivel = typeof tech === 'string' ? null : tech.nivel
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="border-b lg:border-r border-white/10 p-6 md:p-8 lg:[&:nth-child(3n)]:border-r-0"
                  >
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="font-bebas text-4xl md:text-5xl leading-none text-white/30">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {nivel && (
                        <span className="border border-white/20 text-white/60 font-lato font-bold text-[9px] uppercase tracking-[0.15em] px-2 py-0.5">
                          {nivel}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-white mb-3">
                      {nombre}
                    </h3>
                    {descripcion && (
                      <p className="text-white/60 font-lato text-sm leading-relaxed">
                        {descripcion}
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Equipamiento */}
      {servicio.equipamiento && servicio.equipamiento.length > 0 && (
        <section id="equipamiento" className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="mb-14 max-w-3xl"
            >
              <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Equipamiento
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                Maquinaria
                <span className="block text-white/40">especializada.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-white/10">
              {servicio.equipamiento.map((equipo, idx) => {
                const nombre = typeof equipo === 'string' ? equipo : (equipo?.nombre || 'Equipo')
                const capacidad = typeof equipo === 'string' ? null : equipo.capacidad
                const cantidad = typeof equipo === 'string' ? null : equipo.cantidad
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="border-b lg:border-r border-white/10 p-6 md:p-8 lg:[&:nth-child(3n)]:border-r-0"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Wrench className="w-5 h-5 text-white/60" strokeWidth={2} />
                      <span className="font-bebas text-3xl md:text-4xl leading-none text-white/30">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-white mb-4">
                      {nombre}
                    </h3>
                    <div className="space-y-1.5 text-sm">
                      {capacidad && (
                        <p className="text-white/70 font-lato">
                          <span className="text-white/40">Capacidad: </span>
                          {capacidad}
                        </p>
                      )}
                      {cantidad && (
                        <p className="text-white/70 font-lato">
                          <span className="text-white/40">Cantidad: </span>
                          {cantidad} unidad{cantidad > 1 ? 'es' : ''}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Normativas */}
      {servicio.normativas && servicio.normativas.length > 0 && (
        <section id="normativas" className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5"
              >
                <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                  Normativas
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                  Estándares
                </h2>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white/40">
                  certificados.
                </h3>
                <p className="mt-6 text-white/60 font-lato text-base md:text-lg leading-relaxed">
                  Cumplimos todas las normativas nacionales e internacionales aplicables.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-7"
              >
                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {servicio.normativas.map((n, idx) => (
                    <li key={idx} className="flex items-start gap-4 py-4">
                      <span className="font-bebas text-2xl leading-none text-white/30 flex-shrink-0 pt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <Shield className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" strokeWidth={2} />
                      <span className="text-white/80 font-lato text-sm md:text-base leading-relaxed">
                        {n}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Estadísticas */}
      {servicio.estadisticas && servicio.estadisticas.length > 0 && (
        <section id="estadisticas" className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="mb-14 max-w-3xl"
            >
              <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Cifras
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                Respaldan
                <span className="block text-white/40">la experiencia.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-white/10 md:divide-x md:divide-white/10">
              {servicio.estadisticas.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="p-6 md:p-8 border-b md:border-b-0 border-white/10"
                >
                  <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none text-white mb-2">
                    {stat.value}
                  </div>
                  <p className="text-white/50 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Proceso */}
      {servicio.procesoPasos && servicio.procesoPasos.length > 0 && (
        <section id="proceso" className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="mb-14 max-w-3xl"
            >
              <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Metodología
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                Paso a paso.
              </h2>
            </motion.div>

            <ul className="divide-y divide-white/10 border-y border-white/10">
              {servicio.procesoPasos.map((paso, idx) => {
                const StepIcon = getIcon(paso.icon)
                return (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-10 md:py-12"
                  >
                    <div className="md:col-span-2 flex items-start gap-3">
                      <span className="font-bebas text-6xl md:text-7xl leading-none text-white/20">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="md:col-span-4 flex items-start">
                      <div className="flex items-center gap-3">
                        <StepIcon className="w-6 h-6 text-white/70 flex-shrink-0" strokeWidth={1.5} />
                        <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-white">
                          {paso.title}
                        </h3>
                      </div>
                    </div>
                    <div className="md:col-span-6">
                      <p className="text-white/70 font-lato text-sm md:text-base leading-relaxed">
                        {paso.description}
                      </p>
                    </div>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Otros servicios */}
      {otrosServicios.length > 0 && (
        <section id="related-services" className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="mb-14 max-w-3xl"
            >
              <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Otros servicios
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                Soluciones
                <span className="block text-white/40">integrales.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
              {otrosServicios.map((otro, idx) => {
                const OtroIcon = getIcon(otro.icono)
                return (
                  <motion.div
                    key={otro.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                  >
                    <Link
                      href={`/servicios/${otro.slug}`}
                      className="group relative block bg-slate-950 hover:bg-slate-900 transition-colors p-6 md:p-8 h-full"
                    >
                      {/* Imagen */}
                      <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-slate-900">
                        <Image
                          src={otro.imagen}
                          alt={otro.titulo}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-slate-950/20" />
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <OtroIcon className="w-4 h-4 text-white/60" strokeWidth={2} />
                        <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em]">
                          Servicio
                        </p>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-white mb-3">
                        {otro.titulo}
                      </h3>

                      <p className="text-white/60 font-lato text-sm leading-relaxed mb-6 line-clamp-3">
                        {otro.descripcion}
                      </p>

                      <div className="inline-flex items-center gap-2 text-white font-lato font-bold text-xs uppercase tracking-[0.15em]">
                        <span>Ver detalles</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section id="cta-final" className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mb-12"
          >
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Siguiente paso
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white">
              Trabajemos
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              juntos.
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Contáctanos para una solución personalizada a tu medida.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
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
          </div>
        </div>
      </section>
    </div>
  )
}

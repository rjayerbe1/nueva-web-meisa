'use client'

// Sección "Soluciones" de la home — enlaza in-body el clúster SEO desde la
// página de mayor autoridad del sitio. Tipográfica pura (sin fotos ni video:
// el grid de categorías de proyectos ya carga la parte visual de la home).
// El remate es el enlace contextual al PILAR con anchor de keyword.
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const SOLUCIONES = [
  {
    href: '/soluciones/edificios-en-estructura-metalica',
    titulo: 'Edificios en estructura metálica',
    descripcion: 'Pórticos y entrepisos en acero para vivienda y oficinas.',
  },
  {
    href: '/soluciones/puentes-metalicos',
    titulo: 'Puentes metálicos',
    descripcion: 'Vehiculares y peatonales: vigas, cerchas y sistemas mixtos.',
  },
  {
    href: '/soluciones/estructura-metalica-para-bodegas',
    titulo: 'Bodegas y naves industriales',
    descripcion: 'Naves de gran luz con cubierta y fachada metálica.',
  },
  {
    href: '/soluciones/estructura-metalica-centros-comerciales',
    titulo: 'Centros comerciales',
    descripcion: 'Grandes luces y plazos de obra cortos para retail.',
  },
  {
    href: '/soluciones/estructura-metalica-escenarios-deportivos',
    titulo: 'Escenarios deportivos',
    descripcion: 'Coliseos y estadios con cubiertas de gran luz.',
  },
  {
    href: '/soluciones/cubiertas-metalicas',
    titulo: 'Cubiertas y fachadas',
    descripcion: 'Sistemas de cerramiento en lámina y estructura.',
  },
]

export function SolucionesSeoSection() {
  return (
    <section className="relative bg-slate-950 text-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-4xl"
        >
          <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
            Qué construimos
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
            Soluciones en
          </h2>
          <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
            estructura metálica
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10">
          {SOLUCIONES.map((sol, i) => (
            <motion.div
              key={sol.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <Link
                href={sol.href}
                className="group block h-full p-8 md:p-10 border-b border-r border-white/10 transition-colors duration-300 hover:bg-white/5"
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-white/20 font-bebas text-4xl md:text-5xl leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-white">
                    {sol.titulo}
                  </h3>
                </div>
                <p className="text-white/60 font-lato text-sm md:text-base leading-relaxed mb-5">
                  {sol.descripcion}
                </p>
                <span className="inline-flex items-center gap-2 text-white/70 group-hover:text-white font-lato font-bold text-xs uppercase tracking-wider transition-colors duration-300">
                  Ver solución
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Enlace contextual al pilar del clúster (anchor de keyword) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mt-10 md:mt-12"
        >
          <Link
            href="/estructuras-metalicas-colombia"
            className="group inline-flex items-center gap-3 text-white font-lato font-bold text-base md:text-lg"
          >
            <span className="relative">
              Estructuras metálicas en Colombia — capacidad nacional
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white/40 transition-colors duration-300 group-hover:bg-white" />
            </span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { PlantaPublica } from '@/lib/content/plantas'
import type { EmpresaData } from '@/lib/content/empresa'

import { CreemosSection } from '@/components/sections/empresa/CreemosSection'
import { QuienesSomosSection } from '@/components/sections/empresa/QuienesSomosSection'
import { InstalacionesSection } from '@/components/sections/empresa/InstalacionesSection'
import { CompromisoSection } from '@/components/sections/empresa/CompromisoSection'
import { GobiernoCorporativoSection } from '@/components/sections/empresa/GobiernoCorporativoSection'

interface EmpresaContentProps {
  plantas: PlantaPublica[]
  empresa: EmpresaData
}

export default function EmpresaContent({ plantas, empresa }: EmpresaContentProps) {
  const foundingYear = empresa.config?.fundacion ?? 1996
  const yearsExperience = new Date().getFullYear() - foundingYear

  return (
    <main className="min-h-screen bg-white">
      <QuienesSomosSection
        config={empresa.config}
        valores={empresa.valores}
        hitos={empresa.hitos}
      />

      <CreemosSection config={empresa.config} />

      <InstalacionesSection plantas={plantas} />

      <CompromisoSection
        config={empresa.config}
        certificaciones={empresa.certificaciones}
        normas={empresa.normas}
      />

      <GobiernoCorporativoSection items={empresa.gobierno} />

      {/* CTA Final — brutalist dark */}
      <section id="contacto" className="relative bg-slate-950 text-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mb-12 md:mb-16"
          >
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Construyamos juntos
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
              ¿Listo para
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              construir el futuro?
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Con más de {yearsExperience} años de experiencia, MEISA es tu aliado estratégico para proyectos de estructuras metálicas en Colombia.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-16 md:mb-20"
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
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
            >
              Ver proyectos
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border-t border-white/10 pt-10 md:pt-12 grid grid-cols-3 gap-6 md:divide-x md:divide-white/10"
          >
            <div className="md:pr-6">
              <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none">
                {yearsExperience}
                <span className="text-white/40">+</span>
              </div>
              <p className="mt-2 text-white/50 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                Años de experiencia
              </p>
            </div>
            <div className="md:px-6">
              <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none">
                500<span className="text-white/40">+</span>
              </div>
              <p className="mt-2 text-white/50 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                Proyectos completados
              </p>
            </div>
            <div className="md:pl-6">
              <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none">
                {plantas.length}
              </div>
              <p className="mt-2 text-white/50 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                Plantas en Colombia
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

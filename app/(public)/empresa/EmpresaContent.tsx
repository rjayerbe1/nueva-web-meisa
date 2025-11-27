'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

// Nuevas secciones de empresa
import { EmpresaHeroSection } from '@/components/sections/empresa/EmpresaHeroSection'
import { CreemosSection } from '@/components/sections/empresa/CreemosSection'
import { QuienesSomosSection } from '@/components/sections/empresa/QuienesSomosSection'
import { InstalacionesSection } from '@/components/sections/empresa/InstalacionesSection'
import { CompromisoSection } from '@/components/sections/empresa/CompromisoSection'
import { EmpresaNavigation } from '@/components/empresa/EmpresaNavigation'

interface EmpresaContentProps {
  paginaData?: any
}

export default function EmpresaContent({ paginaData }: EmpresaContentProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Cinematográfico */}
      <EmpresaHeroSection />

      {/* 2. Sección "Creemos" + Cita del Liderazgo */}
      <CreemosSection />

      {/* Navegación Sticky */}
      <EmpresaNavigation />

      {/* 3. Quiénes Somos (Historia + Misión/Visión + Valores) */}
      <QuienesSomosSection />

      {/* 4. Instalaciones + Capacidades (con estadísticas) */}
      <InstalacionesSection />

      {/* 5. Nuestro Compromiso (Seguridad + Sostenibilidad + Certificaciones) */}
      <CompromisoSection />

      {/* 6. CTA Final */}
      <section id="contacto" className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-white rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para Construir el Futuro?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Con más de {siteConfig.empresa.aniosExperiencia} años de experiencia, MEISA es tu aliado
              estratégico para proyectos de estructuras metálicas en Colombia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Solicitar Cotización
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Ver Proyectos
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-2xl font-bold text-white">{siteConfig.empresa.aniosExperiencia}+</span>
                <span className="text-sm">Años de<br />Experiencia</span>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-2xl font-bold text-white">500+</span>
                <span className="text-sm">Proyectos<br />Completados</span>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-2xl font-bold text-white">3</span>
                <span className="text-sm">Plantas en<br />Colombia</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

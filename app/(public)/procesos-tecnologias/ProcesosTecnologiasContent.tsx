'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type {
  GrupoSeccionItem,
  TecnologiaItem,
  EquipoItem,
  ProcesoDigitalItem,
} from '@/lib/content/tecnologia-politicas'

const SOFTWARE_LABELS: Record<string, string> = {
  'bim-diseno': 'BIM / Diseño',
  'analisis-estructural': 'Análisis estructural',
  'conexiones': 'Conexiones',
  'otro': 'Otros',
}

interface Props {
  grupos: GrupoSeccionItem[]
  tecnologias: TecnologiaItem[]
  equipos: EquipoItem[]
  procesos: ProcesoDigitalItem[]
}

export function ProcesosTecnologiasContent({
  grupos,
  tecnologias,
  equipos,
  procesos,
}: Props) {
  const grupoDiseno = grupos.find((g) => g.clave === 'diseno-analisis')
  const grupoFabMontaje = grupos.find((g) => g.clave === 'fabricacion-montaje')
  const grupoControlDigital = grupos.find((g) => g.clave === 'control-digital')

  return (
    <main className="bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative border-b border-white/10 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Procesos & Tecnologías
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95]">
              Tecnología
            </h1>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white/40">
              estructural
            </h2>
            <p className="mt-8 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Modelado BIM, análisis avanzado, maquinaria industrial y trazabilidad digital — la infraestructura tecnológica detrás de cada proyecto MEISA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Software (Diseño y Análisis) */}
      {grupoDiseno && tecnologias.length > 0 && (
        <Section grupo={grupoDiseno}>
          <div className="space-y-16 md:space-y-20">
            {Object.entries(SOFTWARE_LABELS).map(([categoria, label]) => {
              const items = tecnologias.filter((t) => t.categoria === categoria)
              if (items.length === 0) return null
              return (
                <div key={categoria}>
                  <p className="text-white/40 font-lato font-bold text-xs uppercase tracking-[0.2em] mb-6">
                    {label}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
                    {items.map((tech, i) => (
                      <motion.div
                        key={tech.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="bg-slate-950 p-6 md:p-8 hover:bg-slate-900 transition-colors duration-300"
                      >
                        <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] mb-3">
                          {tech.nombre}
                        </h3>
                        {tech.especialidad && (
                          <p className="text-white/60 font-lato text-sm md:text-base leading-relaxed">
                            {tech.especialidad}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* Equipos (Fabricación y Montaje) */}
      {grupoFabMontaje && equipos.length > 0 && (
        <Section grupo={grupoFabMontaje}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {equipos.map((equipo, i) => (
              <motion.div
                key={equipo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-slate-950 p-8 md:p-10"
              >
                <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                  {equipo.categoria}
                </p>
                <h3 className="text-3xl md:text-4xl font-bebas uppercase leading-[0.95] mb-4">
                  {equipo.nombre}
                </h3>
                {equipo.descripcion && (
                  <p className="text-white/60 font-lato text-sm md:text-base mb-6 leading-relaxed">
                    {equipo.descripcion}
                  </p>
                )}
                {equipo.specs.length > 0 && (
                  <ul className="space-y-2.5 pt-5 border-t border-white/10">
                    {equipo.specs.map((spec, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-white/70 font-lato text-sm md:text-base"
                      >
                        <span className="mt-2.5 w-1.5 h-1.5 bg-white/30 shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Procesos Digitales (Control Digital) */}
      {grupoControlDigital && procesos.length > 0 && (
        <Section grupo={grupoControlDigital}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {procesos.map((proc, i) => (
              <motion.div
                key={proc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-950 p-8 md:p-10"
              >
                <h3 className="text-3xl md:text-4xl font-bebas uppercase leading-[0.95] mb-4">
                  {proc.nombre}
                </h3>
                {proc.descripcion && (
                  <p className="text-white/60 font-lato text-sm md:text-base mb-6 leading-relaxed">
                    {proc.descripcion}
                  </p>
                )}
                {proc.beneficios.length > 0 && (
                  <ul className="space-y-2.5 pt-5 border-t border-white/10">
                    {proc.beneficios.map((b, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-white/70 font-lato text-sm md:text-base"
                      >
                        <span className="mt-2.5 w-1.5 h-1.5 bg-white/30 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* CTA final */}
      <section className="border-t border-white/10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Ponemos la tecnología a su servicio
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] mb-10">
              ¿Tu proyecto
              <br />
              <span className="text-white/40">necesita ingeniería?</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700"
              >
                Solicitar cotización
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/proyectos"
                className="group inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
              >
                Ver proyectos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

/* ------------------------------------------------------------------ */
/*  Section wrapper — encabezado + contenido                          */
/* ------------------------------------------------------------------ */

function Section({
  grupo,
  children,
}: {
  grupo: GrupoSeccionItem
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-4xl"
        >
          {grupo.subtitulo && (
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              {grupo.subtitulo}
            </p>
          )}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
            {grupo.titulo}
          </h2>
          {grupo.descripcion && (
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              {grupo.descripcion}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  )
}

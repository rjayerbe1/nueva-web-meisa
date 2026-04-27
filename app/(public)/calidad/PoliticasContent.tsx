'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'
import type {
  GrupoSeccionItem,
  PilarSIGItem,
  PoliticaItem,
  EtapaControlCalidadItem,
} from '@/lib/content/tecnologia-politicas'
import type { NormaItem, CertificacionItem } from '@/lib/content/empresa'

interface Props {
  grupos: GrupoSeccionItem[]
  pilares: PilarSIGItem[]
  politicas: PoliticaItem[]
  normas: NormaItem[]
  etapasControl: EtapaControlCalidadItem[]
  certificaciones: CertificacionItem[]
}

export function PoliticasContent({
  grupos,
  pilares,
  politicas,
  normas,
  etapasControl,
  certificaciones,
}: Props) {
  const grupoHero = grupos.find((g) => g.clave === 'hero')
  const grupoSIG = grupos.find((g) => g.clave === 'sig')
  const grupoPoliticas = grupos.find((g) => g.clave === 'politicas')
  const grupoCumplimiento = grupos.find((g) => g.clave === 'cumplimiento')
  const grupoControl = grupos.find((g) => g.clave === 'control-calidad')

  // Hero: lee del grupo "hero" si existe, con fallback razonable.
  const heroEyebrow = grupoHero?.subtitulo ?? 'Sistema de Gestión'
  const heroTituloRaw = grupoHero?.titulo ?? 'Calidad\nsin concesiones'
  const [heroLinea1, heroLinea2] = heroTituloRaw.split(/\n+/)
  const heroDescripcion =
    grupoHero?.descripcion ??
    'Sistema Integrado de Gestión, políticas corporativas y cumplimiento normativo — el marco que rige cada proyecto de MEISA.'
  const heroImagen =
    grupoHero?.imagenFondo ??
    'https://storage.googleapis.com/meisa-imagenes/site/hero/hero-construccion-industrial.jpg'

  return (
    <main className="bg-stone-50 text-slate-950">
      {/* Hero full-bleed oscuro con imagen */}
      <section className="relative h-screen md:h-[88vh] overflow-hidden bg-slate-950">
        <Image
          src={heroImagen}
          alt={`${heroLinea1 ?? 'Calidad'} — MEISA`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-950/60" />
        <div className="relative z-10 h-full flex items-end pb-16 md:pb-24 px-4 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <p className="text-white/60 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                {heroEyebrow}
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white">
                {heroLinea1}
              </h1>
              {heroLinea2 && (
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white/50">
                  {heroLinea2}
                </h2>
              )}
              <p className="mt-8 text-white/80 font-lato text-base md:text-lg max-w-2xl leading-relaxed text-pretty hyphens-auto" lang="es">
                {heroDescripcion}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pilares SIG */}
      {grupoSIG && pilares.length > 0 && (
        <Section grupo={grupoSIG}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
            {pilares.map((pilar, i) => (
              <motion.div
                key={pilar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-stone-50 p-8 md:p-10"
              >
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-slate-300 font-bebas text-4xl md:text-5xl leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95]">
                    {pilar.titulo}
                  </h3>
                </div>
                {pilar.descripcion && (
                  <p className="text-slate-700 font-lato text-sm md:text-base leading-relaxed">
                    {pilar.descripcion}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Image break 1 — entre SIG y Políticas (imagen del grupo "politicas") */}
      {grupoPoliticas?.imagenFondo && (
        <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
          <Image
            src={grupoPoliticas.imagenFondo}
            alt={grupoPoliticas.titulo}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50/30 to-transparent" />
        </div>
      )}

      {/* Políticas corporativas — formato documento oficial */}
      {grupoPoliticas && politicas.length > 0 && (
        <Section grupo={grupoPoliticas}>
          <div className="space-y-px bg-slate-200 border border-slate-200">
            {politicas.map((pol, i) => (
              <motion.article
                key={pol.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-stone-50 p-8 md:p-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12">
                  <div>
                    <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                      Política {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] mb-4">
                      {pol.titulo}
                    </h3>
                    {pol.descripcion && (
                      <p className="text-slate-700 font-lato text-sm md:text-base leading-relaxed">
                        {pol.descripcion}
                      </p>
                    )}
                    {pol.documentoUrl && (
                      <a
                        href={pol.documentoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 mt-5 text-slate-700 font-lato text-sm transition-colors hover:text-slate-950"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="relative">
                          Ver documento
                          <span className="absolute left-0 -bottom-0.5 h-px w-full bg-slate-300 transition-colors duration-300 group-hover:bg-slate-950" />
                        </span>
                      </a>
                    )}
                  </div>
                  {pol.compromisos.length > 0 && (
                    <div>
                      <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                        Compromisos
                      </p>
                      <ul className="space-y-3">
                        {pol.compromisos.map((c, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-slate-800 font-lato text-sm md:text-base leading-relaxed"
                          >
                            <span className="mt-2 w-1.5 h-1.5 bg-slate-400 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </Section>
      )}

      {/* Cumplimiento normativo */}
      {grupoCumplimiento && (normas.length > 0 || certificaciones.length > 0) && (
        <Section grupo={grupoCumplimiento}>
          {certificaciones.length > 0 && (
            <div className="mb-12">
              <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                Certificaciones
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
                {certificaciones.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-stone-50 p-6 md:p-8 flex flex-col gap-4 min-h-[180px]"
                  >
                    {cert.logo && (
                      <div className="relative h-12 w-full">
                        <Image
                          src={cert.logo}
                          alt={cert.nombreCompleto ?? cert.nombre}
                          fill
                          sizes="(min-width: 768px) 25vw, 50vw"
                          className="object-contain object-left"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-2xl md:text-3xl font-bebas uppercase leading-none">
                        {cert.nombre}
                      </h4>
                      {cert.emisor && (
                        <p className="mt-1 text-slate-500 font-lato text-[11px] uppercase tracking-wider">
                          {cert.emisor}
                        </p>
                      )}
                      {cert.descripcion && (
                        <p
                          className="mt-3 text-slate-700 font-lato text-xs md:text-sm leading-relaxed text-pretty hyphens-auto"
                          lang="es"
                        >
                          {cert.descripcion}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {normas.length > 0 && certificaciones.length > 0 && (
            <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
              Normas técnicas
            </p>
          )}
          {normas.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
            {normas.map((norma, i) => (
              <motion.div
                key={norma.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-stone-50 p-6 md:p-8 flex flex-col justify-between min-h-[180px]"
              >
                <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em]">
                  Norma
                </p>
                <div>
                  <h4 className="text-3xl md:text-4xl font-bebas uppercase leading-none mb-2">
                    {norma.codigo}
                  </h4>
                  <p className="text-slate-700 font-lato text-xs md:text-sm leading-relaxed">
                    {norma.descripcion}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </Section>
      )}

      {/* Image break 2 — entre Normas y Control (imagen del grupo "control-calidad") */}
      {grupoControl?.imagenFondo && (
        <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
          <Image
            src={grupoControl.imagenFondo}
            alt={grupoControl.titulo}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50/30 to-transparent" />
        </div>
      )}

      {/* Control de calidad (informativo) */}
      {grupoControl && etapasControl.length > 0 && (
        <Section grupo={grupoControl}>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              etapasControl.length === 1
                ? 'md:grid-cols-1'
                : etapasControl.length === 2
                  ? 'md:grid-cols-2'
                  : etapasControl.length === 3
                    ? 'md:grid-cols-3'
                    : 'md:grid-cols-4'
            } gap-px bg-slate-200 border border-slate-200`}
          >
            {etapasControl.map((etapa, i) => (
              <motion.div
                key={etapa.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-stone-50 p-8"
              >
                <span className="text-slate-300 font-bebas text-5xl md:text-6xl leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="mt-4 text-xl md:text-2xl font-bebas uppercase leading-[0.95]">
                  {etapa.titulo}
                </h4>
                {etapa.descripcion && (
                  <p
                    className="mt-3 text-slate-700 font-lato text-sm leading-relaxed text-pretty hyphens-auto"
                    lang="es"
                  >
                    {etapa.descripcion}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* CTA final */}
      <section className="border-t border-slate-200 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              La calidad no es negociable
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] mb-10">
              Hablemos
              <br />
              <span className="text-slate-300">de su proyecto.</span>
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
                href="/empresa"
                className="group inline-flex items-center gap-3 px-8 py-4 border border-slate-950/30 text-slate-950 font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                Conocer MEISA
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

/* ------------------------------------------------------------------ */

function Section({
  grupo,
  children,
}: {
  grupo: GrupoSeccionItem
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-slate-200 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-4xl"
        >
          {grupo.subtitulo && (
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              {grupo.subtitulo}
            </p>
          )}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
            {grupo.titulo}
          </h2>
          {grupo.descripcion && (
            <p className="mt-6 text-slate-700 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              {grupo.descripcion}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  )
}

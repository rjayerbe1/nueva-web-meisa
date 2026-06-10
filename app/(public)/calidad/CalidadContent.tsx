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
  ProcesoDigitalItem,
} from '@/lib/content/tecnologia-politicas'
import type { NormaItem, CertificacionItem } from '@/lib/content/empresa'

interface Props {
  grupos: GrupoSeccionItem[]
  pilares: PilarSIGItem[]
  politicas: PoliticaItem[]
  normas: NormaItem[]
  etapasControl: EtapaControlCalidadItem[]
  certificaciones: CertificacionItem[]
  procesos: ProcesoDigitalItem[]
}

export function CalidadContent({
  grupos,
  pilares,
  politicas,
  normas,
  etapasControl,
  certificaciones,
  procesos,
}: Props) {
  const grupoHero = grupos.find((g) => g.clave === 'hero')
  const grupoIntro = grupos.find((g) => g.clave === 'intro')
  const grupoSIG = grupos.find((g) => g.clave === 'sig')
  const grupoControl = grupos.find((g) => g.clave === 'control-calidad')
  const grupoTrazabilidad = grupos.find((g) => g.clave === 'trazabilidad')
  const grupoCumplimiento = grupos.find((g) => g.clave === 'cumplimiento')
  const grupoPoliticas = grupos.find((g) => g.clave === 'politicas')

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

  const [introLinea1, introLinea2] = (grupoIntro?.titulo ?? '').split(/\n+/)

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

      {/* Intro editorial — Patrón A: título 5/12 + lead 7/12 */}
      {grupoIntro && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5"
              >
                {grupoIntro.subtitulo && (
                  <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                    {grupoIntro.subtitulo}
                  </p>
                )}
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                  {introLinea1}
                </h2>
                {introLinea2 && (
                  <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                    {introLinea2}
                  </h3>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-7 lg:pt-6"
              >
                <p
                  className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                  lang="es"
                >
                  {grupoIntro.descripcion}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

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

      {/* Image break — antes de Control de calidad */}
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

      {/* Control de calidad — 7 etapas como bloques editoriales numerados */}
      {grupoControl && etapasControl.length > 0 && (
        <Section grupo={grupoControl}>
          <div className="space-y-px bg-slate-200 border border-slate-200">
            {etapasControl.map((etapa, i) => (
              <motion.article
                key={etapa.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="bg-stone-50 p-8 md:p-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                  <div className="md:col-span-2">
                    <span className="font-bebas text-7xl md:text-8xl text-slate-200 leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="md:col-span-10">
                    <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] mb-4">
                      {etapa.titulo}
                    </h3>
                    {etapa.descripcion && (
                      <p
                        className="text-slate-700 font-lato text-sm md:text-base leading-relaxed max-w-3xl text-pretty hyphens-auto"
                        lang="es"
                      >
                        {etapa.descripcion}
                      </p>
                    )}
                    {etapa.puntos.length > 0 && (
                      <ul className="mt-6 md:grid md:grid-cols-2 gap-x-10 gap-y-3 space-y-3 md:space-y-0">
                        {etapa.puntos.map((punto, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-slate-800 font-lato text-sm md:text-base leading-relaxed"
                          >
                            <span className="mt-2 w-1.5 h-1.5 bg-slate-400 shrink-0" />
                            <span>{punto}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </Section>
      )}

      {/* Image break — antes de Trazabilidad digital */}
      {grupoTrazabilidad?.imagenFondo && (
        <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
          <Image
            src={grupoTrazabilidad.imagenFondo}
            alt={grupoTrazabilidad.titulo}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50/30 to-transparent" />
        </div>
      )}

      {/* Trazabilidad digital — sistema QC propio */}
      {grupoTrazabilidad && procesos.length > 0 && (
        <Section grupo={grupoTrazabilidad}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {procesos.map((proc, i) => (
              <motion.div
                key={proc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-stone-50 flex flex-col"
              >
                {proc.imagen && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                      src={proc.imagen}
                      alt={proc.nombre}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-8 flex-1">
                  <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] mb-4">
                    {proc.nombre}
                  </h3>
                  {proc.descripcion && (
                    <p
                      className="text-slate-700 font-lato text-sm md:text-base mb-6 leading-relaxed text-pretty hyphens-auto"
                      lang="es"
                    >
                      {proc.descripcion}
                    </p>
                  )}
                  {proc.beneficios.length > 0 && (
                    <ul className="space-y-2.5 pt-5 border-t border-slate-200">
                      {proc.beneficios.map((b, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-slate-800 font-lato text-sm leading-relaxed"
                        >
                          <span className="mt-2 w-1.5 h-1.5 bg-slate-400 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Cumplimiento normativo — certificación RUC + normas de referencia */}
      {grupoCumplimiento && (normas.length > 0 || certificaciones.length > 0) && (
        <Section grupo={grupoCumplimiento}>
          {certificaciones.length > 0 && (
            <div className="mb-12">
              <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                Certificación
              </p>
              <div className="space-y-px">
                {certificaciones.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-stone-50 border border-slate-200 p-8 md:p-12"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12">
                      <div>
                        {cert.logo && (
                          <div className="relative h-16 w-40 mb-6">
                            <Image
                              src={cert.logo}
                              alt={cert.nombreCompleto ?? cert.nombre}
                              fill
                              sizes="160px"
                              className="object-contain object-left"
                            />
                          </div>
                        )}
                        <h4 className="text-4xl md:text-5xl font-bebas uppercase leading-none">
                          {cert.nombre}
                        </h4>
                        {cert.nombreCompleto && (
                          <p className="mt-2 text-slate-700 font-lato text-sm md:text-base">
                            {cert.nombreCompleto}
                          </p>
                        )}
                        {cert.emisor && (
                          <p className="mt-3 text-slate-500 font-lato text-[11px] uppercase tracking-wider">
                            {cert.emisor}
                          </p>
                        )}
                        {cert.descripcion && (
                          <p
                            className="mt-5 text-slate-700 font-lato text-sm md:text-base leading-relaxed text-pretty hyphens-auto"
                            lang="es"
                          >
                            {cert.descripcion}
                          </p>
                        )}
                        {cert.importancia && (
                          <p className="mt-4 text-slate-500 font-lato text-xs md:text-sm leading-relaxed italic">
                            {cert.importancia}
                          </p>
                        )}
                      </div>
                      {cert.beneficios.length > 0 && (
                        <div>
                          <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                            Alcance
                          </p>
                          <ul className="space-y-3">
                            {cert.beneficios.map((b, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-slate-800 font-lato text-sm md:text-base leading-relaxed"
                              >
                                <span className="mt-2 w-1.5 h-1.5 bg-slate-400 shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {normas.length > 0 && certificaciones.length > 0 && (
            <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
              Normas de referencia
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
                className="bg-stone-50 p-6 md:p-8 min-h-[180px]"
              >
                <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                  {norma.categoria ?? 'Norma'}
                </p>
                <h4 className="text-3xl md:text-4xl font-bebas uppercase leading-none mb-2">
                  {norma.codigo}
                </h4>
                <p className="text-slate-700 font-lato text-xs md:text-sm leading-relaxed">
                  {norma.descripcion}
                </p>
              </motion.div>
            ))}
          </div>
          )}
        </Section>
      )}

      {/* Image break — antes de Políticas */}
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

      {/* CTA final — Patrón E: bloque dark con stats strip */}
      <section className="relative bg-slate-950 text-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-12 md:mb-16"
          >
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              La calidad no es negociable
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
              Hablemos
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              de su proyecto.
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
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
              href="/empresa"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
            >
              Conocer MEISA
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="border-t border-white/10 pt-10 md:pt-12 grid grid-cols-3 gap-6 md:divide-x md:divide-white/10"
          >
            <div>
              <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none">
                30<span className="text-white/40">+</span>
              </div>
              <p className="mt-2 text-white/50 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                Años de experiencia
              </p>
            </div>
            <div className="md:pl-6">
              <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none">3</div>
              <p className="mt-2 text-white/50 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                Plantas de producción
              </p>
            </div>
            <div className="md:pl-6">
              <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none">
                100<span className="text-white/40">%</span>
              </div>
              <p className="mt-2 text-white/50 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                Piezas con trazabilidad QR
              </p>
            </div>
          </motion.div>
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
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] whitespace-pre-line">
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

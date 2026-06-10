'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { TecnologiaTabsNav } from '@/components/sections/tecnologia/TecnologiaTabsNav'
import type {
  GrupoSeccionItem,
  TecnologiaItem,
  EquipoItem,
  ProcesoDigitalItem,
  FaseFlujoTecnologiaItem,
} from '@/lib/content/tecnologia-politicas'

const SOFTWARE_LABELS: Record<string, string> = {
  'bim-diseno': 'BIM / Diseño',
  'analisis-estructural': 'Análisis estructural',
  conexiones: 'Conexiones',
  otro: 'Producción y corte',
}

const HERO_IMAGE = 'https://storage.googleapis.com/meisa-imagenes/site/hero/montaje-grua.jpg'
const BREAK_IMAGE_1 =
  'https://storage.googleapis.com/meisa-imagenes/site/hero/estructura-perspectiva.jpg'
const BREAK_IMAGE_2 =
  'https://storage.googleapis.com/meisa-imagenes/site/hero/coliseo-estructuras-rojas.jpg'

interface Props {
  grupos: GrupoSeccionItem[]
  tecnologias: TecnologiaItem[]
  equipos: EquipoItem[]
  procesos: ProcesoDigitalItem[]
  fasesFlujo: FaseFlujoTecnologiaItem[]
}

export function ProcesosTecnologiasContent({
  grupos,
  tecnologias,
  equipos,
  procesos,
  fasesFlujo,
}: Props) {
  const grupoFlujo = grupos.find((g) => g.clave === 'flujo')
  const grupoDiseno = grupos.find((g) => g.clave === 'diseno-analisis')
  const grupoFabMontaje = grupos.find((g) => g.clave === 'fabricacion-montaje')
  const grupoControlDigital = grupos.find((g) => g.clave === 'control-digital')

  return (
    <main className="bg-slate-950 text-white">
      {/* ============================================================ */}
      {/*  Hero full-bleed                                             */}
      {/* ============================================================ */}
      <section className="relative h-screen md:h-[85vh] overflow-hidden bg-slate-950">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-950/30" />

        <div className="relative z-10 h-full flex items-end pb-16 md:pb-24 px-4 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <p className="text-white/70 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Procesos &amp; Tecnologías
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white">
                Tecnología
              </h1>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white/50">
                estructural
              </h2>
              <p className="mt-6 md:mt-8 text-white/80 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
                Del modelo BIM al acero montado: un solo hilo digital conecta diseño, corte CNC, producción y trazabilidad por QR en cada proyecto MEISA.
              </p>
              <div className="mt-8 md:mt-10">
                <a
                  href="#flujo"
                  className="group inline-flex items-center gap-3 text-white font-lato font-bold text-sm md:text-base"
                >
                  <span className="relative">
                    Ver el flujo completo
                    <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white/40 transition-colors duration-300 group-hover:bg-white" />
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Sticky tabs nav                                             */}
      {/* ============================================================ */}
      <TecnologiaTabsNav />

      {/* ============================================================ */}
      {/*  1. Flujo digital — del modelo al acero                      */}
      {/* ============================================================ */}
      {grupoFlujo && fasesFlujo.length > 0 && (
        <Section id="flujo" grupo={grupoFlujo}>
          <div className="space-y-px bg-white/10 border border-white/10">
            {fasesFlujo.map((fase, i) => (
              <motion.article
                key={fase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="bg-slate-950 p-8 md:p-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10">
                  <div className="md:col-span-2">
                    <span className="font-bebas text-7xl md:text-8xl text-white/15 leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="md:col-span-10">
                    <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] mb-3">
                      {fase.titulo}
                    </h3>
                    {fase.descripcion && (
                      <p className="text-white/60 font-lato text-sm md:text-base leading-relaxed max-w-3xl">
                        {fase.descripcion}
                      </p>
                    )}
                    {fase.herramientas.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {fase.herramientas.map((h, idx) => (
                          <span
                            key={idx}
                            className="border border-white/20 px-2.5 py-1 text-white/60 font-lato font-bold text-[10px] uppercase tracking-[0.15em]"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </Section>
      )}

      {/* ============================================================ */}
      {/*  2. Diseño y Análisis (software)                             */}
      {/* ============================================================ */}
      {grupoDiseno && tecnologias.length > 0 && (
        <Section id="diseno" grupo={grupoDiseno}>
          {/* Grid unificado: la categoría vive como eyebrow de cada tarjeta y
              la última fila siempre llena el ancho (reglas de span) — evita
              categorías de 1–2 items con la fila a medio llenar. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 md:gap-2 lg:[&>*:last-child:nth-child(3n+1)]:col-span-3 lg:[&>*:last-child:nth-child(3n+2)]:col-span-2">
            {tecnologias.map((tech, i) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
                className="flex flex-col"
              >
                {/* Placa blanca: logo oficial o wordmark tipográfico */}
                <div className="bg-white aspect-[5/2] lg:aspect-auto lg:h-32 flex items-center justify-center p-6 md:p-8">
                  {tech.imagen ? (
                    <div className="relative w-full h-full max-h-12 md:max-h-14">
                      <Image
                        src={tech.imagen}
                        alt={tech.nombre}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="font-lato font-extrabold text-slate-950 text-xl md:text-2xl tracking-tight text-center leading-tight">
                      {tech.nombre}
                    </span>
                  )}
                </div>
                <div className="border border-white/10 border-t-0 p-5 md:p-6 flex-1">
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                    {SOFTWARE_LABELS[tech.categoria] ?? tech.categoria}
                  </p>
                  {tech.imagen && (
                    <h3 className="text-xl md:text-2xl font-bebas uppercase leading-none mb-2">
                      {tech.nombre}
                    </h3>
                  )}
                  {tech.especialidad && (
                    <p className="text-white/70 font-lato font-bold text-xs mb-2">
                      {tech.especialidad}
                    </p>
                  )}
                  {tech.descripcion && (
                    <p className="text-white/60 font-lato text-sm leading-relaxed">
                      {tech.descripcion}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* ============================================================ */}
      {/*  Image break #1                                              */}
      {/* ============================================================ */}
      <ImageBreak src={BREAK_IMAGE_1} />

      {/* ============================================================ */}
      {/*  3. Fabricación y Montaje (equipos)                          */}
      {/* ============================================================ */}
      {grupoFabMontaje && equipos.length > 0 && (
        <Section id="fabricacion" grupo={grupoFabMontaje}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {equipos.map((equipo, i) => (
              <motion.div
                key={equipo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-slate-950 flex flex-col"
              >
                {equipo.imagen && (
                  <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <Image
                      src={equipo.imagen}
                      alt={equipo.nombre}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-8 md:p-10 flex-1">
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
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* ============================================================ */}
      {/*  Image break #2                                              */}
      {/* ============================================================ */}
      <ImageBreak src={BREAK_IMAGE_2} />

      {/* ============================================================ */}
      {/*  4. Control Digital (procesos)                               */}
      {/* ============================================================ */}
      {grupoControlDigital && procesos.length > 0 && (
        <Section id="control" grupo={grupoControlDigital}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 md:[&>*:last-child:nth-child(odd)]:col-span-2">
            {procesos.map((proc, i) => (
              <motion.div
                key={proc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-950 flex flex-col"
              >
                {proc.imagen && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                      src={proc.imagen}
                      alt={proc.nombre}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-8 md:p-10 flex-1">
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
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* ============================================================ */}
      {/*  Puente a /calidad                                           */}
      {/* ============================================================ */}
      <section className="border-t border-white/10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Toda esta tecnología se inspecciona
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
              Calidad
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              sin concesiones.
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Soldadores calificados AWS D1.1, ensayos no destructivos, certificación RUC y el dossier digital que el cliente consulta en tiempo real: todo el sistema de calidad, documentado.
            </p>
            <div className="mt-8">
              <Link
                href="/calidad"
                className="group inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
              >
                Ver sistema de calidad
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA final                                                   */}
      {/* ============================================================ */}
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
  id,
  grupo,
  children,
}: {
  id: string
  grupo: GrupoSeccionItem
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="border-t border-white/10 py-20 md:py-28 scroll-mt-20"
    >
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
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] whitespace-pre-line">
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

/* ------------------------------------------------------------------ */
/*  Image break — foto a sangre entre secciones                       */
/* ------------------------------------------------------------------ */

function ImageBreak({ src }: { src: string }) {
  return (
    <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
      <Image src={src} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-slate-950/20" />
    </div>
  )
}

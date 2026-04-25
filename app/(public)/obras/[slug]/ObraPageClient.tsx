'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'

interface Proyecto {
  id: string
  slug: string
  titulo: string
  descripcion: string
  fechaInicio: string
  fechaFin: string | null
  toneladas: string | number | null
  areaTotal: string | number | null
  cliente: string
  ubicacion: string
  imagenes: { url: string; urlOptimized: string | null; alt: string }[]
}

interface Obra {
  id: string
  slug: string
  titulo: string
  resumenCorto: string | null
  esCadena: boolean
  contexto: string | null
  problemasIniciales: string | null
  desafios: any
  solucionTecnica: string | null
  innovaciones: any
  resultados: any
  impactoCliente: string | null
  testimonioCliente: string | null
  tagsTecnicos: any
  leccionesAprendidas: string | null
  imagenDestacada: string | null
  categoria: string
  proyectos: Proyecto[]
}

interface Categoria {
  slug: string
  nombre: string
  imagenCover: string | null
}

interface Props {
  obra: Obra
  categoria: Categoria | null
}

const toNum = (v: string | number | null | undefined): number | null => {
  if (v === null || v === undefined || v === '') return null
  const n = typeof v === 'number' ? v : parseFloat(v)
  return Number.isFinite(n) ? n : null
}

const formatNum = (n: number): string => n.toLocaleString('es-CO')

const asStringArray = (v: any): string[] =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '')
    : []

const gridColsForCount = (count: number): string => {
  if (count <= 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1 md:grid-cols-2'
  if (count === 3) return 'grid-cols-1 md:grid-cols-3'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
}

export default function ObraPageClient({ obra, categoria }: Props) {
  const desafios = asStringArray(obra.desafios)
  const innovaciones = asStringArray(obra.innovaciones)
  const resultados = asStringArray(obra.resultados)
  const tagsTecnicos = asStringArray(obra.tagsTecnicos)

  const categoriaNombre = categoria?.nombre ?? obra.categoria
  const categoriaSlug =
    categoria?.slug ?? obra.categoria.toLowerCase().replace(/_/g, '-')

  // Imagen del hero: destacada de la obra > primera imagen del primer proyecto > cover categoría
  const heroBg =
    obra.imagenDestacada ||
    obra.proyectos[0]?.imagenes[0]?.urlOptimized ||
    obra.proyectos[0]?.imagenes[0]?.url ||
    categoria?.imagenCover ||
    null

  // Totales agregados de todos los proyectos
  const totalToneladas = obra.proyectos.reduce((acc, p) => {
    const n = toNum(p.toneladas)
    return acc + (n ?? 0)
  }, 0)
  const totalArea = obra.proyectos.reduce((acc, p) => {
    const n = toNum(p.areaTotal)
    return acc + (n ?? 0)
  }, 0)
  const anioInicio = obra.proyectos[0]?.fechaInicio
    ? Number(obra.proyectos[0].fechaInicio.slice(0, 4))
    : null
  const anioFinal = obra.proyectos[obra.proyectos.length - 1]?.fechaFin
    ? Number(
        obra.proyectos[obra.proyectos.length - 1].fechaFin!.slice(0, 4),
      )
    : null
  const periodo =
    anioInicio && anioFinal
      ? anioInicio === anioFinal
        ? `${anioInicio}`
        : `${anioInicio} – ${anioFinal}`
      : null

  return (
    <div className="min-h-screen bg-slate-950">
      {/* HERO SPLIT 60/40 */}
      <section className="relative bg-slate-950">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 sm:px-6 lg:px-12 py-5 md:py-6 border-b border-white/10"
        >
          <ol className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs text-white/50 font-lato uppercase tracking-[0.15em]">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Inicio
              </Link>
            </li>
            <li className="text-white/30">/</li>
            <li>
              <Link
                href="/proyectos"
                className="hover:text-white transition-colors"
              >
                Proyectos
              </Link>
            </li>
            <li className="text-white/30">/</li>
            <li>
              <Link
                href={`/proyectos/categoria/${categoriaSlug}`}
                className="hover:text-white transition-colors"
              >
                {categoriaNombre}
              </Link>
            </li>
            <li className="text-white/30">/</li>
            <li className="text-white/80 truncate max-w-[50vw] md:max-w-[70vw]">
              {obra.titulo}
            </li>
          </ol>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[70vh] lg:min-h-[80vh]">
          <div className="relative lg:col-span-3 h-[50vh] lg:h-auto bg-slate-900">
            {heroBg ? (
              <Image
                src={heroBg}
                alt={obra.titulo}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bebas text-6xl text-white/10 uppercase">
                  MEISA
                </span>
              </div>
            )}
            <div className="lg:hidden absolute inset-0 bg-slate-950/30" />
          </div>

          <div className="relative lg:col-span-2 flex flex-col justify-between bg-slate-950 px-6 sm:px-8 lg:px-10 xl:px-14 py-10 md:py-14 lg:py-16 lg:border-l lg:border-white/10">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-red-500 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4"
              >
                Obra · {categoriaNombre}
                {periodo && <span className="text-white/40"> · {periodo}</span>}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bebas uppercase text-white leading-[0.95] mb-8 md:mb-10"
              >
                {obra.titulo}
              </motion.h1>

              {obra.resumenCorto && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="text-white/70 font-lato text-base md:text-lg leading-relaxed text-pretty hyphens-auto mb-8"
                >
                  {obra.resumenCorto}
                </motion.p>
              )}

              {/* Totales agregados de la obra */}
              <motion.dl
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="grid grid-cols-2 gap-px bg-white/10 border-y border-white/10"
              >
                {totalToneladas > 0 && (
                  <div className="bg-slate-950 py-3.5 px-4 flex flex-col gap-1">
                    <dt className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em]">
                      Acero total
                    </dt>
                    <dd className="text-white font-bebas text-lg md:text-xl leading-[1.05] uppercase">
                      {formatNum(Math.round(totalToneladas))} ton
                    </dd>
                  </div>
                )}
                {totalArea > 0 && (
                  <div className="bg-slate-950 py-3.5 px-4 flex flex-col gap-1">
                    <dt className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em]">
                      Área total
                    </dt>
                    <dd className="text-white font-bebas text-lg md:text-xl leading-[1.05] uppercase">
                      {formatNum(Math.round(totalArea))} m²
                    </dd>
                  </div>
                )}
                <div className="bg-slate-950 py-3.5 px-4 flex flex-col gap-1">
                  <dt className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em]">
                    {obra.esCadena
                      ? 'Proyectos'
                      : obra.proyectos.length === 1
                        ? 'Fase'
                        : 'Fases'}
                  </dt>
                  <dd className="text-white font-bebas text-lg md:text-xl leading-[1.05] uppercase">
                    {obra.proyectos.length}{' '}
                    {obra.proyectos.length === 1 ? 'proyecto' : 'proyectos'}
                  </dd>
                </div>
                {obra.proyectos[0]?.cliente && (
                  <div className="bg-slate-950 py-3.5 px-4 flex flex-col gap-1">
                    <dt className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em]">
                      Cliente
                    </dt>
                    <dd className="text-white font-bebas text-lg md:text-xl leading-[1.05] uppercase">
                      {obra.proyectos[0].cliente}
                    </dd>
                  </div>
                )}
              </motion.dl>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 md:mt-10 pt-6 border-t border-white/10"
            >
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-2 text-white font-lato font-bold text-sm uppercase tracking-wider"
              >
                <span className="relative">
                  Hablemos de tu obra
                  <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white/40 transition-colors duration-300 group-hover:bg-white" />
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTENIDO EDITORIAL — misma estructura que ProjectDetailClient */}

      {/* Contexto */}
      {obra.contexto && (
        <section className="bg-slate-950 border-t border-white/10 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
            >
              <div className="lg:col-span-5">
                <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
                  El contexto
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                  La obra
                </h2>
              </div>
              <div className="lg:col-span-7 lg:pt-4">
                <p className="text-white/80 font-lato text-lg md:text-xl leading-relaxed text-pretty hyphens-auto">
                  {obra.contexto}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Retos técnicos */}
      {(obra.problemasIniciales || desafios.length > 0) && (
        <section className="bg-slate-950 border-t border-white/10 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-10 md:mb-14"
            >
              <div className="lg:col-span-5">
                <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
                  Retos técnicos
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                  Lo que
                </h2>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white/40">
                  había que resolver.
                </h3>
              </div>
              {obra.problemasIniciales && (
                <div className="lg:col-span-7 lg:pt-4">
                  <p className="text-white/70 font-lato text-base md:text-lg leading-relaxed text-pretty hyphens-auto">
                    {obra.problemasIniciales}
                  </p>
                </div>
              )}
            </motion.div>

            {desafios.length > 0 &&
              (() => {
                const items = desafios.slice(0, 4)
                return (
                  <div
                    className={`grid ${gridColsForCount(items.length)} gap-px bg-white/10 border-y border-white/10`}
                  >
                    {items.map((d, i) => (
                      <div
                        key={i}
                        className="bg-slate-950 p-6 md:p-8"
                      >
                        <span className="font-bebas text-4xl md:text-5xl leading-none text-white/30 block mb-3">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-white/80 font-lato text-sm md:text-base leading-relaxed text-pretty hyphens-auto">
                          {d}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              })()}
          </div>
        </section>
      )}

      {/* Solución */}
      {(obra.solucionTecnica || innovaciones.length > 0) && (
        <section className="bg-slate-950 border-t border-white/10 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
            >
              <div className="lg:col-span-5">
                <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
                  Método constructivo
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                  Cómo se
                </h2>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white/40">
                  construyó.
                </h3>
              </div>
              <div className="lg:col-span-7 lg:pt-4">
                {obra.solucionTecnica && (
                  <p className="text-white/80 font-lato text-lg md:text-xl leading-relaxed text-pretty hyphens-auto mb-8">
                    {obra.solucionTecnica}
                  </p>
                )}
                {innovaciones.length > 0 && (
                  <>
                    <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                      Ingeniería aplicada
                    </p>
                    <ul className="space-y-3">
                      {innovaciones.map((inn, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-500 mt-2" />
                          <span className="text-white/80 font-lato text-base md:text-lg leading-relaxed text-pretty hyphens-auto">
                            {inn}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Entregables */}
      {(resultados.length > 0 || obra.impactoCliente) && (
        <section className="bg-slate-950 border-t border-white/10 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-10 md:mb-14"
            >
              <div className="lg:col-span-5">
                <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
                  Entregables
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                  Lo que
                </h2>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white/40">
                  quedó entregado.
                </h3>
              </div>
              {obra.impactoCliente && (
                <div className="lg:col-span-7 lg:pt-4">
                  <p className="text-white/80 font-lato text-base md:text-lg leading-relaxed text-pretty hyphens-auto">
                    {obra.impactoCliente}
                  </p>
                </div>
              )}
            </motion.div>

            {resultados.length > 0 &&
              (() => {
                const items = resultados.slice(0, 4)
                return (
                  <div
                    className={`grid ${gridColsForCount(items.length)} gap-px bg-white/10 border-y border-white/10`}
                  >
                    {items.map((r, i) => (
                      <div
                        key={i}
                        className="bg-slate-950 p-6 md:p-8"
                      >
                        <span className="font-bebas text-4xl md:text-5xl leading-none text-white/30 block mb-3">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-white/80 font-lato text-sm md:text-base leading-relaxed text-pretty hyphens-auto">
                          {r}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              })()}
          </div>
        </section>
      )}

      {/* Testimonio */}
      {obra.testimonioCliente && obra.testimonioCliente.trim() && (
        <section className="bg-slate-950 border-t border-white/10 py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Quote
                className="absolute -top-3 -left-2 w-16 h-16 text-white/10"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <blockquote className="relative pl-4 md:pl-8 border-l-2 border-red-500">
                <p className="text-white font-bebas text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.05]">
                  {obra.testimonioCliente}
                </p>
                <footer className="mt-6 text-white/50 font-lato font-bold text-[10px] uppercase tracking-[0.2em]">
                  — Cliente de la obra
                </footer>
              </blockquote>
            </motion.div>
          </div>
        </section>
      )}

      {/* FASES / PROYECTOS DE LA OBRA — sección prominente */}
      <section className="bg-slate-950 border-t border-white/10 pt-16 md:pt-20 pb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <p className="text-red-500 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3">
              {obra.proyectos.length}{' '}
              {obra.esCadena
                ? obra.proyectos.length === 1
                  ? 'Proyecto'
                  : 'Proyectos'
                : obra.proyectos.length === 1
                  ? 'Fase'
                  : 'Fases'}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
              {obra.esCadena ? 'Los proyectos' : 'Las fases'}
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white/40">
              {obra.esCadena ? 'de la obra.' : 'del proyecto.'}
            </h3>
          </motion.div>
        </div>

        <div
          className={`grid ${gridColsForCount(Math.min(obra.proyectos.length, 4))} gap-px bg-white/10 border-y border-white/10`}
        >
          {(() => {
            // Fallback: si un proyecto no tiene imágenes propias, usar la primera
            // imagen de otro proyecto de la misma obra (o la imagen destacada de
            // la obra). Evita el cuadro gris vacío.
            const fallbackImg =
              obra.proyectos.find((q) => q.imagenes.length > 0)?.imagenes[0] ??
              (obra.imagenDestacada
                ? { url: obra.imagenDestacada, urlOptimized: null, alt: obra.titulo }
                : null)
            return obra.proyectos.map((p, i) => {
              const thumb = p.imagenes[0] ?? fallbackImg
              const usandoFallback = p.imagenes.length === 0 && !!fallbackImg
              const ton = toNum(p.toneladas)
              const area = toNum(p.areaTotal)
              const anio = p.fechaFin ? p.fechaFin.slice(0, 4) : null
              return (
                <Link
                  key={p.id}
                  href={`/proyectos/detalle/${p.slug}`}
                  className="group relative block bg-slate-950 overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="relative h-[45vh] md:h-[50vh]"
                  >
                    {thumb ? (
                      <Image
                        src={thumb.urlOptimized || thumb.url}
                        alt={thumb.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={`object-cover ${usandoFallback ? 'grayscale opacity-60' : ''}`}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-900" />
                    )}
                    <div className="absolute inset-0 bg-slate-950/55 group-hover:bg-slate-950/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <p
                      className="text-white/70 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                    >
                      {obra.esCadena ? (
                        <>
                          {p.ubicacion.split('-')[0].split(',')[0].trim()}
                          {anio && <span className="ml-2">· {anio}</span>}
                        </>
                      ) : (
                        <>
                          Fase {String(i + 1).padStart(2, '0')}
                          {anio && <span className="ml-2">· {anio}</span>}
                        </>
                      )}
                    </p>
                    <h3
                      className="text-2xl md:text-3xl font-bebas uppercase text-white leading-[0.95]"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                    >
                      {p.titulo}
                    </h3>
                    <div className="flex items-center flex-wrap gap-x-3 mt-3 text-white/70 font-lato text-xs">
                      {ton && <span>{formatNum(ton)} ton</span>}
                      {ton && area && <span>·</span>}
                      {area && <span>{formatNum(area)} m²</span>}
                    </div>
                    <span className="inline-flex items-center gap-2 mt-4 text-white font-lato font-bold text-[10px] uppercase tracking-wider">
                      <span className="relative">
                        Ver detalle del proyecto
                        <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white/40 transition-colors duration-300 group-hover:bg-white" />
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            )
            })
          })()}
        </div>
      </section>

      {/* Tags + Lecciones */}
      {(tagsTecnicos.length > 0 || obra.leccionesAprendidas) && (
        <section className="bg-slate-950 border-t border-white/10 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              {tagsTecnicos.length > 0 && (
                <div>
                  <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
                    Especialidades técnicas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tagsTecnicos.map((t) => (
                      <span
                        key={t}
                        className="inline-block border border-white/20 px-2.5 py-1 text-white/80 font-lato text-[10px] uppercase tracking-wider"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {obra.leccionesAprendidas && (
                <div>
                  <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
                    Notas técnicas
                  </p>
                  <p className="text-white/70 font-lato text-sm md:text-base leading-relaxed text-pretty hyphens-auto">
                    {obra.leccionesAprendidas}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="relative bg-slate-950 border-t border-white/10 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3">
                ¿Tu obra similar?
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bebas uppercase leading-[0.95] text-white">
                Hablemos de tu obra.{' '}
                <span className="text-white/40">
                  Cotización en menos de 48 horas.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/contacto"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-lato font-bold text-xs md:text-sm uppercase tracking-wider transition-colors duration-300 hover:bg-red-700"
              >
                Solicitar cotización
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href={`/proyectos/categoria/${categoriaSlug}`}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white font-lato font-bold text-xs md:text-sm uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Más de {categoriaNombre}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

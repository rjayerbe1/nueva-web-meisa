'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Quote,
} from 'lucide-react'

interface Imagen {
  id: string
  url: string
  urlOptimized: string | null
  alt: string
  titulo: string | null
  descripcion: string | null
  orden: number
  tipo: string
}

interface Proyecto {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  cliente: string
  ubicacion: string
  slug: string
  fechaInicio: string
  fechaFin: string | null
  estado: string
  destacado: boolean
  toneladas: string | number | null
  areaTotal: string | number | null
  tags: string[]
  imagenes: Imagen[]
  historia?: {
    id: string
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
  } | null
}

interface RelacionadoItem {
  id: string
  titulo: string
  slug: string
  ubicacion: string
  toneladas: string | number | null
  imagenes: { url: string; urlOptimized: string | null; alt: string }[]
}

interface Categoria {
  slug: string
  nombre: string
  imagenCover: string | null
}

interface ProjectDetailClientProps {
  proyecto: Proyecto
  relacionados: RelacionadoItem[]
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

// Grid adaptativo según cantidad (evita huecos en filas impares).
// Cap a 4 items max: más de 4 se recortan porque saturan visualmente.
const gridColsForCount = (count: number): string => {
  if (count <= 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1 md:grid-cols-2'
  if (count === 3) return 'grid-cols-1 md:grid-cols-3'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
}

export default function ProjectDetailClient({
  proyecto,
  relacionados,
  categoria,
}: ProjectDetailClientProps) {
  const toneladas = toNum(proyecto.toneladas)
  const areaTotal = toNum(proyecto.areaTotal)
  // fechas se guardan en UTC (ej. "2021-06-01T00:00:00Z") — forzar UTC al leer
  // para evitar que timezone local las baje un día.
  const anio = proyecto.fechaFin
    ? Number(proyecto.fechaFin.slice(0, 4))
    : null

  const portada =
    proyecto.imagenes.find((i) => i.tipo === 'PORTADA') ||
    proyecto.imagenes[0] ||
    null
  const heroBgUrl =
    portada?.urlOptimized ||
    portada?.url ||
    categoria?.imagenCover ||
    null

  const categoriaNombre = categoria?.nombre ?? proyecto.categoria
  const categoriaSlug =
    categoria?.slug ?? proyecto.categoria.toLowerCase().replace(/_/g, '-')

  // Galería: todas MENOS la que ya se usa como portada del hero
  const galeria = proyecto.imagenes.filter(
    (i) => !portada || i.id !== portada.id,
  )
  const historia = proyecto.historia ?? null
  const desafios = asStringArray(historia?.desafios)
  const innovaciones = asStringArray(historia?.innovaciones)
  const resultados = asStringArray(historia?.resultados)
  const tagsTecnicos = asStringArray(historia?.tagsTecnicos)
  const tieneHistoria =
    historia !== null &&
    !!(
      historia.contexto ||
      historia.problemasIniciales ||
      desafios.length > 0 ||
      historia.solucionTecnica ||
      innovaciones.length > 0 ||
      resultados.length > 0 ||
      historia.impactoCliente ||
      historia.testimonioCliente ||
      historia.leccionesAprendidas
    )

  // Specs inline del hero (3-6 ítems, solo los que existen)
  const specs: Array<{ label: string; value: string }> = []
  if (areaTotal) specs.push({ label: 'Área', value: `${formatNum(areaTotal)} m²` })
  if (toneladas) specs.push({ label: 'Acero', value: `${formatNum(toneladas)} ton` })
  if (proyecto.fechaFin) {
    const d = new Date(proyecto.fechaFin)
    specs.push({
      label: 'Entrega',
      value: d.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }),
    })
  }
  specs.push({ label: 'Cliente', value: proyecto.cliente })
  specs.push({ label: 'Ubicación', value: proyecto.ubicacion })
  specs.push({ label: 'Categoría', value: categoriaNombre })

  return (
    <div className="min-h-screen bg-slate-950">
      {/* 1. HERO SPLIT 60/40 */}
      <HeroSplit
        heroBgUrl={heroBgUrl}
        portadaAlt={portada?.alt ?? proyecto.titulo}
        titulo={proyecto.titulo}
        categoriaNombre={categoriaNombre}
        categoriaSlug={categoriaSlug}
        anio={anio}
        specs={specs}
        tags={proyecto.tags}
      />

      {/* 2. DESCRIPCIÓN — editorial 2-col */}
      {proyecto.descripcion && (
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
                  Sobre la obra
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white">
                  La obra
                </h2>
              </div>
              <div className="lg:col-span-7 lg:pt-4">
                <p className="text-white/80 font-lato text-lg md:text-xl leading-relaxed">
                  {proyecto.descripcion}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 3. GALERÍA — full-width fuera del max-w wrapper */}
      {galeria.length > 0 && (
        <section className="bg-slate-950 border-t border-white/10 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <Galeria imagenes={galeria} />
          </div>
        </section>
      )}

      {/* 4. DETALLE TÉCNICO (historia) — múltiples secciones editoriales */}
      {tieneHistoria && historia && (
        <HistoriaBloques
          historia={historia}
          desafios={desafios}
          innovaciones={innovaciones}
          resultados={resultados}
          tagsTecnicos={tagsTecnicos}
        />
      )}

      {/* 3. PROYECTOS RELACIONADOS — compacto */}
      {relacionados.length > 0 && (
        <RelacionadosSection
          relacionados={relacionados}
          categoriaNombre={categoriaNombre}
        />
      )}

      {/* 4. CTA FINAL — compacto */}
      <CtaSection
        categoriaNombre={categoriaNombre}
        categoriaSlug={categoriaSlug}
      />
    </div>
  )
}

/* ─── HERO SPLIT 60/40 ──────────────────────────────────────────────── */

function HeroSplit({
  heroBgUrl,
  portadaAlt,
  titulo,
  categoriaNombre,
  categoriaSlug,
  anio,
  specs,
  tags,
}: {
  heroBgUrl: string | null
  portadaAlt: string
  titulo: string
  categoriaNombre: string
  categoriaSlug: string
  anio: number | null
  specs: Array<{ label: string; value: string }>
  tags: string[]
}) {
  return (
    <section className="relative bg-slate-950">
      {/* Breadcrumb — barra superior sobre el hero */}
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
          <li className="text-white/80 truncate max-w-[55vw] md:max-w-[70vw]">
            {titulo}
          </li>
        </ol>
      </motion.nav>

      {/* Split: imagen izq (60%) + info der (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[70vh] lg:min-h-[80vh]">
        {/* Imagen — 60% del ancho en desktop (3/5) */}
        <div className="relative lg:col-span-3 h-[50vh] lg:h-auto bg-slate-900">
          {heroBgUrl ? (
            <Image
              src={heroBgUrl}
              alt={portadaAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <span className="font-bebas text-6xl text-white/10 uppercase">
                MEISA
              </span>
            </div>
          )}
          {/* overlay sutil solo en mobile para que el texto no compita */}
          <div className="lg:hidden absolute inset-0 bg-slate-950/30" />
        </div>

        {/* Info — 40% (2/5) */}
        <div className="relative lg:col-span-2 flex flex-col justify-between bg-slate-950 px-6 sm:px-8 lg:px-10 xl:px-14 py-10 md:py-14 lg:py-16 border-l border-white/0 lg:border-l lg:border-white/10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4"
            >
              {categoriaNombre}
              {anio && <span className="text-white/30"> · {anio}</span>}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bebas uppercase text-white leading-[0.95] mb-8 md:mb-10"
            >
              {titulo}
            </motion.h1>

            {/* Specs técnicos inline — grid 2-col denso */}
            {specs.length > 0 && (
              <motion.dl
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-2 gap-px bg-white/10 border-y border-white/10"
              >
                {specs.map((s, i) => {
                  const isLastOrphan =
                    i === specs.length - 1 && specs.length % 2 === 1
                  return (
                    <div
                      key={s.label}
                      className={`bg-slate-950 py-3.5 px-4 flex flex-col gap-1 ${
                        isLastOrphan ? 'col-span-2' : ''
                      }`}
                    >
                      <dt className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em]">
                        {s.label}
                      </dt>
                      <dd className="text-white font-bebas text-lg md:text-xl leading-[1.05] uppercase">
                        {s.value}
                      </dd>
                    </div>
                  )
                })}
              </motion.dl>
            )}

            {tags && tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 flex flex-wrap gap-1.5"
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block border border-white/20 px-2 py-0.5 text-white/80 font-lato text-[10px] uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </div>

          {/* CTA inline en el hero */}
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
  )
}

/* ─── GALERÍA inline ────────────────────────────────────────────────── */

function Galeria({ imagenes }: { imagenes: Imagen[] }) {
  const len = imagenes.length
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightbox])

  const header = (
    <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
      Galería · {len} {len === 1 ? 'imagen' : 'imágenes'}
    </p>
  )

  if (len === 1) {
    return (
      <div>
        {header}
        <button
          type="button"
          onClick={() => setLightbox(0)}
          className="relative block w-full h-[50vh] md:h-[55vh] overflow-hidden group border border-white/10"
        >
          <Image
            src={imagenes[0].urlOptimized || imagenes[0].url}
            alt={imagenes[0].alt}
            fill
            sizes="(max-width: 1024px) 100vw, 56rem"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/15 group-hover:bg-slate-950/5 transition-colors duration-500" />
          {imagenes[0].titulo && (
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <p className="text-white font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                {imagenes[0].titulo}
              </p>
            </div>
          )}
        </button>
        {lightbox !== null && (
          <Lightbox
            imagenes={imagenes}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onChange={setLightbox}
          />
        )}
      </div>
    )
  }

  if (len <= 4) {
    return (
      <div>
        {header}
        <div className="grid grid-cols-2 gap-px bg-white/10 border-y border-white/10">
          {imagenes.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setLightbox(i)}
              className={`relative block overflow-hidden group bg-slate-950 ${
                i === 0 && len === 3 ? 'col-span-2 h-[42vh]' : 'h-[30vh]'
              }`}
            >
              <Image
                src={img.urlOptimized || img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 28rem"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/15 group-hover:bg-slate-950/5 transition-colors duration-500" />
              {img.titulo && (
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-lato font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
                    {img.titulo}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
        {lightbox !== null && (
          <Lightbox
            imagenes={imagenes}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onChange={setLightbox}
          />
        )}
      </div>
    )
  }

  // 5+ imágenes → carrusel
  return (
    <>
      <CarruselGaleria imagenes={imagenes} onOpenLightbox={setLightbox} />
      {lightbox !== null && (
        <Lightbox
          imagenes={imagenes}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onChange={setLightbox}
        />
      )}
    </>
  )
}

function CarruselGaleria({
  imagenes,
  onOpenLightbox,
}: {
  imagenes: Imagen[]
  onOpenLightbox: (i: number) => void
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: el.clientWidth * 0.85 * dir, behavior: 'smooth' })
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
          Galería · {imagenes.length} imágenes
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Anterior"
            className="inline-flex items-center justify-center w-9 h-9 border border-white/30 text-white transition-colors hover:border-white hover:bg-white hover:text-slate-950"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Siguiente"
            className="inline-flex items-center justify-center w-9 h-9 border border-white/30 text-white transition-colors hover:border-white hover:bg-white hover:text-slate-950"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide border-y border-white/10"
      >
        {imagenes.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => onOpenLightbox(i)}
            className="relative flex-shrink-0 snap-start w-full md:w-[92%] h-[45vh] md:h-[50vh] overflow-hidden group bg-slate-900 text-left border-r border-white/10 last:border-r-0"
          >
            <Image
              src={img.urlOptimized || img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/5 transition-colors duration-500" />
            {(img.titulo || img.descripcion) && (
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                {img.titulo && (
                  <p className="text-white font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-1">
                    {img.titulo}
                  </p>
                )}
                {img.descripcion && (
                  <p className="text-white/70 font-lato text-xs md:text-sm max-w-2xl line-clamp-2">
                    {img.descripcion}
                  </p>
                )}
              </div>
            )}
            <span className="absolute top-3 right-3 font-bebas text-white/70 text-sm bg-slate-950/60 px-1.5 py-0.5">
              {String(i + 1).padStart(2, '0')}/
              {String(imagenes.length).padStart(2, '0')}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Lightbox({
  imagenes,
  index,
  onClose,
  onChange,
}: {
  imagenes: Imagen[]
  index: number
  onClose: () => void
  onChange: (i: number) => void
}) {
  const prev = () => onChange((index - 1 + imagenes.length) % imagenes.length)
  const next = () => onChange((index + 1) % imagenes.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index])

  const img = imagenes[index]
  if (!img) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 inline-flex items-center justify-center w-10 h-10 border border-white/30 text-white hover:border-white hover:bg-white hover:text-slate-950 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-white/30 text-white hover:border-white hover:bg-white hover:text-slate-950 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-white/30 text-white hover:border-white hover:bg-white hover:text-slate-950 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] m-4 md:m-12">
        <Image
          src={img.urlOptimized || img.url}
          alt={img.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
      {(img.titulo || img.descripcion) && (
        <div className="absolute bottom-4 left-0 right-0 mx-auto max-w-3xl px-6 text-center">
          {img.titulo && (
            <p className="text-white font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-1">
              {img.titulo}
            </p>
          )}
          {img.descripcion && (
            <p className="text-white/70 font-lato text-sm md:text-base">
              {img.descripcion}
            </p>
          )}
        </div>
      )}
      <p className="absolute top-4 left-4 md:top-6 md:left-6 font-bebas text-white/60 text-lg">
        {String(index + 1).padStart(2, '0')} /{' '}
        {String(imagenes.length).padStart(2, '0')}
      </p>
    </div>
  )
}

/* ─── HISTORIA editorial — múltiples secciones con grids ────────────── */

function HistoriaBloques({
  historia,
  desafios,
  innovaciones,
  resultados,
  tagsTecnicos,
}: {
  historia: NonNullable<Proyecto['historia']>
  desafios: string[]
  innovaciones: string[]
  resultados: string[]
  tagsTecnicos: string[]
}) {
  return (
    <>
      {/* Contexto — editorial 2-col */}
      {historia.contexto && (
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
                  Qué se
                </h2>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white/40">
                  pidió.
                </h3>
              </div>
              <div className="lg:col-span-7 lg:pt-4">
                <p className="text-white/80 font-lato text-lg md:text-xl leading-relaxed">
                  {historia.contexto}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Retos técnicos — grid 3-col */}
      {(historia.problemasIniciales || desafios.length > 0) && (
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
              {historia.problemasIniciales && (
                <div className="lg:col-span-7 lg:pt-4">
                  <p className="text-white/70 font-lato text-base md:text-lg leading-relaxed">
                    {historia.problemasIniciales}
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
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                        className="bg-slate-950 p-6 md:p-8"
                      >
                        <span className="font-bebas text-4xl md:text-5xl leading-none text-white/30 block mb-3">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-white/80 font-lato text-sm md:text-base leading-relaxed">
                          {d}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )
              })()}
          </div>
        </section>
      )}

      {/* Cómo se construyó — 2-col: solución + bullets de innovaciones */}
      {(historia.solucionTecnica || innovaciones.length > 0) && (
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
                {historia.solucionTecnica && (
                  <p className="text-white/80 font-lato text-lg md:text-xl leading-relaxed mb-8">
                    {historia.solucionTecnica}
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
                          <span className="text-white/80 font-lato text-base md:text-lg leading-relaxed">
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

      {/* Entregables — grid 3-col + impacto */}
      {(resultados.length > 0 || historia.impactoCliente) && (
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
              {historia.impactoCliente && (
                <div className="lg:col-span-7 lg:pt-4">
                  <p className="text-white/80 font-lato text-base md:text-lg leading-relaxed">
                    {historia.impactoCliente}
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
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                        className="bg-slate-950 p-6 md:p-8"
                      >
                        <span className="font-bebas text-4xl md:text-5xl leading-none text-white/30 block mb-3">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-white/80 font-lato text-sm md:text-base leading-relaxed">
                          {r}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )
              })()}
          </div>
        </section>
      )}

      {/* Testimonio — pull quote full-width */}
      {historia.testimonioCliente && historia.testimonioCliente.trim() && (
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
                  {historia.testimonioCliente}
                </p>
                <footer className="mt-6 text-white/50 font-lato font-bold text-[10px] uppercase tracking-[0.2em]">
                  — Cliente del proyecto
                </footer>
              </blockquote>
            </motion.div>
          </div>
        </section>
      )}

      {/* Notas técnicas — tags + lecciones en 2-col */}
      {(tagsTecnicos.length > 0 || historia.leccionesAprendidas) && (
        <section className="bg-slate-950 border-t border-white/10 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16"
            >
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
              {historia.leccionesAprendidas && (
                <div>
                  <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
                    Notas técnicas
                  </p>
                  <p className="text-white/70 font-lato text-sm md:text-base leading-relaxed">
                    {historia.leccionesAprendidas}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}

/* ─── RELACIONADOS — 4-col h-[28vh] ─────────────────────────────────── */

function RelacionadosSection({
  relacionados,
  categoriaNombre,
}: {
  relacionados: RelacionadoItem[]
  categoriaNombre: string
}) {
  return (
    <section className="bg-slate-950 border-t border-white/10 pt-14 md:pt-18 pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 mb-8 md:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-white/40 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2">
            También entregados
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bebas uppercase leading-[0.95] text-white">
            Otros proyectos de{' '}
            <span className="text-white/40">
              {categoriaNombre.toLowerCase()}.
            </span>
          </h2>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {relacionados.map((r, index) => {
          const thumb = r.imagenes[0]
          const ton = toNum(r.toneladas)
          return (
            <Link
              key={r.id}
              href={`/proyectos/detalle/${r.slug}`}
              className="group block"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.08 }}
                viewport={{ once: true, margin: '-50px' }}
                className="relative h-[32vh] lg:h-[34vh] overflow-hidden"
              >
                {thumb ? (
                  <Image
                    src={thumb.urlOptimized || thumb.url}
                    alt={thumb.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-900" />
                )}
                <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/35 transition-colors duration-500" />

                <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6 text-left">
                  <p
                    className="text-white/70 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                  >
                    {r.ubicacion}
                  </p>
                  <h3
                    className="text-xl md:text-2xl font-bebas uppercase text-white leading-[0.95]"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                  >
                    {r.titulo}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    {ton ? (
                      <p
                        className="text-white/60 font-lato text-xs"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                      >
                        {formatNum(ton)} ton
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex items-center gap-1.5 text-white font-lato font-bold text-[10px] uppercase tracking-wider">
                      <span className="relative">
                        Ver proyecto
                        <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white/40 transition-colors duration-300 group-hover:bg-white" />
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

/* ─── CTA FINAL ─────────────────────────────────────────────────────── */

function CtaSection({
  categoriaNombre,
  categoriaSlug,
}: {
  categoriaNombre: string
  categoriaSlug: string
}) {
  return (
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
              ¿Tu proyecto similar?
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
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileBadge,
} from 'lucide-react'
import { getCategoryIconComponent } from '@/lib/get-category-icon'
import { EspecialidadesTabs } from '@/components/sections/EspecialidadesTabs'

const parsePosition = (
  posStr: string | null,
): { x: number; y: number } => {
  if (!posStr || posStr.includes(' ')) {
    return { x: 0, y: 0 }
  }
  const [x, y] = posStr.split(',').map((v) => parseFloat(v) || 0)
  return { x, y }
}

interface Brochure {
  id: string
  titulo: string
  descripcion: string | null
  urlAmigable: string
  thumbnail: string | null
  pdfUrl: string | null
  publicado: boolean
  activo: boolean
  fechaPublicacion: string | null
  totalPages: number
  primeraPagePreview: {
    id: string
    nombre: string
    canvasData: any
    configuracion: any
    orden: number
  } | null
  pages: Array<{
    id: string
    nombre: string
    canvasData: any
    configuracion: any
    orden: number
  }>
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
  toneladas: number | null
  areaTotal: number | null
  imagenes: Array<{
    id: string
    url: string
    urlOptimized: string | null
    alt: string
    titulo: string | null
    descripcion: string | null
    orden: number
  }>
}

interface Categoria {
  id: string
  key: string
  nombre: string
  descripcion: string | null
  slug: string
  imagenCover: string | null
  imagenBanner: string | null
  videoBanner: string | null
  usarVideoBanner: boolean
  videoBannerScale: number | null
  videoBannerPosition: string | null
  icono: string | null
  color: string | null
  colorSecundario: string | null
  overlayColor: string | null
  overlayOpacity: number | null
  metaTitle: string | null
  metaDescription: string | null
  descripcionAmpliada: string | null
  beneficios: any | null
  procesoTrabajo: any | null
  estadisticas: any | null
  casosExitoIds: any | null
  especialidades: any | null
}

interface CategoryPageClientProps {
  categoria: Categoria
  proyectos: Proyecto[]
  brochure: Brochure | null
}

export default function CategoryPageClient({
  categoria,
  proyectos,
  brochure,
}: CategoryPageClientProps) {
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [heroBackground, setHeroBackground] = useState<string | null>(null)

  const handleEspecialidadChange = (especialidad: any) => {
    if (especialidad?.imagen) {
      setHeroBackground(especialidad.imagen)
    }
  }

  const handleDownloadPDF = async () => {
    if (!brochure || downloadingPDF) return

    try {
      setDownloadingPDF(true)

      if (brochure.pdfUrl && brochure.pdfUrl.trim() !== '') {
        const link = document.createElement('a')
        link.href = brochure.pdfUrl
        link.download = `${brochure.titulo.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        return
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error)
    } finally {
      setDownloadingPDF(false)
    }
  }

  const proyectosConImagenes = proyectos.filter(
    (p) => p.imagenes && p.imagenes.length > 0,
  )
  const proyectosSinImagenes = proyectos.filter(
    (p) => !p.imagenes || p.imagenes.length === 0,
  )

  const proyectosDestacadosIds: string[] =
    categoria.casosExitoIds && categoria.casosExitoIds.length > 0
      ? categoria.casosExitoIds
      : []

  const proyectosConImagenesOrdenados = [...proyectosConImagenes].sort(
    (a, b) => {
      const aEsDestacado = proyectosDestacadosIds.includes(a.id)
      const bEsDestacado = proyectosDestacadosIds.includes(b.id)
      if (aEsDestacado && !bEsDestacado) return -1
      if (!aEsDestacado && bEsDestacado) return 1
      return 0
    },
  )

  const stats = categoria.estadisticas || {}
  const toneladas = stats.toneladasTotal as number | undefined
  const proyectosCompletados = stats.proyectosCompletados as number | undefined
  const anios = stats.aniosExperiencia as number | undefined

  return (
    <div className="min-h-screen bg-slate-950">
      {/* HERO — h-screen con imagen/video banner + especialidades tabs */}
      <section className="relative h-screen overflow-hidden bg-slate-950">
        {/* Background: especialidad > video > imagen banner > cover */}
        {(heroBackground ||
          categoria.videoBanner ||
          categoria.imagenBanner ||
          categoria.imagenCover) && (
          <div className="absolute inset-0">
            {heroBackground ? (
              <motion.img
                key={heroBackground}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={heroBackground}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : categoria.usarVideoBanner && categoria.videoBanner ? (
              <video
                src={categoria.videoBanner}
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  transform: `translate(${parsePosition(categoria.videoBannerPosition).x}%, ${parsePosition(categoria.videoBannerPosition).y}%) scale(${categoria.videoBannerScale || 1.0})`,
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                }}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={categoria.imagenBanner || categoria.imagenCover || ''}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
            {/* Overlay sólido (sin gradient) */}
            <div className="absolute inset-0 bg-slate-950/60" />
          </div>
        )}

        {/* Contenido del hero */}
        <div className="relative z-10 h-full flex flex-col py-6">
          <div className="flex-shrink-0 px-4 sm:px-6 lg:px-12">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <ol className="flex items-center gap-2 text-xs text-white/50 font-lato uppercase tracking-[0.15em]">
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
                <li className="text-white/80">{categoria.nombre}</li>
              </ol>
            </motion.nav>

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-3"
            >
              Categoría
            </motion.p>

            {/* Título + botones brochure */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-6 mb-6 lg:mb-8 mobile-landscape-header-section">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase text-white leading-[0.95] mobile-landscape-title"
              >
                {categoria.nombre}
              </motion.h1>

              {brochure && brochure.publicado && brochure.activo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex gap-2 mobile-landscape-brochure-buttons"
                >
                  <Link
                    href={`/brochure/${brochure.urlAmigable}`}
                    className="group inline-flex items-center gap-2 px-4 py-2 border border-white/30 text-white font-lato font-bold text-xs uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
                  >
                    <BookOpen className="w-4 h-4" />
                    Brochure
                  </Link>

                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    className="group inline-flex items-center gap-2 px-4 py-2 border border-white/30 text-white font-lato font-bold text-xs uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileBadge className="w-4 h-4" />
                    {downloadingPDF ? '...' : 'PDF'}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Stats strip inline (si hay estadisticas) */}
            {(toneladas || proyectosCompletados || anios) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="hidden lg:grid grid-cols-3 gap-6 md:divide-x md:divide-white/10 border-y border-white/10 py-5 max-w-3xl"
              >
                {toneladas && (
                  <div className="md:pl-6 first:md:pl-0">
                    <div className="font-bebas text-4xl md:text-5xl leading-none text-white">
                      {toneladas.toLocaleString('es-CO')}
                      <span className="text-white/40 text-2xl md:text-3xl ml-1">
                        ton
                      </span>
                    </div>
                    <p className="mt-2 text-white/50 font-lato text-[10px] uppercase tracking-[0.2em]">
                      Acero fabricado
                    </p>
                  </div>
                )}
                {proyectosCompletados && (
                  <div className="md:pl-6">
                    <div className="font-bebas text-4xl md:text-5xl leading-none text-white">
                      {proyectosCompletados}
                      <span className="text-white/40 text-2xl md:text-3xl ml-1">
                        +
                      </span>
                    </div>
                    <p className="mt-2 text-white/50 font-lato text-[10px] uppercase tracking-[0.2em]">
                      Proyectos entregados
                    </p>
                  </div>
                )}
                {anios && (
                  <div className="md:pl-6">
                    <div className="font-bebas text-4xl md:text-5xl leading-none text-white">
                      {anios}
                      <span className="text-white/40 text-2xl md:text-3xl ml-1">
                        años
                      </span>
                    </div>
                    <p className="mt-2 text-white/50 font-lato text-[10px] uppercase tracking-[0.2em]">
                      De experiencia
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Tabs de especialidades (full-width) */}
          {categoria.especialidades && categoria.especialidades.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex-1 w-full min-h-0 mt-6"
            >
              <EspecialidadesTabs
                especialidades={categoria.especialidades}
                color={categoria.color || '#ffffff'}
                onEspecialidadChange={handleEspecialidadChange}
              />
            </motion.div>
          )}

          {/* Indicador scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 mt-4 mb-2 mobile-landscape-scroll-indicator"
          >
            <span className="text-white/40 font-lato text-[11px] uppercase tracking-[0.2em]">
              Ver proyectos
            </span>
            <ChevronDown className="w-4 h-4 text-white/40 scroll-chevron animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* PROYECTOS — empty state */}
      {proyectos.length === 0 && (
        <section className="bg-slate-950 border-t border-white/10">
          <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-xl"
            >
              <div className="w-24 h-24 mx-auto mb-6 opacity-40">
                {getCategoryIconComponent(
                  categoria.icono,
                  'w-24 h-24 text-white',
                )}
              </div>
              <p className="text-white/40 font-lato font-bold text-xs uppercase tracking-[0.2em] mb-3">
                Sin resultados
              </p>
              <h3 className="text-3xl md:text-4xl font-bebas uppercase text-white mb-3 leading-[0.95]">
                No hay proyectos
                <br />
                <span className="text-white/40">en esta categoría</span>
              </h3>
              <p className="text-white/60 font-lato text-base mb-8 leading-relaxed">
                Actualmente no hay proyectos publicados en {categoria.nombre}.
                Explora otras categorías o contáctanos para una cotización
                personalizada.
              </p>
              <Link
                href="/proyectos"
                className="group inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-lato font-bold text-sm uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Ver todas las categorías
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* PROYECTOS — header editorial antes del grid */}
      {proyectosConImagenesOrdenados.length > 0 && (
        <section className="bg-slate-950 border-t border-white/10 pt-20 md:pt-24 pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                {proyectos.length}{' '}
                {proyectos.length === 1 ? 'Proyecto' : 'Proyectos'} entregados
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white">
                Nuestros
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
                trabajos.
              </h3>
              {categoria.descripcion && (
                <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
                  {categoria.descripcion}
                </p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* PROYECTOS — grid 3×2 coherente con home */}
      {proyectosConImagenesOrdenados.length > 0 && (
        <section className="bg-slate-950">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mobile-landscape-projects-grid">
            {proyectosConImagenesOrdenados.map((proyecto, index) => {
              const esDestacado = proyectosDestacadosIds.includes(proyecto.id)

              return (
                <Link
                  key={proyecto.id}
                  href={`/proyectos/detalle/${proyecto.slug}`}
                  className="group block"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: (index % 6) * 0.08 }}
                    viewport={{ once: true, margin: '-50px' }}
                    className="relative h-[50vh] lg:h-[55vh] overflow-hidden mobile-landscape-project-card"
                  >
                    {/* Imagen de fondo */}
                    <div className="absolute inset-0">
                      <Image
                        src={
                          proyecto.imagenes[0].urlOptimized ||
                          proyecto.imagenes[0].url
                        }
                        alt={proyecto.imagenes[0].alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* Overlay sólido */}
                    <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/35 transition-colors duration-500" />

                    {/* Contenido */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 text-left">
                      {esDestacado && (
                        <p className="text-red-500 font-lato font-bold text-[10px] uppercase tracking-[0.25em] mb-2">
                          Destacado
                        </p>
                      )}

                      <p
                        className="text-white/70 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2"
                        style={{
                          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                        }}
                      >
                        {proyecto.ubicacion}
                      </p>

                      <h3
                        className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bebas uppercase text-white leading-[0.95]"
                        style={{
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        }}
                      >
                        {proyecto.titulo}
                      </h3>

                      <div className="flex items-center justify-between mt-4">
                        {proyecto.toneladas ? (
                          <p
                            className="text-white/60 font-lato text-sm"
                            style={{
                              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                            }}
                          >
                            {Math.round(proyecto.toneladas).toLocaleString(
                              'es-CO',
                            )}{' '}
                            ton
                          </p>
                        ) : (
                          <span />
                        )}

                        <span className="inline-flex items-center gap-2 text-white font-lato font-bold text-xs uppercase tracking-wider">
                          <span className="relative">
                            Ver proyecto
                            <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white/40 transition-colors duration-300 group-hover:bg-white" />
                          </span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* PROYECTOS sin imagen — lista compacta dark */}
      {proyectosSinImagenes.length > 0 && (
        <section className="bg-slate-950 border-t border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mb-12 md:mb-16"
            >
              <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Más entregados
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white">
                Otros
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
                proyectos.
              </h3>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="columns-1 md:columns-2 gap-x-16 gap-y-8"
              style={{ columnFill: 'balance' }}
            >
              {proyectosSinImagenes.map((proyecto, index) => (
                <motion.li
                  key={proyecto.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  viewport={{ once: true }}
                  className="break-inside-avoid mb-8 border-l-2 border-red-600 pl-5"
                >
                  <div className="text-white font-bebas uppercase text-2xl md:text-3xl leading-[0.95]">
                    {proyecto.titulo}
                  </div>
                  <div className="text-white/60 font-lato text-sm mt-1">
                    {proyecto.ubicacion}
                  </div>
                  {proyecto.toneladas && (
                    <div className="text-white/40 font-lato text-xs uppercase tracking-wider mt-1">
                      {proyecto.toneladas.toLocaleString('es-CO')} ton
                    </div>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>
      )}

      {/* CTA FINAL — Dark brutalist */}
      <section className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mb-10 md:mb-12"
          >
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              ¿Tu proyecto aquí?
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white">
              Hablemos
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              de tu obra.
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Cotización personalizada para proyectos de{' '}
              {categoria.nombre.toLowerCase()}. Respuesta en menos de 48 horas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
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
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              Otras categorías
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

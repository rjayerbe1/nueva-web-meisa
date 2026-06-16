// Template compartido para las guías técnicas SEO standalone
// (/estructura-metalica-vs-concreto, /tipos-de-estructuras-metalicas,
// /peso-estructura-metalica-por-m2). Replica el patrón visual de
// /precios-estructuras-metalicas: hero full-bleed dark + cuerpo light
// editorial brutalist (skill meisa-web-design).
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Plus } from 'lucide-react'
import type { CategoriaEnum } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/JsonLdSchema'
import { OtrasGuias } from '@/components/guias/OtrasGuias'

export const SITE_URL = 'https://meisa.com.co'
export const FALLBACK_HERO =
  'https://storage.googleapis.com/meisa-imagenes/site/hero/hero-construccion-industrial.jpg'

export interface GuiaSeccionItem {
  nombre: string
  descripcion: string
  /** Imagen subida que se muestra centrada y de altura contenida (tipos). Tiene prioridad. */
  ilustracion?: string
  /** URL de imagen a sangre para el tile. */
  imagen?: string
  /** Categoría cuya imagenCover se usa como imagen a sangre del tile (si no hay `imagen`). */
  categoria?: string
}

export interface GuiaSeccion {
  titulo: string
  parrafos: string[]
  items?: GuiaSeccionItem[]
}

export interface GuiaPasoProceso {
  titulo: string
  descripcion: string
}

export interface GuiaFaqItem {
  pregunta: string
  respuesta: string
}

export interface GuiaStat {
  valor: string
  sufijo?: string
  label: string
}

export interface GuiaRelacionado {
  href: string
  eyebrow: string
  titulo: string
  descripcion: string
}

export interface GuiaConfig {
  /** Path canónico, ej. '/estructura-metalica-vs-concreto'. */
  path: string
  /** Nombre legible para breadcrumb. */
  breadcrumbName: string
  heroEyebrow: string
  heroTitulo1: string
  heroTitulo2: string
  heroSub: string
  /** Eyebrow de la intro, ej. '01 — La guía'. */
  introEyebrow: string
  introTitulo1: string
  introTitulo2: string
  intro: string
  /** Categoría cuya imagenCover se usa como hero (fallback). */
  categoriaHero: CategoriaEnum
  /** Imagen de portada del hero. Si no se define, se usa imagenCover de categoriaHero. */
  heroImagen?: string
  stats: GuiaStat[]
  secciones: GuiaSeccion[]
  proceso?: GuiaPasoProceso[]
  procesoTitulo1?: string
  procesoTitulo2?: string
  /** Slugs de proyectos insignia (orden curado) — se resuelven contra la DB. */
  proyectosSlugs: string[]
  proyectosIntro: string
  faq: GuiaFaqItem[]
  faqTitulo1: string
  faqTitulo2: string
  relacionados: GuiaRelacionado[]
  ctaEyebrow: string
  ctaTitulo1: string
  ctaTitulo2: string
  ctaDescripcion: string
}

export default async function GuiaTemplate({ config }: { config: GuiaConfig }) {
  let heroImagen = config.heroImagen || FALLBACK_HERO
  // Cover por categoría, para los tiles "por uso" que declaran `categoria`.
  const coverPorCategoria = new Map<string, string>()
  let proyectos: Array<{
    id: string
    titulo: string
    slug: string
    ubicacion: string
    toneladas: unknown
    imagenes: Array<{ url: string; urlOptimized: string | null; alt: string | null }>
  }> = []

  try {
    const [categoria, proyectosDb, categoriasCovers] = await Promise.all([
      prisma.categoriaProyecto.findUnique({
        where: { key: config.categoriaHero },
        select: { imagenCover: true },
      }),
      prisma.proyecto.findMany({
        where: { slug: { in: config.proyectosSlugs }, visible: true },
        select: {
          id: true,
          titulo: true,
          slug: true,
          ubicacion: true,
          toneladas: true,
          imagenes: {
            orderBy: { orden: 'asc' },
            take: 1,
            select: { url: true, urlOptimized: true, alt: true },
          },
        },
      }),
      prisma.categoriaProyecto.findMany({
        select: { key: true, imagenCover: true },
      }),
    ])
    if (!config.heroImagen && categoria?.imagenCover) heroImagen = categoria.imagenCover
    for (const c of categoriasCovers) {
      if (c.imagenCover) coverPorCategoria.set(c.key, c.imagenCover)
    }
    // Preservar el orden curado del config
    proyectos = config.proyectosSlugs
      .map((slug) => proyectosDb.find((p) => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
  } catch {
    // fallback estático sin proyectos
  }

  // Image break después de la segunda sección (ritmo visual obligatorio)
  const breakAfterIndex = config.secciones.length > 2 ? 1 : 0

  return (
    <main className="bg-stone-50 text-slate-950">
      {/* JSON-LD */}
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: config.breadcrumbName, url: `${SITE_URL}${config.path}` },
        ]}
      />
      <FAQSchema items={config.faq} />

      {/* Hero full-bleed oscuro */}
      <section className="relative h-screen md:h-[85vh] overflow-hidden bg-slate-950">
        <Image
          src={heroImagen}
          alt={config.breadcrumbName}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-950/60" />
        <div className="relative z-10 h-full flex items-end pb-16 md:pb-24 px-4 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl w-full">
            <div className="max-w-5xl">
              <p className="text-white/60 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                {config.heroEyebrow}
              </p>
              <h1 className="font-bebas uppercase leading-[0.95]">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
                  {config.heroTitulo1}
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white/50">
                  {config.heroTitulo2}
                </span>
              </h1>
              <p className="mt-8 text-white/80 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
                {config.heroSub}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro editorial — Patrón A */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                {config.introEyebrow}
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                {config.introTitulo1}
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                {config.introTitulo2}
              </h3>
            </div>
            <div className="lg:col-span-7 lg:pt-6">
              <p
                className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                lang="es"
              >
                {config.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="border-y border-slate-200 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 md:divide-x md:divide-slate-200">
            {config.stats.map((stat, i) => (
              <div key={stat.label} className={i > 0 ? 'md:pl-6' : ''}>
                <div className="font-bebas text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight text-slate-950">
                  {stat.valor}
                  {stat.sufijo && (
                    <span className="text-slate-300">{stat.sufijo}</span>
                  )}
                </div>
                <p className="mt-2 text-slate-500 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secciones de contenido */}
      {config.secciones.map((seccion, idx) => (
        <div key={seccion.titulo}>
          <section className="pb-20 md:pb-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
              {seccion.items && seccion.items.length > 0 ? (
                <>
                  {/* Header full-width + tiles numerados */}
                  <div className="mb-10 md:mb-14 max-w-4xl">
                    <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                      {String(idx + 2).padStart(2, '0')}
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950">
                      {seccion.titulo}
                    </h2>
                    <div className="mt-6 space-y-5">
                      {seccion.parrafos.map((parrafo) => (
                        <p
                          key={parrafo.slice(0, 40)}
                          className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                          lang="es"
                        >
                          {parrafo}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
                    {seccion.items.map((item, i) => {
                      const numero = String(i + 1).padStart(2, '0')
                      const ilustracion = item.ilustracion
                      const fotoSangre =
                        !ilustracion &&
                        (item.imagen ||
                          (item.categoria
                            ? coverPorCategoria.get(item.categoria)
                            : undefined))

                      // Foto a sangre (tipos "por uso" → cover de categoría)
                      if (fotoSangre) {
                        return (
                          <div
                            key={item.nombre}
                            className="group bg-white flex flex-col"
                          >
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <Image
                                src={fotoSangre}
                                alt={item.nombre}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                              />
                            </div>
                            <div className="p-8 md:p-10">
                              <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-slate-300 font-bebas text-4xl md:text-5xl leading-none">
                                  {numero}
                                </span>
                                <h3 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-slate-950">
                                  {item.nombre}
                                </h3>
                              </div>
                              <p className="text-slate-700 font-lato text-sm md:text-base leading-relaxed">
                                {item.descripcion}
                              </p>
                            </div>
                          </div>
                        )
                      }

                      // Ilustración centrada (sistemas, perfiles, conexiones) o solo texto
                      return (
                        <div key={item.nombre} className="bg-white p-8 md:p-10">
                          {ilustracion && (
                            <div className="relative mb-6 h-28 md:h-32">
                              <Image
                                src={ilustracion}
                                alt={item.nombre}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-contain object-center"
                              />
                            </div>
                          )}
                          <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-slate-300 font-bebas text-4xl md:text-5xl leading-none">
                              {numero}
                            </span>
                            <h3 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-slate-950">
                              {item.nombre}
                            </h3>
                          </div>
                          <p className="text-slate-700 font-lato text-sm md:text-base leading-relaxed">
                            {item.descripcion}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                /* Patrón A: título 5/12 + texto 7/12 */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                  <div className="lg:col-span-5">
                    <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                      {String(idx + 2).padStart(2, '0')}
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950">
                      {seccion.titulo}
                    </h2>
                  </div>
                  <div className="lg:col-span-7 lg:pt-6 space-y-5">
                    {seccion.parrafos.map((parrafo) => (
                      <p
                        key={parrafo.slice(0, 40)}
                        className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                        lang="es"
                      >
                        {parrafo}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Image break para ritmo visual */}
          {idx === breakAfterIndex && (
            <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden mb-20 md:mb-28">
              <Image
                src={heroImagen}
                alt="Estructuras metálicas fabricadas y montadas por MEISA"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-50/20 to-transparent" />
            </div>
          )}
        </div>
      ))}

      {/* Proceso — 4 pasos numerados */}
      {config.proceso && config.proceso.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="mb-12 md:mb-16 max-w-4xl">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Proceso
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                {config.procesoTitulo1 ?? 'Cómo trabajamos'}
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                {config.procesoTitulo2 ?? 'del modelo al acero'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
              {config.proceso.map((paso, i) => (
                <div key={paso.titulo} className="bg-stone-50 p-8 md:p-10">
                  <span className="block text-slate-300 font-bebas text-5xl md:text-6xl leading-none mb-5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-slate-950 mb-3">
                    {paso.titulo}
                  </h3>
                  <p className="text-slate-700 font-lato text-sm leading-relaxed">
                    {paso.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Proyectos que nos respaldan */}
      {proyectos.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 md:mb-16">
              <div className="lg:col-span-5">
                <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                  Obra entregada
                </p>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                  Proyectos que
                </h2>
                <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                  nos respaldan
                </h3>
              </div>
              <div className="lg:col-span-7 lg:pt-6">
                <p
                  className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                  lang="es"
                >
                  {config.proyectosIntro}
                </p>
              </div>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                proyectos.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
              } gap-px bg-slate-200 border border-slate-200`}
            >
              {proyectos.map((proyecto) => {
                const imagen = proyecto.imagenes[0]
                const imagenUrl = imagen?.urlOptimized || imagen?.url
                const toneladas = proyecto.toneladas
                  ? Math.round(Number(proyecto.toneladas))
                  : null
                return (
                  <Link
                    key={proyecto.id}
                    href={`/proyectos/detalle/${proyecto.slug}`}
                    className="group bg-white flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      {imagenUrl ? (
                        <Image
                          src={imagenUrl}
                          alt={imagen?.alt || proyecto.titulo}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-950 flex items-end p-4">
                          <span className="font-bebas text-white/20 text-5xl uppercase leading-none">
                            MEISA
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      {toneladas !== null && (
                        <p className="font-bebas text-3xl md:text-4xl text-slate-950 leading-none mb-2">
                          {toneladas.toLocaleString('es-CO')}
                          <span className="text-slate-300 text-2xl md:text-3xl">
                            {' '}
                            ton
                          </span>
                        </p>
                      )}
                      <h3 className="font-lato font-bold text-slate-950 text-sm md:text-base leading-snug mb-2">
                        {proyecto.titulo}
                      </h3>
                      <p className="mt-auto text-slate-500 font-lato text-xs flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {proyecto.ubicacion}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-10">
              <Link
                href="/proyectos"
                className="group inline-flex items-center gap-3 text-slate-950 font-lato font-bold text-base md:text-lg"
              >
                <span className="relative">
                  Ver todos los proyectos de MEISA
                  <span className="absolute left-0 -bottom-0.5 h-px w-full bg-slate-300 transition-colors duration-300 group-hover:bg-slate-950" />
                </span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ — acordeón details/summary */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-12 md:mb-16 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Preguntas frecuentes
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              {config.faqTitulo1}
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              {config.faqTitulo2}
            </h3>
          </div>
          <div className="border-t border-slate-200">
            {config.faq.map((item) => (
              <details key={item.pregunta} className="group border-b border-slate-200">
                <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-lato font-bold text-slate-950 text-base md:text-lg leading-snug">
                    {item.pregunta}
                  </h3>
                  <Plus className="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p
                  className="pb-6 md:pr-12 text-slate-700 font-lato text-sm md:text-base leading-relaxed text-pretty hyphens-auto"
                  lang="es"
                >
                  {item.respuesta}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Guías y soluciones relacionadas — cross-links */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-10 md:mb-12 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Siga explorando
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950">
              Soluciones relacionadas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
            {config.relacionados.map((rel) => (
              <Link
                key={rel.href}
                href={rel.href}
                className="group bg-white p-8 md:p-10 flex flex-col"
              >
                <p className="text-slate-400 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3">
                  {rel.eyebrow}
                </p>
                <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-slate-950 mb-3">
                  {rel.titulo}
                </h3>
                <p className="text-slate-600 font-lato text-sm md:text-base leading-relaxed mb-6">
                  {rel.descripcion}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-slate-950 font-lato font-bold text-sm uppercase tracking-wider">
                  Ver más
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Otras guías técnicas — cross-links del clúster */}
      <OtrasGuias currentPath={config.path} />

      {/* CTA final — Patrón E dark */}
      <section className="relative bg-slate-950 text-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mb-12 md:mb-16">
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              {config.ctaEyebrow}
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
              {config.ctaTitulo1}
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              {config.ctaTitulo2}
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              {config.ctaDescripcion}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              href="/contacto"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700"
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
          </div>
        </div>
      </section>
    </main>
  )
}
